# Close the Circle — how this project works

Post-exhibition visitor web app for **The Circle / המעגל**, Design Museum Holon.
Visitors scan a QR after the exhibition and are matched to real sustainability initiatives.

**Read this before editing anything in `docs/`.**

---

## The documentation model

### Why it exists

Truth was living in three places at once — uploaded copies in a chat project, docs in this repo, and the live systems. Only the live systems were correct, and only they had no way of telling you when they changed. Docs written in July described a system that no longer existed by August, and described it confidently.

### Rule 1 — one home per kind of fact

| Fact type | Home | Never lives in |
|---|---|---|
| **State** — counts, coverage, what's classified | live systems, via `state.sql` | prose. Ever. |
| **Decisions** | `decisions.md` | Linear, specs |
| **Data contracts** — schema, vocabularies, permissions | `contracts.md` | app spec |
| **App behaviour** — features, IA, components | `app_spec.md` | contracts |
| **Work status** | Linear | docs |

Docs rot because they contain state. `decisions.md` doesn't rot, because it only changes when a human decides something.

**If you are about to type a number into a markdown file, stop.** Add a query to `state.sql` instead.

### Rule 2 — one writer per layer

| Layer | Owner |
|---|---|
| `docs/` | Claude Code |
| `src/` | Lovable |
| EXAI database | chat via Supabase MCP |
| Linear | chat via Linear MCP |
| n8n workflow | chat via n8n MCP |

**Treat Lovable as another committer** — pull before local work, and never hand-edit `src/` while a Lovable prompt is running.
**Close all n8n browser tabs before MCP writes** — the UI cache silently overwrites node-level edits.

### Rule 3 — the changelog trigger is *any change*

Not "any file edit." A database write, an n8n edit, a Lovable prompt, or a decision each require a CHANGELOG line **before the session ends**.

This is the rule whose absence caused the drift. Backfills and purges moved the database while the docs sat still, because nothing touched a file.

### Rule 4 — every session starts by reading live

1. Run `state.sql` (at minimum Q1–Q3)
2. Read `decisions.md`
3. Then work

Never start from memory. Never start from an uploaded copy of a doc — copies cannot update themselves and will mislead you exactly as confidently as the real thing.

### Definition of done

1. Change made
2. `contracts.md` / `decisions.md` / `app_spec.md` updated if something they cover moved
3. CHANGELOG line written
4. Linear status moved

If step 3 feels like overhead, the ticket was too big.

### Known divergences are recorded, never silent

When live and contract disagree, write it in the contract with the Linear issue that resolves it. A silent divergence is how a "Done" ticket ends up describing work that never landed — which happened three times here (S-62, S-63, S-64).

---

## Files

| File | Contains | Never contains |
|---|---|---|
| `README.md` | this — methodology, architecture, conventions | schema detail, feature detail |
| `decisions.md` | D-numbered decisions, open and closed | row counts, work status |
| `contracts.md` | schema, view, vocabularies, events, permissions, matching | app behaviour |
| `app_spec.md` | IA, features, components, design system, Hebrew run plan | schema detail |
| `state.sql` | read-only queries answering "what is true now" | anything that writes |
| `CHANGELOG.md` | what changed, when, why | current state |
| `prompts/` | n8n flow docs, all prompts verbatim, and the n8n↔project gap list | app or schema contracts |

**Retired 2026-08-30** — content absorbed, delete if still present: `ui_spec.md` · `v1_functional_spec.md` · `data_contract_spec.md` · `supabase_schema_documentation.md` · `architecture_and_versioning.md`

`n8n_draws_prompt_addition.md` remains pending a `prompts/` folder — see Gaps.

---

## Architecture

```
Visitor (mobile web, QR entry)
   │
   ▼
Lovable app — React 18 + Vite + TS + Tailwind + shadcn/ui + framer-motion
   │  supabase-js (anon key)
   │  ⚠️ CURRENTLY POINTS AT THE DUMMY PROJECT — S-120
   ▼
Supabase EXAI (qjqqyvpqkbljngmhxahl)
   ├─ v_activities (VIEW) ← global_initiatives ∪ facebook_communities
   │     ⚠️ security_invoker unset — reads bypass RLS (S-116)
   │     ⚠️ missing region + energy_level (S-117)
   ├─ artwork_principle_scores (VIEW) ← tags, validated only
   ├─ financial_benefits ← Cashback tab (live, seeded)
   ├─ artists / artworks / sources / artwork_sources / tags
   └─ sessions / saves / session_events / email_captures
         ⚠️ NOT ON EXAI — built on the dummy project, diverge from spec (S-119)

   └─ edge function: climate-vibes
         ⚠️ on the dummy project; EXAI has none. D14 open

Curation side (never through the app):
   n8n pipeline    → global_initiatives (discovery + classification)
   Claude skills   → artwork tables (analyst → validator → writer)
   Supabase dashboard / service role → review, email export, analytics
```

