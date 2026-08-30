# Contracts — Close the Circle ↔ Supabase EXAI

**Shapes, names and rules. No row counts, no coverage percentages, no "as of" numbers.** For anything numeric, run `state.sql`.

**Project:** EXAI `qjqqyvpqkbljngmhxahl` · **Schema:** `public` · **RLS:** enabled on all tables
**Verified against live:** 2026-08-30

**Absorbs and retires** `data_contract_spec.md` (v1.2) and `supabase_schema_documentation.md` (v1.1). Both mixed contracts with state; delete them.

Decisions live in `decisions.md`. App behaviour lives in `app_spec.md`. When live and contract disagree, that is a bug in one of them — record it here with the Linear issue that resolves it. **Never leave a known divergence silent.**

---

## 1. Object inventory

**Tables (8)** — `global_initiatives` · `facebook_communities` · `financial_benefits` · `artists` · `artworks` · `sources` · `artwork_sources` · `tags`

**Views (2)** — `v_activities` · `artwork_principle_scores`

**Not yet created** — `sessions` · `session_events` · `email_captures` · `saves` (S-119) · `tag_families` · `family_adjacency` · `artwork_activity` (S-122)

---

## 2. `v_activities` — the only object the visitor app queries

UNION ALL of both initiative tables, each side filtered to `is_verified_active = true AND relevance_score IS NOT NULL` (D1 interim).

**Live columns:** `id · activity_kind · name · url · category · description · how_to_join · activity_evidence · audience · language · location · participation_type · exhibition_themes · materials · process · community_archetype · impact_tags · technical_circularity · spiritual_grounding · community_engagement · systems_awareness · regenerative_intention · activity_type · skill_level · time_commitment · effort · cost · format · target_audience · visitor_action · relevance_score · is_commercial · draws`

`is_verified_active` appears in the `WHERE`, not the `SELECT` — correct, not a gap.

### ⚠️ Divergences from the original spec — S-117

| Spec said | Live is | Consequence |
|---|---|---|
| `source_table` | `activity_kind` | column rename in app or view |
| value `'facebook_community'` | **`'fb_community'`** | `showCommunityMessage` fails on the value too |
| `region` derived | **missing** | blocks the reach sub-filter |
| `energy_level` derived | **missing** | blocks the energy filter entirely |

**Derivations still to add:**
```sql
CASE WHEN location ILIKE 'israel%' THEN 'israel' ELSE 'global' END AS region,
CASE WHEN effort IN ('less_than_a_minute','up_to_10_minutes') THEN 'low_key'
     WHEN effort = '1_hour'    THEN 'hands_on'
     WHEN effort = 'dedicated' THEN 'deep_work' END AS energy_level
```

⚠️ `location` is unnormalized — `Global`, `Global - Online`, `Israel`, `Israel - National`, `Israel - Israel` all occur. The `ILIKE` rule works on current values but is fragile.

⚠️ **The `energy_level` bucketing above is unbalanced** — the middle bucket lands near 6% of the catalogue. Fix in the same view rewrite. S-127.

### ⚠️ Security — S-116

Both views are owned by `postgres` with `reloptions = null`, so `security_invoker` is **off**. They run with definer semantics and **reads bypass base-table RLS entirely** — the `WHERE` clause above is currently the only gate.

```sql
ALTER VIEW v_activities             SET (security_invoker = on);
ALTER VIEW artwork_principle_scores SET (security_invoker = on);
```

`artwork_principle_scores` additionally reports `is_updatable = YES` / `is_insertable_into = YES` with `anon` holding write grants — a probable write path into `tags`. (`v_activities` is a UNION ALL and reports NO.)

**Historical note:** the original spec asserted that views execute with the querying role's rights. That is false by default, and the error is why this went unnoticed for six weeks.

---

## 3. Five-principle vocabulary — LOCKED

```
technical_circularity · spiritual_grounding · community_engagement
systems_awareness · regenerative_intention
```

Numeric 0–1. On activities as top-level columns on both initiative tables. On artworks as rows in `tags` where `dimension = 'exhibition_principle'`, surfaced via `artwork_principle_scores` (validated only).

Never rename. Never add a sixth without a new decision.

---

