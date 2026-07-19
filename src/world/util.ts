import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { PAL } from '../data/palette';

/** place a node at a world position inside a parent */
export function put<T extends Container>(parent: Container, node: T, pos: { x: number; y: number }, scale = 1): T {
  node.position.set(pos.x, pos.y);
  if (scale !== 1) node.scale.set(scale);
  parent.addChild(node);
  return node;
}

const signStyle = new TextStyle({
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  fontSize: 18,
  fontWeight: '900',
  fill: PAL.ink,
  letterSpacing: 1,
});

/** small standing sign with text */
export function sign(text: string, color: number = PAL.cream): Container {
  const c = new Container();
  const t = new Text({ text, style: signStyle });
  t.anchor.set(0.5);
  const w = Math.max(60, t.width + 24);
  const g = new Graphics();
  g.roundRect(-3, -46, 6, 46, 3).fill(PAL.woodDark);
  g.roundRect(-w / 2, -72, w, 34, 10).fill(color);
  g.roundRect(-w / 2, -72, w, 34, 10).stroke({ width: 3, color: PAL.woodDark, alpha: 0.4 });
  t.position.set(0, -55);
  c.addChild(g, t);
  return c;
}

/** big display text (marquees, banners) */
export function bigText(text: string, size: number, color: number): Text {
  const t = new Text({
    text,
    style: new TextStyle({
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: size,
      fontWeight: '900',
      fill: color,
      letterSpacing: 2,
    }),
  });
  t.anchor.set(0.5);
  return t;
}

/** ground patch — soft organic blob (single fill so alpha never stacks) */
export function patch(w: number, h: number, color: number, alpha = 1): Graphics {
  const g = new Graphics();
  g.ellipse(0, 0, w / 2, h / 2);
  g.ellipse(-w * 0.22, -h * 0.14, w * 0.36, h * 0.4);
  g.ellipse(w * 0.24, h * 0.12, w * 0.34, h * 0.38);
  g.fill({ color, alpha: alpha * 0.8 });
  return g;
}

/** dashed line along a polyline (road centerlines etc.) */
export function dashedInto(g: Graphics, pts: { x: number; y: number }[], dash: number, gap: number, width: number, color: number, alpha: number): void {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const ux = (b.x - a.x) / len;
    const uy = (b.y - a.y) / len;
    for (let d = gap; d + dash < len; d += dash + gap) {
      g.moveTo(a.x + ux * d, a.y + uy * d);
      g.lineTo(a.x + ux * (d + dash), a.y + uy * (d + dash));
    }
  }
  g.stroke({ width, color, alpha, cap: 'round' });
}

/** path/road segment as a thick rounded line */
export function pathLine(pts: { x: number; y: number }[], width: number, color: number, alpha = 1): Graphics {
  const g = new Graphics();
  if (pts.length < 2) return g;
  g.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i]!.x, pts[i]!.y);
  g.stroke({ width, color, alpha, cap: 'round', join: 'round' });
  return g;
}
