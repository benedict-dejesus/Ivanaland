/**
 * Host-object presentation for container/reveal phones.
 * Chooses themed art from the phone's host description keywords,
 * and provides open/close (or wobble/reveal) animation hooks.
 */
import { Container, Graphics } from 'pixi.js';
import { PAL } from '../data/palette';
import type { PhoneDef } from '../data/types';
import { chest, crate, giftBox, pot, sheet, suitcase, shadow, lighten } from '../world/props';
import { GROUND } from '../data/districts';

/** A sheet lifts and tilts away rather than just wobbling. */
function sheetView(node: Container): HostView {
  return {
    node,
    open: () => { node.rotation = -0.22; node.y = -12; node.alpha = 0.9; },
    close: () => { node.rotation = 0; node.y = 0; node.alpha = 1; },
  };
}

export interface HostView {
  node: Container;
  /** part that animates on open (lid etc.) */
  open: () => void;
  close: () => void;
}

function mkLidded(body: Container, lid: Container, lidOpenRot = -1.1, lidOpenDy = -6): HostView {
  const node = new Container();
  node.addChild(body);
  const baseRot = lid.rotation;
  const baseY = lid.y;
  return {
    node,
    open: () => {
      lid.rotation = baseRot + lidOpenRot;
      lid.y = baseY + lidOpenDy;
    },
    close: () => {
      lid.rotation = baseRot;
      lid.y = baseY;
    },
  };
}

function wobbler(node: Container): HostView {
  return {
    node,
    open: () => { node.rotation = 0.12; },
    close: () => { node.rotation = 0; },
  };
}

function mailbox(): Container {
  const c = new Container();
  c.addChild(shadow(30, 9));
  const g = new Graphics();
  g.roundRect(-3, -34, 6, 34, 3).fill(PAL.woodDark);
  g.roundRect(-16, -52, 32, 20, 9).fill(PAL.coral);
  g.circle(10, -42, 3).fill(PAL.sun);
  c.addChild(g);
  return c;
}

function doghouse(): Container {
  const c = new Container();
  c.addChild(shadow(56, 16));
  const g = new Graphics();
  g.roundRect(-28, -36, 56, 36, 6).fill(PAL.wood);
  g.moveTo(-34, -32).lineTo(0, -54).lineTo(34, -32).closePath().fill(PAL.coral);
  g.circle(0, -16, 11).fill(PAL.ink);
  g.roundRect(-24, -10, 48, 5, 2).fill(PAL.cream);
  c.addChild(g);
  return c;
}

function pouch(color: number = PAL.berry): Container {
  const c = new Container();
  c.addChild(shadow(34, 10));
  const g = new Graphics();
  g.ellipse(0, -14, 17, 14).fill(color);
  g.ellipse(0, -26, 10, 5).fill(lighten(color, 0.2));
  g.roundRect(-11, -32, 22, 6, 3).fill(lighten(color, 0.1));
  c.addChild(g);
  return c;
}

function towelSwan(): Container {
  const c = new Container();
  c.addChild(shadow(44, 12));
  const g = new Graphics();
  g.ellipse(0, -12, 20, 12).fill(PAL.white);
  g.moveTo(-14, -18).quadraticCurveTo(-24, -38, -10, -42)
    .stroke({ width: 8, color: PAL.white, cap: 'round' });
  g.circle(-8, -42, 6).fill(PAL.white);
  g.moveTo(-4, -43).lineTo(4, -41).lineTo(-4, -39).closePath().fill(PAL.sun);
  c.addChild(g);
  return c;
}

function cloche(): Container {
  const c = new Container();
  c.addChild(shadow(46, 12));
  const cart = new Graphics();
  cart.roundRect(-24, -26, 48, 6, 3).fill(PAL.cream);
  cart.rect(-20, -20, 4, 18).fill(0xb9b2c4);
  cart.rect(16, -20, 4, 18).fill(0xb9b2c4);
  cart.circle(-18, 0, 5).fill(PAL.ink);
  cart.circle(18, 0, 5).fill(PAL.ink);
  const lid = new Graphics();
  lid.arc(0, 0, 18, Math.PI, 0).fill(0xd7d0e0);
  lid.circle(0, -18, 3.5).fill(0xb9b2c4);
  lid.position.set(0, -27);
  const node = new Container();
  node.addChild(cart, lid);
  (node as Container & { lid?: Graphics }).lid = lid;
  return node;
}