## 4. Initiative tables

Both: PK `id uuid`, UNIQUE `url`. The UNIQUE constraint is the source of 409s on duplicate insert.

**36 shared columns** (verified 2026-08-30) — this is what makes the UNION work:

| Group | Columns |
|---|---|
| text | `name` `url` `category` `description` `how_to_join` `activity_evidence` `audience` `language` `location` `visitor_action` `activity_type` `skill_level` `time_commitment` `effort` `cost` `format` `target_audience` |
| text[] | `participation_type` `exhibition_themes` `materials` `process` `community_archetype` `impact_tags` `draws` |
| numeric | the five principles |
| other | `id` `relevance_score` int · `is_commercial` `is_verified_active` bool · `date_discovered` date · `created_at` `updated_at` timestamptz |

**`global_initiatives` only (4):** `artwork_correlations` jsonb (legacy framework scores, superseded by the numeric columns) · `source` text default `'sonar'` · `category_group` text (unused) · `last_verified` date

**`facebook_communities` only (4):** `community_type` · `privacy` · `estimated_size` · `source_url`

**Not yet added:** `name_he` `description_he` `how_to_join_he` `visitor_action_he` `translation_status` (S-71) · `return_type` (proposed, S-126) · `curator_status` (proposed, D20/S-124)

---

## 5. Controlled vocabularies

| Field | Values |
|---|---|
| `activity_type` | workshop · volunteer · course · event · ongoing_initiative · cause · spread_the_word · self_serve |
| `skill_level` | beginner · intermediate · advanced · all_levels |
| `time_commitment` | one_time · weekly · monthly · seasonal · flexible |
| `effort` | less_than_a_minute · up_to_10_minutes · 1_hour · dedicated |
| `cost` | free · donation_based · paid |
| `format` | in_person · online · hybrid |
| `target_audience` | families · professionals · students · all_ages |
| `exhibition_themes` | back_to_nature · everyday_circle · healing_through_design |
| `draws` | explore · make · meet · exchange · amplify · witness |
| `activity_kind` (view) | initiative · **fb_community** |

**Uncontrolled by design:** `materials` · `process` · `community_archetype` · `impact_tags`. Free-form arrays with a head-heavy distribution — a small number of values covers the large majority of instances, which is what makes the family-graph approach (D15) tractable. **Do not lock these retroactively.** Run `state.sql` Q7 for the current shape.

**Signal quality:** only `effort` and `format` discriminate usefully. `time_commitment`, `activity_type`, `skill_level`, `cost` carry almost no signal — do not build filters on them. `effort` is heavily skewed toward `dedicated` (S-127, D18).

---

## 6. Filter contracts

OR within a section, AND across sections. **Empty selection = no constraint** — locked principle.

| Filter | UI options | Column | State |
|---|---|---|---|
| Draws | explore · meet · make · amplify · exchange · witness | `draws text[]` | ✅ 1:1, no mapping |
| Energy | low-key · hands-on · deep-work | `energy_level` | ❌ column missing (S-117); bucketing unbalanced (S-127) |
| Where | physical · digital (hybrid both) | `format` | ✅ `physical`→`in_person`, `digital`→`online` |
| Reach | israel · global | `region` | ❌ column missing (S-117) |
| Artworks | 6 mock artworks | `connectedArtworks` | ⚠️ **no effect on results** per D4 |

UI ids use hyphens (`low-key`); view values use underscores (`low_key`). One constants rename.

---

## 7. `financial_benefits`

PK `id`, UNIQUE `slug`. Bilingual by column. **Live and seeded**; anon SELECT on `is_active = true`. Rewire tracked in S-67.

`slug` · `name_en/he` · `description_en/he` · `benefit_summary_en/he` · `benefit_type` · `provider` · `url` · `how_to_start_en/he` · `icon` · `sort_order` · `is_active` · `created_at` · `updated_at`

**`benefit_type` CHECK allows six values:** `improved_terms · alternative_currency · discount · income_generation · savings · cashback`

⚠️ The app's badge mapping covers only the first four. Confirm the last two are unused, or extend the mapping.

Created via `execute_sql`, so absent from the migrations list — D10.

---

## 8. Artwork layer

