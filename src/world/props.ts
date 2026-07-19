/**
 * IVANALAND prop factories — chunky, friendly vector art.
 * Every factory returns a Container whose origin sits at the prop's "feet".
 */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../data/palette';

export function shadow(w: number, h = w * 0.32, alpha = 0.12): Graphics {
  const g = new Graphics();
  g.ellipse(0, 0, w / 2, h / 2).fill({ color: PAL.shadow, alpha: alpha * 0.5 });
  g.ellipse(0, 0, w * 0.37, h * 0.37).fill({ color: PAL.shadow, alpha });
  return g;
}

function darken(color: number, f = 0.78): number {
  const r = ((color >> 16) & 0xff) * f;
  const g = ((color >> 8) & 0xff) * f;
  const b = (color & 0xff) * f;
  return (r << 16) | (g << 8) | b;
}

export function lighten(color: number, f = 0.25): number {
  const r = Math.min(255, ((color >> 16) & 0xff) + 255 * f);
  const g = Math.min(255, ((color >> 8) & 0xff) + 255 * f);
  const b = Math.min(255, (color & 0xff) + 255 * f);
  return (r << 16) | (g << 8) | b;
}

/* ---------------- Nature ---------------- */

export function tree(size = 60, leaf: number = PAL.grassDark): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.95, size * 0.3));
  const g = new Graphics();
  // trunk with side light
  g.roundRect(-size * 0.075, -size * 0.46, size * 0.15, size * 0.49, size * 0.05).fill(PAL.woodDark);
  g.roundRect(-size * 0.075, -size * 0.46, size * 0.065, size * 0.49, size * 0.03).fill(PAL.wood);
  const crown = new Graphics();
  const dark = darken(leaf, 0.78);
  // dark under-canopy silhouette
  crown.circle(0, -size * 0.64, size * 0.4).fill(dark);
  crown.circle(-size * 0.27, -size * 0.5, size * 0.29).fill(dark);
  crown.circle(size * 0.27, -size * 0.52, size * 0.3).fill(dark);
  // mid-tone lobes
  crown.circle(-size * 0.2, -size * 0.56, size * 0.26).fill(leaf);
  crown.circle(size * 0.2, -size * 0.58, size * 0.26).fill(leaf);
  crown.circle(0, -size * 0.74, size * 0.3).fill(leaf);
  // sun-lit top lobes
  crown.circle(-size * 0.08, -size * 0.82, size * 0.18).fill(lighten(leaf, 0.16));
  crown.circle(size * 0.15, -size * 0.7, size * 0.13).fill(lighten(leaf, 0.13));
  // highlight sparks
  crown.circle(-size * 0.2, -size * 0.64, size * 0.045).fill(lighten(leaf, 0.32));
  crown.circle(size * 0.05, -size * 0.87, size * 0.04).fill(lighten(leaf, 0.32));
  crown.circle(size * 0.24, -size * 0.62, size * 0.035).fill(lighten(leaf, 0.28));
  c.addChild(g, crown);
  return c;
}

export function palm(size = 80): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.8));
  const trunk = new Graphics();
  trunk.moveTo(0, 0);
  trunk.bezierCurveTo(size * 0.08, -size * 0.4, size * 0.16, -size * 0.6, size * 0.24, -size * 0.85);
  trunk.stroke({ width: size * 0.09, color: PAL.wood, cap: 'round' });
  c.addChild(trunk);
  const fronds = new Container();
  fronds.position.set(size * 0.24, -size * 0.85);
  for (let i = 0; i < 5; i++) {
    const f = new Graphics();
    const a = -Math.PI * 0.9 + (i / 4) * Math.PI * 0.85;
    f.moveTo(0, 0);
    f.quadraticCurveTo(Math.cos(a) * size * 0.4, Math.sin(a) * size * 0.4 - size * 0.1,
      Math.cos(a) * size * 0.62, Math.sin(a) * size * 0.62 + size * 0.16);
    f.stroke({ width: size * 0.11, color: i % 2 ? PAL.jungle : PAL.jungleDark, cap: 'round' });
    fronds.addChild(f);
  }
  const coco = new Graphics();
  coco.circle(-size * 0.05, size * 0.02, size * 0.06).fill(PAL.woodDark);
  coco.circle(size * 0.07, size * 0.04, size * 0.06).fill(PAL.woodDark);
  fronds.addChild(coco);
  c.addChild(fronds);
  (c as Container & { fronds?: Container }).fronds = fronds;
  return c;
}

export function bush(size = 34, color: number = PAL.grassDark): Container {
  const c = new Container();
  const g = new Graphics();
  g.circle(-size * 0.25, -size * 0.2, size * 0.28).fill(color);
  g.circle(size * 0.22, -size * 0.22, size * 0.3).fill(color);
  g.circle(0, -size * 0.38, size * 0.3).fill(lighten(color, 0.12));
  c.addChild(g);
  return c;
}

export function flowerPatch(size = 40, petal: number = PAL.coral): Container {
  const c = new Container();
  const g = new Graphics();
  for (let i = 0; i < 5; i++) {
    const x = (Math.random() - 0.5) * size;
    const y = (Math.random() - 0.5) * size * 0.6;
    g.circle(x, y, 4.5).fill(i % 2 ? petal : PAL.sun);
    g.circle(x, y, 1.8).fill(PAL.cream);
  }
  c.addChild(g);
  return c;
}

