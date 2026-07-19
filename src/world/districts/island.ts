/** Adventure Island — jungle playground across a rope bridge. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign } from '../util';
import { palm, npc, monkey, crab, parrot, tree, bush, rock, shadow } from '../props';

export function buildIsland(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  /* ---- rope bridge (to mainland, west) ---- */
  const bridge = new Container();
  const bg = new Graphics();
  bg.moveTo(-170, -14).quadraticCurveTo(0, 8, 170, -14).stroke({ width: 4, color: PAL.woodDark });
  bg.moveTo(-170, -44).quadraticCurveTo(0, -24, 170, -44).stroke({ width: 3, color: PAL.woodDark });
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const bx = -170 + t * 340;
    const by = 8 * 4 * t * (1 - t) - 14;
    bg.roundRect(bx - 9, by - 3, 18, 8, 3).fill(PAL.wood);
    if (i % 2 === 0) bg.moveTo(bx, by).lineTo(bx, by - 28 + 6 * Math.sin(t * Math.PI)).stroke({ width: 2, color: PAL.woodDark, alpha: 0.7 });
  }
  bridge.addChild(bg);
  put(statics, bridge, p(0.115, 0.745));

  /* ---- volcano lookout ---- */
  const volcano = new Container();
  const vg = new Graphics();
  vg.moveTo(-110, 0).quadraticCurveTo(-40, -120, -14, -128);
  vg.lineTo(14, -128);
  vg.quadraticCurveTo(40, -120, 110, 0);
  vg.closePath();
  vg.fill(0x8a6f5c);
  vg.moveTo(-60, -50).quadraticCurveTo(-20, -100, 0, -104).quadraticCurveTo(20, -100, 60, -50).closePath().fill(0xa08a75);
  vg.ellipse(0, -126, 34, 10).fill(0x6e4a3a);
  vg.ellipse(0, -126, 22, 6).fill(PAL.coral);
  volcano.addChild(shadow(240, 60), vg);
  const vpos = p(0.5, 0.19);
  put(statics, volcano, vpos);
  const smoke = new Graphics();
  smoke.circle(0, 0, 12).fill({ color: 0xffffff, alpha: 0.45 });
  smoke.circle(10, -14, 9).fill({ color: 0xffffff, alpha: 0.35 });
  smoke.circle(-6, -24, 7).fill({ color: 0xffffff, alpha: 0.25 });
  const smokeNode = put(motion, wrapG(smoke), { x: vpos.x, y: vpos.y - 140 });
  anim(smokeNode, { kind: 'bob', amp: 8, period: 4 });
  delight(vpos.x, vpos.y - 60, 70, (x, y) => {
    fx.ring(x, y - 60, 0xffffff, 40, 0.8);
    audio.plink(0.5);
  });

  /* ---- waterfall + cave ---- */
  const falls = new Container();
  const cliff = new Graphics();
  cliff.roundRect(-90, -110, 180, 110, 18).fill(0x7a8a6a);
  cliff.roundRect(-90, -110, 180, 24, 14).fill(0x91a37e);
  cliff.ellipse(0, -8, 40, 22).fill(0x3a4a3a);
  falls.addChild(shadow(200, 50), cliff);
  const water = new Graphics();
  water.roundRect(-26, -104, 52, 100, 10).fill({ color: PAL.waterShallow, alpha: 0.9 });
  water.roundRect(-16, -104, 12, 100, 6).fill({ color: PAL.waterFoam, alpha: 0.8 });
  falls.addChild(water);
  anim(water, { kind: 'flicker', amp: 0.25, period: 1.1 });
  const pool = new Graphics();
  pool.ellipse(0, 10, 70, 24).fill(PAL.waterShallow);
  pool.ellipse(0, 10, 52, 16).fill(PAL.waterDeep);
  falls.addChild(pool);
  const fpos = p(0.35, 0.37);
  put(statics, falls, fpos);

  /* ---- zipline towers ---- */
  const t1 = p(0.6, 0.27);
  const t2 = p(0.85, 0.42);
  const zip = new Graphics();
  zip.moveTo(t1.x, t1.y - 90).lineTo(t2.x, t2.y - 70).stroke({ width: 3, color: PAL.ink, alpha: 0.6 });
  statics.addChild(zip);
  for (const [tp, hgt] of [[t1, 100], [t2, 80]] as const) {
    const towerG = new Graphics();
    towerG.moveTo(-30, 0).lineTo(-12, -hgt).lineTo(12, -hgt).lineTo(30, 0).closePath().fill(PAL.woodDark);
    towerG.rect(-20, -hgt * 0.55, 40, 6).fill(PAL.wood);
    towerG.roundRect(-18, -hgt - 10, 36, 12, 4).fill(PAL.wood);
    put(statics, wrapG(towerG), tp);
  }
  const zee = npc({ shirt: PAL.coral, size: 24 });
  motion.addChild(zee);
  ctx.patrol(zee, { points: [{ x: t1.x, y: t1.y - 92 }, { x: t2.x, y: t2.y - 72 }], speed: 150, pause: 3 });
  delight((t1.x + t2.x) / 2, (t1.y + t2.y) / 2 - 80, 50, (x, y) => { fx.sparkle(x, y, PAL.coral, 8); audio.plink(1.8); });

  /* ---- shipwreck cove ---- */
  const ship = new Container();
  const sg = new Graphics();
  sg.moveTo(-90, 0).quadraticCurveTo(0, 34, 90, -6);
  sg.lineTo(70, -44).lineTo(-70, -40).closePath().fill(PAL.woodDark);
  sg.rect(-60, -40, 120, 8).fill(PAL.wood);
  sg.rect(-4, -120, 8, 80).fill(PAL.wood);
  sg.moveTo(4, -116).lineTo(54, -96).lineTo(4, -76).closePath().fill({ color: PAL.cream, alpha: 0.9 });
  sg.ellipse(0, -124, 16, 8).fill(PAL.wood);
  ship.addChild(shadow(200, 44), sg);
  ship.rotation = -0.06;
  put(statics, ship, p(0.8, 0.78));
  put(statics, sign('S.S. SIGNAL'), p(0.68, 0.85));
  const flock = new Container();
  for (let i = 0; i < 3; i++) {
    const pr = parrot(20);
    pr.position.set(-20 + i * 20, -i * 6);
    flock.addChild(pr);
    anim(pr, { kind: 'bob', amp: 1.5, period: 1.4 + i * 0.3 });
  }
  put(motion, flock, { x: p(0.8, 0.78).x, y: p(0.8, 0.78).y - 126 });

  /* ---- tiki shrine ---- */
  const tiki = new Graphics();
  tiki.roundRect(-24, -70, 48, 70, 10).fill(PAL.woodDark);
  tiki.roundRect(-18, -62, 36, 16, 5).fill(PAL.sunDark);
  tiki.roundRect(-14, -40, 10, 8, 2).fill(PAL.cream);
  tiki.roundRect(4, -40, 10, 8, 2).fill(PAL.cream);
  tiki.roundRect(-12, -24, 24, 10, 3).fill(PAL.ink);
  tiki.moveTo(-30, -70).lineTo(0, -88).lineTo(30, -70).closePath().fill(PAL.jungle);
  put(statics, wrapG(tiki), p(0.45, 0.67));

  /* ---- glow grove ---- */
  const grove = new Container();
  for (let i = 0; i < 5; i++) {
    const m = new Graphics();
    const mx = (i % 3) * 26 - 26;
    const my = Math.floor(i / 3) * 20 - 10;
    m.rect(mx - 3, my - 12, 6, 12).fill(0xd9e8d0);
    m.ellipse(mx, my - 14, 11, 7).fill(0x9fe8d0);
    m.ellipse(mx, my - 16, 7, 4).fill({ color: 0xcdfff0, alpha: 0.9 });
    grove.addChild(m);
    anim(m, { kind: 'flicker', amp: 0.3, period: 1.8 + i * 0.4 });
  }
  put(motion, grove, p(0.25, 0.61));

  /* ---- kayaks + campfire beach ---- */
  const kayak = new Graphics();
  kayak.ellipse(0, -6, 40, 10).fill(PAL.coral);
  kayak.ellipse(0, -7, 18, 5).fill(PAL.ink);
  put(statics, wrapG(kayak), p(0.6, 0.885));
  const fire = new Container();
  const logs = new Graphics();
  logs.roundRect(-16, -6, 32, 6, 3).fill(PAL.woodDark);
  logs.roundRect(-14, -9, 28, 5, 2).fill(PAL.wood);
  const flame2 = new Graphics();
  flame2.circle(0, -14, 9).fill(PAL.sun);
  flame2.circle(0, -20, 5).fill(PAL.coral);
  fire.addChild(logs, flame2);
  anim(flame2, { kind: 'pulse', amp: 0.25, period: 0.7 });
  put(motion, fire, p(0.52, 0.82));
  const firePos = p(0.52, 0.82);
  delight(firePos.x, firePos.y, 28, (x, y) => { fx.sparkle(x, y, PAL.sun, 8); audio.plink(0.8); });

  /* ---- banana grove + monkey ---- */
  const bananas = new Graphics();
  for (let i = 0; i < 4; i++) {
    bananas.moveTo(i * 10 - 15, -30).quadraticCurveTo(i * 10 - 10, -40, i * 10 - 5, -32)
      .stroke({ width: 6, color: PAL.sun, cap: 'round' });
  }
  put(statics, wrapG(bananas), p(0.3, 0.52));
  const mo = monkey(30);
  motion.addChild(mo);
  ctx.patrol(mo, { points: [p(0.28, 0.53), p(0.34, 0.5), p(0.32, 0.56)], speed: 55, pause: 1.6 });
  const moPos = p(0.31, 0.53);
  delight(moPos.x, moPos.y, 34, (x, y) => { fx.sparkle(x, y, PAL.sun, 6); audio.plink(1.6); });

  /* ---- crab conga ---- */
  for (let i = 0; i < 5; i++) {
    const cr = crab(15);
    motion.addChild(cr);
    ctx.patrol(cr, {
      points: [p(0.56 + i * 0.02, 0.93), p(0.72 + i * 0.01, 0.9), p(0.64, 0.95)],
      speed: 30 + i * 4, pause: 0.5,
    });
  }
  const crabPos = p(0.64, 0.92);
  delight(crabPos.x, crabPos.y, 40, (x, y) => { fx.sparkle(x, y, PAL.coral, 8); audio.plink(2); });

  /* ---- jungle fill ---- */
  for (const [fx1, fy1] of [[0.15, 0.25], [0.22, 0.42], [0.42, 0.5], [0.62, 0.55], [0.7, 0.62], [0.9, 0.6], [0.55, 0.72], [0.2, 0.85], [0.35, 0.9], [0.9, 0.25]] as const) {
    const pl = ((fx1 * 10) % 2 < 1) ? palm(70 + ((fx1 * 191) % 26)) : tree(56 + ((fy1 * 131) % 22), PAL.jungleDark);
    put(statics, pl, p(fx1, fy1));
  }
  put(statics, bush(36, PAL.jungleDark), p(0.48, 0.44));
  put(statics, bush(30, PAL.jungleDark), p(0.66, 0.47));
  put(statics, rock(30), p(0.42, 0.24));
  put(statics, rock(24), p(0.75, 0.55));

  /* ---- explorer Ed ---- */
  const ed = put(motion, npc({ shirt: 0xd9c9a0, hat: PAL.jungle }), p(0.55, 0.62));
  anim(ed, { kind: 'sway', amp: 0.12, period: 2.4 });
  const edPos = p(0.55, 0.62);
  delight(edPos.x, edPos.y, 26, (x, y) => { fx.ring(x, y, PAL.jungle, 30, 0.5); audio.plink(1.1); });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
