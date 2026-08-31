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
| D13 | Anon → registered save merge | Anon UUID claimed by the auth user on first login. Unresolved: second-device case; whether events carry over or only saves | S-119, S-69 | this session |
| D14 | `climate-vibes` edge function | Redeploy to EXAI / rewrite to call Anthropic / remove. **Removal recommended** — already a listed candidate in the repo changelog | S-118, S-120 | this session; CHANGELOG 2026-07-15 |
| D18 | Activity ordering mechanism | Sort by match score, or filter-hard-then-order-gently. Score-ranking reads as a leaderboard, against the exhibition's stance. Sub-questions: results per screen, stable vs reshuffled, empty state | S-65 | this session |
| D19 | Impact tab numbers | Source the yield rates / show honest ranges / drop numbers and show the shape of what returns. Every constant is currently invented | S-126 | this session |
| D20 | Curator review gating model | Classifier stops setting the flag (queue), or a separate `curator_status` column. **Option 2 lower risk** — leaves the n8n pipeline undisturbed | S-124 | this session |
| D22 | App typography and palette | App uses **Heebo**; exhibition brand is FbHarduf-Black + Assistant. Palette base is close (`--ink` ≈ Ink, `--bone` ≈ Cream, `--sage` ≈ Moss) but lacks Terracotta, Sand, Ochre, Sky — which `returnTypes.ts` already references. A reconciliation, not a redesign | S-66 | this session |
| D28 | Relevance mechanism | Tag affinity alone cannot carry it — tested against live data, distribution is binary not graded (157 activities scored exactly 1.000 against one artwork), and 45 activities carry no materials at all. Cause is density: 2.27 materials and 1.92 process per activity, 1–4 per artwork. Not fixable by weighting. **Proposal:** `0.5 · cosine + 0.2 · tag_affinity + 0.3 · principle_alignment + community_bonus`, spec in `spec_matching_v2.md` with a kill-criteria test. **Amends D15** — the tag family graph stays, but as one term of three rather than the mechanism | S-122 | this session |

## RULED

| ID | Decision | Ruling | Date | Source |
|---|---|---|---|---|
| D4 | Artwork filter in V1 | Visible with the 6 mock artworks; selections have **no effect** on results. ARTWORKS tab stays fully mock through V1. Real filtering in V2. All filters remain optional | 2026-07-16 | data_contract §8 |
| D7 | Cost tag in expanded card | Yes — expanded tier. Visual treatment still gated on the design session | 2026-07-15 | data_contract §8 |
| D15 | Artwork↔activity matching | Two-tier: principle scores + tag family graph, IDF-weighted, curator exceptions in an `artwork_activity` junction. **Supersedes** pure score-space matching | 2026-08-30 | this session | ⚠️ Partially amended by D28 — the tag family graph is retained as one term of three, not as the mechanism.
| D16 | Artwork image storage | Supabase Storage, not S3. Public bucket, path `artworks/{slug}/{n}.jpg`, store path not URL | 2026-08-30 | this session |
| D17 | DB→app sync approach | Reconcile, don't rebuild. DB corrected first, app repointed second | 2026-08-30 | this session |
| D21 | User identity model | Anonymous = UUID in `localStorage` — persists across visits, no PII, **not** IP-based, **not** `sessionStorage`. Registered = email magic link; possession of the inbox is the second factor | 2026-08-30 | this session |
| D23 | AAT anchors materials only | Materials resolve cleanly against Getty AAT and it is retained there. **Process does not** — no process value reached an Activities Facet concept in testing (`repair` → building components, `sharing` → shared housing, `cultivation` → sericulture). AAT's Activities Facet is art-historical technique, not circular-economy practice. Process families will be hand-authored. Reverses items 5b, 7 and 8 of the 2026-08-30 matching handover (not D-numbers) | 2026-08-31 | this session |
| D24 | Model vs SQL division in the gate | The model decides only: is this AAT candidate the same concept, is this a variant, which attributes apply. **SQL owns the facet guard, family derivation and depth**, enforced in `gate_apply_aat`. Evidence: across 11 rows the model applied the depth rule correctly once, and separately admitted an Activities Facet concept into `materials` despite an explicit prompt guard | 2026-08-31 | this session |
| D25 | Material with no AAT concept | Goes to model classification, then human review. AAT resolves → `family_source='aat'`, approved. No AAT concept but still a material → `family_source='model'`, `review_status='pending'`, `model_family` = proposal, human approves before it counts. Not a material → stays in `tag_intake`, never clustered. Only `approved` rows count toward matching weight. Proposals must use a family already in use. **Answers D12** | 2026-08-31 | this session |
| D26 | How ungated values are identified | Set difference, not a flag column. The unit is the value, not the row. `gate_selector` diffs values in use against `tag_vocabulary ∪ tag_aliases ∪ tag_intake`. Idempotent; identical path for backfill and live traffic. Prose is the exception and needs `tag_intake` as a ledger — not yet built | 2026-08-31 | this session |
| D27 | Family depth is a DB parameter | Not a prompt instruction. `aat_parents` stored verbatim so `recut_families(n)` re-derives every family without re-querying Getty. Depth 4 in force. Depth 4 → 5 families, largest 10; depth 5 → 9, largest 5; depth 6 → 14, largest 4. Final cut decided from the score distribution | 2026-08-31 | this session |
| D12 | Who drafts the tag family table | Claude drafts from live data, Netta reviews and approves. In force — 25 model-suggested material families approved 2026-08-31. Mechanism formalised as D25 | 2026-08-31 | this session |

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
