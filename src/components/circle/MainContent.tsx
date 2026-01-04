import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { drawOptions, energyOptions, activities, artworks } from '@/data/activities';
import { FilterChip } from './FilterChip';
import { EnergyCard } from './EnergyCard';
import { LocationFilter } from './LocationFilter';
import { ArtworkCarousel } from './ArtworkCarousel';
import { ActivityCard } from './ActivityCard';
import { Shuffle } from 'lucide-react';
import type { Activity } from '@/data/activities';

interface MainContentProps {
  selectedDraws: string[];
  toggleDraw: (id: string) => void;
  selectedEnergy: string;
  setSelectedEnergy: (energy: string) => void;
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
  setSelectedEnergy,
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
      
      // Filter by energy level
      const energyMatch = activity.energyLevel === selectedEnergy;
      
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
    <div className="min-h-screen pb-8 safe-area-top safe-area-bottom">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-serif text-4xl font-semibold text-foreground tracking-tight mb-1">
            The Circle
          </h1>
          <p className="text-muted-foreground text-sm">
            Discover activities that resonate with your vision of circular design
          </p>
        </motion.header>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-5 mb-6 border-2 border-border/30 shadow-medium"
        >
          {/* What draws you? */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
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
          <div className="mb-6">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              How do you want to show up?
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {energyOptions.map(option => (
                <EnergyCard
                  key={option.id}
                  icon={option.icon}
                  label={option.label}
                  time={option.time}
                  selected={selectedEnergy === option.id}
                  onClick={() => setSelectedEnergy(option.id)}
                />
              ))}
            </div>
          </div>

          {/* Where? */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
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
          <div className="mb-6">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1">
              Artwork I connect with
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Tap the artworks that resonate with you
            </p>
            <ArtworkCarousel 
              selectedArtworks={selectedArtworks}
              toggleArtwork={toggleArtwork}
            />
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs font-bold text-muted-foreground uppercase">or</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Random button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-base shadow-glow flex items-center justify-center gap-3"
            style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
          >
            <Shuffle className="w-5 h-5" />
            Just show me something!
          </motion.button>
        </motion.div>

        {/* Results section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-2">
            Showing {filteredActivities.length} of {activities.length} activities
          </h2>
          
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