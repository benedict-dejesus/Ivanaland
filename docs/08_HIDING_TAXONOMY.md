# IVANALAND — 08 HIDING TAXONOMY

## 1. Discovery Philosophy

A hidden phone is a **promise**: if you notice, wonder, or poke, you will be
rewarded. Every phone is discoverable through observation and curiosity — never
through luck, brute-force tapping, or pixel-perfect precision. The player should
always be able to say *how* they found it ("I saw the glint in the mirror", "the
dog kept staring at that mound").

## 2. Hiding Categories (8)

| Category | Definition | Engine type | Share of 100 |
|---|---|---|---|
| **Visible** | In plain sight; the challenge is noticing among density | `tap` | 18 |
| **Camouflaged** | Colored/shaped to blend with host surroundings | `tap` | 16 |
| **Partial** | Only a corner/edge/glow peeks out from behind cover | `tap` | 16 |
| **Container** | Inside an openable host (lid, door, flap, bag) | `container` | 22 |
| **Reflection** | A mirror/water reflection shows the phone; the real one is nearby | `tap` (staged) | 6 |
| **Interaction** | Another prop must be triggered to expose it | `reveal` | 12 |
| **Sequential** | Ordered multi-step discovery on one landmark | `sequence` | 6 |
| **Legendary** | Signature multi-step showpieces incl. Phone #100 | `sequence` | 4 |

## 3. Difficulty Framework (1–5)

| Tier | Name | Design contract | Count |
|---|---|---|---|
| 1 | Spotter | Visible at default zoom near a landmark; found in seconds | 15 |
| 2 | Looker | Requires modest zoom or an obvious single interaction | 25 |
| 3 | Seeker | Camouflage/partial needing deliberate inspection, or 2-step | 30 |
| 4 | Sleuth | Clever staging: reflections, off-screen logic, misdirection | 20 |
| 5 | Legend | Multi-step sequences with escalating hints; memorable stories | 10 |

Distribution rules: every district contains at least one Tier 1 (a "welcome
find") and at most two Tier 5. The hub (Studio) front-loads Tier 1–2 so the first
minute always succeeds.

## 4. Anti-Frustration Rules (hard requirements)

1. **Glint system:** every unfound phone emits a soft cyan glint every 12–20 s
   (subtle, in keeping with the world). Tier 5 sequence starting-points shimmer
   instead.
2. **Tap forgiveness:** hit radius ≥ 44 screen px at zoom 1; camouflage never
   reduces the hit area below the visual bounds.
3. **Motion fairness:** phones on moving hosts pause at stations ≥ 3 s; nothing
   must be tapped mid-flight.
4. **Hint ladder:** per-phone written hint (riddle-lite) available anytime from
   the phone list; after 3 hint views for the same phone, the hint adds its
   district; hints are free and unlimited (no punishment for wanting help).
5. **No decoys that punish:** tapping a wrong-but-reasonable spot yields delight
   (an interaction) or a gentle ripple — never mockery, never a counter of fails.
6. **Sequences telegraph:** each correct step gives clear escalating feedback;
   wrong taps during a sequence do nothing negative (progress never resets).
7. **Containers re-open freely**; revealed states persist ≥ 6 s.
8. **Completion floor:** at 95+ found, remaining phones glint twice as often —
   the game wants you to finish.

## 5. Placement Craft Rules

- Every phone has a **hiding story** (why it's there), a **host object**, and a
  hint that references world fiction — never coordinates or "look northwest".
- No two phones in the same district use the same category+host combination.
- Adjacent phones (< 300 world px apart) must differ in category and tier.
- Reflections always place the real phone within one screen of the reflection.
- Legendary phones anchor to landmarks players already love (statue, waterfall,
  lighthouse, departure board).

---

*Hiding design by Benedict de Jesus.*
