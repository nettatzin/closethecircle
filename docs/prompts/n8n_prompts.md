# n8n Prompts — Verbatim

**Extracted:** 2026-08-30 from live n8n. Flow documentation: `n8n_flows.md`.

⚠️ **This file is the only copy outside n8n.** Re-extract after any workflow change — `get_workflow_details` with `detailLevel: 'full'` returns everything here.

⚠️ **Close all n8n browser tabs before any MCP write.** The UI cache silently overwrites node-level changes.

Three prompts, plus one pending addition:

| # | Prompt | Workflow | Node |
|---|---|---|---|
| 1 | Perplexity discovery ×12 | `Vnoy1WxaEQrOwwJT` | `Perplexity Cat1`–`Cat12` |
| 2 | Message a model | `Vnoy1WxaEQrOwwJT` | `Message a model1` |
| 3 | Classify Initiative | `1waLzKfHTHeMRvs9` | `Classify Initiative` |
| 4 | **PENDING** — `draws` addition | both | not yet applied (S-75) |

---

# 1. Perplexity discovery (12 categories)

All twelve nodes share one system message and one user message. Only the **first line** differs per category — everything from "REQUIREMENTS FOR EACH RESULT" onward is byte-identical, except the `category` value in the output format.

## System message — identical on all 12

```
You are a global research agent discovering active, joinable sustainability and circular design initiatives for a museum exhibition project. Your goal is to find initiatives that real people can participate in — not archived projects or inactive organizations.

CRITICAL RULES:
- Only include initiatives with evidence of activity in 2026, not archived activities or initiatives!
- Every result must include a way for someone to participate, join, follow, or take action
- Do NOT return archived projects, defunct organizations, or pages with no recent updates
- Do NOT return any initiative listed in the EXCLUSIONS section in the user message
```

## User message

⚠️ **Must begin with `=`** so n8n evaluates the expressions. Without it, `{{ }}` is sent as literal text and the exclusion list silently never reaches Perplexity.

**Line 1 — varies per category.** Pick one from the table below.

**Lines 2 onward — identical on all 12**, with `{CATEGORY_NAME}` in the last line matching the category:

```
REQUIREMENTS FOR EACH RESULT:
1. Must show evidence of activity in 2025 or 2026 (recent posts, upcoming events, active community)
2. Must have a clear participation pathway — how does someone join or act?
3. Must be accessible globally or have online participation options
4. Prioritize lesser-known initiatives over obvious ones (skip WWF, Greenpeace, Ellen MacArthur Foundation)
5. Include a MIX of participation types: do not return only communities or only content creators
6. Each initiative MUST have a unique, direct URL pointing to its own page

EXCLUSIONS — DO NOT search for, suggest, or return any initiative listed below. These are already in our database:

{{ $('Build Exclusion List').first().json.exclusionText }}

CRITICAL ANTI-DUPLICATION RULES for your response:
- Each initiative in your response MUST have a URL that is UNIQUE within your response. No two items may share the same URL.
- The URL must point to that initiative's OWN primary page where someone signs up, joins, or participates. NOT a parent index, NOT a listing page, NOT an organization's "our programs" hub.
- If you cannot find a direct primary URL for an initiative, OMIT it. Do NOT pad your response by reusing URLs across items.
- Do NOT return any initiative whose URL or name closely matches anything in the EXCLUSIONS list above.

CRITICAL INSTRUCTION: Return ONLY a raw JSON array starting with [ and ending with ]. No markdown, no backticks. Parseable by JSON.parse().

participation_type — JSON array with 1-3 values from: community, direct_action, content, organization, platform, event, education

OUTPUT FORMAT:
[{"name":"","url":"","category":"{CATEGORY_NAME}","description":"2-3 sentences","participation_type":["community"],"how_to_join":"Specific action","activity_evidence":"Active in 2025-2026","audience":"Who for","language":"Languages","date_discovered":"{{$now.format('YYYY-MM-DD')}}"}]
```

