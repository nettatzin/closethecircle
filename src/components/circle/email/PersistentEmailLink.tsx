import { useState } from 'react';
import { SessionEndPrompt } from './SessionEndPrompt';

export function PersistentEmailLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          'text-sm font-display tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-dotted transition-colors'
        }
        dir="rtl"
      >
        שלחו לי את זה למייל
      </button>
      <SessionEndPrompt open={open} onClose={() => setOpen(false)} force />
    </>
  );
}
