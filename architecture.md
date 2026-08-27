# architecture.md — WHAT

Standalone project. Not related to, and does not reuse, any other
repository. Read `context.md` first — it governs intent and principles;
this file is the technical implementation of those principles.

## 1. Tech stack (locked)
- Next.js 15 (App Router), React 19
- Typography: `'Roboto', -apple-system, 'San Francisco', system-ui,
  sans-serif` — this is Myntra's actual app typeface (confirmed by Myntra's
  own engineering team: they use Roboto on Android, San Francisco on iOS,
  not a custom webfont, specifically to keep the app fast). Load Roboto via
  Google Fonts. Do not substitute a different sans-serif (Inter, system-ui
  alone, etc.) — this is a specific, verifiable, non-negotiable choice, not
  an aesthetic preference.
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

**Target device (locked):** this is a mobile-first build, rendered as an
actual simulated phone, not a responsive webpage that happens to be narrow.
Build a `PhoneFrame` component wrapping the whole app:
- A device shell: dark bezel, rounded corners, a status bar showing a live
  clock and simple signal/WiFi/battery glyphs, sized to a real device
  viewport (e.g. 412×915 CSS px) and scaled via JS to fit the actual browser
  window on resize — the app's own layout is measured against the true
  device width, never against the shrunk browser window directly.
- All actual app content renders inside an internal scrollable region
  (flex: 1, overflow-y: auto) nested inside that shell — this is what makes
  the page scroll correctly; a page with no such internal scroll container
  is the direct cause of a broken/non-scrolling screen.
- This is not decorative — a plain `max-width: 480px` centered div is not
  sufficient and does not satisfy this requirement. If the deployed page
  doesn't visually resemble an actual phone (bezel, status bar, contained
  scroll), this checkpoint has not been met.

**Department/category tile images (locked — corrected from an earlier
version of this rule):** real Myntra category tiles (Kurta Sets, Jeans,
Watches, Lipstick, etc.) are actual product photography, not illustrated
icons — an earlier version of this spec wrongly called for icons here,
which produced a cartoon/tacky mismatch with real Myntra. The correct rule:
- Department/category tiles use real photos from the same licensed
  ingestion pipeline (§3b) — Pexels/Unsplash, downloaded locally, never
  hotlinked, never illustrated.
- This is a small, fixed set (~12-15 tiles total across the department rail
  and category grid) — every single one must be individually verified by a
  human (you, during Phase 6/7 review) to genuinely match its own label. A
  "Watches" tile must show an actual watch, a "Jeans" tile an actual pair
  of jeans — no exceptions, and because the set is small, there's no excuse
  for a mismatch to ship.
- Never source a department tile image from the same pool as full product
  catalogue photos without re-verifying it matches — the earlier "Bags
  showing a watch" bug was a pipeline mix-up, not a reason to abandon
  photography for that section.

**UI chrome icons (locked, separate from the above):** the bell, wishlist
heart, bag, profile, search-bar microphone, and search-bar camera icons in
the header ARE simple vector icons (this part was already correct) — but
they must match Myntra's actual icon style specifically: thin-line,
minimalist, single-weight stroke icons, not a generic icon library's
mismatched glyph shapes or a filled/bold style. Build these as custom
inline SVGs matching the exact shapes shown in the reference screenshots
(outlined heart, outlined bag with a strap, thin bell outline, simple
circular profile outline, thin mic outline, thin camera outline) — do not
substitute a stock icon library's version of "heart" or "bell" that happens
to be close enough.

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
   fallback) with matching keywords. Use specific, garment-accurate query
   phrasing, not generic single words — e.g. "indian kurti ethnic top", not
   just "kurti", since imprecise search terms are the main cause of a
   mismatched result.
2. **Verify before accepting, not just take the top result.** Fetch the top
   3-5 candidates for each query, not just one. Each Pexels/Unsplash result
   comes with its own alt-text/tags/description metadata — check that this
   metadata actually contains the expected subcategory keyword (or a close
   synonym) before accepting a candidate. Take the first candidate that
   passes this check, not blindly the first result returned. This is the
   real fix for the "category says X, image shows Y" failure mode — a
   better search query alone does not guarantee this, checking the
   result's own metadata against what was intended does.
