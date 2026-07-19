import { Camera } from './Camera';

export interface InputCallbacks {
  onTap: (sx: number, sy: number) => void;
  onDoubleTap: (sx: number, sy: number) => void;
  onFirstGesture: () => void;
}

const TAP_MOVE = 8;
const TAP_MS = 350;
const DOUBLE_MS = 300;
const DOUBLE_DIST = 44;

interface PointerRec { id: number; x: number; y: number; startX: number; startY: number; startT: number; moved: boolean }

/**
 * Pointer normalization: tap / drag-pan / pinch-zoom / wheel.
 * Gestures are exclusive per docs/12_MOBILE_EXPERIENCE_GUIDE.md.
 */
export class Input {
  private pointers = new Map<number, PointerRec>();
  private pinched = false;
  private lastTapT = 0;
  private lastTapX = 0;
  private lastTapY = 0;
  private velSamples: { t: number; x: number; y: number }[] = [];
  private firstGestureFired = false;

  constructor(private el: HTMLElement, private cam: Camera, private cb: InputCallbacks) {
    el.addEventListener('pointerdown', this.onDown, { passive: false });
    el.addEventListener('pointermove', this.onMove, { passive: false });
    el.addEventListener('pointerup', this.onUp, { passive: false });
    el.addEventListener('pointercancel', this.onUp, { passive: false });
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private fireFirstGesture(): void {
    if (!this.firstGestureFired) {
      this.firstGestureFired = true;
      this.cb.onFirstGesture();
    }
  }

  private onDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.fireFirstGesture();
    // pointer capture keeps move/up firing off-element; it can throw on some
    // browsers/synthetic events, so it must never break gesture start.
    try { this.el.setPointerCapture?.(e.pointerId); } catch { /* non-fatal */ }
    this.cam.stopFling();
    this.pointers.set(e.pointerId, {
      id: e.pointerId, x: e.clientX, y: e.clientY,
      startX: e.clientX, startY: e.clientY, startT: performance.now(), moved: false,
    });
    if (this.pointers.size === 1) {
      this.pinched = false;
      this.velSamples = [{ t: performance.now(), x: e.clientX, y: e.clientY }];
    } else if (this.pointers.size === 2) {
      this.pinched = true;
    }
  };

  private onMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    e.preventDefault();
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > TAP_MOVE) p.moved = true;

    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()] as [PointerRec, PointerRec];
      const prevDist = Math.hypot(a.x - b.x, a.y - b.y);
      const prevMidX = (a.x + b.x) / 2;
      const prevMidY = (a.y + b.y) / 2;
      p.x = e.clientX; p.y = e.clientY;
      const newDist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      if (prevDist > 0 && newDist > 0) this.cam.zoomAt(midX, midY, newDist / prevDist);
      this.cam.panBy(midX - prevMidX, midY - prevMidY);
    } else if (this.pointers.size === 1 && p.moved) {
      p.x = e.clientX; p.y = e.clientY;
      this.cam.panBy(dx, dy);
      const now = performance.now();
      this.velSamples.push({ t: now, x: e.clientX, y: e.clientY });
      while (this.velSamples.length > 2 && now - this.velSamples[0]!.t > 90) this.velSamples.shift();
    } else {
      p.x = e.clientX; p.y = e.clientY;
    }
  };

  private onUp = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    const now = performance.now();

    if (this.pointers.size === 0) {
      if (!this.pinched && !p.moved && now - p.startT <= TAP_MS) {
        // tap fires immediately; double-tap only affects camera
        this.cb.onTap(e.clientX, e.clientY);
        if (now - this.lastTapT <= DOUBLE_MS
          && Math.hypot(e.clientX - this.lastTapX, e.clientY - this.lastTapY) <= DOUBLE_DIST) {
          this.cb.onDoubleTap(e.clientX, e.clientY);
          this.lastTapT = 0;
        } else {
          this.lastTapT = now;
          this.lastTapX = e.clientX;
          this.lastTapY = e.clientY;
        }
      } else if (!this.pinched && p.moved && this.velSamples.length >= 2) {
        const first = this.velSamples[0]!;
        const last = this.velSamples[this.velSamples.length - 1]!;
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.005) this.cam.fling((last.x - first.x) / dt, (last.y - first.y) / dt);
      }
      this.pinched = false;
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.fireFirstGesture();
    const factor = Math.pow(1.0015, -e.deltaY);
    this.cam.zoomAt(e.clientX, e.clientY, factor);
  };
}
