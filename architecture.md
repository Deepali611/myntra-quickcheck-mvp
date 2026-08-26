# architecture.md — WHAT

Standalone project. Not related to, and does not reuse, any other
repository. Read `context.md` first — it governs intent and principles;
this file is the technical implementation of those principles.

## 1. Tech stack (locked)
- Next.js 15 (App Router), React 19
- Plain CSS, component-scoped files (CSS Modules)
- Deployment: Vercel, API routes as Next.js Route Handlers under `app/api/`
- Node engine pinned in `package.json` (`"engines": { "node": "20.x" }`) and
  `package-lock.json` committed to the repo — build reproducibility on
  Vercel depends on this, not just on local dev working.
- Routing is file-based (App Router folder structure) — there is no
  central route-table file; each route in §2 corresponds to a folder under
  `app/`.
- `next dev` runs API routes natively — no separate CLI step is needed to
  test them locally, unlike a plain Vite setup.

**Target device (locked):** this is a mobile-first build. Every reference
screenshot is the Myntra mobile app. Build for a mobile viewport
(~375-430px wide) as the primary target — layout, spacing, and touch target
sizes all follow mobile conventions. It's fine if the deployed page doesn't
have bespoke desktop layouts; it should at minimum stay centered and usable
at desktop width, not require a mobile emulator to evaluate. Do not design
this as a desktop-first responsive site that happens to work on mobile.

## 2. Routes and screen chrome

| Route (URL) | App Router path | Screen | Chrome |
|---|---|---|---|
| `/` | `app/page.jsx` | Home — hero, category rail, product grids | shared header + tab bar |
| `/c/[department]/[category]?` | `app/c/[department]/[[...category]]/page.jsx` | Category listing, filters | shared header + tab bar |
| `/search` | `app/search/page.jsx` | Search results | shared header + tab bar |
| `/p/[id]` | `app/p/[id]/page.jsx` | Product detail page | full-bleed, own layout, no shared chrome |
| `/wishlist` | `app/wishlist/page.jsx` | Saved items, Quick Check entry | own header |
| `/bag` | `app/bag/page.jsx` | Bag | own header |
| `/checkout` | `app/checkout/page.jsx` | Static order confirmation | own header |
| `/account` | `app/account/page.jsx` | Placeholder | shared header + tab bar |
| any unmatched route | `app/not-found.jsx` | Falls back to Home-style empty state | — |

Chrome ownership is implemented with nested layouts: a root `app/layout.jsx`
plus a `(shop)` route group with its own `layout.jsx` providing the shared
header/tab bar for Home/Category/Search/Account. `/p/[id]`, `/wishlist`,
`/bag`, and `/checkout` sit outside that group with their own layout/no
layout, per the chrome column above.

Core journey (full fidelity, this is what's evaluated): Home → browse →
product → Wishlist → Quick Check → decision → PDP/alternative → Add to Bag →
Bag. Secondary screens (Search, Checkout, Account) need only enough fidelity
to make that journey feel real — do not over-invest here. The Home page's
department tile row (Fashion, Beauty, Homeliving, Footwear, Accessories,
matching the real Myntra layout) must all be genuinely clickable into real
category listings — see §3a for what's behind each.

## 3. Catalogue — data provenance and automated ingestion

**What's real:** genuine brand names that actually sell in each department
(examples per department in §3a) — text only, not copyrighted content.
Realistic pricing/discount patterns per category.

**What's licensed:** all product photography, sourced from a free-to-use
stock photo API (Pexels or Unsplash — both offer commercial-use-permitted
licenses with a public API), fetched once during data-build time and
**cached as local static files** — never hotlinked to the stock provider's
CDN at runtime, and never sourced from Myntra or any live retailer.

**What's synthesized:** product name combinations (brand × subcategory ×
colour/style, generated procedurally), all Quick Check fit/looks/worth
evidence data (per architecture.md §5), all why-line copy.

**What must never appear anywhere in this project:** Myntra product photos
(even one), Myntra product copy/descriptions reproduced verbatim, Myntra
customer reviews presented as real, any live scraping of or hotlinking to
Myntra's site or CDN at runtime.

