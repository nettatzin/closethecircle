import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Bookmark, BarChart2, Coins, Palette, type LucideIcon } from 'lucide-react';
import { useLang, useT } from '@/i18n/LanguageContext';
import { useSession } from '@/hooks/useSession';
import type { AppMode } from '@/hooks/useCircleStore';
import type { StringKey } from '@/i18n/strings';
import { cn } from '@/lib/utils';

interface NavItem {
  mode: AppMode;
  icon: LucideIcon;
  key: StringKey;
}

const NAV_ITEMS: NavItem[] = [
  { mode: 'act', icon: Sparkles, key: 'mode_act' },
  { mode: 'my_list', icon: Bookmark, key: 'mode_my_list' },
  { mode: 'impact', icon: BarChart2, key: 'mode_impact' },
  { mode: 'cashback', icon: Coins, key: 'mode_cashback' },
  { mode: 'artworks', icon: Palette, key: 'tab_artworks' },
];

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ms-1.5 inline-flex min-w-[1.35rem] justify-center rounded-full bg-foreground/10 px-1.5 py-[2px] text-xs tabular-nums font-sans text-foreground/70">
      {count}
    </span>
  );
}

interface Props {
  mode: AppMode;
  setMode: (m: AppMode) => void;
}

export function AppNav({ mode, setMode }: Props) {
  const t = useT();
  const { lang, setLang, dir } = useLang();
  const { savedIds, savedArtworkIds } = useSession();
  const [open, setOpen] = useState(false);
  const savedCount = savedIds.length + savedArtworkIds.length;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const LangToggle = ({ className }: { className?: string }) => (
    <button
      onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
      className={cn(
        'px-3 py-2 border border-foreground/15 rounded-sm bg-card/60 text-[11px] font-display tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors',
        className
      )}
      aria-label="Toggle language"
    >
      {lang === 'en' ? t('lang_he') : t('lang_en')}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-foreground/10 safe-area-top">
      <div className="max-w-lg md:max-w-5xl lg:max-w-5xl mx-auto px-5 py-2">
        {/* Mobile bar */}
        <div className="flex md:hidden items-center justify-between">
          {(() => {
            const current = NAV_ITEMS.find((i) => i.mode === mode)!;
            const CurrentIcon = current.icon;
            return (
              <div className="flex items-center gap-2">
                <CurrentIcon className="w-4 h-4 text-foreground/80" />
                <span className="font-display text-sm tracking-[0.15em] uppercase text-foreground/80">
                  {t(current.key)}
                </span>
              </div>
            );
          })()}
          <button
            onClick={() => setOpen(true)}
            aria-label={t('menu_open')}
            className="w-11 h-11 -me-2 flex items-center justify-center rounded-sm text-foreground hover:bg-foreground/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop row */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <nav className="flex-1 flex items-center justify-center gap-2 lg:gap-4">
            {NAV_ITEMS.map(({ mode: m, icon: Icon, key }) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'relative flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-sm text-sm lg:text-base font-display tracking-[0.08em] lg:tracking-[0.12em] uppercase whitespace-nowrap transition-colors',
                    active ? 'text-foreground' : 'text-foreground/45 hover:text-foreground/80'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="app-nav-underline"
                      className="absolute inset-x-1 -bottom-0.5 h-px bg-foreground"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span>{t(key)}</span>
                  {m === 'my_list' && <CountBadge count={savedCount} />}
                </button>
              );
            })}
          </nav>
          <LangToggle />
        </div>
      </div>

      {/* Mobile drawer */}
      {createPortal(
        <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 z-50 w-[80%] max-w-xs bg-card border-foreground/15 shadow-2xl md:hidden safe-area-top flex flex-col',
                dir === 'rtl' ? 'left-0 border-e' : 'right-0 border-s'
              )}
            >
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('menu_close')}
                  className="w-11 h-11 flex items-center justify-center rounded-sm text-foreground hover:bg-foreground/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col px-3">
                {NAV_ITEMS.map(({ mode: m, icon: Icon, key }) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-4 min-h-[52px] px-3 rounded-sm text-start transition-colors',
                        active ? 'bg-foreground text-background' : 'text-foreground/75 hover:bg-foreground/5'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-sm font-display tracking-[0.2em] uppercase">{t(key)}</span>
                      {m === 'my_list' && (
                        <span
                          className={cn(
                            'inline-flex min-w-[1.35rem] justify-center rounded-full px-1.5 py-[1px] text-xs tabular-nums',
                            active ? 'bg-background/20 text-background' : 'bg-foreground/10 text-foreground/70'
                          )}
                        >
                          {savedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mx-6 my-4 h-px bg-foreground/10" />

              <div className="px-6">
                <LangToggle className="w-full py-3" />
              </div>
            </motion.aside>
          </>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
