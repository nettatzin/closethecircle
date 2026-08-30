---
name: the-circle-artwork-writer
description: Writer skill for The Circle / המעגל exhibition. Activates ONLY when explicitly selected from the skills picker (e.g. /the-circle-artwork-writer). Do NOT trigger based on context, keywords, or topic inference. Takes a {slug}_validated.json (preferred, full mode) or {slug}_analysis.json (context-only mode) and generates a single SQL file with idempotent upsert statements ready for copy-paste into the Supabase EXAI SQL editor. Does NOT execute SQL — outputs text only. Handles artist + artwork + sources + artwork_sources + tags. Rejected tags are skipped. Uploaded sources without URLs get a synthetic url_hash for deduping.
---
 
# the-circle-artwork-writer
 
Take a `{slug}_validated.json` (post-validator, preferred) or `{slug}_analysis.json` (pre-validator, context-only) and produce a single SQL file Netta pastes into the Supabase EXAI SQL editor.
 
The writer does NOT execute SQL. It produces text. The Supabase MCP is intentionally not used here.
 
This skill is step 3 of a three-skill pipeline:
1. `the-circle-artwork-analyst` → `{slug}_analysis.json`
2. `the-circle-artwork-validator` → `{slug}_validated.json`
3. **`the-circle-artwork-writer`** (this skill) → `{slug}_upsert.sql`
---
 
## Prerequisite (run ONCE in Supabase, not per artwork)
 
The writer assumes `artists.name` has a unique constraint so `ON CONFLICT (name)` works:
 
```sql
alter table public.artists
  add constraint artists_name_key unique (name);
```
 
Other unique constraints already exist from the original schema (`artworks.slug`, `sources.url_hash`, `tags(artwork_id, dimension, value)`).
 
---
 
## When to use
 
- After the validator produces `{slug}_validated.json` (preferred — full mode), OR
- Right after the analyst produces `{slug}_analysis.json` when Netta wants to push the artwork context to Supabase before validation completes (context-only mode).
Never auto-trigger.
 
---
 
## Inputs
 
| Input file | Mode | What gets upserted |
|---|---|---|
| `{slug}_validated.json` | `full` | artist + artwork + sources + artwork_sources + tags |
| `{slug}_analysis.json` | `context_only` | artist + artwork + sources + artwork_sources (tags skipped) |
 
Default path: `/mnt/user-data/outputs/`. Ask Netta if the file isn't there.
 
---
 
## Pre-flight
 
1. Confirm the file path and mode (auto-detect from filename, then confirm).
2. Validate the input JSON (Step 1 below).
3. Show a pre-execution summary (Step 5 below).
4. Get go-ahead before writing the SQL file.
---
 
## Workflow
 
### Step 1 — Validate input JSON
 
Run these checks. Abort with a clear error if any fail:
 
- File exists and parses as JSON.
- Required top-level keys present: `artist`, `artwork`, `sources` (and `tags` for full mode).
- `artwork.slug` is non-empty.
- `artist.name` is non-empty.
- Every `tags[].sources[].local_id` resolves to an entry in `sources[]`.
- For full mode: every tag has a `status` field with value in `{validated, curator_review, rejected}`.
### Step 2 — Generate synthetic url_hash for uploaded sources
 
Supabase's `sources.url_hash` is the dedup key. `ON CONFLICT (url_hash)` doesn't fire on NULL, so uploaded sources without URLs would create duplicates on re-runs. Compute a stable synthetic hash for any source with `url_hash == null`:
 
```
url_hash = 'uploaded-' + sha256_hex('uploaded:' + artwork.slug + ':' + source.title)
```
 
Use it for both the INSERT and the ON CONFLICT lookup. The `url` column stays NULL.
 
### Step 3 — Apply status filter (full mode only)
 
For each tag in `tags[]`:
- `status == 'validated'` → **include** in SQL
- `status == 'curator_review'` → **skip** — tag is pending Lior/Talia review. To write it later, update the JSON to `status: validated` and re-run the writer.
- `status == 'rejected'` → **skip** — tag failed validation. Stays out of Supabase.
Context-only mode: tags are skipped entirely regardless of status.
 
**Why curator_review is skipped, not written-with-flag**: writing unreviewed tags to Supabase puts not-yet-approved data into the production table. RLS hides them from the visitor app, but any internal query against `tags` that forgets to filter `status = 'validated'` pulls them in — including the activity-matching scoring. The JSON file is the holding state until curators promote them.
 
### Step 4 — Generate SQL
 
Save to: `/mnt/user-data/outputs/{slug}_upsert.sql`
 
The file is one transaction (Supabase SQL editor wraps it implicitly — any failure rolls back the whole thing). All statements are idempotent via `ON CONFLICT` on natural keys, so re-running is safe.
 
