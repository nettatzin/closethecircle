# Architecture, Stack & Version Management — Close the Circle

**Status:** Ratified decisions + repo conventions. No open SQL.
**Date:** 2026-07-15

---

## 1. Architecture (V1)

```
Visitor (mobile web, QR entry)
   │
   ▼
Lovable app  ── React 18 + Vite + TS + Tailwind + shadcn/ui + framer-motion
   │  supabase-js (anon key)
   ▼
Supabase EXAI (qjqqyvpqkbljngmhxahl)
   ├─ v_activities (VIEW)  ← global_initiatives ∪ facebook_communities
   ├─ financial_benefits   ← Cashback tab (live, seeded)
   ├─ sessions / saves / emails / events   ← visitor layer (functional spec)
   └─ RLS = the entire security boundary (anon: read views, insert-only visitor rows)
   
   └─ edge function: climate-vibes (Gemini via Lovable AI gateway) — KEEP for now, removal candidate

Curation side (never through the app):
   n8n pipeline → global_initiatives (discovery + classification)
   Claude skills → artwork tables (V2)
   Supabase dashboard / service role → review, email export, analytics
```

Principles:
- **No backend of our own.** The app is static + supabase-js. Every server-side need is either a view, an RLS policy, or (rarely) an edge function.
- **The view is the API.** UI never touches base tables; schema evolution happens behind `v_activities`.
- **Writes from visitors are append-only** (sessions, saves, emails, events). No visitor-originated mutation of content, ever.
- **Two Supabase projects exist** — EXAI is canonical for exhibition data; Lovable's auto-project (`tczfbbsydmbmktspghaz`) is a dummy used for prototyping. App repoints to EXAI at V1.1 (env change + regenerate types).
- **Bilingual by column**, Hebrew display layer, English snake_case vocabularies (locked convention).

## 2. Stack decisions ratified

| Layer | Decision | Note |
|---|---|---|
| Hosting | Lovable (its default hosting) | revisit only if custom domain/analytics need more |
| Data fetch | fetch-once + client filter (D5) | 362 rows; react-query optional wrapper |
| Types | `supabase gen types` from EXAI, committed | regenerate on every schema change |
| Live LLM | climate-vibes stays (Netta 2026-07-15) | flagged removal candidate; contradicts component-library principle |
| i18n | strings.ts (UI) + `_he` columns (content) + vocabDisplay.ts (tags) | activities.he.ts deleted at V1.3 |
| Analytics | events table, no third-party tracker | privacy stance: no PII, no fingerprinting |

## 3. Repo & version management

```
closethecircle/
├─ docs/                          ← source of truth, travels with code
│  ├─ ui_spec.md                  (v1.0 extracted 2026-07-15)
│  ├─ data_contract_spec.md       (v1.1)
│  ├─ v1_functional_spec.md
│  ├─ architecture.md             (this doc)
│  ├─ n8n_draws_prompt_addition.md (backlog)
│  └─ CHANGELOG.md
├─ src/ ...
└─ .env.example                   ← .env leaves git (do at V1.1 repoint)
```

- **Branches:** `main` = deployed (Lovable syncs two-way with main). Feature branches per work item (`feat/v11-data-connection`, `feat/v12-email-capture`...). Lovable edits land as commits — treat Lovable-side edits as another committer and pull before local work.
- **Tags:** `v1.1-data`, `v1.2-email`, `v1.3-hebrew`, `v2.0-artworks` at each milestone ship.
- **Docs versioning:** version header inside each doc + CHANGELOG entry per change. Docs updated in the same PR as the code they describe.
- **DB versioning:** every schema change through `apply_migration` (named migrations — `add_draws_column_initiatives_and_fb` and `create_financial_benefits_table`-equivalent already logged; note the financial_benefits DDL ran via execute_sql after an approval hiccup, so it is NOT in the migrations list — backfill a no-op migration record for it or accept the gap, decision D10).
- **Linear:** work items per milestone below; bugs as S-series (existing convention).

## 4. V1 milestones → Linear-sized chunks

**V1.1 — Data connection** (depends on: nothing)
1. RLS anon read policies on both initiative tables
2. `CREATE VIEW v_activities`
3. Repoint `.env` to EXAI, regenerate types, `.env` → `.env.example`
4. UI: replace mock imports with view query; filter mappings (energy/format/region); draws filter wiring
5. Filter refinement per data contract §2 + tag tiers §3a — **after the label design session**
6. Cashback tab reads `financial_benefits` (table already live)

**V1.2 — Sessions, saves, email, events** (depends on: V1.1 §1–4)
7. sessions + events tables, policies, client UUID hook, close_circle + share events
8. saves table + counts + card wiring
9. Email touchpoints T1–T3 (copy through curator review)

**V1.3 — Hebrew** (depends on: V1.1 §1–3; parallel to V1.2)
10. `_he` columns migration + translation run + validation (one session)
11. Curator review cycle + reviewed flip
12. App language-aware select; delete activities.he.ts

**V2 — Artworks** (separate spec)
13. Artwork data contract (score-based matching), ArtworksView rewire, artwork filter activation

**Backlog:** n8n classifier prompt update (draws), climate-vibes keep/kill decision, ImpactView real data, LocationFilter geo, hidden-costs exhibition layer.

## 5. Open decisions carried

| # | Decision | Owner |
|---|---|---|
| D1 | Curation status gate in v_activities | Netta — before V1.1 §2 |
| D6 | Machine translations visible pre-review | Curators — before V1.3 §12 |
| D8 | Email delivery method | Netta — before exhibition close |
| D10 | Backfill migration record for financial_benefits | Netta — housekeeping |
