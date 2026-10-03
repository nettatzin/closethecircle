# n8n Prompts — Verbatim

**Extracted:** 2026-09-28 from live n8n. Flow documentation: `n8n_flows.md`.

⚠️ **This file is the only copy outside n8n.** Re-extract after any workflow change — `get_workflow_details` returns everything here.

⚠️ **Close all n8n browser tabs before any MCP write.** The UI cache silently overwrites node-level changes.

| # | Prompt | Workflow | Node | Model |
|---|---|---|---|---|
| 1 | Discovery template | Discovery `maili5sVWycFyQ0i` | `Build Prompts` (code) → `Discover (Claude web search)` | `claude-sonnet-5` + `web_search_20250305`, max 3 searches, `max_tokens` 8000 |
| 2 | Classify | Classify `xf490HVAL7XhX5zc` | `Classify (Claude)` | `claude-sonnet-5`, temperature 0.2, 1200 tokens |
| 3 | Read a link | Add Links `Q9goXorlxj0vps7L` | `Build Read Prompt` (code) → `Read Link (Claude)` | `claude-sonnet-5` + web search, max 2, `max_tokens` 3000 |
| 4 | Translate to Hebrew | Translate `wcP5gs4snAb81msf` | `Translate to Hebrew (Claude)` | `claude-sonnet-5`, 600 tokens, thinking off |

The previous prompts (12 Perplexity discovery prompts, two copies of the classifier) are in this file's git history before 2026-09-28. Their workflows are archived.

---

# 1. Discovery template

One template replaces the 12 category prompts. It is assembled in the `Build Prompts` code node, once per chosen category. Edit a category there, not in 12 places.

## Category table

| Category | Search ideas |
|---|---|
| Circular fashion | swap networks, mending collectives, upcycling communities, slow fashion campaigns, textile recycling programs, sustainable fashion creators |
| Biomaterials & material innovation | open-source bio-material communities, mycelium growing networks, natural dye collectives, biofabrication labs with public programs, material libraries |
| Repair & reuse | repair cafes, right-to-repair campaigns, tool libraries, Precious Plastic chapters, electronics repair communities, furniture restoration networks |
| Traditional craft preservation | weaving collectives, pottery communities, natural building networks, fermentation guilds, indigenous knowledge exchanges, heritage seed saving, basket weaving, natural fiber communities |
| Species & ecosystem protection | adopt-an-animal programs, coral reef guardianship, rewilding causes, species campaigns, wildlife corridor projects, sanctuary volunteer programs, wildlife rescue |
| Citizen science & biodiversity | bird counts, ocean plastic monitoring, biodiversity recording apps, pollinator surveys, water quality testing communities, eDNA sampling, nature journaling |
| Regenerative agriculture & food | permaculture networks, seed exchanges, community-supported agriculture, fermentation communities, soil health, agroforestry, food forests, composting networks, food rescue |
| Ocean & water | beach cleanup networks, ocean conservation memberships, river and stream guardianship, marine debris tracking, surfers for conservation, coral planting |
| Zero waste & plastic-free | zero-waste challenges, community chapters, refill station networks, package-free shopping communities, buy-nothing and giveaway groups, waste audits |
| Permacomputing & slow tech | digital minimalism communities, e-waste reduction, open-source sustainability tools, electronics right to repair, slow AI, low-tech projects, solar-powered computing |
| Community commons | community fridges, free stores, lending libraries for tools and toys, community energy cooperatives, time banks, sharing platforms, mutual aid networks |
| Urban ecology | guerrilla gardening, urban foraging, rooftop farming, pollinator corridors, city nature challenge, urban wildlife monitoring, community composting hubs, community gardens |

## Scope lines

**Israel run:** `in Israel only. Search in Hebrew and in English (for example the topic together with words like עמותה, קהילה, סדנה, התנדבות, קבוצה). Include Arab-Israeli and Druze communities where relevant. Every result must be based in Israel.`

**Global run:** `outside Israel, joinable by an international audience or online. Do not return Israeli initiatives.`

## Template

`{N}` = max per category (1–5). `{KNOWN}` = that category's 40 most recent names, one `- name` per line.

