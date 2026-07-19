import { Application, Container } from 'pixi.js';
import { Camera } from './Camera';
import { Input } from './Input';
import { SaveManager } from './SaveManager';
import { GameAudio } from './Audio';
import { EventBus } from './events';
import { Animator } from '../world/Animator';
import { FX } from '../systems/FX';
import { InteractionSystem } from '../systems/InteractionSystem';
import { PhoneSystem } from '../systems/PhoneSystem';
import { AchievementSystem } from '../systems/AchievementSystem';
import { buildWorld, type BuiltWorld } from '../world/WorldBuilder';
import { DISTRICTS, districtById } from '../data/districts';
import type { DistrictId } from '../data/types';
import { PHONES } from '../data/phones';

export class Game {
  readonly app = new Application();
  readonly bus = new EventBus();
  readonly save = new SaveManager();
  readonly audio = new GameAudio();
  readonly animator = new Animator();
  readonly fx = new FX();
  readonly interactions = new InteractionSystem();
  camera!: Camera;
  phones!: PhoneSystem;
  achievements!: AchievementSystem;
  private world!: BuiltWorld;
  private worldRoot = new Container();
  private cullTimer = 0;
  private currentDistrict: DistrictId | null = null;
  onFirstGesture: (() => void) | null = null;

  async start(onProgress: (f: number) => void): Promise<void> {
    onProgress(0.1);
    await this.app.init({
      background: 0x2e86de,
      resizeTo: window,
      antialias: true,
      // cap render resolution at 1.5: full crispness on phones, but avoids the
      // 4x fill-rate hit of rendering the whole world at 2x on high-DPI laptops
      // with weak integrated GPUs (a major cause of low-FPS "freezes").
      resolution: Math.min(window.devicePixelRatio || 1, 1.5),
      autoDensity: true,
    });
    document.getElementById('app')!.appendChild(this.app.canvas);
    onProgress(0.25);

    this.camera = new Camera(this.worldRoot);
    this.app.stage.addChild(this.worldRoot);

    // build the world
    this.world = buildWorld(this.animator, this.fx, this.audio, this.interactions, this.bus);
    this.worldRoot.addChild(this.world.root);
    onProgress(0.6);

    // phones + achievements
    this.phones = new PhoneSystem(
      this.world.motionLayers, this.interactions, this.fx, this.audio,
      this.save, this.bus, this.animator,
    );
    this.phones.spawnAll();
    this.achievements = new AchievementSystem(this.save, this.bus);
    onProgress(0.75);

    // fx layer above everything in world space
    this.world.root.addChild(this.fx.layer);

    // cache static district art as textures (big perf win)
    for (const { statics } of this.world.districtNodes.values()) {
      try {
        (statics as Container & { cacheAsTexture?: (v: boolean) => void }).cacheAsTexture?.(true);
      } catch { /* fall back to live vectors */ }
    }
    onProgress(0.88);

    // input
    new Input(this.app.canvas, this.camera, {
      onTap: (sx, sy) => this.handleTap(sx, sy),
      onDoubleTap: (sx, sy) => this.handleDoubleTap(sx, sy),
      onFirstGesture: () => {
        this.audio.unlock();
        this.audio.enabled = this.save.data.settings.sound;
        this.onFirstGesture?.();
      },
    });

    // camera start: the Studio hub with obvious first finds in view
    const resize = (): void => this.camera.resize(this.app.renderer.width / this.app.renderer.resolution, this.app.renderer.height / this.app.renderer.resolution);
    resize();
    window.addEventListener('resize', () => setTimeout(resize, 160));
    const startZoom = Math.min(0.62, Math.max(0.34, window.innerWidth / 1500));
    this.camera.jumpTo(2000, 2050, startZoom);

    // main loop — guarded so one bad frame logs and recovers instead of
    // wedging the render loop (which would look like a hard freeze).
    this.app.ticker.add((ticker) => {
      try {
        const dt = Math.min(0.05, ticker.deltaMS / 1000);
        this.camera.update(dt);
        this.animator.tick(dt);
        this.fx.tick(dt);
        this.phones.tick(this.animator.elapsed, this.camera.viewRect(160));
        this.cullTimer += dt;
        if (this.cullTimer > 0.15) {
          this.cullTimer = 0;
          this.cullAndDetect();
        }
      } catch (err) {
        console.error('IVANALAND frame error (recovered):', err);
      }
    });

    // debug helpers (?debug)
    if (new URLSearchParams(location.search).has('debug')) this.installDebug();
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__IVANA__ = this;
    }
    onProgress(1);
  }

  private handleTap(sx: number, sy: number): void {
    try {
      const w = this.camera.screenToWorld(sx, sy);
      this.save.data.stats.taps++;
      const handled = this.interactions.hit(w.x, w.y, this.camera.zoom);
      if (!handled) {
        this.fx.ripple(w.x, w.y);
        this.audio.ripple();
      }
    } catch (err) {
      console.error('IVANALAND tap error (recovered):', err);
    }
  }

  private handleDoubleTap(sx: number, sy: number): void {
    if (this.camera.zoom > 2.2) {
      const w = this.camera.screenToWorld(sx, sy);
      this.camera.panTo(w.x, w.y, 0.45, 0.6);
    } else {
      this.camera.zoomAt(sx, sy, 1.6);
    }
  }

  panToPhone(id: number): void {
    const pos = this.phones.worldPos(id);
    this.camera.panTo(pos.x, pos.y, Math.max(this.camera.zoom, 1.1), 1.0);
  }

  private cullAndDetect(): void {
    const view = this.camera.viewRect(240);
    const active: string[] = ['global'];
    // level of detail: ambient critters/decoys are only a few pixels wide when
    // zoomed out, so hide them there. Keeps the full-map view cheap while the
    // world stays dense at the zoom levels where players actually hunt.
    const showDetail = this.camera.zoom >= 0.45;
    for (const d of DISTRICTS) {
      const nodes = this.world.districtNodes.get(d.id)!;
      const vis = d.x < view.x + view.w && d.x + d.w > view.x && d.y < view.y + view.h && d.y + d.h > view.y;
      nodes.statics.visible = vis;
      nodes.motion.visible = vis;
      nodes.detail.visible = vis && showDetail;
      if (vis) {
        active.push(d.id);
        // only tick detail animations while they are actually on screen
        if (showDetail) active.push(`${d.id}:detail`);
      }
    }
    this.animator.setActive(active);

    // district under camera center → label + tourist tracking
    const cx = this.camera.cx;
    const cy = this.camera.cy;
    let found: DistrictId | null = null;
    for (const d of DISTRICTS) {
      if (cx >= d.x && cx < d.x + d.w && cy >= d.y && cy < d.y + d.h) { found = d.id; break; }
    }
    if (found && found !== this.currentDistrict) {
      this.currentDistrict = found;
      this.bus.emit('district', { id: found });
    }
  }

  get currentDistrictName(): string {
    return this.currentDistrict ? districtById.get(this.currentDistrict)!.name : '';
  }

  private installDebug(): void {
    const dbg = {
      findAllBut: (n: number): void => {
        const remaining = PHONES.filter((p) => !this.phones.found.has(p.id));
        for (let i = 0; i < remaining.length - n; i++) {
          const p = remaining[i]!;
          this.save.data.foundPhones.push(p.id);
          this.phones.found.add(p.id);
          this.bus.emit('found', { id: p.id });
        }
        this.save.flush();
        location.reload();
      },
      reset: (): void => {
        this.save.reset();
        location.reload();
      },
      stats: (): void => {
        console.table({
          found: this.phones.found.size,
          fps: Math.round(this.app.ticker.FPS),
          achievements: this.save.data.achievements.length,
        });
      },
    };
    (window as unknown as Record<string, unknown>).ivanaland = dbg;
    console.info('🛠 IVANALAND debug: window.ivanaland.{findAllBut(n), reset(), stats()}');
  }
}
