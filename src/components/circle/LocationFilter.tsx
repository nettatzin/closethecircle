import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/LanguageContext';

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
  const t = useT();
  const radiusOptions = ['5km', '15km', '50km', 'Anywhere'];
  const reachOptions = [
    { id: 'israel', label: t('israel_based') },
    { id: 'global', label: t('international') }
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
          {t('in_person')}
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
          {t('online')}
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
              {t('physical_activities')}
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-muted-foreground block mb-1.5">{t('near_label')}</label>
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
              {t('digital_activities')}
            </div>
            <div className="text-xs text-muted-foreground mb-2">{t('reach_label')}</div>
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