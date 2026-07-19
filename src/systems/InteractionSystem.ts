/**
 * Tap routing. All tappable things register a world-space circle.
 * Custom hit-testing (instead of Pixi events) keeps pan/zoom and taps
 * perfectly disambiguated and guarantees generous hit targets.
 */
export interface Tappable {
  id: string;
  x: number;
  y: number;
  r: number;
  /** higher wins when circles overlap */
  priority: number;
  enabled: boolean;
  /** optional dynamic position source (moving hosts) */
  getPos?: () => { x: number; y: number };
  onTap: (wx: number, wy: number) => void;
}

export class InteractionSystem {
  private items = new Map<string, Tappable>();

  register(t: Tappable): Tappable {
    this.items.set(t.id, t);
    return t;
  }

  remove(id: string): void {
    this.items.delete(id);
  }

  get(id: string): Tappable | undefined {
    return this.items.get(id);
  }

  /**
   * Resolve a world-space tap. minR guarantees ≥44 screen px targets at any zoom.
   * Returns true if something handled the tap.
   */
  hit(wx: number, wy: number, zoom: number): boolean {
    const minR = 26 / zoom;
    let best: Tappable | null = null;
    let bestScore = Infinity;
    for (const t of this.items.values()) {
      if (!t.enabled) continue;
      let tx = t.x;
      let ty = t.y;
      if (t.getPos) {
        const p = t.getPos();
        tx = p.x;
        ty = p.y;
      }
      const r = Math.max(t.r, minR);
      const d = Math.hypot(wx - tx, wy - ty);
      if (d > r) continue;
      const score = d - t.priority * 10000;
      if (score < bestScore) {
        bestScore = score;
        best = t;
      }
    }
    if (best) {
      best.onTap(wx, wy);
      return true;
    }
    return false;
  }
}
