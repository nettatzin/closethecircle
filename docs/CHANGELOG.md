# CHANGELOG — Close the Circle

All notable changes to specs, schema, and data. Newest first.
Convention: every docs/ or schema change gets an entry. Version headers live inside each doc; history lives here and in git.

---

## 2026-07-16

- **D4 clarified (Netta):** artwork filter section stays VISIBLE in V1 with the 6 mock artworks; selections have NO impact on results (excluded from matching). ARTWORKS tab keeps mock data + images untouched. Real artwork filtering in V2. Supersedes "inactive/hidden" phrasing. data_contract_spec updated; Linear S-65/S-73 carry the build implication (split artworks out of activities.ts/activities.he.ts before replacing activity data).
- **Docs moved into repo** at `docs/` (7 files); version suffixes dropped from filenames.
- **supabase_schema_documentation.md v1.1** — added draws columns, financial_benefits, planned-tables note, per-table anon-policy state.

---

## 2026-07-15

### Docs
- **ui_spec.md v1.0** — created. As-built extraction from Lovable repo: stack, IA, mock data model, filter logic, design system, gap map, flags (Supabase project mismatch, climate-vibes live LLM, draws gap, fabricated ImpactView numbers, .env in git).
- **data_contract_spec.md v1.0 → v1.1** — created, then revised same day:
  - v1.0: `v_activities` UNION view, filter contracts (draws/energy/where/artworks), card field mapping, RLS contract, query shape, Hebrew layer contract, V2 artwork matching direction, decisions D1–D6.
  - v1.1: format added to mandatory tag tier; §3a tag display tiers locked (mandatory / visible / expanded); label structure locked (titled groups: impact + activity type; untitled tags with design differentiator: rest); design gate added (label visuals require session with Netta before UI work); D4 resolved (artwork filter kept, wired in V2, dormant in V1 — all filters optional, always); D7 resolved (cost in expanded tier); §7b `financial_benefits` table spec added.
- **v1_functional_spec.md** — created: sessions/saves/emails/events tables + RLS, email touchpoints T1–T3 (2-ask cap), share tracking (channel + target, log on tap), close_circle conversion event, full Hebrew translation run plan (5 steps, register definition, Hebrew-native row protection), acceptance criteria, D6/D8/D9.
- **architecture.md** — created: architecture diagram, stack ratifications (fetch-once D5, climate-vibes stays for now, no own backend, view-is-the-API), repo/versioning conventions (this file), V1 milestone breakdown (13 items), open decisions D1/D6/D8/D10.
- **n8n_draws_prompt_addition.md** — created: paste-ready DRAWS block for `Message a model1` classifier prompt (workflow Vnoy1WxaEQrOwwJT). BACKLOG per Netta — apply only after V1 wraps (Linear S-75).

### Schema (Supabase EXAI)
- **`draws text[]` added** to `global_initiatives` and `facebook_communities` (migration `add_draws_column_initiatives_and_fb`).
- **`financial_benefits` table created + seeded** — 7 Israeli financial-benefit services, fully bilingual (EN/HE columns), benefit_type vocabulary (improved_terms / alternative_currency / discount / income_generation), RLS enabled, anon SELECT policy on `is_active = true`. ⚠️ Ran via execute_sql after approval hiccup — not in migrations list (D10: backfill record or accept gap).

### Data
- **Draws backfill complete**: 362/362 rows classified (276 global_initiatives + 86 facebook_communities), multi-label, 6-value locked vocabulary. Validation passed: 0 missing, 0 out-of-vocabulary. Distribution: explore 172, make 148, meet 176, exchange 90, amplify 45, witness 34 (combined).

### Tracking (Linear, S-p-a-c-e / EXAI)
- Created S-62–S-67 (V1.1 data connection), S-68–S-70 (V1.2 sessions/saves/email), S-71–S-73 (V1.3 Hebrew), S-74 (V2 artworks), S-75 (backlog: n8n draws prompt). Blocking relations wired; critical path S-62 → S-63 → S-64 → S-65.

### Decisions log
- Dummy Lovable Supabase project confirmed intentional for prototyping; EXAI is canonical (repoint at S-64).
- climate-vibes edge function: **keep for now**, removal candidate.
- Artwork filter: keep, dormant in V1, wire in V2. All filters optional — locked principle.
- Cost tag: shown, expanded tier.
- Label structure: titled groups (impact, activity type) vs untitled differentiated tags (rest).
- n8n classifier prompt update: backlog until after V1.
- **Open:** D1 (curation status gate — blocks S-62/S-63), D6 (machine translations pre-review), D8 (email delivery method), D10 (financial_benefits migration record).

---

## Earlier history (pre-docs, for context)

- **2026-07-04** — n8n pipeline: orderBy pagination fix (3 Supabase nodes), sentinel `return []` fix, URL liveness audit (43 dead rows, ~29% Perplexity hallucination rate), 134 rows staged, Tavily + Claude Haiku pivot decided.
- **2026-06-17** — n8n workflow documentation v0.3 (25 nodes, BUG-010/011 fixed).
- **2026-06-12** — n8n v0.2/v0.3 session: exclusion list nodes added, anti-duplication rules, S-58/S-59/S-60 logged.
