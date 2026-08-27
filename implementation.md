# implementation.md — HOW

Read `context.md` and `architecture.md` first. This file only governs build
order. If this conflicts with `architecture.md` on what to build,
`architecture.md` wins.

**Backend/data/logic layer fully built and verified before any frontend
screen work.** Nothing in Part B should require guessing at data shapes or
algorithm behavior — all of it is locked and testable by the end of Part A.

---

## PART A — BACKEND / DATA / LOGIC

### Phase 0 — Scaffold
Next.js 15 (App Router) + React 19. Folders: `app/` (routes + layouts per
architecture.md §2), `components/`, `lib/`, `data/`, `state/`.
`.gitignore` including `.env`. `.env.example` listing `GROQ_API_KEY_FIT`,
`GROQ_API_KEY_LOOKS`, `GROQ_API_KEY_WORTH`, `GROQ_MODEL` with no real
values. No Vercel CLI or `vercel link` step needed — `next dev` runs API
routes natively.
**Checkpoint:** `npm run dev` starts clean, no console errors.

### Phase 1a — Image ingestion (automated, not manual)
`scripts/fetch-images.js` per architecture.md §3b — queries the Pexels API
(Unsplash as fallback) for each department/subcategory/colour combination
needed across all seven departments (§3a), downloads matches to
`public/products/{id}.jpg`, and writes `data/image-sources.json` recording
provenance (source, photographer, license) for every downloaded image. Logs
any product that fell back to a broader search query so it can be
spot-checked, without turning this into manual entry.
**Checkpoint:** run the script once — confirm every needed image exists
locally under `public/products/`, `data/image-sources.json` has one entry
per image with real source/license fields (not placeholders), and the app
makes zero calls to Pexels/Unsplash at any point after this script finishes
(grep the rest of the codebase for the provider's API domain — it should
only appear inside this one script).

### Phase 1b — Catalogue generation (image-first, automated)
`scripts/generate-catalog.js` per architecture.md §3b — reads the images
and their confirmed colour/subcategory from Phase 1a's output, and
generates `data/products.json` (~250-350 products across all seven
departments per §3a's target counts) by combining real brand names,
department-appropriate pricing, and the department/quickCheckTier fields —
matched to what each image actually shows, never the reverse.
`lib/catalog.js`, `lib/sizing.js`.
**Checkpoint:** every product's discount math reconciles; sizing rules
return correct arrays per garment type/department. **Review by subcategory
group, not a random product sample** — this is a stronger and more
tractable check than spot-checking individual products: open
`image-sources.json`, group by subcategory (e.g. all "Kurta Sets" entries,
all "Bedsheets" entries, all "T-Shirts" entries), and confirm every
subcategory group's `matchedKeyword` and actual downloaded image genuinely
match that subcategory — one wrong image in a subcategory usually means
the search query for that whole subcategory was weak, so checking by group
catches systematic mismatches a random sample would likely miss entirely.
Confirm all seven departments have real, non-empty product listings (§3a's
acceptance criterion).

### Phase 2 — Quick Check data (category-aware)
`lib/categoryAdapters.js` — implements the department → vocabulary/Layer-4
mapping in architecture.md §5a. `lib/quickCheckData.js` — deterministic
hash-based generation of the full data shape in §5 for every product,
reading each product's `department` to resolve the correct adapter. Populate
curated `featuredPhotos` for the 8-12 designated Tier 1 Looks Check products
per §7 only; everything else gets `looks.confidence: "low"` — and Tier 2
(Beauty/Accessories/Home & Living) products should skew toward `"low"`
confidence more often than Tier 1, per §5a's honesty rule.
**Checkpoint:** calling `getQuickCheckData(id)` for a sample of products
across every department produces deterministic, varied results, using the
correct vocabulary for that department (e.g. a Beauty product never returns
a clothing fit zone like "chest"); confirm the 8-12 curated-photo products
are correctly the only ones with a non-empty `featuredPhotos` array; confirm
Tier 2 products show a visibly lower average confidence than Tier 1 when
sampled.

### Phase 3 — Worth It algorithm
`lib/worthItComparison.js` implementing architecture.md §6 exactly, pure
function, no AI call inside it, working across all departments (candidates
are always drawn from the same department/subcategory, never cross-department).
**Checkpoint:** run it against a sample of products spanning all four reason
types and the "no alternative" case, across at least one Tier 1 and one
Tier 2 department — confirm each threshold is actually being enforced (test
a near-miss case for each reason type and confirm it correctly falls
through to the next reason or to "no alternative").

### Phase 4 — State management
`state/store.jsx` (reducer + context, sessionStorage),
`data/seedWishlist.js` (deterministic eligible/ineligible seed per
architecture.md §11).
**Checkpoint:** dispatching wishlist/bag actions produces correct state
transitions headlessly; seeded wishlist has the correct split on fresh load;
storage-blocked scenario falls back to the seed without crashing.

### Phase 5 — AI routes
`lib/groqClient.js` shared client (architecture.md §8: task-specific key,
12s timeout, `null` on any failure). `app/api/fit-check-why/route.js`,
`app/api/looks-check-why/route.js`, `app/api/worth-it-why/route.js` — each
takes the deterministic verdict fields as input, calls Groq with the system
prompt requirements in §8, and has a complete hand-written fallback matching
§9's tables exactly.
**Checkpoint:** run `npm run dev` and hit each route (they run natively
under Next.js, no separate CLI needed) with no env vars set — confirm the
exact fallback text from §9's tables comes back, not a generic error. Set
real keys in `.env` — confirm a real, on-topic response in natural language,
grounded only in the input fields given (not inventing new facts). Read
every fallback and every AI-generated response against architecture.md
§10's banned-word list — any violation fails this checkpoint and must be
fixed in the prompt or the fallback template before
continuing.

**Part A checkpoint:** the entire logic layer works correctly in isolation —
catalogue, Quick Check data, Worth It algorithm, state, all three AI routes
with verified fallbacks. Nothing in Part B should require changing anything
built here.

---

## PART B — FRONTEND

### Phase 6 — App shell
`App.jsx` routing per architecture.md §2 (PDP full-bleed, Wishlist/Bag own
header, rest shared). Base theme CSS variables matching the reference
screenshots (pink accent, white background, dark text).
**Checkpoint:** routes resolve with correct chrome per route.

### Phase 7 — Core shopping shell
`Home.jsx`, `Category.jsx`, `Search.jsx`, `ProductCard.jsx`, wired to the
real catalogue. Home page's department tile row (Fashion, Beauty,
Homeliving, Footwear, Accessories) must all link to real, populated
category listings — none should lead to an empty page.
**Checkpoint:** browsing Home → Category → Search shows real catalogue
products consistently; clicking into every department tile shows real
products, not an empty state. **Visual fidelity self-check (architecture.md
§10a, mandatory):** compare against the reference screenshots element by
element — typography (Roboto), icons, tile images, spacing, colour, card
styling. List any deviation found and fix it before reporting this phase
complete. A phase that works functionally but doesn't visually match fails
this checkpoint.

