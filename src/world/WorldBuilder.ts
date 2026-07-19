import { Container, Graphics } from 'pixi.js';
import { PAL, seeded } from '../data/palette';
import { WORLD_W, WORLD_H, DISTRICTS } from '../data/districts';
import type { DistrictId } from '../data/types';
import type { BuildCtx } from './context';
import type { Animator } from './Animator';
import type { FX } from '../systems/FX';
import type { GameAudio } from '../core/Audio';
import type { InteractionSystem } from '../systems/InteractionSystem';
import type { EventBus } from '../core/events';
import { dashedInto } from './util';
import { jeepney, lighten } from './props';

import { buildStudio } from './districts/studio';
import { buildVillage } from './districts/village';
import { buildMarket } from './districts/market';
import { buildBeauty } from './districts/beauty';
import { buildPets } from './districts/pets';
import { buildTerminal } from './districts/terminal';
import { buildResort } from './districts/resort';
import { buildFestival } from './districts/festival';
import { buildCharity } from './districts/charity';
import { buildIsland } from './districts/island';

const BUILDERS: Record<DistrictId, (ctx: BuildCtx) => void> = {
  studio: buildStudio, village: buildVillage, market: buildMarket,
  beauty: buildBeauty, pets: buildPets, terminal: buildTerminal,
  resort: buildResort, festival: buildFestival, charity: buildCharity,
  island: buildIsland,
};

export interface BuiltWorld {
  root: Container;
  districtNodes: Map<DistrictId, { statics: Container; motion: Container }>;
  motionLayers: Map<DistrictId, Container>;
}

interface LandBlock { x: number; y: number; w: number; h: number; r: number; grass: number; grassHi: number; grassLo: number }

/** the three landmasses (sand bounds) */
const LAND: LandBlock[] = [
  { x: -180, y: 1290, w: 3960, h: 4810, r: 300, grass: PAL.grass, grassHi: PAL.grassLight, grassLo: PAL.grassDark },     // mainland south
  { x: -180, y: -180, w: 2320, h: 1680, r: 300, grass: PAL.grassLight, grassHi: 0xbdeb96, grassLo: PAL.grass },          // terminal block
  { x: 2120, y: 20, w: 1840, h: 1290, r: 260, grass: PAL.jungle, grassHi: 0x63c06f, grassLo: PAL.jungleDark },          // adventure island
];

function inLand(x: number, y: number, pad = 0): boolean {
  return LAND.some((b) => x > b.x - pad && x < b.x + b.w + pad && y > b.y - pad && y < b.y + b.h + pad);
}

interface Seg { ax: number; ay: number; bx: number; by: number; hw: number }

