# n8n Workflows — Flow Documentation

**Extracted:** 2026-08-30 from live n8n
**Purpose:** record what each workflow does, node by node. Prompts live in `prompts.md`.

⚠️ These workflows are **not up to date with the project** and there is no plan to update them before the exhibition. Divergences are listed in `gaps.md`.

---

# Workflow 1 — `Vnoy1WxaEQrOwwJT`

**Name:** "My workflow" *(unnamed)*
**Description:** 12 parallel Perplexity searches (one per sustainability category) merging into dedup, insert, and Claude classification pipeline
**Nodes:** 25 · **Active:** false, manual trigger only
**Created:** 2026-02-28 · **Last updated:** 2026-07-02 · **Tag:** `version 0.1`

## What it does

Discovers new sustainability initiatives via Perplexity across 12 categories, deduplicates them against what's already in Supabase, inserts the new ones, then classifies each with Claude across the five exhibition principles plus secondary tags.

## Node inventory

### Trigger and exclusion setup

| Node | Type | Does |
|---|---|---|
| `When clicking 'Execute workflow'` | manualTrigger | Manual run only |
| `Get Existing URLs` | supabase | Fetches **all** rows from `global_initiatives`, ordered `created_at.desc`. Feeds the exclusion list |
| `Build Exclusion List` | code | Sorts by `date_discovered` desc, caps at **300 most recent**, emits `- {name} \| {url}` lines as `exclusionText`. Prepends a NOTE line when truncated |

### Discovery — 12 Perplexity nodes

`Perplexity Cat1` … `Perplexity Cat12`, all `sonar-pro`, 200000ms timeout, credential `Wqbs3PSWpjWWkBT8`.

Each asks for 5 new initiatives in its category, injects the live exclusion list, and demands strict JSON.

| Node | Category |
|---|---|
| Cat1 | Circular fashion |
| Cat2 | Biomaterials & material innovation |
| Cat3 | Repair & reuse |
| Cat4 | Traditional craft preservation |
| Cat5 | Species & ecosystem protection |
| Cat6 | Citizen science & biodiversity |
| Cat7 | Regenerative agriculture & food |
| **Cat8** | **Ocean & water** ← the only node the trigger fires |
| Cat9 | Zero waste & plastic-free |
| Cat10 | Permacomputing & slow tech |
| Cat11 | Community commons |
| Cat12 | Urban ecology |

### Aggregation, dedup, insert

| Node | Type | Does |
|---|---|---|
| `Merge All Results` | merge v3.2 | Combines Perplexity outputs. **No parameters set at all** |
| `Code in JavaScript` | code | Parses each `choices[0].message.content` as JSON; regex fallback for markdown-wrapped output. Both failure paths silent |
| `Get many rows` | supabase | Fetches all `global_initiatives` again (separate from the exclusion fetch). `executeOnce` |
| `Code in JavaScript1` | code | Filters out URLs already in the DB. `executeOnce` |
| `Code in JavaScript2` | code | **Identical logic to the previous node.** Re-reads from `Code in JavaScript`, so it doesn't even chain. Redundant |
| `Create a row` | supabase | Inserts new rows, `autoMapInputData`. No skip guard for empty input |

### Classification

| Node | Type | Does |
|---|---|---|
| `Get unclassified` | supabase | Filter `relevance_score IS NULL`. `executeOnce` |
| `Message a model1` | langchain.anthropic v1 | Claude `claude-sonnet-4-6` classifies each row. Credential `0VsjL5YULq7SwA3O` |
| `Code in JavaScript3` | code | Parses Claude's JSON (handles four possible response shapes), strips code fences, **pairs responses to rows by array index**, sets `is_verified_active: true`, writes `relevance_score: -1` on parse failure |
| `Update a row` | supabase | Updates by `id`, `autoMapInputData` |

## Wiring, as it actually is

