import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  icon?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function FilterChip({ icon, label, selected, onClick, size = 'md' }: FilterChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'flex items-center gap-2 rounded-full font-normal transition-all border-2',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-sm',
        selected 
          ? 'border-primary bg-primary/15 text-foreground font-bold' 
          : 'border-border/40 bg-card text-muted-foreground hover:border-primary/50 hover:shadow-soft'
      )}
    >
      {icon && <span className={size === 'sm' ? 'text-base' : 'text-lg'}>{icon}</span>}
      {label}
    </motion.button>
  );
}