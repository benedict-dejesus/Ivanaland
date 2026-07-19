/** Dev-time content validator — enforces docs/09_PHONE_BIBLE.md rules. */
import { PHONES } from './phones';
import { DISTRICTS, districtById } from './districts';

export function validateContent(): void {
  const errors: string[] = [];

  if (PHONES.length !== 100) errors.push(`Expected 100 phones, got ${PHONES.length}`);

  const ids = new Set<number>();
  const perDistrict = new Map<string, number>();
  const hostCombo = new Set<string>();

  for (const p of PHONES) {
    if (ids.has(p.id)) errors.push(`Duplicate phone id ${p.id}`);
    ids.add(p.id);
    if (p.id < 1 || p.id > 100) errors.push(`Phone id out of range: ${p.id}`);
    for (const [k, v] of Object.entries(p)) {
      if (k === 'seqSteps') continue; // optional — required only for sequences (checked below)
      if (v === '' || v === undefined || v === null) errors.push(`Phone #${p.id}: empty field "${k}"`);
    }
    const d = districtById.get(p.district);
    if (!d) { errors.push(`Phone #${p.id}: unknown district ${p.district}`); continue; }
    if (p.x < d.x || p.x > d.x + d.w || p.y < d.y || p.y > d.y + d.h) {
      errors.push(`Phone #${p.id} (${p.name}) outside ${d.id} bounds: ${p.x},${p.y}`);
    }
    perDistrict.set(p.district, (perDistrict.get(p.district) ?? 0) + 1);
    const combo = `${p.district}:${p.category}:${p.host}`;
    if (hostCombo.has(combo)) errors.push(`Phone #${p.id}: duplicate category+host in ${p.district}`);
    hostCombo.add(combo);
    if (p.method === 'sequence' && !p.seqSteps) errors.push(`Phone #${p.id}: sequence without seqSteps`);
  }

  for (const d of DISTRICTS) {
    const n = perDistrict.get(d.id) ?? 0;
    if (n !== 10) errors.push(`District ${d.id} has ${n} phones (expected 10)`);
  }

  // Phone #100 locked design
  const p100 = PHONES.find((p) => p.id === 100);
  if (!p100 || p100.district !== 'festival' || p100.landmark !== 'Giant Festival Statue'
    || !p100.host.includes('crown') || p100.method !== 'sequence' || p100.tier !== 5) {
    errors.push('Phone #100 locked design violated!');
  }

  if (errors.length) {
    console.error(`❌ IVANALAND content validation: ${errors.length} error(s)`);
    for (const e of errors) console.error('  •', e);
  } else {
    const tiers = [0, 0, 0, 0, 0, 0];
    for (const p of PHONES) tiers[p.tier]!++;
    console.info(`✅ IVANALAND content valid: 100 phones · tiers 1–5 = ${tiers.slice(1).join('/')}`);
  }
}
