import type { SaveData } from '../data/types';

const KEY = 'ivanaland.save.v1';

function freshSave(): SaveData {
  return {
    version: 1,
    foundPhones: [],
    achievements: [],
    stats: {
      taps: 0,
      delights: 0,
      hintsUsed: 0,
      hintedPhones: [],
      districtsVisited: [],
      startedAt: Date.now(),
      completedAt: null,
      playMs: 0,
    },
    settings: { sound: true, glintHigh: false },
  };
}

/** LocalStorage persistence — versioned and corruption-safe. */
export class SaveManager {
  data: SaveData;
  private dirty = false;
  private sessionStart = performance.now();
  private savedPlayMs: number;

  constructor() {
    this.data = this.load();
    this.savedPlayMs = this.data.stats.playMs;
    window.addEventListener('pagehide', () => this.flush());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
    // periodic safety flush
    setInterval(() => { if (this.dirty) this.flush(); }, 10000);
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return freshSave();
      const d = JSON.parse(raw) as SaveData;
      if (d?.version !== 1 || !Array.isArray(d.foundPhones) || !Array.isArray(d.achievements)
        || typeof d.stats !== 'object' || typeof d.settings !== 'object') {
        return freshSave();
      }
      const f = freshSave();
      // fill any missing stat fields defensively
      d.stats = { ...f.stats, ...d.stats };
      d.settings = { ...f.settings, ...d.settings };
      return d;
    } catch {
      return freshSave();
    }
  }

  markDirty(): void {
    this.dirty = true;
  }

  flush(): void {
    try {
      this.data.stats.playMs = this.savedPlayMs + (performance.now() - this.sessionStart);
      localStorage.setItem(KEY, JSON.stringify(this.data));
      this.dirty = false;
    } catch { /* storage full/blocked — play on without saving */ }
  }

  save(): void {
    this.flush();
  }

  reset(): void {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    this.data = freshSave();
    this.savedPlayMs = 0;
    this.sessionStart = performance.now();
    this.flush();
  }

  get playMs(): number {
    return this.savedPlayMs + (performance.now() - this.sessionStart);
  }
}
