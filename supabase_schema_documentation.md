# Supabase Schema Documentation — The Circle / המעגל

**Project:** EXAI (`qjqqyvpqkbljngmhxahl`)
**Schema:** `public`
**Doc version:** v1.0
**Generated:** 2026-07-15 (live pull via Supabase MCP — `list_tables` verbose + `COUNT(*)` verification)
**Tables:** 7
**RLS:** Enabled on all tables

---

## 1. Overview

Two table groups serve The Circle exhibition at Design Museum Holon:

**Initiatives layer** (visitor matching engine):
- `global_initiatives` — global + Israeli sustainability initiatives, discovered via n8n pipeline + manual curation
- `facebook_communities` — Israeli Facebook communities, identical classification columns for UNION-based matching

**Artwork layer** (artwork tagging pipeline — analyst → validator → writer skills):
- `artists`, `artworks`, `sources`, `artwork_sources` (junction), `tags`

Both layers share the five-principle vocabulary as numeric score columns:
`technical_circularity`, `spiritual_grounding`, `community_engagement`, `systems_awareness`, `regenerative_intention`

---

## 2. Live row counts (verified via COUNT(*), 2026-07-15)

| Table | Rows | Notes |
|---|---|---|
| `global_initiatives` | 276 | 276/276 classified, 12 distinct categories |
| `facebook_communities` | 86 | 86/86 classified, 8 distinct categories |
| `artists` | 3 | |
| `artworks` | 3 | |
| `sources` | 44 | |
| `artwork_sources` | 44 | |
| `tags` | 59 | |

⚠️ `list_tables` statistics reported 0 rows for the two initiative tables — Postgres `reltuples` is stale. Always verify with `SELECT COUNT(*)`.

---

## 3. Relationships

```
artists (1) ──< artworks (N)                    [artworks.artist_id → artists.id]
artworks (1) ──< tags (N)                       [tags.artwork_id → artworks.id]
artworks (N) >──< sources (N)                   via artwork_sources
                                                [artwork_sources.artwork_id → artworks.id]
                                                [artwork_sources.source_id → sources.id]

global_initiatives — standalone (no FKs)
facebook_communities — standalone (no FKs)
```

Initiative↔artwork matching happens at query time via shared five-principle score columns and tag vocabulary, not via foreign keys.

---

## 4. Table: `global_initiatives`

Primary key: `id`
Unique: `url`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `name` | text | no | | |
| `url` | text | no | | **UNIQUE** — source of 409 errors on duplicate insert |
| `category` | text | no | | One of the 12 category names |
| `description` | text | yes | | 2–3 sentences |
| `participation_type` | text[] | yes | | ⚠️ **ARRAY** (was documented as text in n8n doc v0.3) — community / direct_action / content / organization / platform / event |
| `how_to_join` | text | yes | | Specific action |
| `activity_evidence` | text | yes | | Recency evidence |
| `audience` | text | yes | | |
| `language` | text | yes | | |
| `exhibition_themes` | text[] | yes | | back_to_nature / everyday_circle / healing_through_design |
| `artwork_correlations` | jsonb | yes | | Legacy home of `framework_scores` (BUG-003) — superseded by the 5 numeric columns below |
| `relevance_score` | integer | yes | | 1–5; NULL = not yet classified |
| `is_commercial` | boolean | yes | `false` | |
| `is_verified_active` | boolean | yes | | Set `true` by classifier |
| `source` | text | yes | `'sonar'` | Discovery source |
| `category_group` | text | yes | | Defined but unused |
| `date_discovered` | date | no | | Used by exclusion-list sort |
| `last_verified` | date | yes | | |
| `created_at` | timestamptz | yes | `now()` | Used for `orderBy` in n8n Supabase nodes (pagination stability fix) |
| `updated_at` | timestamptz | yes | `now()` | |
| `activity_type` | text | yes | | workshop / volunteer / course / event / ongoing_initiative / cause / spread_the_word / self_serve |
| `skill_level` | text | yes | | beginner / intermediate / advanced / all_levels |
| `time_commitment` | text | yes | | one_time / weekly / monthly / seasonal / flexible |
| `effort` | text | yes | | less_than_a_minute / up_to_10_minutes / 1_hour / dedicated |
| `cost` | text | yes | | free / donation_based / paid |
| `format` | text | yes | | in_person / online / hybrid |
| `target_audience` | text | yes | | families / professionals / students / all_ages |
| `location` | text | yes | | e.g. "Israel - Tel Aviv", "Global - Online" |
| `visitor_action` | text | yes | | One-verb sentence |
| `technical_circularity` | numeric | yes | | Five-principle score (BUG-003 migration **done** — top-level columns exist) |
| `spiritual_grounding` | numeric | yes | | |
| `community_engagement` | numeric | yes | | |
| `systems_awareness` | numeric | yes | | |
| `regenerative_intention` | numeric | yes | | |
| `materials` | text[] | yes | | Secondary tag dimension |
| `process` | text[] | yes | | Secondary tag dimension |
| `community_archetype` | text[] | yes | | Secondary tag dimension |
| `impact_tags` | text[] | yes | | Secondary tag dimension |

