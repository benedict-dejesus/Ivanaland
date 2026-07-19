# IVANALAND — 14 ASSET PIPELINE

## Philosophy: Procedural-Vector-First

Ivanaland ships **zero image files** for the world. All art is procedural vector
drawing (PixiJS `Graphics`) generated at runtime, then cached to GPU textures.
Benefits: ~0 KB art download, crisp at every zoom, trivially re-colorable,
mobile-data friendly. The "asset" is therefore **drawing code + palette data**.

## 1. Naming Conventions

- Prop factories: `props.ts` exports `makeTree()`, `makePalm()`, `makeBench()`,
  `makeNpc(spec)`, etc. — `make<PascalName>` returns a `Container`.
- District builders: `world/districts/<name>.ts` exports `build<Name>(ctx)`.
- Animation tags: nodes register with the Animator via
  `anim(node, { kind, amp, period, phase })`.
- Colors: only from `data/palette.ts` (mirrors 02_CREATIVE_DIRECTION table).
  Raw hex literals outside `palette.ts` are a lint-level offense.
- Phone hosts: named `host-<phoneId>` for debuggability.

## 2. Asset Workflow (adding art)

1. Sketch the prop as simple rounded shapes (≤ ~30 draw calls).
2. Implement as a factory in `props.ts` (shared) or inline in the district
   builder (one-off landmark).
3. Use palette roles, add a soft shadow ellipse, register idle animation.
4. Static? Ensure it's a child of the district's *static layer* (texture-cached).
   Animated/interactive? Put it on the *motion layer*.
5. Eyeball at 0.35×, 1×, and 2.5× zoom for silhouette readability.

## 3. Optimization Workflow

- Static layers per district are `cacheAsTexture()`d once after build; motion
  layers stay live and small.
- Cached texture resolution fixed at 1× world scale (zoom > 1 accepts mild
  softness on static art; interactive/phone art stays vector-live and crisp).
- Reuse factories — identical props share drawing code; variation comes from
  scale/tint/flip, not new geometry.
- Budgets: ≤ 700 display objects live per district motion layer; ≤ 30 s total
  world build time on mid-range mobile is unacceptable — target < 1.5 s (build
  measured in dev HUD).

## 4. Export Standards (the few real files)

| Asset | Format | Standard |
|---|---|---|
| App icon / favicon | PNG 512/192/32 + SVG | generated from wordmark script |
| og-image | PNG 1200×630 ≤ 150 KB | rendered by `scripts/og-image` or hand-exported once |
| Display font | woff2 ≤ 35 KB | subset to Latin + digits |
| Share cards | runtime PNG 1080×1350 / 1080×1080 | see 13 |

- Everything else: code. No sprite sheets, no atlases needed (the atlas *is*
  the cached district texture).

*Pipeline design by Benedict de Jesus.*
