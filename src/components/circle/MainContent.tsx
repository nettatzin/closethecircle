import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useDataset } from '@/i18n/dataset';
import { useT } from '@/i18n/LanguageContext';
import { FilterChip } from './FilterChip';
import { EnergyCard } from './EnergyCard';
import { LocationFilter } from './LocationFilter';
import { ArtworkCarousel } from './ArtworkCarousel';
import { ActivityCard } from './ActivityCard';
import { SpiralLine, EllipseLine, CircleLine, DottedRing } from './LineArt';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shuffle } from 'lucide-react';
import type { Activity } from '@/data/activities';

type SectionKey = 'draws' | 'energy' | 'where' | 'artwork';

interface SpiralNodeProps {
  index: number;
  title: string;
  count: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  labelSide: 'left' | 'right';
  onClick: () => void;
  delay?: number;
}

function SpiralNode({ index, title, count, position, labelSide, onClick, delay = 0 }: SpiralNodeProps) {
  const active = count > 0;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={position}
      className="absolute flex items-center gap-2 group"
      aria-label={title}
    >
      {labelSide === 'right' && (
        <span
          className={`font-display text-[11px] md:text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
            active ? 'text-accent' : 'text-foreground/75 group-hover:text-foreground'
          }`}
        >
          {title}
        </span>
      )}
      <span className="relative">
        <span
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border transition-all ${
            active
              ? 'bg-accent border-accent text-accent-foreground shadow-medium'
              : 'bg-card border-foreground/30 text-foreground/80 group-hover:border-foreground group-hover:text-foreground shadow-soft'
          }`}
        >
          <span className="font-display text-base leading-none">{index}</span>
        </span>
        {active && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] font-display flex items-center justify-center">
            {count}
          </span>
        )}
      </span>
      {labelSide === 'left' && (
        <span
          className={`font-display text-[11px] md:text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
            active ? 'text-accent' : 'text-foreground/75 group-hover:text-foreground'
          }`}
        >
          {title}
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

  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

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

  // Spiral nodes — placed along the decorative spiral, inward
  const nodes: Array<{ key: SectionKey; index: number; position: React.CSSProperties; labelSide: 'left' | 'right' }> = [
    { key: 'draws',   index: 1, position: { top: '4%',   right: '8%'  }, labelSide: 'left'  },
    { key: 'energy',  index: 2, position: { top: '34%',  left: '6%'   }, labelSide: 'right' },
    { key: 'where',   index: 3, position: { bottom: '30%', right: '18%' }, labelSide: 'left'  },
    { key: 'artwork', index: 4, position: { bottom: '6%',  left: '26%'  }, labelSide: 'right' },
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

        {/* Spiral filter map — tap a node to refine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full mx-auto mb-10"
          style={{ height: 'min(78vw, 360px)' }}
        >
          {/* Decorative spiral guide */}
          <SpiralLine
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
            strokeWidth={0.4}
          />

          {nodes.map((n, i) => (
            <SpiralNode
              key={n.key}
              index={n.index}
              title={sectionContent[n.key].title}
              count={sectionContent[n.key].count}
              position={n.position as { top?: string; bottom?: string; left?: string; right?: string }}
              labelSide={n.labelSide}
              delay={0.15 + i * 0.08}
              onClick={() => setActiveSection(n.key)}
            />
          ))}
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