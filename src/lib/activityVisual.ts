import {
  BookOpen,
  Scissors,
  Users,
  Recycle,
  CalendarDays,
  Sparkles,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

export type ActivityCategory =
  | 'learn'
  | 'make'
  | 'community'
  | 'exchange'
  | 'event'
  | 'innovate';

interface CategoryVisual {
  Icon: LucideIcon;
  /** Solid HSL — muted, earthy, harmonized with sage brand */
  color: string;
  /** Soft tint for the ellipse background */
  tint: string;
}

// A single restrained palette — earthy, sage-forward. No random per-activity colors.
const CATEGORY_VISUALS: Record<ActivityCategory, CategoryVisual> = {
  learn:     { Icon: BookOpen,     color: 'hsl(157 26% 40%)', tint: 'hsl(157 26% 90%)' }, // sage
  make:      { Icon: Scissors,     color: 'hsl(18 42% 50%)',  tint: 'hsl(18 45% 92%)'  }, // terracotta
  community: { Icon: Users,        color: 'hsl(38 45% 48%)',  tint: 'hsl(38 55% 92%)'  }, // ochre
  exchange:  { Icon: Recycle,      color: 'hsl(95 22% 40%)',  tint: 'hsl(95 25% 91%)'  }, // moss
  event:     { Icon: CalendarDays, color: 'hsl(12 35% 48%)',  tint: 'hsl(12 40% 93%)'  }, // clay
  innovate:  { Icon: Sparkles,     color: 'hsl(210 25% 42%)', tint: 'hsl(210 25% 92%)' }, // dusk
};

const FALLBACK: CategoryVisual = { Icon: Leaf, color: 'hsl(157 26% 40%)', tint: 'hsl(157 26% 90%)' };

/** Map an activity.type string to one of six earthy categories. */
export function categorizeActivity(type: string): ActivityCategory {
  const t = type.toLowerCase();
  if (/(course|academ|podcast|documentary|newsletter|research)/.test(t)) return 'learn';
  if (/(craft|sew|mend|maker|workshop|studio)/.test(t)) return 'make';
  if (/(community|forum|facebook|group|social|volunteer|follow)/.test(t)) return 'community';
  if (/(swap|flea|market|vintage|resale|shopping|p2p|app)/.test(t)) return 'exchange';
  if (/(event|fair|charity|competition)/.test(t)) return 'event';
  if (/(innovation|hub|enterprise|recycling|infrastructure|cultural)/.test(t)) return 'innovate';
  return 'learn';
}

export function getActivityVisual(type: string): CategoryVisual {
  const cat = categorizeActivity(type);
  return CATEGORY_VISUALS[cat] ?? FALLBACK;
}
