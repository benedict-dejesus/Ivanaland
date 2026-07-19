import type { Container } from 'pixi.js';
import type { DistrictDef } from '../data/types';
import type { Animator } from './Animator';
import type { FX } from '../systems/FX';
import type { GameAudio } from '../core/Audio';

/** Everything a district builder needs. */
export interface BuildCtx {
  d: DistrictDef;
  /** cached-as-texture static art */
  statics: Container;
  /** live animated/interactive art */
  motion: Container;
  /**
   * Small ambient detail (critters, decoy sheets). Same behaviour as `motion`,
   * but hidden at far zoom where it is too small to read — keeps the world
   * dense up close without paying for it on the full-map view.
   */
  detail: Container;
  animator: Animator;
  fx: FX;
  audio: GameAudio;
  /** world point at fraction of district rect */
  p: (fx: number, fy: number) => { x: number; y: number };
  /** register a delight interaction: tap circle -> callback. Returns unregister id. */
  delight: (x: number, y: number, r: number, onTap: (x: number, y: number) => void) => void;
  /** idle anim shorthand keyed to this district */
  anim: (node: Container, spec: Parameters<Animator['add']>[2]) => void;
  patrol: (node: Container, spec: Parameters<Animator['addPatrol']>[2]) => void;
}
