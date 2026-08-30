---
name: the-circle-artwork-analyst
description: Analyst skill for The Circle / המעגל exhibition. Activates ONLY when explicitly selected from the skills picker (e.g. /the-circle-artwork-analyst). Do NOT trigger based on conversational context, keywords, uploaded materials, or topic inference — even if the user mentions analyzing artworks, the exhibition, sustainability, tagging, or related themes. The user must invoke it from the picker. This skill takes uploaded artwork materials (brief, artist bio, images, links, socials, prior coverage) for ONE artwork, performs multilingual web and social research, and produces a structured JSON analysis tagged across six dimensions with sources, evidence, and match scores. Output is written for the validator skill to consume.
---
 
# the-circle-artwork-analyst
 
Analyze one artwork from "The Circle / המעגל" exhibition. Produce a sourced, scored JSON tag set across six dimensions, ready for the validator skill.
 
This skill is step 1 of a three-skill pipeline:
1. **the-circle-artwork-analyst** (this skill) → `{slug}_analysis.json`
2. **the-circle-artwork-validator** → `{slug}_validated.json`
3. **the-circle-artwork-writer** → upserts to Supabase EXAI
The analyst does NOT write to Supabase. It produces a file the validator then judges.
 
---
 
## When to use
 
- Netta selects the skill from the picker for ONE artwork at a time.
- Never auto-trigger.
---
 
## Inputs
 
