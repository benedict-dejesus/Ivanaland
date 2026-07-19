import type { DistrictDef, DistrictId } from './types';
import { PAL } from './palette';

/** World size (world units). Portrait: taller than wide. */
export const WORLD_W = 4000;
export const WORLD_H = 5800;

export const DISTRICTS: DistrictDef[] = [
  { id: 'terminal', name: 'Travel Terminal',    accent: PAL.waterShallow, x: 0,    y: 0,    w: 2000, h: 1400 },
  { id: 'island',   name: 'Adventure Island',   accent: PAL.jungle,       x: 2000, y: 0,    w: 2000, h: 1400 },
  { id: 'village',  name: 'Family Village',     accent: PAL.grassLight,   x: 0,    y: 1400, w: 1300, h: 1500 },
  { id: 'studio',   name: 'Creator Studio City',accent: PAL.sun,          x: 1300, y: 1400, w: 1400, h: 1500 },
  { id: 'resort',   name: 'Luxury Resort',      accent: PAL.sand,         x: 2700, y: 1400, w: 1300, h: 2900 },
  { id: 'market',   name: 'Foodie Market',      accent: PAL.coral,        x: 0,    y: 2900, w: 1300, h: 1400 },
  { id: 'beauty',   name: 'Beauty Boulevard',   accent: PAL.berry,        x: 1300, y: 2900, w: 1400, h: 1400 },
  { id: 'pets',     name: 'Pet Paradise Park',  accent: PAL.grass,        x: 0,    y: 4300, w: 1300, h: 1500 },
  { id: 'festival', name: 'Fan Festival Plaza', accent: PAL.berry,        x: 1300, y: 4300, w: 1400, h: 1500 },
  { id: 'charity',  name: 'Charity Corner',     accent: PAL.mint,         x: 2700, y: 4300, w: 1300, h: 1500 },
];

export const districtById = new Map<DistrictId, DistrictDef>(
  DISTRICTS.map((d) => [d.id, d]),
);

/** Ground colour under each district — used to blend sheets and field designs. */
export const GROUND: Record<DistrictId, number> = {
  studio: PAL.grass,
  village: PAL.grass,
  market: 0xe8cdb0,
  beauty: PAL.grass,
  pets: PAL.grassLight,
  terminal: PAL.grassLight,
  resort: PAL.sand,
  festival: 0xd9cce8,
  charity: PAL.grass,
  island: PAL.jungle,
};

/** world point at fractional position inside a district's rect */
export function dp(id: DistrictId, fx: number, fy: number): { x: number; y: number } {
  const d = districtById.get(id)!;
  return { x: Math.round(d.x + d.w * fx), y: Math.round(d.y + d.h * fy) };
}
