export type EnergyLevel = 'low_key' | 'hands_on' | 'deep_work';

interface EffortPalette {
  color: string; // text / icon
  tint: string;  // background fill
  ring: string;  // hairline border
}

const EFFORT: Record<EnergyLevel, EffortPalette> = {
  low_key:   { color: 'hsl(157 40% 32%)', tint: 'hsl(157 32% 92%)', ring: 'hsl(157 30% 80%)' },
  hands_on:  { color: 'hsl(18 60% 40%)',  tint: 'hsl(20 55% 92%)',  ring: 'hsl(20 50% 82%)'  },
  deep_work: { color: 'hsl(255 38% 42%)', tint: 'hsl(255 32% 93%)', ring: 'hsl(255 30% 84%)' },
};

export function getEffortVisual(level: string): EffortPalette {
  return EFFORT[(level as EnergyLevel)] ?? EFFORT.low_key;
}