export function rock(size = 26): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, -size * 0.18, size * 0.5, size * 0.34).fill(0xb9b2c4);
  g.ellipse(-size * 0.12, -size * 0.3, size * 0.24, size * 0.16).fill(0xcdc7d6);
  c.addChild(g);
  return c;
}

/* ---------------- Buildings ---------------- */

export interface HouseOpts {
  w?: number; h?: number;
  wall?: number; roof?: number; door?: number;
  windows?: number;
}

export function house(o: HouseOpts = {}): Container {
  const w = o.w ?? 130;
  const h = o.h ?? 90;
  const wall = o.wall ?? PAL.cream;
  const roof = o.roof ?? PAL.coral;
  const c = new Container();
  c.addChild(shadow(w * 1.1, w * 0.3));
  const g = new Graphics();
  g.roundRect(-w / 2, -h, w, h, 8).fill(wall);
  // roof
  g.moveTo(-w * 0.62, -h + 6);
  g.lineTo(0, -h - w * 0.34);
  g.lineTo(w * 0.62, -h + 6);
  g.closePath();
  g.fill(roof);
  g.moveTo(-w * 0.62, -h + 6);
  g.lineTo(0, -h - w * 0.34);
  g.lineTo(0, -h - w * 0.34 + 8);
  g.lineTo(-w * 0.52, -h + 12);
  g.closePath();
  g.fill(lighten(roof, 0.16));
  // door
  g.roundRect(-w * 0.1, -h * 0.42, w * 0.2, h * 0.42, 6).fill(o.door ?? PAL.woodDark);
  // windows
  const wins = o.windows ?? 2;
  for (let i = 0; i < wins; i++) {
    const wx = -w * 0.32 + (i * w * 0.64) / Math.max(1, wins - 1);
    if (Math.abs(wx) < w * 0.16) continue;
    g.roundRect(wx - 9, -h * 0.72, 18, 18, 4).fill(PAL.waterShallow);
    g.roundRect(wx - 9, -h * 0.72, 18, 8, 3).fill(lighten(PAL.waterShallow, 0.2));
  }
  c.addChild(g);
  return c;
}

export function towerBlock(w = 110, h = 200, wall: number = 0xfae9c8, band: number = PAL.sun): Container {
  const c = new Container();
  c.addChild(shadow(w * 1.15, w * 0.3));
  const g = new Graphics();
  g.roundRect(-w / 2, -h, w, h, 10).fill(wall);
  g.roundRect(-w / 2, -h, w, 16, 8).fill(band);
  for (let ry = 0; ry < Math.floor(h / 44) ; ry++) {
    for (let rx = 0; rx < 3; rx++) {
      g.roundRect(-w * 0.34 + rx * w * 0.28, -h + 30 + ry * 44, w * 0.18, 22, 4).fill(PAL.waterShallow);
    }
  }
  c.addChild(g);
  return c;
}

export function stall(w = 90, awning: number = PAL.coral, stripe: number = PAL.cream): Container {
  const c = new Container();
  c.addChild(shadow(w * 1.05, w * 0.28));
  const g = new Graphics();
  g.roundRect(-w / 2, -w * 0.5, w, w * 0.5, 6).fill(PAL.wood);
  g.roundRect(-w / 2, -w * 0.34, w, 8, 3).fill(PAL.woodDark);
  // awning
  const aw = new Graphics();
  const stripes = 5;
  for (let i = 0; i < stripes; i++) {
    aw.rect(-w * 0.58 + (i * w * 1.16) / stripes, -w * 0.78, (w * 1.16) / stripes, w * 0.3)
      .fill(i % 2 ? stripe : awning);
  }
  aw.moveTo(-w * 0.58, -w * 0.48);
  for (let i = 0; i < stripes; i++) {
    aw.arc(-w * 0.58 + ((i + 0.5) * w * 1.16) / stripes, -w * 0.48, w * 1.16 / stripes / 2, 0, Math.PI);
  }
  aw.fill(awning);
  c.addChild(g, aw);
  return c;
}

export function tent(w = 90, color: number = PAL.mint): Container {
  const c = new Container();
  c.addChild(shadow(w, w * 0.26));
  const g = new Graphics();
  g.moveTo(-w / 2, 0).lineTo(0, -w * 0.72).lineTo(w / 2, 0).closePath().fill(color);
  g.moveTo(-w * 0.14, 0).lineTo(0, -w * 0.3).lineTo(w * 0.14, 0).closePath().fill(darken(color));
  g.circle(0, -w * 0.74, w * 0.05).fill(PAL.sun);
  c.addChild(g);
  return c;
}

/* ---------------- Objects ---------------- */

export function bench(w = 46): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-w / 2, -14, w, 7, 3).fill(PAL.wood);
  g.roundRect(-w / 2, -26, w, 6, 3).fill(PAL.wood);
  g.rect(-w / 2 + 4, -14, 4, 14).fill(PAL.woodDark);
  g.rect(w / 2 - 8, -14, 4, 14).fill(PAL.woodDark);
  c.addChild(g);
  return c;
}

