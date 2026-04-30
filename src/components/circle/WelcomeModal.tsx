import { motion, AnimatePresence } from 'framer-motion';
import { EllipseLine, SpiralLine } from './LineArt';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'var(--gradient-overlay)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background rounded-sm p-10 max-w-md w-full text-center border border-foreground/20 relative overflow-hidden"
          >
            <SpiralLine className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.08] pointer-events-none" />

            <div className="relative h-20 mb-8 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <EllipseLine className="w-24 h-24 opacity-80" strokeWidth={0.6} />
              </motion.div>
              <span className="font-display text-[10px] tracking-[0.3em] uppercase text-foreground relative">The Circle</span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-5 leading-tight tracking-wide">
              The exhibition sparked it.
              <br />
              You keep it alive.
            </h2>

            <p className="text-muted-foreground text-sm italic mb-8 max-w-xs mx-auto leading-relaxed">
              Every circle you close opens new ones
            </p>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 px-8 rounded-sm font-display text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Start exploring
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