```
artists (1) ──< artworks (N)     artworks.artist_id → artists.id      ON DELETE RESTRICT
artworks (1) ──< tags (N)        tags.artwork_id → artworks.id        ON DELETE CASCADE
artworks (N) >──< sources (N)    via artwork_sources                  ON DELETE CASCADE
```

**Dedup keys:** `artists.name` · `artworks.slug` · `sources.url_hash` · `tags (artwork_id, dimension, value)`

| Table | Key columns |
|---|---|
| `artists` | `name` UNIQUE · `name_he` · `bio` · `socials` jsonb |
| `artworks` | `slug` UNIQUE · `artist_id` · `title_he` NOT NULL · `title_en` · `year` · `exhibition_section` · `declared_materials[]` · `declared_process[]` · `curator_notes` · `media_refs` jsonb · `raw_corpus` |
| `sources` | `url` · `url_hash` UNIQUE · `title` · `source_type` · `origin` · `content_text` · `language` · `fetched_at` |
| `artwork_sources` | PK (`artwork_id`, `source_id`) · `source_relation` |
| `tags` | `artwork_id` · `dimension` · `value` · `cluster_type` · `reasoning` · `score` · `confidence` · `match_score` · `sources` jsonb · `status` · `validated_by` · `validated_at` |

### CHECK constraints

| Column | Allowed |
|---|---|
| `tags.dimension` | process · materials · community · design · impact · exhibition_principle |
| `tags.cluster_type` | declared · inferred · emergent |
| `tags.status` | pending · validated · curator_review · rejected |
| `tags.score` / `confidence` / `match_score` | 0 ≤ x ≤ 1 |
| `sources.source_type` | artist_statement · interview · academic · institutional_page · review · news · community_page · social_post · uploaded_file · other |
| `sources.origin` | uploaded · found_by_agent |
| `artwork_sources.source_relation` | direct · secondary · indirect |

⚠️ `media_refs` holds **external hotlinks** — Shopify CDN, Ynet picserver, Mako, asif.org, and a non-public Drive folder. Migrating to Storage paths per D16 / S-121.

---

## 9. Matching contract (D15)

```
relevance = w₁ · principle_alignment + w₂ · tag_affinity
```

- Tag similarity: same tag `1.0` · same family `0.6` · adjacent family `0.3`
- **IDF weighting required** — high-frequency tags otherwise match nearly everything
- Each artwork tag weighted by its `match_score` and `cluster_type` (declared > inferred > emergent)
- `artwork_activity` junction holds curator **exceptions** only — `source` (`curated` | `vetoed`), `curator_note`. Explicit link wins over score; veto removes permanently
- Starting split w₁:w₂ = 30/70 (D11 open)

Rationale: artworks are sparse on principles and dense on tags — the reverse of the original assumption. Five-dimensional similarity against one or two populated dimensions returns noise.

---

## 10. Visitor tables — NOT YET ON EXAI (S-119)

Exist only on the Lovable dummy project, empty, and **diverge from spec**. Do not port as written.

| Table | Required columns |
|---|---|
| `sessions` | `id` uuid PK (client-generated) · `lang` · `entry_source` · `user_agent_hint` · `created_at` · `user_id` → auth.users (D21) |
| `session_events` | `id` · `session_id` · `event_type` · **`activity_id`** · `payload` jsonb · `created_at` |
| `email_captures` | `id` · `session_id` · `email` · `touchpoint` · `lang` · **`consented_updates`** bool default false · `created_at` · UNIQUE (`session_id`, `email`) |
| `saves` | PK (`session_id`, `activity_id`) · `activity_kind` · `created_at` |

**Missing in the built version:** `sessions.lang`, `sessions.entry_source`, `session_events.activity_id`, `email_captures.consented_updates`, `email_captures.lang`, the UNIQUE constraint, and `saves` entirely.

⚠️ `user_agent_hint` means **coarse device class only, no fingerprinting.** The built column is named `user_agent`, which invites storing the full string.

### 10a. Event vocabulary — what `session_events` must record

