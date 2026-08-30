# App Spec — Close the Circle

**What the app is and does.** As-built state and intended behaviour in one place, with the gap between them marked inline.

**Repo:** github.com/nettatzin/closethecircle (Lovable-synced)
**Verified against `main`:** 2026-08-30 (commit 5900ca4b, last edited 2026-08-02)
**Status:** working prototype on **mock data**. No live DB reads. **All DB writes are stubbed.**

**Absorbs and retires** `ui_spec.md` (v2.0) and `v1_functional_spec.md` (v1.1). Delete both.

Data contracts → `contracts.md`. Decisions → `decisions.md`. Numbers → `state.sql`.

---

## 1. Stack

| Layer | Choice |
|---|---|
| Build | Vite + React 18 + TypeScript, SWC |
| UI kit | shadcn/ui (full Radix set), Tailwind CSS |
| Animation | framer-motion — tab pills, transitions, ripple, counters, rings |
| Routing | react-router-dom — single route `/` + `*` NotFound |
| Data fetching | @tanstack/react-query installed but **unused**; all data is static imports |
| Backend | @supabase/supabase-js wired; **one call in the entire app** |
| Auth | none built. Magic link per D21 |
| i18n | custom `LanguageContext`, EN/HE, RTL via `document.dir`, persisted to `localStorage['circle.lang']` |
| SEO | react-helmet-async |
| Hosting | Lovable default |

### ⚠️ Backend state

1. **Points at the wrong Supabase project.** `.env` (committed to git) and `supabase/config.toml` target Lovable's `tczfbbsydmbmktspghaz`, not EXAI. S-120
2. **`climate-vibes` is the only live Supabase call** (`MainContent.tsx:182`) — an edge function on the dummy project calling `google/gemini-2.5-flash-lite` via the Lovable AI gateway on every filter change, 700ms debounce, **silent fail**. EXAI has no edge functions, so it dies on repoint and nothing reports it. D14 / S-118

---

## 2. Information architecture

```
/ (Index)
├─ WelcomeModal — on load, one-shot
├─ AppNav — five modes, persisted to localStorage
│
├─ act        → MainContent   — filters + results
├─ my_list    → MyListView    — saved initiatives + saved artworks, tabbed
├─ impact     → MyCircleView  — return-type rings, mine/everyone scope
├─ cashback   → CashbackView  — Israeli financial-benefit services
└─ artworks   → ArtworksView  — search + theme/space filters, carousel, detail
│
├─ RippleModal — "close the circle" exit flow
└─ email/     — three prompt components, triggered from session state
```

`AppMode = 'act' | 'my_list' | 'impact' | 'cashback' | 'artworks'`, persisted across reloads.

State: `useCircleStore` (filters, mode, ripple) + `useSession` (identity, saves, events, email) + local component state. No URL state.

---

## 3. Mock data model

`src/data/activities.ts` — **60 activities, 6 artworks, 6 themes, 5 spaces.** Duplicated wholesale in `activities.he.ts` (1,833 lines); `useDataset()` swaps the module by language.

```ts
Activity {
  id: number;
  name, type, energyLabel, commitment, location, description: string;
  energyLevel: 'low-key' | 'hands-on' | 'deep-work';
  locationFormat: 'physical' | 'digital' | 'hybrid';
  region: 'israel' | 'global';
  gradient, icon: string;
  tags: { values[], benefits[], activityType[], format, commitment };
  draws: string[];
  connectedArtworks: number[];
  saves: number;                    // static, fictional
  url: string;
  showCommunityMessage: boolean;
}

Artwork { id, name, artist, image, gallery[], theme, space, year, medium, about, artistBio, links[] }
```

⚠️ `activities.he.ts` also holds the 6 mock artworks. **Extract before deleting the file** (S-73).

---

## 4. Filters and results

Four sections + artwork selector; multi-select, all optional; AND across sections, OR within.

| Section | Options | Matches on |
|---|---|---|
| Draws | explore · meet · make · amplify · exchange · witness | `activity.draws` |
| Energy | low-key · hands-on · deep-work | `energyLevel` |
| Where | physical · digital (hybrid both) + reach israel/global | `locationFormat`, `region` |
| Artworks | 6 artwork cards | `connectedArtworks` — **no effect per D4** |

**All filter defaults are empty arrays** (`useCircleStore`) — the app opens showing everything, matching the locked principle. *(Earlier spec versions described preselected defaults; those are gone.)*

`LocationFilter` shows a location and radius picker defaulting to Tel Aviv / 15km. **Display-only, does not filter** — per D3.

**Close-the-circle flow:** card CTA → community-etiquette confirm if `showCommunityMessage` → ripple (2s) → `window.open(activity.url)`.

