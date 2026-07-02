import {
  BookOpen,
  Scissors,
  Users,
  Recycle,
  CalendarDays,
  Sparkles,
  Leaf,
  Mic,
  Film,
  Mail,
  MessageCircle,
  GraduationCap,
  Store,
  ShoppingBag,
  Handshake,
  Wrench,
  Palette,
  Trophy,
  Hammer,
  Building2,
  Rss,
  Globe,
  Shirt,
  Repeat,
  Newspaper,
  Users2,
  type LucideIcon,
} from 'lucide-react';

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

const CATEGORY_ICON: Record<ActivityCategory, LucideIcon> = {
  learn: BookOpen,
  make: Scissors,
  community: Users,
  exchange: Recycle,
  event: CalendarDays,
  innovate: Sparkles,
};

// Type-specific icon overrides — so cards in the same category still look distinct.
const TYPE_ICON: Array<[RegExp, LucideIcon]> = [
  [/podcast/i, Mic],
  [/documentary|video/i, Film],
  [/newsletter/i, Mail],
  [/facebook|forum|social/i, MessageCircle],
  [/academic|course|academy/i, GraduationCap],
  [/sew|mend/i, Scissors],
  [/craft|studio/i, Palette],
  [/maker|workshop/i, Hammer],
  [/vintage|resale|luxury/i, Shirt],
  [/swap/i, Repeat],
  [/flea|market|p2p|shopping|app/i, Store],
  [/fair/i, ShoppingBag],
  [/competition/i, Trophy],
  [/volunteer|community|group/i, Users2],
  [/follow/i, Rss],
  [/hub|enterprise|infrastructure|recycling/i, Building2],
  [/innovation|research/i, Sparkles],
  [/press/i, Newspaper],
  [/cultural|global|week/i, Globe],
  [/designer/i, Handshake],
  [/free/i, Wrench],
];

export function categorizeActivity(type: string): ActivityCategory {
  const t = type.toLowerCase();
  if (/(swap|flea|market|vintage|resale|shopping|p2p|app|luxury)/.test(t)) return 'exchange';
  if (/(craft|sew|mend|maker|workshop|studio)/.test(t)) return 'make';
  if (/(community|forum|facebook|group|social|volunteer|follow|designer)/.test(t)) return 'community';
  if (/(event|fair|charity|competition|week|multi-day)/.test(t)) return 'event';
  if (/(innovation|hub|enterprise|recycling|infrastructure|research)/.test(t)) return 'innovate';
  if (/(course|academ|podcast|documentary|newsletter|video|press|cultural)/.test(t)) return 'learn';
  return 'learn';
}

export function getActivityVisual(type: string) {
  const cat = categorizeActivity(type);
  const palette = PALETTE[cat];
  const override = TYPE_ICON.find(([re]) => re.test(type));
  const Icon = override ? override[1] : (CATEGORY_ICON[cat] ?? Leaf);
  return { Icon, category: cat, ...palette };
}