## The 12 opening lines — verbatim

**Cat1**
```
=Find 5 NEW active global initiatives for CATEGORY 1 — Circular fashion. Search for: swap networks, mending collectives, sustainable fashion influencers, upcycling communities, slow fashion campaigns, textile recycling programs. WHAT COUNTS: Online community, direct action, content creator, organization, platform/tool, event/challenge.
```

**Cat2**
```
=Find 5 NEW active global initiatives for CATEGORY 2 — Biomaterials & material innovation. Search for: open-source bio-material communities, mycelium growing networks, natural dye collectives, biofabrication labs with public programs, material libraries. WHAT COUNTS: Online community, direct action (experiment/grow/share recipes), content creator, organization, platform/tool (materials database), event/challenge (workshops/biofabrication meetups).
```

**Cat3**
```
=Find 5 NEW active global initiatives for CATEGORY 3 — Repair & reuse. Search for: repair cafes, right-to-repair campaigns, tool libraries, Precious Plastic chapters, electronics repair communities, furniture restoration networks. WHAT COUNTS: Online community, direct action (repair/donate/volunteer/sign petition), content creator, organization (membership/chapter network/campaign), platform/tool (repair guides), event/challenge (repair month/fix-it clinics).
```

**Cat4**
```
=Find 5 NEW active global initiatives for CATEGORY 4 — Traditional craft preservation. Search for: weaving collectives, pottery communities, natural building networks, fermentation guilds, indigenous knowledge exchanges, heritage seed saving, basket weaving, natural fiber communities. WHAT COUNTS: Online community, direct action (grow/preserve/share seeds/volunteer), content creator, organization (membership/guild/collective), platform/tool (seed exchange/pattern library), event/challenge (workshops/gatherings/festivals).
```

**Cat5**
```
=Find 5 NEW active global initiatives for CATEGORY 5 — Species & ecosystem protection. Search for: adopt-an-animal programs, coral reef guardianship, rewilding causes, specific species campaigns, wildlife corridor projects, sanctuary volunteer programs, endangered species influencers. WHAT COUNTS: Online community, direct action (adopt/donate/volunteer/pledge/plant), content creator, organization (membership/guardianship/sponsorship), platform/tool (tracking app/citizen science), event/challenge (awareness weeks/fundraising).
```

**Cat6**
```
=Find 5 NEW active global initiatives for CATEGORY 6 — Citizen science & biodiversity. Search for: bird count networks, ocean plastic monitoring, biodiversity recording apps, pollinator surveys, water quality testing communities, eDNA sampling projects, nature journaling communities. WHAT COUNTS: Online community, direct action (count/monitor/record/sample/observe), content creator, organization (membership/volunteer network), platform/tool (biodiversity app/data platform), event/challenge (annual counts/bioblitz/city nature challenge).
```

**Cat7**
```
=Find 5 NEW active global initiatives for CATEGORY 7 — Regenerative agriculture & food. Search for: permaculture networks, seed exchange platforms, community-supported agriculture, fermentation communities, soil health initiatives, agroforestry collectives, food forest projects, composting networks. WHAT COUNTS: Online community, direct action (grow/compost/ferment/exchange seeds/volunteer), content creator, organization (CSA/cooperative/collective), platform/tool (seed library/soil testing), event/challenge (permaculture convergence/harvest festivals).
```

**Cat8** ← the only node the trigger fires
```
=Find 5 NEW active global initiatives for CATEGORY 8 — Ocean & water. Search for: beach cleanup networks, ocean conservation memberships, river guardianship programs, marine debris tracking, surfers-for-conservation communities, coral planting programs. WHAT COUNTS: Online community, direct action (clean up/monitor/plant coral/volunteer/pledge), content creator, organization (membership/guardianship/sponsorship), platform/tool (debris tracking/water quality), event/challenge (cleanup days/ocean month/dive events).
```

