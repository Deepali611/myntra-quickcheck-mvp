# edge_cases.md — WHAT IF

Every case below has a defined, graceful behavior. None should surface as a
visible error, blank screen, or crash. This is the acceptance bar alongside
architecture.md.

## Wishlist & eligibility
- Zero wishlist items: real empty state, Quick Check entry hidden entirely.
- Zero eligible items: informative empty/locked state, not an error.
- Duplicate add: no-op, no duplicate entry created.
- Item removed while its Quick Check sheet is open: sheet closes gracefully.

## Fit Check
- `confidence: "low"`: shows the honest fallback verdict, never a forced
  true/small/large answer.
- `garmentType` has no defined fit zones (e.g. an accessory slipping into
  the catalogue): treated as `confidence: "low"` automatically.
- `fit.applicable: false` (e.g. jewellery, watches — no meaningful fit
  dimension per architecture.md §5a): the UI shows "not applicable" rather
  than forcing any verdict, and never shows a broken/empty fit card.
- A Tier 2 product's `categoryAdapters.js` lookup fails or returns an
  unrecognized department: falls back to `confidence: "low"` rather than
  crashing the card or showing raw internal field names.
- Tapping the visual for a product with no real size guide content: shows a
  generic size-chart-not-available state rather than a broken link.

## Looks Check
- `confidence: "low"` (the majority of the catalogue, by design, and
  especially common for Tier 2 departments): shows "Not enough to say yet,"
  single as-shown photo only, no swipe, no Layer 4 photo viewer trigger.
- `featuredPhotos` array is empty even though `confidence` is high (data
  inconsistency): treat as `confidence: "low"` defensively rather than
  showing a broken swipe with nothing to swipe to.

## Worth It
- No candidate clears any threshold: `hasAlternative: false`, plain "good
  pick" verdict — never force a comparison.
- Candidate clears more than one reason type: only the first-checked reason
  type (price → rating → fit → looks, in that order) is used; never combine
  reasons or show two badges.
- The alternative product id can't be resolved (data integrity issue):
  fall back to "This looks like a good pick" rather than linking to a
  broken PDP.
- Shopper taps Add to Bag on the Worth It screen: always adds the ORIGINAL
  wishlisted item, regardless of which alternative was shown, unless the
  shopper has explicitly navigated to the alternative's own PDP and tapped
  Add to Bag there.

## AI calls (all three routes)
- No API key set: fallback fires immediately, no network call attempted, no
  visible difference to the shopper beyond wording.
- Timeout or non-200 response: identical fallback behavior to no-key-set.
- Malformed/non-JSON response: parsed defensively, falls back rather than
  crashing the card.
- Response contains a banned word or an invented fact not present in the
  input verdict: falls back to the hand-written template rather than
  displaying the AI output as-is (a lightweight server-side check against
  the banned-word list before returning the AI response to the client).
- Shopper closes the sheet or navigates away mid-call: call is
  cancelled/ignored, no state update after the component is gone.
- Shopper re-opens the same check for the same product in the same session:
  never re-fires the call — serves the cached why-line instantly.

## Catalogue & pricing
- Discount math must reconcile for every product — validated at load time.
- **Image/text mismatch**: a product's photo must match its own colour and
  garment type. If a data-generation step ever produces a mismatch (e.g. a
  "Peach Kurta" showing a green photo), that product should fail catalogue
  validation at build time rather than ship silently wrong.
- **Image ingestion finds no good match for a specific query** (e.g. a very
  specific colour/style combination): `fetch-images.js` falls back to a
  broader search rather than failing the whole ingestion run, and logs the
  fallback for a spot-check — this must never block the pipeline or leave a
  product with no image at all.
- **A department has too few real product listings after generation**
  (shouldn't happen given §3a's target counts, but guard anyway): that
  department's category page shows what exists rather than a broken empty
  grid, and this is flagged as a data-generation issue to fix, not hidden.
- Deep link to `/p/:id` for a nonexistent id: graceful "product not found"
  state with a way back to Home.
- Category with very few/zero products (possible given the segment-scoped
  catalogue): shows what exists or an honest empty state, never a broken
  grid.
- Search with no matches: real empty state with a suggestion to browse
  categories.

## Sizing & bag
- Add to Bag from Quick Check with no size chosen: resolved via the
  preferred-size inference in architecture.md §4 — never blocks the action.
- Product needing no size: Add to Bag works without a size prompt.
- Bag quantity never goes below 1 via the stepper; removal uses the remove
  action.

## Storage & persistence
- sessionStorage blocked or full (private browsing): app runs without
  persistence for the session, falls back to the seed wishlist, no visible
  error.
- Corrupted sessionStorage value: caught and discarded, falls back to a
  fresh seed rather than crashing on parse.

## Navigation & deployment
- First load, no prior session: seed data populates automatically so the
  app never opens empty for a first-time evaluator.
- Any screen reached via direct URL: renders correctly standalone, not only
  via in-app navigation.
- Deployed build: same checkpoint pass required on the live Vercel URL, not
  just local dev — confirmed as the final verification step before this is
  considered complete.
