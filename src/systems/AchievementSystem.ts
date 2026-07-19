import { PHONES, phoneById } from '../data/phones';
import { DISTRICTS } from '../data/districts';
import type { SaveManager } from '../core/SaveManager';
import type { EventBus } from '../core/events';

/** Event-driven achievement evaluation — see docs/10_ACHIEVEMENT_BIBLE.md */
export class AchievementSystem {
  constructor(private save: SaveManager, private bus: EventBus) {
    bus.on('found', ({ id }) => this.onFound(id));
    bus.on('delight', () => this.onDelight());
    bus.on('district', ({ id }) => this.onDistrict(id));
  }

  has(id: string): boolean {
    return this.save.data.achievements.includes(id);
  }

  private unlock(id: string): void {
    if (this.has(id)) return;
    this.save.data.achievements.push(id);
    this.save.markDirty();
    this.bus.emit('achievement', { id });
  }

  private onFound(phoneId: number): void {
    const n = this.save.data.foundPhones.length;
    if (n >= 1) this.unlock('first-find');
    if (n >= 10) this.unlock('ten-club');
    if (n >= 25) this.unlock('quarter');
    if (n >= 50) this.unlock('halfway');
    if (n >= 75) this.unlock('deep-cut');
    if (n >= 99) this.unlock('ninety-nine');
    if (phoneId === 100) this.unlock('crown-jewel');

    const p = phoneById.get(phoneId);
    if (p) {
      const inDistrict = PHONES.filter((q) => q.district === p.district);
      if (inDistrict.every((q) => this.save.data.foundPhones.includes(q.id))) {
        this.unlock(`${p.district}-clear`);
      }
      if (p.tier >= 4 && !this.save.data.stats.hintedPhones.includes(phoneId)) {
        this.unlock('eagle-eye');
      }
      if (p.method === 'sequence') this.unlock('sequencer');
    }

    if (n >= 5 && this.save.playMs < 5 * 60 * 1000) this.unlock('early-bird');

    if (n >= 100) {
      this.unlock('all-found');
      if (!this.save.data.stats.completedAt) {
        this.save.data.stats.completedAt = Date.now();
        this.save.flush();
        this.bus.emit('completed', {});
      }
    }
  }

  private onDelight(): void {
    const d = ++this.save.data.stats.delights;
    if (d >= 25) this.unlock('curious');
    if (d >= 100) this.unlock('very-curious');
    this.save.markDirty();
  }

  private onDistrict(id: string): void {
    const visited = this.save.data.stats.districtsVisited;
    if (!visited.includes(id)) {
      visited.push(id);
      this.save.markDirty();
      if (DISTRICTS.every((d) => visited.includes(d.id))) this.unlock('tourist');
    }
  }
}
