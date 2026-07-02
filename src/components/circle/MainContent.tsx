import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDataset } from '@/i18n/dataset';
import { useT, useLang } from '@/i18n/LanguageContext';
import { FilterChip } from './FilterChip';
import { EnergyCard } from './EnergyCard';
import { LocationFilter } from './LocationFilter';
import { ArtworkCarousel } from './ArtworkCarousel';
import { ActivityCard } from './ActivityCard';
import { SpiralLine, EllipseLine, CircleLine, DottedRing } from './LineArt';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shuffle, Sparkles, ArrowDown, Compass, Flame, MapPin, Palette, Plus, type LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/data/activities';

type SectionKey = 'draws' | 'energy' | 'where' | 'artwork';

interface FilterTileProps {
  Icon: LucideIcon;
  title: string;
  count: number;
  onClick: () => void;
  delay?: number;
}

function FilterTile({ Icon, title, count, onClick, delay = 0 }: FilterTileProps) {
  const active = count > 0;
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-label={title}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-sm px-3 py-5 border transition-all text-center overflow-hidden ${
        active
          ? 'bg-accent/10 border-accent/60 shadow-medium'
          : 'bg-card border-foreground/15 hover:border-foreground/40 shadow-soft'
      }`}
    >
      <span
        className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${
          active
            ? 'bg-accent border-accent text-accent-foreground'
            : 'bg-background border-foreground/25 text-foreground/80'
        }`}
      >
        <Icon className="w-5 h-5" strokeWidth={1.4} />
      </span>
      <span
        className={`font-display text-[10.5px] leading-tight tracking-[0.18em] uppercase transition-colors ${
          active ? 'text-accent' : 'text-foreground/85'
        }`}
      >
        {title}
      </span>
      {active ? (
        <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-display flex items-center justify-center">
          {count}
        </span>
      ) : (
        <span className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full border border-foreground/25 text-foreground/50 flex items-center justify-center">
          <Plus className="w-2.5 h-2.5" strokeWidth={2} />
        </span>
      )}
    </motion.button>
  );
}

interface MainContentProps {
  selectedDraws: string[];
  toggleDraw: (id: string) => void;
  selectedEnergy: string[];
  toggleEnergy: (energy: string) => void;
  locationFormat: string[];
  toggleFormat: (format: string) => void;
  physicalLocation: string;
  setPhysicalLocation: (location: string) => void;
  physicalRadius: string;
  setPhysicalRadius: (radius: string) => void;
  digitalReach: string[];
  toggleDigitalReach: (reach: string) => void;
  selectedArtworks: number[];
  toggleArtwork: (id: number) => void;
  onCloseCircle: (activity: Activity) => void;
  resetFilters: () => void;
}

