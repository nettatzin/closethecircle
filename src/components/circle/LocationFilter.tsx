import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  locationFormat: string[];
  toggleFormat: (format: string) => void;
  physicalLocation: string;
  setPhysicalLocation: (location: string) => void;
  physicalRadius: string;
  setPhysicalRadius: (radius: string) => void;
  digitalReach: string[];
  toggleDigitalReach: (reach: string) => void;
}

export function LocationFilter({
  locationFormat,
  toggleFormat,
  physicalLocation,
  setPhysicalLocation,
  physicalRadius,
  setPhysicalRadius,
  digitalReach,
  toggleDigitalReach,
}: LocationFilterProps) {
  const radiusOptions = ['5km', '15km', '50km', 'Anywhere'];
  const reachOptions = [
    { id: 'israel', label: '🇮🇱 Israel-based' },
    { id: 'global', label: '🌍 International' }
  ];

  return (
    <div className="space-y-4">
      {/* Format toggles */}
      <div className="flex gap-3">
        <motion.button
          onClick={() => toggleFormat('physical')}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all',
            locationFormat.includes('physical')
              ? 'border-primary bg-primary/15 text-foreground'
              : 'border-border/40 bg-card text-muted-foreground'
          )}
        >
          📍 In Person
        </motion.button>
        <motion.button
          onClick={() => toggleFormat('digital')}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all',
            locationFormat.includes('digital')
              ? 'border-primary bg-primary/15 text-foreground'
              : 'border-border/40 bg-card text-muted-foreground'
          )}
        >
          🌐 Online
        </motion.button>
      </div>

      <div className={cn(
        'grid gap-4',
        locationFormat.includes('physical') && locationFormat.includes('digital')
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1'
      )}>
        {/* Physical location */}
        {locationFormat.includes('physical') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary/5 rounded-xl border border-primary/20"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Physical Activities
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-muted-foreground block mb-1.5">Near:</label>
              <select 
                value={physicalLocation}
                onChange={(e) => setPhysicalLocation(e.target.value)}
                className="w-full p-2.5 rounded-lg border-2 border-border/40 bg-card text-foreground text-sm"
              >
                <option>Tel Aviv</option>
                <option>Jerusalem</option>
                <option>Haifa</option>
                <option>Be'er Sheva</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Within:</label>
              <div className="flex gap-1.5">
                {radiusOptions.map(radius => (
                  <button
                    key={radius}
                    onClick={() => setPhysicalRadius(radius)}
                    className={cn(
                      'flex-1 py-1.5 px-2 rounded-md text-xs font-bold border-2 transition-all',
                      physicalRadius === radius
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border/40 text-muted-foreground'
                    )}
                  >
                    {radius}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Digital reach */}
        {locationFormat.includes('digital') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary/5 rounded-xl border border-primary/20"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Digital Activities
            </div>
            <div className="text-xs text-muted-foreground mb-2">Reach:</div>
            <div className="space-y-2">
              {reachOptions.map(reach => (
                <label
                  key={reach.id}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all',
                    digitalReach.includes(reach.id) ? 'bg-primary/10' : ''
                  )}
                >
                  <input
                    type="checkbox"
                    checked={digitalReach.includes(reach.id)}
                    onChange={() => toggleDigitalReach(reach.id)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={cn(
                    'text-sm',
                    digitalReach.includes(reach.id) ? 'font-bold text-foreground' : 'text-muted-foreground'
                  )}>
                    {reach.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}