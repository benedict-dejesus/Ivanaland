/** IVANALAND shared types — by Benedict de Jesus */

export type DistrictId =
  | 'studio' | 'village' | 'market' | 'beauty' | 'pets'
  | 'terminal' | 'resort' | 'festival' | 'charity' | 'island';

export type PhoneCategory =
  | 'visible' | 'camouflaged' | 'partial' | 'container'
  | 'reflection' | 'interaction' | 'sequential' | 'legendary';

export type DiscoveryMethod = 'tap' | 'container' | 'reveal' | 'sequence';

export interface DistrictDef {
  id: DistrictId;
  name: string;
  /** UI/tint accent */
  accent: number;
  /** world-space bounds */
  x: number; y: number; w: number; h: number;
}

export interface PhoneDef {
  id: number;
  name: string;
  district: DistrictId;
  landmark: string;
  host: string;
  story: string;
  hint: string;
  category: PhoneCategory;
  tier: 1 | 2 | 3 | 4 | 5;
  method: DiscoveryMethod;
  /** world position of the phone (or its host) */
  x: number;
  y: number;
  /** number of steps for sequence discoveries */
  seqSteps?: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export interface SaveData {
  version: 1;
  foundPhones: number[];
  achievements: string[];
  stats: {
    taps: number;
    delights: number;
    hintsUsed: number;
    /** phone ids whose hint was viewed (for eagle-eye) */
    hintedPhones: number[];
    districtsVisited: string[];
    startedAt: number;
    completedAt: number | null;
    playMs: number;
  };
  settings: {
    sound: boolean;
    glintHigh: boolean;
  };
  playerName?: string;
}
