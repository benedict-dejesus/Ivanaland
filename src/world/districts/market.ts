/** Foodie Market — fiesta of stalls under banderitas. Coral accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, bigText, patch } from '../util';
import { stall, banderitas, crate, npc, bird, tree, umbrella, shadow, lighten } from '../props';

export function buildMarket(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  put(statics, patch(1000, 950, 0xe8cdb0, 0.45), p(0.5, 0.5));

  /* ---- Market Hall arch ---- */
  const arch = new Container();
  const ag = new Graphics();
  ag.rect(-150, -140, 22, 140).fill(PAL.coralDark);
  ag.rect(128, -140, 22, 140).fill(PAL.coralDark);
  ag.roundRect(-160, -180, 320, 52, 22).fill(PAL.coral);
  arch.addChild(ag, (() => { const t = bigText('FOODIE MARKET', 26, PAL.cream); t.position.set(0, -154); return t; })());
  put(statics, arch, p(0.5, 0.22));
  const band1 = banderitas(340, 30);
  put(motion, band1, p(0.5, 0.17));
  anim(band1, { kind: 'sway', amp: 0.03, period: 3 });
  const bpos = p(0.5, 0.17);
  delight(bpos.x, bpos.y, 60, (x, y) => { fx.sparkle(x, y, PAL.coral, 8); audio.plink(1.2); });

  /* ---- stalls ---- */
  put(statics, stall(100, PAL.coral), p(0.28, 0.37));           // fruit/scale stall
  put(statics, stall(96, PAL.sun), p(0.45, 0.47));              // soup stall
  put(statics, stall(92, PAL.mint), p(0.15, 0.42));             // halo-halo
  put(statics, sign('HALO-HALO'), p(0.15, 0.34));
  put(statics, stall(92, PAL.berry), p(0.15, 0.77));            // fish stall
  put(statics, stall(88, PAL.waterShallow), p(0.35, 0.57));     // fruit pyramid stall

  /* ---- halo-halo glass tower ---- */
  const halo = new Graphics();
  halo.moveTo(-14, 0).lineTo(14, 0).lineTo(9, -34).lineTo(-9, -34).closePath().fill(0xf3e0ff);
  halo.ellipse(0, -34, 9, 4).fill(0xd9b8f0);
  halo.ellipse(0, -38, 7, 4).fill(PAL.berry);
  halo.circle(0, -44, 4).fill(PAL.coral);
  put(statics, wrapG(halo), p(0.2, 0.415));

  /* ---- fruit pyramid ---- */
  const fruits = new Graphics();
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= 2 - row; i++) {
      fruits.ellipse((i - (2 - row) / 2) * 20, -10 - row * 16, 10, 11).fill(row === 1 ? PAL.sunDark : PAL.sun);
    }
  }
  put(statics, wrapG(fruits), p(0.35, 0.555));
  const fpPos = p(0.35, 0.555);
  delight(fpPos.x + 40, fpPos.y, 26, (x, y) => { fx.ring(x, y, PAL.sun, 30, 0.45); audio.plink(1.1); });

  /* ---- lechon float ---- */
  const lechon = new Container();
  const lg = new Graphics();
  lg.roundRect(-90, -30, 180, 30, 10).fill(PAL.wood);
  lg.circle(-70, 0, 14).fill(PAL.ink);
  lg.circle(70, 0, 14).fill(PAL.ink);
  lg.ellipse(0, -58, 70, 32).fill(0xd98d4a);
  lg.ellipse(-58, -66, 16, 12).fill(0xd98d4a);
  lg.circle(-64, -68, 2.5).fill(PAL.ink);
  lg.ellipse(20, -74, 30, 10).fill(0xe8a45e);
  lechon.addChild(shadow(190, 40), lg);
  put(statics, lechon, p(0.75, 0.37));
  put(statics, sign('LECHON!'), p(0.83, 0.42));

  /* ---- chili challenge stage ---- */
  const stage = new Container();
  const sg = new Graphics();
  sg.roundRect(-90, -40, 180, 40, 10).fill(PAL.coralDark);
  sg.roundRect(-90, -46, 180, 10, 5).fill(PAL.coral);
  stage.addChild(shadow(200, 44), sg);
  const chili = new Graphics();
  chili.ellipse(0, -16, 8, 14).fill(PAL.coral);
  chili.moveTo(0, -30).quadraticCurveTo(6, -36, 10, -32).stroke({ width: 4, color: PAL.jungle, cap: 'round' });
  chili.position.set(-50, -46);
  stage.addChild(chili);
  put(statics, stage, p(0.8, 0.71));
  put(statics, sign('CHILI KING'), p(0.72, 0.75));
  const contestant = put(motion, npc({ shirt: PAL.coral, skin: 0xf2a0a0 }), p(0.83, 0.68));
  anim(contestant, { kind: 'bob', amp: 2.5, period: 0.9 });
  const cpos = p(0.83, 0.68);
  delight(cpos.x, cpos.y, 26, (x, y) => { fx.sparkle(x, y, PAL.coral, 10); audio.plink(0.6); });

  /* ---- taho cart ---- */
  const cart = new Graphics();
  cart.roundRect(-30, -34, 60, 24, 8).fill(PAL.sun);
  cart.circle(-16, -6, 8).fill(PAL.ink);
  cart.circle(16, -6, 8).fill(PAL.ink);
  cart.roundRect(-8, -52, 16, 18, 4).fill(0xc9c2d4);
  put(statics, wrapG(cart), p(0.55, 0.815));

  /* ---- ice blocks at fish stall ---- */
  const ice = new Graphics();
  ice.roundRect(-26, -18, 24, 18, 4).fill({ color: 0xcdeeff, alpha: 0.9 });
  ice.roundRect(2, -22, 24, 22, 4).fill({ color: 0xb8e4fa, alpha: 0.9 });
  put(statics, wrapG(ice), p(0.15, 0.76));

  /* ---- crates & produce ---- */
  put(statics, crate(36), p(0.58, 0.62));
  put(statics, crate(28), p(0.64, 0.63));
  put(statics, umbrella(70, PAL.sun), p(0.62, 0.5));
  put(statics, umbrella(64, PAL.mint), p(0.25, 0.62));
  put(statics, tree(60), p(0.06, 0.2));
  put(statics, tree(54), p(0.92, 0.2));
  put(statics, tree(58), p(0.9, 0.9));

  /* ---- weighing scale ---- */
  const scale = new Graphics();
  scale.rect(-2.5, -30, 5, 30).fill(PAL.ink);
  scale.circle(0, -34, 10).fill(PAL.sunDark);
  scale.circle(0, -34, 6).fill(PAL.cream);
  scale.moveTo(-14, -20).lineTo(14, -20).stroke({ width: 3, color: PAL.ink });
  scale.ellipse(0, -16, 16, 4).fill(0xb9b2c4);
  put(statics, wrapG(scale), p(0.28, 0.36));

  /* ---- NPCs ---- */
  const vendor = put(motion, npc({ shirt: PAL.sun, hat: PAL.cream }), p(0.44, 0.44));
  anim(vendor, { kind: 'bob', amp: 2.5, period: 1.3 });
  const vpos = p(0.44, 0.44);
  delight(vpos.x, vpos.y, 26, (x, y) => { fx.sparkle(x, y, PAL.sun, 8); audio.plink(1.4); });
  const tito = npc({ shirt: PAL.waterShallow, hat: PAL.sunDark });
  motion.addChild(tito);
  ctx.patrol(tito, { points: [p(0.5, 0.7), p(0.65, 0.75), p(0.5, 0.85), p(0.4, 0.75)], speed: 45, pause: 1.6 });
  const gull = bird(lighten(PAL.waterShallow, 0.3), 18);
  motion.addChild(gull);
  ctx.patrol(gull, { points: [p(0.12, 0.7), p(0.2, 0.68), p(0.25, 0.74), p(0.1, 0.78)], speed: 90, pause: 2 });
  const shopper = npc({ shirt: PAL.berry, size: 30 });
  motion.addChild(shopper);
  ctx.patrol(shopper, { points: [p(0.3, 0.4), p(0.45, 0.52), p(0.6, 0.56), p(0.4, 0.62)], speed: 55, pause: 1.2 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
