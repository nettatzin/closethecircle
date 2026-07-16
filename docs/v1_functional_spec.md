# V1 Functional Spec — Close the Circle

**Covers:** Supabase data connection (delta from data contract), email capture, anonymous sessions & saves, close-circle tracking, Hebrew translation workflow.
**Depends on:** Data Contract Spec v1.1 (view, RLS, tag tiers).
**Status:** PROPOSAL — all SQL for review, nothing executed.
**Date:** 2026-07-15

---

## 1. Anonymous sessions (foundation — build first)

Every visitor gets a UUID on first load, stored in `localStorage['circle.session']` and registered in Supabase. This is the identity spine for saves, analytics, and email linkage — 100% coverage, zero friction, independent of email capture.

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY,                      -- client-generated UUID
  created_at timestamptz DEFAULT now(),
  lang text,                                -- 'en' / 'he' at creation
  entry_source text,                        -- 'qr' / 'direct' / 'shared_link'
  user_agent_hint text                      -- coarse device class only, no fingerprinting
);
```

Client flow: on load → UUID exists in localStorage? reuse : generate → upsert row. All subsequent writes carry `session_id`.

Privacy stance: no PII in this table, ever. Email lives in its own table (§3) and is *linked*, not merged.

## 2. Saves

The "save for later" action on an activity card.

```sql
CREATE TABLE saves (
  session_id uuid NOT NULL REFERENCES sessions(id),
  activity_id uuid NOT NULL,                -- id from v_activities (either base table)
  source_table text NOT NULL,               -- 'initiative' / 'facebook_community'
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (session_id, activity_id)
);
```

- Card save count = `COUNT(*)` per activity (replaces the mock's static `saves` number). Cache client-side; exact freshness doesn't matter.
- Unsave = DELETE own row (policy-scoped to own session_id).
- Saved list view reads the visitor's own saves joined to `v_activities`.

## 3. Email capture — three touchpoints

```sql
CREATE TABLE emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id),
  email text NOT NULL,
  touchpoint text NOT NULL,                 -- 'early_popup' / 'first_save' / 'session_end'
  lang text,
  consented_updates boolean DEFAULT false,  -- explicit checkbox, unchecked by default
  created_at timestamptz DEFAULT now(),
  UNIQUE (session_id, email)
);
```

### T1 — Early soft popup (the rescue moment)
- Trigger: 3–5s after first load from QR entry. Once per session, never re-shown after dismissal (flag in localStorage).
- Framing: **"hold this for later"** — not a signup. The visitor is mid-exhibition and about to close the tab; the offer is "we'll send you this app so you can come back."
- Anatomy: one email field + send + prominent, easy dismiss ("later" / לא עכשיו). Dismissal is frictionless and unpunished.
- Copy: bilingual, drafted separately, **curator review required before launch** (same gate as tag labels).

### T2 — Inline at first save
- Trigger: the visitor's first save action, inline near the saved card (not a modal).
- Framing: "want your saved list sent to you?"
- Shown once; if T1 already captured an email, T2 never shows.

### T3 — Session end
- Trigger: engaged sessions only (≥1 save OR ≥1 close-circle OR ≥90s active), on visibility-change/exit-intent, and only if no email captured yet.
- Framing: "take the circle with you."
- Hard cap: a visitor sees at most **2 email asks per session** total across T1–T3.

Email delivery itself (the actual "send me the app" mail) is out of V1 app scope — capture now, send via manual export or a later automation. **D8 (decision):** transactional email provider or manual batch for the exhibition period.

## 4. Close-circle tracking (conversion event)

The outbound click is the app's single conversion. Track it:

```sql
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id uuid REFERENCES sessions(id),
  event_type text NOT NULL,                 -- 'close_circle' / 'filter_change' / 'tab_switch' / 'email_shown' / 'email_dismissed'
  activity_id uuid,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

Minimum V1 events: `close_circle` (with activity_id), `share` (see below), `email_shown`/`email_captured`/`email_dismissed` (with touchpoint in payload). Filter analytics optional. This table is also where the ImpactView eventually gets *real* numbers instead of client-side fiction.

### Share tracking
Every share-button tap logs a `share` event recording **which channel** and **what was shared**:

```json
{ "event_type": "share",
  "activity_id": "<uuid or null>",
  "payload": { "channel": "whatsapp | native_share | copy_link | instagram | other",
               "target": "activity | app | saved_list | artwork" } }
```

- Web Share API (`navigator.share`) reports as `native_share` — the OS doesn't reveal the final channel, so explicit in-app channel buttons (WhatsApp / copy link) log precisely, native sheet logs as one bucket. If per-channel data matters, prefer explicit buttons over the native sheet in the design.
- Log on tap (intent), not on completion — completion isn't reliably detectable.
- No content or recipient data is recorded, only channel + target.

## 5. RLS for the new tables

Anon key permissions — insert-heavy, read-minimal:

