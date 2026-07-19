# IVANALAND — 15 CONTENT PIPELINE

How to add and maintain content without touching engine code.

## 1. Adding a Phone

1. Choose district, host, category, tier per 08 quotas (keep balance).
2. Write the entry in `docs/09_PHONE_BIBLE.md` (story + hint first — fiction
   drives placement).
3. Add the matching object to `src/data/phones.ts`:
   ```ts
   { id, name, district, landmark, host, story, hint,
     category, tier, method, x, y /* world coords */ }
   ```
4. If `method` is `container`/`reveal`/`sequence`, ensure the host prop in the
   district builder registers the matching interaction id (`host-<id>`).
5. Run dev — the validator fails loudly on missing/duplicate/out-of-bounds data.
6. Playtest: find it cold, then via hint; check glint visibility at 1× zoom.

## 2. Adding a District

1. Add bounds + metadata to `src/data/districts.ts` (id, name, accent, rect).
2. Create `src/world/districts/<name>.ts` exporting `build<Name>(ctx)`; compose
   landmarks, props, NPCs per a new section in 05_DISTRICT_BIBLE.
3. Register the builder in `WorldBuilder.ts` (one line).
4. Add 10 phones (see above) and a `<district>-clear` achievement.
5. Extend world bounds if geometry grows; verify camera clamp + overview zoom.

## 3. Future Expansions (designed-for)

- **Seasonal overlays:** builders accept a `season` flag to swap palette accents
  and add themed props (fiesta, holiday) — no structural changes.
- **New discovery methods:** add enum value + one handler in `PhoneSystem`.
- **Localization:** all player-facing strings already flow from data files and
  a single `ui/strings.ts`; adding Tagalog = one file.
- **Photo mode / minimap:** camera API already exposes world snapshots.

## 4. Maintenance Procedures

- **Save compatibility:** never reuse or renumber phone/achievement ids;
  removing content requires a save-migration function keyed on `version`.
- **Balance audits:** after any content change run the validator's report —
  distribution by tier/category/district printed in dev console.
- **Performance regression check:** dev HUD shows FPS + object counts; compare
  against budgets in 14 before merging.
- **Docs stay truthful:** a content PR that changes data must update 09 (and 05
  if the world changed). Docs and data drifting apart is a release blocker.

*Content pipeline by Benedict de Jesus.*
