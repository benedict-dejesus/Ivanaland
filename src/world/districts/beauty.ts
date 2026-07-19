/** Beauty Boulevard — glamorous promenade. Berry accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, bigText, patch } from '../util';
import { house, towerBlock, npc, dog, tree, flowerPatch, lamppost, shadow } from '../props';

export function buildBeauty(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  put(statics, patch(1100, 300, 0xd9c2e8, 0.35), p(0.5, 0.6));

  /* ---- Mirror Salon ---- */
  const salon = new Container();
  salon.addChild(house({ w: 180, h: 110, wall: 0xffe4f0, roof: PAL.berry, windows: 2 }));
  const heart = new Graphics();
  heart.circle(-14, -8, 16).fill(0xfff0fa);
  heart.circle(14, -8, 16).fill(0xfff0fa);
  heart.moveTo(-28, -2).lineTo(0, 30).lineTo(28, -2).closePath().fill(0xfff0fa);
  heart.circle(-14, -8, 16).stroke({ width: 4, color: PAL.sunDark });
  heart.circle(14, -8, 16).stroke({ width: 4, color: PAL.sunDark });
  heart.position.set(0, -160);
  salon.addChild(heart);
  anim(heart, { kind: 'pulse', amp: 0.04, period: 2 });
  put(statics, salon, p(0.3, 0.32));
  put(statics, sign('MIRROR SALON'), p(0.39, 0.35));
  const mpos = p(0.3, 0.29);
  delight(mpos.x, mpos.y - 60, 40, (x, y) => { fx.sparkle(x, y, 0xffffff, 12); audio.plink(1.8); });

  /* ---- boutique + mannequin ---- */
  put(statics, house({ w: 150, h: 100, wall: 0xf3e6ff, roof: 0xd88fc2 }), p(0.55, 0.24));
  const mona = new Container();
  const mg = new Graphics();
  mg.roundRect(-3, -8, 6, 8, 2).fill(0xd7d0e0);
  mg.roundRect(-14, -46, 28, 40, 12).fill(0xe8e2ee);
  mg.circle(0, -54, 10).fill(0xe8e2ee);
  mona.addChild(mg);
  put(motion, mona, p(0.55, 0.29));
  const monaPos = p(0.55, 0.29);
  delight(monaPos.x, monaPos.y, 24, (x, y) => { fx.sparkle(x, y, PAL.berry, 4); audio.plink(2.2); });

  /* ---- dryer chairs row ---- */
  for (let i = 0; i < 2; i++) {
    const chair = new Graphics();
    chair.roundRect(-14, -22, 28, 22, 6).fill(0xd88fc2);
    chair.arc(0, -34, 14, Math.PI * 0.9, Math.PI * 2.1).fill(0xb8b0c9);
    put(statics, wrapG(chair), p(0.36 + i * 0.06, 0.43));
  }

  /* ---- Runway Walk ---- */
  const runway = new Graphics();
  runway.roundRect(-160, -30, 320, 60, 16).fill(0xe8e2ee);
  for (let i = 0; i < 6; i++) runway.rect(-140 + i * 50, -20, 26, 40).fill(0xd4cce0);
  put(statics, wrapG(runway), p(0.5, 0.575));
  const rpos = p(0.42, 0.575);
  delight(rpos.x, rpos.y, 36, (x, y) => { fx.sparkle(x, y, 0xffffff, 10); audio.plink(1.6); });

  /* ---- Perfume Fountain ---- */
  const perf = new Container();
  const pg = new Graphics();
  pg.ellipse(0, 0, 46, 16).fill(0xe0d4f0);
  pg.roundRect(-10, -52, 20, 40, 8).fill({ color: 0xd9b8f0, alpha: 0.85 });
  pg.roundRect(-6, -62, 12, 10, 3).fill(PAL.berryDark);
  perf.addChild(shadow(100, 26), pg);
  const mist = new Graphics();
  mist.circle(0, 0, 8).fill({ color: 0xf0e0ff, alpha: 0.6 });
  mist.circle(10, -8, 6).fill({ color: 0xf0e0ff, alpha: 0.5 });
  mist.position.set(0, -66);
  perf.addChild(mist);
  anim(mist, { kind: 'bob', amp: 5, period: 2.4 });
  put(motion, perf, p(0.7, 0.42));
  const ppos = p(0.7, 0.42);
  delight(ppos.x, ppos.y - 40, 34, (x, y) => { fx.sparkle(x, y, PAL.berry, 10); audio.plink(1.9); });

  /* ---- giant lipstick sculpture (host drawn by PhoneSystem) ---- */
  put(statics, patch(120, 60, 0xd9b8f0, 0.5), p(0.85, 0.665));

  /* ---- Vanity rooftop sign ---- */
  const vanity = new Container();
  vanity.addChild(towerBlock(120, 150, 0xffeef8, 0xd88fc2));
  const vt = bigText('VANITY', 26, PAL.berryDark);
  vt.position.set(0, -170);
  const vbg = new Graphics();
  vbg.roundRect(-64, -186, 128, 34, 10).fill(PAL.cream);
  vanity.addChild(vbg, vt);
  put(statics, vanity, p(0.2, 0.72));

  /* ---- string lights canopy ---- */
  const lights = new Container();
  const cord = new Graphics();
  cord.moveTo(-140, -70).quadraticCurveTo(0, -40, 140, -70).stroke({ width: 2.5, color: PAL.ink, alpha: 0.4 });
  lights.addChild(cord);
  for (let i = 0; i < 7; i++) {
    const t = (i + 0.5) / 7;
    const bulb = new Graphics();
    bulb.circle(0, 0, 6).fill(i % 2 ? PAL.sun : 0xffe9f5);
    bulb.position.set(-140 + t * 280, -70 + Math.sin(t * Math.PI) * 28);
    lights.addChild(bulb);
    anim(bulb, { kind: 'flicker', amp: 0.4, period: 1.6 + i * 0.2 });
  }
  put(motion, lights, p(0.6, 0.83));

  /* ---- shopping bags ---- */
  const bags = new Graphics();
  const bagColors = [PAL.coral, PAL.mint, PAL.sun];
  bagColors.forEach((c, i) => {
    bags.roundRect(i * 24 - 34, -22, 20, 22, 4).fill(c);
    bags.moveTo(i * 24 - 30, -22).quadraticCurveTo(i * 24 - 24, -32, i * 24 - 18, -22).stroke({ width: 2.5, color: c });
  });
  put(statics, wrapG(bags), p(0.63, 0.235));

  /* ---- greenery ---- */
  put(statics, tree(56, 0x6db86a), p(0.08, 0.5));
  put(statics, tree(52, 0x6db86a), p(0.92, 0.45));
  put(statics, tree(58, 0x6db86a), p(0.1, 0.9));
  put(statics, flowerPatch(56, PAL.berry), p(0.45, 0.66));
  put(statics, flowerPatch(48, PAL.coral), p(0.62, 0.64));
  put(statics, lamppost(76), p(0.35, 0.52));
  put(statics, lamppost(76), p(0.65, 0.52));

  /* ---- NPCs ---- */
  const stylist = put(motion, npc({ shirt: PAL.berry, hair: PAL.ink }), p(0.33, 0.4));
  anim(stylist, { kind: 'sway', amp: 0.1, period: 1.2 });
  const bella = npc({ shirt: 0xffd1e8, hair: 0x8d5b34, size: 32 });
  motion.addChild(bella);
  ctx.patrol(bella, { points: [p(0.42, 0.6), p(0.58, 0.6)], speed: 40, pause: 2.5 });
  const bellaPos = p(0.5, 0.6);
  delight(bellaPos.x, bellaPos.y, 30, (x, y) => { fx.sparkle(x, y, 0xffffff, 14); audio.plink(2); });
  const fifi = dog(0xf0e0ff, 26);
  motion.addChild(fifi);
  ctx.patrol(fifi, { points: [p(0.42, 0.7), p(0.52, 0.72), p(0.4, 0.75)], speed: 40, pause: 3.5 });
  const artist = put(motion, npc({ shirt: PAL.mint, size: 30 }), p(0.72, 0.55));
  anim(artist, { kind: 'bob', amp: 1.6, period: 2.1 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
