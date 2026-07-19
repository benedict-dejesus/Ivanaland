/** Creator Studio City — the hub. Sunshine accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, bigText, patch } from '../util';
import { towerBlock, house, fountain, crate, npc, tree, bush, lamppost, flowerPatch, drone, shadow, bench } from '../props';

export function buildStudio(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  /* ---- Grand Soundstage + marquee ---- */
  const stage = new Container();
  const sg = new Graphics();
  sg.roundRect(-170, -150, 340, 150, 16).fill(0xfae9c8);
  sg.roundRect(-170, -150, 340, 26, 12).fill(PAL.sunDark);
  sg.roundRect(-40, -70, 80, 70, 10).fill(PAL.woodDark);
  sg.roundRect(-150, -120, 70, 40, 8).fill(PAL.waterShallow);
  sg.roundRect(80, -120, 70, 40, 8).fill(PAL.waterShallow);
  stage.addChild(shadow(360, 90), sg);
  const marquee = new Container();
  const mg = new Graphics();
  mg.roundRect(-160, -34, 320, 68, 18).fill(PAL.ink);
  mg.roundRect(-152, -26, 304, 52, 14).fill(PAL.sun);
  for (let i = 0; i < 12; i++) mg.circle(-140 + i * 25.5, -34, 5).fill(PAL.cream);
  marquee.addChild(mg, bigText('IVANALAND', 34, PAL.ink));
  marquee.position.set(0, -180);
  stage.addChild(marquee);
  put(statics, stage, p(0.5, 0.24));
  const mq = p(0.5, 0.24);
  delight(mq.x, mq.y - 180, 60, (x, y) => { fx.sparkle(x, y, PAL.sun, 12); audio.plink(1.3); });

  /* ---- Vlog Tower ---- */
  const tower = new Container();
  tower.addChild(towerBlock(120, 230, 0xf3e6ff, PAL.berry));
  const screen = new Graphics();
  screen.roundRect(-44, -150, 88, 54, 8).fill(PAL.ink);
  screen.roundRect(-38, -144, 76, 42, 6).fill(PAL.phoneGlow);
  screen.circle(-26, -134, 5).fill(PAL.coral);
  tower.addChild(screen);
  const antenna = new Graphics();
  antenna.rect(-2, -286, 4, 56).fill(PAL.ink);
  antenna.circle(0, -290, 6).fill(PAL.coral);
  tower.addChild(antenna);
  const towerPos = p(0.8, 0.315);
  put(statics, tower, { x: towerPos.x, y: towerPos.y + 60 });
  const live = bigText('LIVE', 16, PAL.cream);
  live.position.set(towerPos.x, towerPos.y - 62);
  motion.addChild(live);
  anim(live, { kind: 'flicker', amp: 0.5, period: 1.2 });

  /* ---- fountain roundabout ---- */
  const f = fountain(100);
  put(motion, f, p(0.45, 0.575));
  const jet = (f as Container & { jet?: Graphics }).jet;
  if (jet) anim(jet, { kind: 'pulse', amp: 0.18, period: 1.4 });
  const fp = p(0.45, 0.575);
  delight(fp.x, fp.y - 60, 40, (x, y) => { fx.sparkle(x, y, PAL.waterShallow, 10); audio.plink(1.6); });

  /* ---- Editing Café ---- */
  put(statics, house({ w: 150, h: 100, wall: 0xffe9d1, roof: PAL.berry }), p(0.16, 0.47));
  put(statics, sign('CAFÉ'), p(0.205, 0.485));
  const cups = new Graphics();
  for (let i = 0; i < 4; i++) {
    cups.roundRect(i * 18 - 27, -12, 12, 12, 3).fill(i % 2 ? PAL.cream : PAL.coral);
    cups.ellipse(i * 18 - 21, -12, 7, 2.5).fill(0x8d6e4a);
  }
  put(statics, wrap(cups), p(0.14, 0.435));

  /* ---- green screen wall ---- */
  const gs = new Graphics();
  gs.roundRect(-70, -90, 140, 90, 8).fill(0x3ec97e);
  gs.roundRect(-70, -90, 140, 90, 8).stroke({ width: 6, color: PAL.ink, alpha: 0.5 });
  put(statics, wrap(gs), p(0.2, 0.755));
  put(statics, sign('FX WALL'), p(0.25, 0.77));

  /* ---- backlot ---- */
  put(statics, crate(40), p(0.62, 0.83));
  put(statics, crate(30), p(0.63, 0.85));
  put(statics, crate(34), p(0.7, 0.84));
  const clap = new Graphics();
  clap.roundRect(-16, -24, 32, 22, 4).fill(PAL.ink);
  clap.roundRect(-16, -30, 32, 8, 3).fill(PAL.cream);
  const clapPos = p(0.72, 0.78);
  put(motion, wrap(clap), clapPos);
  delight(clapPos.x, clapPos.y, 30, (x, y) => { fx.ring(x, y, PAL.cream, 30, 0.4); audio.plink(0.8); });

  /* ---- director's chair + camera ---- */
  const chair = new Graphics();
  chair.rect(-14, -30, 4, 30).fill(PAL.woodDark);
  chair.rect(10, -30, 4, 30).fill(PAL.woodDark);
  chair.roundRect(-16, -34, 32, 10, 3).fill(PAL.coral);
  chair.roundRect(-14, -20, 28, 6, 3).fill(PAL.coral);
  put(statics, wrap(chair), p(0.365, 0.29));
  const cam = new Graphics();
  cam.rect(-3, -40, 6, 40).fill(PAL.ink);
  cam.roundRect(-18, -56, 36, 20, 6).fill(PAL.ink);
  cam.circle(18, -46, 8).fill(0x554a63);
  const camNode = put(motion, wrap(cam), p(0.42, 0.33));
  anim(camNode, { kind: 'sway', amp: 0.14, period: 4 });

  /* ---- trophy cabinet ---- */
  const cab = new Graphics();
  cab.roundRect(-30, -60, 60, 60, 6).fill(PAL.woodDark);
  cab.roundRect(-24, -54, 48, 48, 4).fill(0xfff3d6);
  for (let i = 0; i < 2; i++) {
    cab.moveTo(-12 + i * 24 - 6, -22).lineTo(-12 + i * 24 + 6, -22).lineTo(-12 + i * 24 + 3, -34)
      .lineTo(-12 + i * 24 - 3, -34).closePath().fill(PAL.sun);
  }
  put(statics, wrap(cab), p(0.74, 0.42));

  /* ---- greens + streetscape ---- */
  put(statics, patch(300, 200, PAL.grassLight, 0.6), p(0.3, 0.62));
  for (const [fx1, fy1] of [[0.1, 0.25], [0.32, 0.44], [0.6, 0.55], [0.9, 0.5], [0.55, 0.9], [0.35, 0.95], [0.12, 0.9]] as const) {
    put(statics, tree(56 + Math.random() * 16), p(fx1, fy1));
  }
  put(statics, bush(30), p(0.48, 0.44));
  put(statics, bush(36), p(0.68, 0.62));
  put(statics, flowerPatch(46), p(0.42, 0.62));
  put(statics, flowerPatch(40, PAL.berry), p(0.58, 0.48));
  put(statics, lamppost(), p(0.36, 0.52));
  put(statics, lamppost(), p(0.55, 0.62));

  /* ---- streetscape fillers (no dead zones) ---- */
  // picnic corner NE of the roundabout
  const picnic = new Graphics();
  picnic.ellipse(0, 0, 42, 26).fill({ color: PAL.coral, alpha: 0.85 });
  picnic.ellipse(0, 0, 42, 26).stroke({ width: 4, color: PAL.cream, alpha: 0.8 });
  picnic.circle(-10, -4, 6).fill(PAL.cream);
  picnic.circle(8, 3, 5).fill(PAL.sun);
  put(statics, wrap(picnic), p(0.62, 0.5));
  // snack kiosk SE
  const kiosk = new Container();
  const kg = new Graphics();
  kg.roundRect(-34, -44, 68, 44, 8).fill(PAL.waterShallow);
  kg.roundRect(-40, -58, 80, 18, 8).fill(PAL.coral);
  kg.roundRect(-24, -34, 48, 16, 5).fill(PAL.cream);
  kiosk.addChild(shadow(80, 22), kg);
  put(statics, kiosk, p(0.58, 0.68));
  // planters + benches around the roundabout
  for (const [fx2, fy2] of [[0.38, 0.47], [0.53, 0.47], [0.38, 0.62], [0.55, 0.66]] as const) {
    const planter = new Graphics();
    planter.roundRect(-16, -12, 32, 12, 4).fill(PAL.woodDark);
    planter.circle(-7, -14, 6).fill(PAL.coral);
    planter.circle(2, -16, 6).fill(PAL.sun);
    planter.circle(9, -13, 5).fill(PAL.berry);
    put(statics, wrap(planter), p(fx2, fy2));
  }
  put(statics, bench(), p(0.42, 0.44));
  put(statics, bench(), p(0.6, 0.44));
  // star walk-of-fame tiles along the south road
  const stars = new Graphics();
  for (let i = 0; i < 4; i++) {
    stars.star(i * 46 - 70, 0, 5, 9, 4).fill({ color: PAL.sun, alpha: 0.8 });
  }
  put(statics, wrap(stars), p(0.42, 0.72));

  /* ---- NPCs ---- */
  const director = put(motion, npc({ shirt: PAL.ink, hat: PAL.coral }), p(0.34, 0.31));
  anim(director, { kind: 'sway', amp: 0.08, period: 1.8 });
  const dpos = p(0.34, 0.31);
  delight(dpos.x, dpos.y, 26, (x, y) => { fx.sparkle(x, y, PAL.coral, 5); audio.plink(0.7); });
  const mascot = put(motion, npc({ shirt: PAL.sun, hat: PAL.sun, size: 40 }), p(0.47, 0.63));
  anim(mascot, { kind: 'sway', amp: 0.12, period: 1.4 });
  const mpos = p(0.47, 0.63);
  delight(mpos.x, mpos.y, 28, (x, y) => { fx.sparkle(x, y, PAL.sun, 8); audio.plink(1.2); });
  const intern = npc({ shirt: PAL.waterShallow });
  motion.addChild(intern);
  ctx.patrol(intern, {
    points: [p(0.2, 0.5), p(0.4, 0.42), p(0.5, 0.3), p(0.42, 0.5)],
    speed: 70, pause: 1.2,
  });
  const camOp = put(motion, npc({ shirt: 0x6b6277 }), p(0.44, 0.345));
  anim(camOp, { kind: 'bob', amp: 1.5, period: 2 });
  const droneCam = drone(30);
  motion.addChild(droneCam);
  ctx.patrol(droneCam, {
    points: [p(0.7, 0.2), p(0.88, 0.16), p(0.92, 0.28), p(0.75, 0.3)],
    speed: 60, pause: 1,
  });
}

function wrap(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
