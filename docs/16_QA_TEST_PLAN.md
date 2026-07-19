# IVANALAND — 16 QA TEST PLAN

## 1. Functional Testing

**Data integrity (automated, runs at dev boot via `validate.ts`):**
- 100 phones, unique contiguous ids, all fields populated, positions in-bounds,
  10 per district, category+host uniqueness per district, #100 locked fields.
- 24 achievements with resolvable conditions.

**Discovery methods (manual matrix — every method × one representative):**
- `tap` visible/camo/partial: tap finds; near-miss ripples; found state persists.
- `container`: opens, phone tappable, auto-closes after 6 s, reopens freely.
- `reveal`: trigger prop exposes phone; state lasts ≥ 6 s; re-triggerable.
- `sequence`: steps advance with feedback; wrong taps don't reset; completing
  reveals phone; sequence state survives panning away and back.
- Phone #100: full statue sequence → crown opens → finale celebration.

**Systems:**
- Counter increments exactly once per phone; no double-find via rapid taps.
- Hints: open from list, 3-view escalation adds district.
- Achievements: each unlock condition fires once; toast queue never overlaps.
- Save: every find/achievement persists across reload; corrupted LocalStorage
  (garbage JSON, wrong shape, wrong version) → fresh save, no crash.
- Reset progress: double-confirm, wipes save, world glints return.

## 2. Mobile Testing

- Gesture matrix per 12: tap/drag/pinch/double-tap exclusivity; no browser zoom,
  scroll, or pull-to-refresh leaks; inertia interruptible.
- Rotation mid-game: canvas resizes, camera stays clamped, UI reflows.
- Background/foreground: save fires on `pagehide`; ticker resumes cleanly.
- Safe areas honored on notched devices; one-hand reachability of menu + sheets.
- Device matrix in 12 §5 — all rows green before release.

## 3. Performance Testing

- FPS: ≥ 55 sustained on modern Android, ≥ 45 on 5-y/o mid-range, at overview
  zoom (worst case: most districts visible) and during confetti burst.
- Memory: heap stable over 10-min session (no per-frame allocation growth).
- Load: cold load interactive < 3 s on throttled Fast-4G; bundle ≤ 500 KB gz.
- Culling: dev HUD confirms off-screen districts render-skip + paused animators.
- Long-session soak: 30 min autoplay pan script — no leaks, no FPS decay.

## 4. Completion Testing

- Dev cheat (`?debug` URL param): "find all but N" to reach endgame states fast.
- 99-found state: remaining phone double-glint; So Close achievement.
- 100th find (both orders: #100 last and #100 not last) → completion fires once.
- Certificate + share cards render correctly (name input, stats accurate, PNG
  downloads; Web Share path on mobile; DOM fallback card displays).
- Post-completion: world remains explorable; panels reflect completed state;
  reload preserves completion.

## 5. Release Gate Checklist

- [ ] Validator clean · [ ] method matrix green · [ ] device matrix green
- [ ] perf budgets met · [ ] completion path green ×2 orders
- [ ] og-tags unfurl on FB debugger · [ ] GitHub Pages build serves at repo path
- [ ] About/credits/certificate all attribute **Benedict de Jesus**
- [ ] No console errors or warnings in a full playthrough

*QA plan by Benedict de Jesus.*
