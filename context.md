# context.md — WHY

This is the source-of-truth document for product intent. `architecture.md`,
`implementation.md`, and `edge_cases.md` are derived from this. This is a
standalone project — not related to, and not built from, any other
repository.

## Business goal
Increase the % of users who purchase at least one wishlisted item within 30
days of adding it. Constraint: no monetary incentives.

## Target user segment
**Core, research-backed segment:** shoppers who wishlist clothing/footwear
items (Women's, Men's, and Kids' apparel, plus Footwear) and leave them
unpurchased for 30+ days — a category where satisfaction can't be verified
from specs the way it can for electronics or home goods. This is the
segment Parts 1-4 actually validated through discovery and interviews.

**Framework-extension segment (explicitly not research-backed — see
"Scope tiering" below):** the same underlying doubt — will this work for
me, what can I actually expect, is this the right pick — plausibly
generalizes to other wishlist categories on the platform: Beauty,
Accessories, and Home & Living. This extension is a deliberate design
choice to test whether the Quick Check model generalizes, not a claim that
it was researched for these categories.

## Scope tiering (locked, and must be stated honestly wherever this
project is presented — deck, docs, or demo)

- **Tier 1 — full depth, research-backed:** Women's Ethnic/Western wear,
  Men's clothing, Kids' clothing, Footwear. Quick Check evidence here is
  the actual product of Parts 1-4's discovery and interview work.
- **Tier 2 — framework extension, explicitly labeled as such:** Beauty,
  Accessories, Home & Living. Quick Check appears here with
  category-adapted meaning (see architecture.md §5b), demonstrating that
  the three-check model generalizes beyond apparel — this is a
  generalizability/creativity point, never presented as equally
  evidence-backed as Tier 1. Never blur this distinction in the deck or in
  any customer-facing copy that would be shown to an evaluator's
  discussion of methodology.
- Both tiers get real, browsable product listings in the catalogue —
  clicking into Beauty or Home & Living shows real products, not an empty
  category. The tiering only affects Quick Check evidence depth, never
  catalogue browsability.

## Research-backed problem
A shopper who has saved a fashion item genuinely wants to buy it, but
doesn't trust their own judgment or Myntra's page alone to confirm it's the
right call. Before committing, they need outside confirmation on fit,
whether the product will actually look like its photos, and whether it's
the right pick versus alternatives.

## User behaviour / workaround (why this matters now)
Shoppers currently leave the app to resolve this doubt — watching creator
try-on videos, asking friends, checking other apps, ordering a size up "just
in case" and returning if wrong. Every minute spent outside the app during
that 30-day window is a moment the shopper may lose interest, find the item
elsewhere, or simply forget.

## Opportunity
Resolve the doubt inside the wishlist, in seconds, so the shopper never has
to leave to get confirmation.

## Product outcome
Move the shopper from "reconsideration" to "confidence resolution" to
"decision" without adding friction, monetary incentive, or a detour outside
the app.

## Solution: Quick Check
A shopper-facing capability that resolves ONE specific purchase doubt in
seconds, inside the wishlist, without leaving the shopping journey. Three
checks:
- **Fit Check** — "Will it fit?"
- **Looks Check** — "Will it look as expected?"
- **Worth It** — "Is this a good pick?" (a confirmation of the shopper's
  own choice, backed by one real fact — never a comparison to a different
  product; see principle 5 below)

This is not an AI dashboard, not a chatbot, not a review-analysis screen,
not a recommendation feed. The AI/data methodology is implementation
machinery — it must never feel like an AI product to the shopper.

## Core user journey
Home → browse → product → Wishlist → Quick Check → resolve doubt → decision
→ Add to Bag → Bag. This should feel like one continuous shopping journey,
not a separate tool bolted onto Myntra.

## Key product principles
1. **Verdict first, always.** The shopper gets an answer in ~4 words before
   anything else. Everything past that is optional depth for a shopper who
   pauses.
2. **One visual per check, always tappable (Fit/Looks).** The visual is not
   decoration — tapping it reveals real underlying evidence (a size chart,
   a full photo viewer), never a bigger version of the summary. Worth It
   has no such destination, since it never points anywhere but the
   shopper's own pick — see principle 5.
3. **No internal/technical language ever reaches the shopper.** No "score,"
   "confidence," "signal," "evidence," "synthesized," "algorithm," or naming
   "reviews" as a source. Also no third-party attribution ("buyers say," —
   state facts directly instead) and no fabricated urgency/scarcity. See
   architecture.md for the full banned-word list and copy templates.
4. **Honesty over polish.** Every check has a genuine "not enough data"
   state. The UI never fabricates certainty, headcounts, or guarantees that
   the underlying synthetic data can't support.
5. **Worth It is always a confirmation, never a comparison to switch
   products.** Showing a different product with its own Add to Bag would
   directly undermine this project's actual success metric — purchase of
   the wishlisted item specifically — since convincing a shopper to buy
   something else instead is not a win for what's being measured. Worth It
   states one real comparative fact about the shopper's own pick and stops
   there.
6. **Add, don't redesign.** The rest of the shopping experience (Home,
   Category, Search, PDP, Bag) stays realistic and complete. Quick Check is
   a layer on the existing Wishlist, not a separate product.
7. **Deterministic verdict, live-AI phrasing.** What the answer IS (fit
   zone/direction per size, looks attribute/direction, the Worth It
   comparative fact) is always computed deterministically from per-product
   data — this must be reliable and identical every time, regardless of API
   availability. HOW it's phrased to the shopper is generated live by Groq,
   grounded strictly in that deterministic verdict, with a hand-written
   template used as a graceful fallback whenever the API is unavailable.
   This is a real, functional, live-AI feature — not a static template dump
   — while keeping the underlying decision trustworthy and consistent.
8. **Curated, not comprehensive.** Looks Check shows a small, hand-picked
   set of meaningful as-worn photos per product (2-4), not every photo ever
   captured. This is a curated highlight, like a real "customer photos"
   strip — never a review-reading experience.

## Explicit non-goals
- Not a general product-recommendation or browsing feature.
- Not a chatbot or open-ended Q&A interface.
- Not a review-reading or review-summarization tool.
- Not a monetary-incentive mechanic (coupons, price drops, discounts beyond
  realistic catalogue pricing display).
- Not a full e-commerce rebuild — secondary screens (Search, Checkout,
  Account) need only enough fidelity to make the core journey feel real,
  not full production depth.
- Not a live-AI-inference product at runtime (see principle 7 above).
