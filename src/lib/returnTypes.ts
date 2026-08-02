// Return-type model for the "My Circle" screen.
// NOTE: `return_type` does not exist in the DB yet. RETURN_FUNNEL maps the
// initiative category (Activity.type) to a return type so it can be swapped
// for a real DB column later.

export type ReturnKey = 'items' | 'ground' | 'mat' | 'skills' | 'know';

export interface ReturnTypeDef {
  key: ReturnKey;
  label: string; // Hebrew
  unit: string; // Hebrew
  colorClass: string; // tailwind text color token (drives dot + arc stroke)
  strokeClass: string;
}

export const RETURN_TYPES: ReturnTypeDef[] = [
  { key: 'items', label: 'חפצים חוזרים לחיים', unit: 'פריטים', colorClass: 'bg-terracotta', strokeClass: 'stroke-terracotta' },
  { key: 'ground', label: 'אדמה שחוזרת', unit: 'מ״ר', colorClass: 'bg-moss', strokeClass: 'stroke-moss' },
  { key: 'mat', label: 'חומר שהופך למשהו', unit: 'ק״ג', colorClass: 'bg-ochre', strokeClass: 'stroke-ochre' },
  { key: 'skills', label: 'ידיים שלומדות', unit: 'אנשים', colorClass: 'bg-field', strokeClass: 'stroke-field' },
  { key: 'know', label: 'ידע שממשיך', unit: 'אנשים', colorClass: 'bg-sky', strokeClass: 'stroke-sky' },
];

// Ring geometry: outermost first.
export const RING_RADII = [82, 67, 52, 37, 22];
export const RING_STROKE = 9;

export const MONTHLY_YIELD: Record<ReturnKey, number> = {
  items: 2.4,
  ground: 1.1,
  mat: 1.5,
  skills: 0.65,
  know: 3.25,
};

export const TOTAL_CLASSIFIED = 372;

export const RETURN_SHARE: Record<ReturnKey, number> = {
  items: 132 / TOTAL_CLASSIFIED,
  ground: 124 / TOTAL_CLASSIFIED,
  mat: 45 / TOTAL_CLASSIFIED,
  skills: 41 / TOTAL_CLASSIFIED,
  know: 30 / TOTAL_CLASSIFIED,
};

// STUB: category -> return type. Replace with a DB column when available.
export const RETURN_FUNNEL: Record<string, ReturnKey> = {
  'Academic Course': 'know',
  'Academic Program': 'know',
  'Annual Event': 'items',
  'Charity Event': 'items',
  'Community Forum': 'know',
  Competition: 'know',
  'Course Series': 'skills',
  'Craft Studio': 'skills',
  'Craft Training': 'skills',
  'Craft Workshop': 'skills',
  'Cultural Experience': 'know',
  'Designer Follow': 'know',
  Documentary: 'know',
  'Facebook Group': 'know',
  'Family Swap': 'items',
  'Fashion Fair': 'items',
  'Flea Market': 'items',
  'Free Course': 'skills',
  'Innovation Hub': 'mat',
  'Innovation Research': 'mat',
  'Luxury Resale': 'items',
  'Luxury Vintage': 'items',
  'Maker Space': 'mat',
  'Mending Workshop': 'skills',
  'Multi-day Event': 'know',
  Newsletter: 'know',
  'Online Academy': 'skills',
  'P2P Marketplace': 'items',
  Podcast: 'know',
  'Professional Course': 'skills',
  'Recycling Infrastructure': 'mat',
  'Sewing Course': 'skills',
  'Shopping District': 'items',
  'Social Enterprise': 'ground',
  'Social Follow': 'know',
  'Sustainable Fair': 'ground',
  'Swap Event': 'items',
  'Vintage App': 'items',
  'Vintage Store': 'items',
  'Volunteer Role': 'ground',
};

export function returnKeyFor(category: string): ReturnKey {
  return RETURN_FUNNEL[category] ?? 'items';
}

export function personMonths(m: number) {
  return 0.25 * m + 0.75 * 3 * (1 - Math.exp(-m / 3));
}

export function roundDisplay(v: number) {
  if (v >= 10000) return Math.round(v / 1000) * 1000;
  if (v >= 1000) return Math.round(v / 100) * 100;
  if (v >= 100) return Math.round(v / 10) * 10;
  return Math.round(v);
}

export function formatValue(v: number) {
  return roundDisplay(v).toLocaleString();
}

export function computeMine(savedCount: Record<ReturnKey, number>, bring: number) {
  const pm = personMonths(12);
  const out = {} as Record<ReturnKey, number>;
  RETURN_TYPES.forEach(({ key }) => {
    out[key] = (savedCount[key] ?? 0) * MONTHLY_YIELD[key] * pm * (1 + bring * 0.22);
  });
  return out;
}

export function computeEveryone(visitors: number, months: number) {
  const active = visitors * 0.14 * 0.28 * 1.08;
  const pm = personMonths(months);
  const out = {} as Record<ReturnKey, number>;
  RETURN_TYPES.forEach(({ key }) => {
    out[key] = active * RETURN_SHARE[key] * MONTHLY_YIELD[key] * pm;
  });
  return out;
}