**Total columns:** 39 (vs. 30 in n8n doc v0.3 — the 5 principle columns + 4 tag-dimension arrays were added since).

---

## 5. Table: `facebook_communities`

Primary key: `id`
Unique: `url`

Mirrors `global_initiatives` classification columns for UNION-based matching, plus Facebook-specific fields. No FKs.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `name` | text | no | | |
| `url` | text | no | | **UNIQUE** |
| `category` | text | yes | | |
| `description` | text | yes | | |
| `participation_type` | text[] | yes | | ARRAY |
| `how_to_join` | text | yes | | |
| `activity_evidence` | text | yes | | |
| `audience` | text | yes | | |
| `language` | text | yes | | |
| `date_discovered` | date | yes | `CURRENT_DATE` | |
| `community_type` | text | yes | | FB-specific |
| `privacy` | text | yes | | FB-specific (public / private) |
| `estimated_size` | text | yes | | FB-specific |
| `location` | text | yes | | |
| `source_url` | text | yes | | Where the community was found |
| `technical_circularity` | numeric | yes | | Five-principle scores |
| `spiritual_grounding` | numeric | yes | | |
| `community_engagement` | numeric | yes | | |
| `systems_awareness` | numeric | yes | | |
| `regenerative_intention` | numeric | yes | | |
| `materials` | text[] | yes | | Tag dimensions |
| `process` | text[] | yes | | |
| `community_archetype` | text[] | yes | | |
| `impact_tags` | text[] | yes | | |
| `exhibition_themes` | text[] | yes | | |
| `activity_type` | text | yes | | Same vocabularies as global_initiatives |
| `skill_level` | text | yes | | |
| `time_commitment` | text | yes | | |
| `effort` | text | yes | | |
| `cost` | text | yes | | |
| `format` | text | yes | | |
| `target_audience` | text | yes | | |
| `visitor_action` | text | yes | | |
| `relevance_score` | integer | yes | | |
| `is_commercial` | boolean | yes | | |
| `is_verified_active` | boolean | yes | `false` | |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

**Total columns:** 39. Columns absent vs. `global_initiatives`: `artwork_correlations`, `source`, `category_group`, `last_verified`. Columns extra: `community_type`, `privacy`, `estimated_size`, `source_url`.

---

## 6. Table: `artists`

Primary key: `id`
Unique: `name`
Referenced by: `artworks.artist_id`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `name` | text | no | | **UNIQUE** — dedup key for writer-skill upserts |
| `name_he` | text | yes | | Hebrew display name |
| `bio` | text | yes | | |
| `socials` | jsonb | yes | `'[]'` | Array of social links |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

---

## 7. Table: `artworks`