function well(): Container {
  const c = new Container();
  c.addChild(shadow(60, 18));
  const g = new Graphics();
  g.ellipse(0, -8, 28, 12).fill(0x9aa7b5);
  g.ellipse(0, -12, 22, 9).fill(PAL.waterDeep);
  g.rect(-26, -46, 5, 38).fill(PAL.woodDark);
  g.rect(21, -46, 5, 38).fill(PAL.woodDark);
  g.moveTo(-32, -42).lineTo(0, -60).lineTo(32, -42).closePath().fill(PAL.coral);
  const bucket = new Graphics();
  bucket.moveTo(0, -8).lineTo(0, 0).stroke({ width: 2, color: PAL.ink, alpha: 0.5 });
  bucket.roundRect(-7, 0, 14, 10, 3).fill(PAL.wood);
  bucket.position.set(0, -34);
  c.addChild(g, bucket);
  (c as Container & { lid?: Graphics }).lid = bucket;
  return c;
}

function lipstickCap(): Container {
  const c = new Container();
  c.addChild(shadow(40, 12));
  const body = new Graphics();
  body.roundRect(-14, -40, 28, 40, 6).fill(PAL.berryDark);
  const cap = new Graphics();
  cap.roundRect(-12, -26, 24, 26, 8).fill(PAL.berry);
  cap.roundRect(-12, -26, 24, 8, 6).fill(lighten(PAL.berry, 0.2));
  cap.position.set(0, -40);
  const node = new Container();
  node.addChild(c, body, cap);
  (node as Container & { lid?: Graphics }).lid = cap;
  return node;
}

function mound(): Container {
  const c = new Container();
  const g = new Graphics();
  g.ellipse(0, -4, 22, 10).fill(0x9a7550);
  g.ellipse(0, -8, 14, 7).fill(0xb08a63);
  g.circle(-6, -12, 2).fill(0x9a7550);
  g.circle(7, -10, 2.5).fill(0x9a7550);
  c.addChild(g);
  return c;
}

function coopArt(): Container {
  const c = new Container();
  c.addChild(shadow(60, 16));
  const g = new Graphics();
  g.roundRect(-30, -34, 60, 34, 5).fill(PAL.wood);
  g.moveTo(-36, -30).lineTo(0, -50).lineTo(36, -30).closePath().fill(PAL.coralDark);
  g.circle(0, -18, 9).fill(PAL.ink);
  g.rect(-30, -8, 60, 4).fill(PAL.woodDark);
  c.addChild(g);
  return c;
}

function cannonArt(): Container {
  const c = new Container();
  c.addChild(shadow(46, 12));
  const g = new Graphics();
  const barrel = new Graphics();
  barrel.roundRect(-10, -46, 20, 34, 8).fill(PAL.berryDark);
  barrel.roundRect(-12, -50, 24, 8, 4).fill(PAL.berry);
  barrel.rotation = -0.3;
  g.roundRect(-16, -14, 32, 14, 5).fill(PAL.woodDark);
  g.circle(0, -14, 7).fill(PAL.sun);
  c.addChild(g, barrel);
  return c;
}

function piggy(): Container {
  const c = new Container();
  c.addChild(shadow(36, 10));
  const g = new Graphics();
  g.ellipse(0, -14, 18, 13).fill(0xf7a8c4);
  g.circle(13, -20, 8).fill(0xf7a8c4);
  g.ellipse(16, -19, 4, 3).fill(0xe887ab);
  g.circle(12, -23, 1.6).fill(PAL.ink);
  g.rect(-14, -4, 4, 4).fill(0xe887ab);
  g.rect(8, -4, 4, 4).fill(0xe887ab);
  g.roundRect(-4, -28, 8, 3, 1.5).fill(PAL.ink);
  c.addChild(g);
  return c;
}

function duffel(): Container {
  const c = new Container();
  c.addChild(shadow(44, 12));
  const g = new Graphics();
  g.roundRect(-22, -22, 44, 22, 11).fill(PAL.waterDeep);
  g.roundRect(-8, -28, 16, 6, 3).fill(lighten(PAL.waterDeep, 0.2));
  g.rect(-22, -13, 44, 4).fill(lighten(PAL.waterDeep, 0.15));
  c.addChild(g);
  return c;
}