3. Download the verified match to `public/products/{id}.jpg`.
4. Record `{ id, sourceProvider, photographerCredit, sourceUrl, license,
   matchedKeyword }` in `data/image-sources.json` — an internal provenance
   manifest (not shown to shoppers, but keeps the project's sourcing
   auditable, supports the deck's data-honesty disclosure, and gives you a
   concrete field to check during review — `matchedKeyword` should always
   contain the subcategory you expected).
5. If none of the top candidates pass the metadata check for a specific
   query, fall back to a broader query (e.g. drop the colour, search just
   the garment/product type) and re-run the same verification step against
   that broader query's candidates — never skip verification just because
   it's a fallback. Log which products used a fallback match. If even the
   broadest reasonable query can't produce a verified match, skip that
   specific product rather than accepting an unverified image — a smaller
   catalogue with correct images beats a complete catalogue with wrong ones.
6. Requires a Pexels/Unsplash API key **only for this local script run** —
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

## 5. Quick Check data schema (per product, category-aware, per-size where applicable)

This is synthesized, deterministic data — same product, same values, every
load. Computed from a hash of the product id, not random per session.

**Fit is indexed by size (Fashion/Footwear only) — a flat one-size verdict
is wrong.** The same product can be true to size in M and run short in XL.
For departments where Fit doesn't apply at all (most of Tier 2), `fit` is
simply absent from that product's applicable checks (§5a) — not present
with `applicable: false`, since the check shouldn't appear in the sheet at
all, not appear and be disabled.

```json
{
  "productId": "p1",
  "department": "Women",
  "availableChecks": ["fit", "looks", "worth"],
  "fit": {
    "S":  { "status": "true" },
    "M":  { "status": "true" },
    "L":  { "status": "true" },
    "XL": {
      "top":    { "direction": "loose", "zone": "chest" },
      "bottom": { "direction": "short", "zone": "length" }
    }
  },
  "looks": {
    "attribute": "fabric",
    "direction": "lighter",
    "confidence": "high",
    "featuredPhotos": [
      { "url": "string", "label": "as_worn" }
    ]
  },
  "worth": {
    "why": "Cheaper than 4 of 5 similar kurta sets we found.",
    "unitPriceApplies": false
  }
}
```

Footwear's `fit` uses a different vocabulary (no chest/waist — accuracy and
width instead):
```json
"fit": {
  "UK7": { "status": "true" },
  "UK8": { "status": "true" },
  "UK9": { "sizeAccuracy": "small", "width": "true" }
}
```

`availableChecks` is **derived from department/subcategory per §5a's
table, never hand-picked per product** — this keeps applicability
consistent across the whole catalogue instead of an ad-hoc per-product
decision.

### 5a. Which checks apply per department/subcategory (locked)

| Department / subcategory | Fit | Looks | Worth It |
|---|---|---|---|
| Women/Men/Kids — apparel | ✅ size + zone, per §5b | ✅ colour/fabric/print | ✅ |
| Footwear | ✅ size + width | ✅ colour/material | ✅ |
| Beauty — colour cosmetics (lipstick, foundation) | — | ✅ shade match only | ✅ (unit price, §6) |
| Beauty — skincare | — | — | ✅ (unit price, §6) |
| Home & Living | — | ✅ colour/print/material match | ✅ (unit price if applicable) |
| Accessories (bags, jewellery, watches) | — | ✅ colour/material match | ✅ |

**The Quick Check sheet only lists rows for checks that apply** — a
skincare product's sheet shows exactly one row (Worth It), never three
rows with two greyed out. This is more honest than the earlier "Tier
1/Tier 2 adapter" approach, which offered Fit/Looks everywhere with
adapted meaning even where no real signal exists — that risked implying a
check applies when it structurally can't (e.g. "fit" for a skincare
serum).

Layer 4 evidence type per check, resolved via `lib/categoryAdapters.js`:

| Check | Fashion/Footwear Layer 4 | Beauty Layer 4 | Home/Accessories Layer 4 |
|---|---|---|---|
| Fit | Size guide/chart | n/a (not offered) | n/a (not offered) |
| Looks | Full-screen curated photo viewer | Shade swatch viewer | Material/finish close-up viewer |

