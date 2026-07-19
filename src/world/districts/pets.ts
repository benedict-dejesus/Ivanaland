/** Pet Paradise Park — run by the pets. Grass accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, patch } from '../util';
import { tree, bush, flowerPatch, npc, dog, cat, duck, parrot, bench, shadow } from '../props';

export function buildPets(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  put(statics, patch(1150, 1300, PAL.grassLight, 0.5), p(0.5, 0.5));

  /* ---- bone-shaped pool ---- */
  const pool = new Graphics();
  pool.roundRect(-100, -30, 200, 60, 30).fill(PAL.waterShallow);
  pool.circle(-100, -22, 30).fill(PAL.waterShallow);
  pool.circle(-100, 22, 30).fill(PAL.waterShallow);
  pool.circle(100, -22, 30).fill(PAL.waterShallow);
  pool.circle(100, 22, 30).fill(PAL.waterShallow);
  pool.roundRect(-88, -20, 176, 40, 20).fill(PAL.waterDeep);
  put(statics, wrapG(pool), p(0.3, 0.41));
  const poolPos = p(0.34, 0.41);
  delight(poolPos.x, poolPos.y, 50, (x, y) => {
    fx.ring(x, y, PAL.waterFoam, 46, 0.5);
    fx.sparkle(x, y, PAL.waterShallow, 8);
    audio.plink(1.5);
  });

  /* ---- agility course ---- */
  for (let i = 0; i < 3; i++) {
    const hurdle = new Graphics();
    hurdle.rect(-20, -26, 4, 26).fill(PAL.coral);
    hurdle.rect(16, -26, 4, 26).fill(PAL.coral);
    hurdle.rect(-20, -26, 40, 5).fill(PAL.sun);
    put(statics, wrapG(hurdle), p(0.58 + i * 0.07, 0.28 + (i % 2) * 0.04));
  }
  const tunnel = new Graphics();
  tunnel.arc(0, 0, 26, Math.PI, 0).fill(PAL.berry);
  tunnel.arc(0, 0, 16, Math.PI, 0).fill(PAL.ink);
  put(statics, wrapG(tunnel), p(0.72, 0.24));

  /* ---- Corgi Mayor doghouse area (host art by PhoneSystem) ---- */
  put(statics, sign('MAYOR 🐕'), p(0.56, 0.62));

  /* ---- cat tower pagoda ---- */
  const pagoda = new Container();
  const pg = new Graphics();
  for (let i = 0; i < 3; i++) {
    const w = 90 - i * 22;
    pg.roundRect(-w / 2, -30 - i * 44, w, 16, 6).fill(PAL.coralDark);
    pg.roundRect(-w / 2 + 10, -44 - i * 44, w - 20, 30, 6).fill(0xf3d9b8);
  }
  pg.moveTo(-20, -132).lineTo(0, -156).lineTo(20, -132).closePath().fill(PAL.coralDark);
  pagoda.addChild(shadow(110, 30), pg);
  put(statics, pagoda, p(0.8, 0.56));
  const ming = put(motion, cat(0xb8b0c9, 28), p(0.8, 0.475));
  anim(ming, { kind: 'bob', amp: 1, period: 4 });
  const mingPos = p(0.8, 0.475);
  delight(mingPos.x, mingPos.y, 24, (x, y) => { fx.sparkle(x, y, PAL.sun, 3); audio.plink(2.4); });

  /* ---- duck pond ---- */
  const pond = new Graphics();
  pond.ellipse(0, 0, 110, 64).fill(PAL.waterShallow);
  pond.ellipse(0, 0, 92, 50).fill(PAL.waterDeep);
  pond.ellipse(30, 10, 16, 7).fill(PAL.jungle);
  pond.ellipse(-34, -14, 13, 6).fill(PAL.jungle);
  put(statics, wrapG(pond), p(0.25, 0.76));
  for (let i = 0; i < 4; i++) {
    const d = duck(16 - i * 1.5);
    motion.addChild(d);
    ctx.patrol(d, {
      points: [p(0.2 + i * 0.012, 0.74), p(0.3, 0.76 + i * 0.006), p(0.24, 0.79)],
      speed: 24, pause: 0.8,
    });
  }

  /* ---- groomer tent ---- */
  const gt = new Graphics();
  gt.moveTo(-50, 0).lineTo(0, -60).lineTo(50, 0).closePath().fill(PAL.mint);
  gt.moveTo(-12, 0).lineTo(0, -24).lineTo(12, 0).closePath().fill(PAL.mintDark);
  put(statics, wrapG(gt), p(0.7, 0.83));
  put(statics, sign('GROOMER'), p(0.78, 0.86));

  /* ---- frisbees & toys ---- */
  const toys = new Graphics();
  toys.ellipse(-14, -4, 14, 5).fill(PAL.coral);
  toys.ellipse(6, -2, 14, 5).fill(PAL.sun);
  toys.ellipse(-2, -8, 14, 5).fill(PAL.waterShallow);
  put(statics, wrapG(toys), p(0.65, 0.29));
  const ball = new Graphics();
  ball.circle(0, -7, 8).fill(PAL.coral);
  ball.moveTo(-8, -7).quadraticCurveTo(0, -13, 8, -7).stroke({ width: 2, color: PAL.cream });
  const ballPos = p(0.48, 0.35);
  put(motion, wrapG(ball), ballPos);
  delight(ballPos.x, ballPos.y, 26, (x, y) => { fx.ring(x, y, PAL.coral, 30, 0.5); audio.plink(1.2); });

  /* ---- kibble bowl ---- */
  const bowl = new Graphics();
  bowl.ellipse(0, -4, 18, 7).fill(PAL.coralDark);
  bowl.ellipse(0, -7, 13, 4.5).fill(0xd9a05e);
  put(statics, wrapG(bowl), p(0.415, 0.68));

  /* ---- old oak + birdhouse pole ---- */
  put(statics, tree(110, 0x5b9142), p(0.12, 0.58));

  /* ---- greenery ---- */
  for (const [fx1, fy1] of [[0.06, 0.15], [0.3, 0.12], [0.55, 0.1], [0.85, 0.14], [0.92, 0.35], [0.9, 0.92], [0.5, 0.95], [0.08, 0.92]] as const) {
    put(statics, tree(50 + ((fx1 * 137) % 26)), p(fx1, fy1));
  }
  put(statics, bush(34), p(0.4, 0.55));
  put(statics, bush(28), p(0.6, 0.5));
  put(statics, flowerPatch(50), p(0.35, 0.3));
  put(statics, bench(), p(0.5, 0.52));
  put(statics, bench(), p(0.18, 0.68));

  /* ---- NPCs & pets ---- */
  const corgi = dog(0xe8a45e, 26);
  motion.addChild(corgi);
  ctx.patrol(corgi, { points: [p(0.5, 0.56), p(0.6, 0.6), p(0.55, 0.68), p(0.45, 0.64)], speed: 45, pause: 1.4 });
  const walker = npc({ shirt: PAL.waterDeep });
  motion.addChild(walker);
  ctx.patrol(walker, { points: [p(0.3, 0.55), p(0.45, 0.5), p(0.55, 0.55), p(0.4, 0.6)], speed: 38, pause: 1 });
  for (let i = 0; i < 2; i++) {
    const leashDog = dog([0x8d8598, 0x5b4a3a][i]!, 22);
    motion.addChild(leashDog);
    ctx.patrol(leashDog, {
      points: [p(0.32 + i * 0.03, 0.57), p(0.46, 0.52 + i * 0.02), p(0.56, 0.57), p(0.42, 0.61)],
      speed: 40, pause: 0.9,
    });
  }
  const pol = put(motion, parrot(32), p(0.9, 0.36));
  anim(pol, { kind: 'bob', amp: 2, period: 1.8 });
  const perch = new Graphics();
  perch.rect(-3, -60, 6, 60).fill(PAL.woodDark);
  perch.rect(-24, -60, 48, 5).fill(PAL.wood);
  put(statics, wrapG(perch), p(0.9, 0.365));
  const retriever = put(motion, dog(0xd9b86a, 30), p(0.53, 0.44));
  anim(retriever, { kind: 'bob', amp: 1.6, period: 1.1 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
