import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { artworks } from '@/data/activities';
import { Check } from 'lucide-react';

interface ArtworkCarouselProps {
  selectedArtworks: number[];
  toggleArtwork: (id: number) => void;
}

export function ArtworkCarousel({ selectedArtworks, toggleArtwork }: ArtworkCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
      {artworks.map(artwork => (
        <motion.button
          key={artwork.id}
          onClick={() => toggleArtwork(artwork.id)}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex-shrink-0 w-24 p-3 rounded-xl border-2 bg-card relative transition-all',
            selectedArtworks.includes(artwork.id)
              ? 'border-primary shadow-soft'
              : 'border-border/40'
          )}
        >
          {selectedArtworks.includes(artwork.id) && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
          <div className="text-4xl mb-2">{artwork.image}</div>
          <div className="text-xs text-foreground text-center leading-tight">{artwork.name}</div>
        </motion.button>
      ))}
    </div>
  );
}