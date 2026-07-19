/** Charity Corner — the quiet, glowing heart of Ivanaland. Mint accent. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, patch } from '../util';
import { npc, tree, bush, flowerPatch, giftBox, bench, balloon, shadow } from '../props';

export function buildCharity(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  put(statics, patch(1100, 1300, 0xc2ecdd, 0.4), p(0.5, 0.5));

  /* ---- community pantry ---- */
  const pantry = new Container();
  const pg = new Graphics();
  pg.roundRect(-90, -110, 180, 110, 12).fill(0xe0f5ec);
  pg.roundRect(-90, -128, 180, 30, 12).fill(PAL.mint);
  for (let r = 0; r < 2; r++) {
    pg.rect(-74, -92 + r * 36, 148, 6).fill(PAL.wood);
    for (let i = 0; i < 5; i++) {
      pg.roundRect(-68 + i * 30, -114 + r * 36, 20, 20, 4).fill([PAL.coral, PAL.sun, PAL.waterShallow, PAL.berry, PAL.mintDark][i]!);
    }
  }
  pantry.addChild(shadow(200, 50), pg);
  put(statics, pantry, p(0.7, 0.33));
  put(statics, sign('FREE PANTRY'), p(0.58, 0.36));

  /* ---- gift-wrapping pavilion ---- */
  const pav = new Container();
  const pvg = new Graphics();
  pvg.moveTo(-80, 0).lineTo(-60, -70).lineTo(60, -70).lineTo(80, 0).closePath().fill({ color: PAL.mint, alpha: 0.9 });
  pvg.rect(-74, 0, 8, -8).fill(PAL.woodDark);
  pvg.rect(66, 0, 8, -8).fill(PAL.woodDark);
  pvg.roundRect(-50, -30, 100, 30, 8).fill(PAL.wood);
  pav.addChild(shadow(170, 40), pvg);
  put(statics, pav, p(0.25, 0.66));
  put(statics, giftBox(28, PAL.waterShallow, PAL.coral), p(0.2, 0.7));
  put(statics, giftBox(24, PAL.sun, PAL.berry), p(0.29, 0.71));
  const giftPos = p(0.24, 0.705);
  delight(giftPos.x, giftPos.y, 34, (x, y) => { fx.sparkle(x, y, PAL.mint, 8); audio.plink(1.4); });

  /* ---- donation carousel ---- */
  const carousel = new Container();
  const cg = new Graphics();
  cg.ellipse(0, 0, 80, 26).fill(0xd9f0e6);
  cg.ellipse(0, -4, 66, 20).fill(PAL.mintDark);
  carousel.addChild(shadow(170, 44), cg);
  const spinner = new Container();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const box = giftBox(22, [PAL.coral, PAL.sun, PAL.waterShallow, PAL.berry][i]!, PAL.cream);
    box.position.set(Math.cos(a) * 46, Math.sin(a) * 14 - 10);
    spinner.addChild(box);
  }
  carousel.addChild(spinner);
  put(motion, carousel, p(0.55, 0.62));
  anim(spinner, { kind: 'spin', speed: 0.4 });

  /* ---- teddy shelf ---- */
  const teddyShelf = new Container();
  const tg = new Graphics();
  tg.roundRect(-60, -70, 120, 70, 8).fill(0xf5ead9);
  tg.rect(-52, -44, 104, 5).fill(PAL.wood);
  teddyShelf.addChild(shadow(130, 34), tg);
  for (let i = 0; i < 3; i++) {
    const bear = new Graphics();
    const bc = [0xc98d5e, 0xd9b86a, 0x9a6a3a][i]!;
    bear.circle(0, -10, 9).fill(bc);
    bear.circle(-7, -18, 4).fill(bc);
    bear.circle(7, -18, 4).fill(bc);
    bear.circle(0, -22, 7).fill(bc);
    bear.circle(-2, -23, 1.4).fill(PAL.ink);
    bear.circle(3, -23, 1.4).fill(PAL.ink);
    bear.position.set(-32 + i * 32, -46);
    teddyShelf.addChild(bear);
    if (i === 1) anim(bear, { kind: 'sway', amp: 0.15, period: 2.2 });
  }
  put(statics, teddyShelf, p(0.75, 0.56));
  const tpos = p(0.75, 0.545);
  delight(tpos.x, tpos.y - 46, 40, (x, y) => { fx.sparkle(x, y, PAL.sun, 6); audio.plink(1.7); });

  /* ---- wrapping table + spools ---- */
  const table = new Graphics();
  table.roundRect(-50, -30, 100, 30, 8).fill(PAL.wood);
  table.circle(-30, -38, 10).fill(PAL.coral);
  table.circle(-8, -38, 10).fill(PAL.mint);
  table.circle(14, -38, 10).fill(PAL.berry);
  put(statics, wrapG(table), p(0.3, 0.735));

  /* ---- balloon bouquet at carousel ---- */
  for (let i = 0; i < 3; i++) {
    const b = balloon([PAL.mint, PAL.sun, PAL.coral][i]!, 18);
    const bp = p(0.55 + i * 0.014, 0.605);
    put(motion, b, { x: bp.x, y: bp.y });
    anim(b, { kind: 'sway', amp: 0.1 + i * 0.03, period: 2.4 + i * 0.4 });
  }

  /* ---- pallet stack ---- */
  put(statics, patch(160, 100, 0xd9c9a0, 0.6), p(0.6, 0.46));

  /* ---- letters wall ---- */
  const letters = new Graphics();
  letters.roundRect(-70, -70, 140, 70, 8).fill(0xfff3d6);
  letters.roundRect(-70, -70, 140, 70, 8).stroke({ width: 4, color: PAL.wood });
  for (let i = 0; i < 8; i++) {
    letters.roundRect(-58 + (i % 4) * 30, -60 + Math.floor(i / 4) * 28, 22, 20, 3)
      .fill(i % 3 === 0 ? 0xffe9f5 : 0xffffff);
  }
  put(statics, wrapG(letters), p(0.8, 0.72));
  put(statics, sign('SALAMAT ♥'), p(0.87, 0.77));

  /* ---- blood-drive bus (friendly) ---- */
  const bus = new Container();
  const bg = new Graphics();
  bg.roundRect(-70, -52, 140, 44, 14).fill(PAL.cream);
  bg.roundRect(-70, -52, 140, 16, 10).fill(PAL.coral);
  bg.roundRect(-52, -44, 26, 18, 5).fill(PAL.waterShallow);
  bg.roundRect(-14, -44, 26, 18, 5).fill(PAL.waterShallow);
  bg.roundRect(24, -44, 26, 18, 5).fill(PAL.waterShallow);
  bg.circle(-40, -6, 11).fill(PAL.ink);
  bg.circle(40, -6, 11).fill(PAL.ink);
  bg.circle(0, -30, 8).fill(PAL.coral);
  bus.addChild(shadow(150, 34), bg);
  put(statics, bus, p(0.45, 0.28));

  /* ---- greens ---- */
  for (const [fx1, fy1] of [[0.08, 0.18], [0.35, 0.14], [0.85, 0.15], [0.9, 0.45], [0.08, 0.5], [0.12, 0.88], [0.55, 0.92], [0.9, 0.92]] as const) {
    put(statics, tree(52 + ((fx1 * 149) % 24)), p(fx1, fy1));
  }
  put(statics, bush(30), p(0.4, 0.5));
  put(statics, flowerPatch(56, PAL.mint), p(0.48, 0.44));
  put(statics, flowerPatch(48, PAL.coral), p(0.65, 0.78));
  put(statics, bench(), p(0.15, 0.48));

  /* ---- NPCs ---- */
  for (let i = 0; i < 4; i++) {
    const vol = npc({ shirt: PAL.mint, size: 28 + (i % 2) * 4 });
    const vp = p(0.52 + i * 0.05, 0.5);
    put(motion, vol, vp);
    anim(vol, { kind: 'bob', amp: 2, period: 1 + i * 0.15, phase: i * 0.25 });
  }
  const volPos = p(0.58, 0.5);
  delight(volPos.x, volPos.y, 50, (x, y) => { fx.sparkle(x, y, PAL.mint, 10); audio.plink(1.2); });
  const pia = put(motion, npc({ shirt: PAL.coral, size: 22 }), p(0.43, 0.535));
  anim(pia, { kind: 'bob', amp: 1.6, period: 1.4 });
  const nana = put(motion, npc({ shirt: PAL.berry, hair: 0xd7d0e0, size: 28 }), p(0.16, 0.52));
  anim(nana, { kind: 'sway', amp: 0.06, period: 2.6 });
  const rider = npc({ shirt: PAL.sun, hat: PAL.ink });
  motion.addChild(rider);
  ctx.patrol(rider, { points: [p(0.5, 0.4), p(0.62, 0.42), p(0.56, 0.48)], speed: 48, pause: 1.2 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