export function lamppost(h = 70): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-2.5, -h, 5, h, 2).fill(PAL.ink);
  g.circle(0, -h, 9).fill(PAL.sun);
  g.circle(0, -h, 5).fill(PAL.cream);
  c.addChild(g);
  return c;
}

/**
 * A cloth sheet draped over something hidden. Filled in the local ground colour
 * so it blends into the background, but outlined with a clear border so an
 * observant player can still spot the shape — fair camouflage, not a cheat.
 */
export function sheet(bg: number = PAL.grass, w = 48): Container {
  const c = new Container();
  const h = w * 0.72;
  const border = darken(bg, 0.66);
  c.addChild(shadow(w * 1.05, w * 0.26, 0.14));

  const cloth = new Graphics();
  // draped silhouette: humped top, wavy hem along the bottom
  cloth.moveTo(-w / 2, 0);
  cloth.quadraticCurveTo(-w / 2, -h * 0.82, -w * 0.16, -h * 0.94);
  cloth.quadraticCurveTo(0, -h * 1.04, w * 0.18, -h * 0.92);
  cloth.quadraticCurveTo(w / 2, -h * 0.78, w / 2, 0);
  // hem: four soft scallops back to the left edge
  cloth.quadraticCurveTo(w * 0.37, h * 0.11, w * 0.25, 0);
  cloth.quadraticCurveTo(w * 0.12, h * 0.11, 0, 0);
  cloth.quadraticCurveTo(-w * 0.12, h * 0.11, -w * 0.25, 0);
  cloth.quadraticCurveTo(-w * 0.37, h * 0.11, -w / 2, 0);
  cloth.closePath();
  cloth.fill(lighten(bg, 0.07));
  cloth.stroke({ width: 3, color: border, alpha: 0.85, join: 'round' });

  // fabric folds — subtle interior lines that sell it as cloth
  const folds = new Graphics();
  folds.moveTo(-w * 0.2, -h * 0.86).quadraticCurveTo(-w * 0.26, -h * 0.4, -w * 0.2, -h * 0.03);
  folds.moveTo(w * 0.16, -h * 0.84).quadraticCurveTo(w * 0.24, -h * 0.42, w * 0.17, -h * 0.03);
  folds.stroke({ width: 2, color: border, alpha: 0.32, cap: 'round' });
  // top highlight so it reads as a rounded object underneath
  folds.ellipse(-w * 0.06, -h * 0.78, w * 0.16, h * 0.1).fill({ color: 0xffffff, alpha: 0.16 });

  c.addChild(cloth, folds);
  return c;
}

export function crate(size = 34, color: number = PAL.wood): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.1, size * 0.3));
  const g = new Graphics();
  g.roundRect(-size / 2, -size, size, size, 4).fill(color);
  g.rect(-size / 2, -size * 0.62, size, 5).fill(darken(color));
  g.rect(-size * 0.08, -size, 5, size).fill(darken(color));
  c.addChild(g);
  return c;
}

export function giftBox(size = 30, color: number = PAL.coral, ribbon: number = PAL.sun): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.05, size * 0.28));
  const g = new Graphics();
  g.roundRect(-size / 2, -size * 0.85, size, size * 0.85, 4).fill(color);
  g.rect(-size * 0.09, -size * 0.85, size * 0.18, size * 0.85).fill(ribbon);
  g.roundRect(-size * 0.56, -size * 1.0, size * 1.12, size * 0.22, 4).fill(darken(color, 0.85));
  g.rect(-size * 0.09, -size * 1.0, size * 0.18, size * 0.22).fill(ribbon);
  g.circle(-size * 0.12, -size * 1.06, size * 0.1).stroke({ width: 3, color: ribbon });
  g.circle(size * 0.12, -size * 1.06, size * 0.1).stroke({ width: 3, color: ribbon });
  c.addChild(g);
  return c;
}

export function chest(size = 44): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.15, size * 0.3));
  const lid = new Graphics();
  lid.roundRect(-size / 2, -size * 0.34, size, size * 0.34, 6).fill(PAL.woodDark);
  lid.rect(-size * 0.06, -size * 0.34, size * 0.12, size * 0.34).fill(PAL.sunDark);
  lid.pivot.set(0, 0);
  lid.position.set(0, -size * 0.5);
  const body = new Graphics();
  body.roundRect(-size / 2, -size * 0.5, size, size * 0.5, 4).fill(PAL.wood);
  body.rect(-size * 0.06, -size * 0.5, size * 0.12, size * 0.5).fill(PAL.sunDark);
  body.circle(0, -size * 0.32, size * 0.07).fill(PAL.sun);
  c.addChild(body, lid);
  (c as Container & { lid?: Graphics }).lid = lid;
  return c;
}

export function pot(size = 34): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.1, size * 0.3));
  const body = new Graphics();
  body.ellipse(0, -size * 0.3, size * 0.5, size * 0.34).fill(0x8fa3ad);
  body.ellipse(0, -size * 0.52, size * 0.44, size * 0.12).fill(0x7a8d96);
  const lid = new Graphics();
  lid.ellipse(0, 0, size * 0.42, size * 0.12).fill(0xaebfc7);
  lid.circle(0, -size * 0.08, size * 0.08).fill(0x7a8d96);
  lid.position.set(0, -size * 0.56);
  c.addChild(body, lid);
  (c as Container & { lid?: Graphics }).lid = lid;
  return c;
}

