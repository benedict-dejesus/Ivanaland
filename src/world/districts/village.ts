/** Family Village — cozy homes, laundry lines, lechon Sundays. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, patch } from '../util';
import { house, tree, bush, flowerPatch, npc, dog, cat, chicken, bench, shadow, lamppost } from '../props';

export function buildVillage(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  /* ---- Grand Family House with porch ---- */
  const grand = new Container();
  grand.addChild(house({ w: 200, h: 130, wall: 0xfff0dc, roof: PAL.coral, windows: 3 }));
  const porch = new Graphics();
  porch.roundRect(-120, -8, 240, 22, 8).fill(PAL.wood);
  porch.rect(-120, -30, 8, 26).fill(PAL.woodDark);
  porch.rect(112, -30, 8, 26).fill(PAL.woodDark);
  grand.addChild(porch);
  put(statics, grand, p(0.25, 0.27));
  put(statics, sign('CASA ALEGRE'), p(0.34, 0.3));

  /* ---- other homes ---- */
  put(statics, house({ w: 120, h: 84, wall: 0xe8f4ff, roof: PAL.waterDeep }), p(0.55, 0.22));
  put(statics, house({ w: 110, h: 80, wall: 0xfff3d6, roof: PAL.mint }), p(0.62, 0.13));
  put(statics, house({ w: 120, h: 86, wall: 0xffe9ec, roof: PAL.berry }), p(0.85, 0.62));
  put(statics, house({ w: 100, h: 76, wall: 0xeaffe0, roof: PAL.sunDark }), p(0.16, 0.56));

  /* ---- sari-sari store ---- */
  const store = new Container();
  store.addChild(house({ w: 110, h: 76, wall: 0xffe2b8, roof: PAL.coral }));
  put(statics, store, p(0.66, 0.32));
  put(statics, sign('SARI-SARI'), p(0.57, 0.35));

  /* ---- laundry line ---- */
  const laundry = new Container();
  const line = new Graphics();
  line.moveTo(-90, -66).quadraticCurveTo(0, -56, 90, -66).stroke({ width: 2.5, color: PAL.ink, alpha: 0.5 });
  line.rect(-92, -66, 4, 66).fill(PAL.woodDark);
  line.rect(88, -66, 4, 66).fill(PAL.woodDark);
  laundry.addChild(line);
  const shirtColors = [PAL.coral, PAL.waterShallow, PAL.sun];
  shirtColors.forEach((c, i) => {
    const s = new Graphics();
    s.roundRect(-12, 0, 24, 26, 6).fill(c);
    s.roundRect(-18, 0, 8, 12, 4).fill(c);
    s.roundRect(10, 0, 8, 12, 4).fill(c);
    s.position.set(-45 + i * 45, -62);
    laundry.addChild(s);
    anim(s, { kind: 'sway', amp: 0.1 + i * 0.03, period: 2.2 + i * 0.5 });
  });
  put(motion, laundry, p(0.4, 0.37));
  const lp2 = p(0.4, 0.37);
  delight(lp2.x, lp2.y - 60, 46, (x, y) => { fx.sparkle(x, y, PAL.waterFoam, 6); audio.plink(1.1); });

  /* ---- plaza mango tree ---- */
  const mango = tree(120, 0x5da53f);
  put(statics, mango, p(0.58, 0.56));
  const mangos = new Graphics();
  for (const [mx, my] of [[-24, -78], [10, -92], [28, -70], [-8, -64]] as const) {
    mangos.ellipse(mx, my, 7, 9).fill(PAL.sun);
  }
  put(statics, wrapG(mangos), p(0.58, 0.56));

  /* ---- basketball half-court ---- */
  put(statics, patch(180, 130, 0xd9a986, 0.85), p(0.75, 0.68));
  const hoop = new Graphics();
  hoop.rect(-3, -78, 6, 78).fill(PAL.ink);
  hoop.roundRect(-24, -100, 48, 30, 4).fill(PAL.cream);
  hoop.roundRect(-10, -84, 20, 14, 2).stroke({ width: 3, color: PAL.coral });
  put(statics, wrapG(hoop), p(0.75, 0.7));
  const bball = p(0.73, 0.68);
  delight(bball.x, bball.y, 30, (x, y) => { fx.ring(x, y, PAL.sunDark, 34, 0.5); audio.plink(0.9); });

  /* ---- koi pond ---- */
  const pond = new Graphics();
  pond.ellipse(0, 0, 90, 54).fill(PAL.waterShallow);
  pond.ellipse(0, 0, 74, 42).fill(PAL.waterDeep);
  pond.ellipse(-20, -8, 12, 5).fill({ color: PAL.waterFoam, alpha: 0.6 });
  put(statics, wrapG(pond), p(0.3, 0.76));
  for (let i = 0; i < 3; i++) {
    const koi = new Graphics();
    koi.ellipse(0, 0, 9, 4).fill(i % 2 ? PAL.coral : PAL.cream);
    koi.moveTo(-9, 0).lineTo(-14, -3).lineTo(-14, 3).closePath().fill(i % 2 ? PAL.coral : PAL.cream);
    motion.addChild(koi);
    ctx.patrol(koi, {
      points: [p(0.28 + i * 0.013, 0.75), p(0.32, 0.77 + i * 0.008), p(0.3, 0.74)],
      speed: 26 + i * 8, pause: 0.6,
    });
  }
  const kp = p(0.3, 0.76);
  delight(kp.x, kp.y, 50, (x, y) => { fx.ring(x, y, PAL.waterFoam, 40, 0.5); audio.plink(1.5); });

  /* ---- water tower ---- */
  const wt = new Container();
  const wtg = new Graphics();
  wtg.rect(-26, -90, 6, 90).fill(PAL.woodDark);
  wtg.rect(20, -90, 6, 90).fill(PAL.woodDark);
  wtg.rect(-16, -60, 6, 60).fill(PAL.woodDark);
  wtg.rect(10, -60, 6, 60).fill(PAL.woodDark);
  wtg.ellipse(0, -104, 40, 16).fill(PAL.waterShallow);
  wtg.roundRect(-40, -140, 80, 44, 10).fill(0x9fc9e8);
  wt.addChild(shadow(90, 24), wtg);
  put(statics, wt, p(0.1, 0.53));

  /* ---- chicken coop ---- */
  put(statics, patch(120, 80, 0xd9c9a0, 0.7), p(0.6, 0.87));

  /* ---- garden row + gnome ---- */
  put(statics, flowerPatch(60), p(0.45, 0.64));
  put(statics, flowerPatch(50, PAL.berry), p(0.5, 0.66));
  const gnome = new Graphics();
  gnome.roundRect(-8, -18, 16, 18, 6).fill(PAL.waterDeep);
  gnome.circle(0, -22, 7).fill(PAL.skinA);
  gnome.moveTo(-7, -26).lineTo(7, -26).lineTo(0, -44).closePath().fill(PAL.coral);
  put(statics, wrapG(gnome), p(0.41, 0.61));

  /* ---- trees, bushes, benches ---- */
  for (const [fx1, fy1] of [[0.08, 0.2], [0.4, 0.14], [0.65, 0.12], [0.92, 0.15], [0.06, 0.75], [0.5, 0.93], [0.9, 0.85], [0.68, 0.6]] as const) {
    put(statics, tree(52 + ((fx1 * 100) % 20)), p(fx1, fy1));
  }
  put(statics, bush(30), p(0.35, 0.55));
  put(statics, bench(), p(0.6, 0.55));
  put(statics, lamppost(), p(0.48, 0.4));

  /* ---- NPCs ---- */
  const lola = put(motion, npc({ shirt: PAL.berry, hair: 0xd7d0e0, size: 30 }), p(0.22, 0.31));
  anim(lola, { kind: 'sway', amp: 0.06, period: 2.8 });
  const lolaPos = p(0.22, 0.31);
  delight(lolaPos.x, lolaPos.y, 26, (x, y) => { fx.sparkle(x, y, PAL.coral, 6); audio.plink(1.3); });
  const dad = put(motion, npc({ shirt: PAL.coral, size: 36 }), p(0.33, 0.45));
  anim(dad, { kind: 'bob', amp: 1.5, period: 1.8 });
  const grill = new Graphics();
  grill.roundRect(-18, -22, 36, 10, 4).fill(PAL.ink);
  grill.rect(-14, -12, 4, 12).fill(PAL.ink);
  grill.rect(10, -12, 4, 12).fill(PAL.ink);
  put(statics, wrapG(grill), p(0.36, 0.46));
  const smoke = new Graphics();
  smoke.circle(0, 0, 6).fill({ color: 0xffffff, alpha: 0.5 });
  smoke.circle(5, -10, 8).fill({ color: 0xffffff, alpha: 0.35 });
  put(motion, wrapG(smoke), p(0.36, 0.42));
  anim(motion.children[motion.children.length - 1] as Container, { kind: 'bob', amp: 5, period: 3 });
  const gpos = p(0.36, 0.46);
  delight(gpos.x, gpos.y, 28, (x, y) => { fx.sparkle(x, y, 0xffffff, 6); audio.plink(0.8); });

  for (let i = 0; i < 3; i++) {
    const kid = npc({ shirt: [PAL.sun, PAL.mint, PAL.waterShallow][i]!, size: 24 });
    motion.addChild(kid);
    ctx.patrol(kid, {
      points: [p(0.52 + i * 0.02, 0.46), p(0.6, 0.5 + i * 0.02), p(0.52, 0.54), p(0.48, 0.5)],
      speed: 60 + i * 12, pause: 0.3,
    });
  }

  const rocky = chicken(24);
  motion.addChild(rocky);
  ctx.patrol(rocky, { points: [p(0.58, 0.83), p(0.66, 0.85), p(0.62, 0.9)], speed: 40, pause: 1 });
  const roofCat = put(motion, cat(0xd9a986), p(0.55, 0.16));
  anim(roofCat, { kind: 'bob', amp: 1, period: 3.5 });
  const brownDog = dog(0xc98d5e);
  motion.addChild(brownDog);
  ctx.patrol(brownDog, { points: [p(0.2, 0.45), p(0.35, 0.6), p(0.15, 0.65)], speed: 50, pause: 2 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
