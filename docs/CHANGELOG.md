## 2026-08-30 — A1: AAT anchoring columns on tag_vocabulary

`alter table tag_vocabulary add column aat_id text, add column aat_parents text,
add column family_aat_id text;` — run via execute_sql against EXAI.

Prerequisite for the vocabulary gate. `aat_parents` stores the full parent chain
as returned by AAT so the family depth (currently 4) can be re-cut later without
re-querying Getty, and so the DMH reconciliation pass has the chain to work
against. `family_aat_id` makes the family node itself traceable.

Table remains empty — 0 rows. No data written.
## 2026-08-30 — Live audit, documentation consolidation, backlog correction

Read-only audit of EXAI, Lovable, GitHub and Linear. **No code shipped, no database mutated, no workflow touched.** All changes are to documentation and Linear.

### Why

Three copies of the truth existed — uploaded files in a chat project (v1.0), repo docs (v1.1), and the live systems. Only the live systems were correct, and only they had no way of announcing when they changed. Work done through MCP against live systems never triggered a changelog entry, because the old convention fired only on file edits. The database moved; the docs sat still.

### The backlog was wrong in five places

- **S-62** Done — RLS policies exist but both views run with definer semantics, so reads bypass them. Intent never achieved
- **S-63** Done — `v_activities` shipped without `region` and `energy_level`, with `activity_kind` where the spec said `source_table`, and returning `'fb_community'` where the spec said `'facebook_community'`. The real blocker behind S-65
- **S-64** Done — repo `main` still points at the Lovable dummy project; Lovable's connected DB resolves the dummy's tables
- **S-47** (BUG-003) Backlog — migration complete, five principle columns live and populated. **Closed**
- **S-76** Backlog — zero unflagged rows remain. **Closed**; workflow half carried to S-124

S-62/63/64 moved Done → In Progress.

### Substantial built work was undocumented

The most significant finding. None of the following appeared in any doc or ticket:

- **Session, saves and email layer is complete.** `useSession.tsx` (234 lines) handles UUID identity, saves, artwork saves, event logging and idle detection. `MyListView`, `MyCircleView`, `AppNav`, `CircleIcon`, `ShareMenu`. All three email touchpoints exist as components and are wired in. **Three `// DUMMY` stubs are the only gap** — every write is a `console.log`
- **Impact model is built.** `MyCircleView` + `lib/returnTypes.ts` — five return types, ring visualisation, mine/everyone scope. Every constant is invented: the yield rates, the `0.14 × 0.28 × 1.08` funnel, the `0.22` bring-a-friend factor, the decay curve. `RETURN_SHARE` describes database composition, not visitor behaviour. `TOTAL_CLASSIFIED` hardcoded
- **`ImpactView.tsx`** (200 lines) is orphaned — never imported, superseded by `MyCircleView`
- **IA changed** from two tabs with sub-modes to a five-mode flat nav
- **Filter defaults are now all empty** — the app opens showing everything. Earlier specs described preselected defaults

S-68/69/70 re-scoped from "build" to "wire and verify."

### Gaps found in the built work

- **`close_circle` is never logged.** `handleCloseCircle` fires the ripple and opens the URL, calling nothing. The app's single conversion event is untracked
- **No consent capture anywhere.** Source-wide search for `consent` returns zero matches. The spec requires an unchecked-by-default checkbox; the schema requires `consented_updates`. Neither exists
- **No 2-ask cap** enforced across email touchpoints
- **Share events carry no `target`** — `{ id, channel }` only, so you can tell someone shared via WhatsApp but not what they shared
- Built visitor tables lack `sessions.lang`, `sessions.entry_source`, `session_events.activity_id`, `email_captures.consented_updates`, `email_captures.lang` and the UNIQUE constraint. `saves` doesn't exist at all
- The built migration grants anon SELECT `USING (true)` on `email_captures`. **The functional spec forbade exactly this.** The spec was right; the implementation ignored it

### Security

- `security_invoker` unset on both views. Definer semantics mean base-table RLS is bypassed on the view path. Harmless today only because every row satisfies the filter
- **The cause was a documentation error.** The data contract asserted that views execute with the querying role's rights. They do not by default. The doc described safe behaviour, so nobody checked
- `artwork_principle_scores` reports insertable/updatable with `anon` holding write grants — probable write path into `tags`
- ⚠️ The S-116 revoke must be scoped to **content tables by name.** Visitor tables need the opposite permissions; a blanket revoke would silently break every save and email capture

### Data findings

