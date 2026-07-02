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
        'w-full min-w-0 p-4 rounded-sm text-left border transition-all relative overflow-hidden',
        selected
          ? 'border-foreground bg-foreground text-background'
          : 'border-foreground/20 bg-transparent text-foreground hover:border-foreground/50'
      )}
    >
      <div className="text-2xl mb-2 opacity-90">{icon}</div>
      <div className="font-display text-sm tracking-[0.1em] uppercase mb-1">{label}</div>
      <div className={cn('text-[10px] italic', selected ? 'text-background/70' : 'text-muted-foreground')}>{time}</div>
    </motion.button>
  );
}