| Table | anon INSERT | anon SELECT | anon DELETE |
|---|---|---|---|
| sessions | own row (id = client UUID) | none needed | no |
| saves | own session only | own session only | own session only |
| emails | own session only | **no** (write-only from client) | no |
| events | own session only | no | no |

Aggregate save counts exposed via a security-definer function or a public counts view (`activity_id, count`) so individual saves stay private. Curator-side reads (email export, analytics) happen with the service role in the dashboard, never through the app.

## 6. Hebrew translation — full run plan

UI strings already bilingual (`strings.ts`). This covers the 362 content rows (276 initiatives + 86 FB communities), 4 fields each: `name_he`, `description_he`, `how_to_join_he`, `visitor_action_he`.

### Step 0 — Schema (one migration, both tables)
```sql
ALTER TABLE global_initiatives
  ADD COLUMN name_he text, ADD COLUMN description_he text,
  ADD COLUMN how_to_join_he text, ADD COLUMN visitor_action_he text,
  ADD COLUMN translation_status text DEFAULT 'pending';
-- identical for facebook_communities
```

### Step 1 — Split the population (SQL, deterministic)
- **Hebrew-native rows** (`name ~ '[א-ת]'` — most FB communities + Israeli initiatives, est. ~100 rows): copy `name → name_he` as-is; only `description/how_to_join/visitor_action` get translated **if** they're in English. Never round-trip Hebrew through English.
- **English rows** (~260): all 4 fields translated.

### Step 2 — Batch translation run (in-chat, same pattern as draws backfill)
- Batches of ~15 rows (translation output is long — smaller than the draws batches).
- Translation register: **spoken, warm, museum-visitor Hebrew** — not literal. Names of organizations stay in their original form (ENVA stays ENVA; "Repair Café" stays recognizable), with Hebrew descriptor added only when natural. `visitor_action_he` keeps the one-verb imperative style (הצטרפו, הביאו, אמצו).
- Writes carry `translation_status = 'machine'`.
- Idempotent: run filters `WHERE translation_status = 'pending'` — crashes resume cleanly.
- Est. ~25 batches, one working session.

### Step 3 — Deterministic validation gate (before any status flip)
- All 4 `_he` fields non-empty for translated rows
- HE fields actually contain Hebrew characters (`~ '[א-ת]'`)
- Length ratio sanity: 0.4× – 2.5× of source
- No leaked instruction text / markdown fences
- Failures → `translation_status` stays `'pending'`, row listed for manual handling

### Step 4 — Curator review
- Export: `SELECT name, name_he, description, description_he, ... WHERE translation_status='machine'` → xlsx for review (you + Lior/Talia).
- Corrections applied via batch UPDATE; approved rows flip to `'reviewed'`.
- **D6 (open):** whether HE users see `'machine'` rows before review, or strict `'reviewed'`-only with EN fallback. One flag in the app either way.

### Step 5 — Wire-up
- Add the 5 columns to `v_activities`; app selects `_he` with EN fallback per field (NULL-safe `COALESCE`).
- Kills `activities.he.ts`; `useDataset` becomes a language-aware select.

**Timing:** steps 0–3 are one session with me; step 4 is your review pace; step 5 is app work. Recommended slot: after the view + RLS land (data contract §9 steps 1–3), before email touchpoints — content completeness beats capture features.

## 7. Acceptance criteria (V1 ship gate)

- [ ] App reads live data from `v_activities` on EXAI; all filters work; zero filters selected shows everything
- [ ] Filters remain fully optional at every entry path
- [ ] Session UUID created and persisted; survives reload; new on cleared storage
- [ ] Save/unsave round-trips; count displays; saved list renders
- [ ] T1 popup: once, dismissible, never re-shown after dismissal; T2/T3 respect the 2-ask cap
- [ ] Email rows land with correct touchpoint + consent flag; not readable via anon key
- [ ] close_circle events recorded with activity_id
- [ ] share events recorded with channel + target on every share-button tap
- [ ] HE mode: content from `_he` columns with EN fallback; RTL intact on all new UI
- [ ] Tag tiers per data contract §3a — pending the label design session
- [ ] Cashback tab reads from `financial_benefits`

## 8. Decisions

| # | Decision | Recommendation |
|---|---|---|
| D6 | Machine translations shown pre-review | Curator call; flag supports both |
| D8 | Email delivery: provider vs manual batch | Manual batch export is fine for exhibition scale; revisit if volume surprises |
| D9 | events table scope | Ship with close_circle + email events only; add filter analytics if curiosity demands |

## 9. Build order

1. Sessions table + policies + client UUID hook
2. Saves + counts view + card wiring
3. Events (close_circle + email events)
4. Email touchpoints T1 → T2 → T3 (copy through curator review)
5. Hebrew schema + translation run + review export
6. `financial_benefits` seed + Cashback rewire (data contract §7b)
