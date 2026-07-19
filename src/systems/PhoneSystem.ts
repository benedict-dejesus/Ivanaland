import { Container, Graphics } from 'pixi.js';
import type { DistrictId, PhoneDef } from '../data/types';
import { PHONES } from '../data/phones';
import { PAL } from '../data/palette';
import { phoneSprite } from '../world/props';
import { hostViewFor } from './hostArt';
import type { InteractionSystem } from './InteractionSystem';
import type { FX } from './FX';
import type { GameAudio } from '../core/Audio';
import type { SaveManager } from '../core/SaveManager';
import type { EventBus } from '../core/events';
import type { Animator } from '../world/Animator';

/** camo tints per district so hidden phones blend with their surroundings */
const CAMO_TINT: Record<DistrictId, number> = {
  studio: 0xd9b44a, village: 0x8fbf6a, market: 0xd97a6a, beauty: 0xb886c9,
  pets: 0x94b96e, terminal: 0x8fb6d9, resort: 0xd9c690, festival: 0xc9a0d9,
  charity: 0x7cc9ae, island: 0x6aa96e,
};

/** custom step offsets for signature sequences (relative to phone position) */
const SEQ_OFFSETS: Record<number, [number, number][]> = {
  10: [[0, -55], [0, -220], [0, 40]],           // Vlog Tower: screen, antenna, door
  50: [[0, 0], [0, 0], [0, 0]],                 // Parrot Pol ×3
  60: [[0, -70], [0, -70], [0, -70]],           // Departure board ×3 (bench below reveals)
  65: [[0, 20], [0, -110], [34, 24]],           // Lighthouse: door, lamp, mat
  82: [[0, 0], [0, 0]],                          // Chest: open, false bottom
  100: [[-64, -184], [0, 12], [0, -256]],        // Statue: torch, plaque, crown
};

/** where the phone pops out at the end of a sequence (relative) */
const SEQ_REVEAL: Record<number, [number, number]> = {
  10: [0, 40], 50: [0, 14], 60: [0, 0], 65: [0, 20], 82: [0, -20], 100: [0, -256],
};

/** moving hosts: small pause-heavy patrol loops (docs 08 §4.3) */
const PATROLS: Record<number, { pts: [number, number][]; speed: number; pause: number }> = {
  7: { pts: [[0, 0], [90, -30], [140, 20], [60, 50]], speed: 55, pause: 3.2 },
  39: { pts: [[0, 0], [70, 26], [-40, 44]], speed: 40, pause: 3.5 },
  51: { pts: [[0, 0], [110, 0], [110, 56], [0, 56]], speed: 60, pause: 4 },
  86: { pts: [[0, 0], [150, 60]], speed: 70, pause: 4 },
  93: { pts: [[0, 0], [0, -120]], speed: 45, pause: 4.5 },
};

interface LivePhone {
  def: PhoneDef;
  root: Container;
  glintAt: number;
  found: boolean;
}

export class PhoneSystem {
  private live = new Map<number, LivePhone>();
  found = new Set<number>();

  constructor(
    private layers: Map<DistrictId, Container>,
    private interactions: InteractionSystem,
    private fx: FX,
    private audio: GameAudio,
    private save: SaveManager,
    private bus: EventBus,
    private animator: Animator,
  ) {
    for (const id of save.data.foundPhones) this.found.add(id);
  }

  spawnAll(): void {
    for (const p of PHONES) this.spawn(p);
  }

  worldPos(id: number): { x: number; y: number } {
    const lp = this.live.get(id);
    if (lp) return { x: lp.root.x, y: lp.root.y };
    const def = PHONES.find((q) => q.id === id)!;
    return { x: def.x, y: def.y };
  }

  private layer(d: DistrictId): Container {
    return this.layers.get(d)!;
  }

