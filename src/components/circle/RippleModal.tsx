import { motion, AnimatePresence } from 'framer-motion';
import type { Activity } from '@/data/activities';

interface RippleModalProps {
  mode: false | 'community' | 'ripple';
  activity: Activity | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function RippleModal({ mode, activity, onConfirm, onClose }: RippleModalProps) {
  if (!mode || !activity) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'var(--gradient-overlay)', backdropFilter: 'blur(10px)' }}
      >
        {mode === 'community' ? (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass rounded-3xl p-8 max-w-md w-full text-center border-2 border-primary/30"
          >
            <motion.div 
              className="text-5xl mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ↻
            </motion.div>
            
            <p className="text-foreground text-lg leading-relaxed mb-6">
              This circle exists because
              <br />
              others closed circles before
            </p>
            
            <motion.button
              onClick={onConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-xl font-bold text-base mb-4 shadow-glow"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              Close this circle →
            </motion.button>
            
            <p className="text-primary font-bold text-sm flex items-center justify-center gap-2">
              <span className="text-lg">↻</span>
              Your turn keeps it growing
            </p>
          </motion.div>
        ) : (
          <div className="relative text-center">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-48 h-48 -ml-24 -mt-24 border-2 border-primary/60 rounded-full"
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: 'easeOut'
                }}
              />
            ))}
            
            <motion.div 
              className="relative z-10 text-5xl text-primary-foreground mb-4"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              ↻
            </motion.div>
            
            <p className="relative z-10 text-primary-foreground text-xl font-bold">
              Every circle you close
              <br />
              opens new ones
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}