function balloonBasket(): Container {
  const c = new Container();
  c.addChild(shadow(40, 12));
  const g = new Graphics();
  g.roundRect(-18, -24, 36, 24, 6).fill(PAL.wood);
  g.rect(-18, -18, 36, 3).fill(PAL.woodDark);
  g.rect(-18, -10, 36, 3).fill(PAL.woodDark);
  c.addChild(g);
  return c;
}

function micCase(): Container {
  const c = new Container();
  c.addChild(shadow(40, 12));
  const body = new Graphics();
  body.roundRect(-20, -16, 40, 16, 4).fill(PAL.ink);
  const lid = new Graphics();
  lid.roundRect(-20, -12, 40, 12, 4).fill(0x554a63);
  lid.roundRect(-6, -15, 12, 5, 2).fill(0x776a87);
  lid.position.set(0, -16);
  const node = new Container();
  node.addChild(c, body, lid);
  (node as Container & { lid?: Graphics }).lid = lid;
  return node;
}

/** Build themed host art for a phone. */
export function hostViewFor(p: PhoneDef): HostView {
  const h = p.host.toLowerCase();
  const l = p.landmark.toLowerCase();

  if (h.includes('pocket')) return wobbler(pouch(PAL.waterShallow));
  if (h.includes('polka')) { const s = suitcase(44, PAL.coral, true); return wobbler(withShadow(s, 40)); }
  if (h.includes('suitcase')) { const s = suitcase(40, PAL.berry); return wobbler(withShadow(s, 38)); }
  if (h.includes('chest')) { const ch = chest(48); return liddedFrom(ch); }
  if (h.includes('pot') && !h.includes('pocket')) { const po = pot(40); return liddedFrom(po, -0.9, -10); }
  if (h.includes('canister')) { const po = pot(34); return liddedFrom(po, -0.9, -10); }
  if (h.includes('gift')) {
    const gift = giftBox(36, PAL.cream, h.includes('mint') ? PAL.mint : PAL.sun);
    return wobbler(gift);
  }
  if (h.includes('mailbox')) return wobbler(mailbox());
  if (h.includes('doghouse')) return wobbler(doghouse());
  if (h.includes('swan')) return wobbler(towelSwan());
  if (h.includes('cloche')) { const cl = cloche(); return liddedFrom(cl, -0.8, -14); }
  if (h.includes('bucket') || l.includes('well')) { const w = well(); return liddedFrom(w, 0, -16); }
  if (h.includes('cap') && l.includes('lipstick')) { const lc = lipstickCap(); return liddedFrom(lc, 0.5, -20); }
  if (h.includes('mound')) return wobbler(mound());
  if (h.includes('nest') || l.includes('coop')) return wobbler(coopArt());
  if (h.includes('cannon')) return wobbler(cannonArt());
  if (h.includes('piggy')) return wobbler(piggy());
  if (h.includes('duffel')) return wobbler(duffel());
  if (h.includes('hamper') || h.includes('basket')) return wobbler(balloonBasket());
  if (h.includes('purse') || h.includes('bag')) return wobbler(pouch(p.district === 'beauty' ? PAL.berry : PAL.waterDeep));
  if (h.includes('mic case')) { const mc = micCase(); return liddedFrom(mc, -0.9, -8); }
  // Produce crates stay as crates — they belong in a market/backlot.
  if (h.includes('crate')) return wobbler(crate(38, PAL.wood));
  // Everything else that used to be a generic brown box is now a draped sheet
  // in the local ground colour: it blends in, but its border gives it away.
  const ground = GROUND[p.district];
  if (h.includes('box') || h.includes('drawer') || h.includes('backpack') || h.includes('shelf')) {
    return sheetView(sheet(ground, 50));
  }
  if (h.includes('case')) return sheetView(sheet(ground, 46));
  if (h.includes('glovebox')) return sheetView(sheet(ground, 40));
  if (h.includes('door') || h.includes('cabin') || h.includes('hatch') || h.includes('hull')
    || h.includes('birdhouse') || h.includes('mouth') || h.includes('seat') || h.includes('stairs')) {
    return sheetView(sheet(ground, 48));
  }
  return sheetView(sheet(ground, 48));
}

function withShadow(node: Container, w: number): Container {
  const c = new Container();
  c.addChild(shadow(w, w * 0.28), node);
  return c;
}

function liddedFrom(node: Container, rot = -1.1, dy = -6): HostView {
  const lid = (node as Container & { lid?: Container }).lid;
  if (lid) return mkLidded(node, lid, rot, dy);
  return wobbler(node);
}