### 3a. Departments and scope tiering

Catalogue covers all departments visible in the real Myntra app, per
context.md's scope tiering:

| Department | Quick Check tier | Example real brand names |
|---|---|---|
| Women (Ethnic, Western) | Tier 1 — full depth | Libas, Koskii, Varanga, W, Biba, AND, Global Desi, Zara, H&M |
| Men (Shirts, T-Shirts, Jeans) | Tier 1 — full depth | Levi's, U.S. Polo Assn., Roadster, H&M, Zara |
| Kids (Kids Wear) | Tier 1 — full depth | H&M Kids, Mothercare, Allen Solly Junior |
| Footwear | Tier 1 — full depth | Puma, Bata, Metro, Crocs, Woodland |
| Beauty | Tier 2 — framework extension | FoxTale, The Derma Co., Lakmé, Maybelline |
| Accessories (bags, jewellery, watches) | Tier 2 — framework extension | Fossil, Titan, Guess, GIVA |
| Home & Living | Tier 2 — framework extension | Story@Home, Klotthe, Portico |

Every department needs real, browsable product listings — clicking into
Beauty or Home & Living must show actual products, never an empty page.
Aim for ~250-350 total products across all departments (roughly 60-80 in
each Tier 1 clothing/footwear department, 25-40 in each Tier 2 department —
enough for realistic browsing, not exhaustive).

### 3b. Automated ingestion pipeline (no manual data entry)

```
DATA SOURCE (Pexels/Unsplash API)
  → scripts/fetch-images.js   (image-first ingestion, see below)
  → scripts/generate-catalog.js (procedural product generation, matched to ingested images)
  → data/products.json + public/products/*.jpg   (local, static, committed to the repo)
  → MVP reads only these local files — zero runtime calls to any external API
```

