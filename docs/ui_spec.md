# UI Spec v1.0 — Close the Circle (as-built)

**Repo:** github.com/nettatzin/closethecircle (Lovable-synced)
**Extracted:** 2026-07-15 from `main`
**App:** Post-exhibition visitor web app — The Circle / המעגל, Design Museum Holon
**Status:** Fully working prototype on **mock data**. No live DB reads, no email capture.

---

## 1. Stack (as built)

| Layer | Choice |
|---|---|
| Build | Vite + React 18 + TypeScript, SWC |
| UI kit | shadcn/ui (full Radix set installed), Tailwind CSS |
| Animation | framer-motion (heavy use: tab pills, section transitions, ripple, counters) |
| Routing | react-router-dom — single route `/` + `*` NotFound |
| Data fetching | @tanstack/react-query installed but **unused** — all data is static imports |
| Backend | @supabase/supabase-js client wired; one edge function deployed |
| i18n | Custom React context (`LanguageContext`), EN/HE, RTL switch on `document.dir`, persisted to `localStorage['circle.lang']` |
| SEO/meta | react-helmet-async |

### ⚠️ Backend findings (decisions needed)

1. **The app points to a different Supabase project.** `.env` targets Lovable's auto-provisioned project `tczfbbsydmbmktspghaz` — **not** EXAI (`qjqqyvpqkbljngmhxahl`) where all 362 initiative rows live. Its generated `types.ts` shows **zero tables**. V1 decision: repoint the client to EXAI, or replicate/sync data into the Lovable project. Repointing is one env change; the tradeoff is Lovable's built-in Supabase panel stops matching.
2. **`.env` is committed to git.** It contains only the publishable (anon) key — designed to be public — but the file shouldn't live in the repo, and the repo was public. Move to `.env.example` + Lovable env settings.
3. **A live-LLM feature exists**: `climate-vibes` edge function (Deno) calls Lovable AI gateway (`google/gemini-2.5-flash-lite`) to generate a one-sentence "climate vibe" in EN/HE on every filter change (700ms debounce, silent-fail). This **contradicts the project decision** of pre-built component library over per-visitor live inference. Keep / replace with deterministic sentence assembly / drop — needs a call.

---

## 2. Information architecture

```
/ (Index)
├─ WelcomeModal (on load, one-shot)
├─ Top tab bar (sticky): DISCOVER | ARTWORKS  + EN/HE toggle
│
├─ DISCOVER tab
│   ├─ sub-mode: ACT (default) — MainContent: filters + results
│   ├─ sub-mode: IMPACT — ImpactView: animated collective-impact counters + live feed
│   └─ sub-mode: CASHBACK — CashbackView: Israeli financial-benefit initiatives
│
├─ ARTWORKS tab — ArtworksView: search + theme/space filters, carousel, detail modal
│
└─ RippleModal (overlay) — "close the circle" exit flow
```

State lives in `useCircleStore` (plain `useState` hook, **not** persisted — refresh loses everything) + local component state. No URL state, no session identity, no analytics.

---

## 3. Data model (mock — `src/data/activities.ts`)

**61 activities** + **6 artworks**, duplicated wholesale in `activities.he.ts` (1,833 lines) for Hebrew. `useDataset()` swaps the entire module by language.

### Activity (UI shape)
```ts
{
  id: number;
  name, type, energyLabel, commitment, location, description: string;
  energyLevel: 'low-key' | 'hands-on' | 'deep-work';
  locationFormat: 'physical' | 'digital' | 'hybrid';
  region: 'israel' | 'global';
  gradient, icon: string;                      // card visual
  tags: { values[], benefits[], activityType[], format, commitment };
  draws: string[];                             // motivation ids
  connectedArtworks: number[];                 // artwork ids
  saves: number;                               // static count
  url: string;                                 // outbound link
  showCommunityMessage: boolean;               // triggers community-etiquette modal
}
```

### Artwork (UI shape)
`{ id, name, artist, image, gallery[], theme, space, year, medium, about, artistBio, links[] }`
Themes: Textile Waste / Material Reinvention / Upcycling / Ocean & Plastic / Urban Systems / Living Systems. Spaces: Main Hall / East Wing / Outdoor Garden / Lower Gallery / Project Room. 6 artworks incl. Mitumba (Maya Arazi & Merav Gazit), KitePride, City Transformer.

---

## 4. Filter model & matching logic (MainContent)

Four filter sections + artwork selector; all multi-select, all optional; AND across sections, OR within:

| Section | Options | Matches on |
|---|---|---|
| **Draws** ("what draws you") | explore 🌱 / meet 🤝 / make 🛠️ / amplify 📣 / exchange 🔄 / witness 👁️ | `activity.draws` any-match |
| **Energy** | low-key 🪶 (minutes–hour) / hands-on 🔥 (few hours) / deep-work 💪 (ongoing) | `energyLevel` |
| **Where** | physical / digital (hybrid matches both) + physical: location & radius (display-only, **not filtering**) + digital: reach israel/global | `locationFormat`, `region` |
| **Artworks** | pick from 6 artwork cards | `connectedArtworks` any-match |

Defaults preselected: draws `[explore, meet, make]`, energy `[hands-on]`, format `[physical]`, reach `[israel, global]`, artwork `[2]`.

Result section: count + proportional progress bar, ActivityCards (expandable details, tags, saves), empty state, "show all" reset. Each filter change fires the climate-vibes LLM call.

**"Close the circle" exit flow:** card CTA → if `showCommunityMessage`, community-etiquette confirm → ripple animation (2s) → `window.open(activity.url)` → auto-dismiss. This is the app's single conversion event — currently untracked.

