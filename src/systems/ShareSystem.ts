/**
 * Certificate + share cards, rendered to an offscreen canvas → PNG.
 * All drawing procedural; native share sheet when available, download otherwise.
 */
import type { SaveManager } from '../core/SaveManager';
import { PHONES } from '../data/phones';
import { DISTRICTS } from '../data/districts';
import { ACHIEVEMENTS } from '../data/achievements';

const CREAM = '#FFF8EC';
const INK = '#3A3242';
const INK_SOFT = '#6b6277';
const SUN = '#FFC93C';
const CORAL = '#FF6B6B';
const BERRY = '#B565D8';
const MINT = '#3DDCB1';
const SKY = '#2E86DE';
const CYAN = '#5AC8FA';
const CONFETTI = [SUN, CORAL, BERRY, MINT, CYAN, '#ffffff'];

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

function confettiBg(c: CanvasRenderingContext2D, w: number, h: number, seed = 7): void {
  let s = seed;
  const rnd = (): number => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  for (let i = 0; i < 90; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    c.save();
    c.translate(x, y);
    c.rotate(rnd() * Math.PI);
    c.globalAlpha = 0.25 + rnd() * 0.3;
    c.fillStyle = CONFETTI[(rnd() * CONFETTI.length) | 0]!;
    if (rnd() < 0.5) c.fillRect(-7, -4, 14, 8);
    else { c.beginPath(); c.arc(0, 0, 5, 0, Math.PI * 2); c.fill(); }
    c.restore();
  }
  c.globalAlpha = 1;
}

function drawPhone(c: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.fillStyle = INK;
  roundRect(c, -22, -40, 44, 80, 12); c.fill();
  const grad = c.createLinearGradient(0, -34, 0, 28);
  grad.addColorStop(0, '#a7e2ff');
  grad.addColorStop(1, CYAN);
  c.fillStyle = grad;
  roundRect(c, -17, -34, 34, 62, 6); c.fill();
  c.fillStyle = CREAM;
  c.beginPath(); c.arc(0, 33, 4, 0, Math.PI * 2); c.fill();
  c.restore();
}

function fmtDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
}

function favoriteDistrict(save: SaveManager): string {
  const counts = new Map<string, number>();
  for (const id of save.data.foundPhones) {
    const p = PHONES.find((q) => q.id === id);
    if (p) counts.set(p.district, (counts.get(p.district) ?? 0) + 1);
  }
  let best = ''; let bestN = -1;
  for (const [d, n] of counts) if (n > bestN) { bestN = n; best = d; }
  return DISTRICTS.find((d) => d.id === best)?.name ?? 'Ivanaland';
}

export class ShareSystem {
  constructor(private save: SaveManager) {}

  renderCertificate(playerName: string): HTMLCanvasElement {
    const W = 1080; const H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    const s = this.save.data;

    // backdrop
    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, SKY);
    bg.addColorStop(0.55, '#6BC5F2');
    bg.addColorStop(1, '#8CD867');
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    confettiBg(c, W, H);

    // card
    c.save();
    c.shadowColor = 'rgba(30,25,40,0.35)'; c.shadowBlur = 40; c.shadowOffsetY = 16;
    c.fillStyle = CREAM;
    roundRect(c, 70, 90, W - 140, H - 180, 42); c.fill();
    c.restore();
    c.strokeStyle = SUN; c.lineWidth = 8;
    roundRect(c, 98, 118, W - 196, H - 236, 30); c.stroke();

    c.textAlign = 'center';
    c.fillStyle = INK_SOFT;
    c.font = '700 30px Segoe UI, sans-serif';
    c.fillText('CERTIFICATE OF COMPLETION', W / 2, 210);

    c.fillStyle = INK;
    c.font = '900 92px Segoe UI, sans-serif';
    c.fillText('IVANALAND', W / 2, 310);

    drawPhone(c, W / 2, 420, 1.15);
    c.fillStyle = SUN;
    c.font = '900 34px Segoe UI, sans-serif';
    c.fillText('★  ALL 100 LOST iPHONES RECOVERED  ★', W / 2, 545);

    c.fillStyle = INK_SOFT;
    c.font = '600 30px Segoe UI, sans-serif';
    c.fillText('This certifies that', W / 2, 620);

    c.fillStyle = INK;
    c.font = '900 64px Segoe UI, sans-serif';
    const name = playerName.trim() || 'A Legendary Explorer';
    c.fillText(name, W / 2, 700, W - 260);
    c.strokeStyle = CORAL; c.lineWidth = 5;
    c.beginPath();
    c.moveTo(W / 2 - 240, 726); c.lineTo(W / 2 + 240, 726); c.stroke();

