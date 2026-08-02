import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useDataset } from '@/i18n/dataset';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import {
  RETURN_TYPES,
  RING_RADII,
  RING_STROKE,
  computeEveryone,
  computeMine,
  formatValue,
  returnKeyFor,
  type ReturnKey,
} from '@/lib/returnTypes';

export function MyCircleView() {
  const { activities } = useDataset();
  const { savedIds, circleScope, setCircleScope } = useSession();
  const reduce = useReducedMotion();

  const [bring, setBring] = useState(1);
  const [visitors, setVisitors] = useState(40000);
  const [months, setMonths] = useState(6);
  const [selected, setSelected] = useState<ReturnKey>('items');

  const savedCount = useMemo(() => {
    const base = { items: 0, ground: 0, mat: 0, skills: 0, know: 0 } as Record<ReturnKey, number>;
    savedIds.forEach((id) => {
      const a = activities.find((x) => String(x.id) === id);
      if (a) base[returnKeyFor(a.type)] += 1;
    });
    return base;
  }, [savedIds, activities]);

  const values = useMemo(
    () => (circleScope === 'mine' ? computeMine(savedCount, bring) : computeEveryone(visitors, months)),
    [circleScope, savedCount, bring, visitors, months]
  );

  const max = Math.max(...RETURN_TYPES.map((t) => values[t.key]), 0);
  const missing = RETURN_TYPES.filter((t) => roundedZero(values[t.key])).length;

  const activeType = RETURN_TYPES.find((t) => t.key === selected) ?? RETURN_TYPES[0];
  const activeValue = values[activeType.key];

  return (
    <div className="min-h-screen pb-16 safe-area-bottom">
      <div className="max-w-lg mx-auto px-5 pt-6 space-y-6">
        {/* Segmented toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl border border-foreground/15 bg-card">
          {(['mine', 'everyone'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setCircleScope(s)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors',
                circleScope === s ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s === 'mine' ? 'שלי' : 'של כולם'}
            </button>
          ))}
        </div>

        {/* Ring */}
        <div className="relative mx-auto w-full max-w-[320px] aspect-square">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            {RETURN_TYPES.map((type, i) => {
              const r = RING_RADII[i];
              const c = 2 * Math.PI * r;
              const frac = max > 0 ? Math.min(values[type.key] / max, 1) : 0;
              return (
                <g key={type.key}>
                  <circle
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    strokeWidth={RING_STROKE}
                    className="stroke-foreground/10"
                  />
                  {frac > 0 && (
                    <motion.circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="none"
                      strokeWidth={RING_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={c}
                      className={cn(type.strokeClass, selected === type.key ? 'opacity-100' : 'opacity-60')}
                      initial={{ strokeDashoffset: reduce ? c * (1 - frac) : c }}
                      animate={{ strokeDashoffset: c * (1 - frac) }}
                      transition={{ duration: reduce ? 0 : 0.6, ease: 'easeOut' }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
            <div className="font-display text-3xl text-foreground leading-none tabular-nums">
              {roundedZero(activeValue) ? 'טרם' : formatValue(activeValue)}
            </div>
            {!roundedZero(activeValue) && (
              <div className="text-xs text-muted-foreground mt-1">{activeType.unit}</div>
            )}
            <div className="text-[13px] text-foreground/70 mt-1.5 leading-tight">{activeType.label}</div>
          </div>
        </div>

        {/* Rows */}
        <div className="rounded-2xl border border-foreground/15 bg-card divide-y divide-foreground/10 overflow-hidden">
          {RETURN_TYPES.map((type) => {
            const v = values[type.key];
            const empty = roundedZero(v);
            return (
              <button
                key={type.key}
                disabled={empty}
                onClick={() => setSelected(type.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-right transition-colors',
                  empty ? 'opacity-45 cursor-default' : 'hover:bg-foreground/5',
                  selected === type.key && !empty && 'bg-foreground/5'
                )}
              >
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', type.colorClass)} />
                <span className="flex-1 text-sm text-foreground">{type.label}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {empty ? 'טרם' : `${formatValue(v)} ${type.unit}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <Card className="p-5 space-y-5 rounded-2xl border-foreground/15">
          {circleScope === 'mine' ? (
            <>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-foreground">אם תביאו עוד מישהו</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{bring}</span>
                </div>
                <Slider value={[bring]} onValueChange={([v]) => setBring(v)} min={0} max={10} step={1} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {missing > 0
                  ? `נותרו ${missing} סוגי החזר שטרם נגעתם בהם`
                  : 'המעגל שלכם נוגע בכל חמשת סוגי ההחזר'}
              </p>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-foreground">מבקרים לאורך התערוכה</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{visitors.toLocaleString()}</span>
                </div>
                <Slider
                  value={[visitors]}
                  onValueChange={([v]) => setVisitors(v)}
                  min={1000}
                  max={120000}
                  step={1000}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-foreground">טווח זמן</span>
                  <span className="text-sm text-muted-foreground tabular-nums">{months} חוד׳</span>
                </div>
                <Slider value={[months]} onValueChange={([v]) => setMonths(v)} min={1} max={36} step={1} />
              </div>
              <p className="text-xs text-muted-foreground">על בסיס 372 יוזמות מסווגות</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function roundedZero(v: number) {
  return !v || Math.round(v) === 0;
}
