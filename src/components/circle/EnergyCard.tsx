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
        'flex-1 min-w-[140px] p-4 rounded-2xl text-left border-2 transition-all',
        selected 
          ? 'border-primary bg-primary/15' 
          : 'border-border/40 bg-card hover:border-primary/50 hover:shadow-soft'
      )}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-bold text-foreground mb-0.5">{label}</div>
      <div className="text-xs text-muted-foreground italic">{time}</div>
    </motion.button>
  );
}