**Cat9**
```
=Find 5 NEW active global initiatives for CATEGORY 9 — Zero waste & plastic-free. Search for: online zero-waste challenges, community chapters, zero-waste bloggers/influencers, refill station networks, package-free shopping communities, buy-nothing groups, waste audit communities. WHAT COUNTS: Online community, direct action (audit waste/refuse plastic/swap/share), content creator, organization (membership/local chapter/buy-nothing group), platform/tool (refill finder/waste tracker), event/challenge (plastic free July/zero waste week).
```

**Cat10**
```
=Find 5 NEW active global initiatives for CATEGORY 10 — Permacomputing & slow tech. Search for: digital minimalism communities, e-waste reduction initiatives, open-source sustainability tools, right-to-repair for electronics, slow AI communities, low-tech magazine style projects, solar-powered computing. WHAT COUNTS: Online community, direct action (reduce screen time/repair electronics/build low-tech), content creator, organization (membership/open-source contributor/campaign), platform/tool (low-energy tools/open-source sustainability software), event/challenge (digital detox/e-waste drives).
```

**Cat11**
```
=Find 5 NEW active global initiatives for CATEGORY 11 — Community commons. Search for: community fridges networks, free stores, lending libraries (tools/toys/equipment), community energy cooperatives, time banks, sharing economy platforms, mutual aid networks. WHAT COUNTS: Online community, direct action (donate/share/lend/volunteer/start a fridge), content creator, organization (cooperative/time bank/mutual aid network), platform/tool (sharing app/lending platform/time bank software), event/challenge (sharing days/community potlucks/skill swaps).
```

**Cat12**
```
=Find 5 NEW active global initiatives for CATEGORY 12 — Urban ecology. Search for: guerrilla gardening networks, urban foraging communities, rooftop farming collectives, pollinator corridor projects, city nature challenge participants, urban wildlife monitoring, community composting hubs. WHAT COUNTS: Online community, direct action (plant/forage/compost/monitor/build habitat), content creator, organization (membership/gardening collective/composting cooperative), platform/tool (foraging app/composting platform/wildlife ID app), event/challenge (city nature challenge/guerrilla gardening days/seed bombs).
```

---

# 2. Message a model — `Vnoy1WxaEQrOwwJT`

Node `Message a model1` · `@n8n/n8n-nodes-langchain.anthropic` v1 · `claude-sonnet-4-6`

⚠️ The stored value begins with **`==`** (double equals). n8n uses one leading `=` for expressions, so the second is emitted as a literal character. Preserved exactly as stored.

