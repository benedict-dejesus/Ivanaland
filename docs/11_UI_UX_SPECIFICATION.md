# IVANALAND — 11 UI/UX SPECIFICATION

UI is a DOM overlay above the PixiJS canvas: crisp text, native scrolling,
accessibility for free. Visual language: cream rounded cards (`#FFF8EC`), ink text
(`#3A3242`), sunshine/coral accents, big soft shadows, springy transitions.

## 1. Screens & Flow

```
Loading screen ──▶ Game (world + HUD)
                     ├─ Phone List panel
                     ├─ Achievements panel
                     ├─ Settings panel
                     ├─ About / Credits panel
                     ├─ Discovery toast (auto)
                     └─ Completion celebration ─▶ Certificate / Share card
```

- **Loading screen:** IVANALAND wordmark, tagline, "Developed by Benedict de
  Jesus", animated phone glint, progress shimmer. Auto-dismisses into the game —
  no "press start" friction.
- **Player name entry (first run):** a single friendly card asks "Who's
  exploring today?" with a name input (default placeholder "Legendary
  Explorer"). Stored locally in the save; used across the HUD greeting and the
  completion certificate. Editable later in Settings.
- **First-run nudge (not a tutorial):** one dismissible line over the world:
  "100 iPhones are lost in Ivanaland. Tap anything. 👀" Disappears on first find
  or first dismiss, never returns.

## 2. HUD (always visible, minimal)

- **Top-left:** phone counter pill — `📱 iPhones Found: 12 / 100` — updates live
  with a springy tick animation on every find, **and is a button**: tapping it
  opens the iPhones Found Checklist (numbered 1–100 grid with found/unfound
  indicators, plus the district-grouped detail list).
- **Top-center:** current district name (fades in on district change).
- **Top-right:** menu button (☰) → opens panel drawer.
- **Bottom-right:** zoom hint chip on first launch only ("pinch to zoom").
- All HUD elements sit inside safe-area insets; touch targets ≥ 48 px.

## 3. Panels

Slide-up sheets (mobile) / centered cards (desktop ≥ 768 px). All dismissible via
X, backdrop tap, and Escape.

- **iPhones Found Checklist:** opens from the counter pill (and menu). Top: a
  10×10 numbered grid of all 100 phones — found numbers glow mint with a ✓,
  unfound stay dimmed. Below: the district-grouped detail list; each row = name
  + status (found ✅ / silhouette ❓) + hint button 💡. Found rows show the
  phone's story. District headers show `n/10` progress. Tapping a found phone's
  row pans the camera to it.
- **Achievements:** grid of cards, locked cards show conditions; earned show date.
- **Settings:** sound on/off, glint intensity (normal/high), reset progress
  (double-confirm), data note ("saves only on this device").
- **About:** the project story (a creative gift inspired by the 100-iPhone
  giveaway), credits — **Benedict de Jesus, creator & developer** — and the
  non-affiliation disclaimer.

## 4. Camera Controls

- Drag to pan (mouse-drag on desktop), pinch to zoom (wheel/trackpad on desktop),
  double-tap to zoom in a step toward the tap point.
- Inertial glide after release with exponential damping; elastic clamp at world
  edges (soft 80 px overscroll, springs back).
- Zoom range 0.35× (full map) – 2.5× (detail); zoom pivots on pinch center.
- Tap vs drag disambiguation: ≤ 8 px movement and ≤ 350 ms = tap.

## 5. Feedback & Toasts

- **Discovery toast:** slides from top — phone name + story one-liner + counter.
  Confetti burst at world position; cyan pop ring; chime.
- **Achievement toast:** gold-trimmed, queues behind discovery toasts.
- **Milestones (25/50/75/99):** full-width banner moment + bigger confetti.
- **Completion:** the sky rains confetti, statue fires beams, celebration panel
  offers Certificate + Share Card (see 13).

## 6. Accessibility

- All UI text real DOM: screen-reader labels on every control; the phone list
  and hints make the game completable without precise vision of the canvas.
- Respects `prefers-reduced-motion`: idle amplitude halved, confetti reduced,
  no screen shake.
- Color-independent signals: glints are motion+brightness, not hue-only; found
  status uses icons, not color alone.
- Hit targets ≥ 44 px; no time limits anywhere; sound never required.
- Font sizes ≥ 14 px at 360 px width; supports OS text scaling gracefully.

## 7. User Flows (key)

- **Find a phone:** see glint → zoom → tap (→ maybe open container) → toast +
  confetti → counter ticks → autosave.
- **Stuck:** menu → Phone List → 💡 hint → (after 3 views) hint shows district.
- **Complete:** find #100 → crown sequence → celebration → export certificate
  PNG → share.

*UX design by Benedict de Jesus.*
