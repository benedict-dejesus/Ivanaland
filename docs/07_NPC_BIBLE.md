# IVANALAND — 07 NPC BIBLE

NPCs are simple, chunky vector characters (head + body + limbs as rounded shapes)
with 2–3 behaviors each. They exist to make the world feel inhabited and to stage
sight gags. No dialogue trees — speech is emoji-like bubbles only.

## 1. Behavior Primitives

- **idle** — breathe-bob, occasional blink or head turn.
- **loop-action** — repeating job animation (grilling, snipping, waving).
- **patrol** — waypoint walking with pauses; flip sprite on direction change.
- **react** — tap response: hop, spin, wave, speech bubble (♥, !, ✨, "hello!").

## 2. Catalog (name — district — behavior — tap reaction)

| NPC | District | Behavior | Tap reaction |
|---|---|---|---|
| Camera Op Carlo | Studio | pans camera loop | thumbs-up bubble |
| Director Dee | Studio | megaphone bark loop | "ACTION!" bubble |
| Intern Iggy | Studio | patrols with coffee tray | trips safely, cups juggle |
| Sunny the Mascot | Studio | waves at roundabout | big double-arm wave ♥ |
| Lola Rosa | Village | rocking chair | blows a kiss ♥ |
| Tag Kids (3) | Village | patrol chase loop around mango tree | giggle burst |
| Grill Dad Gary | Village | flips BBQ | smoke heart puff |
| Rooster Rocky | Village | struts, chased by toddler | crow "COCK-A-!" |
| Roof Cat Mochi | Village | sleeps, tail flick | one annoyed ear flick |
| Vendor Vicky | Market | pancake toss loop | extra-high toss ✨ |
| Taho Tito | Market | patrols calling "Tahooo!" | bubble "Tahooo!" |
| Seagull Sam | Market | eyes fish stall, hops | guilty side-eye, flies off |
| Chili Champ Cheska | Market | fans mouth, red-faced | steam whistle ears |
| Stylist Star | Beauty | air-snips | scissor sparkle |
| Mannequin Mona | Beauty | perfectly still | **winks** (the gag: she's alive?) |
| Influencer Bella | Beauty | films transitions | camera flash + pose |
| Poodle Fifi | Beauty | fresh-blowout strut | fur floofs bigger |
| Mayor Corgi | Pets | patrols park importantly | happy spin + ♥ |
| Cat Empress Ming | Pets | ignores everyone from pagoda | slow blink (highest honor) |
| Walker Wally | Pets | patrols tangled in 6 leashes | spins once, re-tangles |
| Parrot Pol | Pets | perch bobbing | "HELLO!" bubble |
| Duck Family (4) | Pets | line patrol to pond | synchronized quack |
| Pilot Paz | Terminal | waves from cockpit | cap salute |
| Runner Rui | Terminal | chases rolling suitcase loop | dives, misses, shrugs |
| Beagle Bit | Terminal | sniffs luggage line | tail helicopter |
| Crew Kiko | Terminal | glowing-wand semaphore | waves both wands ✨ |
| Lifeguard Leo | Resort | scans horizon | whistle tweet |
| Newlyweds J&J | Resort | pose loop at arch | petal heart burst |
| Waiter Wes | Resort | tray patrol on pool deck | tray wobble, saves it |
| Sandcastle Kid Coco | Resort | pats sandcastle | adds a flag proudly |
| MC Hype | Festival | mic bounce loop | "MAKE SOME NOISE!" |
| Crowd Blocks (5) | Festival | sway/lightstick wave | the wave ripples |
| Muralist Mia | Festival | paints fan wall | splash of new color |
| Guard Nod | Festival | stoic, nods to beat | tiny shoulder dance |
| Volunteer Chain (4) | Charity | pass boxes bucket-brigade | speed round |
| Piggy-Bank Kid Pia | Charity | holds piggy bank | drops coin in well ✨ |
| Knitter Nana | Charity | knits scarf loop | scarf grows comically |
| Rider Rap | Charity | loads care kits | helmet visor flip |
| Zipliner Zee | Island | zips tower-to-tower | "WOOHOO!" doppler |
| Monkey Mo | Island | steals banana loop | juggles three bananas |
| Explorer Ed | Island | reads map upside down | rotates map, still lost |
| Parrot Flock (5) | Island | shipwreck perch shuffle | scatter + reland |
| Crab Conga (6) | Island | beach conga line | conga speeds up |

## 3. Animation Opportunities

- All NPCs get idle bob (2 px, 2–3 s) + blink where faces show.
- Patrollers pause 1–3 s at waypoints (tap window; also feels natural).
- Reactions are ≤ 1 s, pooled speech bubbles, never interrupt patrol logic
  (reaction plays over current position).

## 4. Rules

- NPCs never carry phones; they only *point* at stories (host objects near them do).
- No NPC blocks a phone hit-target for > 1.5 s.
- Every district has ≥ 4 NPCs; hub and festival have crowds.

---

*Character design by Benedict de Jesus.*