- `financial_benefits.benefit_type` CHECK allows **six** values (adds `savings`, `cashback`); the app's badge mapping covers four
- `tags` has `UNIQUE (artwork_id, dimension, value)` — undocumented dedup key the writer skill depends on
- `effort` → `energy_level` bucketing yields roughly **57 / 37 / 6 percent**. The middle filter option would return a fraction of the catalogue (S-127). Zero unmapped `effort` values
- `location` has **65 distinct values** — the `ILIKE 'israel%'` region rule is more fragile than assumed
- Artwork layer: 9 of 30 principle cells filled; CT-1 has no tags; six tags in `curator_review`
- Storage: zero buckets. Four artworks hotlink external CDNs including credited press photos
- Verified via `Lovable:query_database`: **zero rows** in all three dummy-project tables — nothing to migrate before the switch
- One migration file exists, dated 2026-07-16, targeting the dummy project. There is no meaningful migration history
- `.env` is tracked in git with no `.gitignore` entry

### Corrections to earlier claims made this session

Recorded because each was stated before being checked:

- **"No Hebrew in the database"** — wrong. Hebrew columns exist on `artists`, `artworks` and `financial_benefits`. The gap is the two initiative tables
- **Hebrew-native / English split** — the old estimate of ~100/~260 is wrong. Live is **155 / 217**, with Facebook communities overwhelmingly Hebrew-native. This changes S-71 batch sizing
- **"Tag normalization is days of work for marginal gain"** — wrong. The distribution is head-heavy; top 15 values per dimension cover 82–96% of instances
- **`is_verified_active` "missing from the view"** — wrong. It is in the `WHERE`, not the `SELECT`, which is correct
- **"D-numbers collide across the specs"** — wrong. D1–D10 were always consistent; the collisions were introduced by a draft of `decisions.md` and are now D21 and D15
- **"No feature documentation exists"** — wrong. `ui_spec.md` §2/§4/§5/§9 was exactly that
- **"`ShareMenu.onShare` needs wiring"** — wrong. Already wired; only `logEvent` is stubbed
- **App typography** — Heebo, not Tenor Sans + Inter. Palette is closer to the exhibition identity than earlier specs implied; `returnTypes.ts` already uses the exhibition classes
- **Mock dataset** — 60 activities, not 61 or 75

### Decisions

- **D1–D10 restored** from the source specs and re-graded. D1 is **OPEN**, not closed — the interim rule shipped while the permanent decision was never made. D2, D3, D5, D9 are marked **DE FACTO**: recommendations the build followed without a formal ruling
- **D15 RULED** — two-tier matching (principle scores + tag family graph, IDF-weighted, curator exceptions in a junction). Supersedes pure score-space matching. Artworks are sparse on principles and dense on tags — the reverse of the original assumption
- **D16 RULED** — Supabase Storage over S3
- **D17 RULED** — reconcile, don't rebuild; DB corrected before app repointed
- **D21 RULED** — anonymous UUID in `localStorage` (not IP, not `sessionStorage`); registered via magic link
- **D11, D12, D13, D14, D18, D19, D20, D22 opened**

### Documentation consolidated: 7 files → 5

| File | Contains |
|---|---|
| `README.md` | methodology, architecture, repo conventions, identifiers |
| `decisions.md` | D1–D22, the only decision register |
| `contracts.md` | schema, view, vocabularies, events, permissions, matching |
| `app_spec.md` | IA, features, components, design system, Hebrew run plan |
| `state.sql` | nine read-only query blocks replacing every hardcoded number |

**Retired** — content absorbed, files deleted: `ui_spec.md` · `v1_functional_spec.md` · `data_contract_spec.md` · `supabase_schema_documentation.md` · `architecture_and_versioning.md`

Nine content duplications removed. Every remaining shared phrase is a reference to a single source, not a restatement.

### Methodology

**The changelog trigger is now any change** — a database write, an n8n edit, a Lovable prompt, or a decision — not merely a file edit. This is the rule whose absence caused the drift.

One home per fact type: state → live via `state.sql`; decisions → `decisions.md`; data contracts → `contracts.md`; app behaviour → `app_spec.md`; work status → Linear.

Ownership: `docs/` → Claude Code · `src/` → Lovable · EXAI and Linear → chat via MCP.

Session start: run `state.sql` Q1–Q3, read `decisions.md`, then work. Never from memory, never from an uploaded copy.

### Tracking

Created **S-116** through **S-127** under label `backlog V#2`, plus **S-124** (Curator Review Dashboard). Closed S-47 and S-76. Corrected stale content in S-65 (wrong column and value for `showCommunityMessage`) and S-74 (superseded matching approach, stale artwork count).

### Still missing from documentation

- **Artwork skill prompts.** The three skills (analyst → validator → writer) exist only in the skills folder, not in the repo. The n8n prompts were extracted this session into `docs/prompts/`
- **Exhibition context.** Curatorial vocabulary, the four nature-design principles, the seven upper-gallery chapters, palette and typography provenance, the unresolved tagline conflict
- **Impact model rationale.** The five return types are documented; why these five is not


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
