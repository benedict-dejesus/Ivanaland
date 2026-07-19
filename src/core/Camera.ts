import type { Container } from 'pixi.js';
import { WORLD_W, WORLD_H } from '../data/districts';

/** Ocean margin around the world the camera may show */
const MARGIN = 420;
const MAX_ZOOM = 2.5;

/**
 * Camera: owns the world container transform.
 * Pan/zoom with inertia, elastic clamping, tweened panTo.
 */
export class Camera {
  /** world coords at viewport center */
  cx = 0;
  cy = 0;
  zoom = 0.5;

  private vw = 1;
  private vh = 1;
  private vx = 0; // inertia velocity (world units/s)
  private vy = 0;
  private tween: { fromX: number; fromY: number; fromZ: number; toX: number; toY: number; toZ: number; t: number; dur: number } | null = null;

  constructor(private world: Container) {}

  resize(vw: number, vh: number): void {
    this.vw = vw;
    this.vh = vh;
    this.zoom = this.clampZoom(this.zoom);
    this.apply();
  }

  get minZoom(): number {
    // never zoom out beyond world+margin fitting the longer axis comfortably
    return Math.max(this.vw / (WORLD_W + MARGIN * 2), this.vh / (WORLD_H + MARGIN * 2), 0.09);
  }

  private clampZoom(z: number): number {
    return Math.min(MAX_ZOOM, Math.max(this.minZoom, z));
  }

  screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: this.cx + (sx - this.vw / 2) / this.zoom,
      y: this.cy + (sy - this.vh / 2) / this.zoom,
    };
  }

  worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: (wx - this.cx) * this.zoom + this.vw / 2,
      y: (wy - this.cy) * this.zoom + this.vh / 2,
    };
  }

  /** visible world rect (with a small margin) */
  viewRect(pad = 0): { x: number; y: number; w: number; h: number } {
    const w = this.vw / this.zoom + pad * 2;
    const h = this.vh / this.zoom + pad * 2;
    return { x: this.cx - w / 2, y: this.cy - h / 2, w, h };
  }

  panBy(dxScreen: number, dyScreen: number): void {
    this.tween = null;
    this.cx -= dxScreen / this.zoom;
    this.cy -= dyScreen / this.zoom;
    this.softClamp(0.35);
    this.apply();
  }

  /** fling with screen-space velocity px/s */
  fling(vxScreen: number, vyScreen: number): void {
    this.vx = -vxScreen / this.zoom;
    this.vy = -vyScreen / this.zoom;
  }

  stopFling(): void {
    this.vx = 0;
    this.vy = 0;
    this.tween = null;
  }

  zoomAt(sx: number, sy: number, factor: number): void {
    this.tween = null;
    const before = this.screenToWorld(sx, sy);
    this.zoom = this.clampZoom(this.zoom * factor);
    const after = this.screenToWorld(sx, sy);
    this.cx += before.x - after.x;
    this.cy += before.y - after.y;
    this.softClamp(0.35);
    this.apply();
  }

  /** animated pan/zoom to a world point */
  panTo(x: number, y: number, zoom?: number, dur = 0.8): void {
    this.stopFling();
    this.tween = {
      fromX: this.cx, fromY: this.cy, fromZ: this.zoom,
      toX: x, toY: y, toZ: this.clampZoom(zoom ?? Math.max(this.zoom, 0.9)),
      t: 0, dur,
    };
  }

  jumpTo(x: number, y: number, zoom: number): void {
    this.cx = x; this.cy = y; this.zoom = this.clampZoom(zoom);
    this.hardClampInside();
    this.apply();
  }

  update(dt: number): void {
    if (this.tween) {
      const tw = this.tween;
      tw.t = Math.min(1, tw.t + dt / tw.dur);
      const e = 1 - Math.pow(1 - tw.t, 3); // ease-out cubic
      this.cx = tw.fromX + (tw.toX - tw.fromX) * e;
      this.cy = tw.fromY + (tw.toY - tw.fromY) * e;
      this.zoom = tw.fromZ + (tw.toZ - tw.fromZ) * e;
      if (tw.t >= 1) this.tween = null;
      this.apply();
      return;
    }
    // inertia
    if (Math.abs(this.vx) > 2 || Math.abs(this.vy) > 2) {
      this.cx += this.vx * dt;
      this.cy += this.vy * dt;
      const damp = Math.pow(0.045, dt); // strong exponential decay
      this.vx *= damp;
      this.vy *= damp;
      this.softClamp(0.12);
      this.apply();
    } else if (this.springBack(dt)) {
      this.apply();
    }
  }

  private bounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    const halfW = this.vw / 2 / this.zoom;
    const halfH = this.vh / 2 / this.zoom;
    let minX = -MARGIN + halfW;
    let maxX = WORLD_W + MARGIN - halfW;
    let minY = -MARGIN + halfH;
    let maxY = WORLD_H + MARGIN - halfH;
    if (minX > maxX) minX = maxX = WORLD_W / 2;
    if (minY > maxY) minY = maxY = WORLD_H / 2;
    return { minX, maxX, minY, maxY };
  }

  /** allow soft overscroll: pull back partway toward bounds */
  private softClamp(strength: number): void {
    const b = this.bounds();
    const over = 80 / this.zoom;
    if (this.cx < b.minX) this.cx = Math.max(this.cx, b.minX - over) + (b.minX - Math.max(this.cx, b.minX - over)) * strength;
    if (this.cx > b.maxX) this.cx = Math.min(this.cx, b.maxX + over) - (Math.min(this.cx, b.maxX + over) - b.maxX) * strength;
    if (this.cy < b.minY) this.cy = Math.max(this.cy, b.minY - over) + (b.minY - Math.max(this.cy, b.minY - over)) * strength;
    if (this.cy > b.maxY) this.cy = Math.min(this.cy, b.maxY + over) - (Math.min(this.cy, b.maxY + over) - b.maxY) * strength;
  }

  private springBack(dt: number): boolean {
    const b = this.bounds();
    const k = 1 - Math.pow(0.0001, dt);
    let moved = false;
    if (this.cx < b.minX) { this.cx += (b.minX - this.cx) * k; moved = true; }
    if (this.cx > b.maxX) { this.cx += (b.maxX - this.cx) * k; moved = true; }
    if (this.cy < b.minY) { this.cy += (b.minY - this.cy) * k; moved = true; }
    if (this.cy > b.maxY) { this.cy += (b.maxY - this.cy) * k; moved = true; }
    if (moved && Math.abs(this.cx - Math.min(Math.max(this.cx, b.minX), b.maxX)) < 0.5
      && Math.abs(this.cy - Math.min(Math.max(this.cy, b.minY), b.maxY)) < 0.5) {
      this.cx = Math.min(Math.max(this.cx, b.minX), b.maxX);
      this.cy = Math.min(Math.max(this.cy, b.minY), b.maxY);
    }
    return moved;
  }

  private hardClampInside(): void {
    const b = this.bounds();
    this.cx = Math.min(Math.max(this.cx, b.minX), b.maxX);
    this.cy = Math.min(Math.max(this.cy, b.minY), b.maxY);
  }

  apply(): void {
    this.world.scale.set(this.zoom);
    this.world.position.set(
      this.vw / 2 - this.cx * this.zoom,
      this.vh / 2 - this.cy * this.zoom,
    );
  }
}