  private spawn(p: PhoneDef): void {
    const root = new Container();
    root.position.set(p.x, p.y);
    this.layer(p.district).addChild(root);
    const lp: LivePhone = {
      def: p, root, found: this.found.has(p.id),
      glintAt: performance.now() / 1000 + 4 + Math.random() * 16,
    };
    this.live.set(p.id, lp);

    if (lp.found) {
      this.addFoundBadge(root);
      return;
    }

    const patrol = PATROLS[p.id];
    if (patrol) {
      this.animator.addPatrol(p.district, root, {
        points: patrol.pts.map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy })),
        speed: patrol.speed,
        pause: patrol.pause,
        flip: false,
      });
    }

    switch (p.method) {
      case 'tap': this.spawnTap(lp); break;
      case 'container': this.spawnContainer(lp); break;
      case 'reveal': this.spawnReveal(lp); break;
      case 'sequence': this.spawnSequence(lp); break;
    }
  }

  /* ---------------- tap (visible / camo / partial / reflection) ---------------- */

  private spawnTap(lp: LivePhone): void {
    const p = lp.def;
    const holder = new Container();
    lp.root.addChild(holder);

    let sprite: Container;
    if (p.category === 'camouflaged') {
      sprite = phoneSprite(1.2, CAMO_TINT[p.district]);
      const glow = (sprite as Container & { glow?: Graphics }).glow;
      if (glow) glow.alpha = 0.25;
      sprite.rotation = (Math.random() - 0.5) * 0.5;
      sprite.alpha = 0.92;
    } else if (p.category === 'partial') {
      sprite = phoneSprite(1.2);
      sprite.rotation = 0.8;
      const cover = new Graphics();
      cover.roundRect(-24, -18, 48, 30, 9).fill(this.coverColor(p.district));
      cover.position.set(4, 8);
      holder.addChild(sprite, cover);
    } else if (p.category === 'reflection') {
      sprite = phoneSprite(1.15);
      sprite.rotation = 0.5;
      // the "reflection": a flipped ghost nearby that shimmers when tapped
      const ghost = phoneSprite(1.15);
      ghost.scale.y = -1.15;
      ghost.alpha = 0.32;
      ghost.position.set(14, 52);
      holder.addChild(ghost);
      this.interactions.register({
        id: `ghost-${p.id}`, x: p.x + 14, y: p.y + 52, r: 26, priority: 6, enabled: true,
        onTap: (x, y) => {
          this.fx.ring(x, y, PAL.waterFoam, 40, 0.5);
          this.audio.plink(1.4);
          this.bus.emit('delight', { x, y });
        },
      });
    } else {
      sprite = phoneSprite(1.3);
      this.animator.add(p.district, sprite, { kind: 'bob', amp: 2.5, period: 2.6 });
    }
    if (p.category !== 'partial') holder.addChild(sprite);
    if (p.category === 'partial') holder.setChildIndex(sprite, 0);

    this.interactions.register({
      id: `phone-${p.id}`, x: p.x, y: p.y, r: 32, priority: 10, enabled: true,
      getPos: PATROLS[p.id] ? () => ({ x: lp.root.x, y: lp.root.y }) : undefined,
      onTap: () => this.discover(lp),
    });
  }

  private coverColor(d: DistrictId): number {
    switch (d) {
      case 'resort': return PAL.sandDark;
      case 'island': return PAL.jungleDark;
      case 'terminal': return 0x8d8598;
      default: return PAL.wood;
    }
  }

  /* ---------------- container ---------------- */

  private spawnContainer(lp: LivePhone): void {
    const p = lp.def;
    const view = hostViewFor(p);
    const phone = phoneSprite(1.1);
    phone.visible = false;
    phone.position.set(0, -40);
    lp.root.addChild(view.node, phone);

    let open = false;
    let closeTimer = 0;

    const phoneTap = this.interactions.register({
      id: `phone-${p.id}`, x: p.x, y: p.y - 40, r: 30, priority: 10, enabled: false,
      getPos: () => ({ x: lp.root.x, y: lp.root.y - 40 }),
      onTap: () => {
        window.clearTimeout(closeTimer);
        this.discover(lp);
      },
    });

    this.interactions.register({
      id: `host-${p.id}`, x: p.x, y: p.y, r: 34, priority: 8, enabled: true,
      getPos: PATROLS[p.id] ? () => ({ x: lp.root.x, y: lp.root.y }) : undefined,
      onTap: (x, y) => {
        if (lp.found) return;
        if (!open) {
          open = true;
          view.open();
          phone.visible = true;
          phoneTap.enabled = true;
          this.fx.sparkle(x, y - 30, PAL.sun, 7);
          this.audio.reveal();
          this.bus.emit('delight', { x, y });
          closeTimer = window.setTimeout(() => {
            if (lp.found) return;
            open = false;
            view.close();
            phone.visible = false;
            phoneTap.enabled = false;
          }, 6000);
        }
      },
    });
  }

  /* ---------------- reveal ---------------- */

  private spawnReveal(lp: LivePhone): void {
    const p = lp.def;
    const view = hostViewFor(p);
    const phone = phoneSprite(1.15);
    phone.visible = false;
    phone.position.set(30, -26);
    lp.root.addChild(view.node, phone);

    let revealed = false;
    this.interactions.register({
      id: `host-${p.id}`, x: p.x, y: p.y, r: 34, priority: 8, enabled: true,
      onTap: (x, y) => {
        if (lp.found || revealed) return;
        revealed = true;
        view.open();
        window.setTimeout(() => view.close(), 700);
        this.fx.sparkle(x, y - 20, PAL.phoneGlow, 10);
        this.fx.ring(p.x + 30, p.y - 26, PAL.phoneGlow, 46, 0.6);
        this.audio.reveal();
        this.bus.emit('delight', { x, y });
        phone.visible = true;
        phone.scale.set(0.2);
        this.popIn(phone, 1.15);
        this.interactions.register({
          id: `phone-${p.id}`, x: p.x + 30, y: p.y - 26, r: 30, priority: 10, enabled: true,
          onTap: () => this.discover(lp),
        });
      },
    });
  }

  /* ---------------- sequence ---------------- */

  private spawnSequence(lp: LivePhone): void {
    const p = lp.def;
    const steps = p.seqSteps ?? 3;
    const offsets = SEQ_OFFSETS[p.id] ?? Array.from({ length: steps }, (_, i) => [0, -i * 46] as [number, number]);
    const revealOff = SEQ_REVEAL[p.id] ?? [0, -20];
    let progress = 0;

    const markers: Graphics[] = [];
    for (let i = 0; i < steps; i++) {
      const [dx, dy] = offsets[i] ?? [0, 0];
      const m = new Graphics();
      m.circle(0, 0, 13).fill({ color: PAL.phoneGlow, alpha: 0.22 });
      m.circle(0, 0, 5).fill({ color: PAL.white, alpha: 0.35 });
      m.position.set(dx, dy);
      m.visible = i === 0;
      lp.root.addChild(m);
      markers.push(m);
      this.animator.add(p.district, m, { kind: 'pulse', amp: 0.22, period: 1.6 });

      const idx = i;
      const tap = this.interactions.register({
        id: `seq-${p.id}-${i}`, x: p.x + dx, y: p.y + dy, r: 30, priority: 9, enabled: true,
        onTap: (x, y) => {
          if (lp.found || idx !== progress) return;
          progress++;
          tap.enabled = false;
          this.audio.step(progress);
          this.fx.ring(x, y, PAL.sun, 40 + progress * 14, 0.55);
          this.fx.sparkle(x, y, PAL.sun, 6 + progress * 3);
          this.bus.emit('delight', { x, y });
          markers[idx]!.visible = false;
          if (progress < steps) {
            markers[progress]!.visible = true;
          } else {
            this.completeSequence(lp, revealOff);
          }
        },
      });
    }
  }

  private completeSequence(lp: LivePhone, revealOff: [number, number]): void {
    const p = lp.def;
    const phone = phoneSprite(p.id === 100 ? 1.6 : 1.2);
    phone.position.set(revealOff[0], revealOff[1]);
    phone.scale.set(0.1);
    lp.root.addChild(phone);
    this.popIn(phone, p.id === 100 ? 1.6 : 1.2);
    this.fx.ring(p.x + revealOff[0], p.y + revealOff[1], PAL.sun, 90, 0.9);
    this.fx.confetti(p.x + revealOff[0], p.y + revealOff[1], p.id === 100 ? 60 : 18, 240);
    this.audio.chime();
    this.interactions.register({
      id: `phone-${p.id}`, x: p.x + revealOff[0], y: p.y + revealOff[1], r: 34, priority: 10, enabled: true,
      onTap: () => this.discover(lp),
    });
  }

  /* ---------------- discovery ---------------- */

  private discover(lp: LivePhone): void {
    if (lp.found) return;
    lp.found = true;
    const p = lp.def;
    this.found.add(p.id);
    this.save.data.foundPhones.push(p.id);
    this.save.markDirty();

    // celebrate — the best moment in the game loop
    const pos = { x: lp.root.x, y: lp.root.y };
    const big = p.tier >= 5;
    this.audio.discovery();
    if (big) this.audio.fanfare();
    this.fx.discoveryBurst(pos.x, pos.y - 20, big);
    // the found phone rises triumphantly, spins once, and ascends away
    const risen = phoneSprite(big ? 1.9 : 1.45);
    risen.position.set(pos.x, pos.y - 14);
    this.fx.layer.addChild(risen);
    this.riseAway(risen, big);

    // clean interactions
    for (const prefix of ['phone', 'host', 'ghost']) this.interactions.remove(`${prefix}-${p.id}`);
    for (let i = 0; i < 5; i++) this.interactions.remove(`seq-${p.id}-${i}`);

    // swap art for a found badge
    lp.root.removeChildren().forEach((c) => c.destroy({ children: true }));
    this.addFoundBadge(lp.root);

    this.bus.emit('found', { id: p.id });
    this.save.flush();
  }

  private addFoundBadge(root: Container): void {
    const b = new Graphics();
    b.circle(0, -10, 12).fill({ color: PAL.mint, alpha: 0.85 });
    b.moveTo(-5, -10).lineTo(-1.5, -6).lineTo(5.5, -15).stroke({ width: 3.5, color: PAL.cream, cap: 'round' });
    root.addChild(b);
  }

  /** springy pop, hold, spin, rise and fade — the discovery hero animation */
  private riseAway(node: Container, big: boolean): void {
    const start = performance.now();
    const dur = big ? 2100 : 1500;
    const startY = node.y;
    const baseScale = node.scale.x;
    const step = (): void => {
      const t = Math.min(1, (performance.now() - start) / dur);
      // phase 1 (0–0.25): spring-scale up with overshoot
      // phase 2 (0.25–1): rise, gentle spin, fade out
      if (t < 0.25) {
        const f = t / 0.25;
        const e = 1 + 2.7 * Math.pow(f - 1, 3) + 1.7 * Math.pow(f - 1, 2);
        node.scale.set(baseScale * (0.4 + 0.8 * Math.max(0.05, e)));
      } else {
        const f = (t - 0.25) / 0.75;
        node.y = startY - f * (big ? 150 : 100);
        node.rotation = Math.sin(f * Math.PI * 2) * 0.35;
        node.alpha = 1 - f * f;
        node.scale.set(baseScale * (1.2 - f * 0.3));
      }
      if (t < 1) requestAnimationFrame(step);
      else node.destroy({ children: true });
    };
    requestAnimationFrame(step);
  }

  private popIn(node: Container, target: number): void {
    const start = performance.now();
    const dur = 420;
    const step = (): void => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const e = 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2); // back-out
      node.scale.set(Math.max(0.05, target * e));
      if (t < 1) requestAnimationFrame(step);
      else node.scale.set(target);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- glints ---------------- */

  tick(nowSec: number, view: { x: number; y: number; w: number; h: number }): void {
    const nearEnd = this.found.size >= 95;
    const high = this.save.data.settings.glintHigh;
    for (const lp of this.live.values()) {
      if (lp.found) continue;
      if (nowSec < lp.glintAt) continue;
      const x = lp.root.x;
      const y = lp.root.y;
      const base = nearEnd || high ? 7 : 13;
      lp.glintAt = nowSec + base + Math.random() * base * 0.6;
      if (x < view.x || x > view.x + view.w || y < view.y || y > view.y + view.h) continue;
      this.fx.glint(x, y - 24, lp.def.tier >= 4);
    }
  }
}
