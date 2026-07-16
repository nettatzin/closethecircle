import { useState, type FormEvent } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  placeholder: string;
  submitLabel: string;
  onSubmit: (email: string) => void;
  autoFocus?: boolean;
}

export function EmailField({ placeholder, submitLabel, onSubmit, autoFocus }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!EMAIL_RE.test(v)) {
      setError(true);
      return;
    }
    onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" dir="rtl">
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(false);
        }}
        placeholder={placeholder}
        aria-invalid={error}
        className="w-full px-4 py-3 rounded-sm border bg-background text-foreground placeholder:text-muted-foreground/60 font-sans-thin text-sm focus:outline-none transition-colors"
        style={{
          borderColor: error ? 'hsl(12 42% 48%)' : 'hsl(var(--border))',
        }}
      />
      <button
        type="submit"
        className="w-full py-3 rounded-sm font-display text-[11px] tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}