Uploaded files for one artwork (any subset of these — at minimum #1):
1. Brief / curatorial text
2. Artist bio
3. Artwork description
4. Images of the artwork
5. Video links
6. Artist socials (handles or URLs)
7. Prior interviews, exhibition reviews, press
If title, artist name, or any artwork-identifying info is missing, **stop and ask Netta** before proceeding.
 
---
 
## Pre-flight (always run first)
 
1. List each uploaded file and one line of what you extracted from it.
2. Ask Netta to confirm:
   - **slug** (e.g., `letzter-trash-talk`) — used in output filename and as the Supabase slug
   - **title_he**, **title_en**, **artist name**, **year**, **exhibition_section**
3. Wait for go-ahead before any web research.
---
 
## Workflow
 
### Step 1 — Build the dossier
 
Extract from uploads into an internal `artwork_dossier` object:
- title_he, title_en, year, exhibition_section
- artist: { name, name_he, bio, socials[] }
- declared_materials[], declared_process[], curator_notes
- media_refs[] — { type, url, caption }
- raw_corpus — concatenated text from uploads, language-tagged
Show Netta a compact summary. Confirm before continuing.
 
### Step 2 — Multilingual web & social research
 
Default search languages are **Hebrew and English** (most artists and coverage). Add other languages when the artist's nationality, materials, or community context calls for it (e.g., Italian for an Italian artist, Arabic for regional craft contexts, Japanese for a specific material tradition).
 
Run a query plan across **six strands**:
 
| Strand | Goal | Example queries |
|---|---|---|
| Artist interviews | First-person statements about practice and intent | `"שם האמן" ראיון תהליך`, `"artist name" interview process` |
| Exhibition / review | Critical reception of this work | `"artwork title" review`, `"שם העבודה" ביקורת`, `"artist + exhibition name"` |
| Process documentation | How it was made | `"artist name" technique materials`, `שיטת העבודה של "אמן"` |
| **Artist's other works** | Related practice and recurring concerns | `"artist name" portfolio`, `"artist name" past exhibitions`, `"artist name" earlier works` |
| **Socials** | Artist's own voice — Instagram, TikTok, personal site, Vimeo, Are.na, LinkedIn | direct profile fetches; search posts referencing this work, materials, process |
| Adjacent practitioners | Community / context the work participates in | similar materials, similar process communities, related orgs and movements |
 
Use `web_search` and `web_fetch`. For socials, fetch profile pages and recent posts that mention the work or materials in question; do not fetch entire feeds.
 
For every source captured, store:
- `url`, `title`, `content_text` (full extracted text), `language`, `fetched_at`
- `url_hash` (sha256 of normalized URL)
- `source_type`: `artist_statement` | `interview` | `academic` | `institutional_page` | `review` | `news` | `community_page` | `social_post` | `uploaded_file` | `other`
- `source_relation`:
  - **direct** — about this artwork, or by the artist about this artwork
  - **secondary** — about the artist's broader practice, or about related pieces of this artist that connect to this artwork
  - **indirect** — about the community / material / process the artwork engages with, not the artwork itself
- `origin`: `uploaded` (from Netta's files) | `found_by_agent`
**Important on socials**: when a post is by the artist themselves in first-person voice about their own work, classify it as `artist_statement` (not `social_post`). The platform doesn't determine the type — the voice and authorship do. `social_post` is for third-party social content (someone else discussing or sharing the work).
 
Uploaded files default to `origin: uploaded, source_relation: direct`. The analyst may downgrade relation with a note in `analyst_meta.notes_for_validator`.
 
Dedup by `url_hash`. Aim for 5–20 web-discovered sources per artwork. Stop early if signal repeats.
 
Show Netta the discovered sources as a table (title, type, relation, language, URL). Confirm before tagging.
 
### Step 3 — Tag across the six dimensions
 
Every tag must:
- Cite at least one source from `sources[]` with an `evidence_quote` (≤30 words, verbatim from that source's `content_text`)
- Have a `cluster_type`:
  - **declared** — explicit in uploaded brief / artist statement / direct source
  - **inferred** — derived from analysis of materials, process, language across sources
  - **emergent** — novel cross-cutting pattern not stated anywhere directly
- Have `reasoning` (≤400 chars) explaining why
#### Vocabulary rules
 
Five of the six dimensions (`process`, `materials`, `community`, `design`, `impact`) have **seed values shown below**. These are starting points, NOT a closed list — if the artwork legitimately requires a value not in the seed list, add it. Use snake_case, English, singular nouns. Log every new value in `analyst_meta.new_vocabulary_proposed` so the validator and curator can track vocabulary growth.
 
The sixth dimension (`exhibition_principle`) is **strictly locked** to the five exact strings listed below. Never propose new principles. Never spell them differently.
 
#### Seed values (extensible)
 
**process** — `handmade`, `machine_made`, `biofabrication`, `renovation`, `repair`, `disassembly`, `cultivation`, `digital_fabrication`, `found_object`, `chemical_transformation`
 
**materials** — `textile`, `insect_derived`, `food_waste`, `plastic`, `metal`, `plant_fiber`, `water`, `post_industrial`, `recycled`, `mycelium`, `leather`, `glass`, `ceramic`, `paper`, `wood`
 
**community** — `independent_designers`, `second_hand_economy`, `repair_communities`, `indigenous_practitioners`, `maker_spaces`, `environmental_orgs`, `faith_communities`, `urban_growers`, `academic`, `craft_collectives`
 
**design** — `product`, `fashion`, `textile`, `furniture`, `installation`, `system_design`, `speculative`, `service_design`, `architecture`, `graphic`
 
**impact** — `pollution_reduction`, `reuse`, `community_growth`, `biodiversity`, `soil_health`, `water_conservation`, `cultural_preservation`, `skill_transmission`, `behavioral_shift`, `energy_reduction`
 
#### Locked values: `exhibition_principle`
 
Use ONLY these five exact strings, with the criteria below to decide when each applies.
 
**`technical_circularity`**
Material and product cycles in the Ellen MacArthur Foundation / Diez Office sense — eliminating waste, keeping materials in circulation, designing for disassembly, repair, reuse, or biological/technical re-entry. Tag this when the artwork demonstrates or proposes **concrete circular-economy mechanics** on the material or object level (specific material flows, recovery loops, modular construction, end-of-life pathways). Surface-level "sustainability messaging" is not enough.
 
**`spiritual_grounding`**
Heschel Center lineage — wonder and awe toward nature, materials as relationships rather than resources, design as meaning-making, ritual, or attention. Tag this when the artwork **positions the maker or viewer in a reverent, attentive, non-extractive relationship** to its subject. Not "nature-themed" — but actively cultivating regard, slowness, or sacred attention. Heschel's "radical amazement" is the lodestar.
 
**`community_engagement`**
Local adaptation and democratic participation, drawing from Heschel's local sustainability centers and Permacomputing's diverse-approaches ethos. Tag this when the artwork **activates, depends on, or contributes to a community of practice** — repair networks, traditional craft holders, indigenous practitioners, local maker spaces, faith communities, environmental orgs, urban growers. The work is inseparable from the people it gathers, not the product of one individual maker working alone.
 
**`systems_awareness`**
Interconnected thinking — the artwork **makes visible the relationships, flows, supply chains, ecological cycles, social fabrics, and hidden costs** that normally stay invisible. Tag this when the piece's purpose includes revealing how human and non-human systems interlock, not just deploying sustainable materials. A piece can be technically circular without being systems-aware; this principle is about visibility and revelation.
 
**`regenerative_intention`**
Beyond sustainability — actively healing or restoring. Tag this when the artwork or its process **produces more than it consumes**: restoring soil health, supporting biodiversity, transmitting endangered skill, recovering cultural memory, replenishing water cycles, healing degraded relationships. The intent must be restoration, not just neutrality. "Reduces harm" alone does not qualify.
 
A single artwork may carry multiple principles, each with its own score and confidence. Score them independently.
 
### Step 4 — Score every tag
 
Per cited source on a tag:
```
source_strength = source_type_weight × source_relation_weight
```
 
| source_type | weight |   | source_relation | weight |
|---|---|---|---|---|
| artist_statement | 1.00 |   | direct | 1.0 |
| uploaded_file | 0.95 |   | secondary | 0.7 |
| interview | 0.90 |   | indirect | 0.4 |
| academic | 0.85 |   |   |   |
| institutional_page | 0.80 |   |   |   |
| review | 0.70 |   |   |   |
| news | 0.60 |   |   |   |
| community_page | 0.60 |   |   |   |
| social_post | 0.50 |   |   |   |
| other | 0.40 |   |   |   |
 
Per tag:
- `score` (0–1) — salience: how central is this tag to the artwork
- `confidence` (0–1) — epistemic: how sure are you the tag applies
- `match_score = max(source_strength across cited sources) × confidence × score`
Round all numeric outputs to 3 decimals.
 
### Step 5 — Quality gates (run before writing)
 
Do NOT write the file if any of these fail. Fix and re-check.
 
1. At least 3 tags for each of: `process`, `materials`, `community`, `design`, `impact` (relax to ≥1 only if the artwork genuinely has no further signal in that dimension — note this in `notes_for_validator`).
2. At least 1 tag for `exhibition_principle`. Values used must be a subset of the five locked strings, no others.
3. Every tag has ≥1 source cited.
4. Every cited `local_id` exists in `sources[]`.
5. Every `evidence_quote` is verbatim from its source's `content_text`.
6. All numeric fields in [0, 1].
7. No duplicate (dimension, value) pairs.
8. New vocabulary values (outside seed lists) are logged in `analyst_meta.new_vocabulary_proposed`.
### Step 6 — Write output
 
Save to: `/mnt/user-data/outputs/{slug}_analysis.json`
 
The schema below is **shaped to mirror Supabase tables 1:1** so the validator and writer skills can map fields directly without restructuring. Top-level keys correspond to Supabase tables (or table sets); the `supabase_writer_hints` block tells the writer skill what's safe to upsert immediately vs what must wait for validation.
 
```json
{
  "artist": {
    "name": "...",
    "name_he": "...",
    "bio": "...",
    "socials": ["...", "..."]
  },
 
  "artwork": {
    "slug": "letzter-trash-talk",
    "title_he": "...",
    "title_en": "...",
    "year": 2024,
    "exhibition_section": "...",
    "declared_materials": [],
    "declared_process": [],
    "curator_notes": "...",
    "media_refs": [{ "type": "image", "url": "...", "caption": "..." }],
    "raw_corpus": "concatenated text from uploads + key fetched sources, language-tagged"
  },
 
  "sources": [
    {
      "local_id": "src_001",
      "url": "https://...",
      "url_hash": "sha256:...",
      "title": "...",
      "source_type": "interview",
      "source_relation": "direct",
      "origin": "found_by_agent",
      "language": "he",
      "fetched_at": "2026-06-05T...",
      "content_text": "..."
    }
  ],
 
  "tags": [
    {
      "dimension": "process",
      "value": "found_object",
      "cluster_type": "declared",
      "reasoning": "...",
      "score": 0.900,
      "confidence": 0.850,
      "match_score": 0.726,
      "sources": [
        { "local_id": "src_001", "evidence_quote": "...", "source_strength": 0.900 }
      ]
    }
  ],
 
  "analyst_meta": {
    "run_at": "2026-06-05T...",
    "model": "claude-opus-4-7",
    "languages_searched": ["he", "en"],
    "queries_run": ["...", "..."],
    "new_vocabulary_proposed": [
      { "dimension": "materials", "value": "...", "reasoning": "..." }
    ],
    "notes_for_validator": "anything uncertain, contested, or worth a second look"
  },
 
  "supabase_writer_hints": {
    "natural_keys": {
      "artist": "name",
      "artwork": "slug",
      "source": "url_hash (null for uploaded files without a URL — dedupe by title+origin)",
      "tag": ["artwork_id", "dimension", "value"]
    },
    "id_translation": "local_id values (src_001, …) are local to this file. Writer must resolve them to real Supabase UUIDs after upserting sources, then rewrite tags[].sources[].local_id → source_id (UUID) before inserting tag rows.",
    "writable_pre_validation": ["artist", "artwork", "sources", "artwork_sources"],
    "writable_post_validation": ["tags"],
    "artwork_sources_derivation": "For each source in sources[], the writer creates one artwork_sources row: { artwork_id (resolved from artwork.slug), source_id (resolved from local_id), source_relation (from source.source_relation) }."
  }
}
```
 
Use `present_files` to share the JSON with Netta.
 
### Step 6b — Supabase mapping (reference)
 
Each top-level JSON key maps to a Supabase table in `public`:
 
| JSON key | Supabase target | When to write |
|---|---|---|
| `artist` | `public.artists` (one row, upsert by `name`) | Pre-validation OK |
| `artwork` | `public.artworks` (one row, upsert by `slug`, FK to artist) | Pre-validation OK |
| `sources` | `public.sources` (many rows, upsert by `url_hash` when present) | Pre-validation OK |
| *(derived)* `artwork_sources` | `public.artwork_sources` (one row per source, carries `source_relation`) | Pre-validation OK |
| `tags` | `public.tags` (many rows, upsert by `(artwork_id, dimension, value)`) | **Post-validation only** |
| `analyst_meta` | Not stored — kept in the file for audit / debugging | N/A |
| `supabase_writer_hints` | Not stored — instructions for the writer skill | N/A |
 
The four "pre-validation OK" rows can be pushed to Supabase right after the analyst runs. Tags wait for the validator skill to set their `status` to `validated` before they're written.
 
### Step 7 — Summary message
 
After writing, show Netta:
- File path
- Count of tags per dimension
- Top 3 tags by `match_score` (value + match_score)
- Any new vocabulary proposed (with dimension + value)
- Anything flagged in `notes_for_validator`
- Two next-step options, in this order:
  1. **"Ready to push the artwork context to Supabase now"** — refers to the `writable_pre_validation` set (artist, artwork, sources, artwork_sources). Can be done immediately via the writer skill in `scope: context_only` mode, or via Supabase MCP using the JSON keys directly.
  2. **"Ready for the validator skill"** — for the tags.
Do NOT auto-chain into either. Stop here and let Netta decide.
 
---
 
## Constraints
 
- Hebrew copy must feel native — colloquial rhythm, not literal translation.
- Never invent sources. If a strand returns nothing useful, log it in `notes_for_validator` and move on.
- The output file is JSON only — no markdown wrapping, no commentary inside the file.
- One artwork per invocation. Do not batch.
- Artist's own first-person posts about their own work = `artist_statement`, regardless of platform.
- New vocabulary is allowed in five dimensions and forbidden in `exhibition_principle`.