export function MainContent({
  selectedDraws,
  toggleDraw,
  selectedEnergy,
  toggleEnergy,
  locationFormat,
  toggleFormat,
  physicalLocation,
  setPhysicalLocation,
  physicalRadius,
  setPhysicalRadius,
  digitalReach,
  toggleDigitalReach,
  selectedArtworks,
  toggleArtwork,
  onCloseCircle,
  resetFilters,
}: MainContentProps) {
  const t = useT();
  const { lang } = useLang();
  const { drawOptions, energyOptions, activities } = useDataset();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [vibe, setVibe] = useState<string>('');
  const [vibeLoading, setVibeLoading] = useState(false);
  // Filter activities based on selected filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Filter by draws (any match)
      const drawsMatch = selectedDraws.length === 0 || 
        activity.draws.some(draw => selectedDraws.includes(draw));
      
      // Filter by energy level (any match)
      const energyMatch = selectedEnergy.length === 0 || 
        selectedEnergy.includes(activity.energyLevel);
      
      // Filter by location format
      const locationMatch = locationFormat.length === 0 || 
        locationFormat.includes(activity.locationFormat) ||
        (locationFormat.includes('physical') && activity.locationFormat === 'hybrid') ||
        (locationFormat.includes('digital') && activity.locationFormat === 'hybrid');
      
      // Filter by digital reach (if digital is selected)
      const reachMatch = !locationFormat.includes('digital') || 
        digitalReach.length === 0 ||
        digitalReach.includes(activity.region);
      
      // Filter by selected artworks (any match)
      const artworkMatch = selectedArtworks.length === 0 || 
        activity.connectedArtworks.some(id => selectedArtworks.includes(id));
      
      return drawsMatch && energyMatch && locationMatch && reachMatch && artworkMatch;
    });
  }, [activities, selectedDraws, selectedEnergy, locationFormat, digitalReach, selectedArtworks]);

  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const hasAnySelection =
    selectedDraws.length + selectedEnergy.length + locationFormat.length +
    digitalReach.length + selectedArtworks.length > 0;

  // Fetch climate vibe sentence when preferences change (debounced)
  useEffect(() => {
    if (!hasAnySelection) {
      setVibe('');
      return;
    }
    const handle = setTimeout(async () => {
      setVibeLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('climate-vibes', {
          body: {
            lang,
            draws: selectedDraws,
            energy: selectedEnergy,
            locationFormat,
            digitalReach,
            artworkCount: selectedArtworks.length,
            activityCount: filteredActivities.length,
          },
        });
        if (!error && data?.vibe) setVibe(data.vibe);
      } catch (_) {
        // silent fail
      } finally {
        setVibeLoading(false);
      }
    }, 700);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lang,
    selectedDraws.join(','),
    selectedEnergy.join(','),
    locationFormat.join(','),
    digitalReach.join(','),
    selectedArtworks.join(','),
    filteredActivities.length,
  ]);

  const handleReadyClick = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sectionContent: Record<SectionKey, { title: string; count: number; body: React.ReactNode }> = {
    draws: {
      title: t('section_draws'),
      count: selectedDraws.length,
      body: (
        <div className="flex flex-wrap gap-2">
          {drawOptions.map(option => (
            <FilterChip
              key={option.id}
              icon={option.icon}
              label={option.label}
              selected={selectedDraws.includes(option.id)}
              onClick={() => toggleDraw(option.id)}
            />
          ))}
        </div>
      ),
    },
    energy: {
      title: t('section_energy'),
      count: selectedEnergy.length,
      body: (
        <div className="grid grid-cols-3 gap-1.5">
          {energyOptions.map(option => (
            <EnergyCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              time={option.time}
              selected={selectedEnergy.includes(option.id)}
              onClick={() => toggleEnergy(option.id)}
            />
          ))}
        </div>
      ),
    },
    where: {
      title: t('section_where'),
      count: locationFormat.length,
      body: (
        <LocationFilter
          locationFormat={locationFormat}
          toggleFormat={toggleFormat}
          physicalLocation={physicalLocation}
          setPhysicalLocation={setPhysicalLocation}
          physicalRadius={physicalRadius}
          setPhysicalRadius={setPhysicalRadius}
          digitalReach={digitalReach}
          toggleDigitalReach={toggleDigitalReach}
        />
      ),
    },
    artwork: {
      title: t('section_artwork'),
      count: selectedArtworks.length,
      body: (
        <>
          <p className="text-xs text-muted-foreground mb-3 italic">{t('artwork_hint')}</p>
          <ArtworkCarousel selectedArtworks={selectedArtworks} toggleArtwork={toggleArtwork} />
        </>
      ),
    },
  };

  // Filter tiles — clean 2x2 grid
  const tiles: Array<{ key: SectionKey; Icon: LucideIcon }> = [
    { key: 'draws',   Icon: Compass },
    { key: 'energy',  Icon: Flame },
    { key: 'where',   Icon: MapPin },
    { key: 'artwork', Icon: Palette },
  ];

  const handleShuffle = () => {
    const pool = filteredActivities.length > 0 ? filteredActivities : activities;
    const random = pool[Math.floor(Math.random() * pool.length)];
    onCloseCircle(random);
  };

  return (
    <div className="min-h-screen pb-8 safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Decorative line-art background motifs */}
      <SpiralLine className="absolute -top-10 -left-16 w-72 h-72 opacity-[0.06] pointer-events-none" />
      <DottedRing className="absolute top-40 -right-20 w-56 h-56 opacity-[0.08] pointer-events-none" count={12} />
      <EllipseLine className="absolute bottom-40 -left-20 w-80 h-80 opacity-[0.05] pointer-events-none" />

      <div className="max-w-lg mx-auto px-5 pt-8 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-foreground/20" />
            <CircleLine className="w-8 h-8 opacity-70" strokeWidth={0.8} />
            <div className="h-px flex-1 bg-foreground/20" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-[0.15em] uppercase mb-3">
            {t('app_title')}
          </h1>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {t('app_tagline')}
          </p>
          <p className="text-muted-foreground text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            {t('app_intro')}
          </p>
          <button
            onClick={() => {
              resetFilters();
              setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }}
            className="mt-3 text-[11px] font-display uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
          >
            {t('show_me_all')}
          </button>
        </motion.header>



        {/* Filter tiles — tap to refine, threaded by an ellipse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-10"
        >
          {/* Decorative ellipse connecting the four tiles */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none text-foreground/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            aria-hidden="true"
          >
            <ellipse cx="50" cy="50" rx="44" ry="34" transform="rotate(-14 50 50)" strokeDasharray="1.2 1.6" />
            <ellipse cx="50" cy="50" rx="30" ry="22" transform="rotate(-14 50 50)" className="text-foreground/15" />
          </svg>

          <div className="relative grid grid-cols-2 gap-x-6 gap-y-5">
            {tiles.map((tile, i) => (
              <FilterTile
                key={tile.key}
                Icon={tile.Icon}
                title={sectionContent[tile.key].title}
                count={sectionContent[tile.key].count}
                delay={0.12 + i * 0.06}
                onClick={() => setActiveSection(tile.key)}
              />
            ))}
          </div>
        </motion.div>

        <Dialog open={activeSection !== null} onOpenChange={(open) => !open && setActiveSection(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
            {activeSection && (
              <>
                <DialogHeader className="shrink-0 p-6 pb-2">
                  <DialogTitle className="font-display text-xl tracking-[0.18em] uppercase text-foreground text-center">
                    {sectionContent[activeSection].title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-2">
                  {sectionContent[activeSection].body}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Ready CTA + AI vibe sentence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <button
            onClick={handleReadyClick}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-accent/60 bg-accent/10 hover:bg-accent hover:text-accent-foreground text-foreground font-display text-[11px] tracking-[0.22em] uppercase transition-all shadow-soft"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent group-hover:text-accent-foreground transition-colors" />
            {t('ready_cta')}
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          </button>

          <div className="mt-4 min-h-[2.5rem] max-w-sm">
            {vibeLoading && !vibe ? (
              <p className="text-xs text-muted-foreground italic animate-pulse">
                {t('vibe_loading')}
              </p>
            ) : vibe ? (
              <motion.p
                key={vibe}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-foreground/80 italic leading-relaxed"
              >
                {vibe}
              </motion.p>
            ) : null}
          </div>
        </motion.div>

        {/* Results section */}
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
              {filteredActivities.length} {t('of_word')} {activities.length} {t('activities_word')}
            </h2>
            <div className="flex-1 h-px bg-foreground/15" />
          </div>
          
          {filteredActivities.length < activities.length && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={resetFilters}
              className="mb-5 px-4 py-2 text-[10px] font-display uppercase tracking-[0.2em] text-foreground border border-foreground/30 rounded-sm hover:bg-foreground hover:text-background transition-colors"
            >
              {t('show_all')}
            </motion.button>
          )}

          {filteredActivities.length === 0 ? (
            <div className="bg-card rounded-sm p-8 text-center border border-foreground/15">
              <p className="text-muted-foreground mb-2">{t('no_activities')}</p>
              <p className="text-sm text-muted-foreground italic">{t('no_activities_hint')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onCloseCircle={onCloseCircle}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}