import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { strings, type StringKey, type Lang } from './strings';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = 'circle.lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem(STORAGE_KEY) as Lang) || 'en';
  });

  const dir = lang === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang: setLangState,
    dir,
    t: (k) => strings[lang][k] ?? strings.en[k] ?? k,
  }), [lang, dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export function useT() {
  return useLang().t;
}
