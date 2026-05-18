import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { artworks, artworkThemes, artworkSpaces, type Artwork } from '@/data/activities';
import { ArtworkDetailPanel } from './ArtworkDetailPanel';
import { CircleLine, EllipseLine, SpiralLine } from './LineArt';

export function ArtworksView() {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<string>('all');
  const [space, setSpace] = useState<string>('all');
  const [active, setActive] = useState<Artwork | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = (a: Artwork) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(a.id) ? next.delete(a.id) : next.add(a.id);
      return next;
    });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artworks.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.about.toLowerCase().includes(q);
      const matchesTheme = theme === 'all' || a.theme === theme;
      const matchesSpace = space === 'all' || a.space === space;
      return matchesQuery && matchesTheme && matchesSpace;
    });
  }, [query, theme, space]);

  return (
    <div className="min-h-screen pb-8 safe-area-top safe-area-bottom relative overflow-hidden">
      <SpiralLine className="absolute -top-10 -right-16 w-72 h-72 opacity-[0.06] pointer-events-none" />
      <EllipseLine className="absolute bottom-40 -right-20 w-80 h-80 opacity-[0.05] pointer-events-none" />

      <div className="max-w-lg mx-auto px-5 pt-2 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-foreground/20" />
            <CircleLine className="w-6 h-6 opacity-70" strokeWidth={0.8} />
            <div className="h-px flex-1 bg-foreground/20" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-[0.15em] uppercase mb-2">
            Revisit Your Favorite Artworks
          </h1>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            The Exhibition Catalogue
          </p>
        </motion.header>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, artists, themes…"
            className="w-full pl-11 pr-4 py-3 bg-card border border-foreground/15 rounded-sm text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <FilterSelect
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={['all', ...artworkThemes]}
          />
          <FilterSelect
            label="Space"
            value={space}
            onChange={setSpace}
            options={['all', ...artworkSpaces]}
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-foreground">
            {filtered.length} of {artworks.length} works
          </h2>
          <div className="flex-1 h-px bg-foreground/15" />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-card rounded-sm p-8 text-center border border-foreground/15">
            <p className="text-muted-foreground mb-2">No artworks match your filters.</p>
            <button
              onClick={() => {
                setQuery('');
                setTheme('all');
                setSpace('all');
              }}
              className="text-xs font-display uppercase tracking-[0.2em] underline mt-2"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((artwork, i) => (
              <motion.button
                key={artwork.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(artwork)}
                className={`group relative text-left bg-card border rounded-sm overflow-hidden hover:shadow-soft transition-all ${
                  selected.has(artwork.id)
                    ? 'border-foreground shadow-soft'
                    : 'border-foreground/15 hover:border-foreground/40'
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={artwork.image}
                    alt={artwork.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {selected.has(artwork.id) && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shadow-soft">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                )}
                <div className="p-3">
                  <div className="text-[9px] font-display tracking-[0.2em] uppercase text-muted-foreground mb-1 line-clamp-1">
                    {artwork.theme}
                  </div>
                  <div className="font-display text-sm text-foreground leading-tight line-clamp-1">
                    {artwork.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {artwork.artist}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <ArtworkDetailModal
        artwork={active}
        onClose={() => setActive(null)}
        isSelected={active ? selected.has(active.id) : false}
        onToggleSelect={toggleSelect}
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label className="relative block">
      <span className="absolute left-3 top-1.5 text-[9px] font-display tracking-[0.25em] uppercase text-muted-foreground pointer-events-none">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pt-6 pb-2 px-3 pr-9 bg-card border border-foreground/15 rounded-sm text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'all' ? `All ${label.toLowerCase()}s` : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </label>
  );
}
