# n8n Workflows — Flow Documentation

**Extracted:** 2026-09-28 from live n8n (instance `exai.app.n8n.cloud`)
**Purpose:** record what each workflow does, node by node. Prompts live in `n8n_prompts.md`. Open items live in `n8n_gaps.md`.

All workflows are **inactive** and run on demand: from their form, or manually in the n8n editor. Nothing is scheduled.

⚠️ **Close all n8n browser tabs before any MCP write.** The UI cache silently overwrites node-level changes.

---

## Map

```
Discovery form ──┐                                   ┌─> Classify ──> Translate to Hebrew ──> D4b Nearest City
                 ├─> dedup ─> liveness ─> insert ────┤        (each is a sub-workflow; each selects its own
Add Links form ──┘            (pending)              │         rows by status, so each is also rerunnable alone)
                                                     └─> Run Summary (cost + outcome per run)
```

Every new row lands with `curator_status = 'pending'` and is invisible to `v_activities` until approved (see "Approving rows").

| Workflow | ID | Role |
|---|---|---|
| The Circle — Discovery | `maili5sVWycFyQ0i` | Finds new initiatives with Claude web search |
| The Circle — Add Links | `Q9goXorlxj0vps7L` | Adds up to 5 links a curator found |
| The Circle — Classify | `xf490HVAL7XhX5zc` | Sub-workflow: tags, draws, 5 principle scores, location |
| The Circle — Translate to Hebrew | `wcP5gs4snAb81msf` | Sub-workflow: `name_he`, `description_he` |
| The Circle — D4b Nearest City | `W0VK7jEefw9Fzioi` | Sub-workflow: `nearest_city` for Israeli physical/hybrid rows |
| The Circle — D4a Geocode Cities | `J2iysuC9OTuZScZZ` | One-off: coordinates for `il_cities` |
| The Circle — Vocabulary Gate | `a1o2K8y5pFDxa1PZ` | Separate concern: materials tags against Getty AAT |