```
Find up to {N} NEW, currently active initiatives for the category "{CATEGORY}", {SCOPE LINE}

Search ideas: {SEARCH IDEAS}.

Use the web search tool. Only return initiatives you actually found on a page during this search, with that page's URL. Never write a URL from memory.

Requirements for every result:
1. Evidence of activity in 2025 or 2026 (recent posts, upcoming events, active community).
2. A clear way for a member of the public to join or act.
3. The URL is the initiative's own page (its site, or its own Facebook or Instagram page), not a news article, listing or directory.
4. Prefer lesser-known grassroots initiatives over large NGOs.
5. A mix of participation types.

Already in our catalogue for this category. Do not return these:
{KNOWN}

If fewer than {N} meet every requirement, return fewer. Return [] if none.

Return ONLY a JSON array, no markdown, as your final answer:
[{"name":"","url":"","description":"2-3 sentences in English","participation_type":["community"],"how_to_join":"","activity_evidence":"what shows it is active in 2025-2026","audience":"","language":"","location":""}]
participation_type: 1-3 values from community, direct_action, content, organization, platform, event, education.
location: {LOCATION RULE}.
```

**Location rule** — Israel: `"Israel - <town or city name in English>" when it is tied to one place, or "Israel - National" when it is nationwide or online`. Global: `"Global" for a physical place outside Israel, or "Global - Online" when it is online`.

Real dedup happens after the call, on the normalised URL against both tables; the exclusion list only saves searches.

---

# 2. Classify

WF2's prompt (the better of the two old copies) plus: `draws` (the S-75 addition, applied), a closed-list instruction for the secondary tags, a fixed location shape, and the location as found. Tag arrays stay open ("Seeds are starting points") — do not close them without revisiting D15.

```
=You are a classification agent for 'The Circle' exhibition at Design Museum Holon, focused on circular design, slowness economy, and regenerative practices.
Classify this initiative:
Name: {{ $json.name }}
URL: {{ $json.url }}
Category: {{ $json.category }}
Description: {{ $json.description }}
Participation type: {{ $json.participation_type }}
How to join: {{ $json.how_to_join }}
Audience: {{ $json.audience }}
Language: {{ $json.language }}
Location as found: {{ $json.location }}
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.
{"technical_circularity":0.0,"spiritual_grounding":0.0,"community_engagement":0.0,"systems_awareness":0.0,"regenerative_intention":0.0,"materials":[],"process":[],"community_archetype":[],"impact_tags":[],"activity_type":"","skill_level":"","time_commitment":"","effort":"","cost":"","format":"","target_audience":"","location":"","exhibition_themes":[],"draws":[],"relevance_score":0,"is_commercial":false,"visitor_action":""}
PRINCIPLE SCORES (each 0.0-1.0, three decimals): technical_circularity: material innovation, waste elimination, product longevity. spiritual_grounding: wonder/awe, nature connection, mindfulness. community_engagement: collective action, participatory design, social justice. systems_awareness: interconnectedness, lifecycle thinking, ecosystem perspective. regenerative_intention: healing practices, restoration, abundance creation.
TAG ARRAYS — English snake_case, singular nouns, pick what applies (empty array if none). Seeds are starting points, NOT closed lists — if the initiative legitimately requires a value outside the seeds, add it:
- materials — physical materials the initiative deals with. Seeds: textile, insect_derived, food_waste, plastic, metal, plant_fiber, water, post_industrial, recycled, mycelium, leather, glass, ceramic, paper, wood
- process — what activity the initiative does. Seeds: handmade, machine_made, biofabrication, renovation, repair, disassembly, cultivation, digital_fabrication, found_object, chemical_transformation
- community_archetype — who the community is. Seeds: independent_designers, second_hand_economy, repair_communities, indigenous_practitioners, maker_spaces, environmental_orgs, faith_communities, urban_growers, academic, craft_collectives
- impact_tags — what change it produces. Seeds: pollution_reduction, reuse, community_growth, biodiversity, soil_health, water_conservation, cultural_preservation, skill_transmission, behavioral_shift, energy_reduction
SECONDARY TAGS (exactly one value each, from these lists only): activity_type: workshop|volunteer|course|event|ongoing_initiative|cause|spread_the_word|self_serve. skill_level: beginner|intermediate|advanced|all_levels. time_commitment: one_time|weekly|monthly|seasonal|flexible. effort: less_than_a_minute|up_to_10_minutes|1_hour|dedicated. cost: free|donation_based|paid. format: in_person|online|hybrid. target_audience: families|professionals|students|all_ages.
LOCATION (exactly one of these shapes): "Israel - <town or city name in English>" when it is tied to one place in Israel; "Israel - National" when it is Israeli but nationwide or online; "Global" when it is outside Israel with a physical presence; "Global - Online" when it is international and online.
EXHIBITION THEMES (array): back_to_nature, everyday_circle, healing_through_design.
DRAWS — visitor motivation tags (multi-label, REQUIRED): assign ALL that genuinely apply (typically 1-3, max 4), using ONLY these exact values:
- "explore" — learning, discovering, understanding; courses, lectures, tours, content, citizen science observation
- "meet" — human connection is central; communities, groups, meetups, gatherings, volunteering alongside others
- "make" — hands-on creation, building, fixing, growing; workshops, repair, crafting, gardening, composting, cleanups
- "amplify" — spreading the word, advocacy, signing, sharing, campaigning, donating, adopting/sponsoring
- "exchange" — swapping, sharing, second-hand, circular consumption, redistribution of goods or food
- "witness" — low-commitment observation; following, browsing, visiting, appreciating without active participation
Draws rules: every initiative gets at least 1 draw; base the decision ONLY on the provided fields. Marketplace / food-rescue / second-hand → include "exchange". Repair cafés and cleanups → "make" (+ "meet" if communal). Citizen-science observation/logging → "explore". Petitions, donations, pledges, adopt-a-X → "amplify". Hands-on household challenges → "make","explore"; consumption-pause pledges → "explore","amplify".
relevance_score (1-5): relevance to The Circle. is_commercial: true/false. visitor_action: one verb sentence e.g. Join the Discord or Download the app.
```

