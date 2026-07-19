# IVANALAND — 17 IMPLEMENTATION ROADMAP

## Milestones

**M0 — Foundations**
Vite+TS+Pixi scaffold · strict tsconfig · palette/types/districts data ·
loading screen shell · GitHub Pages base config.
✓ Checkpoint: blank world renders, 60 FPS empty scene, deploys locally.

**M1 — Core Engine**
Camera (pan/pinch/inertia/clamp/double-tap) · Input normalization · SaveManager ·
procedural Audio · Animator + culling skeleton.
✓ Checkpoint: gesture matrix passes on touch emulation; save round-trips.

**M2 — Vertical Slice (Creator Studio City)**
Full Studio district art + NPCs + interactions · PhoneSystem with all 4 discovery
methods · phones #1–10 live · glint system · HUD counter + discovery toast ·
first-run nudge.
✓ Checkpoint: a stranger finds 3 phones in 2 minutes unaided; FPS ≥ 55.
**Gameplay validation gate: does poking the world feel delightful? Iterate here
before scaling content.**

**M3 — World Expansion**
Remaining 9 districts built to 05 spec · roads/river/coast stitching · shuttle +
patrollers · ambient one-shots · all 100 phones placed · validator complete.
✓ Checkpoint: full map overview looks dense and alive; validator clean.

**M4 — Systems Complete**
Achievements (24) · hint ladder · panels (list/achievements/settings/about) ·
milestone banners · district-enter detection.
✓ Checkpoint: functional test matrix (16 §1) green.

**M5 — Completion & Sharing**
Statue finale sequence · celebration · certificate + share cards + PNG export ·
og-meta · debug endgame tools.
✓ Checkpoint: completion testing (16 §4) green both orders.

**M6 — Optimization**
Texture caching audit · culling verification · particle pooling · bundle survey ·
device matrix runs · reduced-motion pass.
✓ Checkpoint: perf budgets (16 §3) met on mid-range Android.

**M7 — Polish**
Juice pass (springs, confetti tuning, audio sweetening) · copy pass on all 100
stories/hints · empty-space audit (no dead zones) · accessibility audit.
✓ Checkpoint: full playthrough, zero console noise, delight review.

**M8 — Release**
README + release notes · GitHub Actions Pages workflow · icons/PWA meta ·
final QA gate (16 §5) · ship. 🚀

## Build Order Rationale

Engine before content (M1<M2) so the slice validates *feel* early; one complete
district before nine (M2<M3) so art/interaction patterns are proven before mass
production; systems after world (M4) because they consume final data shapes;
optimization before polish (M6<M7) so juice is tuned at real frame rates.

## Validation Checkpoints

Every milestone ends with its ✓ checkpoint; M2's gameplay gate is the only
subjective one and the most important — content scaling is forbidden until the
slice is fun.

*Roadmap by Benedict de Jesus.*
