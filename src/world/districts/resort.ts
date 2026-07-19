/** Luxury Resort — infinity pools, palms, a beach wedding. Sand accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, bigText, patch } from '../util';
import { palm, npc, umbrella, boat, towerBlock, shadow, flowerPatch } from '../props';

export function buildResort(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  /* ---- beach strip along the east coast ---- */
  put(statics, patch(560, 2600, PAL.sand, 0.9), p(0.72, 0.5));

  /* ---- Grand Resort Hotel ---- */
  const hotel = new Container();
  hotel.addChild(towerBlock(230, 260, 0xfff3e0, PAL.sun));
  const canopy = new Graphics();
  canopy.roundRect(-70, -40, 140, 40, 12).fill(PAL.coral);
  canopy.roundRect(-70, -44, 140, 12, 8).fill(PAL.cream);
  hotel.addChild(canopy);
  put(statics, hotel, p(0.45, 0.185));
  const ht = bigText('GRAND IVANA', 24, PAL.sunDark);
  const hbg = new Graphics();
  hbg.roundRect(-90, -18, 180, 36, 12).fill(PAL.cream);
  const htc = new Container();
  htc.addChild(hbg, ht);
  put(statics, htc, { x: p(0.45, 0.185).x, y: p(0.45, 0.185).y - 290 });

  /* ---- infinity pool ---- */
  const pool = new Graphics();
  pool.roundRect(-150, -70, 300, 140, 60).fill(0xd9f0fa);
  pool.roundRect(-138, -58, 276, 116, 52).fill(PAL.waterShallow);
  pool.ellipse(-40, -10, 30, 12).fill({ color: PAL.waterFoam, alpha: 0.55 });
  put(statics, wrapG(pool), p(0.44, 0.36));
  const swimmer = npc({ shirt: PAL.coral, size: 22 });
  motion.addChild(swimmer);
  ctx.patrol(swimmer, { points: [p(0.38, 0.36), p(0.5, 0.36)], speed: 35, pause: 1.5 });
  const ppos = p(0.44, 0.36);
  delight(ppos.x, ppos.y + 40, 46, (x, y) => { fx.ring(x, y, PAL.waterFoam, 44, 0.5); audio.plink(1.5); });

  /* ---- loungers + umbrellas ---- */
  for (let i = 0; i < 3; i++) {
    const lounge = new Graphics();
    lounge.roundRect(-20, -8, 40, 12, 5).fill([PAL.coral, PAL.mint, PAL.sun][i]!);
    lounge.roundRect(-20, -18, 12, 12, 4).fill([PAL.coral, PAL.mint, PAL.sun][i]!);
    put(statics, wrapG(lounge), p(0.36 + i * 0.09, 0.3));
    put(statics, umbrella(56, [PAL.coral, PAL.mint, PAL.sun][i]!), p(0.35 + i * 0.09, 0.285));
  }

  /* ---- beach wedding arch ---- */
  const archNode = new Container();
  const ag = new Graphics();
  ag.arc(0, -30, 46, Math.PI, 0).stroke({ width: 10, color: 0xfff0dc });
  ag.circle(-46, -30, 9).fill(PAL.coral);
  ag.circle(46, -30, 9).fill(PAL.coral);
  ag.circle(-30, -62, 9).fill(PAL.berry);
  ag.circle(30, -62, 9).fill(PAL.berry);
  ag.circle(0, -76, 10).fill(PAL.sun);
  archNode.addChild(shadow(110, 26), ag);
  put(statics, archNode, p(0.3, 0.565));
  const bride = put(motion, npc({ shirt: PAL.cream, hair: PAL.ink, size: 30 }), p(0.28, 0.585));
  const groom = put(motion, npc({ shirt: PAL.ink, hair: 0x5b4a3a, size: 32 }), p(0.32, 0.585));
  anim(bride, { kind: 'bob', amp: 1, period: 2.6 });
  anim(groom, { kind: 'bob', amp: 1, period: 2.9 });

  /* ---- overwater cabanas ---- */
  for (let i = 0; i < 2; i++) {
    const cab = new Container();
    const cg = new Graphics();
    cg.roundRect(-40, -46, 80, 46, 8).fill(0xfff0dc);
    cg.moveTo(-50, -42).lineTo(0, -70).lineTo(50, -42).closePath().fill(0xd9b88f);
    cg.rect(-40, 0, 80, 8).fill(PAL.wood);
    cab.addChild(cg);
    put(statics, cab, p(0.68 + i * 0.14, 0.5));
  }

  /* ---- sandcastle ---- */
  const castle = new Graphics();
  castle.roundRect(-24, -22, 48, 22, 4).fill(PAL.sandDark);
  castle.roundRect(-30, -14, 14, 14, 3).fill(PAL.sandDark);
  castle.roundRect(16, -14, 14, 14, 3).fill(PAL.sandDark);
  castle.roundRect(-8, -38, 16, 16, 3).fill(PAL.sandDark);
  castle.moveTo(0, -38).lineTo(0, -48).stroke({ width: 2, color: PAL.ink });
  castle.moveTo(0, -48).lineTo(8, -45).lineTo(0, -42).closePath().fill(PAL.coral);
  put(statics, wrapG(castle), p(0.35, 0.635));
  const coco = put(motion, npc({ shirt: PAL.sun, size: 22 }), p(0.38, 0.645));
  anim(coco, { kind: 'bob', amp: 1.4, period: 1.6 });

  /* ---- swim-up bar & giant cocktail ---- */
  const bar = new Graphics();
  bar.roundRect(-40, -36, 80, 36, 10).fill(PAL.wood);
  bar.roundRect(-46, -46, 92, 14, 7).fill(0xd9b88f);
  put(statics, wrapG(bar), p(0.58, 0.4));
  const cocktail = new Graphics();
  cocktail.moveTo(-16, -40).lineTo(16, -40).lineTo(4, -18).lineTo(4, -6).lineTo(-4, -6).lineTo(-4, -18).closePath().fill({ color: 0xffd1e8, alpha: 0.9 });
  cocktail.ellipse(0, -40, 16, 4).fill(PAL.coral);
  cocktail.circle(12, -46, 5).fill(PAL.sun);
  put(statics, wrapG(cocktail), p(0.58, 0.375));

  /* ---- lighthouse ---- */
  const lh = new Container();
  const lg = new Graphics();
  lg.moveTo(-26, 0).lineTo(-16, -110).lineTo(16, -110).lineTo(26, 0).closePath().fill(PAL.cream);
  lg.rect(-24, -30, 48, 16).fill(PAL.coral);
  lg.rect(-20, -70, 40, 16).fill(PAL.coral);
  lg.roundRect(-14, -136, 28, 26, 6).fill(PAL.sun);
  lg.roundRect(-18, -142, 36, 8, 4).fill(PAL.ink);
  lh.addChild(shadow(70, 20), lg);
  put(statics, lh, p(0.75, 0.86));
  const beam = new Graphics();
  beam.moveTo(0, 0).lineTo(90, -16).lineTo(90, 16).closePath().fill({ color: 0xfff3b8, alpha: 0.5 });
  const beamNode = put(motion, wrapG(beam), { x: p(0.75, 0.86).x, y: p(0.75, 0.86).y - 124 });
  anim(beamNode, { kind: 'spin', speed: 0.7 });
  const lpos = p(0.75, 0.86);
  delight(lpos.x, lpos.y - 130, 34, (x, y) => { fx.sparkle(x, y, PAL.sun, 8); audio.plink(1.1); });

  /* ---- marina + yachts ---- */
  const dock = new Graphics();
  dock.roundRect(-110, -14, 220, 28, 8).fill(PAL.wood);
  for (let i = 0; i < 6; i++) dock.rect(-100 + i * 38, -14, 6, 28).fill(PAL.woodDark);
  put(statics, wrapG(dock), p(0.5, 0.78));
  const yacht = new Container();
  const yg = new Graphics();
  yg.moveTo(-50, 0).quadraticCurveTo(0, 18, 50, 0).lineTo(38, -14).lineTo(-38, -14).closePath().fill(PAL.cream);
  yg.roundRect(-22, -30, 44, 18, 6).fill(PAL.waterDeep);
  yg.rect(0, -52, 3, 24).fill(PAL.ink);
  yacht.addChild(yg);
  put(motion, yacht, p(0.5, 0.755));
  anim(yacht, { kind: 'bob', amp: 3, period: 2.8 });
  const rowboat = boat(56, PAL.mint);
  put(motion, rowboat, p(0.62, 0.79));
  anim(rowboat, { kind: 'bob', amp: 2.5, period: 3.2 });

  /* ---- surf shack ---- */
  const shack = new Graphics();
  shack.roundRect(-40, -50, 80, 50, 8).fill(PAL.wood);
  shack.moveTo(-48, -46).lineTo(0, -70).lineTo(48, -46).closePath().fill(PAL.jungle);
  put(statics, wrapG(shack), p(0.25, 0.71));
  for (let i = 0; i < 3; i++) {
    const board = new Graphics();
    board.ellipse(0, -24, 7, 24).fill([PAL.coral, PAL.waterShallow, PAL.sun][i]!);
    board.rotation = -0.12 + i * 0.12;
    put(statics, wrapG(board), p(0.28 + i * 0.025, 0.685));
  }

  /* ---- palms everywhere ---- */
  for (const [fx1, fy1] of [[0.2, 0.25], [0.62, 0.22], [0.25, 0.45], [0.68, 0.6], [0.4, 0.7], [0.6, 0.66], [0.3, 0.9], [0.55, 0.92], [0.8, 0.4], [0.85, 0.7]] as const) {
    const pl = palm(76 + ((fx1 * 173) % 24));
    put(motion, pl, p(fx1, fy1));
    const fronds = (pl as Container & { fronds?: Container }).fronds;
    if (fronds) anim(fronds, { kind: 'sway', amp: 0.07, period: 3 + (fy1 * 7) % 2 });
    const palmPos = p(fx1, fy1);
    if (fx1 === 0.2) delight(palmPos.x, palmPos.y - 40, 34, (x, y) => { fx.sparkle(x, y, PAL.jungle, 6); audio.plink(0.9); });
  }
  put(statics, flowerPatch(60, PAL.coral), p(0.5, 0.3));
  put(statics, sign('LUXURY RESORT'), p(0.55, 0.25));

  /* ---- NPCs ---- */
  const lifeguard = put(motion, npc({ shirt: PAL.coral, hat: PAL.cream }), p(0.52, 0.33));
  anim(lifeguard, { kind: 'sway', amp: 0.05, period: 3.2 });
  const waiter = npc({ shirt: PAL.cream, size: 30 });
  motion.addChild(waiter);
  ctx.patrol(waiter, { points: [p(0.4, 0.42), p(0.55, 0.44), p(0.48, 0.47)], speed: 42, pause: 1.4 });
  const masseuse = put(motion, npc({ shirt: PAL.mint }), p(0.65, 0.44));
  anim(masseuse, { kind: 'bob', amp: 2, period: 0.8 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
