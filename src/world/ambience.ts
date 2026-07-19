/**
 * Shared ambience pass applied to every district.
 *
 * Purpose is twofold:
 *  - DISTRACTION: decoy sheets identical to the ones that hide real phones, plus
 *    lots of tappable critters and props. Players must investigate everything,
 *    and every wrong guess still rewards them with a little moment (never a
 *    penalty — see docs/08_HIDING_TAXONOMY anti-frustration rules).
 *  - DENSITY: field designs (mown lawns, flower beds, hedges, paths) that make
 *    the ground look handcrafted instead of flat colour.
 *
 * Performance: every static piece goes into the district's `statics` container,
 * which is baked to a texture and culled, so it costs nothing per frame. Only
 * the small animated critters live in `motion`, and those are culled per
 * district too.
 */
import { Container, Graphics } from 'pixi.js';
import { PAL, seeded } from '../data/palette';
import { GROUND } from '../data/districts';
import { PHONES } from '../data/phones';
import type { BuildCtx } from './context';
import { put } from './util';
import {
  sheet, butterfly, dragonfly, frog, pinwheel, beachBall, kite,
  mownStripes, flowerBed, hedgeRow, steppingStones, picnicBlanket,
  cat, duck, bird, flowerPatch, bush,
} from './props';

/** deterministic seed per district so the world is identical every load */
function seedFor(id: string): number {
  let s = 2166136261;
  for (let i = 0; i < id.length; i++) {
    s ^= id.charCodeAt(i);
    s = Math.imul(s, 16777619);
  }
  return s >>> 0;
}

/** a small surprise to reveal under a decoy sheet */
function surprise(pick: number): Container {
  switch (pick % 6) {
    case 0: return cat(0xd9a986, 22);
    case 1: return duck(16);
    case 2: return frog(18);
    case 3: return beachBall(18);
    case 4: return flowerPatch(30, PAL.berry);
    default: return bush(24, PAL.grassDark);
  }
}