**Archived 2026-09-28** (restorable from n8n's Archived view): `Vnoy1WxaEQrOwwJT` EXAI Workflow (12 Perplexity nodes; Perplexity retired its Sonar chat-completions API on 2026-09-27) and `1waLzKfHTHeMRvs9` Classify Staging Batch. `WILlmVNe2TXrz6AK` exai-workflow (old copy from 2 March) is not open to the MCP connector — archive by hand.

**Credentials:** Supabase `BfA4Ac77KpWcwy3y` ("Supabase account", service role) · Anthropic `T7Xa9V6dU1QKqzNo` ("Anthropic account 3", Netta's own key).

---

# The Circle — Discovery · `maili5sVWycFyQ0i`

**Trigger:** n8n form "The Circle — Run Discovery".

| Form field | Values |
|---|---|
| Scope (required) | `Israel` or `Global` — one scope per run, never mixed (Netta, 2026-09-28) |
| Categories | Checkboxes for the 12 categories; empty = all 12 |
| Max new results per category | 1–5, default 5 |

| Node | Type | Does |
|---|---|---|
| `Get Existing Initiatives` / `Get Existing Facebook Communities` | HTTP GET, `executeOnce` | name, url, category of every row, newest first |
| `Build Prompts` | code | **One template for all categories.** Holds the category table (name + search ideas). Builds one prompt per chosen category, with that category's 40 most recent names as the exclusion list |
| `Discover (Claude web search)` | HTTP POST `api.anthropic.com/v1/messages` | `claude-sonnet-5`, `max_tokens` 8000, tool `web_search_20250305` with `max_uses: 3`. One call per category, 1 s apart. No retries |
| `Parse and Dedup` | code | Pulls every complete `{…}` object from the answer (survives a cut-off answer). Normalises URLs (lower case, no protocol, no `www.`/`m.`, no tracking parameters, no trailing slash) and drops anything already in either table or repeated in the run. Forces the location into the run's scope. Emits one `call` item per category with tokens and searches |
| `New Candidate?` | if | Candidates that are not duplicates |
| `Liveness Check` | HTTP GET the URL | 15 s timeout, 5 at a time, never errors |
| `Judge Liveness` | code | Alive = 2xx/3xx, or 401/403/429/999 (site blocks bots but is up) |
| `Alive?` → `Insert as Pending` | HTTP POST `global_initiatives` | name, url, category, description, participation_type, how_to_join, activity_evidence, audience, language, location, `date_discovered` = today, `source = 'claude_web_search'`. `curator_status` and `translation_status` take their defaults (`pending`) |
| `Classify New Rows` → `Translate to Hebrew` → `Set Nearest City` | Execute Workflow, `executeOnce`, wait | The three sub-workflows, in that order |
| `Run Summary` | code | Categories run, call errors, candidates, duplicates, dead links, inserted, web searches, tokens, `discovery_cost_usd_estimate` |

**Measured cost (2026-09-28):** Israel · Community commons, max 5 → 3 searches, 28.7k in / 3.1k out tokens, 2 rows inserted, **$0.12**. About $0.06 per new row; a full 12-category run ≈ $1.50. Classify + Hebrew + city add about $0.01 per row.

**Adding a category (D3):** add one line to `CATEGORIES` in `Build Prompts` and one checkbox to the form. Also add it to the Add Links form and to the category list in its `Parse Link` node.

---

# The Circle — Add Links · `Q9goXorlxj0vps7L`

**Trigger:** n8n form "The Circle — Add Links": Link 1 (required) to Link 5, Category (optional, "Let Claude decide" by default, applies to all links), Notes (optional, e.g. a Facebook group's About text).

| Node | Type | Does |
|---|---|---|
| `Get Existing …` ×2 | HTTP GET, `executeOnce` | name, url of every row |
| `Prepare Links` | code | One item per filled link; adds `https://` if missing; same URL normalisation as Discovery; marks duplicates; Facebook URLs → `facebook_communities`, all others → `global_initiatives` |
| `Not in Catalogue?` | if | Duplicates go to `Already in Catalogue` and cost nothing |
| `Fetch Page` | HTTP GET | 20 s timeout, never errors |
| `Build Read Prompt` | code | Strips scripts/styles/tags, keeps meta descriptions, first 12,000 characters. Marks a non-Facebook link dead on 404/410/5xx/no response |
| `Read Link (Claude)` | HTTP POST Anthropic | `claude-sonnet-5`, `max_tokens` 3000, `web_search` `max_uses: 2` as a fallback when the page text is not enough (login walls) |
| `Parse Link` | code | Outcome per link: added / dead link / could not read. Category from the form, else Claude's pick from the 12 |
| `Readable?` → `Insert as Pending` | HTTP POST to the row's table | Same fields as Discovery (no `source` column on `facebook_communities`) |
| `Classify New Rows` → `Translate to Hebrew` → `Set Nearest City` → `Run Summary` | | As in Discovery. The summary lists each link's result and `read_cost_usd_estimate` |

**Measured cost (2026-09-28):** one website (kaima.org.il) → $0.04; two duplicates → $0.

**Facebook:** pages and groups sit behind a login wall, so today they are described from the Notes field plus a web search. Reading public pages and groups through Apify is backlog (needs an Apify token).

---

# The Circle — Classify · `xf490HVAL7XhX5zc`

**Triggers:** `Start (manual test)` and `When Called by Pipeline` (Execute Workflow Trigger, passthrough).
**Selects:** rows in either table with `relevance_score IS NULL` and `curator_status = 'pending'`, oldest first, 25 per table per run.

| Node | Does |
|---|---|
| `Get Unclassified Initiatives` / `… Facebook Communities` → `Tag …` → `All Unclassified` | Rows of both tables, tagged with their table name |
| `Classify (Claude)` + `Claude Sonnet 5` | chainLlm, batch 5, 500 ms apart. `claude-sonnet-5`, temperature 0.2, `maxTokensToSample` 1200, thinking off, no retries. Prompt: `n8n_prompts.md` §2 |
| `Parse and Validate` | Per item, paired to its row via `$('All Unclassified').item` (not by index). Enforces every closed vocabulary, 0–1 scores rounded to 3 decimals, `draws` ⊂ the 6 values (at least 1), themes ⊂ the 3 values, `location` shape, `relevance_score` 1–5. Tag arrays normalised to snake_case, deduped |
| `Valid?` → `Save Classification` | PATCH by `id`. Invalid rows go to `Needs Retry` and stay unclassified, so the next run retries them. No `-1` sentinel |

Writes the **five principle scores** (kept by decision, 2026-09-28) but runs **no artwork matching**.

---

# The Circle — Translate to Hebrew · `wcP5gs4snAb81msf`

**Triggers:** `Start` and `When Called by Pipeline`.
**Selects:** `translation_status = 'pending'` in both tables (currently up to 140 + 60 per run).

`Translate to Hebrew (Claude)` — chainLlm on `claude-sonnet-5`, `maxTokensToSample` 600, thinking off, batch 5, 500 ms apart, no retries. `Parse and Validate` — Hebrew present, length 0.25–2.5× the source, no leaked instructions; Hebrew-only source names are copied as-is. `Save Hebrew` PATCHes `name_he`, `description_he`, `translation_status = 'machine'`. Failures stay `pending`.

Backfill of all 372 rows completed 2026-09-28 (see CHANGELOG).

---

# The Circle — D4b Nearest City · `W0VK7jEefw9Fzioi`

Unchanged from 2026-09-27 except the new `When Called by Pipeline` trigger and `executeOnce` on both reads. Selects `location ILIKE 'Israel%'`, `format IN ('in_person','hybrid')`, `geo_precision IS NULL`. Vague locations → national; places → Nominatim → `set_nearest_city()`.

---

## Approving rows

Until a curator screen exists (backlog), approval is SQL. `v_activities` requires **both** flags:

```sql
update global_initiatives
set curator_status = 'approved', is_verified_active = true
where id = '…';
-- same for facebook_communities
```

Reject: `set curator_status = 'rejected'`.