function distToSeg(px: number, py: number, s: Seg): number {
  const dx = s.bx - s.ax;
  const dy = s.by - s.ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 === 0 ? 0 : ((px - s.ax) * dx + (py - s.ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (s.ax + dx * t), py - (s.ay + dy * t));
}

/**
 * Composes the seamless world: layered ocean with foam coasts, textured
 * meadows, roads with dashed centerlines, a river, ambient detail scatter,
 * drifting cloud shadows, the Ivana Shuttle, and all ten districts.
 */
export function buildWorld(
  animator: Animator,
  fx: FX,
  audio: GameAudio,
  interactions: InteractionSystem,
  bus: EventBus,
): BuiltWorld {
  const root = new Container();
  const R = seeded(20260719);

  // All static background terrain (ocean, land, roads, river, scatter detail)
  // goes in one container that we bake to a single low-res texture at the end.
  // Weak GPUs then blit one image per frame instead of re-rendering thousands
  // of primitives — the difference between 4 fps and 60 fps on laptop iGPUs.
  const baseLayer = new Container();
  baseLayer.eventMode = 'none';
  root.addChild(baseLayer);

  /* ================= OCEAN ================= */
  const ocean = new Graphics();
  ocean.rect(-800, -800, WORLD_W + 1600, WORLD_H + 1600).fill(PAL.waterDeep);
  // graded shallows hugging each landmass
  for (const b of LAND) {
    ocean.roundRect(b.x - 150, b.y - 150, b.w + 300, b.h + 300, b.r + 130)
      .fill({ color: PAL.waterShallow, alpha: 0.45 });
  }
  for (const b of LAND) {
    ocean.roundRect(b.x - 64, b.y - 64, b.w + 128, b.h + 128, b.r + 60).fill(PAL.waterShallow);
  }
  // open-water waves (one batched path, one stroke — no connector artifacts)
  const waves = new Graphics();
  for (let i = 0; i < 150; i++) {
    const x = -700 + R() * (WORLD_W + 1400);
    const y = -700 + R() * (WORLD_H + 1400);
    if (inLand(x, y, 140)) continue;
    const r = 9 + R() * 16;
    const a0 = Math.PI * 1.05;
    waves.moveTo(x + Math.cos(a0) * r, y + Math.sin(a0) * r);
    waves.arc(x, y, r, a0, Math.PI * 1.95);
  }
  waves.stroke({ width: 3, color: 0xffffff, alpha: 0.22 });
  // water glints
  for (let i = 0; i < 60; i++) {
    const x = -700 + R() * (WORLD_W + 1400);
    const y = -700 + R() * (WORLD_H + 1400);
    if (inLand(x, y, 140)) continue;
    waves.circle(x, y, 1.6 + R() * 1.8).fill({ color: 0xffffff, alpha: 0.35 });
  }
  // foam rings on the coastline
  for (const b of LAND) {
    ocean.roundRect(b.x - 26, b.y - 26, b.w + 52, b.h + 52, b.r + 26)
      .stroke({ width: 10, color: 0xffffff, alpha: 0.4 });
    ocean.roundRect(b.x - 52, b.y - 52, b.w + 104, b.h + 104, b.r + 44)
      .stroke({ width: 5, color: 0xffffff, alpha: 0.18 });
  }
  baseLayer.addChild(ocean, waves);

  /* ================= LAND ================= */
  const land = new Graphics();
  for (const b of LAND) {
    land.roundRect(b.x, b.y, b.w, b.h, b.r).fill(PAL.sand);
    land.roundRect(b.x, b.y, b.w, b.h, b.r).stroke({ width: 6, color: PAL.sandDark, alpha: 0.5 });
    land.roundRect(b.x + 58, b.y + 58, b.w - 116, b.h - 116, Math.max(60, b.r - 50)).fill(b.grass);
  }
  // east-coast beach strip through the resort
  land.roundRect(3480, 1400, 520, 2900, 170).fill(PAL.sand);
  land.roundRect(3460, 1400, 190, 2900, 120).fill({ color: PAL.sandDark, alpha: 0.3 });
  // meadow dapples — soft tonal variation across every landmass
  for (const b of LAND) {
    for (let i = 0; i < 120; i++) {
      const x = b.x + 90 + R() * (b.w - 180);
      const y = b.y + 90 + R() * (b.h - 180);
      const rr = 45 + R() * 95;
      land.ellipse(x, y, rr, rr * (0.55 + R() * 0.3))
        .fill({ color: R() < 0.5 ? b.grassHi : b.grassLo, alpha: 0.06 + R() * 0.05 });
    }
  }
  baseLayer.addChild(land);

  /* ================= RIVER ================= */
  const riverPts = [
    { x: 660, y: 1180 }, { x: 820, y: 1620 }, { x: 1240, y: 2120 },
    { x: 1290, y: 2620 }, { x: 1700, y: 2880 }, { x: 2340, y: 2900 }, { x: 3000, y: 2920 },
  ];
  const river = new Graphics();
  const strokePath = (g: Graphics, pts: { x: number; y: number }[], width: number, color: number, alpha = 1): void => {
    g.moveTo(pts[0]!.x, pts[0]!.y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i]!.x, pts[i]!.y);
    g.stroke({ width, color, alpha, cap: 'round', join: 'round' });
  };
  strokePath(river, riverPts, 104, PAL.sand, 0.9);
  strokePath(river, riverPts, 88, PAL.waterShallow);
  strokePath(river, riverPts, 52, PAL.waterDeep, 0.75);
  dashedInto(river, riverPts, 26, 34, 4, 0xffffff, 0.25);
  baseLayer.addChild(river);

  /* ================= ROADS ================= */
  const HUB = { x: 2000, y: 2150 };
  const roadPaths: { x: number; y: number }[][] = [
    [HUB, { x: 1620, y: 1560 }, { x: 1000, y: 700 }],
    [HUB, { x: 1300, y: 2160 }, { x: 650, y: 2150 }],
    [HUB, { x: 2700, y: 2180 }, { x: 3350, y: 2200 }],
    [HUB, { x: 2000, y: 3600 }],
    [{ x: 2000, y: 3600 }, { x: 2000, y: 4620 }],
    [{ x: 650, y: 2150 }, { x: 650, y: 3600 }, { x: 650, y: 5050 }],
    [{ x: 650, y: 5050 }, { x: 2000, y: 5050 }, { x: 3350, y: 5050 }],
    [{ x: 3350, y: 2200 }, { x: 3380, y: 3600 }, { x: 3350, y: 5050 }],
  ];
  const gOuter = new Graphics();
  const gMain = new Graphics();
  const gDash = new Graphics();
  for (const p of roadPaths) strokePath(gOuter, p, 104, PAL.roadDark, 0.55);
  for (const p of roadPaths) strokePath(gMain, p, 90, PAL.road);
  for (const p of roadPaths) dashedInto(gDash, p, 30, 34, 5, PAL.roadLine, 0.75);
  // roundabout hub
  gOuter.circle(HUB.x, HUB.y, 138).fill({ color: PAL.roadDark, alpha: 0.55 });
  gMain.circle(HUB.x, HUB.y, 130).fill(PAL.road);
  gDash.circle(HUB.x, HUB.y, 96).stroke({ width: 5, color: PAL.roadLine, alpha: 0.6 });
  gMain.circle(HUB.x, HUB.y, 62).fill(PAL.grassDark);
  gMain.circle(HUB.x, HUB.y, 56).fill(PAL.grassLight);
  // festival plaza (pedestrian — the statue stands here)
  gMain.ellipse(2000, 4940, 430, 305).fill({ color: 0xcfc4e0, alpha: 0.5 });
  gMain.ellipse(2000, 4940, 430, 305).stroke({ width: 8, color: 0xbdb0d4, alpha: 0.5 });
  gDash.ellipse(2000, 4940, 360, 245).stroke({ width: 4, color: 0xffffff, alpha: 0.25 });
  baseLayer.addChild(gOuter, gMain, gDash);

  // bridges where roads cross the river
  const bridges = new Graphics();
  for (const b of [{ x: 1266, y: 2160 }, { x: 2000, y: 2895 }]) {
    bridges.roundRect(b.x - 72, b.y - 60, 144, 120, 18).fill(PAL.woodDark);
    bridges.roundRect(b.x - 66, b.y - 54, 132, 108, 15).fill(PAL.wood);
    for (let i = 0; i < 5; i++) bridges.rect(b.x - 62 + i * 27, b.y - 54, 5, 108).fill({ color: PAL.woodDark, alpha: 0.4 });
    bridges.rect(b.x - 66, b.y - 58, 132, 9).fill(PAL.woodDark);
    bridges.rect(b.x - 66, b.y + 49, 132, 9).fill(PAL.woodDark);
  }
  baseLayer.addChild(bridges);

  /* ================= AMBIENT DETAIL SCATTER ================= */
  const avoid: Seg[] = [];
  for (const p of roadPaths) {
    for (let i = 0; i < p.length - 1; i++) avoid.push({ ax: p[i]!.x, ay: p[i]!.y, bx: p[i + 1]!.x, by: p[i + 1]!.y, hw: 82 });
  }
  for (let i = 0; i < riverPts.length - 1; i++) {
    avoid.push({ ax: riverPts[i]!.x, ay: riverPts[i]!.y, bx: riverPts[i + 1]!.x, by: riverPts[i + 1]!.y, hw: 86 });
  }
  const clearOfPaths = (x: number, y: number): boolean => avoid.every((s) => distToSeg(x, y, s) > s.hw);

  const details = new Graphics();
  for (const b of LAND) {
    const n = Math.round((b.w * b.h) / 14000);
    for (let i = 0; i < n; i++) {
      const x = b.x + 80 + R() * (b.w - 160);
      const y = b.y + 80 + R() * (b.h - 160);
      if (!clearOfPaths(x, y)) continue;
      if (x > 3460 && y > 1400 && y < 4300) continue; // resort beach handled below
      const kind = R();
      if (kind < 0.52) {
        // grass tuft — three tiny blades (drawn as thin triangles: pure fills)
        const t = 4 + R() * 4;
        const col = R() < 0.5 ? b.grassLo : lighten(b.grass, 0.12);
        details.poly([x - t * 0.9, y, x - t * 0.5, y, x - t * 0.85, y - t * 1.4]).fill({ color: col, alpha: 0.75 });
        details.poly([x - t * 0.2, y, x + t * 0.2, y, x, y - t * 1.8]).fill({ color: col, alpha: 0.75 });
        details.poly([x + t * 0.5, y, x + t * 0.9, y, x + t * 0.85, y - t * 1.3]).fill({ color: col, alpha: 0.75 });
      } else if (kind < 0.7) {
        // wildflower
        const col = [PAL.coral, PAL.sun, 0xffffff, PAL.berry][(R() * 4) | 0]!;
        details.circle(x, y, 3.2).fill({ color: col, alpha: 0.9 });
        details.circle(x, y, 1.3).fill(PAL.cream);
      } else if (kind < 0.85) {
        // pebble
        details.ellipse(x, y, 3.5 + R() * 3, 2.4 + R() * 2).fill({ color: 0xb9b2c4, alpha: 0.55 });
      } else {
        // leafy sprig
        const col = b.grassLo;
        details.ellipse(x - 3, y - 2, 4, 2.6).fill({ color: col, alpha: 0.5 });
        details.ellipse(x + 3, y - 3, 4, 2.6).fill({ color: col, alpha: 0.5 });
      }
    }
  }
  // beach detail: shells, stones, sand ripples along the resort coast
  const ripples = new Graphics();
  for (let i = 0; i < 110; i++) {
    const x = 3480 + R() * 470;
    const y = 1450 + R() * 2780;
    const kind = R();
    if (kind < 0.4) {
      const r = 6 + R() * 9;
      const a0 = Math.PI * 1.1;
      ripples.moveTo(x + Math.cos(a0) * r, y + Math.sin(a0) * r);
      ripples.arc(x, y, r, a0, Math.PI * 1.9);
    } else if (kind < 0.7) {
      details.ellipse(x, y, 3 + R() * 2.5, 2 + R() * 2).fill({ color: 0xffffff, alpha: 0.65 });
    } else {
      details.circle(x, y, 2.5 + R() * 2).fill({ color: PAL.sandDark, alpha: 0.5 });
    }
  }
  ripples.stroke({ width: 2.5, color: PAL.sandDark, alpha: 0.5 });
  details.addChild(ripples);
  baseLayer.addChild(details);

  /* ================= DISTRICTS ================= */
  const districtNodes = new Map<DistrictId, { statics: Container; motion: Container }>();
  const motionLayers = new Map<DistrictId, Container>();
  const staticsRoot = new Container();
  const motionRoot = new Container();
  root.addChild(staticsRoot, motionRoot);

  for (const d of DISTRICTS) {
    const statics = new Container();
    const motion = new Container();
    staticsRoot.addChild(statics);
    motionRoot.addChild(motion);
    districtNodes.set(d.id, { statics, motion });
    motionLayers.set(d.id, motion);

    const ctx: BuildCtx = {
      d, statics, motion, animator, fx, audio,
      p: (fx2, fy2) => ({ x: d.x + d.w * fx2, y: d.y + d.h * fy2 }),
      delight: (x, y, r, onTap) => {
        interactions.register({
          id: `delight-${d.id}-${x | 0}-${y | 0}`, x, y, r, priority: 5, enabled: true,
          onTap: (wx, wy) => {
            onTap(wx, wy);
            bus.emit('delight', { x: wx, y: wy });
          },
        });
      },
      anim: (node, spec) => animator.add(d.id, node, spec),
      patrol: (node, spec) => animator.addPatrol(d.id, node, spec),
    };
    BUILDERS[d.id](ctx);
  }

  /* ================= THE IVANA SHUTTLE ================= */
  const shuttle = jeepney(96);
  motionRoot.addChild(shuttle);
  animator.addPatrol('global', shuttle, {
    points: [
      { x: 2000, y: 2260 }, { x: 1300, y: 2250 }, { x: 740, y: 2250 },
      { x: 740, y: 3600 }, { x: 740, y: 4960 }, { x: 2000, y: 4960 },
      { x: 3260, y: 4960 }, { x: 3260, y: 3600 }, { x: 3260, y: 2300 },
      { x: 2700, y: 2270 },
    ],
    speed: 130,
    pause: 3,
    flip: true,
  });

  /* ================= DRIFTING CLOUD SHADOWS ================= */
  const cloudLayer = new Container();
  cloudLayer.eventMode = 'none';
  root.addChild(cloudLayer);
  const circuits: { x: number; y: number }[][] = [
    [{ x: -600, y: 400 }, { x: 4600, y: 1400 }, { x: 4400, y: 4800 }, { x: -500, y: 3600 }],
    [{ x: 4600, y: 5400 }, { x: -600, y: 4600 }, { x: -400, y: 900 }, { x: 4500, y: 2400 }],
    [{ x: 1800, y: -500 }, { x: 4400, y: 3000 }, { x: 1200, y: 6300 }, { x: -500, y: 2600 }],
  ];
  circuits.forEach((pts, i) => {
    const cloud = new Graphics();
    const s = 1 + i * 0.35;
    cloud.ellipse(0, 0, 340 * s, 190 * s).fill({ color: PAL.shadow, alpha: 0.05 });
    cloud.ellipse(-190 * s, 60 * s, 220 * s, 130 * s).fill({ color: PAL.shadow, alpha: 0.045 });
    cloud.ellipse(210 * s, -50 * s, 240 * s, 140 * s).fill({ color: PAL.shadow, alpha: 0.045 });
    cloudLayer.addChild(cloud);
    animator.addPatrol('global', cloud, { points: pts, speed: 20 + i * 7, pause: 0, flip: false });
  });

  // NOTE: the base terrain is intentionally NOT cacheAsTexture'd. It's flat-color
  // vector fills, which weak (fill-rate-bound) GPUs draw faster than they can blit
  // one world-sized texture every frame. Grouping it in baseLayer just keeps the
  // scene tidy and lets us mark it non-interactive in one place.
  return { root, districtNodes, motionLayers };
}
