import type { Container } from 'pixi.js';

export type AnimKind = 'bob' | 'sway' | 'pulse' | 'spin' | 'flicker' | 'bobx';

export interface AnimSpec {
  kind: AnimKind;
  amp?: number;      // px for bob, radians for sway, scale delta for pulse, alpha delta for flicker
  period?: number;   // seconds
  phase?: number;    // 0..1
  speed?: number;    // rad/s for spin
}

interface AnimEntry {
  node: Container;
  spec: Required<AnimSpec>;
  baseX: number;
  baseY: number;
  baseRot: number;
  baseSX: number;
  baseSY: number;
  baseAlpha: number;
}

export interface PatrolSpec {
  /** waypoints in parent space */
  points: { x: number; y: number }[];
  speed: number;       // units/s
  pause?: number;      // seconds paused at each waypoint
  flip?: boolean;      // flip scale.x by direction
  loop?: boolean;      // true = return to start (closed loop)
}

interface PatrolEntry {
  node: Container;
  spec: Required<PatrolSpec>;
  segLens: number[];
  totalLen: number;
  cycle: number; // duration of full cycle incl pauses
  baseSX: number;
}

/**
 * One-ticker idle-motion system. Entries grouped by district for culling.
 * No allocations in the tick loop.
 */
export class Animator {
  private groups = new Map<string, { anims: AnimEntry[]; patrols: PatrolEntry[] }>();
  private active = new Set<string>();
  elapsed = 0;

  private group(key: string) {
    let g = this.groups.get(key);
    if (!g) {
      g = { anims: [], patrols: [] };
      this.groups.set(key, g);
    }
    return g;
  }

  add(key: string, node: Container, spec: AnimSpec): void {
    this.group(key).anims.push({
      node,
      spec: {
        kind: spec.kind,
        amp: spec.amp ?? 4,
        period: spec.period ?? 2.5,
        phase: spec.phase ?? Math.random(),
        speed: spec.speed ?? 1,
      },
      baseX: node.x,
      baseY: node.y,
      baseRot: node.rotation,
      baseSX: node.scale.x,
      baseSY: node.scale.y,
      baseAlpha: node.alpha,
    });
  }

  addPatrol(key: string, node: Container, spec: PatrolSpec): void {
    const pts = spec.loop !== false ? [...spec.points, spec.points[0]!] : spec.points;
    const segLens: number[] = [];
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1]!.x - pts[i]!.x, pts[i + 1]!.y - pts[i]!.y);
      segLens.push(l);
      total += l;
    }
    const pause = spec.pause ?? 0;
    this.group(key).patrols.push({
      node,
      spec: { points: pts, speed: spec.speed, pause, flip: spec.flip ?? true, loop: spec.loop ?? true },
      segLens,
      totalLen: total,
      cycle: total / spec.speed + pause * (pts.length - 1),
      baseSX: Math.abs(node.scale.x),
    });
  }

  setActive(keys: Iterable<string>): void {
    this.active.clear();
    for (const k of keys) this.active.add(k);
  }

  tick(dt: number): void {
    this.elapsed += dt;
    const t = this.elapsed;
    for (const [key, g] of this.groups) {
      if (!this.active.has(key)) continue;
      for (let i = 0; i < g.anims.length; i++) {
        const a = g.anims[i]!;
        const s = a.spec;
        const w = Math.sin((t / s.period + s.phase) * Math.PI * 2);
        switch (s.kind) {
          case 'bob': a.node.y = a.baseY + w * s.amp; break;
          case 'bobx': a.node.x = a.baseX + w * s.amp; break;
          case 'sway': a.node.rotation = a.baseRot + w * s.amp; break;
          case 'pulse': {
            const k = 1 + w * s.amp;
            a.node.scale.set(a.baseSX * k, a.baseSY * k);
            break;
          }
          case 'spin': a.node.rotation = a.baseRot + t * s.speed; break;
          case 'flicker': a.node.alpha = a.baseAlpha + (w * 0.5 + 0.5) * s.amp - s.amp / 2; break;
        }
      }
      for (let i = 0; i < g.patrols.length; i++) {
        this.tickPatrol(g.patrols[i]!, t);
      }
    }
  }

  private tickPatrol(p: PatrolEntry, t: number): void {
    const { spec, segLens, cycle } = p;
    const pause = spec.pause;
    let time = t % cycle;
    // walk segments: each segment takes len/speed, then pause
    for (let i = 0; i < segLens.length; i++) {
      const segT = segLens[i]! / spec.speed;
      if (time < segT) {
        const a = spec.points[i]!;
        const b = spec.points[i + 1]!;
        const f = segT > 0 ? time / segT : 0;
        p.node.x = a.x + (b.x - a.x) * f;
        p.node.y = a.y + (b.y - a.y) * f;
        if (spec.flip) {
          const dir = b.x - a.x;
          if (Math.abs(dir) > 1) p.node.scale.x = dir < 0 ? -p.baseSX : p.baseSX;
        }
        return;
      }
      time -= segT;
      if (time < pause) {
        const b = spec.points[i + 1]!;
        p.node.x = b.x;
        p.node.y = b.y;
        return;
      }
      time -= pause;
    }
    const lastPt = spec.points[spec.points.length - 1]!;
    p.node.x = lastPt.x;
    p.node.y = lastPt.y;
  }
}
