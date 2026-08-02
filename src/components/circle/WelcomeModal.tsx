import { motion, AnimatePresence } from 'framer-motion';
import { EllipseLine, SpiralLine } from './LineArt';
import { useT } from '@/i18n/LanguageContext';
import museumVideo from '@/assets/museum-video.mp4.asset.json';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const t = useT();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-background"
          dir="rtl"
        >
          <SpiralLine className="absolute -top-16 -left-16 w-64 h-64 opacity-[0.07] pointer-events-none" />

          <div className="min-h-full w-full flex flex-col items-center justify-center px-5 py-5 md:py-6 gap-3 md:gap-4 max-w-2xl mx-auto text-center">
            <div className="relative h-20 md:h-24 flex items-center justify-center shrink-0">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <EllipseLine className="w-28 h-28 md:w-36 md:h-36 opacity-80" strokeWidth={0.5} />
              </motion.div>
              <span className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-foreground relative">
                {t('app_title')}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-2 md:space-y-3"
            >
              <h1 className="font-display text-xl md:text-3xl text-foreground leading-snug">
                המעגל לא מסתיים במוזיאון. ואתן ואתם - כבר בתוכו.
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                המתנות שאספתם עדיין טריות. כאן תבחרו איך הן נכנסות לחיים שלכם - בזמן שלכם. בקצב שלכם. במקום שלכם.
              </p>
              <p className="text-foreground text-sm md:text-base italic leading-relaxed">
                וזה מה שהמעגל מחזיר: חיבור, ריפוי, ושגשוג.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full max-w-xl rounded-sm overflow-hidden border border-foreground/15"
            >
              <video
                src={museumVideo.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto max-h-[28vh] md:max-h-[30vh] object-cover"
              />
            </motion.div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full max-w-sm py-3 px-6 rounded-sm font-display text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              {t('start_exploring')}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