export function suitcase(size = 34, color: number = PAL.berry, dots = false): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-size / 2, -size * 0.72, size, size * 0.72, 6).fill(color);
  g.roundRect(-size * 0.16, -size * 0.86, size * 0.32, size * 0.16, 4).stroke({ width: 4, color: darken(color) });
  g.rect(-size / 2, -size * 0.45, size, 5).fill(darken(color));
  if (dots) {
    for (let i = 0; i < 6; i++) {
      g.circle(-size * 0.3 + (i % 3) * size * 0.3, -size * 0.58 + Math.floor(i / 3) * size * 0.28, size * 0.06).fill(PAL.cream);
    }
  }
  c.addChild(g);
  return c;
}

export function umbrella(size = 60, a: number = PAL.coral, b: number = PAL.cream): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.9, size * 0.24, 0.1));
  const g = new Graphics();
  g.roundRect(-2, -size * 0.8, 4, size * 0.8, 2).fill(PAL.woodDark);
  const top = new Graphics();
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const a0 = Math.PI + (i / segs) * Math.PI;
    const a1 = Math.PI + ((i + 1) / segs) * Math.PI;
    top.moveTo(0, 0);
    top.arc(0, 0, size * 0.52, a0, a1);
    top.closePath();
    top.fill(i % 2 ? a : b);
  }
  top.position.set(0, -size * 0.72);
  c.addChild(g, top);
  return c;
}

export function boat(size = 70, hull: number = PAL.coral): Container {
  const c = new Container();
  const g = new Graphics();
  g.moveTo(-size / 2, -size * 0.16);
  g.quadraticCurveTo(0, size * 0.18, size / 2, -size * 0.16);
  g.lineTo(size * 0.36, -size * 0.3);
  g.lineTo(-size * 0.36, -size * 0.3);
  g.closePath();
  g.fill(hull);
  g.roundRect(-size * 0.3, -size * 0.34, size * 0.6, size * 0.08, 3).fill(lighten(hull, 0.2));
  c.addChild(g);
  return c;
}

export function fountain(size = 90): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.2, size * 0.34, 0.1));
  const g = new Graphics();
  g.ellipse(0, 0, size * 0.6, size * 0.22).fill(0xd7d0e0);
  g.ellipse(0, -4, size * 0.52, size * 0.18).fill(PAL.waterShallow);
  g.ellipse(0, -size * 0.2, size * 0.16, size * 0.07).fill(0xd7d0e0);
  const jet = new Graphics();
  jet.ellipse(0, -size * 0.42, size * 0.07, size * 0.16).fill({ color: PAL.waterFoam, alpha: 0.9 });
  jet.circle(-size * 0.06, -size * 0.3, size * 0.035).fill(PAL.waterFoam);
  jet.circle(size * 0.06, -size * 0.32, size * 0.035).fill(PAL.waterFoam);
  c.addChild(g, jet);
  (c as Container & { jet?: Graphics }).jet = jet;
  return c;
}

export function banderitas(len = 200, sag = 24): Container {
  const c = new Container();
  const g = new Graphics();
  g.moveTo(-len / 2, 0).quadraticCurveTo(0, sag, len / 2, 0).stroke({ width: 2.5, color: PAL.ink, alpha: 0.5 });
  const colors = [PAL.coral, PAL.sun, PAL.mint, PAL.berry, PAL.waterShallow];
  const n = Math.floor(len / 26);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const x = -len / 2 + t * len;
    const y = sag * 4 * t * (1 - t) * 0.5 + sag * (1 - Math.abs(t - 0.5) * 2) * 0.5;
    const f = new Graphics();
    f.moveTo(-8, 0).lineTo(8, 0).lineTo(0, 16).closePath().fill(colors[i % colors.length]!);
    f.position.set(x, y);
    c.addChild(f);
  }
  c.addChildAt(g, 0);
  return c;
}

export function balloon(color: number = PAL.coral, size = 22): Container {
  const c = new Container();
  const g = new Graphics();
  g.moveTo(0, 0).lineTo(0, -size * 1.2).stroke({ width: 1.5, color: PAL.ink, alpha: 0.4 });
  g.ellipse(0, -size * 1.65, size * 0.52, size * 0.62).fill(color);
  g.ellipse(-size * 0.16, -size * 1.85, size * 0.14, size * 0.2).fill(lighten(color, 0.3));
  g.moveTo(-4, -size * 1.06).lineTo(4, -size * 1.06).lineTo(0, -size * 1.16).closePath().fill(darken(color));
  c.addChild(g);
  return c;
}

export function flag(color: number = PAL.sun, h = 60): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-1.5, -h, 3, h, 1.5).fill(PAL.ink);
  const f = new Graphics();
  f.moveTo(0, 0).lineTo(30, 7).lineTo(0, 14).closePath().fill(color);
  f.position.set(1.5, -h);
  c.addChild(g, f);
  (c as Container & { cloth?: Graphics }).cloth = f;
  return c;
}

/* ---------------- Characters ---------------- */