`lib/categoryAdapters.js` exports `getApplicableChecks(department,
subcategory)` (the §5a table above) and `getLayer4Type(check, department)`
— `quickCheckData.js` and the UI components both read from this single
source.

### 5b. Garment-type fit zones (Fashion/Footwear only)
- `top` / kurta-set top piece / shirt / tshirt: chest, shoulder, sleeve
- `pants` / kurta-set bottom piece / jeans: waist, length, hip
- `dress`: bust, waist, length
- `saree` / `heels` / `sneakers` / `flats`: no zone (whole-garment
  true/small/large only)
- `kidswear`: chest, length (age-size-chart based, not adult zones)
- Multi-piece garments (kurta sets) can have top and bottom flagged
  independently within the same size, per the schema above.

`lib/quickCheckData.js` — `getQuickCheckData(productId)`, deterministic
hash-based generation of the above shape across the whole catalogue at
build time, reading each product's `department`/`subcategory` to resolve
`availableChecks` from §5a and only generating data for checks that apply.

## 6. Worth It — confirmation only, never a competing product (locked)

**Worth It never shows an alternative product to switch to.** This was a
deliberate correction: showing a different product with its own Add to Bag
directly undermines this project's actual success metric (purchase of the
*wishlisted* item specifically) — a shopper convinced to buy a different
product instead is not a win for what's being measured. Worth It is always
a confirmation of the shopper's own pick, backed by one real comparative
fact.

| State | Headline | Why (a real fact, stated directly) |
|---|---|---|
| Comparable data exists | "Good value for this pick" | A specific comparative fact, e.g. "Cheaper than 4 of 5 similar kurta sets we found." |
| No comparable data | "Good price for this pick" | "Best price we found for this style." |

**Unit-price rule (locked):** for categories where pack size varies (most
Beauty, some Home & Living), the comparative fact must be stated as
price-per-unit (₹/g, ₹/ml), never raw price — comparing raw prices across
different pack sizes is factually misleading even when technically
accurate. `worth.unitPriceApplies: true` flags these products; the
comparative fact generator must use unit price for them.

No alternative product, no second "Add to Bag," no product card besides
the shopper's own pick, in any state, for any department.

