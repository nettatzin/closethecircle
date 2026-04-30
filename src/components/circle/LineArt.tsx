import { cn } from '@/lib/utils';

interface LineArtProps {
  className?: string;
  strokeWidth?: number;
}

export function SpiralLine({ className, strokeWidth = 0.6 }: LineArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('text-foreground', className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M50 50 m -2 0 a 2 2 0 1 1 4 0 a 4 4 0 1 1 -8 0 a 7 7 0 1 1 14 0 a 11 11 0 1 1 -22 0 a 16 16 0 1 1 32 0 a 22 22 0 1 1 -44 0 a 29 29 0 1 1 58 0 a 37 37 0 1 1 -74 0 L 13 50" strokeLinecap="round" />
    </svg>
  );
}

export function EllipseLine({ className, strokeWidth = 0.6 }: LineArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('text-foreground', className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <ellipse cx="50" cy="50" rx="38" ry="26" transform="rotate(-20 50 50)" />
    </svg>
  );
}

export function CircleLine({ className, strokeWidth = 0.6 }: LineArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn('text-foreground', className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <circle cx="50" cy="50" r="40" />
    </svg>
  );
}

export function DottedRing({ className, count = 10, dotRadius = 2.5 }: LineArtProps & { count?: number; dotRadius?: number }) {
  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = 38;
    return { cx: 50 + Math.cos(angle) * r, cy: 50 + Math.sin(angle) * r };
  });
  return (
    <svg viewBox="0 0 100 100" className={cn('text-foreground', className)} fill="none" stroke="currentColor" strokeWidth={0.6}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={dotRadius} />
      ))}
    </svg>
  );
}
