import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { EmailField } from './EmailField';

const LS_DISMISSED = 'circle_session_end_dismissed';

interface Props {
  open: boolean;
  onClose: () => void;
  /** if true, ignore idle+saved-count guards and just show it (persistent link) */
  force?: boolean;
}

export function SessionEndPrompt({ open, onClose, force }: Props) {
  const { savedIds, markEmailCaptured, hasEmailCaptured } = useSession();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open && !force) localStorage.setItem(LS_DISMISSED, '1');
  }, [open, force]);

  // If not forced, skip when no saves or email already captured
  const suppressed = !force && (hasEmailCaptured || savedIds.length === 0);

  const handleSubmit = (email: string) => {
    markEmailCaptured('session_end', email);
    setConfirming(true);
    window.setTimeout(() => {
      onClose();
      setConfirming(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && !suppressed && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-transparent pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            dir="rtl"
            className="fixed z-50 bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[400px]"
          >
            <div
              className="rounded-sm border shadow-medium p-5 pt-4"
              style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display text-base text-foreground leading-snug">
                  רוצים לקחת את הרשימה איתכם?
                </h3>
                <button
                  onClick={onClose}
                  aria-label="סגור"
                  className="p-1 -m-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {confirming ? (
                <p className="text-sm text-foreground font-sans-thin py-4 text-center">
                  יצא אליכם, נתראה.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4 font-sans-thin leading-relaxed">
                    {savedIds.length > 0
                      ? `שמרתם ${savedIds.length} יוזמות. נשלח לכם אותן במייל כדי שתוכלו לחזור אליהן מתי שנוח.`
                      : 'נשלח לכם את המסלול שהתאמנו לכם כדי שתוכלו לחזור אליו מתי שנוח.'}
                  </p>
                  <EmailField
                    placeholder="האימייל שלך"
                    submitLabel="שלחו לי את הרשימה"
                    onSubmit={handleSubmit}
                  />
                  <button
                    onClick={onClose}
                    className="mt-3 w-full text-center text-[11px] font-display tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    לא, תודה
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