export function addAmbience(ctx: BuildCtx): void {
  const { d, statics, detail, delight, fx, audio, p } = ctx;
  const R = seeded(seedFor(d.id));
  // Detail animations live in their own animator group so they can be switched
  // off entirely when the detail layer is hidden at far zoom. Ticking hidden
  // nodes would still write transforms every frame and churn Pixi's batching,
  // which was more expensive than drawing them.
  const dkey = `${d.id}:detail`;
  const anim = (node: Container, spec: Parameters<typeof ctx.anim>[1]): void => ctx.animator.add(dkey, node, spec);
  const patrolD = (node: Container, spec: Parameters<typeof ctx.patrol>[1]): void => ctx.animator.addPatrol(dkey, node, spec);
  const ground = GROUND[d.id];
  const phonePts = PHONES.filter((q) => q.district === d.id).map((q) => ({ x: q.x, y: q.y }));

  /** keep decoys clear of real phone hosts so they never mask a real target */
  const clearOfPhones = (x: number, y: number, min = 120): boolean =>
    phonePts.every((q) => Math.hypot(q.x - x, q.y - y) > min);

  /* ================= FIELD DESIGNS (static, free) ================= */

  // mown lawn bands
  for (let i = 0; i < 2; i++) {
    const fx1 = 0.14 + R() * 0.7;
    const fy1 = 0.14 + R() * 0.7;
    put(statics, wrap(mownStripes(240 + R() * 160, 150 + R() * 90, ground, 7)), p(fx1, fy1));
  }
  // flower beds
  for (let i = 0; i < 3; i++) {
    put(statics, wrap(flowerBed(90 + R() * 60, 50 + R() * 30)), p(0.1 + R() * 0.8, 0.1 + R() * 0.8));
  }
  // hedge rows
  for (let i = 0; i < 3; i++) {
    const hedge = wrap(hedgeRow(80 + R() * 90, d.id === 'island' ? PAL.jungleDark : PAL.grassDark));
    hedge.rotation = R() < 0.5 ? 0 : Math.PI / 2;
    put(statics, hedge, p(0.1 + R() * 0.8, 0.1 + R() * 0.8));
  }
  // stepping-stone paths
  for (let i = 0; i < 3; i++) {
    const st = wrap(steppingStones(4 + Math.floor(R() * 4), 24));
    st.rotation = R() * Math.PI;
    put(statics, st, p(0.1 + R() * 0.8, 0.1 + R() * 0.8));
  }
  // picnic blankets
  for (let i = 0; i < 2; i++) {
    put(statics, picnicBlanket(60 + R() * 26, R() < 0.5 ? PAL.coral : PAL.berry), p(0.12 + R() * 0.76, 0.12 + R() * 0.76));
  }

  /* ================= DECOY SHEETS (the real distraction) ================= */

  let placed = 0;
  for (let attempt = 0; attempt < 40 && placed < 5; attempt++) {
    const fx1 = 0.1 + R() * 0.8;
    const fy1 = 0.1 + R() * 0.8;
    const pos = p(fx1, fy1);
    if (!clearOfPhones(pos.x, pos.y)) continue;
    placed++;

    const holder = new Container();
    const hidden = surprise(Math.floor(R() * 6));
    hidden.visible = false;
    const cloth = sheet(ground, 40 + R() * 12);
    holder.addChild(hidden, cloth);
    put(detail, holder, pos);

    let open = false;
    let timer = 0;
    delight(pos.x, pos.y, 30, (x, y) => {
      if (open) return;
      open = true;
      cloth.rotation = -0.22;
      cloth.y = -12;
      cloth.alpha = 0.9;
      hidden.visible = true;
      fx.sparkle(x, y - 14, PAL.sun, 6);
      audio.plink(1.1 + R() * 0.7);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        open = false;
        cloth.rotation = 0;
        cloth.y = 0;
        cloth.alpha = 1;
        hidden.visible = false;
      }, 2600);
    });
  }

  /* ================= ANIMATED CRITTERS ================= */

  // butterflies drifting on little loops
  for (let i = 0; i < 3; i++) {
    const col = [PAL.coral, PAL.sun, PAL.berry, 0xffffff][i % 4]!;
    const b = butterfly(col, 12 + R() * 4);
    detail.addChild(b);
    const bx = 0.1 + R() * 0.8;
    const by = 0.1 + R() * 0.8;
    patrolD(b, {
      points: [p(bx, by), p(bx + 0.06, by - 0.05), p(bx + 0.11, by + 0.03), p(bx + 0.03, by + 0.07)],
      speed: 34 + R() * 22,
      pause: 0.5 + R(),
    });
    const wings = (b as Container & { wings?: Container }).wings;
    if (wings) anim(wings, { kind: 'pulse', amp: 0.3, period: 0.35 + R() * 0.2 });
    const bp = p(bx, by);
    delight(bp.x, bp.y, 26, (x, y) => { fx.sparkle(x, y, col, 5); audio.plink(1.8 + R() * 0.5); });
  }

  // dragonflies hovering
  for (let i = 0; i < 2; i++) {
    const dfy = dragonfly(15);
    detail.addChild(dfy);
    const dx = 0.1 + R() * 0.8;
    const dy = 0.1 + R() * 0.8;
    patrolD(dfy, {
      points: [p(dx, dy), p(dx + 0.08, dy + 0.04), p(dx + 0.02, dy + 0.08)],
      speed: 52 + R() * 26,
      pause: 0.7,
    });
    const wings = (dfy as Container & { wings?: Container }).wings;
    if (wings) anim(wings, { kind: 'pulse', amp: 0.35, period: 0.22 });
  }

  // a small bird hopping about
  for (let i = 0; i < 2; i++) {
    const br = bird(i % 2 ? 0xffffff : PAL.sunDark, 14);
    detail.addChild(br);
    const rx = 0.1 + R() * 0.8;
    const ry = 0.1 + R() * 0.8;
    patrolD(br, {
      points: [p(rx, ry), p(rx + 0.05, ry + 0.03), p(rx - 0.03, ry + 0.05)],
      speed: 44 + R() * 20,
      pause: 1.4 + R(),
    });
    const bp = p(rx, ry);
    delight(bp.x, bp.y, 26, (x, y) => { fx.sparkle(x, y, PAL.cream, 6); audio.plink(2.2); });
  }

  /* ================= TAPPABLE PROPS ================= */

  // pinwheel that spins faster when tapped
  {
    const pw = pinwheel(30);
    const pos = p(0.12 + R() * 0.76, 0.12 + R() * 0.76);
    put(detail, pw, pos);
    const spin = (pw as Container & { spin?: Container }).spin;
    if (spin) anim(spin, { kind: 'spin', speed: 1.1 + R() });
    delight(pos.x, pos.y - 26, 30, (x, y) => { fx.sparkle(x, y, PAL.mint, 8); audio.plink(1.5); });
  }

  // a kite bobbing on a string
  {
    const k = kite(32);
    const pos = p(0.12 + R() * 0.76, 0.12 + R() * 0.76);
    put(detail, k, { x: pos.x, y: pos.y - 90 });
    anim(k, { kind: 'sway', amp: 0.16, period: 3 + R() });
    delight(pos.x, pos.y - 90, 34, (x, y) => { fx.sparkle(x, y, PAL.berry, 8); audio.plink(1.3); });
  }

  // a ball that can be nudged
  {
    const ball = beachBall(20);
    const pos = p(0.12 + R() * 0.76, 0.12 + R() * 0.76);
    put(detail, ball, pos);
    anim(ball, { kind: 'bob', amp: 2, period: 1.6 + R() });
    delight(pos.x, pos.y, 28, (x, y) => { fx.ring(x, y, PAL.coral, 32, 0.45); audio.plink(0.9); });
  }
}

function wrap(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