⚠️ **`handleCloseCircle` logs nothing.** The app's single conversion event is untracked — not even to console. S-68.

Mapping to live columns: `contracts.md` §6. Both `energy_level` and `region` are missing from the live view (S-117), and the energy bucketing is unbalanced (S-127).

---

## 5. Session, saves and email — BUILT, DB-STUBBED

`src/hooks/useSession.tsx`, 234 lines. **This layer was undocumented until 2026-08-30.**

### Built ✅

- UUID via `crypto.randomUUID()` with fallback, persisted to `localStorage['circle_session_id']` *(⚠️ spec said `circle.session` — pick one)*
- `logEvent()` over a typed union: `session_start` · `filter_set` · `initiative_view` · `initiative_save` · `initiative_unsave` · `initiative_share` · `results_scroll_depth` · `email_captured` · `artwork_save` · `artwork_unsave`
- Saves and **artwork saves**, both localStorage-backed, with a `wasFirst` flag driving T2
- Idle detection — 90s, reset on scroll/touch/click/keydown, feeding `onIdle` subscribers (drives T3)
- `circleScope: 'mine' | 'everyone'` toggle
- `ShareMenu` (142 lines) — WhatsApp, email, copy link, native sheet, bilingual. **Already wired**: fires `onShare(channel)` on all four paths; `ActivityCard.tsx:246` passes `logEvent('initiative_share', { id, channel })`. Only `target` is missing from the payload
- All three email touchpoints as components

### Missing ❌

Three stubs are the whole gap:
```
useSession.tsx:59   // DUMMY: would INSERT into public.sessions
useSession.tsx:102  // DUMMY: would INSERT into public.session_events
useSession.tsx:123  // DUMMY: would INSERT into public.email_captures
```
Each `console.log`s instead. **Nothing has ever reached a database.**

Also absent: `close_circle` logging · **consent capture** (zero matches for `consent` across the source) · the **2-ask cap** · `lang` on capture · the `saves` table itself.

⚠️ Payload shapes match the dummy project, not the corrected schema. Uncommenting is not sufficient — all three call sites need editing. S-68, S-69, S-70, S-125.

### 5a. Identity model (D21)

| | Identity | Storage |
|---|---|---|
| Anonymous | client-generated UUID | `localStorage` — persists across visits, tab close, browser restart |
| Registered | Supabase Auth | email magic link |

**Not `sessionStorage`** — that would delete a post-visit companion app's reason to exist. **Never IP-based** — gallery wifi collapses many visitors into one identity, mobile IPs rotate mid-session, and it is personal data with no upside.

Magic link means no passwords, no reset flow, no credential storage. Possession of the inbox is the second factor.

**D13 open — the anon → registered merge.** On first login the anonymous UUID is claimed by the auth user and saves carry over. If saves vanish on registration, the visitor is punished for signing up. Unresolved: the second-device case; whether events carry over or only saves.

Registration is optional and never gates content.

### 5b. Saves behaviour

- Card save count = `COUNT(*)` per activity, replacing the mock's static number. Cache client-side; exact freshness doesn't matter
- Unsave = DELETE own row, policy-scoped to own `session_id`
- Saved list joins the visitor's own saves to `v_activities`

⚠️ **Check against the locked principles:** individual saves are private, but a visible public count is a social-proof signal, close to the no-comparison rule. Confirm with curators before shipping the count. Hiding it is a legitimate outcome.

⚠️ `circleScope: 'everyone'` exists as a UI toggle with **no data source behind it.**

### 5c. Email touchpoints

**T1 — early soft popup.** 3–5s after first load from QR entry. Once per session, never re-shown after dismissal. Framing: **"hold this for later"** — not a signup. The visitor is mid-exhibition and about to close the tab. One field, send, prominent easy dismiss. Dismissal frictionless and unpunished.

**T2 — inline at first save.** Inline near the saved card, not a modal. "Want your saved list sent to you?" Never shows if T1 already captured.

**T3 — session end.** Engaged sessions only (≥1 save OR ≥1 close-circle OR ≥90s active), on visibility-change, only if nothing captured yet. "Take the circle with you."

**Hard cap: 2 asks per session** across T1–T3. ⚠️ Not currently enforced.

Copy is bilingual and **requires curator review before launch** — same gate as tag labels.

