import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnergyCardProps {
  icon: string;
  label: string;
  time: string;
  selected: boolean;
  onClick: () => void;
}

export function EnergyCard({ icon, label, time, selected, onClick }: EnergyCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full min-w-0 p-3 rounded-sm text-center border transition-all relative overflow-hidden flex flex-col items-center justify-center',
        selected
          ? 'border-foreground bg-foreground text-background'
          : 'border-foreground/20 bg-transparent text-foreground hover:border-foreground/50'
      )}
    >
      <div className="text-xl mb-1.5 opacity-90">{icon}</div>
      <div className="font-display text-[11px] leading-tight tracking-[0.08em] uppercase mb-1">{label}</div>
      <div className={cn('text-[9px] italic leading-tight', selected ? 'text-background/70' : 'text-muted-foreground')}>
        {time}
      </div>
    </motion.button>
  );
}
