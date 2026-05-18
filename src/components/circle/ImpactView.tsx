import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpiralLine, DottedRing, EllipseLine } from './LineArt';
import { useT } from '@/i18n/LanguageContext';

interface FeedItem {
  name: string;
  action: string;
  city: string;
  time: string;
  id: number;
}

const POOL = [
  { name: 'Roni', action: 'joined the Haifa repair café', city: 'Haifa' },
  { name: 'Amir', action: 'repaired a jacket at Florentin', city: 'Tel Aviv' },
  { name: 'Maya', action: 'added a drill to the tool library', city: 'Tel Aviv' },
  { name: 'Noa', action: 'brought 3 items to the swap event', city: 'Jerusalem' },
  { name: 'Lior', action: 'chose repair over replace', city: 'Beer Sheva' },
  { name: 'Dana', action: 'started composting at home', city: 'Haifa' },
  { name: 'Tomer', action: 'gifted old furniture instead of binning', city: 'Ramat Gan' },
  { name: 'Yael', action: 'fixed a vintage lamp', city: 'Herzliya' },
  { name: 'Hila', action: 'joined a zero-waste group', city: 'Haifa' },
  { name: 'Oren', action: 'repaired electronics at the hub', city: 'Jerusalem' },
  { name: 'Shira', action: 'chose a circular brand', city: 'Tel Aviv' },
  { name: 'Guy', action: 'borrowed instead of buying', city: 'Tel Aviv' },
  { name: 'Dror', action: 'shared a sewing machine with a neighbour', city: 'Haifa' },
  { name: 'Michal', action: 'upcycled packaging into planters', city: 'Netanya' },
  { name: 'Shai', action: 'brought textiles to the repair café', city: 'Tel Aviv' },
];

const SEED: FeedItem[] = [
  { name: 'Shira', action: 'chose a circular brand', city: 'Tel Aviv', time: '4m ago', id: 1 },
  { name: 'Tal', action: 'joined composting group', city: 'Haifa', time: '7m ago', id: 2 },
  { name: 'Guy', action: 'added 2 items to tool library', city: 'Tel Aviv', time: '11m ago', id: 3 },
  { name: 'Noa', action: 'upcycled furniture', city: 'Jerusalem', time: '18m ago', id: 4 },
];

const SPECS = [
  { name: 'Florentin Repair Café', detail: '34 items repaired this month · Tel Aviv' },
  { name: 'HaCarmel Tool Library', detail: '89 tools shared this month · Haifa' },
  { name: 'Circular Design Hub', detail: '12 upcycling workshops · Jerusalem' },
];

const TARGET = 2847;

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function ImpactView() {
  const t = useT();
  const [count, setCount] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>(SEED);
  const idRef = useRef(100);
  const poolIdxRef = useRef(0);

  // Counter animation + slow drift
  useEffect(() => {
    const start = performance.now();
    const DURATION = 1600;
    let raf = 0;
    const tick = (ts: number) => {
      const t = Math.min((ts - start) / DURATION, 1);
      setCount(Math.round(easeOut(t) * TARGET));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const drift = setInterval(() => {
      setCount(prev => prev + (Math.random() < 0.25 ? 2 : 1));
    }, 3800);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(drift);
    };
  }, []);

  // Live feed
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const next = 2800 + Math.random() * 2400;
      timeout = setTimeout(() => {
        const item = POOL[poolIdxRef.current % POOL.length];
        poolIdxRef.current++;
        idRef.current++;
        setFeed(prev => [
          { ...item, time: 'just now', id: idRef.current },
          ...prev,
        ].slice(0, 7));
        schedule();
      }, next);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  const kg = Math.round(count * 1.8);
  const machines = Math.round(kg / 14);

  return (
    <div className="min-h-screen pb-8 safe-area-bottom relative overflow-hidden">
      <SpiralLine className="absolute -top-10 -right-16 w-72 h-72 opacity-[0.06] pointer-events-none" />
      <DottedRing className="absolute top-60 -left-20 w-56 h-56 opacity-[0.08] pointer-events-none" count={12} />
      <EllipseLine className="absolute bottom-40 -right-20 w-80 h-80 opacity-[0.05] pointer-events-none" />

      <div className="max-w-lg mx-auto px-5 pt-6 relative space-y-4">
        {/* Counter card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/70 backdrop-blur-sm border border-foreground/15 rounded-sm p-6 shadow-soft"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr] gap-6 items-start">
            <div>
              <p
                className="font-display text-foreground leading-none tabular-nums"
                style={{ fontSize: '52px', fontWeight: 400 }}
              >
                {count.toLocaleString()}
              </p>
              <p className="text-[13px] text-muted-foreground mt-1.5 mb-2.5 font-medium">
                {t('items_second_life')}
              </p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                = <strong className="text-foreground font-medium">{kg.toLocaleString()} kg</strong> {t('out_of_landfill')}
                <br />
                <span className="text-muted-foreground/70">≈ {machines} {t('washing_machines')}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80 mb-2">
                {t('where_happened')}
              </p>
              <div>
                {SPECS.map((s, i) => (
                  <div
                    key={s.name}
                    className={`flex gap-2.5 items-start py-2 ${i === 0 ? '' : 'border-t border-foreground/10'}`}
                  >
                    <div className="w-[7px] h-[7px] rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[13px] text-foreground font-medium m-0">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live feed card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/70 backdrop-blur-sm border border-foreground/15 rounded-sm p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-3.5">
            <motion.div
              className="w-[7px] h-[7px] rounded-full bg-primary"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-muted-foreground">{t('live_now')}</span>
            <span className="text-[11px] text-muted-foreground/70 ml-auto">
              {feed.length + poolIdxRef.current} {t('actions_today')}
            </span>
          </div>
          <div>
            <AnimatePresence initial={false}>
              {feed.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`py-2 ${i === feed.length - 1 ? '' : 'border-b border-foreground/10'}`}
                >
                  <span className="text-[13px] text-foreground font-medium">{item.name}</span>
                  <span className="text-[13px] text-muted-foreground"> {item.action}</span>
                  <span className="text-[11px] text-muted-foreground/70"> · {item.city} · {item.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground/60 pt-2">
          {t('ripples_outward')}
        </p>
      </div>
    </div>
  );
}
