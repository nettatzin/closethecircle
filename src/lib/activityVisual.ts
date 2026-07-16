import type { CircleIconName } from '@/components/circle/circleIconsData';

export type ActivityCategory =
  | 'learn'
  | 'make'
  | 'community'
  | 'exchange'
  | 'event'
  | 'innovate';

interface CategoryPalette {
  color: string; // solid HSL
  tint: string;  // soft background
  ring: string;  // slightly stronger for borders
}

// Restrained earthy palette — sage-forward.
const PALETTE: Record<ActivityCategory, CategoryPalette> = {
  learn:     { color: 'hsl(157 30% 38%)', tint: 'hsl(157 30% 88%)', ring: 'hsl(157 30% 70%)' }, // sage
  make:      { color: 'hsl(18 48% 48%)',  tint: 'hsl(18 55% 90%)',  ring: 'hsl(18 55% 75%)'  }, // terracotta
  community: { color: 'hsl(38 55% 45%)',  tint: 'hsl(38 65% 88%)',  ring: 'hsl(38 65% 72%)'  }, // ochre
  exchange:  { color: 'hsl(95 28% 38%)',  tint: 'hsl(95 32% 88%)',  ring: 'hsl(95 32% 70%)'  }, // moss
  event:     { color: 'hsl(12 42% 48%)',  tint: 'hsl(12 50% 90%)',  ring: 'hsl(12 50% 75%)'  }, // clay
  innovate:  { color: 'hsl(220 28% 42%)', tint: 'hsl(220 35% 90%)', ring: 'hsl(220 35% 74%)' }, // dusk
};

const CATEGORY_ICON: Record<ActivityCategory, CircleIconName> = {
  learn: 'systems',
  make: 'costsaving',
  community: 'community',
  exchange: 'closecycle',
  event: 'spiral',
  innovate: 'seed',
};

// Type-specific overrides — pick the closest hand-drawn glyph from the 15-icon set.
const TYPE_ICON: Array<[RegExp, CircleIconName]> = [
  [/podcast|documentary|video|newsletter|press|פודקאסט|תיעודי|ניוזלטר|עיתונות/i, 'wonder'],
  [/facebook|forum|social|group|volunteer|community|פייסבוק|פורום|קבוצה|התנדב|קהילת/i, 'community'],
  [/academic|course|academy|research|קורס|אקדמ|תואר|הכשרה|מחקר/i, 'systems'],
  [/sew|mend|craft|maker|workshop|studio|תפירה|תיקון|סדנ|סטודיו|מלאכה|יוצרים|מרחב/i, 'costsaving'],
  [/vintage|resale|luxury|second-hand|וינטג|יד שנייה|יוקרה/i, 'costsaving'],
  [/swap|החלפה/i, 'closecycle'],
  [/flea|market|p2p|shopping|app|fair|שוק|פשפשים|מרקטפלייס|אפליקצי|קניות|יריד/i, 'closecycle'],
  [/competition|תחרות/i, 'wonder'],
  [/hub|enterprise|infrastructure|recycling|מרכז|עסק חברתי|תשתית|מיחזור/i, 'closecycle'],
  [/innovation|חדשנות/i, 'seed'],
  [/nature|bio|biomimicry|טבע|ביומימי/i, 'nature'],
  [/water|מים/i, 'water'],
  [/sun|solar|שמש|סולאר/i, 'sun'],
  [/compost|קומפוסט/i, 'compost'],
  [/root|grounding|שורש/i, 'roots'],
  [/slow|איטי/i, 'slow'],
  [/regenerat|kintsugi|שיקום|התחדש/i, 'regenerate'],
  [/spiral|ספיר/i, 'spiral'],
  [/circular|circle|מעגל|מעגלי/i, 'circular'],
  [/week|cultural|global|multi-day|שבוע|רב-יומי|תרבותית|עולמי/i, 'spiral'],
  [/designer|מעצב/i, 'seed'],
  [/free|חינמי/i, 'systems'],
  [/follow|לעקוב/i, 'community'],
];

export function categorizeActivity(type: string): ActivityCategory {
  if (/(swap|flea|market|vintage|resale|shopping|p2p|app|luxury|וינטג|שוק|פשפשים|מרקטפלייס|אפליקצי|קניות|החלפה|יד שנייה)/i.test(type)) return 'exchange';
  if (/(craft|sew|mend|maker|workshop|studio|סדנ|סטודיו|מלאכה|תפירה|תיקון|יוצרים|מרחב)/i.test(type)) return 'make';
  if (/(community|forum|facebook|group|social|volunteer|follow|designer|פורום|פייסבוק|קבוצה|לעקוב|מעצב|התנדב|קהילת)/i.test(type)) return 'community';
  if (/(event|fair|charity|competition|week|multi-day|אירוע|יריד|תחרות|שבוע|רב-יומי|צדקה|שנתי)/i.test(type)) return 'event';
  if (/(innovation|hub|enterprise|recycling|infrastructure|research|חדשנות|מרכז|עסק חברתי|תשתית|מיחזור|מחקר)/i.test(type)) return 'innovate';
  if (/(course|academ|podcast|documentary|newsletter|video|press|cultural|קורס|אקדמ|פודקאסט|תיעודי|ניוזלטר|תואר|הכשרה|תרבותית|עיתונות|חינמי)/i.test(type)) return 'learn';
  return 'learn';
}

export function getActivityVisual(type: string) {
  const cat = categorizeActivity(type);
  const palette = PALETTE[cat];
  const override = TYPE_ICON.find(([re]) => re.test(type));
  const iconName: CircleIconName = override ? override[1] : CATEGORY_ICON[cat];
  return { iconName, category: cat, ...palette };
}