---

## 5. Secondary views

- **ImpactView** — theatrical collective-impact counters: items-given-second-life counter (eased count-up then random drift), kg out of landfill, ≈washing-machines equivalence, "live now" action feed. **All numbers fabricated client-side** — no data source. Flag for the hidden-costs/close-cycle exhibition layer: this is where real aggregate data would land.
- **CashbackView** — hardcoded bilingual list of the 7 Israeli financial-benefit initiatives (ENVA, Lira Shapira, SpareEat, Shareitt, Cellcom Energy Green Track, solar-roof simulator, Sun For Everyone) with benefit summaries (e.g. "₪13,000/yr from your roof"). These overlap the SQL-insertion backlog — in V1 they should come from `global_initiatives`, not code.
- **ArtworksView** — search + theme/space chip filters over the 6 mock artworks, carousel, detail modal/panel with about/bio/links. **V2 UI already exists**; V2 work is mostly rewiring to the EXAI artwork tables.

---

## 6. i18n (as built)

- `strings.ts`: ~74 UI string keys × EN/HE, fallback to EN.
- Dataset translation = full duplicated HE data file. **This dies in V1**: once data comes from Supabase, Hebrew must come from `_he` columns (or the translations table), and `useDataset` becomes a query-layer language switch instead of a module swap.
- RTL handled globally via `document.dir`; components use logical Tailwind classes — spot-check needed per component in RTL.

## 7. Design system

- **Fonts:** Tenor Sans (display/serif), Inter (sans). Uppercase micro-labels with wide tracking (`tracking-[0.25em]`) as the signature register.
- **Tokens** (`index.css`, HSL vars): monochrome base + sage accent (`--sage`, `--sage-light`, `--sage-dark`), bone/stone/ink neutrals, gradient set (sage/mint/peach/pink/purple/cyan/sunset) used per-activity-card, `--gradient-overlay` for modals, soft/medium/glow shadows, `--radius` (sharp-ish `rounded-sm` predominates).
- **Line art:** `LineArt.tsx` exports SpiralLine / EllipseLine SVGs — currently **decorative** (rotating ellipse in welcome modal, faint spiral corners). The spiral-as-functional-filter-path UX (four stops on the spiral) from the design sessions is **not implemented**; filters are stacked accordion sections.
- Mobile-first: max-w-lg column, safe-area insets, apple-web-app meta.

---

## 8. Gap map → V1 (feeds the data contract spec)

| UI concept (mock) | EXAI DB reality | Mapping work |
|---|---|---|
| `energyLevel` low-key/hands-on/deep-work | `effort` (less_than_a_minute / up_to_10_minutes / 1_hour / dedicated) + `time_commitment` | Define 3→4 mapping or re-bucket UI |
| `locationFormat` physical/digital/hybrid | `format` (in_person / online / hybrid) | Rename layer |
| `region` israel/global | `location` free text ("Israel - Tel Aviv", "Global - Online") | Derive `region` in the DB view (computed column) |
| `draws` (6 motivations) | **no column** — nearest: `participation_type[]`, `activity_type` | Biggest gap: add a `draws` mapping in the view, or reclassify |
| `connectedArtworks` | five-principle numeric scores on both sides (query-time matching) | Replace id-lists with score-based matching — the real matching engine |
| `tags.values/benefits` | `materials[]`, `process[]`, `community_archetype[]`, `impact_tags[]`, principles | Display mapping (EN snake_case → HE display) |
| `saves` count | no table | New `saves`/`sessions` tables (also email capture) |
| single `activities` list | `global_initiatives` ∪ `facebook_communities` | UNION view on shared columns |
| CashbackView hardcoded | rows in `global_initiatives` | Insert + `is_commercial`/benefit fields, query by category |
| ImpactView fabricated numbers | nothing | Real aggregates or honest redesign |

**Not implemented at all (V1 scope):** email capture (all three touchpoints), anonymous session UUID + analytics, curation `status` gate, RLS read policies on EXAI, Hebrew from DB.

---

## 9. Component inventory

| Component | LOC | Role |
|---|---|---|
| MainContent | 512 | filters + results + vibe call — will absorb most V1 change |
| ActivityCard | 277 | expandable result card, close-circle CTA |
| ArtworkDetailModal / Panel | 216/196 | artwork detail (V2) |
| ArtworksView | 206 | artwork browse (V2) |
| ImpactView | 200 | impact theater |
| CashbackView | 165 | financial initiatives |
| LocationFilter | 138 | physical location/radius UI (non-functional filter) |
| RippleModal | 94 | exit flow |
| ArtworkCarousel | 74 | gallery |
| WelcomeModal | 65 | intro |
| EnergyCard / FilterChip / LineArt / NavLink | 32/30/45 | primitives |

---

## 10. Flags summary (decisions before V1 build)

1. **Supabase project mismatch** — repoint to EXAI vs. sync. (Recommend: repoint + generate types from EXAI.)
2. **climate-vibes live LLM** — keep, replace with deterministic component assembly, or cut.
3. **`draws` dimension** has no DB backing — the one filter that needs new classification or a mapping rule.
4. **Artwork matching**: mock uses hardcoded id-lists; the DB design is score-based. V1 ships without artworks — decide whether the artwork filter section is hidden in V1 or repurposed.
5. **ImpactView numbers are fiction** — fine for prototype, not for a museum. Needs real data or reframing.
6. `.env` out of git; LocationFilter either wired to real filtering or simplified.