| `event_type` | `activity_id` | `payload` | Answers |
|---|---|---|---|
| `session_start` | — | `{}` | how many visits |
| **`close_circle`** | **required** | `{}` | **how many clicked through, and to what** |
| **`share`** | when sharing an activity | `{ channel, target }` | **how many shares, via which channel, of what** |
| `initiative_save` / `initiative_unsave` | required | `{}` | what gets saved, what gets dropped |
| `artwork_save` / `artwork_unsave` | artwork id | `{}` | which artworks resonate |
| `initiative_view` | required | `{}` | what gets opened but not acted on |
| `filter_set` | — | `{ section, values }` | what visitors are looking for |
| `results_scroll_depth` | — | `{ depth }` | whether results are read |
| `email_shown` / `email_captured` / `email_dismissed` | — | `{ touchpoint }` | which ask works |

**`share` payload:**
```json
{ "channel": "whatsapp | email | copy | native",
  "target":  "activity | app | saved_list | artwork" }
```

⚠️ **Channel vocabulary is set by the built code** (`ShareMenu.tsx`): `whatsapp` · `email` · `copy` · `native`. Earlier drafts of this contract said `copy_link` / `native_share`; the built values win unless deliberately renamed.

`channel` = which button. `target` = what was shared — **not currently sent**; `ActivityCard` passes only `{ id, channel }`. The Web Share API reports only `native` — the OS never reveals the destination — so **explicit in-app buttons log precisely while the native sheet collapses into one bucket.** Prefer explicit buttons if per-channel data matters.

Log shares on **tap (intent)**, not completion — completion isn't reliably detectable. No content or recipient data ever recorded.

**`close_circle` is the redirect click** — the visitor leaving for the initiative's own site. The app's single conversion event.

⚠️ **Divergences (S-68):** `close_circle` is not in the built code at all · the built union says `initiative_share` where this contract says `share` · `session_events` has no `activity_id` column, so most events above currently couldn't carry one · share events omit `target`.

✅ **Already wired:** `ShareMenu` fires `onShare(channel)` on all four paths and `ActivityCard` passes `logEvent('initiative_share', { id, channel })`. Only `logEvent` itself is stubbed.

### 10b. Permission contract — the two groups are opposites

| | anon read | anon write |
|---|---|---|
| Content tables + views | ✅ | ❌ |
| Visitor tables | ❌ | ✅ INSERT only |

⚠️ **A blanket revoke would silently break every save and email capture.** Name content tables individually (S-116).

⚠️ **Never `USING (true)` on `email_captures`** — the built migration does exactly that, exposing every captured address to anyone with the anon key. Service role reads for export.

Saves are private to their own session. Aggregate counts via a security-definer function or a public counts view.

---

## 11. Hebrew layer contract

- Add to both initiative tables: `name_he` `description_he` `how_to_join_he` `visitor_action_he` + `translation_status` (`pending` / `machine` / `reviewed`)
- Expose in `v_activities`; app selects `_he` with `COALESCE` fallback per field
- Vocabulary values are **not** translated in the DB — `vocabDisplay.ts` handles them
- Hebrew-native rows (`name ~ '[א-ת]'`): copy `name → name_he` as-is. **Never round-trip Hebrew through English**
- Validation gate before any status flip: all fields non-empty · Hebrew characters present · length ratio 0.4×–2.5× · no leaked instruction text
- D6 open: whether HE display before review is allowed

⚠️ Recount the Hebrew-native vs English split before running — run `state.sql` Q2. The earlier estimate predates substantial growth in the Facebook table.

---

## 12. Operational rules

- **`execute_sql` for all DDL and DML** — `apply_migration` is unreliable on this project. Rationale and consequences: README → *Database change path*
- `SELECT COUNT(*)` for row counts, never `list_tables` statistics (`reltuples` is stale)
- Check project status with `get_project` before querying; restore if `INACTIVE`
- The Lovable dummy project is unreachable via Supabase MCP — use `Lovable:query_database` with the Lovable project ID
- Close all n8n browser tabs before MCP writes — the UI cache silently overwrites node-level edits
- Lovable owns `src/`. Never hand-edit while a Lovable prompt runs
- Run the classifier prompt verbatim before any initiative insert, so tag vocabulary matches existing rows
- Israeli repair initiatives operate under two names — קפה תיקון and בר תיקון. Searching one undercounts
