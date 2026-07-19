import { Container, Graphics } from 'pixi.js';
import { PAL } from '../data/palette';

interface Particle {
  g: Graphics;
  vx: number; vy: number; vr: number;
  life: number; maxLife: number;
  gravity: number;
  active: boolean;
}

const CONFETTI_COLORS = [PAL.sun, PAL.coral, PAL.berry, PAL.mint, PAL.phoneGlow, PAL.white];
const MAX_PARTICLES = 120;

/**
 * World-space effects: tap ripples, confetti bursts, pop rings, glints.
 * Pooled — zero allocation during steady state.
 */
export class FX {
  readonly layer = new Container();
  private pool: Particle[] = [];
  private rings: { g: Graphics; t: number; dur: number; color: number }[] = [];
  private bursts: { g: Graphics; t: number; dur: number; big: boolean }[] = [];
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    this.layer.eventMode = 'none';
  }

  private getParticle(): Particle | null {
    for (const p of this.pool) if (!p.active) return p;
    if (this.pool.length >= MAX_PARTICLES) return null;
    const g = new Graphics();
    g.visible = false;
    this.layer.addChild(g);
    const p: Particle = { g, vx: 0, vy: 0, vr: 0, life: 0, maxLife: 1, gravity: 0, active: false };
    this.pool.push(p);
    return p;
  }

  confetti(x: number, y: number, count = 26, spread = 260): void {
    if (this.reducedMotion) count = Math.floor(count / 2);
    for (let i = 0; i < count; i++) {
      const p = this.getParticle();
      if (!p) break;
      const ang = Math.random() * Math.PI * 2;
      const speed = spread * (0.4 + Math.random() * 0.8);
      p.g.clear();
      const c = CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0]!;
      if (Math.random() < 0.5) p.g.rect(-5, -3, 10, 6).fill(c);
      else p.g.circle(0, 0, 4).fill(c);
      p.g.position.set(x, y);
      p.g.rotation = Math.random() * Math.PI;
      p.g.visible = true;
      p.g.alpha = 1;
      p.vx = Math.cos(ang) * speed;
      p.vy = Math.sin(ang) * speed - spread * 0.5;
      p.vr = (Math.random() - 0.5) * 10;
      p.gravity = 420;
      p.maxLife = p.life = 1.1 + Math.random() * 0.7;
      p.active = true;
    }
  }

  sparkle(x: number, y: number, color: number = PAL.sun, count = 8): void {
    for (let i = 0; i < count; i++) {
      const p = this.getParticle();
      if (!p) break;
      const ang = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 90;
      p.g.clear();
      p.g.star(0, 0, 4, 6, 2.5).fill(color);
      p.g.position.set(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
      p.g.visible = true;
      p.g.alpha = 1;
      p.vx = Math.cos(ang) * speed;
      p.vy = Math.sin(ang) * speed - 40;
      p.vr = (Math.random() - 0.5) * 6;
      p.gravity = 60;
      p.maxLife = p.life = 0.5 + Math.random() * 0.4;
      p.active = true;
    }
  }

  ring(x: number, y: number, color: number = PAL.phoneGlow, radius = 60, dur = 0.55): void {
    const g = new Graphics();
    g.position.set(x, y);
    this.layer.addChild(g);
    this.rings.push({ g, t: 0, dur, color });
    // store target radius on the graphics for the tick
    (g as Graphics & { targetR?: number }).targetR = radius;
  }

  ripple(x: number, y: number): void {
    this.ring(x, y, 0xffffff, 44, 0.45);
  }

  /**
   * The discovery celebration: golden starburst rays + double shockwave +
   * confetti fountain + rising sparkles. `big` doubles everything (tier 5 / #100).
   */
  discoveryBurst(x: number, y: number, big = false): void {
    const g = new Graphics();
    g.position.set(x, y);
    this.layer.addChild(g);
    this.bursts.push({ g, t: 0, dur: big ? 1.3 : 0.9, big });
    this.ring(x, y, PAL.phoneGlow, big ? 150 : 95, 0.7);
    this.ring(x, y, PAL.sun, big ? 210 : 130, big ? 1.0 : 0.8);
    this.confetti(x, y, big ? 70 : 38, big ? 340 : 280);
    this.sparkle(x, y - 10, PAL.sun, big ? 16 : 10);
    this.sparkle(x, y - 10, PAL.phoneGlow, big ? 10 : 6);
  }

  glint(x: number, y: number, strong = false): void {
    const p = this.getParticle();
    if (!p) return;
    p.g.clear();
    p.g.star(0, 0, 4, strong ? 14 : 10, strong ? 5 : 3.6).fill(PAL.phoneGlow);
    p.g.star(0, 0, 4, strong ? 7 : 5, 2).fill(0xffffff);
    p.g.position.set(x, y);
    p.g.visible = true;
    p.g.alpha = 0;
    p.g.rotation = Math.random() * Math.PI;
    p.vx = 0; p.vy = 0; p.vr = 1.6;
    p.gravity = 0;
    p.maxLife = p.life = 1.2;
    p.active = true;
  }

  tick(dt: number): void {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.g.visible = false;
        continue;
      }
      p.g.x += p.vx * dt;
      p.g.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.g.rotation += p.vr * dt;
      const f = p.life / p.maxLife;
      // glints fade in then out
      p.g.alpha = p.gravity === 0 ? Math.sin((1 - f) * Math.PI) : Math.min(1, f * 2.2);
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      b.t += dt;
      const f = Math.min(1, b.t / b.dur);
      const ease = 1 - Math.pow(1 - f, 3);
      const rOut = (b.big ? 190 : 120) * ease;
      const rIn = rOut * (0.35 + f * 0.5);
      const rays = b.big ? 12 : 8;
      b.g.clear();
      b.g.rotation = f * 0.5;
      for (let k = 0; k < rays; k++) {
        const a = (k / rays) * Math.PI * 2;
        const wHalf = 0.10 * (1 - f * 0.6);
        b.g.moveTo(Math.cos(a - wHalf) * rIn, Math.sin(a - wHalf) * rIn);
        b.g.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
        b.g.lineTo(Math.cos(a + wHalf) * rIn, Math.sin(a + wHalf) * rIn);
        b.g.closePath();
        b.g.fill({ color: k % 2 ? PAL.sun : 0xfff3b8, alpha: (1 - f) * 0.85 });
      }
      if (f >= 1) {
        b.g.destroy();
        this.bursts.splice(i, 1);
      }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]!;
      r.t += dt;
      const f = Math.min(1, r.t / r.dur);
      const target = (r.g as Graphics & { targetR?: number }).targetR ?? 60;
      r.g.clear();
      r.g.circle(0, 0, 6 + target * f).stroke({ width: 5 * (1 - f) + 1, color: r.color, alpha: 1 - f });
      if (f >= 1) {
        r.g.destroy();
        this.rings.splice(i, 1);
      }
    }
  }
}
