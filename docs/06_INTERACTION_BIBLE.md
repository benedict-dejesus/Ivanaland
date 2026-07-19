# IVANALAND — 06 INTERACTION BIBLE

## 1. Interaction Model

One verb: **tap** (click on desktop). Everything meaningful responds to a tap.
Pinch/drag are navigation only. Long-press and drag-of-objects are intentionally
excluded (discoverability + one-hand play).

Every tap resolves to exactly one of:

| Result | Feedback |
|---|---|
| Phone found | Full celebration: phone pops & rises with spring-scale, golden starburst rays, double shockwave rings, confetti fountain, rising sparkles, discovery fanfare, toast + springy counter tick. Tier 5 finds double everything. Finding must feel *rewarding, engaging, motivating* — the best moment in the game loop. |
| Reveal step (container/sequence) | Host animates open/parts/moves + soft chime |
| Delight interaction (no phone) | Prop animation + plink |
| Empty world | Soft ripple at tap point (never a penalty, never silence) |

**Rule: no dead taps.** Even empty ground ripples.

## 2. Interaction Types (engine enum)

- `tap` — phone is tappable directly (visible/camouflaged/partial placements).
- `container` — tap host once to open (lid lifts, door opens, flap parts), phone
  revealed inside for direct tap. Container stays open 6 s then eases shut.
- `sequence` — N ordered host taps, each with escalating feedback, final tap
  reveals the phone (e.g., statue: torch → plaque → crown beam).
- `reveal` — tapping a *different* prop changes state exposing the phone
  (green-screen backdrop swap, waterfall parting, dog digging the mound).
- `delight` — no phone; pure world response (majority of interactive props).

## 3. Trigger & Feedback Rules

- Feedback begins ≤ 100 ms after pointerdown; hit targets ≥ 44 px screen-space at
  1.0 zoom (larger targets for moving hosts).
- Tap FX scale with importance: plink < reveal chime < discovery fanfare.
- Simultaneous/rapid taps are safe: interactions are idempotent while animating.
- Reveal states are forgiving: open containers stay open long enough for a slow
  tap; sequences don't reset on a single wrong tap (they simply don't advance).

## 4. Animation Rules

- Idle motions: `bob` (boats, balloons), `sway` (trees, banners), `spin`
  (wheels, radar), `pulse` (lights, glints), `patrol` (NPC/vehicle paths),
  `flicker` (torches), `steam` (pots), custom keyed effects for landmarks.
- Idle amplitude 2–6 world px; period 1.5–6 s; phases randomized per node.
- Triggered animations are short (0.3–1.2 s), springy (overshoot ease), and never
  block input.
- Confetti/particles are pooled; hard cap ~150 live particles.

## 5. World Behaviors

- **Ivana Shuttle** patrols a fixed road loop, pausing 3 s at four stops.
- Patrolling NPCs walk waypoint loops with idle pauses; they never occlude a
  phone's tap target for more than 1.5 s.
- Off-screen behavior: animators for culled districts pause; patrollers keep
  logical position (time-based) so the world feels continuous when you return.
- Ambient one-shots on a world timer: volcano smoke ring (~45 s), festival
  firework (~30 s), plane landing (~90 s) — cheap, pooled, skippable.

## 6. Interaction Catalog (per district highlights)

Studio: marquee bulb chase, clapperboard snap, green-screen backdrop cycle
(reveal host), fountain splash, drone cam orbit-tap wobble.
Village: laundry flap, grill smoke, basketball shot, koi scatter, rooster crow.
Market: pot lids, fruit-pyramid wobble, chili contestant blush, banderitas wave.
Beauty: mirror flash, perfume mist, dryer-chair hair poof, runway strut,
mannequin wink.
Pets: corgi spin, pool cannonball, parrot "hello!", digging mound (reveal),
duck line follow.
Terminal: split-flap joke shuffle, carousel start/stop (moving container),
windsock gust, balloon flame, x-ray tray slide.
Resort: palm coconut, pool lap, petal burst, tiki flare, towel-swan unfold
(container).
Festival: stage light show, confetti cannons, ferris speed-up, crowd wave,
statue sequence (Phone #100).
Charity: well coin plink, gift-lid pops (containers), teddy wave, volunteer
high-five.
Island: waterfall part (reveal), volcano smoke ring, chest creak (container),
monkey juggle, crab conga.

---

*Interaction design by Benedict de Jesus.*
