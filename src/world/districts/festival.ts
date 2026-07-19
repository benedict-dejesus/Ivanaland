/** Fan Festival Plaza — the signature district. The Giant Festival Statue lives here. */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../../data/palette';
import type { BuildCtx } from '../context';
import { put, sign, patch } from '../util';
import { npc, tree, banderitas, balloon, shadow, lighten } from '../props';

export function buildFestival(ctx: BuildCtx): void {
  const { p, statics, motion, anim, delight, fx, audio } = ctx;

  put(statics, patch(1200, 1300, 0xe0c9f0, 0.35), p(0.5, 0.5));

  /* ---- THE GIANT FESTIVAL STATUE (Phone #100 home) ---- */
  const statue = new Container();
  const base = new Graphics();
  base.roundRect(-90, -50, 180, 50, 12).fill(0xd7d0e0);
  base.roundRect(-70, -70, 140, 26, 8).fill(0xc4bcd4);
  // plaque
  base.roundRect(-30, -46, 60, 30, 6).fill(PAL.sunDark);
  base.roundRect(-24, -40, 48, 18, 4).fill(PAL.sun);
  const figure = new Graphics();
  // robe
  figure.moveTo(-58, -70).quadraticCurveTo(-30, -220, 0, -230);
  figure.quadraticCurveTo(30, -220, 58, -70);
  figure.closePath();
  figure.fill(0xe8dcf5);
  figure.moveTo(-40, -80).quadraticCurveTo(-20, -200, 0, -210).quadraticCurveTo(20, -200, 40, -80).closePath().fill(0xf5eefc);
  // head
  figure.circle(0, -252, 34).fill(0xf0e6fa);
  // gentle face
  figure.circle(-11, -256, 3.5).fill(PAL.ink);
  figure.circle(11, -256, 3.5).fill(PAL.ink);
  const smile = new Graphics();
  smile.arc(0, -246, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  smile.stroke({ width: 3, color: PAL.ink, alpha: 0.7 });
  // crown
  const crown = new Graphics();
  crown.moveTo(-26, -280).lineTo(-26, -302).lineTo(-13, -288).lineTo(0, -308).lineTo(13, -288).lineTo(26, -302).lineTo(26, -280).closePath().fill(PAL.sun);
  crown.circle(-13, -300, 4).fill(PAL.coral);
  crown.circle(13, -300, 4).fill(PAL.coral);
  crown.circle(0, -312, 5).fill(PAL.phoneGlow);
  // torch arm
  const torch = new Graphics();
  torch.roundRect(-6, -40, 12, 44, 6).fill(0xe8dcf5);
  torch.roundRect(-12, -52, 24, 14, 6).fill(PAL.sunDark);
  torch.position.set(-64, -180);
  const flame = new Graphics();
  flame.circle(0, 0, 12).fill(PAL.sun);
  flame.circle(0, -8, 7).fill(PAL.coral);
  flame.position.set(-64, -236);
  statue.addChild(shadow(220, 60), base, figure, smile, crown, torch, flame);
  anim(flame, { kind: 'pulse', amp: 0.2, period: 0.9 });
  const spos = p(0.5, 0.435);
  put(statics, statue, spos);
  put(statics, sign('THE GIVER'), { x: spos.x + 130, y: spos.y + 10 });

  /* ---- main stage ---- */
  const stage = new Container();
  const sg = new Graphics();
  sg.roundRect(-130, -70, 260, 70, 14).fill(0x554a63);
  sg.roundRect(-130, -76, 260, 12, 6).fill(PAL.berry);
  sg.roundRect(-120, -160, 240, 90, 12).fill({ color: PAL.ink, alpha: 0.85 });
  for (let i = 0; i < 4; i++) sg.circle(-90 + i * 60, -150, 8).fill([PAL.coral, PAL.sun, PAL.mint, PAL.phoneGlow][i]!);
  stage.addChild(shadow(280, 60), sg);
  const stagePos = p(0.25, 0.26);
  put(statics, stage, stagePos);
  delight(stagePos.x, stagePos.y - 60, 60, (x, y) => {
    fx.sparkle(x, y, PAL.berry, 14);
    fx.ring(x, y, PAL.phoneGlow, 60, 0.6);
    audio.chime();
  });
  // speaker stacks
  for (const dx of [-160, 160]) {
    const spk = new Graphics();
    spk.roundRect(-22, -70, 44, 70, 8).fill(PAL.ink);
    spk.circle(0, -50, 13).fill(0x554a63);
    spk.circle(0, -50, 6).fill(0x776a87);
    spk.circle(0, -20, 10).fill(0x554a63);
    put(statics, wrapG(spk), { x: stagePos.x + dx, y: stagePos.y + 10 });
  }

  /* ---- ferris wheel ---- */
  const ferrisPos = p(0.8, 0.33);
  const support = new Graphics();
  support.moveTo(-40, 0).lineTo(0, -140).lineTo(40, 0).closePath().fill(0xc4bcd4);
  put(statics, wrapG(support), { x: ferrisPos.x, y: ferrisPos.y + 150 });
  const wheel = new Container();
  const rim = new Graphics();
  rim.circle(0, 0, 130).stroke({ width: 10, color: PAL.berry });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    rim.moveTo(0, 0).lineTo(Math.cos(a) * 130, Math.sin(a) * 130).stroke({ width: 5, color: PAL.berryDark });
  }
  rim.circle(0, 0, 18).fill(PAL.sun);
  wheel.addChild(rim);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const g = new Graphics();
    g.roundRect(-14, -8, 28, 26, 9).fill([PAL.coral, PAL.sun, PAL.mint, PAL.waterShallow][i % 4]!);
    g.roundRect(-14, -8, 28, 10, 6).fill({ color: 0xffffff, alpha: 0.25 });
    g.position.set(Math.cos(a) * 130, Math.sin(a) * 130);
    wheel.addChild(g);
    // counter-rotate so gondolas hang upright as the wheel spins
    anim(g, { kind: 'spin', speed: -0.16 });
  }
  wheel.position.set(ferrisPos.x, ferrisPos.y + 10);
  motion.addChild(wheel);
  anim(wheel, { kind: 'spin', speed: 0.16 });
  delight(ferrisPos.x, ferrisPos.y, 130, (x, y) => { fx.sparkle(x, y, PAL.berry, 10); audio.plink(1.3); });

  /* ---- fan-art wall ---- */
  const wall = new Graphics();
  wall.roundRect(-90, -80, 180, 80, 8).fill(PAL.cream);
  wall.roundRect(-90, -80, 180, 80, 8).stroke({ width: 5, color: PAL.woodDark });
  wall.roundRect(-74, -66, 40, 30, 4).fill(PAL.coral);
  wall.roundRect(-24, -70, 44, 26, 4).fill(PAL.waterShallow);
  wall.roundRect(28, -64, 40, 34, 4).fill(PAL.sun);
  wall.roundRect(-66, -30, 50, 22, 4).fill(PAL.mint);
  wall.roundRect(0, -34, 56, 24, 4).fill(PAL.berry);
  put(statics, wrapG(wall), p(0.15, 0.63));
  const mia = put(motion, npc({ shirt: PAL.mint, hair: PAL.ink, size: 30 }), p(0.19, 0.645));
  anim(mia, { kind: 'sway', amp: 0.1, period: 1.5 });

  /* ---- photo booth ---- */
  const booth = new Graphics();
  booth.roundRect(-36, -80, 72, 80, 10).fill(PAL.coral);
  booth.roundRect(-28, -72, 56, 34, 6).fill(PAL.ink);
  booth.roundRect(-30, -30, 60, 6, 3).fill(PAL.cream);
  put(statics, wrapG(booth), p(0.65, 0.72));
  put(statics, sign('SMILE!'), p(0.71, 0.75));

  /* ---- merch stand ---- */
  const merch = new Graphics();
  merch.roundRect(-50, -50, 100, 50, 8).fill(PAL.berry);
  merch.roundRect(-56, -66, 112, 20, 8).fill(lighten(PAL.berry, 0.2));
  for (let i = 0; i < 3; i++) merch.circle(-26 + i * 26, -30, 9).fill([PAL.sun, PAL.mint, PAL.coral][i]!);
  put(statics, wrapG(merch), p(0.4, 0.79));

  /* ---- confetti cannons ---- */
  const cpos = p(0.35, 0.615);
  delight(cpos.x - 60, cpos.y, 30, (x, y) => {
    fx.confetti(x, y - 40, 30, 240);
    audio.chime();
  });

  /* ---- balloon arch ---- */
  const archB = new Container();
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const bx = -110 + t * 220;
    const by = -Math.sin(t * Math.PI) * 90;
    const b = balloon([PAL.coral, PAL.sun, PAL.mint, PAL.berry, PAL.waterShallow][i % 5]!, 15);
    b.position.set(bx, by + 24);
    archB.addChild(b);
  }
  put(statics, archB, p(0.5, 0.775));

  /* ---- lantern strings ---- */
  const lanterns = new Container();
  const cord = new Graphics();
  cord.moveTo(-160, -60).quadraticCurveTo(0, -20, 160, -60).stroke({ width: 2.5, color: PAL.ink, alpha: 0.4 });
  lanterns.addChild(cord);
  for (let i = 0; i < 6; i++) {
    const t = (i + 0.5) / 6;
    const l = new Graphics();
    l.roundRect(-9, 0, 18, 24, 7).fill(i % 2 ? PAL.sun : PAL.coral);
    l.rect(-4, 24, 8, 4).fill(PAL.sunDark);
    l.position.set(-160 + t * 320, -58 + Math.sin(t * Math.PI) * 36);
    lanterns.addChild(l);
    anim(l, { kind: 'sway', amp: 0.08, period: 2 + i * 0.3 });
  }
  put(motion, lanterns, p(0.6, 0.57));

  /* ---- crowd blocks ---- */
  for (let b = 0; b < 3; b++) {
    const crowd = new Container();
    for (let i = 0; i < 8; i++) {
      const person = npc({
        shirt: [PAL.coral, PAL.sun, PAL.mint, PAL.berry, PAL.waterShallow][((i + b) * 7) % 5]!,
        size: 22 + ((i * 13) % 6),
      });
      person.position.set((i % 4) * 30 - 45 + (b % 2) * 8, Math.floor(i / 4) * 26 - 13);
      crowd.addChild(person);
      anim(person, { kind: 'bob', amp: 2 + (i % 3), period: 0.9 + (i % 5) * 0.13 });
    }
    const crowdPos = p(0.32 + b * 0.11, 0.34 + (b % 2) * 0.05);
    put(motion, crowd, crowdPos);
    delight(crowdPos.x, crowdPos.y, 55, (x, y) => { fx.sparkle(x, y, PAL.sun, 12); audio.plink(1 + b * 0.2); });
  }

  /* ---- banderitas + greens ---- */
  const band = banderitas(300, 26);
  put(motion, band, p(0.5, 0.16));
  anim(band, { kind: 'sway', amp: 0.02, period: 3.4 });
  put(statics, tree(56), p(0.08, 0.2));
  put(statics, tree(60), p(0.92, 0.18));
  put(statics, tree(54), p(0.9, 0.9));
  put(statics, tree(58), p(0.1, 0.92));

  /* ---- MC + guard ---- */
  const mc = put(motion, npc({ shirt: PAL.sun, hat: PAL.berry, size: 34 }), p(0.25, 0.31));
  anim(mc, { kind: 'bob', amp: 3.5, period: 0.7 });
  const mcPos = p(0.25, 0.31);
  delight(mcPos.x, mcPos.y, 26, (x, y) => { fx.ring(x, y, PAL.sun, 44, 0.5); audio.chime(); });
  const guard = put(motion, npc({ shirt: PAL.ink, hat: PAL.ink }), p(0.44, 0.52));
  anim(guard, { kind: 'sway', amp: 0.03, period: 1.1 });
}

function wrapG(g: Graphics): Container {
  const c = new Container();
  c.addChild(g);
  return c;
}
