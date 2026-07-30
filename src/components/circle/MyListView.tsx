import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useT } from '@/i18n/LanguageContext';
import { useDataset } from '@/i18n/dataset';
import { useSession } from '@/hooks/useSession';
import { ActivityCard } from './ActivityCard';
import { ArtworkDetailModal } from './ArtworkDetailModal';

import { cn } from '@/lib/utils';
import type { Activity, Artwork } from '@/data/activities';
import type { AppMode } from '@/hooks/useCircleStore';

interface Props {
  onCloseCircle: (activity: Activity) => void;
  setMode: (m: AppMode) => void;
}

export function MyListView({ onCloseCircle, setMode }: Props) {
  const t = useT();
  const { activities, artworks } = useDataset();
  const { savedIds, savedArtworkIds, toggleArtworkSave } = useSession();
  const [tab, setTab] = useState<'initiatives' | 'artworks'>('initiatives');
  const [active, setActive] = useState<Artwork | null>(null);

  // newest-saved first
  const savedActivities = useMemo(
    () =>
      [...savedIds]
        .reverse()
        .map((id) => activities.find((a) => String(a.id) === id))
        .filter(Boolean) as Activity[],
    [savedIds, activities]
  );

  const savedArtworks = useMemo(
    () =>
      [...savedArtworkIds]
        .reverse()
        .map((id) => artworks.find((a) => a.id === id))
        .filter(Boolean) as Artwork[],
    [savedArtworkIds, artworks]
  );

  const chip = (isActive: boolean) =>
    cn(
      'px-4 py-2 rounded-full border text-[11px] font-display tracking-[0.18em] uppercase transition-all',
      isActive
        ? 'bg-foreground text-background border-foreground'
        : 'bg-card text-foreground/60 border-foreground/20 hover:border-foreground/40'
    );

  return (
    <div className="min-h-screen pb-16 safe-area-bottom">
      <div className="max-w-lg mx-auto px-5 pt-6">
        <header className="text-center mb-5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-foreground/20" />
            <CircleLine className="w-6 h-6 opacity-70" strokeWidth={0.8} />
            <div className="h-px flex-1 bg-foreground/20" />
          </div>
          <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-foreground">
            {t('mode_my_list')}
          </h1>
        </header>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button className={chip(tab === 'initiatives')} onClick={() => setTab('initiatives')}>
            {t('my_list_tab_initiatives')} ({savedActivities.length})
          </button>
          <button className={chip(tab === 'artworks')} onClick={() => setTab('artworks')}>
            {t('my_list_tab_artworks')} ({savedArtworks.length})
          </button>
        </div>

        {tab === 'initiatives' ? (
          savedActivities.length === 0 ? (
            <EmptyState
              title={t('my_list_empty_initiatives_title')}
              body={t('my_list_empty_initiatives_body')}
              cta={t('start_exploring')}
              onCta={() => setMode('act')}
            />
          ) : (
            <div className="space-y-5">
              <AnimatePresence initial={false}>
                {savedActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    layout
                    exit={{ opacity: 0, scale: 0.96, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ActivityCard activity={activity} index={index} onCloseCircle={onCloseCircle} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        ) : savedArtworks.length === 0 ? (
          <EmptyState
            title={t('my_list_empty_artworks_title')}
            body={t('my_list_empty_artworks_body')}
            cta={t('start_exploring_artworks')}
            onCta={() => setMode('artworks')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence initial={false}>
              {savedArtworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative bg-card border border-foreground/15 rounded-sm overflow-hidden hover:border-foreground/40 transition-all"
                >
                  <button onClick={() => setActive(artwork)} className="block w-full text-left">
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img src={artwork.image} alt={artwork.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-[9px] font-display tracking-[0.2em] uppercase text-muted-foreground mb-1 line-clamp-1">
                        {artwork.theme}
                      </div>
                      <div className="font-display text-sm text-foreground leading-tight line-clamp-1">
                        {artwork.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{artwork.artist}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleArtworkSave(artwork.id)}
                    aria-label="Remove from my list"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/85 backdrop-blur-sm border border-foreground/15 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ArtworkDetailModal artwork={active} onClose={() => setActive(null)} />
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
  onCta,
}: {
  title: string;
  body: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 text-center flex flex-col items-center gap-4"
    >
      <Bookmark className="w-7 h-7 text-foreground/25" />
      <h2 className="font-display text-lg tracking-[0.1em] text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{body}</p>
      <button
        onClick={onCta}
        className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-display text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity"
      >
        {cta}
      </button>
    </motion.div>
  );
}
