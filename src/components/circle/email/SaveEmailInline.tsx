import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { EmailField } from './EmailField';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function SaveEmailInline({ visible, onDismiss }: Props) {
  const { markEmailCaptured, hasEmailCaptured } = useSession();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => onDismiss(), 12_000);
    return () => window.clearTimeout(t);
  }, [visible, onDismiss]);

  const handleSubmit = (email: string) => {
    markEmailCaptured('first_save', email);
    setConfirming(true);
    window.setTimeout(() => {
      onDismiss();
      setConfirming(false);
    }, 1600);
  };

  return (
    <AnimatePresence>
      {visible && !hasEmailCaptured && (
        <motion.div
          initial={{ opacity: 0, y: 8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 8, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          dir="rtl"
          className="overflow-hidden"
        >
          <div
            className="mx-auto max-w-lg my-3 rounded-sm border p-4"
            style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm text-foreground font-sans-thin leading-relaxed flex-1">
                {confirming ? 'נשלח.' : 'שמרנו את זה בשבילך. רוצה שנשלח גם למייל, ליתר ביטחון?'}
              </p>
              <button
                onClick={onDismiss}
                aria-label="סגור"
                className="p-1 -m-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {!confirming && (
              <>
                <EmailField
                  placeholder="האימייל שלך"
                  submitLabel="כן, שלחו"
                  onSubmit={handleSubmit}
                />
                <button
                  onClick={onDismiss}
                  className="mt-2 w-full text-center text-[11px] font-display tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  לא צריך
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
