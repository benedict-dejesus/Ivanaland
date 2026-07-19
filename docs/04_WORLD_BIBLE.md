# IVANALAND — 04 WORLD BIBLE

## 1. The World

Ivanaland is a sunny coastal wonderland — a living theme park built by a generous
creator for her community. One seamless handcrafted map, roughly **4000 × 6000 world
units, portrait-oriented**, framed by ocean on the east and south.

A single fiction binds it: during the great 100-iPhone celebration, a gust of
confetti-chaos scattered every phone across the land. The community keeps the party
going while explorers (players) recover them.

## 2. Map Layout (world coordinates, y grows downward)

```
+--------------------------------------------------+
| TRAVEL TERMINAL        |      ADVENTURE ISLAND    |  y 0–1400
| (airport, top-left)    |  (island via rope bridge)|
|------------------------+--------------------------|
| FAMILY VILLAGE  | CREATOR STUDIO | LUXURY RESORT  |  y 1400–2900
| (cozy homes)    |  CITY (hub)    | (beach, coast) |
|-----------------+----------------+----------------|
| FOODIE MARKET   | BEAUTY         |   (coast /     |  y 2900–4300
| (stalls, food)  | BOULEVARD      |    marina)     |
|-----------------+----------------+----------------|
| PET PARADISE    | FAN FESTIVAL   | CHARITY        |  y 4300–5800
| PARK            | PLAZA (statue) | CORNER         |
+--------------------------------------------------+
        Ocean wraps the east and south edges.
```

Exact bounds live in `src/data/districts.ts`; builders may curve boundaries so
districts blend (roads, rivers, and paths cross borders — no visible seams).

## 3. District Relationships & Flow

- **Creator Studio City is the hub** and the spawn view — the camera opens here,
  centered, at a zoom showing the studio marquee and 2–3 obvious first finds.
- Roads radiate from the Studio roundabout to every neighbor; a river runs from the
  Terminal down past Family Village into the sea at the Marina; a rope bridge links
  the mainland to Adventure Island.
- The jeepney-style **Ivana Shuttle** loops Studio → Market → Festival → Resort,
  a moving landmark that teaches the map's shape.
- Fan Festival Plaza sits center-south holding the **Giant Festival Statue** — the
  tallest structure in the game and home of Phone #100. From most of the lower map
  the statue is visible, quietly teaching players it matters.

## 4. Navigation Philosophy

- Free exploration from second one. No locks, no fog of war, no gates.
- Camera clamped to world bounds with soft elastic edges; pinch-zoom from
  full-map overview to close detail (zoom 0.35×–2.5×).
- Wayfinding is diegetic: district color accents, signage props, the shuttle route,
  and the statue as a compass. No minimap needed at launch (world fits in overview
  zoom); phone-list panel groups finds by district to hint where to look next.

## 5. Environmental Storytelling Rules

- Every landmark implies a story happening *right now* (a wedding at the resort, a
  cook-off at the market, a drone-delivery mishap at the terminal).
- Stories chain across districts: the runaway corgi from Pet Paradise appears on a
  Festival poster; the market's giant lechon float is parked behind the Studio.
- 3–5 sight gags per district minimum, refreshed by idle animation.
- Empty space is illegal: sidewalks get vendors, roofs get cats, water gets boats.

## 6. Living-World Systems

- **Idle motion** everywhere (sway, bob, blink, steam, ripple).
- **Patrollers:** shuttle, dogs, joggers, drones, boats — path loops with pauses.
- **Reactive props:** many objects respond to taps even when no phone is inside
  (fountains splash, mascots wave, fireworks pop). Reward curiosity always.
- Motion never hides a phone unfairly: if a phone's host moves, the host pauses at
  stations long enough for a comfortable tap (see 08_HIDING_TAXONOMY).

---

*World design by Benedict de Jesus.*
