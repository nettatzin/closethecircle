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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'flex items-center gap-2 rounded-full font-sans-thin transition-all border',
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm',
        selected
          ? 'border-foreground bg-foreground text-background'
          : 'border-foreground/25 bg-transparent text-foreground hover:border-foreground/60'
      )}
    >
      {icon && <span className={size === 'sm' ? 'text-sm' : 'text-base'}>{icon}</span>}
      <span className="tracking-wide">{label}</span>
    </motion.button>
  );
}