export interface NpcOpts {
  shirt?: number;
  pants?: number;
  skin?: number;
  hair?: number;
  hat?: number;
  size?: number;
}

export function npc(o: NpcOpts = {}): Container {
  const s = o.size ?? 34;
  const skin = o.skin ?? PAL.skinA;
  const c = new Container();
  c.addChild(shadow(s * 0.8, s * 0.22));
  const g = new Graphics();
  // legs
  g.roundRect(-s * 0.16, -s * 0.3, s * 0.13, s * 0.3, s * 0.06).fill(o.pants ?? PAL.ink);
  g.roundRect(s * 0.03, -s * 0.3, s * 0.13, s * 0.3, s * 0.06).fill(o.pants ?? PAL.ink);
  // body
  g.roundRect(-s * 0.24, -s * 0.72, s * 0.48, s * 0.46, s * 0.16).fill(o.shirt ?? PAL.coral);
  // arms
  g.roundRect(-s * 0.34, -s * 0.68, s * 0.11, s * 0.3, s * 0.05).fill(o.shirt ?? PAL.coral);
  g.roundRect(s * 0.23, -s * 0.68, s * 0.11, s * 0.3, s * 0.05).fill(o.shirt ?? PAL.coral);
  // head
  g.circle(0, -s * 0.88, s * 0.2).fill(skin);
  // hair
  if (o.hair !== undefined) {
    g.arc(0, -s * 0.9, s * 0.2, Math.PI, 0).fill(o.hair);
  }
  if (o.hat !== undefined) {
    g.ellipse(0, -s * 1.04, s * 0.24, s * 0.08).fill(o.hat);
    g.roundRect(-s * 0.14, -s * 1.2, s * 0.28, s * 0.18, s * 0.06).fill(o.hat);
  }
  c.addChild(g);
  return c;
}

export function dog(color: number = 0xc98d5e, size = 30): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.9, size * 0.2));
  const g = new Graphics();
  g.roundRect(-size * 0.42, -size * 0.42, size * 0.84, size * 0.32, size * 0.14).fill(color);
  g.roundRect(-size * 0.38, -size * 0.16, size * 0.1, size * 0.16, size * 0.04).fill(color);
  g.roundRect(size * 0.28, -size * 0.16, size * 0.1, size * 0.16, size * 0.04).fill(color);
  g.circle(size * 0.42, -size * 0.52, size * 0.2).fill(color);
  g.circle(size * 0.5, -size * 0.5, size * 0.05).fill(PAL.ink); // nose... eye
  g.ellipse(size * 0.3, -size * 0.68, size * 0.08, size * 0.14).fill(darken(color)); // ear
  const tail = new Graphics();
  tail.roundRect(0, -size * 0.08, size * 0.26, size * 0.08, size * 0.04).fill(color);
  tail.position.set(-size * 0.44, -size * 0.4);
  tail.rotation = -0.6;
  c.addChild(g, tail);
  (c as Container & { tail?: Graphics }).tail = tail;
  return c;
}

export function cat(color: number = 0x8d8598, size = 24): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, -size * 0.2, size * 0.4, size * 0.24).fill(color);
  g.circle(size * 0.3, -size * 0.42, size * 0.18).fill(color);
  g.moveTo(size * 0.18, -size * 0.55).lineTo(size * 0.22, -size * 0.72).lineTo(size * 0.32, -size * 0.58).closePath().fill(color);
  g.moveTo(size * 0.38, -size * 0.58).lineTo(size * 0.46, -size * 0.72).lineTo(size * 0.48, -size * 0.54).closePath().fill(color);
  g.circle(size * 0.34, -size * 0.42, size * 0.03).fill(PAL.ink);
  const tail = new Graphics();
  tail.moveTo(0, 0).quadraticCurveTo(-size * 0.3, -size * 0.1, -size * 0.34, -size * 0.34)
    .stroke({ width: size * 0.1, color, cap: 'round' });
  tail.position.set(-size * 0.36, -size * 0.2);
  c.addChild(g, tail);
  (c as Container & { tail?: Graphics }).tail = tail;
  return c;
}

export function bird(color: number = PAL.white, size = 14): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, 0, size * 0.5, size * 0.34).fill(color);
  g.circle(size * 0.42, -size * 0.2, size * 0.22).fill(color);
  g.moveTo(size * 0.6, -size * 0.2).lineTo(size * 0.78, -size * 0.14).lineTo(size * 0.6, -size * 0.06).closePath().fill(PAL.sun);
  g.circle(size * 0.48, -size * 0.24, size * 0.04).fill(PAL.ink);
  const wing = new Graphics();
  wing.ellipse(0, 0, size * 0.3, size * 0.16).fill(darken(color, 0.85));
  wing.position.set(-size * 0.08, -size * 0.06);
  c.addChild(g, wing);
  (c as Container & { wing?: Graphics }).wing = wing;
  return c;
}

