# IVANALAND — 13 SOCIAL SHARING SYSTEM

Sharing is the growth engine: the game creates prestige moments worth posting to
Facebook, Instagram, and TikTok — screenshot-first, no APIs, no tracking.

## 1. Share Artifacts

All rendered client-side to an offscreen canvas and exported as PNG
(`toDataURL` → download / Web Share API where available).

### Completion Certificate (1080×1350, IG portrait)
- Ornate cream card on confetti-gradient background.
- "CERTIFICATE OF COMPLETION — IVANALAND"
- "___ recovered all 100 lost iPhones" — the player's name, entered at game
  start (editable at completion; defaults to "A Legendary Explorer" — stored
  locally only). The certificate always names the player.
- Stats block: play time, taps, hints used, favorite district (most-explored),
  completion date.
- Achievement count + starred signature achievements (Crown Jewel).
- Footer: "A game by **Benedict de Jesus**" + IVANALAND wordmark.

### Progress Share Card (1080×1080, square)
- Available anytime from the Phone List panel: "Share progress".
- Giant `n/100` counter, district-by-district progress dots, playful copy
  ("Have you seen the other 73?"), wordmark + developer credit.

### Milestone Cards (auto-offered at 25/50/75/99/100)
- Same square format, milestone-specific copy ("HALFWAY HERO — 50/100").

## 2. Social Strategy

- **Facebook:** og: meta tags (title, description, 1200×630 og-image rendered
  as a static asset at build time) so shared links unfurl beautifully.
- **Instagram/TikTok:** the game itself is screenshot-bait — confetti moments,
  the statue finale, sight gags. Certificate is IG-portrait sized natively.
- Prestige framing: completion feels like a diploma, not an ad. No watermark
  spam — one tasteful credit line.
- The About panel includes a "copy game link" button.

## 3. Export Workflows

1. Player triggers share (celebration screen or panel button).
2. `ShareSystem` renders the card to an offscreen canvas (fonts preloaded, all
   drawing procedural — no CORS taint possible).
3. If `navigator.canShare({files})` → native share sheet with the PNG file.
4. Else → automatic download `ivanaland-certificate.png` + toast "Saved!".
5. Failure path: toast suggests screenshotting the on-screen card (card is also
   displayed full-screen in DOM, so a manual screenshot always works).

## 4. Shareable World Moments (engineered)

- Discovery confetti bursts stay on screen ~2 s (screenshot window).
- Phone #100 finale: crown opens with golden beams + full-sky confetti — the
  game's money shot.
- Milestone banners pause the toast queue for 3 s of clean framing.
- The statue, ferris wheel + fireworks, and waterfall reveal are composed to
  look good in portrait crops.

*Sharing design by Benedict de Jesus.*