**`scripts/fetch-images.js`** — runs once, locally, during Phase 1 (never at
runtime, never on the deployed app):
1. For each department/subcategory/colour combination the catalogue needs
   (e.g. "peach floral kurta", "black running sneakers", "matte red
   lipstick", "white ceramic table lamp"), query the Pexels Search API
   (primary — generous free tier for a one-time bulk pull; Unsplash API as
   fallback) with matching keywords.
2. Download the best-matching result to `public/products/{id}.jpg`.
3. Record `{ id, sourceProvider, photographerCredit, sourceUrl, license }`
   in `data/image-sources.json` — an internal provenance manifest (not
   shown to shoppers, but keeps the project's sourcing auditable and
   supports the deck's data-honesty disclosure).
4. If no good match is found for a very specific query, fall back to a
   broader query (e.g. drop the colour, search just the garment/product
   type) rather than failing the ingestion run — log which products used a
   fallback match so they can be spot-checked, without turning this into
   manual entry for the whole catalogue.
5. Requires a Pexels/Unsplash API key **only for this local script run** —
   this key is never needed by the deployed app and never goes into
   Vercel's environment variables.

**`scripts/generate-catalog.js`** — runs after image ingestion, **image
data drives text generation, not the reverse** (this is what guarantees the
image/text alignment rule holds by construction rather than by luck):
combines a curated real-brand-name list (§3a) with the subcategory and
colour actually confirmed present in each ingested image, plus a
department-appropriate pricing formula, to produce the final product
entries. Output is the single `data/products.json` file the app reads.

Both scripts are committed to the repo (under `scripts/`) so the pipeline
is reproducible, but they do not run as part of the deployed app or its
build — they're a one-time (or re-runnable, if the catalogue needs to grow)
local data-generation step.

**Data-image alignment (locked, non-negotiable):** every product's image
must visually match its own text fields — garment/product type, colour, and
general style. This is enforced by the image-first pipeline ordering above,
and validated again at catalogue load time as a safety net (§edge_cases.md).

```json
{
  "id": "string",
  "department": "Women | Men | Kids | Footwear | Beauty | Accessories | HomeLiving",
  "quickCheckTier": "full | extended",
  "brand": "string",
  "name": "string",
  "category": "string — department-specific (e.g. Ethnic/Western for Women, Skincare/Makeup for Beauty)",
  "subcategory": "string",
  "garmentType": "kurta_set | dress | top | pants | saree | heels | sneakers | flats | shirt | tshirt | jeans | kidswear | null (non-apparel departments)",
  "price": "number",
  "salePrice": "number",
  "discount": "number — must reconcile with price/salePrice exactly",
  "colorVariants": [{ "name": "string", "image": "string" }],
  "sizes": ["array — apparel/shoe sizes, or omitted per sizing rules"],
  "rating": "number, 3.8-4.7",
  "reviewCount": "number",
  "image": "local static path under /public/products/",
  "fabricOrMaterial": "string"
}
```

`lib/catalog.js` — `getProduct(id)`, `getCategory()`, `searchProducts()`,
`relatedProducts()`. Validate discount math at load time.

## 4. Sizing rules

- No size picker: Jewellery, Watches, Bags, Beauty, Home & Living.
- Footwear: `['6','7','8','9','10','11']`. Apparel (Women/Men/Kids):
  `['XS','S','M','L','XL','XXL']` for adults; kids sizing uses an age/size
  chart (e.g. `['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y']`).
- Preferred-size inference for Add to Bag from Quick Check: infer from the
  shopper's most-used size already in the Bag; default to `M` / `8` if
  nothing to infer from. Never block the action for a missing size.

## 5. Quick Check data schema (per product, category-aware)

This is synthesized, deterministic data — same product, same values, every
load. Computed from a hash of the product id, not random per session.

**The schema shape is identical across every department** — this is the
"same three-check framework, category-aware meaning" principle from
context.md. What changes per department is (a) the controlled vocabulary of
valid `flaggedZone`/`flaggedAttribute` values, and (b) the Layer 4 evidence
type. Both are resolved via `lib/categoryAdapters.js` (§5a), keyed by
`department` — there is no separate feature system per category, only a
config lookup.

```json
{
  "productId": "p1",
  "fit": {
    "applicable": true,           // false for departments/products with no meaningful fit dimension
    "flaggedZone": "chest",       // vocabulary depends on department, see §5a
    "direction": "small",         // "small" | "true" | "large" | null
    "confidence": "high"          // "low" triggers the honest fallback state, never shown to shopper
  },
  "looks": {
    "flaggedAttribute": "fabric", // vocabulary depends on department, see §5a
    "confidence": "high",
    "featuredPhotos": [
      { "url": "string", "label": "as_worn" }
    ]                              // curated, 2-4 entries max, only for products with real signal — see §7
  },
  "worth": {
    "hasAlternative": true,
    "alternativeId": "p7",
    "reasonType": "price",        // "price" | "rating" | "fit" | "looks" — exactly one, the strongest, always category-agnostic
    "reasonValue": "₹150 cheaper, similar rating"
  }
}
```

### 5a. Category adapters (locked per department)

| Department | `fit` meaning | `fit` vocabulary | `looks` meaning | `looks` vocabulary | Layer 4 (fit) | Layer 4 (looks) |
|---|---|---|---|---|---|---|
| Women/Men/Kids clothing (Tier 1) | Size/fit zone | chest, waist, shoulder, sleeve, hip, length, bust (per garmentType, §5b) | Photo/fabric accuracy | colour, fabric, print, fit_in_photo | Size guide/chart | Full-screen curated photo viewer |
| Footwear (Tier 1) | Size/comfort | whole-shoe only: small/true/large, no zone | Material/construction vs. photos | colour, material, sole_feel | Size guide (shoe-specific) | Full-screen curated photo viewer |
| Beauty (Tier 2) | Suitability for skin tone/type | shade_match, skin_type_fit | Texture/finish/wear-through-day | texture, finish, longevity | Shade/skin-type finder | Swatch viewer |
| Accessories — bags (Tier 2) | Capacity/use-fit | capacity | Material/finish quality | material, finish, hardware | Capacity guide (dimensions) | Material close-up viewer |
| Accessories — jewellery/watches (Tier 2) | Style/use-fit | `applicable: false` (no meaningful fit dimension) | Material/finish quality | material, finish, plating | n/a | Material close-up viewer |
| Home & Living (Tier 2) | Size/space fit | space_fit | Material/finish/durability | material, finish, texture | Space/dimension calculator | Material close-up viewer |

`lib/categoryAdapters.js` exports `getAdapter(department)` returning the
valid vocabulary and Layer 4 type for that department — `quickCheckData.js`
and the UI components both read from this single source, so adding or
adjusting a department's behavior never means touching feature logic in
multiple places.

**Tier 2 honesty rule (locked):** every Tier 2 department's Quick Check
copy must still pass the same voice/banned-word rules as Tier 1 — but the
underlying `confidence` distribution for Tier 2 products should skew
towards `"low"` more often than Tier 1, since there's deliberately less
underlying signal to synthesize from for a framework extension rather than
a researched segment. Don't manufacture false confidence to make Tier 2
"look" as evidence-rich as Tier 1 — an honest, frequent "not enough to say
yet" in Beauty/Home/Accessories is more defensible than fabricated
certainty.

If `fit.applicable` or a department has no meaningful fit dimension (e.g.
jewellery), `fit.confidence` is always `"low"` and the UI should reflect
"not applicable" rather than forcing a verdict.

### 5b. Garment-type fit zones (Tier 1 departments only)
- `top` / kurta-set top piece / shirt / tshirt: chest, shoulder, sleeve
- `pants` / kurta-set bottom piece / jeans: waist, length, hip
- `dress`: bust, waist, length
- `saree` / `heels` / `sneakers` / `flats`: no zone (whole-garment
  true/small/large only)
- `kidswear`: chest, length (age-size-chart based, not adult zones)

`lib/quickCheckData.js` — `getQuickCheckData(productId)`, deterministic
hash-based generation of the above shape across the whole catalogue at build
time (not computed live per request), reading each product's `department`
to resolve the correct adapter from §5a.

## 6. Worth It — the concrete threshold rule (locked, not left to inference)

Candidate pool: same `department` AND same `subcategory`, price within
±25% of the wishlisted item, excluding itself. Never compare across
departments (a kurta is never compared to a lipstick).

Check reasons in this order; the first one that clears its threshold is used
as `reasonType`. If none clears, `hasAlternative = false`.

1. **Price**: candidate's `salePrice` is at least ₹150 AND at least 10%
   lower than the wishlisted item's, AND candidate's `rating` is not more
   than 0.2 lower. → `reasonType: "price"`, `reasonValue`: e.g. "₹180
   cheaper, similar rating."
2. **Rating**: candidate's `rating` is at least 0.3 higher, AND candidate's
   `salePrice` is not more than 15% higher. → `reasonType: "rating"`,
   `reasonValue`: e.g. "Rated 4.6 vs 4.2, similar price."
3. **Fit**: wishlisted item's `fit.confidence = "high"` and
   `fit.direction != "true"` (i.e. it runs small/large), AND a candidate
   exists with `fit.direction == "true"` at a comparable price (±15%).
   → `reasonType: "fit"`, `reasonValue`: e.g. "Fits true to size, this one
   runs small."
4. **Looks**: wishlisted item's `looks.flaggedAttribute != null` (a real
   difference from photos exists), AND a candidate exists with
   `looks.flaggedAttribute == null` at a comparable price (±15%).
   → `reasonType: "looks"`, `reasonValue`: e.g. "Matches its photos closely,
   this one doesn't quite."

Only ONE candidate is ever surfaced — the first reason type that clears its
threshold, using the single best-qualifying candidate for that reason. Never
combine reasons, never show more than one alternative.

`lib/worthItComparison.js` — pure function implementing this exactly,
no AI call inside it. Document the thresholds in code comments — they're a
deck talking point (this is your defensible, explainable "genuinely
meaningful" rule).

## 7. Looks Check photo curation (locked)

`featuredPhotos` per product is a **small, hand-picked array (2-4 entries),
authored at data-build time**, not "every as-worn photo available." Only
populate this for a deliberately limited subset of the catalogue (recommend
8-12 products) where there's a genuine story to show — either a close match
worth confirming, or a real flagged difference worth surfacing. Every other
product in the catalogue has `looks.confidence: "low"` and an empty
`featuredPhotos` array, which is the honest "not enough to say yet" state —
this is by design, not a shortcut, and it's a smaller content burden than
trying to populate photos for the whole catalogue.

## 8. AI implementation — live Groq phrasing on a deterministic verdict

Three Next.js Route Handlers, each with its own Groq key so one rate limit
never starves another:

| Route (URL) | File | Env var | Input | Output |
|---|---|---|---|---|
| `/api/fit-check-why` | `app/api/fit-check-why/route.js` | `GROQ_API_KEY_FIT` | `fit` object for the product | one natural-language why-line |
| `/api/looks-check-why` | `app/api/looks-check-why/route.js` | `GROQ_API_KEY_LOOKS` | `looks` object for the product | one natural-language why-line |
| `/api/worth-it-why` | `app/api/worth-it-why/route.js` | `GROQ_API_KEY_WORTH` | `worth` object + alternative product summary | one natural-language why-line |

Each route file exports `export async function POST(request)` (Next.js
Route Handler signature) and returns a `Response` object with the JSON
schema below. These run natively under `next dev` — no separate CLI or
local proxy is needed to test them, unlike a plain Vite + standalone
serverless-functions setup.

Model: `openai/gpt-oss-120b` (env-overridable via `GROQ_MODEL`). Do not use
any `llama-3.x-*-versatile` id — deprecated, shut down August 2026.

Shared client `lib/groqClient.js` (not under `app/api/`, since it's a helper,
not a route): reads the task key, returns `null` immediately if absent (no
network call), wraps the fetch in a 12-second `AbortController` timeout,
returns `null` on any failure (timeout, non-200, malformed JSON) — never
surfaces an error to the shopper.

**System prompt requirement for all three routes:** the model receives ONLY
the deterministic verdict fields, translated through that product's §5a
category adapter — never raw internal field names like "confidence" or
"flaggedZone". Two examples, showing the same instruction pattern applied
to different departments:
- Clothing: "This product runs small at the chest. Write one short, natural
  sentence a shopper would trust, explaining why, without using the words
  fit-zone, signal, data, or confidence."
- Beauty: "This product's shade runs deeper than shown in photos. Write one
  short, natural sentence a shopper would trust, explaining why, without
  using the words shade-match, signal, data, or confidence."

The model must not invent facts beyond what it's given — it is translating
a known verdict into natural language, never deciding what the verdict is,
and never guessing at department-specific vocabulary beyond what §5a
already resolved for that product.

**Banned words in any output**: score, confidence, signal, evidence,
synthesized, algorithm, data, "reviews say"/"reviews mention" (say "buyers"
instead), any raw percentage.

**Deterministic fallback** (used whenever the Groq call returns `null`) —
hand-written templates, used verbatim, exactly matching the tables in §9.
The verdict itself (headline, visual, which check states are shown) NEVER
depends on the AI call succeeding — only the why-line's exact phrasing does,
and the fallback phrasing is written to the same quality bar.

**Call behavior:** fetched once per product per check type when the shopper
actually opens that check (not pre-fetched for the whole wishlist), cached
in session state so re-opening the same check doesn't re-call the API,
cancelled if the shopper navigates away before it resolves.

## 9. Verdict tables and fallback copy (hand-written, used verbatim as fallback; also given to Groq as the style/fact target)

These tables cover Tier 1 (clothing/footwear) fully. Tier 2 departments use
the same headline/why *pattern*, with the department's own §5a vocabulary
substituted in — two worked examples are given below so the pattern is
unambiguous, not left to inference for the remaining departments.

**Fit Check — Tier 1 (Women/Men/Kids clothing, Footwear)** — keyed on
`fit.flaggedZone` / `fit.direction` / `fit.confidence`:

| Condition | Headline | Visual | Fallback why |
|---|---|---|---|
| confidence=low | "Hard to tell from what we have" | garment icon, no zone marked, slider greyed out | "Not enough data yet for this size." |
| direction=true | "True to size" | garment icon, no zone marked, slider centered | "Most buyers wore their regular size." |
| direction=small | "Runs small at the {zone}" | garment icon, {zone} marked, slider toward snug | "Most buyers said the {zone} felt snug and sized up for it." |
| direction=large | "Runs large at the {zone}" | garment icon, {zone} marked, slider toward roomy | "Most buyers said the {zone} felt loose and sized down for it." |

Layer 4 (tap visual): opens the real size guide/chart for that garment type.

**Fit Check — Tier 2 worked example (Beauty)** — keyed on the same
schema, `fit.flaggedZone` values drawn from §5a's Beauty vocabulary
(`shade_match`, `skin_type_fit`):

| Condition | Headline | Visual | Fallback why |
|---|---|---|---|
| confidence=low | "Hard to tell from what we have" | shade swatch icon, greyed out | "Not enough data yet for this shade." |
| flaggedZone=shade_match, direction=true | "True to shade shown" | shade swatch matching product photo | "Most buyers found the shade matched what's shown." |
| flaggedZone=shade_match, direction=small/large (reads as "lighter"/"deeper") | "Runs {lighter/deeper} than shown" | shade swatch shifted | "Most buyers found it {lighter/deeper} than the photo in person." |
| flaggedZone=skin_type_fit | "Best for {skin type}" | skin-type icon | "Most buyers with {skin type} skin found this worked well for them." |

Layer 4 (tap visual): opens the shade/skin-type finder for that product
(§5a). **Every other Tier 2 department (Accessories, Home & Living) follows
this identical pattern** — same headline structure, same why-line
structure, substituting that department's own §5a vocabulary
(capacity/space_fit) in place of shade_match. Do not invent a different
copy structure per department — the pattern is fixed, only the vocabulary
changes.

**Looks Check — Tier 1 (clothing/footwear)** — keyed on
`looks.flaggedAttribute` / `looks.confidence`:

| Condition | Headline | Visual | Fallback why |
|---|---|---|---|
| confidence=low | "Not enough to say yet" | single "as shown" photo only, no swipe | "Not enough buyer photos yet for this item." |
| flaggedAttribute=null | "Looks as expected" | swipeable as-shown/as-worn pair | "Colour, print and fabric all matched the photos." |
| flaggedAttribute set | "Mostly as expected" | same swipe | "{Attribute} was slightly different from the photos for some buyers." |

Layer 4 (tap visual): opens a full-screen viewer of the curated
`featuredPhotos` set (§7) — never more than what's curated, never a raw
review gallery.

**Looks Check — Tier 2 worked example (Home & Living)** — keyed on the
same schema, `looks.flaggedAttribute` values drawn from §5a's Home
vocabulary (`material`, `finish`, `texture`):

| Condition | Headline | Visual | Fallback why |
|---|---|---|---|
| confidence=low | "Not enough to say yet" | single product photo only | "Not enough buyer photos yet for this item." |
| flaggedAttribute=null | "Looks as expected" | close-up material/finish photo pair | "Material and finish matched the photos for most buyers." |
| flaggedAttribute set (e.g. "material") | "Mostly as expected" | same close-up pair | "The {attribute} felt slightly different from the photos for some buyers." |

Layer 4 (tap visual): opens a material/finish close-up viewer for that
product (§5a). Beauty and Accessories follow this same pattern with their
own §5a vocabulary (texture/finish/longevity for Beauty; material/finish/
hardware or plating for Accessories).

**Worth It** — keyed on §6 result, identical for every department since
`reasonType` (price/rating/fit/looks) is category-agnostic by design:

| Condition | Headline | Visual | Fallback why |
|---|---|---|---|
| hasAlternative=false | "This looks like a good pick" | single product card | "Similar options don't offer a clear advantage." |
| hasAlternative=true | "You may want to compare" | two cards side by side, badge on the differentiator | uses `reasonValue` directly, phrased naturally per reasonType |

Layer 4 (tap visual / tap "Compare"): opens the alternative's real PDP.
**Add to Bag on this screen always adds the original wishlisted item** — the
alternative is only added if the shopper reaches its own PDP and chooses to.

## 10. Copy rules (apply everywhere in Quick Check)
- Never name "reviews" as a source — say "buyers" or "most buyers."
- Never invent headcounts or fabricate quotes.
- Headline, visual, and why-line describe the exact same fact at three
  levels of detail — the why-line never introduces a new fact.
- Every check has a genuine "not enough data" state — never force a
  positive verdict when `confidence = "low"`.

## 11. Wishlist screen
Matches reference screenshots: item count header, location bar,
Collections/Out of Stock tabs, category circles, product cards with
delete/move/share icons. Add: a "Quick Check" entry point per eligible card
(icon or label consistent with Myntra's existing iconography — not a new
visual language).

Eligibility rule: `wishlist_age >= 3 days AND viewCount >= 2 AND not purchased`.
`data/seedWishlist.js` deterministically seeds 8-10 backdated, eligible
items and 2-3 freshly-added, deliberately ineligible items (showing a
locked state, not hiding the feature) — this proves the gating logic is
real, not hidden.

## 12. Quick Check UI (bottom sheet)
`components/QuickCheckSheet.jsx` — portal-rendered, dim backdrop, swipe
or tap to dismiss.
- Opens to: "Quick Check" / "What do you want to check?" — Fit Check /
  Looks Check / Worth It, each with its one-line shopper question.
- Pick one → a detail card (`FitCheckCard.jsx`, `LooksCheckCard.jsx`,
  `WorthItCard.jsx`) driven entirely by that product's data object — one
  generic component per check type, never hardcoded per product.
- Each card: Verdict headline → Visual (tappable, opens Layer 4) → "Why?"
  tap reveals the why-line → primary action (Add to Bag, or Compare for
  Worth It).
- Confirmation toast on action, returns to Wishlist.

## 13. State management
`state/store.jsx` — reducer + context, sessionStorage-backed. Holds
wishlist entries (`addedAt`, `viewCount`, `purchased`), bag, cached
why-lines per product/check (once fetched, reused for the session), toast
state. Falls back to `buildSeedWishlist()` on empty/corrupted/blocked
storage — never crashes, never shows an error.

## 14. Deployment
No `vercel.json` needed — Vercel auto-detects Next.js and handles routing
and API routes natively, unlike the Vite setup which needed an explicit SPA
rewrite rule.
Env vars (set in Vercel dashboard, and in local `.env` for `next dev`):
`GROQ_API_KEY_FIT`, `GROQ_API_KEY_LOOKS`, `GROQ_API_KEY_WORTH`,
`GROQ_MODEL` (defaults to `openai/gpt-oss-120b`).

## 15. Explicit cuts
Real payment/checkout, real address management, full search relevance
engine, push notifications, any coupon/price-drop mechanic beyond realistic
pricing display, an open-ended chatbot interface, showing more than one
Worth It alternative, showing more than the curated `featuredPhotos` set in
Looks Check. **Not a cut:** Men/Kids/Beauty/Accessories/Home & Living —
these are in scope per §3a's department tiering; this line previously said
otherwise from an earlier draft and is superseded by §3a.

## 16. Acceptance criteria
- App runs end-to-end with zero API keys set (fallback why-lines used).
- Wishlist shows both eligible and ineligible items by design.
- All three checks produce a verdict consistent with the deterministic data
  regardless of AI availability; only the why-line's exact wording changes.
- Worth It surfaces an alternative only when §6's thresholds are actually
  met, and always exactly one.
- Looks Check never shows more than its curated photo set.
- No banned/technical words appear in any shopper-facing string, in
  fallback or AI-generated copy.
- No coupon/discount UI beyond realistic catalogue pricing.
- Deployed link (not just local dev) passes all of the above.
- Every department (Women, Men, Kids, Footwear, Beauty, Accessories, Home &
  Living) has real, browsable product listings — none are empty.
- Tier 2 departments (Beauty, Accessories, Home & Living) show Quick Check
  with category-adapted meaning per §5a, and skew toward honest "not enough
  to say yet" more often than Tier 1 — never artificially inflated
  confidence to look equally evidence-backed as Tier 1.
- No product image is sourced from Myntra or hotlinked to any live
  retailer's CDN — every image is a local static file from the licensed
  ingestion pipeline (§3b).