### Phase 8 — PDP
`Product.jsx` — full-bleed, image, price/discount, colour swatches, size
selector (per department's sizing rules, §4 — no size selector shown for
departments that don't need one), product details, similar products rail,
Buy Now/Add to Bag wired to the real store.
**Checkpoint:** every product card leads to a working PDP with real Add to
Bag behavior, across at least one product from each department. **Visual
fidelity self-check (architecture.md §10a, mandatory):** same element-by-
element comparison against the reference PDP screenshots before reporting
complete.

### Phase 9 — Bag & Wishlist
`Bag.jsx`, `Checkout.jsx`. `Wishlist.jsx` per architecture.md §11, wired to
real state and seed data, with the Quick Check entry point on eligible
cards only. Seed wishlist items should include at least one product from a
Tier 2 department, not only Tier 1 clothing/footwear.
**Checkpoint:** Wishlist matches reference screenshots visually (§10a
element-by-element self-check, mandatory, same as Phase 7); Quick Check
entry points appear only on eligible items, driven by real state; the
Tier 2 seeded item's Quick Check reflects that department's adapted
meaning (§5a), not clothing-specific language.

### Phase 10 — Quick Check UI
`QuickCheckSheet.jsx`, `FitCheckCard.jsx`, `LooksCheckCard.jsx`,
`WorthItCard.jsx` — driven by `categoryAdapters.js` (Phase 2) so the same
components render correctly for every department's adapted vocabulary and
Layer 4 type, wired to real Quick Check data (Phase 2), the Worth It
algorithm (Phase 3), and the AI routes (Phase 5).
**Checkpoint:** tapping Quick Check on an eligible item opens the sheet, all
three checks show a correct verdict, tapping the visual opens the correct
Layer 4 (size guide / curated photo viewer / alternative PDP), Worth It
shows an alternative only when the algorithm says so, Add to Bag from
Worth It adds the ORIGINAL item not the alternative. **Voice check (do not
skip):** re-read every string shown, with and without AI keys set, against
the banned-word list and the "would a shopper understand this without
re-reading" test in context.md. Any violation fails this checkpoint.
**Visual fidelity self-check (architecture.md §10a, mandatory):** the Quick
Check sheet itself must also match Myntra's visual language (typography,
icons, card styling) — this is a new UI surface, not exempt from §10a just
because it's a new feature rather than an existing Myntra screen.

### Phase 11 — Polish & deployment readiness
Toast confirmations on wishlist/bag actions. Visual QA against reference
screenshots across all screens. Confirm `npm run build` succeeds, no secrets
committed, `.env` is gitignored.
**Checkpoint:** ready to push to GitHub and import into Vercel.

---

## What "done" means
Every item in `edge_cases.md` must hold true, not just the happy path shown
in the checkpoints above.
