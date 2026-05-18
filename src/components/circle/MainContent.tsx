import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useDataset } from '@/i18n/dataset';
import { useT } from '@/i18n/LanguageContext';
import { FilterChip } from './FilterChip';
import { EnergyCard } from './EnergyCard';
import { LocationFilter } from './LocationFilter';
import { ArtworkCarousel } from './ArtworkCarousel';
import { ActivityCard } from './ActivityCard';
import { SpiralLine, EllipseLine, CircleLine, DottedRing } from './LineArt';
import { Shuffle, Plus, Minus } from 'lucide-react';
import type { Activity } from '@/data/activities';

type SectionKey = 'draws' | 'energy' | 'where' | 'artwork';

interface FilterSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, count, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-t border-foreground/15 first:border-t-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg md:text-xl tracking-[0.18em] uppercase text-foreground">
            {title}
          </h3>
          {count > 0 && (
            <span className="text-[10px] font-display tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-foreground text-background">
              {count}
            </span>
          )}
        </div>
        <div className="text-foreground/60 group-hover:text-foreground transition-colors">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const { drawOptions, energyOptions, activities } = useDataset();
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

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    draws: false,
    energy: false,
    where: false,
    artwork: false,
  });

  const toggleSection = (key: SectionKey) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

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
        </motion.header>

        {/* Quick action — Shuffle on top */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleShuffle}
          className="w-full py-5 mb-4 rounded-sm font-display text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-soft"
        >
          <Shuffle className="w-4 h-4" />
          {t('shuffle_cta')}
        </motion.button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-foreground/15" />
          <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.3em]">{t('or_refine')}</span>
          <div className="flex-1 h-px bg-foreground/15" />
        </div>

        {/* Filter Section — collapsible, any order */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/70 backdrop-blur-sm rounded-sm px-6 mb-8 border border-foreground/15 shadow-soft"
        >
          <FilterSection
            title={t('section_draws')}
            count={selectedDraws.length}
            isOpen={openSections.draws}
            onToggle={() => toggleSection('draws')}
          >
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
          </FilterSection>

          <FilterSection
            title={t('section_energy')}
            count={selectedEnergy.length}
            isOpen={openSections.energy}
            onToggle={() => toggleSection('energy')}
          >
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
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
          </FilterSection>

          <FilterSection
            title={t('section_where')}
            count={locationFormat.length}
            isOpen={openSections.where}
            onToggle={() => toggleSection('where')}
          >
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
          </FilterSection>

          <FilterSection
            title={t('section_artwork')}
            count={selectedArtworks.length}
            isOpen={openSections.artwork}
            onToggle={() => toggleSection('artwork')}
          >
            <p className="text-xs text-muted-foreground mb-3 italic">
              {t('artwork_hint')}
            </p>
            <ArtworkCarousel
              selectedArtworks={selectedArtworks}
              toggleArtwork={toggleArtwork}
            />
          </FilterSection>
        </motion.div>

        {/* Results section */}
        <motion.div
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