export function chicken(size = 20): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, -size * 0.3, size * 0.36, size * 0.3).fill(PAL.cream);
  g.circle(size * 0.26, -size * 0.56, size * 0.16).fill(PAL.cream);
  g.moveTo(size * 0.38, -size * 0.56).lineTo(size * 0.52, -size * 0.5).lineTo(size * 0.38, -size * 0.46).closePath().fill(PAL.sun);
  g.circle(size * 0.3, -size * 0.6, size * 0.03).fill(PAL.ink);
  g.moveTo(size * 0.2, -size * 0.72).lineTo(size * 0.26, -size * 0.82).lineTo(size * 0.32, -size * 0.7).closePath().fill(PAL.coral);
  g.rect(-size * 0.08, -size * 0.06, size * 0.04, size * 0.08).fill(PAL.sun);
  g.rect(size * 0.04, -size * 0.06, size * 0.04, size * 0.08).fill(PAL.sun);
  c.addChild(g);
  return c;
}

export function duck(size = 18): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, 0, size * 0.4, size * 0.26).fill(PAL.sun);
  g.circle(size * 0.3, -size * 0.28, size * 0.16).fill(PAL.sun);
  g.moveTo(size * 0.44, -size * 0.28).lineTo(size * 0.6, -size * 0.22).lineTo(size * 0.44, -size * 0.16).closePath().fill(PAL.coral);
  g.circle(size * 0.34, -size * 0.32, size * 0.03).fill(PAL.ink);
  c.addChild(g);
  return c;
}

export function parrot(size = 26): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, -size * 0.3, size * 0.24, size * 0.34).fill(PAL.coral);
  g.circle(size * 0.08, -size * 0.62, size * 0.16).fill(PAL.coral);
  g.moveTo(size * 0.2, -size * 0.64).lineTo(size * 0.36, -size * 0.56).lineTo(size * 0.18, -size * 0.5).closePath().fill(PAL.sunDark);
  g.circle(size * 0.12, -size * 0.66, size * 0.035).fill(PAL.ink);
  const wing = new Graphics();
  wing.ellipse(0, 0, size * 0.12, size * 0.24).fill(PAL.waterDeep);
  wing.position.set(-size * 0.08, -size * 0.3);
  g.moveTo(-size * 0.05, 0).quadraticCurveTo(-size * 0.14, size * 0.2, -size * 0.05, size * 0.34)
    .stroke({ width: size * 0.08, color: PAL.mint, cap: 'round' });
  c.addChild(g, wing);
  (c as Container & { wing?: Graphics }).wing = wing;
  return c;
}

export function monkey(size = 28): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.7, size * 0.18));
  const g = new Graphics();
  g.ellipse(0, -size * 0.34, size * 0.26, size * 0.3).fill(PAL.skinB);
  g.circle(0, -size * 0.72, size * 0.2).fill(PAL.skinB);
  g.ellipse(0, -size * 0.68, size * 0.13, size * 0.15).fill(PAL.skinA);
  g.circle(-size * 0.06, -size * 0.72, size * 0.03).fill(PAL.ink);
  g.circle(size * 0.06, -size * 0.72, size * 0.03).fill(PAL.ink);
  g.circle(-size * 0.2, -size * 0.76, size * 0.08).fill(PAL.skinB);
  g.circle(size * 0.2, -size * 0.76, size * 0.08).fill(PAL.skinB);
  const tail = new Graphics();
  tail.moveTo(0, 0).quadraticCurveTo(size * 0.34, -size * 0.1, size * 0.3, -size * 0.42)
    .stroke({ width: size * 0.08, color: PAL.skinB, cap: 'round' });
  tail.position.set(size * 0.2, -size * 0.24);
  c.addChild(g, tail);
  return c;
}

export function crab(size = 18): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, 0, size * 0.4, size * 0.28).fill(PAL.coral);
  g.circle(-size * 0.3, -size * 0.3, size * 0.12).fill(PAL.coralDark);
  g.circle(size * 0.3, -size * 0.3, size * 0.12).fill(PAL.coralDark);
  g.circle(-size * 0.12, -size * 0.16, size * 0.05).fill(PAL.cream);
  g.circle(size * 0.12, -size * 0.16, size * 0.05).fill(PAL.cream);
  g.circle(-size * 0.12, -size * 0.17, size * 0.025).fill(PAL.ink);
  g.circle(size * 0.12, -size * 0.17, size * 0.025).fill(PAL.ink);
  c.addChild(g);
  return c;
}

/* ---------------- Ambient critters & distractions ---------------- */

/** wings are returned so the caller can flutter them */
export function butterfly(color: number = PAL.coral, size = 13): Container {
  const c = new Container();
  const wings = new Container();
  const g = new Graphics();
  g.ellipse(-size * 0.34, -size * 0.12, size * 0.34, size * 0.26).fill(color);
  g.ellipse(size * 0.34, -size * 0.12, size * 0.34, size * 0.26).fill(color);
  g.ellipse(-size * 0.28, size * 0.2, size * 0.26, size * 0.2).fill(darken(color, 0.85));
  g.ellipse(size * 0.28, size * 0.2, size * 0.26, size * 0.2).fill(darken(color, 0.85));
  g.circle(-size * 0.34, -size * 0.14, size * 0.08).fill({ color: 0xffffff, alpha: 0.6 });
  g.circle(size * 0.34, -size * 0.14, size * 0.08).fill({ color: 0xffffff, alpha: 0.6 });
  wings.addChild(g);
  const body = new Graphics();
  body.roundRect(-size * 0.05, -size * 0.3, size * 0.1, size * 0.6, size * 0.05).fill(PAL.ink);
  c.addChild(wings, body);
  (c as Container & { wings?: Container }).wings = wings;
  return c;
}

