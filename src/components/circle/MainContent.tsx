import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { drawOptions, energyOptions, activities, artworks } from '@/data/activities';
import { FilterChip } from './FilterChip';
import { EnergyCard } from './EnergyCard';
import { LocationFilter } from './LocationFilter';
import { ArtworkCarousel } from './ArtworkCarousel';
import { ActivityCard } from './ActivityCard';
import { SpiralLine, EllipseLine, CircleLine, DottedRing } from './LineArt';
import { Shuffle } from 'lucide-react';
import type { Activity } from '@/data/activities';

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
  }, [selectedDraws, selectedEnergy, locationFormat, digitalReach, selectedArtworks]);
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
          className="mb-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-foreground/20" />
            <CircleLine className="w-8 h-8 opacity-70" strokeWidth={0.8} />
            <div className="h-px flex-1 bg-foreground/20" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-[0.15em] uppercase mb-3">
            The Circle
          </h1>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Designing New Realities
          </p>
          <p className="text-muted-foreground text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            Discover activities that resonate with your vision of circular design
          </p>
        </motion.header>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/70 backdrop-blur-sm rounded-sm p-6 mb-8 border border-foreground/15 shadow-soft"
        >
          {/* What draws you? */}
          <div className="mb-7">
            <label className="block text-[10px] font-normal text-foreground uppercase tracking-[0.25em] mb-3 font-display">
              What draws you?
            </label>
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
          </div>

          {/* How do you want to show up? */}
          <div className="mb-7">
            <label className="block text-[10px] font-normal text-foreground uppercase tracking-[0.25em] mb-3 font-display">
              How do you want to show up?
            </label>
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
          </div>

          {/* Where? */}
          <div className="mb-7">
            <label className="block text-[10px] font-normal text-foreground uppercase tracking-[0.25em] mb-3 font-display">
              Where?
            </label>
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
          </div>

          {/* Artwork connection */}
          <div className="mb-7">
            <label className="block text-[10px] font-normal text-foreground uppercase tracking-[0.25em] mb-1 font-display">
              Artwork I connect with
            </label>
            <p className="text-xs text-muted-foreground mb-3 italic">
              Tap the artworks that resonate with you
            </p>
            <ArtworkCarousel
              selectedArtworks={selectedArtworks}
              toggleArtwork={toggleArtwork}
            />
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-foreground/15" />
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.3em]">or</span>
            <div className="flex-1 h-px bg-foreground/15" />
          </div>

          {/* Random button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-sm font-display text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Just show me something
          </motion.button>
        </motion.div>

        {/* Results section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
              {filteredActivities.length} of {activities.length} activities
            </h2>
            <div className="flex-1 h-px bg-foreground/15" />
          </div>
          
          {filteredActivities.length < activities.length && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className="mb-4 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-colors"
            >
              Show all activities
            </motion.button>
          )}

          {filteredActivities.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center border-2 border-border/30">
              <p className="text-muted-foreground mb-2">No activities match your current filters.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your preferences above.</p>
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