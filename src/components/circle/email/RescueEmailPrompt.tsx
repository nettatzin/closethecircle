import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { EmailField } from './EmailField';

const LS_DISMISSED = 'circle_rescue_dismissed';

export function RescueEmailPrompt() {
  const { hasEmailCaptured, markEmailCaptured } = useSession();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(LS_DISMISSED) === '1') return;
    if (hasEmailCaptured) return;
    const t = window.setTimeout(() => {
      if (localStorage.getItem(LS_DISMISSED) !== '1' && !hasEmailCaptured) {
        setOpen(true);
      }
    }, 3000);
    return () => window.clearTimeout(t);
  }, [hasEmailCaptured]);

  const dismiss = () => {
    localStorage.setItem(LS_DISMISSED, '1');
    setOpen(false);
  };

  const handleSubmit = (email: string) => {
    markEmailCaptured('rescue', email);
    setConfirming(true);
    window.setTimeout(() => {
      dismiss();
      setConfirming(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            onClick={dismiss}
          />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
          dir="rtl"
        >
         <div className="pointer-events-auto w-full max-w-[420px]">
          <div
            className="rounded-sm border shadow-medium p-5 pt-4"
            style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-display text-base text-foreground leading-snug">
                לא עכשיו? נשמור לך את זה לרגע שכן
              </h3>
              <button
                onClick={dismiss}
                aria-label="סגור"
                className="p-1 -m-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirming ? (
              <p className="text-sm text-foreground font-sans-thin py-4 text-center">
                תודה, שלחנו לך. תיהנו מהתערוכה.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4 font-sans-thin leading-relaxed">
                  נשלח לך את המסלול שהתאמנו לך למייל. תוכל/י לחזור אליו מתי שנוח.
                </p>
                <EmailField
                  placeholder="האימייל שלך"
                  submitLabel="שלחו לי, אני חוזר/ת אחר כך"
                  onSubmit={handleSubmit}
                />
                <button
                  onClick={dismiss}
                  className="mt-3 w-full text-center text-[11px] font-display tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  אני כאן עכשיו, קדימה
                </button>
              </>
            )}
          </div>
         </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
