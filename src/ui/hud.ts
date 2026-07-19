/**
 * IVANALAND UI — DOM overlay: HUD, panels, toasts, name entry, celebration.
 * The counter pill is a live button that opens the iPhones Found Checklist.
 */
import type { Game } from '../core/Game';
import { PHONES, phoneById } from '../data/phones';
import { DISTRICTS } from '../data/districts';
import { ACHIEVEMENTS, achById } from '../data/achievements';
import { ShareSystem } from '../systems/ShareSystem';

const MILESTONES: Record<number, string> = {
  25: 'COLLECTOR — 25 FOUND!',
  50: 'HALFWAY HERO — 50 FOUND!',
  75: 'DEEP CUTS — 75 FOUND!',
  99: 'SO CLOSE — 99 FOUND!',
};

function el(tag: string, cls?: string, html?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class UI {
  private share: ShareSystem;
  private counter!: HTMLElement;
  private districtLabel!: HTMLElement;
  private toasts!: HTMLElement;
  private backdrop!: HTMLElement;
  private panels = new Map<string, HTMLElement>();
  private openPanel: string | null = null;
  private nudge: HTMLElement | null = null;
  private zoomChip: HTMLElement | null = null;
  private toastQueue: { title: string; body: string; cls: string }[] = [];
  private toastActive = 0;

  constructor(private game: Game) {
    this.share = new ShareSystem(game.save);
    this.buildHud();
    this.buildPanels();
    this.wireEvents();
    if (!game.save.data.playerName) this.showNameEntry();
  }

  /* ================= HUD ================= */

  private buildHud(): void {
    const hud = el('div');
    hud.id = 'hud';

    const top = el('div', 'hud-top');
    this.counter = el('button', 'pill');
    this.counter.setAttribute('aria-label', 'Open iPhones Found checklist');
    this.updateCounter(false);
    this.counter.addEventListener('click', () => this.togglePanel('checklist'));

    const menuBtn = el('button');
    menuBtn.id = 'menu-btn';
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.addEventListener('click', () => this.togglePanel('menu'));

    top.append(this.counter, menuBtn);

    this.districtLabel = el('div');
    this.districtLabel.id = 'district-label';

    this.toasts = el('div');
    this.toasts.id = 'toasts';

    this.nudge = el('button', '', '100 iPhones are lost in Ivanaland. Tap anything! 👀');
    this.nudge.id = 'nudge';
    this.nudge.addEventListener('click', () => this.dismissNudge());

    this.zoomChip = el('div', '', 'Pinch or scroll to zoom · drag to explore');
    this.zoomChip.id = 'zoom-chip';

    hud.append(top, this.districtLabel, this.nudge, this.zoomChip);
    document.body.append(hud, this.toasts);

    this.backdrop = el('div');
    this.backdrop.id = 'panel-backdrop';
    this.backdrop.addEventListener('click', () => this.closePanels());
    document.body.append(this.backdrop);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePanels();
    });

    this.game.onFirstGesture = () => {
      setTimeout(() => this.zoomChip?.classList.add('hidden'), 4000);
    };
  }

  private dismissNudge(): void {
    this.nudge?.remove();
    this.nudge = null;
  }

  private updateCounter(tick: boolean): void {
    const n = this.game.save.data.foundPhones.length;
    this.counter.innerHTML = `📱 <span>iPhones Found: <strong>${n}</strong> / 100</span>`;
    if (tick) {
      this.counter.classList.remove('tick');
      void this.counter.offsetWidth;
      this.counter.classList.add('tick');
      setTimeout(() => this.counter.classList.remove('tick'), 240);
    }
  }

  /* ================= panels ================= */

  private panelShell(id: string, title: string): { panel: HTMLElement; body: HTMLElement } {
    const panel = el('div', 'panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', title);
    const head = el('div', 'panel-head');
    head.append(el('h2', '', esc(title)));
    const close = el('button', 'panel-close', '✕');
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => this.closePanels());
    head.append(close);
    const body = el('div', 'panel-body');
    panel.append(head, body);
    document.body.append(panel);
    this.panels.set(id, panel);
    return { panel, body };
  }

  private buildPanels(): void {
    // menu
    const menu = this.panelShell('menu', 'IVANALAND').body;
    const grid = el('div', 'menu-grid');
    const items: [string, string, () => void][] = [
      ['📱', 'iPhone Checklist', () => this.togglePanel('checklist')],
      ['🏆', 'Achievements', () => this.togglePanel('achievements')],
      ['📤', 'Share Progress', () => void this.shareProgress()],
      ['⚙️', 'Settings', () => this.togglePanel('settings')],
      ['💛', 'About & Credits', () => this.togglePanel('about')],
    ];
    for (const [icon, label, fn] of items) {
      const b = el('button', 'menu-item', `<span class="mi-icon">${icon}</span>${esc(label)}`);
      b.addEventListener('click', fn);
      grid.append(b);
    }
    menu.append(grid);

    this.panelShell('checklist', 'iPhones Found');
    this.panelShell('achievements', 'Achievements');
    this.buildSettings();
    this.buildAbout();
  }

  private renderChecklist(): void {
    const body = this.panels.get('checklist')!.querySelector('.panel-body') as HTMLElement;
    body.innerHTML = '';
    const foundSet = new Set(this.game.save.data.foundPhones);

    // 10×10 numbered grid
    const gridWrap = el('div');
    gridWrap.style.cssText = 'display:grid;grid-template-columns:repeat(10,1fr);gap:5px;margin-bottom:16px;';
    for (let i = 1; i <= 100; i++) {
      const found = foundSet.has(i);
      const cell = el('button', '', found ? '✓' : String(i));
      cell.style.cssText = `aspect-ratio:1;border-radius:8px;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;`
        + (found
          ? 'background:#3DDCB1;color:#fff;box-shadow:0 2px 6px rgba(61,220,177,0.45);'
          : 'background:rgba(58,50,66,0.07);color:#8d8598;');
      cell.setAttribute('aria-label', `Phone ${i} ${found ? 'found' : 'not found'}`);
      if (found) {
        cell.addEventListener('click', () => {
          this.closePanels();
          this.game.panToPhone(i);
        });
      }
      gridWrap.append(cell);
    }
    body.append(gridWrap);

    // district-grouped details
    for (const d of DISTRICTS) {
      const group = el('div', 'district-group');
      const phones = PHONES.filter((p) => p.district === d.id);
      const nFound = phones.filter((p) => foundSet.has(p.id)).length;
      group.append(el('div', 'district-head',
        `<span>${esc(d.name)}</span><span class="dh-count">${nFound}/10</span>`));
      for (const p of phones) {
        const found = foundSet.has(p.id);
        const row = el('div', `phone-row${found ? ' found' : ''}`);
        const status = el('span', 'pr-status', found ? '✅' : '❓');
        const main = el('div', 'pr-main');
        main.append(el('div', 'pr-name', found ? `#${p.id} — ${esc(p.name)}` : `#${p.id} — ???`));
        main.append(el('div', 'pr-sub', found ? esc(p.story) : `${esc(p.landmark)} · ${'★'.repeat(p.tier)}`));
        row.append(status, main);
        if (found) {
          row.style.cursor = 'pointer';
          row.addEventListener('click', () => {
            this.closePanels();
            this.game.panToPhone(p.id);
          });
        } else {
          const hintBtn = el('button', 'pr-hint', '💡');
          hintBtn.setAttribute('aria-label', `Hint for phone ${p.id}`);
          hintBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.revealHint(p.id, main);
          });
          row.append(hintBtn);
        }
        group.append(row);
      }
      body.append(group);
    }
  }

  private revealHint(phoneId: number, into: HTMLElement): void {
    const p = phoneById.get(phoneId)!;
    const save = this.game.save;
    save.data.stats.hintsUsed++;
    if (!save.data.stats.hintedPhones.includes(phoneId)) save.data.stats.hintedPhones.push(phoneId);
    save.markDirty();
    this.game.bus.emit('hint', { phoneId });
    const existing = into.querySelector('.hint-reveal');
    const d = DISTRICTS.find((q) => q.id === p.district)!;
    const extra = existing ? `<br><em>District: ${esc(d.name)} · Landmark: ${esc(p.landmark)}</em>` : '';
    const hintEl = existing ?? el('div', 'hint-reveal');
    hintEl.innerHTML = `💡 ${esc(p.hint)}${extra}`;
    if (!existing) into.append(hintEl);
  }

  private renderAchievements(): void {
    const body = this.panels.get('achievements')!.querySelector('.panel-body') as HTMLElement;
    body.innerHTML = '';
    const grid = el('div', 'ach-grid');
    const got = new Set(this.game.save.data.achievements);
    for (const a of ACHIEVEMENTS) {
      const has = got.has(a.id);
      const card = el('div', `ach-card${has ? '' : ' locked'}`);
      card.append(el('div', 'ac-icon', has ? a.icon : '🔒'));
      card.append(el('div', 'ac-name', esc(a.name)));
      card.append(el('div', 'ac-desc', esc(a.desc)));
      grid.append(card);
    }
    body.append(grid);
  }

  private buildSettings(): void {
    const body = this.panelShell('settings', 'Settings').body;
    const save = this.game.save;

    const soundRow = el('div', 'set-row', '<span>Sound</span>');
    const soundSw = el('button', `switch${save.data.settings.sound ? ' on' : ''}`);
    soundSw.setAttribute('aria-label', 'Toggle sound');
    soundSw.addEventListener('click', () => {
      save.data.settings.sound = !save.data.settings.sound;
      this.game.audio.enabled = save.data.settings.sound;
      soundSw.classList.toggle('on', save.data.settings.sound);
      save.markDirty();
    });
    soundRow.append(soundSw);

    const glintRow = el('div', 'set-row', '<span>Extra glints (easier)</span>');
    const glintSw = el('button', `switch${save.data.settings.glintHigh ? ' on' : ''}`);
    glintSw.setAttribute('aria-label', 'Toggle extra glints');
    glintSw.addEventListener('click', () => {
      save.data.settings.glintHigh = !save.data.settings.glintHigh;
      glintSw.classList.toggle('on', save.data.settings.glintHigh);
      save.markDirty();
    });
    glintRow.append(glintSw);

    const nameRow = el('div', 'set-row', '<span>Explorer name</span>');
    const nameBtn = el('button', '', esc(save.data.playerName ?? '—'));
    nameBtn.style.cssText = 'font-weight:800;color:#2E86DE;';
    nameBtn.addEventListener('click', () => this.showNameEntry());
    nameRow.append(nameBtn);

    const dataNote = el('p', '', 'Progress saves automatically on this device only.');
    dataNote.style.cssText = 'font-size:12.5px;color:#6b6277;margin:8px 4px 14px;';

    const reset = el('button', 'danger-btn', 'Reset all progress');
    let armed = false;
    reset.addEventListener('click', () => {
      if (!armed) {
        armed = true;
        reset.textContent = 'Tap again to erase everything — no undo!';
        setTimeout(() => { armed = false; reset.textContent = 'Reset all progress'; }, 3500);
      } else {
        save.reset();
        location.reload();
      }
    });

    body.append(soundRow, glintRow, nameRow, dataNote, reset);
  }

  private buildAbout(): void {
    const body = this.panelShell('about', 'About IVANALAND').body;
    body.classList.add('about-body');
    body.innerHTML = `
      <p>When Ivana Alawi announced a giveaway of 100 iPhones, thousands of people
      made videos, art, and posts. <strong>Benedict de Jesus</strong> built a world instead.</p>
      <p>IVANALAND is a creative gift for the community — a living, handcrafted island
      where all 100 iPhones went missing. No prizes, no catch. Just the joy of looking
      closely and the delight of finding.</p>
      <div class="about-credit">🏝️ IVANALAND<br>Created &amp; developed by Benedict de Jesus</div>
      <p class="fine">Fan-made and non-commercial. Not affiliated with, endorsed by, or connected to
      Ivana Alawi or Apple Inc. No real prizes are offered. All art is original.
      Your progress is stored only on your device.</p>`;
    const copy = el('button', 'primary-btn', '🔗 Copy game link');
    copy.addEventListener('click', () => {
      void navigator.clipboard?.writeText(location.href.split('?')[0]!).then(() => {
        copy.textContent = '✓ Link copied!';
        setTimeout(() => { copy.textContent = '🔗 Copy game link'; }, 2000);
      });
    });
    body.append(copy);
  }

  private togglePanel(id: string): void {
    if (this.openPanel === id) { this.closePanels(); return; }
    this.closePanels();
    if (id === 'checklist') this.renderChecklist();
    if (id === 'achievements') this.renderAchievements();
    this.openPanel = id;
    this.panels.get(id)!.classList.add('show');
    this.backdrop.classList.add('show');
  }

  private closePanels(): void {
    for (const p of this.panels.values()) p.classList.remove('show');
    this.backdrop.classList.remove('show');
    this.openPanel = null;
  }

  /* ================= name entry ================= */

  private showNameEntry(): void {
    const overlay = el('div');
    overlay.id = 'celebrate';
    overlay.classList.add('show');
    const card = el('div', 'cele-card');
    card.innerHTML = `
      <div class="cele-emoji">🧭</div>
      <h2>Who's exploring today?</h2>
      <p>100 iPhones are lost across Ivanaland.<br>Sign in to the recovery team!</p>`;
    const input = el('input') as HTMLInputElement;
    input.className = 'cele-name-input';
    input.maxLength = 24;
    input.placeholder = 'Your name';
    input.value = this.game.save.data.playerName ?? '';
    const go = el('button', 'primary-btn', "Let's explore! 🏝️");
    const start = (): void => {
      this.game.save.data.playerName = input.value.trim() || 'Legendary Explorer';
      this.game.save.flush();
      overlay.remove();
      const nb = this.panels.get('settings')?.querySelector('.set-row button:not(.switch)');
      if (nb) nb.textContent = this.game.save.data.playerName;
    };
    go.addEventListener('click', start);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') start(); });
    card.append(input, go);
    overlay.append(card);
    document.body.append(overlay);
    setTimeout(() => input.focus(), 400);
  }

  /* ================= toasts ================= */

  private toast(title: string, body: string, cls = ''): void {
    this.toastQueue.push({ title, body, cls });
    this.drainToasts();
  }

  private drainToasts(): void {
    if (this.toastActive >= 2 || this.toastQueue.length === 0) return;
    const { title, body, cls } = this.toastQueue.shift()!;
    this.toastActive++;
    const t = el('div', `toast ${cls}`);
    t.append(el('h4', '', title), el('p', '', body));
    this.toasts.append(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => {
        t.remove();
        this.toastActive--;
        this.drainToasts();
      }, 360);
    }, cls === 'milestone' ? 3600 : 3000);
  }

  /* ================= events ================= */

  private wireEvents(): void {
    const bus = this.game.bus;
    bus.on('found', ({ id }) => {
      this.dismissNudge();
      this.updateCounter(true);
      const p = phoneById.get(id)!;
      this.toast(`📱 #${p.id} — ${p.name}`, p.story);
      const n = this.game.save.data.foundPhones.length;
      const m = MILESTONES[n];
      if (m) {
        this.game.audio.fanfare();
        this.toast(`🎉 ${m}`, 'Keep exploring — Ivanaland has more secrets.', 'milestone');
      }
      if (this.openPanel === 'checklist') this.renderChecklist();
    });
    bus.on('achievement', ({ id }) => {
      const a = achById.get(id);
      if (!a) return;
      this.game.audio.chime();
      this.toast(`${a.icon} Achievement: ${a.name}`, a.desc, 'gold');
    });
    bus.on('district', ({ id }) => {
      const d = DISTRICTS.find((q) => q.id === id);
      if (!d) return;
      this.districtLabel.textContent = d.name;
      this.districtLabel.classList.add('show');
      setTimeout(() => this.districtLabel.classList.remove('show'), 2600);
    });
    bus.on('completed', () => {
      setTimeout(() => this.showCompletion(), 1800);
    });
  }

  /* ================= completion & sharing ================= */

  private showCompletion(): void {
    const overlay = el('div');
    overlay.id = 'celebrate';
    overlay.classList.add('show');
    const card = el('div', 'cele-card');
    card.innerHTML = `
      <div class="cele-emoji">👑</div>
      <h2>ALL 100 FOUND!</h2>
      <p><strong>${esc(this.game.save.data.playerName ?? 'Legendary Explorer')}</strong>, you recovered every
      lost iPhone in Ivanaland. You are the Keeper of Ivanaland!</p>`;
    const preview = el('img', 'share-preview') as HTMLImageElement;
    preview.alt = 'Completion certificate';
    const refresh = (): void => {
      preview.src = this.share.renderCertificate(this.game.save.data.playerName ?? '').toDataURL();
    };
    refresh();
    const dl = el('button', 'primary-btn', '⬇️ Save certificate (PNG)');
    dl.addEventListener('click', () => {
      void this.share.export(this.share.renderCertificate(this.game.save.data.playerName ?? ''), 'ivanaland-certificate.png')
        .then((r) => { dl.textContent = r === 'shared' ? '✓ Shared!' : '✓ Saved!'; });
    });
    const shareCard = el('button', 'primary-btn', '📤 Share card');
    shareCard.style.background = '#B565D8';
    shareCard.addEventListener('click', () => {
      void this.share.export(this.share.renderProgressCard(), 'ivanaland-complete.png');
    });
    const keep = el('button', 'primary-btn', 'Keep exploring 🏝️');
    keep.style.background = '#3DDCB1';
    keep.addEventListener('click', () => overlay.remove());
    card.append(preview, dl, shareCard, keep);
    overlay.append(card);
    document.body.append(overlay);
    // celebratory confetti storm in world space at the statue
    const statue = phoneById.get(100)!;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.game.fx.confetti(statue.x + (i - 2) * 120, statue.y - 200, 30, 320), i * 350);
    }
  }

  private async shareProgress(): Promise<void> {
    this.closePanels();
    await this.share.export(this.share.renderProgressCard(), 'ivanaland-progress.png');
    this.toast('📤 Progress card ready', 'Saved as an image — post it anywhere!');
  }
}