`lib/worthItComparison.js` — pure function generating the comparative fact
above from the catalogue (e.g. computing "cheaper than N of M similar
products") — deterministic, no AI call inside it, and never returns a
different product's id for the shopper to navigate to.


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
| `/api/worth-it-why` | `app/api/worth-it-why/route.js` | `GROQ_API_KEY_WORTH` | `worth` object (comparative fact only, per §6 — never an alternative product) | one natural-language why-line |

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
synthesized, algorithm, data, "reviews say"/"reviews mention", "buyers
say"/"most buyers"/"shoppers found" (state the fact directly instead — see
§10, this is a correction from an earlier version of this rule which
recommended attributing claims to "buyers"), any raw percentage, any
invented headcount, any fake urgency/scarcity language ("X people viewing
this," countdown timers, invented stock claims).

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

**Direct statement, no third-party attribution (corrected from an earlier
version):** state facts directly and confidently — "Runs loose on top,"
not "Most buyers said this runs loose on top." The shopper should feel
resolved about their own decision, not told what a crowd thinks. This
applies to every table below and to every Groq-generated why-line.

**Fit Check (Fashion/Footwear only, per selected size)** — keyed on that
size's entry in the `fit` object (§5):

| Condition | Headline | Sub-line (why) |
|---|---|---|
| No data for this size | "Not enough to say for {size} yet" | "Check the size chart before you buy." |
| status: true | "True to size in {size}" | "Fits just right — no adjustments needed." |
| top+bottom both flagged | "Runs loose on top, short on the bottoms" | "Consider sizing down on top and a longer inseam if available." |
| one piece flagged, direction=loose/large | "Runs loose at the {zone}" | "Consider sizing down for a closer fit at the {zone}." |
| one piece flagged, direction=short/small | "Runs snug at the {zone}" | "Consider sizing up for more room at the {zone}." |
| Footwear, sizeAccuracy=small | "Runs a little small — go half a size up" | (visual only, no extra sub-line needed) |
| Footwear, sizeAccuracy=large | "Runs a little large — go half a size down" | (visual only, no extra sub-line needed) |

**UI requirement:** size chips across the top of the Fit card (every size
the product offers), defaulting to the shopper's own known size if
available, otherwise the most common size. The verdict below updates live
per selected chip — never a static one-size verdict.

**Add to Bag from Fit carries the selected size**: button reads "Add to
Bag — Size {size}" using whichever chip is currently selected — no second
size-selection step on a separate screen.

Layer 4 (tap visual): opens the real size guide/chart for that garment type.

**Looks Check** — headline generated from two real fields, `attribute` and
`direction`, never a fixed sentence — applies across all departments that
offer Looks (§5a), using that department's own vocabulary for `attribute`:

| attribute | direction | Generated headline |
|---|---|---|
| (any) | (confidence=low) | "Not enough to say yet" |
| fabric / material | lighter | "{Attribute} reads a shade lighter than photos" |
| colour | warmer | "Colour looks slightly warmer than shown" |
| print | smaller | "Print runs a bit smaller than the listing photo" |
| (none flagged) | match | "Matches the photos closely" |

Sub-line for a flagged attribute: state the difference directly, e.g.
"The fabric felt slightly different from the photos" — never "some buyers
said."

**Visual must match the claim, not just illustrate the concept.** If the
headline says "lighter," the as-shown/as-worn comparison must visibly show
a lighter variant, not an identical swatch with a different label — text
and visual must never contradict each other.

Layer 4 (tap visual): for Fashion/Footwear, opens a full-screen viewer of
the curated `featuredPhotos` set (§7). For Beauty, opens a shade swatch
viewer. For Home/Accessories, opens a material/finish close-up viewer.
Never more than what's curated, never a raw review gallery.

**Worth It** — per §6, identical structure for every department:

| Condition | Headline | Why (direct, no attribution) |
|---|---|---|
| Comparable data exists | "Good value for this pick" | The specific comparative fact from §6, e.g. "Cheaper than 4 of 5 similar kurta sets we found." (unit price for `unitPriceApplies: true` products) |
| No comparable data | "Good price for this pick" | "Best price we found for this style." |

Never a second product card, never a second Add to Bag, in any state.

## 10. Copy rules (apply everywhere in Quick Check)
- **State facts directly — no third-party attribution.** Never "buyers
  say," "most buyers found," "shoppers report." This is a correction from
  an earlier version of this rule.
- Never invent headcounts or fabricate quotes.
- Never manufacture urgency or scarcity — no countdown timers, no "X
  people viewing this," no invented stock claims. This isn't just a tone
  preference: India's Consumer Protection (E-Commerce) dark-pattern
  guidelines (2023) explicitly prohibit fabricated urgency in e-commerce.
  Any persuasion must come from a real per-product fact (§6), never
  manufactured pressure.

- Headline, visual, and why-line describe the exact same fact at three
  levels of detail — the why-line never introduces a new fact.
- Every check has a genuine "not enough data" state — never force a
  positive verdict when `confidence = "low"`.


## 10a. Visual fidelity requirement (locked — applies to every screen)

This project's evaluation depends on it genuinely looking and feeling like
Myntra, not an approximation. This is not a "nice to have" — treat it with
the same rigor as a functional bug.

Every screen must match the attached reference screenshots on:
- **Typography**: Roboto per §1, correct weight per element (bold ~700 for
  headers/prices, medium ~600 for labels/buttons, regular ~400 for body
  text) — check this against the screenshots, don't guess.
- **Iconography**: thin-line UI chrome icons matching Myntra's exact shapes
  (§ department tiles), real product photography for category tiles (§3a),
  never a generic icon library substitute for either.
- **Spacing and layout density**: card padding, gaps between elements, and
  section spacing should match the visual density shown in the
  screenshots — not looser or tighter.
- **Colour**: the token set in §1/§14, applied consistently — no
  off-palette colours anywhere.
- **Card and button styling**: border radius, shadow weight (Myntra's cards
  use a subtle, barely-visible shadow, not a heavy drop shadow), button
  shapes (pill-shaped primary actions, outlined secondary actions) matching
  the reference exactly.

**Mandatory self-check before claiming any UI phase is complete:** go
through the attached reference screenshots element by element (header,
icons, cards, spacing, colour, type) and compare against what was actually
built. List any deviations found and fix them BEFORE reporting the phase
as done — do not report a phase complete based on the route/logic working
alone when the phase involves visible UI. A phase that is functionally
correct but visually wrong has not met its checkpoint.

## 11. Wishlist screen
Matches reference screenshots: item count header, location bar,
Collections/Out of Stock tabs (unchanged — do not remove or replace either
to make room for Quick Check), category circles, product cards with
existing delete/move/share icons (unchanged).

Add to each eligible card: a labeled **"👁 Quick Check"** button — full
width, same visual weight as a normal action button, positioned below the
price. Not a small icon alone — a small icon is too easy to miss.

Eligibility rule: `wishlist_age >= 3 days AND viewCount >= 2 AND not purchased`.
`data/seedWishlist.js` deterministically seeds 8-10 backdated, eligible
items and 2-3 freshly-added, deliberately ineligible items (showing a
locked state, not hiding the feature) — this proves the gating logic is
real, not hidden.

## 12. Quick Check UI (bottom sheet, with Overview synthesis screen)
`components/QuickCheckSheet.jsx` — portal-rendered, dim backdrop, swipe or
tap to dismiss.

Flow:
```
Wishlist → tap "👁 Quick Check" on a product card
Sheet → shows ONLY the checks that apply to this product (§5a) —
        a skincare product shows one row (Worth It), never three with
        two greyed out
  → tap a check
Detail (per check, §9) → "Why?" reveals the reason → back returns to Overview
Overview (shown after any check is opened once, or as the default landing
          if only one check applies) →
  all applicable checks listed with their specific finding →
  one closing sentence synthesizing every flag into a single line →
  ONE "Add to Bag" button — pre-filled with the suggested size if Fit
  flagged one
```

**The Overview screen is the actual conversion moment** — this is where
doubts resolved individually get synthesized into one decision. Do not
skip straight from a single check's detail view to Add to Bag without this
synthesis step when more than one check applies to the product. When only
one check applies (common for Tier 2 departments), the Overview can be
the same screen as that check's detail, since there's nothing to
synthesize across.

`FitCheckCard.jsx`, `LooksCheckCard.jsx`, `WorthItCard.jsx`,
`OverviewCard.jsx` — one generic component per check type plus the
synthesis screen, never hardcoded per product; each driven entirely by
that product's data object and `availableChecks` (§5).

Confirmation toast on Add to Bag, returns to Wishlist.

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
pricing display, an open-ended chatbot interface, **any alternative product
inside Worth It, in any state — this is a hard rule now, not a "usually
one" rule** (§6), showing more than the curated `featuredPhotos` set in
Looks Check, fake urgency/scarcity language of any kind (§10), per-shopper
personalization referencing individual order history (real upgrade path,
not part of this MVP — this spec's Quick Check data is per-product, not
per-shopper). **Not a cut:** Men/Kids/Beauty/Accessories/Home & Living —
these are in scope per §3a's department tiering; this line previously said
otherwise from an earlier draft and is superseded by §3a.

## 16. Acceptance criteria
- App runs end-to-end with zero API keys set (fallback why-lines used).
- Wishlist shows both eligible and ineligible items by design.
- Every check shown is one that genuinely applies to that product per §5a
  — never a greyed-out row for a check that structurally can't apply.
- Fit verdicts are correct per selected size, not a single flattened
  verdict for the whole product.
- Worth It never shows an alternative product or a second Add to Bag, in
  any state, for any department — this is the single most important
  functional check, since violating it undermines the project's actual
  success metric.
- All checks produce a verdict consistent with the deterministic data
  regardless of AI availability; only the why-line's exact wording changes.
- No third-party attribution language ("buyers say") anywhere — every
  claim is stated as a direct fact.
- No fake urgency/scarcity language anywhere.
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