**Use dollar-quoted strings** (`$tag$ ... $tag$`) for any text containing single quotes, jsonb literals, or multi-line content. Use numbered tags (`$r1$`, `$r2$`, `$q1$`, `$q2$`, ...) so each literal in the file has a unique tag — Postgres requires this when literals are adjacent.
 
#### SQL template
 
```sql
-- =====================================================
-- The Circle / Artwork upsert
-- Artwork: <slug> — "<title_en>" (<title_he>)
-- Mode: <full | context_only>
-- Generated by the-circle-artwork-writer
-- Generated at: <ISO timestamp>
-- Source file: <input filename>
-- =====================================================
 
-- ---- Stage 1: Artist ----
insert into public.artists (name, name_he, bio, socials)
values (
  'Sasha Letzter',
  'סשה לצטר',
  $bio$Israeli designer working with discarded plastics ...$bio$,
  $socials$["https://instagram.com/sashaletzter"]$socials$::jsonb
)
on conflict (name) do update set
  name_he = excluded.name_he,
  bio     = excluded.bio,
  socials = excluded.socials;
 
-- ---- Stage 2: Artwork ----
insert into public.artworks (
  slug, artist_id, title_he, title_en, year, exhibition_section,
  declared_materials, declared_process, curator_notes, media_refs, raw_corpus
)
values (
  'letzter-trash-talk',
  (select id from public.artists where name = 'Sasha Letzter'),
  $he$טראש טוק$he$,
  'Trash Talk',
  2024,
  'Everyday Circle',
  array['plastic', 'post_industrial'],
  array['found_object', 'chemical_transformation'],
  $notes$Curator notes...$notes$,
  $media$[{"type":"image","url":"https://...","caption":"Installation view"}]$media$::jsonb,
  $corpus$Concatenated text...$corpus$
)
on conflict (slug) do update set
  artist_id          = excluded.artist_id,
  title_he           = excluded.title_he,
  title_en           = excluded.title_en,
  year               = excluded.year,
  exhibition_section = excluded.exhibition_section,
  declared_materials = excluded.declared_materials,
  declared_process   = excluded.declared_process,
  curator_notes      = excluded.curator_notes,
  media_refs         = excluded.media_refs,
  raw_corpus         = excluded.raw_corpus;
 
-- ---- Stage 3: Sources ----
insert into public.sources (url, url_hash, title, source_type, origin, content_text, language, fetched_at)
values
  (
    'https://example.com/interview-letzter',
    'sha256:abc123...',
    'Interview with Sasha Letzter',
    'interview',
    'found_by_agent',
    $c1$Full extracted interview text ...$c1$,
    'he',
    '2026-06-05T10:00:00Z'
  ),
  (
    null,
    'uploaded-sha256:def456...',
    'Curatorial brief',
    'uploaded_file',
    'uploaded',
    $c2$Curatorial brief contents ...$c2$,
    'he',
    null
  )
on conflict (url_hash) do update set
  url          = excluded.url,
  title        = excluded.title,
  source_type  = excluded.source_type,
  origin       = excluded.origin,
  content_text = excluded.content_text,
  language     = excluded.language,
  fetched_at   = excluded.fetched_at;
 
-- ---- Stage 4: artwork_sources (relation rows) ----
insert into public.artwork_sources (artwork_id, source_id, source_relation)
select
  (select id from public.artworks where slug = 'letzter-trash-talk'),
  s.id,
  v.source_relation
from public.sources s
join (values
  ('sha256:abc123...',           'direct'),
  ('uploaded-sha256:def456...',  'direct')
) as v(url_hash, source_relation) on s.url_hash = v.url_hash
on conflict (artwork_id, source_id) do update set
  source_relation = excluded.source_relation;
 
-- ---- Stage 5: Tags (full mode only — omit entire stage in context_only mode) ----
insert into public.tags (
  artwork_id, dimension, value, cluster_type, reasoning,
  score, confidence, match_score, sources,
  status, validated_by, validated_at
)
values
  (
    (select id from public.artworks where slug = 'letzter-trash-talk'),
    'process',
    'found_object',
    'declared',
    $r1$Artist describes collecting discarded plastics as core method.$r1$,
    0.900,
    0.850,
    0.726,
    jsonb_build_array(
      jsonb_build_object(
        'source_id',       (select id::text from public.sources where url_hash = 'sha256:abc123...'),
        'evidence_quote',  $q1$I walk the beach looking for what others have thrown away.$q1$,
        'source_strength', 0.900
      )
    ),
    'validated',
    'the-circle-artwork-validator@claude-opus-4-7',
    '2026-06-12T14:45:00Z'
  ),
  (
    (select id from public.artworks where slug = 'letzter-trash-talk'),
    'materials',
    'plastic',
    'declared',
    $r2$Single-use plastic is the explicit medium.$r2$,
    0.950,
    0.900,
    0.812,
    jsonb_build_array(
      jsonb_build_object(
        'source_id',       (select id::text from public.sources where url_hash = 'uploaded-sha256:def456...'),
        'evidence_quote',  $q2$Material: discarded single-use plastic from Tel Aviv beaches.$q2$,
        'source_strength', 0.950
      )
    ),
    'validated',
    'the-circle-artwork-validator@claude-opus-4-7',
    '2026-06-12T14:45:00Z'
  )
on conflict (artwork_id, dimension, value) do update set
  cluster_type = excluded.cluster_type,
  reasoning    = excluded.reasoning,
  score        = excluded.score,
  confidence   = excluded.confidence,
  match_score  = excluded.match_score,
  sources      = excluded.sources,
  status       = excluded.status,
  validated_by = excluded.validated_by,
  validated_at = excluded.validated_at;
 
-- =====================================================
-- End of upsert. Safe to re-run.
-- =====================================================
```
 