```
==You are a classification agent for 'The Circle' exhibition at Design Museum Holon, focused on circular design, slowness economy, and regenerative practices.

Classify this initiative:

Name: {{ $json.name }}
URL: {{ $json.url }}
Category: {{ $json.category }}
Description: {{ $json.description }}
Participation type: {{ $json.participation_type }}
How to join: {{ $json.how_to_join }}
Audience: {{ $json.audience }}
Language: {{ $json.language }}

Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

{"technical_circularity":0.0,"spiritual_grounding":0.0,"community_engagement":0.0,"systems_awareness":0.0,"regenerative_intention":0.0,"materials":[],"process":[],"community_archetype":[],"impact_tags":[],"activity_type":"","skill_level":"","time_commitment":"","effort":"","cost":"","format":"","target_audience":"","location":"","exhibition_themes":[],"relevance_score":0,"is_commercial":false,"visitor_action":""}

PRINCIPLE SCORES (each 0.0-1.0, three decimals): technical_circularity: material innovation, waste elimination, product longevity. spiritual_grounding: wonder/awe, nature connection, mindfulness. community_engagement: collective action, participatory design, social justice. systems_awareness: interconnectedness, lifecycle thinking, ecosystem perspective. regenerative_intention: healing practices, restoration, abundance creation.

TAG ARRAYS — English snake_case, singular nouns, pick what applies (empty array if none). Seeds are starting points, NOT closed lists — if the initiative legitimately requires a value outside the seeds, add it:
- materials — physical materials the initiative deals with. Seeds: textile, insect_derived, food_waste, plastic, metal, plant_fiber, water, post_industrial, recycled, mycelium, leather, glass, ceramic, paper, wood
- process — what activity the initiative does. Seeds: handmade, machine_made, biofabrication, renovation, repair, disassembly, cultivation, digital_fabrication, found_object, chemical_transformation
- community_archetype — who the community is. Seeds: independent_designers, second_hand_economy, repair_communities, indigenous_practitioners, maker_spaces, environmental_orgs, faith_communities, urban_growers, academic, craft_collectives
- impact_tags — what change it produces. Seeds: pollution_reduction, reuse, community_growth, biodiversity, soil_health, water_conservation, cultural_preservation, skill_transmission, behavioral_shift, energy_reduction

SECONDARY TAGS: activity_type: workshop|volunteer|course|event|ongoing_initiative|cause|spread_the_word|self_serve. skill_level: beginner|intermediate|advanced|all_levels. time_commitment: one_time|weekly|monthly|seasonal|flexible. effort: less_than_a_minute|up_to_10_minutes|1_hour|dedicated. cost: free|donation_based|paid. format: in_person|online|hybrid. target_audience: families|professionals|students|all_ages. location: If in Israel use city (e.g. Israel - Tel Aviv). Otherwise Global or Global - Online.

EXHIBITION THEMES (array): back_to_nature, everyday_circle, healing_through_design.

relevance_score (1-5): relevance to The Circle. is_commercial: true/false. visitor_action: one verb sentence e.g. Join the Discord or Download the app.
```

---

# 3. Classify Initiative — `1waLzKfHTHeMRvs9`

Node `Classify Initiative` · `@n8n/n8n-nodes-langchain.chainLlm` v1.9
Model sub-node: `claude-sonnet-4-6`, `temperature: 0.2`, `maxTokensToSample: 2000`
Chain batching: 5 at a time, 500ms delay

