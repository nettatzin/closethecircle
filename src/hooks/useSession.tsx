import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type EventType =
  | 'session_start'
  | 'filter_set'
  | 'initiative_view'
  | 'initiative_save'
  | 'initiative_unsave'
  | 'initiative_share'
  | 'results_scroll_depth'
  | 'email_captured'
  | string;

interface SessionCtx {
  sessionId: string;
  logEvent: (eventType: EventType, payload?: Record<string, unknown>) => void;
  hasEmailCaptured: boolean;
  markEmailCaptured: (point: string, email: string) => void;
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => { saved: boolean; wasFirst: boolean };
  registerActivity: () => void;
  onIdle: (fn: () => void) => () => void;
}

const SessionContext = createContext<SessionCtx | null>(null);

const LS = {
  sessionId: 'circle_session_id',
  saved: 'circle_saved_ids',
  emailCaptured: 'circle_email_captured',
  firstSaveShown: 'circle_first_save_shown',
};

function uuidv4() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return uuidv4();
    let id = localStorage.getItem(LS.sessionId);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(LS.sessionId, id);
      // DUMMY: would INSERT into public.sessions { id, user_agent }
      console.log('[session] new session', id, navigator.userAgent);
    }
    return id;
  });

  const [hasEmailCaptured, setHasEmailCaptured] = useState<boolean>(() =>
    typeof window !== 'undefined' && localStorage.getItem(LS.emailCaptured) === '1'
  );

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(LS.saved) || '[]');
    } catch {
      return [];
    }
  });

  const idleListeners = useRef<Set<() => void>>(new Set());
  const idleTimer = useRef<number | null>(null);

  const logEvent = useCallback<SessionCtx['logEvent']>((eventType, payload) => {
    // DUMMY: would INSERT into public.session_events { session_id, event_type, payload }
    console.log('[event]', eventType, payload ?? {});
  }, []);

  const registerActivity = useCallback(() => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      idleListeners.current.forEach((fn) => fn());
    }, 90_000);
  }, []);

  const onIdle = useCallback((fn: () => void) => {
    idleListeners.current.add(fn);
    return () => {
      idleListeners.current.delete(fn);
    };
  }, []);

  const markEmailCaptured = useCallback((point: string, email: string) => {
    setHasEmailCaptured(true);
    localStorage.setItem(LS.emailCaptured, '1');
    // DUMMY: would INSERT into public.email_captures { session_id, email, capture_point }
    console.log('[email_capture]', { point, email, sessionId });
    logEvent('email_captured', { point });
  }, [logEvent, sessionId]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback<SessionCtx['toggleSave']>((id) => {
    let wasFirst = false;
    let nowSaved = false;
    setSavedIds((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(LS.saved, JSON.stringify(next));
      nowSaved = !has;
      if (nowSaved) {
        const shown = localStorage.getItem(LS.firstSaveShown) === '1';
        if (!shown && prev.length === 0) wasFirst = true;
      }
      return next;
    });
    logEvent(nowSaved ? 'initiative_save' : 'initiative_unsave', { id });
    return { saved: nowSaved, wasFirst };
  }, [logEvent]);

  // session_start on mount + kick off idle timer
  useEffect(() => {
    logEvent('session_start');
    registerActivity();
    const bump = () => registerActivity();
    window.addEventListener('scroll', bump, { passive: true });
    window.addEventListener('touchstart', bump, { passive: true });
    window.addEventListener('click', bump);
    window.addEventListener('keydown', bump);
    return () => {
      window.removeEventListener('scroll', bump);
      window.removeEventListener('touchstart', bump);
      window.removeEventListener('click', bump);
      window.removeEventListener('keydown', bump);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // throttled scroll depth
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      const bucket = Math.floor(pct / 25) * 25;
      if (bucket > last && bucket > 0) {
        last = bucket;
        logEvent('results_scroll_depth', { pct: bucket });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [logEvent]);

  const value = useMemo<SessionCtx>(
    () => ({
      sessionId,
      logEvent,
      hasEmailCaptured,
      markEmailCaptured,
      savedIds,
      isSaved,
      toggleSave,
      registerActivity,
      onIdle,
    }),
    [sessionId, logEvent, hasEmailCaptured, markEmailCaptured, savedIds, isSaved, toggleSave, registerActivity, onIdle]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionCtx {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

export function markFirstSaveShown() {
  localStorage.setItem(LS.firstSaveShown, '1');
}
export function wasFirstSaveShown() {
  return localStorage.getItem(LS.firstSaveShown) === '1';
}
