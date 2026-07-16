# Supabase Schema Documentation — The Circle / המעגל

**Project:** EXAI (`qjqqyvpqkbljngmhxahl`)
**Schema:** `public`
**Doc version:** v1.1
**Updated:** 2026-07-15 (v1.0 live pull + same-day session changes: draws backfill, financial_benefits)
**Tables:** 8
**RLS:** Enabled on all tables

---

## 0. Changelog

- **v1.1 (2026-07-15):** `draws text[]` added to both initiative tables (all 362 rows backfilled + validated); new table `financial_benefits` (bilingual, seeded 7 rows, anon SELECT policy — the only anon policy in the project so far); table count 7 → 8.
- **v1.0 (2026-07-15):** initial live pull.

---

## 1. Overview

Three table groups serve The Circle exhibition at Design Museum Holon:

**Initiatives layer** (visitor matching engine):
- `global_initiatives` — global + Israeli sustainability initiatives, discovered via n8n pipeline + manual curation
- `facebook_communities` — Israeli Facebook communities, identical classification columns for UNION-based matching

**Visitor content layer:**
- `financial_benefits` — Cashback tab services, bilingual by column (NEW in v1.1)

**Artwork layer** (artwork tagging pipeline — analyst → validator → writer skills):
- `artists`, `artworks`, `sources`, `artwork_sources` (junction), `tags`

Initiative tables share the five-principle vocabulary as numeric score columns:
`technical_circularity`, `spiritual_grounding`, `community_engagement`, `systems_awareness`, `regenerative_intention`

Planned (Linear, not yet created): `sessions`, `saves`, `emails`, `events` (V1.2 — see v1_functional_spec.md); `v_activities` view + `_he` columns (V1.1/V1.3 — see data_contract_spec.md).

---

## 2. Live row counts (verified via COUNT(*))

| Table | Rows | Notes |
|---|---|---|
| `global_initiatives` | 276 | 276/276 classified, 12 categories, **276/276 draws** |
| `facebook_communities` | 86 | 86/86 classified, 8 categories, **86/86 draws** |
| `financial_benefits` | 7 | Seeded from CashbackView.tsx, bilingual |
| `artists` | 3 | |
| `artworks` | 3 | |
| `sources` | 44 | |
| `artwork_sources` | 44 | |
| `tags` | 59 | |

⚠️ `list_tables` statistics report stale `reltuples` (showed 0 for initiative tables). Always verify with `SELECT COUNT(*)`.

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
financial_benefits — standalone (no FKs)
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
| `participation_type` | text[] | yes | | **ARRAY** — community / direct_action / content / organization / platform / event |
| `how_to_join` | text | yes | | Specific action |
| `activity_evidence` | text | yes | | Recency evidence |
| `audience` | text | yes | | |
| `language` | text | yes | | |
| `exhibition_themes` | text[] | yes | | back_to_nature / everyday_circle / healing_through_design |
| `artwork_correlations` | jsonb | yes | | Legacy home of `framework_scores` — superseded by the 5 numeric columns |
| `relevance_score` | integer | yes | | 1–5; NULL = not yet classified |
| `is_commercial` | boolean | yes | `false` | |
| `is_verified_active` | boolean | yes | | Set `true` by classifier |
| `source` | text | yes | `'sonar'` | Discovery source |
| `category_group` | text | yes | | Defined but unused |
| `date_discovered` | date | no | | Used by exclusion-list sort |
| `last_verified` | date | yes | | |
| `created_at` | timestamptz | yes | `now()` | `orderBy` anchor for n8n pagination stability |
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
| `technical_circularity` | numeric | yes | | Five-principle scores (top-level columns) |
| `spiritual_grounding` | numeric | yes | | |
| `community_engagement` | numeric | yes | | |
| `systems_awareness` | numeric | yes | | |
| `regenerative_intention` | numeric | yes | | |
| `materials` | text[] | yes | | Secondary tag dimension |
| `process` | text[] | yes | | Secondary tag dimension |
| `community_archetype` | text[] | yes | | Secondary tag dimension |
| `impact_tags` | text[] | yes | | Secondary tag dimension |
| `draws` | text[] | yes | | **NEW v1.1** — visitor motivation: explore / meet / make / amplify / exchange / witness. 276/276 backfilled 2026-07-15 |

