# IVANALAND — 01 PROJECT CONSTITUTION

**Supreme governing document. All other documents and all code defer to this one.**

- Project: **IVANALAND**
- Developer / Owner / Creator: **Benedict de Jesus**
- Tagline: *Help recover the 100 lost iPhones hidden throughout Ivanaland.*
- Platform: Static web (GitHub Pages), mobile-first, no backend.
- Stack: Vite + TypeScript + PixiJS 8.

---

## 1. Vision

A mobile-first hidden-object exploration game where a single seamless, handcrafted,
living cartoon world is the star. One hundred lost iPhones give players a reason to
explore; the world itself gives them a reason to stay. Inspired by the viral Ivana
Alawi 100-iPhone giveaway in the Philippines — but built as **a creative gift for the
community**, never as a plea for a prize. The game must be fully enjoyable by someone
who has never heard of the giveaway.

Players should think: *"Someone actually built an entire game for this."*

## 2. Principles (in priority order)

1. **Player delight** — every screen contains something worth noticing.
2. **Clarity** — anyone understands the game within seconds; no tutorial required.
3. **Performance** — 60 FPS target on mid-range Android; performance beats visual excess.
4. **Fairness** — motion and hiding never frustrate; every phone is findable by
   observation and curiosity, never by pixel-hunting luck.
5. **Shareability** — the game manufactures screenshot-worthy moments.
6. **Maintainability** — data-driven content; adding a phone or district is a data
   change, not an engine change.
7. **Attribution** — "Developed by Benedict de Jesus" appears on the loading screen,
   credits, about panel, completion certificate, share cards, metadata, and README.

## 3. Constraints (non-negotiable)

- Single seamless world. No levels, no loading between districts, no progression locks.
- 100 phones, each with a story. Phone #100's design is **locked** (see 09_PHONE_BIBLE).
- Portrait-first, one-hand-comfortable mobile play. Desktop is secondary but supported.
- Static deployment only: no backend, no auth, no accounts, no cloud DB.
- Save state in LocalStorage, automatic, silent.
- Modern, colorful, vibrant art. **No** monochrome, **no** pixel art, **no** retro.
- All rendering is procedural/vector-programmatic in PixiJS (no heavy binary asset
  downloads) to guarantee fast loads on mobile data.

## 4. Success Metrics

- A first-time player finds their first phone within 60 seconds unaided.
- Players keep exploring after finding phones (interactions fire that award nothing).
- Completion generates a certificate + share card that players export and post.
- 60 FPS on a 5-year-old mid-range Android; initial load under 3 seconds on 4G.
- Zero dead zones: every viewport at default zoom contains ≥1 interactive or animated
  element.

## 5. Quality Standards

- TypeScript strict mode. No `any` in game logic.
- Every phone entry passes the data validator (unique id 1–100, all fields populated,
  position inside its district bounds).
- Every interaction has feedback within 100 ms (visual and/or audio).
- Wrong taps are gentle: a soft ripple, never a penalty.
- All text readable at minimum supported width (360 px).
- The game must never hard-lock: any modal is dismissible; save corruption falls back
  to a fresh save without crashing.

## 6. Governance

- Documents 02–17 elaborate this constitution; where they conflict, this file wins.
- Phone #100 may never be redesigned or relocated.
- Any system that threatens the 60 FPS target is cut or simplified — no exceptions.

---

*IVANALAND — created and developed by Benedict de Jesus.*
