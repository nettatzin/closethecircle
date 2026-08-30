---
name: the-circle-artwork-validator
description: Validator skill for The Circle / המעגל exhibition. Activates ONLY when explicitly selected from the skills picker (e.g. /the-circle-artwork-validator). Do NOT trigger based on context, keywords, or topic inference. The user must invoke it from the picker. This skill takes the JSON output of the-circle-artwork-analyst for ONE artwork and runs independent validation across four axes — source integrity (URLs alive, content matches), evidence-quote verification (quotes are verbatim and actually in cited sources), tag coherence (evidence actually supports the tag, no hallucination, correct dimension/cluster_type), and coverage (nothing obvious missed). Presents a report, asks Netta to confirm each problem class, then writes a final Supabase-ready validated JSON.
---
 
# the-circle-artwork-validator
 
Validate one artwork analysis produced by `the-circle-artwork-analyst`. Re-fetch sources, verify evidence, judge tag coherence, check coverage, surface problems for Netta to confirm, then write a final `{slug}_validated.json` that is Supabase-ready.
 
This skill is step 2 of a three-skill pipeline:
1. `the-circle-artwork-analyst` → `{slug}_analysis.json`
2. **`the-circle-artwork-validator`** (this skill) → `{slug}_validated.json`
3. `the-circle-artwork-writer` → upserts to Supabase EXAI
The validator does NOT write to Supabase. It produces the final file the writer skill then upserts.
 
---
 
## When to use
 
- Netta selects the skill from the picker, with `{slug}_analysis.json` available in `/mnt/user-data/outputs/` (or uploaded).
- Never auto-trigger. Never chain automatically from the analyst.
---
 
## Inputs
 
- `{slug}_analysis.json` produced by the analyst skill
- Default path: `/mnt/user-data/outputs/{slug}_analysis.json`
- If not at the default path, ask Netta to confirm location or upload
If the input file is missing, malformed, or doesn't match the analyst's schema, stop and tell Netta what's wrong.
 
---
 
## Pre-flight (always run first)
 
1. Confirm the slug + artwork title from the file with Netta.
2. Report file stats: # sources, # tags, # languages searched, run_at timestamp from `analyst_meta`.
3. Confirm any flagged notes from `analyst_meta.notes_for_validator` — Netta may want to discuss before validation starts.
4. Get go-ahead before re-fetching sources (the heaviest step).
---
 
## Workflow
 
### Step 1 — Source integrity (re-fetch all URLs)
 
For every source in `sources[]` where `url` is non-null:
 
1. Use `web_fetch` to fetch the URL fresh. Record:
   - `http_status` (200, 404, 403, timeout, etc.)
   - `refetched_at` (timestamp)
   - `current_content_text` (new extracted text)
2. Classify the source's `validation_status`:
   - **`ok`** — HTTP 200 AND every `evidence_quote` citing this source is still verbatim in `current_content_text`
   - **`drifted`** — HTTP 200 BUT at least one `evidence_quote` no longer appears verbatim (page changed)
   - **`broken`** — HTTP 4xx / 5xx / timeout / unreachable
3. **Update `content_text` based on status, so the downstream writer has correct data without re-asking:**
   - `ok` → leave `content_text` unchanged (matches anyway)
   - `drifted` → **replace** `content_text` with `current_content_text`. Note this in `validator_audit.notes` (e.g. "content_text replaced with refetch; original drifted")
   - `broken` / `unverifiable` → leave `content_text` unchanged (no new content available)
4. Be patient with social platforms (Instagram, TikTok, X) — they often return 403 to scrapers even when the post is live. If you can't fetch but the URL pattern is well-formed, classify as `unverifiable` rather than `broken`, and log why.
For uploaded sources (`origin: uploaded`, no URL or null URL):
- No HTTP check possible. Validate that `content_text` is non-empty and every evidence quote citing this source appears verbatim within it. Status: `ok` or `drifted` based on quote check. `content_text` stays as-is (nothing to refetch).
**Important consequence**: when a source is `drifted` and the validator swaps in refreshed content, tags whose evidence quotes no longer appear in the new content have already been caught in Step 2 (evidence-match check) and routed to `curator_review` or `rejected`. So nothing silently breaks downstream.
 