**Total columns:** 40.

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
| `draws` | text[] | yes | | **NEW v1.1** — same 6-value vocabulary. 86/86 backfilled 2026-07-15 |

**Total columns:** 40. Columns absent vs. `global_initiatives`: `artwork_correlations`, `source`, `category_group`, `last_verified`. Columns extra: `community_type`, `privacy`, `estimated_size`, `source_url`.

---

## 6. Table: `financial_benefits` (NEW v1.1)

Primary key: `id`
Unique: `slug`
RLS: enabled, **anon SELECT policy** `anon_read_financial_benefits` on `is_active = true` — the first/only anon policy in the project.
Serves: Cashback tab. Seeded 2026-07-15 with 7 services (ENVA, Lira Shapira, SpareEat, Shareitt, Cellcom Energy, solar simulator, Sun For Everyone) lifted verbatim from `CashbackView.tsx`.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `slug` | text | no | | **UNIQUE** — e.g. `lira_shapira` |
| `name_en` | text | no | | |
| `name_he` | text | no | | |
| `description_en` | text | yes | | |
| `description_he` | text | yes | | |
| `benefit_summary_en` | text | yes | | Hero field, e.g. "₪13,000/yr from your roof" |
| `benefit_summary_he` | text | yes | | |
| `benefit_type` | text | yes | | CHECK: improved_terms / alternative_currency / discount / income_generation / savings / cashback |
| `provider` | text | yes | | |
| `url` | text | no | | |
| `how_to_start_en` | text | yes | | Unpopulated in seed |
| `how_to_start_he` | text | yes | | Unpopulated in seed |
| `icon` | text | yes | | Unpopulated in seed |
| `sort_order` | int | yes | `0` | Seed uses 1–7 |
| `is_active` | boolean | yes | `true` | Anon policy filters on this |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

⚠️ Created via `execute_sql` (approval hiccup on `apply_migration`) — **not in the migrations list** (open decision D10: backfill a migration record or accept the gap).

---

## 7. Table: `artists`

Primary key: `id` · Unique: `name` · Referenced by: `artworks.artist_id`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | uuid | no | `gen_random_uuid()` | PK |
| `name` | text | no | | **UNIQUE** — dedup key for writer-skill upserts |
| `name_he` | text | yes | | Hebrew display name |
| `bio` | text | yes | | |
| `socials` | jsonb | yes | `'[]'` | Array of social links |
| `created_at` | timestamptz | yes | `now()` | |
| `updated_at` | timestamptz | yes | `now()` | |

## 8. Table: `artworks`

Primary key: `id` · Unique: `slug` · FK: `artist_id → artists.id` · Referenced by: `tags.artwork_id`, `artwork_sources.artwork_id`

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

## 9. Table: `sources`

Primary key: `id` · Unique: `url_hash` · Referenced by: `artwork_sources.source_id`

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

## 10. Table: `artwork_sources` (junction)

Composite primary key: (`artwork_id`, `source_id`) · FKs: `artwork_id → artworks.id`, `source_id → sources.id`

| Column | Type | Nullable | Default | Check constraint |
|---|---|---|---|---|
| `artwork_id` | uuid | no | | PK part, FK |
| `source_id` | uuid | no | | PK part, FK |
| `source_relation` | text | no | | `direct` / `secondary` / `indirect` |
| `created_at` | timestamptz | yes | `now()` | |

## 11. Table: `tags`

Primary key: `id` · FK: `artwork_id → artworks.id`

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

## 12. Operational notes

- All tables have **RLS enabled**. Anon policies exist only on `financial_benefits`; the initiative tables need theirs before the visitor app can read anything (Linear S-62).
- `url` UNIQUE constraints on both initiative tables are the mechanism behind 409 conflicts on duplicate inserts.
- Use `SELECT COUNT(*)` for row counts, never `list_tables` statistics.
- Writer-skill dedup keys: `artists.name`, `artworks.slug`, `sources.url_hash`.
- Migrations logged so far: `add_draws_column_initiatives_and_fb` (2026-07-15). `financial_benefits` DDL is NOT in migrations (D10).
