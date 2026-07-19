# IVANALAND — 03 TECHNICAL ARCHITECTURE

## 1. Stack

- **Vite 6** — build/dev, base-path configured for GitHub Pages.
- **TypeScript (strict)** — all game code.
- **PixiJS 8** — WebGL renderer with automatic Canvas fallback.
- Zero runtime dependencies beyond PixiJS. No backend, no analytics, no fonts CDN
  (system font stack + one embedded display font via CSS).

## 2. High-Level Architecture

```
src/
  main.ts                 // boot: loading screen → Game
  core/
    Game.ts               // owns Pixi Application, layers, systems, main loop
    Camera.ts             // pan/zoom/inertia/clamping, screen<->world transforms
    Input.ts              // pointer + pinch gesture normalization
    SaveManager.ts        // LocalStorage persistence, versioned, corruption-safe
    Audio.ts              // procedural WebAudio synth (no assets)
  world/
    WorldBuilder.ts       // composes districts into the seamless world
    districts/*.ts        // one builder per district (procedural vector art)
    props.ts              // shared prop factories (trees, benches, NPCs...)
    Animator.ts           // idle-motion system (bob/sway/patrol/rotate)
  systems/
    PhoneSystem.ts        // spawn, discovery logic, glint, found FX
    InteractionSystem.ts  // tap routing, container/sequence logic
    AchievementSystem.ts  // evaluates unlock conditions
    HintSystem.ts         // per-phone hints, cooldown
    ShareSystem.ts        // certificate + share card canvas rendering, PNG export
  ui/
    HUD.ts                // counter, district label, buttons (DOM overlay)
    Panels.ts             // phone list, achievements, about, settings
    Toast.ts              // discovery toasts, achievement popups
  data/
    phones.ts             // ALL 100 phone definitions (single source of truth)
    achievements.ts       // achievement catalog
    districts.ts          // district metadata + bounds
    types.ts              // shared types
```

**Pattern:** data-driven composition. Systems read declarative data; the engine never
special-cases individual phones except discovery-method handlers keyed by type.

## 3. Rendering Strategy

- **One world container** under the camera; districts are child containers built
  procedurally from `PIXI.Graphics` (vector) — crisp at any zoom, tiny download.
- Static geometry per district is drawn into Graphics objects and **cached as
  textures** (`cacheAsTexture`) so the per-frame cost is sprite blits, not vector
  re-tessellation.
- Animated props stay live (not cached) in a separate district "motion layer".
- **Culling:** each district container toggles `visible`/`renderable` via its bounds
  vs camera view (with margin). Off-screen animators are paused.
- **Level of detail:** ambient distraction (decoy sheets, butterflies,
  dragonflies, birds, pinwheels) lives in a per-district `detail` container and
  its own animator group (`<district>:detail`). Below zoom 0.45 the container is
  hidden *and* its animator group is deactivated — writing transforms to
  off-screen nodes churns Pixi's batching and costs more than drawing them, so
  both must be switched off together.
- UI is DOM (HTML/CSS) overlaid on the canvas — free accessibility, crisp text,
  no font atlas cost.
- `resolution = min(devicePixelRatio, 2)` to cap fill-rate on high-DPI phones.

## 4. Performance Strategy

- Target 60 FPS mid-range Android: budget ≤ 4 ms scripting, ≤ 8 ms GPU per frame.
- Animator uses one ticker; each animated node stores phase/amplitude; simple
  trig — no per-prop tween objects, no allocations in the loop.
- Pointer hit-testing: Pixi interaction only on tappable nodes (`eventMode='static'`);
  decorative nodes are `eventMode='none'`.
- No filters on the world (no blur/glow shaders); glints are additive sprites.
- Texture memory: cached district textures rendered at fixed base resolution;
  world ~4000×6000 units splits into per-district caches to stay under GPU limits.
- Battery: ticker drops to 30 FPS when page hidden is N/A (browser pauses); idle
  detection is unnecessary — animation cost is small and constant.

## 5. Save Strategy

- Key: `ivanaland.save.v1`. JSON: `{ version, foundPhones: number[], achievements:
  string[], stats { taps, hintsUsed, startedAt, completedAt, playMs }, settings }`.
- Autosave on every discovery/achievement + `visibilitychange`/`pagehide`.
- Load path validates shape; any parse/shape failure → fresh save (never crash).
- Version field enables future migration functions.

## 6. Scalability Strategy

- New phone = one entry in `data/phones.ts` (validator enforces completeness).
- New district = metadata entry + one builder file + phone entries.
- Discovery methods are a closed enum with per-type handlers; adding a type touches
  one switch in `PhoneSystem`.
- Share/certificate rendering reads stats generically — no per-content coupling.

## 7. Deployment

- `vite build` → `dist/` static bundle; GitHub Pages via Actions workflow.
- `base: './'` relative paths so the site works at any repo path.
- PWA-lite: theme-color, icons, meta og: tags for share previews.

---

*Architecture by Benedict de Jesus.*