```
Trigger → Get Existing URLs → Build Exclusion List → Perplexity Cat8
                                                          ↓
Cat1  → Merge [0]                                    Merge [5]
Cat3  → Merge [0]   ← collides with Cat1
Cat2  → Merge [1]
        Merge [2]   ← empty
Cat4–12 → Merge [3]…[11]
                          ↓
Merge All Results → Code in JavaScript → Get many rows → Code in JavaScript1
   → Code in JavaScript2 → Create a row → Get unclassified → Message a model1
   → Code in JavaScript3 → Update a row
```

**Two wiring defects:** only Cat8 fires, so 11 of 12 categories never run. And Cat1 and Cat3 share Merge input 0 while input 2 sits empty.

---

# Workflow 2 — `1waLzKfHTHeMRvs9`

**Name:** "The Circle — Classify Staging Batch"
**Description:** One-off classification pipeline for `staging_clean.json`. Loop batches of 10 → Claude classifier → merge with row → insert to `global_initiatives`
**Nodes:** 8 · **Active:** false, manual trigger only
**Created:** 2026-07-04 · **Last updated:** 2026-07-04

## What it does

A **one-off backfill**, not a recurring pipeline. Takes already-discovered initiatives pasted directly into a code node, classifies them in batches of 10, and inserts them. Built the day of the 2026-07-04 session — the same session that ran the URL liveness audit and decided the Tavily + Haiku pivot.

Skips discovery and dedup entirely. It exists to classify a batch that was researched elsewhere.

## Node inventory

| Node | Type | Does |
|---|---|---|
| `Start` | manualTrigger | Manual run only |
| `Load Staging JSON` | code | **Data is pasted inline into the code itself.** Currently holds 13 Ocean & water initiatives from `deep_research_batch_2026-07-03` and `deep_research_israel_2026-07-03`. Throws if the array is empty |
| `Loop 10 at a time` | splitInBatches v3 | Batch size 10. Output 0 → `Done`, output 1 → classifier |
| `Classify Initiative` | langchain.chainLlm v1.9 | The classifier chain. Internal batching: **5 at a time, 500ms delay** |
| `Claude Sonnet 4.6` | lmChatAnthropic v1.5 | Sub-node model. `maxTokensToSample: 2000`, **`temperature: 0.2`**. Credential `T7Xa9V6dU1QKqzNo` |
| `Merge Classification with Row` | code, runOnceForEachItem | Strips code fences, parses JSON, **merges original row + defaults + classification**, stamps `date_discovered` as today. Falls back to an all-null defaults object on parse failure |
| `Insert to global_initiatives` | supabase | Inserts. Ignores `_classification_error, _raw_llm_output, confidence, confidence_reason, _note, source, status, activity_evidence_url` |
| `Done` | set | Emits "Batch classification complete" |

## Wiring

```
Start → Load Staging JSON → Loop 10 at a time
                                 ├─[0]→ Done
                                 └─[1]→ Classify Initiative ← Claude Sonnet 4.6 (ai_languageModel)
                                            ↓
                                   Merge Classification with Row
                                            ↓
                                   Insert to global_initiatives
                                            ↓
                                   Loop 10 at a time  (loops back)
```

## How it differs from Workflow 1

| | Workflow 1 | Workflow 2 |
|---|---|---|
| Input | Perplexity discovery | JSON pasted into a code node |
| Dedup | Yes, against DB | **None** — relies on the `url` UNIQUE constraint to reject dupes |
| Model node | `anthropic` v1 | `chainLlm` + `lmChatAnthropic` sub-node |
| Temperature | not set | **0.2** |
| Pairing | by array index | **by item**, `runOnceForEachItem` — safer |
| Missing fields | omitted | filled with an explicit **defaults object** |
| `is_verified_active` | set `true` | **not set** — rows land NULL |
| `date_discovered` | from the prompt | stamped in code |
| Credential | `0VsjL5YULq7SwA3O` | `T7Xa9V6dU1QKqzNo` |

**Workflow 2's item-level pairing and defaults object are the better design.** Workflow 1's index pairing is the known fragility (S-50). If the pipeline is ever revived, port Workflow 2's approach.

⚠️ **Workflow 2 not setting `is_verified_active` is the likely origin of the ~127 NULL rows** recorded in S-76. Those rows were later resolved; the mechanism was never confirmed. This is a plausible explanation.