#### SQL generation rules
 
- **Dollar-quote every text literal** containing apostrophes, newlines, or jsonb syntax. Use unique numbered tags (`$bio$`, `$notes$`, `$r1$`, `$r2$`, `$q1$`, ...). No two adjacent literals share a tag.
- **Array literals** (`declared_materials`, `declared_process`) → `array['...', '...']`.
- **JSONB literals** (`socials`, `media_refs`) → dollar-quoted JSON string followed by `::jsonb` cast.
- **Foreign keys** → always subqueries on natural keys, never literal UUIDs.
- **Tag sources jsonb** → built via `jsonb_build_array(jsonb_build_object(...))` with source UUID lookups inline.
- **NULLs** → literal `null`, not empty string or empty array.
- **Booleans** → `true` / `false`, lowercase.
- **Timestamps** → ISO 8601 strings quoted as text; Postgres will cast to timestamptz.
- **Numeric scores** → 3 decimals (`0.726`, not `0.7264`).
- **Hebrew text** → handled natively by dollar-quoted strings; no encoding gymnastics.
### Step 5 — Pre-execution summary
 
Before writing the file, show Netta:
 
```
Artwork:  <slug> — "<title_en>" (<title_he>)
Artist:   <name>
Mode:     <full | context_only>
 
Counts:
  Artist:           1
  Artwork:          1
  Sources:          N  (X with URL, Y uploaded with synthetic hash)
  artwork_sources:  N
  Tags:             M  total
    validated:        A  ← WILL be written to Supabase
    curator_review:   B  ← NOT written; promote in the JSON (set status to 'validated') then re-run
    rejected:         C  ← NOT written; stays out of Supabase
 
Skipped tags (curator_review — pending review):
  - <dimension>:<value>  (reason: <validation_notes>)
  - ...
 
Skipped tags (rejected):
  - <dimension>:<value>  (reason: <validation_notes>)
  - ...
 
Sources with synthetic url_hash (uploaded, no URL):
  - "<title>"  →  uploaded-sha256:<hash>
  - ...
 
Output file will be written to: /mnt/user-data/outputs/<slug>_upsert.sql
```
 
Wait for Netta's confirmation before writing.
 
### Step 6 — Write file + present
 
Use `present_files` to share `{slug}_upsert.sql`.
 
Tell Netta:
 
> File: `/mnt/user-data/outputs/<slug>_upsert.sql`
>
> To run:
> 1. Open Supabase EXAI → SQL Editor → New query
> 2. Paste the entire file
> 3. Run
>
> The file is one transaction. If any stage fails, all rolls back — no partial writes.
> Re-running on the same artwork is safe (every statement uses `ON CONFLICT`).
> If you re-run on a re-validated artwork, fields update in place; tag rows update by `(artwork_id, dimension, value)`.
 
---
 
## Constraints
 
- The writer does NOT execute SQL. Output is text only, copy-paste ready.
- All statements are idempotent — every INSERT uses `ON CONFLICT` on natural keys.
- The writer does NOT modify the input JSON file.
- Tags with `status: rejected` or `status: curator_review` are excluded entirely from SQL output. Only `status: validated` tags are upserted. To promote a curator_review tag, change its status to `validated` in the JSON file and re-run the writer.
- Uploaded sources without a URL get a deterministic synthetic url_hash so re-runs dedup correctly.
- The writer does NOT use the Supabase MCP, even if available.
- One artwork per invocation. Do not batch.
- If the input JSON has analyst_meta or validator_report blocks, ignore them — they don't get written to Supabase.
- Every text literal in the generated SQL uses dollar-quoting with a unique tag. No single-quote escaping.
- The output SQL filename is exactly `{slug}_upsert.sql` — no timestamp suffix, no mode suffix. Re-runs overwrite the previous file.
 
