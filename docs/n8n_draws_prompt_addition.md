# n8n Classifier Prompt Addition — `draws` Dimension

**Target node:** `Message a model1` (workflow `Vnoy1WxaEQrOwwJT`)
**Context:** `draws text[]` column added to `global_initiatives` and `facebook_communities` on 2026-07-15; all 362 existing rows backfilled and validated. This addition makes future discovered rows arrive with `draws` classified.
**Status:** Not yet applied — pending manual edit (close n8n browser tabs before any MCP writes).

---

## 1. Add to the classification instructions block

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

## 2. Add to the output JSON format spec

In the example object the prompt shows Claude:

```
"draws": ["make", "meet"]
```

## 3. Build-day reminder

`Code in JavaScript3` auto-packages the parsed response and `Update a row` uses `autoMapInputData`, so `draws` should flow through to the column with no code change — but verify on the first run that it arrives as a proper array and not a stringified `"[\"make\",\"meet\"]"`. If it arrives as a string, the fix is one line in JS3: `draws: parsed.draws` staying an array before the update node.

---

The two consistency rules above (challenges, pledges) match the logic applied in the 2026-07-15 backfill, so future rows will land on the same classification behavior.