Primary key: `id`
Unique: `slug`
FK: `artist_id → artists.id`
Referenced by: `tags.artwork_id`, `artwork_sources.artwork_id`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `slug` | text | no | | **UNIQUE** — pipeline file naming ({slug}_analysis.json etc.) |
| `artist_id` | uuid | yes | | FK → artists |
| `title_he` | text | no | | Hebrew title (required) |
| `title_en` | text | yes | | |
| `year` | integer | yes | | |
| `exhibition_section` | text | yes | | |
| `declared_materials` | text[] | yes | | From artist/curator materials |
| `declared_process` | text[] | yes | | |
| `curator_notes` | text | yes | | |
| `media_refs` | jsonb | yes | `'[]'` | |
| `raw_corpus` | text | yes | | Full research corpus text |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

---

## 8. Table: `sources`

Primary key: `id`
Unique: `url_hash`
Referenced by: `artwork_sources.source_id`

| Column | Type | Nullable | Default | Check constraint |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | |
| `url` | text | yes | | Nullable — uploaded files may have no URL |
| `url_hash` | text | yes | | **UNIQUE** — dedup key; synthetic hash for uploaded sources without URL |
| `title` | text | yes | | |
| `source_type` | text | no | | `artist_statement` / `interview` / `academic` / `institutional_page` / `review` / `news` / `community_page` / `social_post` / `uploaded_file` / `other` |
| `origin` | text | no | | `uploaded` / `found_by_agent` |
| `content_text` | text | yes | | |
| `language` | text | yes | | |
| `fetched_at` | timestamptz | yes | | |
| `created_at` | timestamptz | yes | `now()` | |

---

## 9. Table: `artwork_sources` (junction)

Composite primary key: (`artwork_id`, `source_id`)
FKs: `artwork_id → artworks.id`, `source_id → sources.id`

| Column | Type | Nullable | Default | Check constraint |
|---|---|---|---|---|
| `artwork_id` | uuid | no | | PK part, FK |
| `source_id` | uuid | no | | PK part, FK |
| `source_relation` | text | no | | `direct` / `secondary` / `indirect` |
| `created_at` | timestamptz | yes | `now()` | |

---

## 10. Table: `tags`

Primary key: `id`
FK: `artwork_id → artworks.id`

| Column | Type | Nullable | Default | Check constraint |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | |
| `artwork_id` | uuid | no | | FK → artworks |
| `dimension` | text | no | | `process` / `materials` / `community` / `design` / `impact` / `exhibition_principle` |
| `value` | text | no | | English snake_case (Hebrew is display layer only) |
| `cluster_type` | text | no | | `declared` / `inferred` / `emergent` |
| `reasoning` | text | yes | | |
| `score` | numeric | yes | | 0 ≤ score ≤ 1 |
| `confidence` | numeric | yes | | 0 ≤ confidence ≤ 1 |
| `match_score` | numeric | yes | | 0 ≤ match_score ≤ 1 |
| `sources` | jsonb | yes | `'[]'` | Evidence source references |
| `status` | text | no | `'pending'` | `pending` / `validated` / `curator_review` / `rejected` |
| `validated_by` | text | yes | | |
| `validated_at` | timestamptz | yes | | |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

---

## 11. Deltas vs. n8n doc v0.3 (2026-06-12)

Things this live pull shows that the last n8n documentation does not:

1. **BUG-003 schema migration is done** — the 5 principle columns exist as top-level `numeric` columns on `global_initiatives` (and `facebook_communities`). Verify backfill from `artwork_correlations` JSONB and whether `Code in JavaScript3` writes to them.
2. **4 tag-dimension array columns added** to both initiative tables: `materials`, `process`, `community_archetype`, `impact_tags`.
3. **`participation_type` is text[]**, not text as documented in v0.3.
4. **Row counts moved**: `global_initiatives` 64 → 276; `facebook_communities` now 86 (doc memory said 69+).
5. `facebook_communities` reached 8 of 12 categories in classification coverage.

---

## 12. Operational notes

- All tables have **RLS enabled** — anon-key access from the visitor app requires appropriate policies.
- `url` UNIQUE constraints on both initiative tables are the mechanism behind 409 conflicts on duplicate inserts (BUG-011 context).
- Use `SELECT COUNT(*)` for row counts, never `list_tables` statistics.
- Writer-skill dedup keys: `artists.name`, `artworks.slug`, `sources.url_hash`.