export function dragonfly(size = 16): Container {
  const c = new Container();
  const wings = new Container();
  const w = new Graphics();
  w.ellipse(-size * 0.4, -size * 0.1, size * 0.42, size * 0.12).fill({ color: 0xbfe9ff, alpha: 0.75 });
  w.ellipse(size * 0.4, -size * 0.1, size * 0.42, size * 0.12).fill({ color: 0xbfe9ff, alpha: 0.75 });
  wings.addChild(w);
  const b = new Graphics();
  b.roundRect(-size * 0.05, -size * 0.24, size * 0.1, size * 0.72, size * 0.05).fill(PAL.mintDark);
  b.circle(0, -size * 0.28, size * 0.11).fill(PAL.mint);
  c.addChild(wings, b);
  (c as Container & { wings?: Container }).wings = wings;
  return c;
}

export function frog(size = 18): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.9, size * 0.22));
  const g = new Graphics();
  g.ellipse(0, -size * 0.24, size * 0.4, size * 0.26).fill(0x6cc24a);
  g.circle(-size * 0.18, -size * 0.46, size * 0.13).fill(0x6cc24a);
  g.circle(size * 0.18, -size * 0.46, size * 0.13).fill(0x6cc24a);
  g.circle(-size * 0.18, -size * 0.48, size * 0.06).fill(PAL.ink);
  g.circle(size * 0.18, -size * 0.48, size * 0.06).fill(PAL.ink);
  g.ellipse(-size * 0.34, -size * 0.06, size * 0.12, size * 0.07).fill(0x58a83c);
  g.ellipse(size * 0.34, -size * 0.06, size * 0.12, size * 0.07).fill(0x58a83c);
  c.addChild(g);
  return c;
}

/** spinner is returned so the caller can rotate it */
export function pinwheel(size = 28): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-size * 0.05, -size * 0.9, size * 0.1, size * 0.9, size * 0.04).fill(PAL.woodDark);
  const spin = new Graphics();
  const cols = [PAL.coral, PAL.sun, PAL.mint, PAL.waterShallow];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    spin.moveTo(0, 0);
    spin.arc(0, 0, size * 0.42, a, a + Math.PI * 0.42);
    spin.closePath();
    spin.fill(cols[i]!);
  }
  spin.circle(0, 0, size * 0.08).fill(PAL.cream);
  spin.position.set(0, -size * 0.9);
  c.addChild(g, spin);
  (c as Container & { spin?: Container }).spin = spin;
  return c;
}

export function beachBall(size = 20): Container {
  const c = new Container();
  c.addChild(shadow(size * 0.85, size * 0.2));
  const g = new Graphics();
  g.circle(0, -size * 0.5, size * 0.5).fill(PAL.cream);
  const cols = [PAL.coral, PAL.sun, PAL.waterShallow];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    g.moveTo(0, -size * 0.5);
    g.arc(0, -size * 0.5, size * 0.5, a, a + Math.PI * 0.62);
    g.closePath();
    g.fill(cols[i]!);
  }
  g.circle(-size * 0.16, -size * 0.66, size * 0.1).fill({ color: 0xffffff, alpha: 0.55 });
  c.addChild(g);
  return c;
}

export function kite(size = 34): Container {
  const c = new Container();
  const g = new Graphics();
  g.moveTo(0, -size * 0.6).lineTo(size * 0.34, 0).lineTo(0, size * 0.5).lineTo(-size * 0.34, 0).closePath().fill(PAL.berry);
  g.moveTo(0, -size * 0.6).lineTo(0, size * 0.5).stroke({ width: 1.5, color: PAL.cream, alpha: 0.6 });
  g.moveTo(-size * 0.34, 0).lineTo(size * 0.34, 0).stroke({ width: 1.5, color: PAL.cream, alpha: 0.6 });
  for (let i = 0; i < 3; i++) {
    g.moveTo(0, size * 0.5 + i * size * 0.22)
      .quadraticCurveTo(size * 0.1, size * 0.6 + i * size * 0.22, 0, size * 0.7 + i * size * 0.22)
      .stroke({ width: 2, color: PAL.sun });
  }
  c.addChild(g);
  return c;
}

/* ---------------- Field designs (static, baked into cached art) ---------------- */

/** alternating mown bands — reads as a cared-for lawn */
export function mownStripes(w: number, h: number, base: number, bands = 7): Graphics {
  const g = new Graphics();
  const bh = h / bands;
  for (let i = 0; i < bands; i += 2) {
    g.rect(-w / 2, -h / 2 + i * bh, w, bh);
  }
  g.fill({ color: lighten(base, 0.09), alpha: 0.55 });
  return g;
}