**D8 open** — delivery. Two separable halves: *capture* (where in the flow, what's promised — needs curators) and *delivery* (app sends via Resend, or capture-only with export). Manual export is adequate at exhibition scale; the museum likely already runs a compliant list, so ask before building one.

---

## 6. Impact model — BUILT, UNDOCUMENTED, FABRICATED

`MyCircleView.tsx` (192) + `lib/returnTypes.ts` (126). Full detail in **S-126**.

Five return types, each naming something that comes into being — correctly aligned with the locked principle:

| Key | Hebrew | Unit | Colour |
|---|---|---|---|
| `items` | חפצים חוזרים לחיים | פריטים | terracotta |
| `ground` | אדמה שחוזרת | מ״ר | moss |
| `mat` | חומר שהופך למשהו | ק״ג | ochre |
| `skills` | ידיים שלומדות | אנשים | field |
| `know` | ידע שממשיך | אנשים | sky |

Concentric-ring visualisation, mine/everyone scope, sliders for bring-a-friend, visitor count and months. Reduced-motion respected.

⚠️ **Every constant is invented** — the five `MONTHLY_YIELD` rates, the `0.14 * 0.28 * 1.08` funnel, the `0.22` bring-a-friend factor, the `personMonths` decay curve. `RETURN_SHARE` describes *database composition*, not visitor behaviour. `TOTAL_CLASSIFIED` is hardcoded and already drifting. Units (מ״ר, ק״ג) violate the relatable-units principle. `RETURN_FUNNEL` is marked STUB in its own source. **D19.**

⚠️ `ImpactView.tsx` (200 lines) is **orphaned** — never imported, superseded by `MyCircleView`.

---

## 7. Design system

**Typography: `Heebo`** for both `sans` and `display` (tailwind.config.ts, index.css).
⚠️ Not the exhibition's FbHarduf-Black / Assistant. **D22.**

**Palette** (`index.css`, HSL): `--ink 30 6% 7%` · `--bone 43 46% 93%` · `--sage 147 43% 30%` · `--sage-light` · `--sage-dark` · `--stone 40 12% 55%` · `--ink-soft`

Closer to the exhibition identity than earlier specs implied — `--ink` ≈ Ink `#131211`, `--bone` ≈ Cream `#F0EAD8`, `--sage` ≈ Moss `#2C6E4A`. Absent from the base: **Terracotta, Sand, Ochre, Sky**.

⚠️ `returnTypes.ts` already uses `terracotta` / `moss` / `ochre` / `field` / `sky` classes — the exhibition palette is wired in one file and undefined in the base. **D22 is a reconciliation, not a redesign.**

Gradient set (sage/mint/peach/pink/purple/cyan/sunset) per activity card. Uppercase micro-labels, `tracking-[0.25em]`. Mobile-first, `max-w-lg`, safe-area insets.

**Line art:** `LineArt.tsx` exports SpiralLine / EllipseLine — decorative only. The spiral-as-filter-path UX from the design sessions is **not implemented**; filters are stacked accordions. S-66.

### Card tag tiers (locked 2026-07-15)

| Tier | Tags | Column |
|---|---|---|
| Mandatory — always visible | effort level | `energy_level` (pending S-117) |
| | format | `format` |
| | location | `location` |
| Visible card | impact | `impact_tags` |
| | activity type | `activity_type` |
| Expanded card | exhibition theme | `exhibition_themes` |
| | audience | `target_audience` |
| | cost | `cost` (D7) |

`impact` and `activity type` render as **titled groups**; everything else as untitled tags distinguished by a chip-style differentiator.

**⚠️ Design gate (S-66):** visual treatment — hierarchy, chip variants, RTL — requires the design session with Netta before implementation. This locks *which tags in which tier*, not how they look.

Not displayed in V1 (data exists, reserved): `skill_level` · `time_commitment` · `materials` · `process` · `community_archetype` · the five principle scores · `draws` (drives filtering, not shown).

---

## 8. i18n

`strings.ts` — bilingual UI string keys, EN fallback. Dataset translation is a full duplicated HE module.

**Dies at V1.3** — replaced by `_he` columns and a language-aware select; `useDataset` collapses into a query-layer switch. RTL global via `document.dir`; logical Tailwind classes, per-component RTL spot-check still needed.

**`vocabDisplay.ts`** — one client-side module mapping every snake_case vocabulary value → `{en, he}`. Tags stay English snake_case in the DB; Hebrew is display layer only. Also the human-review surface for tag translations. **Not yet written** — prerequisite for S-65.

### Hebrew content run plan

Detailed contract in `contracts.md` §11. Sequence:

1. Schema — add the four `_he` columns + `translation_status` to both tables
2. Split the population — Hebrew-native rows copy `name → name_he` as-is; never round-trip Hebrew through English. **Recount before running** (`state.sql` Q2)
3. Batch translation, ~15 rows per batch, `translation_status = 'machine'`, idempotent on `pending`
4. Deterministic validation gate before any status flip
5. Curator review with Lior and Talia → flip to `'reviewed'`
6. Wire-up: `_he` columns into `v_activities`, `COALESCE` fallback, delete `activities.he.ts`

⚠️ **Step 5 is the longest pole in the project.** It is other people's hours and cannot be compressed by working faster. Start before the technical work finishes, not after.

Register: spoken, warm, museum-visitor Hebrew — native-feeling, not translated. Organization names stay recognizable. `visitor_action_he` keeps the one-verb imperative (הצטרפו, הביאו, אמצו).

---

## 9. Component inventory

| Component | LOC | Role |
|---|---|---|
| MainContent | 551 | filters + results + vibe call |
| ActivityCard | 251 | expandable card, close-circle CTA |
| **useSession** (hook) | 234 | **identity, saves, events, email — §5** |
| ArtworkDetailModal / Panel | 229 / 213 | artwork detail |
| ArtworksView | 206 | artwork browse |
| ImpactView | 200 | ⚠️ **ORPHANED** — never imported |
| AppNav | 200 | five-mode nav |
| **MyCircleView** | 192 | **impact rings — §6** |
| **MyListView** | 187 | **saved list, tabbed** |
| CashbackView | 165 | financial services |
| **ShareMenu** | 142 | **share channels + callback** |
| LocationFilter | 138 | display-only per D3 |
| **returnTypes** (lib) | 126 | **impact model — §6** |
| Index (page) | 121 | mode routing, close-circle handler |
| **RescueEmailPrompt** | 116 | **T1** |
| RippleModal | 104 | exit flow |
| **SessionEndPrompt** | 101 | **T3** |
| useCircleStore (hook) | 95 | filters, mode, ripple |
| WelcomeModal | 94 | intro |
| **SaveEmailInline** | 78 | **T2** |
| ArtworkCarousel | 74 | gallery |
| **EmailField** | 53 | shared input |
| LineArt | 45 | decorative SVG |
| CircleIcon | 34 | icon primitive |
| EnergyCard | 32 | primitive |
| FilterChip | 30 | primitive |
| **PersistentEmailLink** | 21 | not in any earlier spec |

Bold entries were absent from all documentation prior to 2026-08-30.

---

## 10. Gap map

| UI concept | EXAI reality | Work |
|---|---|---|
| `energyLevel` | `energy_level` **not in the view** | S-117, S-127 |
| `locationFormat` | `format` | rename layer |
| `region` | **not in the view** | S-117 |
| `draws` | `draws text[]` ✅ | 1:1 |
| `connectedArtworks` | two-tier matching | D15 / S-122 |
| `tags.*` | four array columns + principles | `vocabDisplay.ts` — not written |
| `saves` count | no table | S-69 |
| `showCommunityMessage` | `activity_kind = 'fb_community'` | ⚠️ column **and** value differed from spec |
| single activities list | `v_activities` | S-65 |
| CashbackView hardcoded | `financial_benefits` ✅ live | S-67 |
| impact numbers | fabricated | D19 / S-126 |
| artwork images | external hotlinks | D16 / S-121 |
| Hebrew dataset | `_he` columns | S-71 → S-73 |

---

## 11. Ship gate

- [ ] Reads live data from `v_activities` on EXAI; all filters work; zero filters shows everything
- [ ] Filters remain fully optional at every entry path
- [ ] Session UUID persisted in `localStorage`; survives reload and tab close; new on cleared storage
- [ ] Magic-link login works; anon saves survive registration (D13)
- [ ] Save/unsave round-trips; count reflects real data or is deliberately removed; saved list renders
- [ ] T1 once, dismissible, never re-shown; T2/T3 respect the 2-ask cap
- [ ] Email rows land with touchpoint **and consent flag**; **not readable via anon key**
- [ ] `close_circle` recorded **with `activity_id`**
- [ ] `share` recorded with channel + target on every tap
- [ ] HE mode from `_he` columns with EN fallback; RTL intact on all new UI
- [ ] Tag tiers per §7 — pending the design session
- [ ] Cashback reads `financial_benefits`
- [ ] Artwork images from Supabase Storage, no external hotlinks
- [ ] No displayed number without a source, a stated range, or explicit framing as illustrative

---

## 12. Open flags

1. **S-120** — repoint to EXAI, `.env` out of git, rotate key
2. **D14 / S-118** — `climate-vibes` fate; silent failure on repoint
3. **S-68** — `close_circle` never logged
4. **S-70** — no consent capture anywhere; no 2-ask cap
5. **D19 / S-126** — impact numbers fabricated
6. **D22** — typography and four palette tokens
7. **S-66** — spiral filter path unimplemented; chip design gate
8. **D18** — result ordering undecided
9. **D13** — anon → registered save merge
10. `ImpactView.tsx` orphaned — delete or record why kept
11. `circleScope: 'everyone'` has no data source
12. localStorage key mismatch — `circle_session_id` vs `circle.session`
