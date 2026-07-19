# IVANALAND — 10 ACHIEVEMENT BIBLE

## Reward Philosophy

Achievements celebrate **curiosity, observation, exploration, and persistence** —
never grinding, never timers, never daily logins. Every achievement is either a
natural milestone or a wink at players who poke at the world. Unlocks show a toast
with confetti; all are visible (with unlock conditions) in the Achievements panel
from the start — anticipation is part of the fun.

## Catalog (24)

| ID | Name | Unlock condition | Rewards |
|---|---|---|---|
| `first-find` | First Signal | Find your first phone | The hook |
| `ten-club` | Double Digits | Find 10 phones | Milestone |
| `quarter` | Collector | Find 25 phones | Milestone |
| `halfway` | Halfway Hero | Find 50 phones | Milestone |
| `deep-cut` | Deep Cuts | Find 75 phones | Milestone |
| `ninety-nine` | So Close | Find 99 phones | Drama before finale |
| `all-found` | Keeper of Ivanaland | Find all 100 phones | Completion |
| `crown-jewel` | The Crown Jewel | Find Phone #100 | Signature discovery |
| `studio-clear` | That's a Wrap | All 10 Studio phones | District mastery |
| `village-clear` | Family First | All 10 Village phones | District mastery |
| `market-clear` | Fully Fed | All 10 Market phones | District mastery |
| `beauty-clear` | Picture Perfect | All 10 Beauty phones | District mastery |
| `pets-clear` | Best in Show | All 10 Pet Park phones | District mastery |
| `terminal-clear` | Frequent Flyer | All 10 Terminal phones | District mastery |
| `resort-clear` | Checked Out | All 10 Resort phones | District mastery |
| `festival-clear` | Front Row | All 10 Festival phones | District mastery |
| `charity-clear` | Heart of Gold | All 10 Charity phones | District mastery |
| `island-clear` | Castaway No More | All 10 Island phones | District mastery |
| `curious` | Professional Poker | Trigger 25 delight interactions | Curiosity |
| `very-curious` | World's Best Friend | Trigger 100 delight interactions | Curiosity |
| `eagle-eye` | Eagle Eye | Find any Tier 4+ phone without viewing its hint | Observation |
| `sequencer` | Storyteller | Complete any sequence discovery | Persistence |
| `early-bird` | Early Bird | Find 5 phones within your first 5 minutes | Momentum |
| `tourist` | Grand Tour | Visit all 10 districts (camera enters each) | Exploration |

## Rules

- Conditions are evaluated by `AchievementSystem` on events (phone found, delight
  interaction, district entered, hint viewed) — no polling.
- Unlocks are permanent, saved immediately, and re-fire safe (idempotent).
- No achievement requires luck, speed reflexes, or replaying.
- The completion certificate lists earned achievements (see 13_SOCIAL_SHARING).

*Achievement design by Benedict de Jesus.*
