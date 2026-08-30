# Decision Register — Close the Circle

**The only place decisions live.** No row counts, no coverage numbers, no work status.
State → `state.sql`. Work status → Linear. Data contracts → `contracts.md`. App behaviour → `app_spec.md`.

D-numbers are permanent. Never reuse, never renumber. A reversal gets a new D-number; the old row moves to Superseded with a pointer.

Last updated: 2026-08-30

### Status grades

| Grade | Meaning |
|---|---|
| **RULED** | Explicitly decided and recorded |
| **DE FACTO** | A recommendation the build followed, never formally ruled. Treat as binding but reopenable at low cost |
| **OPEN** | Needs a ruling |

---

## OPEN

| ID | Decision | Options / recommendation | Blocks | Source |
|---|---|---|---|---|
| D1 | Curation status gate in `v_activities` | Add a `status` column and gate before launch. Interim in force: exclude `is_verified_active = false`. ⚠️ The interim shipped and the permanent decision was never made | S-124 | data_contract §8, architecture §5, CHANGELOG 2026-07-16 |
| D6 | Show machine translations pre-review? | Show `machine` rows to HE users with fallback styling, or strict `reviewed`-only with EN fallback. App supports both | S-72 | all three specs |
| D8 | Email delivery method | App sends (Resend), or capture-only with export to the museum's existing list. Manual batch adequate at exhibition scale. Capture points and copy are a separate half — needs curators | S-70 | functional §8, architecture §5 |
| D10 | `financial_benefits` migration record | Backfill a no-op migration record, or accept the gap. Table was created via `execute_sql` | — | architecture §5 |
| D11 | Matching weight split w₁:w₂ | Start 30/70 favouring tags, given sparse artwork principle coverage. Revisit once coverage completes | S-122 | this session |
| D12 | Who drafts the tag family table | Claude drafts from live data → curator review, or curators author | S-122 | this session |
| D13 | Anon → registered save merge | Anon UUID claimed by the auth user on first login. Unresolved: second-device case; whether events carry over or only saves | S-119, S-69 | this session |
| D14 | `climate-vibes` edge function | Redeploy to EXAI / rewrite to call Anthropic / remove. **Removal recommended** — already a listed candidate in the repo changelog | S-118, S-120 | this session; CHANGELOG 2026-07-15 |
| D18 | Activity ordering mechanism | Sort by match score, or filter-hard-then-order-gently. Score-ranking reads as a leaderboard, against the exhibition's stance. Sub-questions: results per screen, stable vs reshuffled, empty state | S-65 | this session |
| D19 | Impact tab numbers | Source the yield rates / show honest ranges / drop numbers and show the shape of what returns. Every constant is currently invented | S-126 | this session |
| D20 | Curator review gating model | Classifier stops setting the flag (queue), or a separate `curator_status` column. **Option 2 lower risk** — leaves the n8n pipeline undisturbed | S-124 | this session |
| D22 | App typography and palette | App uses **Heebo**; exhibition brand is FbHarduf-Black + Assistant. Palette base is close (`--ink` ≈ Ink, `--bone` ≈ Cream, `--sage` ≈ Moss) but lacks Terracotta, Sand, Ochre, Sky — which `returnTypes.ts` already references. A reconciliation, not a redesign | S-66 | this session |

## RULED

| ID | Decision | Ruling | Date | Source |
|---|---|---|---|---|
| D4 | Artwork filter in V1 | Visible with the 6 mock artworks; selections have **no effect** on results. ARTWORKS tab stays fully mock through V1. Real filtering in V2. All filters remain optional | 2026-07-16 | data_contract §8 |
| D7 | Cost tag in expanded card | Yes — expanded tier. Visual treatment still gated on the design session | 2026-07-15 | data_contract §8 |
| D15 | Artwork↔activity matching | Two-tier: principle scores + tag family graph, IDF-weighted, curator exceptions in an `artwork_activity` junction. **Supersedes** pure score-space matching | 2026-08-30 | this session |
| D16 | Artwork image storage | Supabase Storage, not S3. Public bucket, path `artworks/{slug}/{n}.jpg`, store path not URL | 2026-08-30 | this session |
| D17 | DB→app sync approach | Reconcile, don't rebuild. DB corrected first, app repointed second | 2026-08-30 | this session |
| D21 | User identity model | Anonymous = UUID in `localStorage` — persists across visits, no PII, **not** IP-based, **not** `sessionStorage`. Registered = email magic link; possession of the inbox is the second factor | 2026-08-30 | this session |

## DE FACTO

Recommendations the build followed without a formal ruling. Binding in practice; cheap to revisit.

| ID | Decision | In force | Note |
|---|---|---|---|
| D2 | `energy_level` source column | Derive from `effort`, not `time_commitment` | ⚠️ **Never implemented** — the column doesn't exist in the live view (S-117). The bucketing it implies also produces a 6% middle bucket (S-127) |
| D3 | LocationFilter fate | Display-only in V1 | Matches the built state. No geo data behind it; `location` is free text |
| D5 | Server-side vs fetch-once filtering | Fetch-once + client filter | Matches the built state (static imports). Revisit past ~1k rows |
| D9 | Events table scope | `close_circle` + email events only | ⚠️ **Build diverges both ways** — the built union has ten event types, and `close_circle` is not among them (S-68) |

## SUPERSEDED

| Was | Replaced by |
|---|---|
| Artwork matching as cosine similarity over five principle scores, no junction table | D15 |

---

## Locked principles

Constraints on every decision, not decisions themselves.

**Experience**
- No streaks, points, badges, or user comparisons. Slow, non-intrusive, degrowth-aligned
- Every impact comparison names something that comes into being, not something avoided
- Relatable units over abstract ones — dunams and stools, not m² and kg
- **All filters optional.** Empty selection = no constraint. Zero filters must always show everything

**Architecture**
- No backend of our own — views, RLS policies, and rarely an edge function
- The view is the API. The UI never touches base tables
- Visitor writes are append-only. No visitor-originated mutation of content, ever

**Content**
- Tag values are English snake_case. Hebrew is display layer only
- Hebrew copy is native-feeling, not translated

**Privacy**
- No PII in the sessions table. No fingerprinting. No third-party tracker

---

## Numbering note

D1–D10 are the original sequence, verified 2026-08-30 against the three pre-consolidation spec files (now retired) — consistent across all three, no collisions.

D11–D22 added 2026-08-30. An earlier draft of this file mis-assigned D3 and D9 to new decisions; those are now **D21** and **D15**. If any Linear issue references "the D3 user model," it means D21.
