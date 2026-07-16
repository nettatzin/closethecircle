-- Anonymous sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sessions TO anon;
GRANT SELECT, INSERT ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert a session" ON public.sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read sessions" ON public.sessions FOR SELECT TO anon, authenticated USING (true);

-- Session events
CREATE TABLE public.session_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_session_events_session ON public.session_events(session_id);
CREATE INDEX idx_session_events_type ON public.session_events(event_type);
GRANT SELECT, INSERT ON public.session_events TO anon;
GRANT SELECT, INSERT ON public.session_events TO authenticated;
GRANT ALL ON public.session_events TO service_role;
ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert events" ON public.session_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read events" ON public.session_events FOR SELECT TO anon, authenticated USING (true);

-- Email captures
CREATE TABLE public.email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  capture_point TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_captures_session ON public.email_captures(session_id);
CREATE INDEX idx_email_captures_email ON public.email_captures(email);
GRANT SELECT, INSERT ON public.email_captures TO anon;
GRANT SELECT, INSERT ON public.email_captures TO authenticated;
GRANT ALL ON public.email_captures TO service_role;
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert email captures" ON public.email_captures FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read email captures" ON public.email_captures FOR SELECT TO anon, authenticated USING (true);