**Content is identical to prompt 2** except for two things: it begins with a single `=` (correct), and it has **no blank lines** — every section runs on consecutive lines.

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
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.
{"technical_circularity":0.0,"spiritual_grounding":0.0,"community_engagement":0.0,"systems_awareness":0.0,"regenerative_intention":0.0,"materials":[],"process":[],"community_archetype":[],"impact_tags":[],"activity_type":"","skill_level":"","time_commitment":"","effort":"","cost":"","format":"","target_audience":"","location":"","exhibition_themes":[],"relevance_score":0,"is_commercial":false,"visitor_action":""}
PRINCIPLE SCORES (each 0.0-1.0, three decimals): technical_circularity: material innovation, waste elimination, product longevity. spiritual_grounding: wonder/awe, nature connection, mindfulness. community_engagement: collective action, participatory design, social justice. systems_awareness: interconnectedness, lifecycle thinking, ecosystem perspective. regenerative_intention: healing practices, restoration, abundance creation.
TAG ARRAYS — English snake_case, singular nouns, pick what applies (empty array if none). Seeds are starting points, NOT closed lists — if the initiative legitimately requires a value outside the seeds, add it:
- materials — physical materials the initiative deals with. Seeds: textile, insect_derived, food_waste, plastic, metal, plant_fiber, water, post_industrial, recycled, mycelium, leather, glass, ceramic, paper, wood
- process — what activity the initiative does. Seeds: handmade, machine_made, biofabrication, renovation, repair, disassembly, cultivation, digital_fabrication, found_object, chemical_transformation
- community_archetype — who the community is. Seeds: independent_designers, second_hand_economy, repair_communities, indigenous_practitioners, maker_spaces, environmental_orgs, faith_communities, urban_growers, academic, craft_collectives
- impact_tags — what change it produces. Seeds: pollution_reduction, reuse, community_growth, biodiversity, soil_health, water_conservation, cultural_preservation, skill_transmission, behavioral_shift, energy_reduction
SECONDARY TAGS: activity_type: workshop|volunteer|course|event|ongoing_initiative|cause|spread_the_word|self_serve. skill_level: beginner|intermediate|advanced|all_levels. time_commitment: one_time|weekly|monthly|seasonal|flexible. effort: less_than_a_minute|up_to_10_minutes|1_hour|dedicated. cost: free|donation_based|paid. format: in_person|online|hybrid. target_audience: families|professionals|students|all_ages. location: If in Israel use city (e.g. Israel - Tel Aviv). Otherwise Global or Global - Online.
EXHIBITION THEMES (array): back_to_nature, everyday_circle, healing_through_design.
relevance_score (1-5): relevance to The Circle. is_commercial: true/false. visitor_action: one verb sentence e.g. Join the Discord or Download the app.
```

---

## Notes on the classification prompts

**Both are the same prompt.** Two copies, two workflows, one `==` typo, different whitespace. If either is edited, the other drifts. Neither asks for `draws`.

**"Seeds are starting points, NOT closed lists"** — this instruction explicitly invites new tag values, and it is the origin of the uncontrolled tag arrays in `contracts.md` §5. Deliberate, not accidental. The head-heavy distribution it produced is what makes the D15 family-graph approach workable. **Do not close the vocabulary without revisiting D15.**

**Operational rule:** run the classification prompt verbatim before any Supabase insert, so tag vocabulary matches existing rows.

---

# 4. PENDING — `draws` addition to the classification prompt

**Status:** written, **not applied.** Tracked as **S-75**.
**Target:** `Message a model1` (`Vnoy1WxaEQrOwwJT`). Should also be applied to `Classify Initiative` (`1waLzKfHTHeMRvs9`) so the two copies stay identical.

The `draws text[]` column was added to both initiative tables on 2026-07-15 and all existing rows were backfilled and validated. Neither prompt asks for it, so **every newly discovered row arrives with `draws` NULL** — invisible to a live visitor-facing filter.

⚠️ Close all n8n browser tabs before applying.

## 4a. Add to the classification instructions block

Insert alongside the other tag dimensions:

```
DRAWS — visitor motivation tags (multi-label, REQUIRED):
Assign ALL that genuinely apply (typically 1-3, max 4), using ONLY these exact values:
- "explore" — learning, discovering, understanding; courses, lectures, tours, content, citizen science observation
- "meet" — human connection is central; communities, groups, meetups, gatherings, volunteering alongside others
- "make" — hands-on creation, building, fixing, growing; workshops, repair, crafting, gardening, composting, cleanups
- "amplify" — spreading the word, advocacy, signing, sharing, campaigning, donating, adopting/sponsoring
- "exchange" — swapping, sharing, second-hand, circular consumption, redistribution of goods or food
- "witness" — low-commitment observation; following, browsing, visiting, appreciating without active participation

Rules:
- Every initiative gets at least 1 draw. Base the decision ONLY on the provided fields.
- Marketplace / food-rescue / second-hand → include "exchange".
- Repair cafés and cleanups → "make" (+ "meet" if communal).
- Citizen-science observation/logging → "explore".
- Petitions, donations, pledges, adopt-a-X → "amplify".
- Hands-on household challenges → "make","explore"; consumption-pause pledges → "explore","amplify".
```

## 4b. Add to the output JSON format spec

In the example object the prompt shows Claude:

```
"draws": ["make", "meet"]
```

## 4c. Verify on first run

`Code in JavaScript3` auto-packages the parsed response and `Update a row` uses `autoMapInputData`, so `draws` should reach the column with no code change. **Verify it arrives as a proper array** and not a stringified `"[\"make\",\"meet\"]"`. If it arrives as a string, the fix is one line in JS3 — keep `draws: parsed.draws` as an array before the update node.

The two consistency rules above (challenges, pledges) match the logic applied in the 2026-07-15 backfill, so future rows land on the same classification behaviour as the existing catalogue.