### Principles

- **No backend of our own.** The app is static + supabase-js. Every server-side need is a view, an RLS policy, or rarely an edge function
- **The view is the API.** The UI never touches base tables; schema evolution happens behind `v_activities`
- **Visitor writes are append-only.** No visitor-originated mutation of content, ever
- **Two Supabase projects exist.** EXAI is canonical. Lovable's auto-provisioned `tczfbbsydmbmktspghaz` is a prototyping dummy. The repoint is S-120 — **still not done** despite S-64 being marked complete
- **Bilingual by column.** Hebrew display layer, English snake_case vocabularies

---

## Stack decisions

| Layer | Decision | Note |
|---|---|---|
| Hosting | Lovable default | revisit only for custom domain or analytics |
| Data fetch | fetch-once + client filter (D5) | react-query optional wrapper |
| Types | `supabase gen types` from EXAI, committed | regenerate on every schema change |
| Auth | Supabase Auth, email magic link (D21) | no passwords, no reset flow |
| Live LLM | `climate-vibes` — **D14 open**, removal recommended | contradicts the pre-built-component principle |
| i18n | `strings.ts` (UI) + `_he` columns (content) + `vocabDisplay.ts` (tags) | `activities.he.ts` deleted at V1.3 |
| Analytics | `session_events`, no third-party tracker | no PII, no fingerprinting |
| Images | Supabase Storage, public bucket (D16) | not S3 |
| Typography / palette | ⚠️ **D22 open** — app uses Heebo, not the exhibition's FbHarduf-Black / Assistant | |

---

## Repo

```
closethecircle/
├─ docs/               ← this folder; Claude Code owns it
├─ src/                ← Lovable owns this
├─ supabase/
│  ├─ config.toml      ⚠️ still points at the dummy project — S-120
│  └─ migrations/      ⚠️ one file only (2026-07-16, dummy-project tables)
└─ .env                ⚠️ TRACKED IN GIT, no .gitignore entry — S-120
```

**Branches:** `main` = deployed; Lovable syncs two-way with it. Feature branches per work item.

**Tags:** `v1.1-data`, `v1.2-email`, `v1.3-hebrew`, `v2.0-artworks` at each milestone ship.

**Work items:** Linear, EXAI project, S-series. Milestones are **not** duplicated here — that is work status, and duplicating it is how S-62/63/64 drifted.

### Database change path

**Use `execute_sql` for all DDL and DML on EXAI.** `apply_migration` is unreliable on this project. An earlier convention mandated `apply_migration`, which is why `financial_benefits` was created outside the migrations list (D10 open).

Consequence to accept knowingly: **there is no meaningful migration history.** The `migrations/` folder holds one file, and it targets the dummy project. Compensating controls:

- Every schema change gets a CHANGELOG entry the same session
- `contracts.md` records the resulting shape
- `state.sql` Q1/Q3/Q4 verify live structure on demand

If a real migration history is wanted later, that is a separate decision — not a convention asserted in a doc while the tooling fails.

---

## Key identifiers

| Thing | Value |
|---|---|
| Supabase EXAI | `qjqqyvpqkbljngmhxahl` |
| Supabase dummy (to be replaced) | `tczfbbsydmbmktspghaz` |
| Lovable project | `d6045fcc-3332-48c1-8932-bfb154453c4d` |
| Lovable workspace | `wWcktEPLgaCd9bpbAOxq` |
| n8n workflow | `Vnoy1WxaEQrOwwJT` |
| Linear | team S-p-a-c-e, project EXAI |
| Repo | github.com/nettatzin/closethecircle (public) |
| Live app | closethecircle.lovable.app |

**MCP notes:** the dummy Supabase project is unreachable via Supabase MCP (outside the authorized org) — use `Lovable:query_database` with the Lovable project ID. Check EXAI status with `get_project` before querying; restore if `INACTIVE`.

---

## Gaps in this documentation

Known, not yet written:

- **Prompts — n8n extracted 2026-08-30.** Both workflows' flows, all three prompts, and the gap list now live in `docs/prompts/`. **Still outside the repo:** the three artwork skill prompts (analyst → validator → writer), which exist only in the skills folder
- **Exhibition context.** Curatorial vocabulary (פליאה, דבר מזין דבר, מעגל החומרים, חיים במעגלים), the four nature-design principles, the seven upper-gallery chapters, palette and typography provenance, the unresolved tagline conflict between the curatorial deck and Bodasher materials
- **Impact model rationale.** The five return types are documented in `app_spec.md` §6, but why these five and not others is unrecorded (S-126)