### Step 2 — Evidence quote verification (per tag)
 
For every tag's `sources[].evidence_quote`:
 
1. Locate the cited source by `local_id` and use its **current** content_text (refreshed in Step 1) or original if drift-status is ok.
2. Search for the evidence quote verbatim (allow normalized whitespace).
3. Classify each evidence_quote:
   - **`ok`** — exact verbatim match
   - **`paraphrased`** — semantically similar text exists but wording differs (use string similarity ≥0.7 as a guideline)
   - **`hallucinated`** — no matching content exists in the source at all
### Step 3 — Tag coherence (LLM-as-judge, independent of analyst)
 
For each tag, judge independently (do not assume the analyst was right):
 
1. **Does the evidence quote actually support this tag's value in this dimension?**
   - Output: `supports` | `weakly_supports` | `doesnt_support`
2. **Is `cluster_type` correct?**
   - `declared` requires the tag to appear in the original uploaded brief, curator notes, or declared materials/process. If the tag is only supported by web-discovered sources, it should be `inferred` (or `emergent`).
   - `emergent` requires the pattern to show up across 2+ sources and not be stated directly anywhere. If single-source, downgrade.
3. **For `exhibition_principle` tags only — does the artwork meet the principle's tagging criterion?** Apply the criteria from the analyst skill exactly:
   - `technical_circularity` — concrete circular-economy mechanics (not surface messaging)
   - `spiritual_grounding` — reverent, attentive, non-extractive relationship (Heschel's radical amazement)
   - `community_engagement` — work inseparable from community of practice
   - `systems_awareness` — work makes interconnections visible (not just deploying sustainable materials)
   - `regenerative_intention` — work produces more than it consumes; restoration intent
4. **Numeric sanity** — recompute `match_score = max(source_strength) × confidence × score` and flag if the analyst's value is off by more than ±0.01.
### Step 4 — Coverage check
 
Run these checks against the full analysis file:
 
1. **Dimension coverage** — each of `process`, `materials`, `community`, `design`, `impact` has ≥1 tag. `exhibition_principle` has ≥1 tag.
2. **Unused sources** — list every source in `sources[]` that no tag cites. If a strong source (artist_statement, interview, direct relation) is unused, propose what dimension+value it could have supported.
3. **Obvious gaps from the dossier** — scan `artwork.declared_materials` and `artwork.declared_process`. If a declared material/process isn't reflected anywhere in the tags, flag it as a gap and propose the missing tag.
4. **Principle balance** — note which of the 5 exhibition principles were applied and which weren't. Not every artwork hits all 5, but if 4+ are missing, flag for Netta's awareness.
For each gap, propose a concrete tag (dimension + value + cited source + reasoning + score/confidence estimate) but do NOT add it autonomously. Netta confirms in Step 6.
 
### Step 5 — Per-tag verdict assignment
 
Combine all checks into a single status per tag:
 
| Condition | Status |
|---|---|
| All checks pass (source ok, evidence ok, tag coherence supports, cluster_type ok, numeric ok) | `validated` |
| Evidence paraphrased, OR tag coherence weakly_supports, OR cluster_type misclassified, OR source drifted, OR source unverifiable, OR new vocabulary used, OR principle criterion borderline | `curator_review` |
| Evidence hallucinated, OR tag coherence doesnt_support, OR source broken AND no other source backs the tag, OR principle criterion fails clearly | `rejected` |
 
Each tag also gets a `validation_notes` string explaining the verdict — short, specific, ≤300 chars.
 
### Step 6 — Present report to Netta + confirm
 
Show a structured report in this order:
 
**A. Source integrity summary**
```
Sources checked: N
  ok: X
  drifted: Y     (URL still alive but content changed)
  broken: Z      (404 / 403 / timeout)
  unverifiable: W (social platforms blocking fetch)
  uploaded (no URL): V
```
List every non-`ok` source with its URL and what's wrong.
 
**B. Tag verdict breakdown**
```
Tags total: N
  validated: X
  curator_review: Y
  rejected: Z
```
List every `curator_review` and `rejected` tag with its verdict reason. Group by reason (hallucinated evidence, weak coherence, wrong cluster_type, etc.).
 
**C. Coverage gaps & proposed additions**
List every gap with the proposed tag in this format:
```
Gap: <dimension>:<value>
Why missing: <reason>
Proposed evidence: source <local_id> — "<quote>"
Estimated score / confidence: 0.XX / 0.XX
```
 
**D. Vocabulary review**
Every entry in `analyst_meta.new_vocabulary_proposed` with the validator's verdict:
- `accept` — reasonable, no overlap with seed values
- `merge_with: <seed_value>` — overlaps with an existing seed value; should be merged
- `reject` — not a useful vocabulary addition
**E. Confirmation questions**
Ask Netta, one at a time:
1. "Should I keep, downgrade to curator_review, or restore to validated any of the **rejected** tags?"
2. "Should I promote any of the **curator_review** tags to validated, or are they correctly flagged?"
3. "Should I add the **proposed gap-fill tags**? (yes / no / select specific ones)"
4. "Should I apply the **vocabulary verdicts** (accept / merge / reject)?"
Wait for each answer before continuing. Apply changes after each answer.
 
### Step 7 — Write final output
 
After all confirmations are applied, save to: `/mnt/user-data/outputs/{slug}_validated.json`
 
**Design principle**: every field that maps to a Supabase column lives on the main object (artist, artwork, source, tag). Every validator-only audit field lives in a nested `validator_audit` block on that object. The writer skill drops every `validator_audit` block plus the top-level `validator_report` before upserting.
 
#### Allowed enum values
 
| Field | Allowed values |
|---|---|
| `tags[].status` | `pending`, `validated`, `curator_review`, `rejected` |
| `tags[].cluster_type` | `declared`, `inferred`, `emergent` *(strict — matches Supabase check constraint; do not introduce new values)* |
| `sources[].validator_audit.validation_status` | `ok`, `drifted`, `broken`, `unverifiable` |
| `tags[].validator_audit.verdicts.source_integrity` | `ok`, `drifted`, `broken`, `unverifiable` |
| `tags[].validator_audit.verdicts.evidence_match` | `ok`, `paraphrased`, `hallucinated` |
| `tags[].validator_audit.verdicts.tag_coherence` | `supports`, `weakly_supports`, `doesnt_support` |
| `tags[].validator_audit.verdicts.cluster_type_check` | `ok`, `should_be_inferred`, `should_be_emergent`, `should_be_declared` |
| `tags[].validator_audit.verdicts.principle_criterion_check` | `ok`, `borderline`, `fails`, `n/a` |
| `tags[].validator_audit.verdicts.numeric_sanity` | `ok`, `recomputed` |
 
#### Schema (with realistic example values — not enum-lists-as-strings)
 
The blocks marked `/* preserved verbatim from analysis.json */` mean the validator copies that block byte-for-byte from the analyst output. They are not part of the literal JSON.
 
```json
{
  "artist": {
    "name": "Sasha Letzter",
    "name_he": "סשה לצטר",
    "bio": "Israeli designer working with discarded plastics ...",
    "socials": ["https://instagram.com/sashaletzter"]
  },
 
  "artwork": {
    "slug": "letzter-trash-talk",
    "title_he": "טראש טוק",
    "title_en": "Trash Talk",
    "year": 2024,
    "exhibition_section": "Everyday Circle",
    "declared_materials": ["plastic", "post_industrial"],
    "declared_process": ["found_object", "chemical_transformation"],
    "curator_notes": "Letzter collects single-use plastic from Tel Aviv beaches ...",
    "media_refs": [
      { "type": "image", "url": "https://...", "caption": "Installation view" }
    ],
    "raw_corpus": "concatenated uploaded text + key fetched sources, language-tagged"
  },
 
  "sources": [
    {
      "local_id": "src_001",
      "url": "https://example.com/interview-letzter",
      "url_hash": "sha256:abc123...",
      "title": "Interview with Sasha Letzter",
      "source_type": "interview",
      "source_relation": "direct",
      "origin": "found_by_agent",
      "language": "he",
      "fetched_at": "2026-06-05T10:00:00Z",
      "content_text": "Full extracted text of the interview ...",
      "validator_audit": {
        "validation_status": "ok",
        "http_status": 200,
        "refetched_at": "2026-06-12T14:30:00Z",
        "notes": ""
      }
    },
    {
      "local_id": "src_002",
      "url": "https://instagram.com/p/xyz",
      "url_hash": "sha256:def456...",
      "title": "Instagram post by the artist",
      "source_type": "artist_statement",
      "source_relation": "direct",
      "origin": "found_by_agent",
      "language": "he",
      "fetched_at": "2026-06-05T10:05:00Z",
      "content_text": "Caption text from the artist's own post ...",
      "validator_audit": {
        "validation_status": "unverifiable",
        "http_status": 403,
        "refetched_at": "2026-06-12T14:31:00Z",
        "notes": "Instagram blocks fetcher; URL pattern well-formed; original content_text retained"
      }
    }
  ],
 
  "tags": [
    {
      "dimension": "process",
      "value": "found_object",
      "cluster_type": "declared",
      "reasoning": "Artist describes collecting discarded plastics as core method, stated in curator brief and confirmed in interview.",
      "score": 0.900,
      "confidence": 0.850,
      "match_score": 0.726,
      "sources": [
        {
          "local_id": "src_001",
          "evidence_quote": "I walk the beach looking for what others have thrown away.",
          "source_strength": 0.900
        }
      ],
      "status": "validated",
      "validated_by": "the-circle-artwork-validator@claude-opus-4-7",
      "validated_at": "2026-06-12T14:45:00Z",
      "validator_audit": {
        "verdicts": {
          "source_integrity": "ok",
          "evidence_match": "ok",
          "tag_coherence": "supports",
          "cluster_type_check": "ok",
          "principle_criterion_check": "n/a",
          "numeric_sanity": "ok"
        },
        "validation_notes": "All checks pass.",
        "added_by_validator": false
      }
    },
    {
      "dimension": "impact",
      "value": "cultural_preservation",
      "cluster_type": "inferred",
      "reasoning": "Validator gap-fill: declared materials reference traditional Mediterranean fishing-net repair, but no impact tag captured the heritage angle.",
      "score": 0.700,
      "confidence": 0.750,
      "match_score": 0.473,
      "sources": [
        {
          "local_id": "src_004",
          "evidence_quote": "These nets carry forty years of Jaffa fishermen's knots.",
          "source_strength": 0.900
        }
      ],
      "status": "validated",
      "validated_by": "the-circle-artwork-validator@claude-opus-4-7",
      "validated_at": "2026-06-12T14:46:00Z",
      "validator_audit": {
        "verdicts": {
          "source_integrity": "ok",
          "evidence_match": "ok",
          "tag_coherence": "supports",
          "cluster_type_check": "ok",
          "principle_criterion_check": "n/a",
          "numeric_sanity": "ok"
        },
        "validation_notes": "Added from coverage gap; Netta confirmed.",
        "added_by_validator": true
      }
    }
  ],
 
  "analyst_meta": { /* preserved verbatim from analysis.json */ },
 
  "validator_report": {
    "run_at": "2026-06-12T14:45:00Z",
    "model": "claude-opus-4-7",
    "checks_run": [
      "source_integrity", "evidence_match", "tag_coherence",
      "cluster_type", "principle_criteria", "coverage", "numeric_sanity"
    ],
    "source_summary": {
      "total": 12, "ok": 9, "drifted": 1, "broken": 1, "unverifiable": 1, "uploaded_no_url": 3
    },
    "tag_summary": {
      "total": 32, "validated": 24, "curator_review": 6, "rejected": 2
    },
    "coverage_gaps_filled": [
      { "dimension": "impact", "value": "cultural_preservation", "added_after_confirmation": true }
    ],
    "vocabulary_decisions": [
      { "dimension": "materials", "value": "shellac", "decision": "accept" }
    ],
    "user_confirmations": {
      "rejected_tags_kept_rejected": ["process:speculative"],
      "curator_review_promoted": [],
      "gap_fills_accepted": ["impact:cultural_preservation"],
      "vocabulary_accepted": ["materials:shellac"]
    }
  },
 
  "supabase_writer_hints": {
    "natural_keys": {
      "artist": "name",
      "artwork": "slug",
      "source": "url_hash (null for uploaded files — dedupe by title+origin)",
      "tag": ["artwork_id", "dimension", "value"]
    },
    "id_translation": "local_id values (src_001, …) are local to this file. Writer must resolve them to Supabase UUIDs after upserting sources, then rewrite tags[].sources[].local_id → source_id (UUID) before inserting tag rows.",
    "writable_pre_validation": ["artist", "artwork", "sources", "artwork_sources"],
    "writable_post_validation": ["tags"],
    "artwork_sources_derivation": "For each source in sources[], create one artwork_sources row: { artwork_id (resolved from artwork.slug), source_id (resolved from local_id), source_relation (from source.source_relation) }.",
    "fields_to_drop_before_upsert": [
      "sources[].validator_audit",
      "tags[].validator_audit",
      "tags[].sources[].local_id  (replace with resolved source_id UUID)",
      "validator_report",
      "supabase_writer_hints",
      "analyst_meta"
    ],
    "tag_status_filter": "Upsert tags where status IN ('validated', 'curator_review'). Skip tags where status='rejected'. Status is written to the Supabase tags.status column verbatim."
  }
}
```
 
Notes on the schema:
- `validator_audit` blocks are the **only** place validator-only data lives. The writer drops them.
- `cluster_type` is strict to `declared`, `inferred`, `emergent` — matches the Supabase check constraint. Validator-added gap-fill tags use the appropriate value (almost always `inferred`) and are tracked via `validator_audit.added_by_validator: true`.
- Source-side `source_relation` stays on the source object, but the writer projects it into `artwork_sources` rows (the source itself doesn't store relation in Supabase).
- `validator_report.tag_summary` numbers must reconcile to the actual counts in `tags[]`.
### Step 8 — Summary message
 
After writing, show Netta:
 
- File path
- Final tag counts (validated / curator_review / rejected)
- Source health summary
- Any tags promoted from rejected/curator_review based on her confirmations
- New tags added from gap-fills
- Then: **"Ready for Supabase upload — pass this file to `the-circle-artwork-writer`, or push directly via Supabase MCP."**
Do NOT auto-chain into the writer. Stop here.
 
---
 
## Constraints
 
- The validator does NOT run new web searches. It only re-fetches URLs that are already in `sources[]`.
- The validator does NOT modify the original `analyst_meta` block — it's preserved verbatim for traceability.
- The validator does NOT silently change tag fields. Every change is either (a) status/verdicts (new fields added), or (b) explicitly confirmed by Netta in Step 6.
- New tags from gap-fills go in with `status: validated` (Netta confirmed them) and `cluster_type` set to the appropriate strict value (`declared`, `inferred`, or `emergent`) — almost always `inferred` since the validator derives them from existing sources. The fact that a tag was added by the validator is tracked in `validator_audit.added_by_validator: true`, not by inventing a new cluster_type value (which would violate the Supabase check constraint).
- LLM-as-judge calls (Step 3) should be independent from the analyst's reasoning — read the evidence quote and dimension/value fresh, do not anchor to the analyst's `reasoning` field.
- Numeric sanity issues are auto-corrected (recompute match_score) and logged in `verdicts.numeric_sanity`. Not surfaced as confirmation questions.
- One artwork per invocation. Do not batch.
