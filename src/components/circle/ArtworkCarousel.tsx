import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { type Artwork } from '@/data/activities';
import { useDataset } from '@/i18n/dataset';
import { Check } from 'lucide-react';
import { ArtworkDetailPanel } from './ArtworkDetailPanel';

interface ArtworkCarouselProps {
  selectedArtworks: number[];
  toggleArtwork: (id: number) => void;
}

export function ArtworkCarousel({ selectedArtworks, toggleArtwork }: ArtworkCarouselProps) {
  const { artworks } = useDataset();
  const [active, setActive] = useState<Artwork | null>(null);

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto overflow-y-visible pb-4 pt-2 -mx-2 px-2 scrollbar-hide">
        {artworks.map(artwork => {
          const isSelected = selectedArtworks.includes(artwork.id);
          const isActive = active?.id === artwork.id;
          return (
            <motion.button
              key={artwork.id}
              onClick={() => setActive(isActive ? null : artwork)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                'flex-shrink-0 w-32 rounded-xl border-2 bg-card relative transition-all overflow-hidden',
                isActive
                  ? 'border-foreground shadow-soft'
                  : isSelected
                  ? 'border-primary shadow-soft'
                  : 'border-border/40'
              )}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={artwork.image}
                  alt={artwork.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 text-left">
                <div className="text-xs font-medium text-foreground leading-tight line-clamp-1">{artwork.name}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{artwork.artist}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <ArtworkDetailPanel
            key={active.id}
            artwork={active}
            isSelected={selectedArtworks.includes(active.id)}
            onToggleSelect={(a) => toggleArtwork(a.id)}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