/** tidy rows of planted flowers */
export function flowerBed(w = 130, h = 70, soil = 0xa8794f): Graphics {
  const g = new Graphics();
  g.ellipse(0, 0, w / 2, h / 2).fill(soil);
  g.ellipse(0, 0, w / 2 - 5, h / 2 - 5).fill(lighten(soil, 0.08));
  const cols = [PAL.coral, PAL.sun, PAL.berry, PAL.cream];
  let k = 0;
  for (let ry = -1; ry <= 1; ry++) {
    for (let rx = -2; rx <= 2; rx++) {
      const x = rx * (w / 6);
      const y = ry * (h / 4);
      if (x * x / ((w / 2 - 10) ** 2) + y * y / ((h / 2 - 8) ** 2) > 1) continue;
      g.circle(x, y, 5).fill(cols[k++ % cols.length]!);
      g.circle(x, y, 2).fill(PAL.cream);
    }
  }
  return g;
}

export function hedgeRow(len = 120, color: number = PAL.grassDark): Graphics {
  const g = new Graphics();
  g.roundRect(-len / 2, -20, len, 24, 11).fill(color);
  const lobes = Math.max(3, Math.round(len / 26));
  for (let i = 0; i < lobes; i++) {
    g.circle(-len / 2 + (i + 0.5) * (len / lobes), -22, 12).fill(lighten(color, 0.1));
  }
  return g;
}

/** stepping stones along a short path */
export function steppingStones(n = 5, gap = 26): Graphics {
  const g = new Graphics();
  for (let i = 0; i < n; i++) {
    g.ellipse(i * gap - ((n - 1) * gap) / 2, (i % 2) * 4, 11, 8).fill({ color: 0xcdc7d6, alpha: 0.9 });
  }
  return g;
}

export function picnicBlanket(w = 70, a: number = PAL.coral): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, 0, w / 2, w / 3).fill(a);
  for (let i = -2; i <= 2; i++) {
    g.rect(i * (w / 7) - 2, -w / 3, 4, (w / 3) * 2).fill({ color: PAL.cream, alpha: 0.45 });
    g.rect(-w / 2, i * (w / 9) - 2, w, 4).fill({ color: PAL.cream, alpha: 0.45 });
  }
  g.ellipse(0, 0, w / 2, w / 3).stroke({ width: 3, color: lighten(a, 0.15) });
  c.addChild(g);
  return c;
}

/* ---------------- Vehicles ---------------- */

export function jeepney(size = 90): Container {
  const c = new Container();
  c.addChild(shadow(size * 1.1, size * 0.26));
  const g = new Graphics();
  g.roundRect(-size / 2, -size * 0.42, size, size * 0.3, size * 0.08).fill(PAL.sun);
  g.roundRect(-size * 0.42, -size * 0.58, size * 0.84, size * 0.2, size * 0.06).fill(PAL.coral);
  g.roundRect(-size * 0.34, -size * 0.55, size * 0.16, size * 0.13, 4).fill(PAL.waterShallow);
  g.roundRect(-size * 0.1, -size * 0.55, size * 0.16, size * 0.13, 4).fill(PAL.waterShallow);
  g.roundRect(size * 0.14, -size * 0.55, size * 0.16, size * 0.13, 4).fill(PAL.waterShallow);
  g.circle(-size * 0.28, -size * 0.1, size * 0.11).fill(PAL.ink);
  g.circle(size * 0.28, -size * 0.1, size * 0.11).fill(PAL.ink);
  g.circle(-size * 0.28, -size * 0.1, size * 0.05).fill(PAL.cream);
  g.circle(size * 0.28, -size * 0.1, size * 0.05).fill(PAL.cream);
  // banner
  g.roundRect(-size * 0.3, -size * 0.7, size * 0.6, size * 0.12, size * 0.04).fill(PAL.cream);
  c.addChild(g);
  return c;
}

export function drone(size = 30): Container {
  const c = new Container();
  const g = new Graphics();
  g.roundRect(-size * 0.24, -size * 0.1, size * 0.48, size * 0.2, size * 0.08).fill(PAL.ink);
  g.circle(0, 0, size * 0.09).fill(PAL.coral);
  const r1 = new Graphics();
  r1.ellipse(0, 0, size * 0.2, size * 0.05).fill({ color: 0xffffff, alpha: 0.8 });
  r1.position.set(-size * 0.3, -size * 0.12);
  const r2 = new Graphics();
  r2.ellipse(0, 0, size * 0.2, size * 0.05).fill({ color: 0xffffff, alpha: 0.8 });
  r2.position.set(size * 0.3, -size * 0.12);
  c.addChild(g, r1, r2);
  return c;
}

/* ---------------- The Phone ---------------- */

/** the iconic lost iPhone — glowing generic smartphone */
export function phoneSprite(scale = 1, tint?: number): Container {
  const c = new Container();
  const glow = new Graphics();
  glow.circle(0, -13, 26).fill({ color: PAL.phoneGlow, alpha: 0.22 });
  const g = new Graphics();
  g.roundRect(-9, -28, 18, 30, 5).fill(tint ?? PAL.phoneBody);
  g.roundRect(-7, -25, 14, 21, 2.5).fill(PAL.phoneGlow);
  g.roundRect(-7, -25, 14, 8, 2.5).fill(lighten(PAL.phoneGlow, 0.25));
  g.circle(0, -1.6, 1.6).fill(PAL.cream);
  c.addChild(glow, g);
  c.scale.set(scale);
  (c as Container & { glow?: Graphics }).glow = glow;
  return c;
}