    c.fillStyle = INK_SOFT;
    c.font = '600 28px Segoe UI, sans-serif';
    c.fillText('explored every corner of Ivanaland and recovered', W / 2, 782);
    c.fillText('all one hundred lost iPhones.', W / 2, 820);

    // stats row
    const stats: [string, string][] = [
      ['PLAY TIME', fmtDuration(s.stats.playMs)],
      ['TAPS', String(s.stats.taps)],
      ['HINTS', String(s.stats.hintsUsed)],
      ['ACHIEVEMENTS', `${s.achievements.length}/${ACHIEVEMENTS.length}`],
    ];
    const bw = 205; const bx0 = W / 2 - (bw * 4 + 30) / 2 + 15;
    stats.forEach(([label, value], i) => {
      const bx = bx0 + i * (bw + 10);
      c.fillStyle = '#ffffff';
      roundRect(c, bx, 870, bw, 120, 20); c.fill();
      c.fillStyle = INK;
      c.font = '900 40px Segoe UI, sans-serif';
      c.fillText(value, bx + bw / 2, 930);
      c.fillStyle = INK_SOFT;
      c.font = '700 20px Segoe UI, sans-serif';
      c.fillText(label, bx + bw / 2, 968);
    });

    c.fillStyle = INK_SOFT;
    c.font = '600 26px Segoe UI, sans-serif';
    c.fillText(`Favorite district: ${favoriteDistrict(this.save)}`, W / 2, 1050);
    const when = s.stats.completedAt ? new Date(s.stats.completedAt) : new Date();
    c.fillText(`Completed ${when.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`, W / 2, 1090);

    c.fillStyle = BERRY;
    c.font = '900 30px Segoe UI, sans-serif';
    c.fillText('👑 Keeper of Ivanaland 👑', W / 2, 1155);

    c.fillStyle = INK;
    c.font = '700 26px Segoe UI, sans-serif';
    c.fillText('A game by Benedict de Jesus', W / 2, 1215);
    return cv;
  }

  renderProgressCard(): HTMLCanvasElement {
    const W = 1080; const H = 1080;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d')!;
    const n = this.save.data.foundPhones.length;

    const bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, BERRY);
    bg.addColorStop(1, SKY);
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    confettiBg(c, W, H, 21);

    c.save();
    c.shadowColor = 'rgba(30,25,40,0.35)'; c.shadowBlur = 36; c.shadowOffsetY = 14;
    c.fillStyle = CREAM;
    roundRect(c, 90, 110, W - 180, H - 220, 44); c.fill();
    c.restore();

    c.textAlign = 'center';
    c.fillStyle = INK;
    c.font = '900 66px Segoe UI, sans-serif';
    c.fillText('IVANALAND', W / 2, 240);
    drawPhone(c, W / 2 - 190, 420, 1.3);

    c.fillStyle = INK;
    c.font = '900 150px Segoe UI, sans-serif';
    c.fillText(`${n} / 100`, W / 2 + 70, 470);
    c.fillStyle = INK_SOFT;
    c.font = '700 36px Segoe UI, sans-serif';
    c.fillText('lost iPhones recovered', W / 2, 560);

    // district dots
    let dy = 650;
    c.font = '700 26px Segoe UI, sans-serif';
    for (const d of DISTRICTS) {
      const foundHere = PHONES.filter((p) => p.district === d.id && this.save.data.foundPhones.includes(p.id)).length;
      c.textAlign = 'right';
      c.fillStyle = INK;
      c.fillText(d.name, 480, dy + 8);
      for (let i = 0; i < 10; i++) {
        c.beginPath();
        c.arc(520 + i * 34, dy, 11, 0, Math.PI * 2);
        c.fillStyle = i < foundHere ? MINT : '#e3dccc';
        c.fill();
      }
      dy += 44;
    }

    c.textAlign = 'center';
    c.fillStyle = CORAL;
    c.font = '900 34px Segoe UI, sans-serif';
    c.fillText(n >= 100 ? 'All found. Legendary.' : `Have you seen the other ${100 - n}?`, W / 2, 1005 - 60);
    c.fillStyle = INK_SOFT;
    c.font = '700 24px Segoe UI, sans-serif';
    c.fillText('A game by Benedict de Jesus', W / 2, 1005);
    return cv;
  }

  async export(canvas: HTMLCanvasElement, filename: string): Promise<'shared' | 'downloaded'> {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('render failed');
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'IVANALAND' });
        return 'shared';
      } catch { /* user cancelled — fall through to download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'downloaded';
  }
}
