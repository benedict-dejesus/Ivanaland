# IVANALAND — 12 MOBILE EXPERIENCE GUIDE

Mobile is primary. Every decision is made for a mid-range Android phone held in
one hand in portrait.

## 1. Touch Interactions

- **Tap** — the only gameplay verb. Registered on pointerup when total movement
  ≤ 8 px and duration ≤ 350 ms.
- **Drag** — pans the camera 1:1 with the finger; inertia on release
  (velocity-sampled over the last 80 ms, exponential decay ~0.94/frame).
- **Pinch** — zooms around the pinch midpoint; scale maps directly to distance
  ratio between the two pointers (no stepping).
- **Double-tap** — zooms in one step (×1.6) toward the tap point; at max zoom,
  zooms out to overview. 300 ms detection window; single-tap actions are *not*
  delayed (tap fires immediately; double-tap only affects camera).
- No long-press, no multi-finger gestures beyond pinch, no drag-of-objects.

## 2. Gesture Rules

- Gestures are exclusive: once a drag exceeds 8 px, the gesture can no longer
  become a tap; once a second pointer lands, the gesture is a pinch until all
  pointers lift.
- `touch-action: none` on the canvas; `preventDefault` to suppress browser
  zoom/scroll; `user-scalable=no` in the viewport meta (game handles zoom).
- Overscroll: soft elastic 80 px beyond world bounds, springs back — never a
  hard wall, never browser pull-to-refresh (blocked by touch-action).
- Interrupting inertia with a new touch stops the glide instantly (finger wins).

## 3. Layout & Ergonomics

- Portrait-first: the world is taller than wide (4000×6000); default zoom frames
  the Studio hub comfortably in portrait.
- Landscape and desktop work (camera clamps adapt); UI reflows via CSS.
- Thumb-zone: primary buttons (menu, panels' close) live in the top corners for
  reach-neutrality, sheets slide from the bottom for thumb dismissal; no
  gameplay-critical control sits mid-screen.
- Safe areas: `env(safe-area-inset-*)` padding on all HUD edges (notches,
  gesture bars).

## 4. Performance on Device

- `devicePixelRatio` capped at 2; canvas resized on orientation change with a
  150 ms debounce.
- District culling + paused off-screen animators (see 03).
- No filters/shaders beyond built-in sprite rendering; particle cap 150.
- Load budget: gzipped JS ≤ 500 KB total (PixiJS included), zero images, zero
  font files beyond one woff2 (~30 KB) — interactive in < 3 s on 4G.
- Battery: single ticker; trig-based idle animation; zero per-frame allocations
  in hot paths (verified via DevTools memory profile).

## 5. Device Testing Standards

Test matrix before release:

| Class | Example | Must pass |
|---|---|---|
| Mid Android (5 y/o) | Redmi Note 9 class | 45+ FPS, all gestures |
| Modern Android | Pixel 6 class | 60 FPS locked |
| iPhone Safari | iPhone 11+ | 60 FPS, safe areas, no bounce |
| Small screen | 360×640 CSS px | UI readable, targets ≥ 44 px |
| Tablet/desktop | iPad + Chrome desktop | Wheel zoom, drag pan, layout |

Checklist per device: load < 3 s on throttled 4G · pinch/drag/tap/double-tap ·
rotate mid-game · background & return (save intact) · low-power mode FPS ·
Lighthouse mobile perf ≥ 90.

*Mobile experience by Benedict de Jesus.*