The validator (`Parse and Validate`) rejects any value outside the closed lists, so a bad answer leaves the row unclassified for the next run instead of writing a wrong value.

---

# 3. Read a link

Assembled in `Build Read Prompt`. `{PAGE TEXT}` = the fetched page, tags stripped, meta descriptions kept, first 12,000 characters.

```
Describe this initiative for a museum app that connects visitors to circular-design, sustainability and community initiatives.

URL: {URL}
Curator notes: {NOTES}            ← only when the form's Notes field is filled
Page text (may be empty or a login wall): {PAGE TEXT or (none)}

If the page text is not enough, use web search to find this exact initiative (at most 2 searches). Use only facts you found; never invent.
Return ONLY a JSON object, no markdown:
{"readable":true,"name":"","description":"2-3 sentences in English","category":"","participation_type":["community"],"how_to_join":"","activity_evidence":"what shows it is active in 2025-2026","audience":"","language":"","location":""}
readable: false if you could not find what this initiative is.
category: use exactly "{FORM CATEGORY}"   ← or: one of <the 12 category names>
participation_type: 1-3 of community, direct_action, content, organization, platform, event, education.
location: "Israel - <town or city in English>", "Israel - National", "Global" or "Global - Online".
```

---

# 4. Translate to Hebrew

```
=You write the Hebrew version of a listing in the post-visit app of "המעגל" (The Circle), an exhibition at Design Museum Holon about circular design, slowness and regenerative practice. Visitors read these listings on their phone after the exhibition, to find a community or initiative to join.

Listing:
Name: {{ $json.name }}
Description: {{ $json.description }}
Location: {{ $json.location }}
Source language: {{ $json.language }}

Rules:
- Write native, warm, spoken Israeli Hebrew, as a good museum copywriter would. Not a literal translation. Short, clear sentences.
- name_he: if the name is already in Hebrew, keep it exactly. If it contains a Hebrew name (for example in parentheses), use that. Otherwise keep the organisation's own name recognisable: keep a brand name in its original form or a common Hebrew transliteration, and add a short Hebrew descriptor only if the name alone says nothing.
- description_he: one or two sentences, at most 220 characters: what it is and what a visitor can do there. Use only facts from the source; add nothing. No superlatives or marketing tone.
- Invite the reader to act (join, visit, volunteer, donate) only if the source says that is possible. Never invent an invitation, opening hours, visits or ways to give.
- When addressing the reader, use the plural imperative (הצטרפו, בואו, למדו).
- Use the standard Hebrew spelling of Israeli place names.
- Do not force exhibition vocabulary; use it only if it fits naturally.

Return ONLY a JSON object, no markdown: {"name_he":"","description_he":""}
```

The "never invent an invitation" rule was added on 2026-09-28 after a spot check found invented "come visit" lines; the first 100 backfilled rows were re-run with it.
