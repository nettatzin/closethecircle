# n8n ↔ Project Gaps

**As of 2026-08-30.** What the n8n workflows do versus what the project now expects.

⚠️ **Nothing here is scheduled.** The pipeline is not on the exhibition critical path, and there is no plan to update n8n before September 9. This is a record so the divergences are known rather than discovered later.

**Read before running either workflow.** Several gaps would write bad data.

---

## A. Would write wrong or incomplete data

Highest consequence — these corrupt or degrade the catalogue.

| # | Gap | Detail |
|---|---|---|
| **A1** | **`draws` is never classified** | Neither classification prompt asks for it. Every newly discovered row arrives with `draws` NULL. Existing rows were backfilled separately. `draws` drives a visitor-facing filter, so new rows would be invisible to it. Paste-ready fix in `n8n_prompts.md` §4. **S-75** |
| **A2** | **`is_verified_active: true` set unconditionally** | `Code in JavaScript3` (WF1) sets it with no human review. The flag means "the classifier ran," not "a curator approved." Once `security_invoker` is enabled (S-116), this flag becomes the real visitor gate — so new rows would reach visitors unreviewed. **D20 / S-124** |
| **A3** | **WF2 never sets `is_verified_active`** | Rows land NULL, invisible to `v_activities`. The opposite failure from A2. This is the likely origin of the ~127 NULL rows in S-76 |
| **A4** | **Index pairing (WF1)** | `Code in JavaScript3` matches Claude responses to rows by array position. Any missing, retried or reordered response writes scores to the **wrong initiative**, silently. WF2's item-level pairing is correct — port it. **S-50 / BUG-006** |
| **A5** | **`relevance_score: -1` failure sentinel** | Parse failures write -1 rather than leaving the row unclassified. Nothing surfaces or reprocesses these. No periodic check exists |
| **A6** | **`location` is unconstrained** | The prompt says "Israel - Tel Aviv" or "Global", but 65 distinct values exist live, including `Israel - Israel`. The `region` derivation (S-117) depends on this being predictable |

---

## B. Schema and vocabulary drift

The DB moved; the prompts didn't.

| # | Gap | Detail |
|---|---|---|
| **B1** | **`participation_type` includes `education`** | The Perplexity prompts offer it; `contracts.md` §5 doesn't list it. Either add to the contract or remove from the prompts |
| **B2** | **Hebrew columns not written** | `name_he`, `description_he`, `how_to_join_he`, `visitor_action_he` and `translation_status` are planned (S-71). Neither workflow knows about them, so new rows would need a separate translation pass |
| **B3** | **`return_type` not written** | Proposed for the impact model (S-126). Currently stubbed in app code as a category→type mapping |
| **B4** | **`curator_status` not written** | Proposed gating column (D20). Doesn't exist yet |
| **B5** | **`artwork_correlations` legacy** | WF1 doesn't write it, correctly — superseded by the five numeric columns. Noted so nobody reintroduces it |
| **B6** | **WF2 ignore-list references dead fields** | `_classification_error, _raw_llm_output, confidence, confidence_reason, _note, status, activity_evidence_url` — none of these are columns. Harmless, but it records an older schema |

---

## C. Wiring defects

| # | Gap | Detail |
|---|---|---|
| **C1** | **Only Cat8 fires** | The trigger connects to `Perplexity Cat8` alone. 11 of 12 categories never run. **S-58 says Cat3; the old n8n doc says Cat6. Both wrong** |
| **C2** | **Cat1 and Cat3 collide at Merge input 0** | Input 2 sits empty. Cat3's results would overwrite or interleave with Cat1's. **Not currently logged anywhere** |
| **C3** | **Merge node has no parameters** | `parameters: {}` entirely. **S-60 says `numberInputs` is 2 — it isn't set at all** |
| **C4** | **Duplicate dedup node** | `Code in JavaScript2` is functionally identical to `Code in JavaScript1` and re-reads from the same upstream node, so it doesn't even chain. **S-45 / BUG-001** |
| **C5** | **No skip guard before insert** | Empty input still reaches `Create a row`. **S-46 / BUG-002** |

---

## D. Linear tickets that no longer match reality

Correct these before anyone acts on them.

| Ticket | Says | Live truth |
|---|---|---|
| **S-58** BUG-007 | Trigger → Cat3 | Trigger → **Cat8** |
| **S-59** BUG-008 | Cat2/Cat3 bypass Merge, connect direct to parser | **Both route through Merge.** Fixed at some point, never closed. The real defect is C2 |
| **S-60** BUG-009 | Merge `numberInputs` is 2 with 12 connections | Merge has **no parameters at all** |
| **S-61** HYG-01 | 11 of 12 prompts hardcode `date_discovered` as 2026-04-29 | **All 12 use `{{$now.format('YYYY-MM-DD')}}`.** Fixed — close it |

The old `n8n_workflow_documentation.md` v0.3 also states 64 rows, 30 columns, trigger on Cat6, last updated 2026-06-12. All wrong. That file is retired.

---

## E. Operational limits

| # | Gap | Detail |
|---|---|---|
| **E1** | **Exclusion list caps at 300** | `Build Exclusion List` soft-caps at the 300 most recent by `date_discovered`. The catalogue is close to that. Past it, older initiatives stop being excluded and duplicates return. **Decide a strategy — per-category quota vs. global recent-first — before the next run** |
| **E2** | **Perplexity hallucinates URLs** | Roughly 29% in the 2026-07-04 liveness audit, which killed 43 dead rows. Architectural conclusion at the time: **"retrieval then extract" (Tavily + Haiku) beats "generate then verify."** Not implemented |
| **E3** | **Two copies of the same prompt** | The classification prompt exists in both workflows with a `==` typo in one and different whitespace. Editing one drifts the other |
| **E4** | **WF2 holds data inline** | 13 Ocean & water initiatives are pasted into `Load Staging JSON` as literal JavaScript. Re-running it would attempt to re-insert them; the `url` UNIQUE constraint would reject them with 409s |
| **E5** | **WF1 has no meaningful name** | Still "My workflow", tag `version 0.1` |
| **E6** | **No migration history** | Neither workflow's schema assumptions are captured in migrations. `apply_migration` is unreliable on this project; `execute_sql` is the working path (D10) |

---

## If the pipeline is ever revived

Minimum before running:

1. **A1** — add `draws` to the classification prompt, or new rows are invisible to a live filter
2. **A2 / A3** — decide D20 first. Right now WF1 auto-approves and WF2 auto-hides
3. **E1** — decide the exclusion cap strategy
4. **C1** — fan the trigger out to all 12 categories, or accept that only Ocean & water runs
5. **A4** — port WF2's item-level pairing into WF1

Design note: **WF2 is the better-built workflow.** Item-level pairing, an explicit defaults object, temperature 0.2, and a correct single `=`. If the two are ever merged, WF2's classification half should win.
