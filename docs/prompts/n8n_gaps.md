# n8n ↔ Project Gaps

**As of 2026-09-28.** What the n8n pipeline does versus what the project expects.

The pipeline was rebuilt on 2026-09-28 (`n8n_flows.md`). The 2026-08-30 gap list is kept below as a closed record, with what happened to each item.

---

## Open

| # | Gap | Detail |
|---|---|---|
| **O1** | **Facebook links are not read directly** | Pages and groups sit behind a login wall. Add Links describes them from the Notes field plus a web search. Fix: Apify Facebook Pages / Groups actors for public pages and groups (needs an Apify token in n8n). Private groups cannot be read by any tool |
| **O2** | **No curator screen for pending rows** | Approval is SQL (`n8n_flows.md`, "Approving rows"). `v_activities` needs `curator_status = 'approved'` **and** `is_verified_active = true` — the pipeline sets neither |
| **O3** | **D3 category not in the pipeline** | Waiting for its definition. When ruled: `CATEGORIES` in Discovery's `Build Prompts`, both forms, the category list in Add Links' `Parse Link` |
| **O4** | **`exai-workflow` (`WILlmVNe2TXrz6AK`) not archived** | Not open to the MCP connector. Archive by hand |
| **O5** | **Pending translation row** | One row failed validation on the 2026-09-28 re-run and kept its earlier Hebrew; it retries on the next Translate run |
| **O6** | **Hebrew labels for category values** | Rows are translated; the ~150 code values (effort, draws, format…) are not. `vocab_labels` proposal written, waiting on S-127 (3 commitment levels) and the exhibition theme names |
| **O7** | **Tag arrays still open** | By design (D15). New runs can add new `impact_tags` / `community_archetype` values; near-duplicates exist (e.g. four biodiversity tags) |

---

## Closed record — the 2026-08-30 list

| # | Gap (2026-08-30) | Now |
|---|---|---|
| A1 | `draws` never classified (S-75) | **Fixed.** Classify asks for it and rejects an empty set |
| A2 | `is_verified_active = true` set automatically | **Fixed.** Nothing sets it; new rows are `pending` (O2) |
| A3 | WF2 never set `is_verified_active` | **Superseded** by the pending gate |
| A4 | Index pairing (S-50) | **Fixed.** Per-item pairing in every Code node |
| A5 | `relevance_score = -1` on parse failure | **Fixed.** Invalid answers leave the row unclassified for retry |
| A6 | Free-text `location` | **Fixed for new rows.** Four shapes only, enforced by the validator. The 65 legacy values remain |
| B1 | `participation_type` includes `education` | Still offered by the prompts. Needs adding to `contracts.md` §5 |
| B2 | Hebrew columns not written | **Fixed.** Translate runs inside the pipeline; `name_he`, `description_he` only (`how_to_join_he`, `visitor_action_he` not built) |
| B3 | `return_type` not written | Still open (S-126) |
| B4 | `curator_status` not written | **Fixed.** Column exists; default `pending` |
| B5 | `artwork_correlations` legacy | Not written. Five principle scores are written; no artwork matching runs |
| B6 | WF2 ignore-list dead fields | **Gone** with WF2 (archived) |
| C1–C5 | Wiring defects in WF1 (S-58, S-59, S-60, S-45, S-46) | **Gone** with WF1 (archived). New flows have one discovery node and a single dedup step |
| D | Stale Linear tickets S-58–S-61 | WF1 archived; these can be closed |
| E1 | Exclusion list capped at 300 | **Fixed.** Per-category list of 40 names; real dedup on normalised URL against both tables |
| E2 | Perplexity hallucinated ~29% of URLs | **Fixed.** Claude web search returns found pages; a liveness check drops dead links before insert. Perplexity's Sonar chat-completions API was retired on 2026-09-27 anyway |
| E3 | Two copies of the classifier prompt | **Fixed.** One Classify sub-workflow, used by both entry points |
| E4 | WF2 held data inline | **Gone.** Add Links form replaces pasted JSON |
| E5 | WF1 unnamed | **Gone** |
| E6 | No migration history | Unchanged: schema changes still go through `execute_sql` (D10) and are logged in CHANGELOG |
