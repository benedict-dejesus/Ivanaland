/** Travel Terminal — airport + jeepney terminal. Sky accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, bigText, patch } from '../util';
import { towerBlock, npc, dog, tree, suitcase, jeepney, shadow, lighten } from '../props';

export function buildTerminal(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  /* ---- tarmac ---- */
  put(statics, patch(1500, 500, 0x9aa3b5, 0.5), p(0.5, 0.2));
  const strip = new Graphics();
  strip.roundRect(-600, -40, 1200, 80, 12).fill(0x7d8699);
  for (let i = 0; i < 12; i++) strip.rect(-560 + i * 100, -4, 50, 8).fill(PAL.cream);
  put(statics, wrapG(strip), p(0.5, 0.12));

  /* ---- control tower ---- */
  const tower = new Container();
  tower.addChild(towerBlock(90, 190, 0xd9e4f0, PAL.waterDeep));
  const cab = new Graphics();
  cab.roundRect(-56, -230, 112, 46, 14).fill(0x9fc9e8);
  cab.roundRect(-56, -230, 112, 12, 8).fill(PAL.waterDeep);
  tower.addChild(cab);
  put(statics, tower, p(0.15, 0.32));
  const radar = new Graphics();
  radar.rect(-2, 0, 4, 14).fill(PAL.ink);
  radar.arc(0, 0, 18, Math.PI * 1.15, Math.PI * 1.85).stroke({ width: 6, color: PAL.cream });
  const radarNode = put(motion, wrapG(radar), p(0.15, 0.245));
  anim(radarNode, { kind: 'spin', speed: 1.2 });

  /* ---- departure hall ---- */
  const hall = new Container();
  const hg = new Graphics();
  hg.roundRect(-190, -130, 380, 130, 18).fill(0xe8f0fa);
  hg.roundRect(-190, -150, 380, 34, 16).fill(PAL.waterDeep);
  for (let i = 0; i < 5; i++) hg.roundRect(-160 + i * 72, -100, 44, 60, 8).fill(0xb8dcf5);
  hall.addChild(shadow(400, 90), hg);
  const halT = bigText('IVANALAND AIR', 22, PAL.cream);
  halT.position.set(0, -133);
  hall.addChild(halT);
  put(statics, hall, p(0.45, 0.5));

  /* ---- departure board (sequence #60 host area) ---- */
  const board = new Graphics();
  board.roundRect(-70, -110, 140, 70, 8).fill(PAL.ink);
  for (let r = 0; r < 3; r++) {
    for (let c2 = 0; c2 < 6; c2++) {
      board.roundRect(-58 + c2 * 20, -100 + r * 20, 14, 12, 2).fill(r === 0 ? PAL.sun : 0x554a63);
    }
  }
  board.rect(-4, -40, 8, 40).fill(PAL.ink);
  put(statics, wrapG(board), p(0.45, 0.435));
  const bench2 = new Graphics();
  bench2.roundRect(-30, -14, 60, 8, 4).fill(PAL.wood);
  bench2.rect(-26, -6, 5, 6).fill(PAL.woodDark);
  bench2.rect(21, -6, 5, 6).fill(PAL.woodDark);
  put(statics, wrapG(bench2), p(0.45, 0.425));

  /* ---- luggage carousel ---- */
  const carousel = new Graphics();
  carousel.roundRect(-130, -40, 260, 100, 40).fill(0xb8c2d4);
  carousel.roundRect(-110, -22, 220, 64, 30).fill(0x8d97ab);
  put(statics, wrapG(carousel), p(0.65, 0.62));
  put(statics, suitcase(34, PAL.mint), p(0.6, 0.6));
  put(statics, suitcase(30, PAL.sun), p(0.7, 0.66));
  const cpos = p(0.65, 0.65);
  delight(cpos.x, cpos.y, 40, (x, y) => { fx.ring(x, y, PAL.waterShallow, 36, 0.5); audio.plink(0.9); });

  /* ---- security x-ray ---- */
  const xray = new Graphics();
  xray.roundRect(-50, -46, 100, 30, 8).fill(0x8d97ab);
  xray.roundRect(-20, -60, 40, 44, 8).fill(PAL.waterDeep);
  xray.roundRect(-50, -20, 100, 8, 4).fill(0xb8c2d4);
  put(statics, wrapG(xray), p(0.55, 0.52));

  /* ---- escalator ---- */
  const esc = new Graphics();
  esc.moveTo(-40, 0).lineTo(40, -46).lineTo(40, -30).lineTo(-40, 16).closePath().fill(0xb8c2d4);
  for (let i = 0; i < 6; i++) esc.rect(-34 + i * 13, -i * 7.6, 10, 4).fill(0x8d97ab);
  put(statics, wrapG(esc), p(0.42, 0.545));

  /* ---- jeepney bay ---- */
  put(statics, patch(400, 200, 0x9aa3b5, 0.4), p(0.3, 0.8));
  put(statics, jeepney(90), p(0.24, 0.79));
  put(statics, sign('SHUTTLE BAY'), p(0.35, 0.73));

  /* ---- small plane ---- */
  const plane = new Container();
  const pg = new Graphics();
  pg.ellipse(0, -16, 60, 16).fill(PAL.cream);
  pg.ellipse(46, -22, 14, 10).fill(PAL.waterShallow);
  pg.moveTo(-14, -18).lineTo(-44, 6).lineTo(-16, -4).closePath().fill(PAL.coral);
  pg.moveTo(-52, -22).lineTo(-70, -34).lineTo(-56, -14).closePath().fill(PAL.coral);
  pg.moveTo(-6, -18).lineTo(-20, -44).lineTo(2, -22).closePath().fill(PAL.coral);
  plane.addChild(shadow(130, 30), pg);
  motion.addChild(plane);
  ctx.patrol(plane, { points: [p(0.2, 0.12), p(0.75, 0.12)], speed: 120, pause: 6 });
  const planePos = p(0.5, 0.12);
  delight(planePos.x, planePos.y, 40, (x, y) => { fx.sparkle(x, y, PAL.cream, 8); audio.plink(0.7); });

  /* ---- windsock ---- */
  const sockPole = new Graphics();
  sockPole.rect(-2, -70, 4, 70).fill(PAL.ink);
  put(statics, wrapG(sockPole), p(0.75, 0.16));
  const sock = new Graphics();
  sock.moveTo(0, 0).lineTo(44, 6).lineTo(44, 16).lineTo(0, 24).closePath().fill(PAL.coral);
  sock.rect(14, 1, 10, 21).fill(PAL.cream);
  const sockNode = put(motion, wrapG(sock), { x: p(0.75, 0.16).x, y: p(0.75, 0.16).y - 68 });
  anim(sockNode, { kind: 'sway', amp: 0.14, period: 2.2 });

  /* ---- hot-air balloon ---- */
  const balloonBig = new Container();
  const bg = new Graphics();
  const cols = [PAL.coral, PAL.sun, PAL.mint, PAL.waterShallow];
  for (let i = 0; i < 4; i++) {
    bg.arc(0, -120, 56, Math.PI * (0.75 + i * 0.125), Math.PI * (0.875 + i * 0.125));
    bg.lineTo(0, -120);
    bg.closePath();
    bg.fill(cols[i]!);
    bg.arc(0, -120, 56, Math.PI * (1.5 + i * 0.125) - Math.PI * 0.5, Math.PI * (1.625 + i * 0.125) - Math.PI * 0.5);
    bg.lineTo(0, -120);
    bg.closePath();
    bg.fill(cols[3 - i]!);
  }
  bg.circle(0, -120, 56).stroke({ width: 3, color: PAL.ink, alpha: 0.2 });
  bg.moveTo(-38, -82).lineTo(-16, -34).stroke({ width: 2, color: PAL.ink, alpha: 0.5 });
  bg.moveTo(38, -82).lineTo(16, -34).stroke({ width: 2, color: PAL.ink, alpha: 0.5 });
  balloonBig.addChild(bg);
  const bpos = p(0.85, 0.3);
  put(motion, balloonBig, { x: bpos.x, y: bpos.y - 10 });
  anim(balloonBig, { kind: 'bob', amp: 6, period: 3.4 });
  delight(bpos.x, bpos.y - 120, 60, (x, y) => { fx.sparkle(x, y, PAL.sun, 10); audio.plink(0.8); });

  /* ---- cones ---- */
  for (let i = 0; i < 4; i++) {
    const cone = new Graphics();
    cone.moveTo(-9, 0).lineTo(9, 0).lineTo(3, -20).lineTo(-3, -20).closePath().fill(0xff8c42);
    cone.rect(-6, -12, 12, 4).fill(PAL.cream);
    put(statics, wrapG(cone), p(0.55 + i * 0.035, 0.25));
  }

  /* ---- palms & greens ---- */
  put(statics, tree(60), p(0.06, 0.6));
  put(statics, tree(56), p(0.9, 0.55));
  put(statics, tree(50), p(0.08, 0.9));
  put(statics, tree(62), p(0.92, 0.85));

  /* ---- NPCs ---- */
  const pilot = put(motion, npc({ shirt: PAL.waterDeep, hat: PAL.ink }), p(0.28, 0.62));
  anim(pilot, { kind: 'sway', amp: 0.08, period: 2 });
  const runner = npc({ shirt: PAL.coral });
  motion.addChild(runner);
  ctx.patrol(runner, { points: [p(0.55, 0.68), p(0.75, 0.7), p(0.62, 0.76)], speed: 85, pause: 0.4 });
  const runaway = suitcase(26, PAL.berry);
  motion.addChild(runaway);
  ctx.patrol(runaway, { points: [p(0.57, 0.69), p(0.77, 0.71), p(0.64, 0.77)], speed: 85, pause: 0.4 });
  const beagle = dog(0x9a6a3a, 24);
  motion.addChild(beagle);
  ctx.patrol(beagle, { points: [p(0.68, 0.73), p(0.76, 0.77), p(0.7, 0.8)], speed: 35, pause: 1.5 });
  const crew = put(motion, npc({ shirt: 0xffa726, hat: 0xffa726, size: 30 }), p(0.6, 0.18));
  anim(crew, { kind: 'sway', amp: 0.16, period: 1.1 });
  const crewPos = p(0.6, 0.18);
  delight(crewPos.x, crewPos.y, 26, (x, y) => { fx.sparkle(x, y, lighten(0xffa726, 0.2), 8); audio.plink(1); });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
