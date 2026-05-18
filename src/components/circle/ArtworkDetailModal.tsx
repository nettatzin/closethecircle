import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Artwork } from '@/data/activities';
import { CircleLine } from './LineArt';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  isSelected?: boolean;
  onToggleSelect?: (artwork: Artwork) => void;
}

export function ArtworkDetailModal({ artwork, onClose, isSelected, onToggleSelect }: ArtworkDetailModalProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [artwork?.id]);

  useEffect(() => {
    if (!artwork) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [artwork, onClose]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-card border border-foreground/15 rounded-t-2xl sm:rounded-sm shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/15 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gallery */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={artwork.gallery[activeImage]}
                  alt={`${artwork.name} — view ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {artwork.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((i) => (i - 1 + artwork.gallery.length) % artwork.gallery.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/15 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % artwork.gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/15 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {artwork.gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeImage ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/40'
                        }`}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {artwork.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-6 sm:px-8 pt-4 pb-1">
                {artwork.gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-sm border-2 transition-all ${
                      i === activeImage ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground mb-3">
                  <span>{artwork.theme}</span>
                  <CircleLine className="w-2 h-2 opacity-60" strokeWidth={1.5} />
                  <span>{artwork.space}</span>
                  <CircleLine className="w-2 h-2 opacity-60" strokeWidth={1.5} />
                  <span>{artwork.year}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl tracking-[0.05em] text-foreground mb-2">
                  {artwork.name}
                </h2>
                <p className="text-sm text-muted-foreground">{artwork.artist}</p>
              </div>

              {/* About piece */}
              <section>
                <h3 className="font-display text-xs tracking-[0.25em] uppercase text-foreground mb-2">
                  About the work
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">{artwork.about}</p>
                <p className="text-xs text-muted-foreground italic mt-3">{artwork.medium}</p>
              </section>

              {/* About artist */}
              <section>
                <h3 className="font-display text-xs tracking-[0.25em] uppercase text-foreground mb-2">
                  About the artist
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">{artwork.artistBio}</p>
              </section>

              {/* Links */}
              {artwork.links.length > 0 && (
                <section>
                  <h3 className="font-display text-xs tracking-[0.25em] uppercase text-foreground mb-3">
                    Read & watch
                  </h3>
                  <ul className="space-y-2">
                    {artwork.links.map((link) => (
                      <li key={link.url + link.label}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 px-4 py-3 border border-foreground/15 rounded-sm hover:bg-foreground hover:text-background transition-colors group"
                        >
                          <span className="flex items-center gap-3 text-sm">
                            <span className="text-[9px] font-display tracking-[0.2em] uppercase text-muted-foreground group-hover:text-background/70">
                              {link.type}
                            </span>
                            <span>{link.label}</span>
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {onToggleSelect && (
              <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-foreground/15 p-4 sm:p-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    onToggleSelect(artwork);
                    if (!isSelected) onClose();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-sm font-display text-xs tracking-[0.25em] uppercase transition-all ${
                    isSelected
                      ? 'bg-foreground/10 text-foreground border border-foreground/30 hover:bg-foreground/15'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" /> Selected — tap to remove
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Select this work
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
