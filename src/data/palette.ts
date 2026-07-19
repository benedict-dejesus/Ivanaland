/** IVANALAND master palette — mirrors docs/02_CREATIVE_DIRECTION.md */
export const PAL = {
  waterDeep: 0x2e86de,
  waterShallow: 0x6bc5f2,
  waterFoam: 0xd9f2ff,
  grass: 0x8cd867,
  grassLight: 0xa9e27e,
  grassDark: 0x74c153,
  sand: 0xf7e2a9,
  sandDark: 0xecd28e,
  road: 0xb0a8b9,
  roadDark: 0x8d8598,
  roadLine: 0xe8e2ee,
  sun: 0xffc93c,
  sunDark: 0xe8a91d,
  coral: 0xff6b6b,
  coralDark: 0xe04f4f,
  berry: 0xb565d8,
  berryDark: 0x9647bb,
  mint: 0x3ddcb1,
  mintDark: 0x27b892,
  cream: 0xfff8ec,
  ink: 0x3a3242,
  inkSoft: 0x6b6277,
  white: 0xffffff,
  phoneGlow: 0x5ac8fa,
  phoneBody: 0x3a3242,
  wood: 0xc98d5e,
  woodDark: 0xa96f43,
  jungle: 0x4faf5c,
  jungleDark: 0x3a8f49,
  skinA: 0xf2c9a0,
  skinB: 0xc98d5e,
  skinC: 0x8d5b34,
  shadow: 0x3a3242,
} as const;

/** deterministic pseudo-random for stable world layouts */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
