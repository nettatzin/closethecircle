# Data Contract Spec v1.1 — Close the Circle ↔ Supabase EXAI

**Scope:** V1 (initiatives + Facebook communities + filters + Hebrew). Artworks = V2, spec'd at the end.
**DB:** EXAI (`qjqqyvpqkbljngmhxahl`) — `global_initiatives` (276 rows), `facebook_communities` (86 rows)
**App:** github.com/nettatzin/closethecircle (repoint `.env` from Lovable's `tczfbbsydmbmktspghaz` to EXAI — Flag F1 in UI spec)
**Status:** PROPOSAL — nothing here has been executed. All SQL is for review.
**Date:** 2026-07-15

---

## 1. The unified view — `v_activities`

The app queries **one view**, never the base tables. The view UNIONs both tables on their shared columns, adds derived fields, and is the single surface RLS policies expose to the anon key.

```sql
CREATE OR REPLACE VIEW v_activities AS
SELECT
  id,
  'initiative'::text            AS source_table,
  name,
  url,
  category,
  description,
  participation_type,
  how_to_join,
  activity_type,
  skill_level,
  time_commitment,
  effort,
  cost,
  format,
  target_audience,
  location,
  visitor_action,
  draws,
  exhibition_themes,
  materials, process, community_archetype, impact_tags,
  technical_circularity, spiritual_grounding, community_engagement,
  systems_awareness, regenerative_intention,
  relevance_score,
  is_commercial,
  is_verified_active,
  -- derived
  CASE WHEN location ILIKE 'israel%' THEN 'israel' ELSE 'global' END AS region,
  CASE
    WHEN effort IN ('less_than_a_minute','up_to_10_minutes') THEN 'low_key'
    WHEN effort = '1_hour'    THEN 'hands_on'
    WHEN effort = 'dedicated' THEN 'deep_work'
    ELSE NULL
  END AS energy_level
FROM global_initiatives

UNION ALL

SELECT
  id,
  'facebook_community',
  name, url, category, description, participation_type, how_to_join,
  activity_type, skill_level, time_commitment, effort, cost, format,
  target_audience, location, visitor_action, draws, exhibition_themes,
  materials, process, community_archetype, impact_tags,
  technical_circularity, spiritual_grounding, community_engagement,
  systems_awareness, regenerative_intention,
  relevance_score, is_commercial, is_verified_active,
  CASE WHEN location ILIKE 'israel%' THEN 'israel' ELSE 'global' END,
  CASE
    WHEN effort IN ('less_than_a_minute','up_to_10_minutes') THEN 'low_key'
    WHEN effort = '1_hour'    THEN 'hands_on'
    WHEN effort = 'dedicated' THEN 'deep_work'
    ELSE NULL
  END
FROM facebook_communities;
```

Notes:
- Columns not shared are dropped from the view (`artwork_correlations`, `source`, `category_group`, `last_verified` / `community_type`, `privacy`, `estimated_size`, `source_url`). If the FB-specific fields are wanted on cards later, add them as NULLs on the initiative side.
- **D1 (decision):** whether the view filters on curation status. If the suggested→verified→curated gate is adopted, add `WHERE status = 'curated'` (requires the status column first). Until then the view serves all rows — recommend at minimum `WHERE is_verified_active IS NOT false`.
- Hebrew columns (`name_he`, `description_he`, `how_to_join_he`, `visitor_action_he`) join this view once the translation work lands — see §6.

---

## 2. Filter contracts

All filters: OR within a section, AND across sections. Empty selection in a section = no constraint (matches current UI behavior).

### F-1 Draws ("what draws you")
| | |
|---|---|
| UI options | explore 🌱 / meet 🤝 / make 🛠️ / amplify 📣 / exchange 🔄 / witness 👁️ |
| View column | `draws text[]` |
| Vocabulary | `explore, meet, make, amplify, exchange, witness` — identical, no mapping |
| Query | `.overlaps('draws', selected)` |
| Coverage | 362/362 backfilled 2026-07-15, validated |

### F-2 Energy
| | |
|---|---|
| UI options | low-key 🪶 / hands-on 🔥 / deep-work 💪 |
| View column | `energy_level` (derived from `effort`) |
| Mapping | `less_than_a_minute`+`up_to_10_minutes` → `low_key` · `1_hour` → `hands_on` · `dedicated` → `deep_work` |
| Query | `.in('energy_level', selected)` |
| UI change | Mock ids `low-key/hands-on/deep-work` (hyphens) → view values use underscores. One constants-file rename. UI helper text should shift to match the DB semantics ("minutes" / "about an hour" / "ongoing commitment"). |
| **D2 (decision)** | Alternative: bucket from `time_commitment` instead of `effort`. Recommend `effort` — it's per-session load, which is what the visitor is actually asking. |

### F-3 Where
| | |
|---|---|
| UI options | physical / digital (+ hybrid matches both) |
| View column | `format` — `in_person / online / hybrid` |
| Mapping | UI `physical` → `in_person`, `digital` → `online`; hybrid double-matches (keep current UI logic) |
| Query | `.in('format', mapped)` with hybrid included when either is selected |
| Digital reach sub-filter | UI `israel / global` → derived `region` column (`location ILIKE 'israel%'`) |
| **D3 (decision)** | The physical location/radius picker (LocationFilter, currently display-only) has no geo data behind it — `location` is free text. Options: (a) drop for V1, (b) keep as display-only, (c) add lat/lng columns later. Recommend (b) for V1, revisit post-launch. |

### F-4 Artworks
**RESOLVED (D4):** the artwork filter section stays in the design and is wired later (V2, score-based matching per §7). In V1 the section is present but inactive/hidden — not replaced.

**Global filter principle (locked):** ALL filters are optional. An empty selection in any section = no constraint. The default entry path must work with zero filters selected ("show me everything" always valid). No filter section may ever be required to see results.

---

## 3. Card display contract

### 3a. Tag display tiers (locked 2026-07-15)

| Tier | Tags shown | View column |
|---|---|---|
| **Mandatory — always on card** | effort level | `energy_level` (derived) |
| | format (online / physical / hybrid) | `format` |
| | location | `location` |
| **Visible card** | impact | `impact_tags` |
| | activity type | `activity_type` |
| **Expanded card** (with description & details) | exhibition theme | `exhibition_themes` |
| | audience | `target_audience` |
| | cost | `cost` |

**⚠️ Design gate:** the visual design of the labels/chips (hierarchy, style, color, RTL behavior) must be discussed and approved with Netta BEFORE any UI implementation of this tag structure. This section locks the *data contract* (which tags, which tier, which columns) — not the visual treatment.

**Label structure (locked 2026-07-15):**
- **Titled groups** — `impact` and `activity type` render beneath section titles (as labeled groups on the card).
- **Untitled tags** — everything else (mandatory: effort, format, location; expanded: exhibition theme, audience, cost) renders as plain tags with no title, distinguished from each other by a **design differentiator** (chip style variant — e.g., outline vs. fill, tone, or icon prefix; exact treatment to be decided in the design session).

Not displayed in V1 (data exists, reserve for later): `skill_level`, `time_commitment`, `materials`, `process`, `community_archetype`, the five principle scores, `draws` (drives filtering, not shown as chips).

### 3b. Field mapping

| UI field (Activity) | View column | Note |
|---|---|---|
| `name` | `name` (→ `name_he` in HE) | |
| `type` | `activity_type` | needs display mapping: `ongoing_initiative` → "Ongoing initiative" / "יוזמה מתמשכת" etc. |
| `description` | `description` (→ `description_he`) | |
| `energyLabel` | derived from `energy_level` | display mapping |
| `commitment` | `time_commitment` | display mapping |
| `location` | `location` | free text, already human-readable |
| `url` | `url` | outbound "close the circle" target |
| `tags.values` / `benefits` | `impact_tags`, `community_archetype` | snake_case → display mapping |
| `tags.activityType` | `participation_type` | array |
| `tags.format` | `format` + `cost` | |
| `showCommunityMessage` | `source_table = 'facebook_community'` | FB communities get the community-etiquette modal — replaces the hand-set mock boolean |
| `saves` | not in DB | V1 functional spec: `saves` table keyed by session UUID; display count is `COUNT(*)` per activity |
| `gradient` / `icon` | not in DB | keep client-side: deterministic assignment from `category` (stable hash), no schema change |

**Display-string mapping table:** one client-side constants module `vocabDisplay.ts` mapping every snake_case vocabulary value → `{en, he}` label. Tags stay English snake_case in the DB (locked convention); Hebrew is display layer only. This module is also the human-review surface for tag translations.

---

## 4. RLS contract

All tables have RLS enabled and **zero policies for anon** → the app currently gets nothing. V1 requires:

```sql
-- read-only exposure of the two base tables through the view
CREATE POLICY anon_read_initiatives ON global_initiatives
  FOR SELECT TO anon USING (true);
CREATE POLICY anon_read_fb ON facebook_communities
  FOR SELECT TO anon USING (true);
```

(Views execute with the querying role's rights against base tables, hence policies on the tables. If D1's status gate is adopted, encode it in the USING clause instead of `true` for defense in depth.)
No INSERT/UPDATE/DELETE for anon on these tables, ever. The sessions/saves/emails tables (functional spec) get their own insert-only policies.

---

## 5. Query shape (reference)

```ts
let q = supabase.from('v_activities').select('*');
if (draws.length)   q = q.overlaps('draws', draws);
if (energy.length)  q = q.in('energy_level', energy);
if (formats.length) q = q.in('format', mapFormats(formats)); // adds 'hybrid'
if (formats.includes('digital') && reach.length) q = q.in('region', reach);
```

One round trip, no client-side filtering of the full dataset needed at 362 rows — but fetching all once and filtering client-side (current UI pattern) is also fine at this scale. **D5 (decision):** server-side filtering (above) vs. fetch-once + client filter. Recommend fetch-once for V1 — preserves the instant-feedback filter UX and the vibe-call debounce logic untouched; revisit if the dataset grows past ~1k.

---

## 6. Hebrew layer contract (V1.3)

- Add to both base tables: `name_he`, `description_he`, `how_to_join_he`, `visitor_action_he` (text, nullable) + `translation_status` (`pending / machine / reviewed`).
- Expose in `v_activities`; app selects `_he` variants when `lang === 'he'`, falling back to EN when NULL.
- Vocabulary values are NOT translated in the DB — `vocabDisplay.ts` handles them (§3).
- Translation run mirrors today's draws backfill pattern: batch generation → `translation_status='machine'` → human review gate flips to `'reviewed'`. **D6 (decision):** whether HE display before review is allowed (show `machine` with fallback styling) or gated strictly on `reviewed`.
- Kills `activities.he.ts` (1,833-line duplicated dataset) and collapses `useDataset` into a language-aware select.

## 7. V2 artwork matching contract (forward-looking, not V1)

- No junction table. Matching is score-space: each artwork carries five-principle scores via its `exhibition_principle` tags; each activity carries the five numeric columns.
- Contract: `match(artwork, activity) = similarity(artwork_scores, activity_scores)` (cosine or weighted L1 — decide in V2 spec), threshold + top-N per artwork computed at query time or materialized nightly.
- The mock's `connectedArtworks: number[]` is replaced by this computation; ArtworksView's own filters (theme/space) map to `artworks.exhibition_section` + a theme tag.

---

## 7b. Cashback tab table — `financial_benefits` (PROPOSAL, not created)

The Cashback tab's 7 Israeli financial-benefit initiatives (ENVA, Lira Shapira, SpareEat, Shareitt, Cellcom Energy, solar simulator, Sun For Everyone) move from hardcoded UI into a dedicated bilingual table:

```sql
CREATE TABLE financial_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,              -- e.g. 'lira_shapira'
  name_en text NOT NULL,
  name_he text NOT NULL,
  description_en text,
  description_he text,
  benefit_summary_en text,                -- e.g. '₪13,000/yr from your roof'
  benefit_summary_he text,
  benefit_type text,                      -- savings / earnings / discount / cashback / investment
  provider text,
  url text NOT NULL,
  how_to_start_en text,
  how_to_start_he text,
  icon text,                              -- icon key from the exhibition icon set
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

- Bilingual by column (same pattern as §6) — no separate translation table.
- Separate from `global_initiatives` on purpose: different card anatomy (benefit summary is the hero), different tab, no five-principle filtering needed. If cross-matching is ever wanted, add the score columns later.
- Needs the same anon SELECT policy as §4.
- Seed data: the 7 entries currently hardcoded in `CashbackView.tsx` (already bilingual in the code — direct lift).

## 8. Decisions index

| # | Decision | Recommendation |
|---|---|---|
| D1 | Curation status gate in view | Add `status` column + gate before launch; interim: exclude `is_verified_active = false` |
| D2 | energy_level source column | `effort` |
| D3 | LocationFilter fate | Keep display-only in V1 |
| D4 | Artwork filter section in V1 | **RESOLVED:** keep the artwork filter, wire it later (V2); inactive in V1. All filters remain optional |
| D5 | Server-side vs fetch-once filtering | Fetch-once for V1 |
| D6 | Show machine translations pre-review | Curator call — spec supports both |
| D7 | Show `cost` tag in expanded card | **RESOLVED:** yes — expanded tier. Label visual design requires review with Netta before UI implementation |

## 9. Execution order (when approved — nothing run yet)

1. RLS read policies (§4)
2. `CREATE VIEW v_activities` (§1)
3. Repoint app `.env` to EXAI + regenerate `types.ts`
4. UI: constants rename (F-2), format mapping (F-3), vocabDisplay.ts (§3), swap `useDataset` to the view query
5. D4 resolution (artwork section)
6. Hebrew columns + translation run (§6) — separate work item
7. `financial_benefits` table + seed from CashbackView.tsx + anon policy (§7b)
8. Sessions/saves/emails — functional spec, separate document
