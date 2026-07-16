import { CIRCLE_ICONS, type CircleIconName } from './circleIconsData';

interface CircleIconProps {
  name: CircleIconName;
  className?: string;
  accent?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

/**
 * Hand-drawn sustainability icon. Two-tone:
 * - main strokes/fills use `currentColor` (set via `color` on parent/style)
 * - accent fills use `--icon-accent` CSS var (falls back to currentColor)
 */
export function CircleIcon({ name, className, accent, style, strokeWidth }: CircleIconProps) {
  const data = CIRCLE_ICONS[name];
  if (!data) return null;
  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(accent ? ({ ['--icon-accent' as any]: accent } as React.CSSProperties) : null),
    ...(strokeWidth ? ({ strokeWidth } as React.CSSProperties) : null),
  };
  return (
    <svg
      viewBox={data.viewBox}
      className={className}
      style={inlineStyle}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: data.svg }}
    />
  );
}
