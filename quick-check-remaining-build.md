# Quick Check — remaining build, phase by phase

Everything up to the "👁 Quick Check" button on wishlist cards is already
built and correct — do not touch it. This spec covers only what happens
after that button is tapped. Read all of Phase 10a before starting; each
sub-phase builds on the last. Stop after each and show a checkpoint before
continuing.

---

## Locked flow (do not deviate)

```
Wishlist card → tap "Quick Check" button
  → Overview screen opens directly (no intermediate menu)
     shows every applicable check for this product, each with its real,
     already-computed verdict — nothing is blank waiting for a tap
  → tap any row → that check's full Detail screen
  → back arrow → returns to Overview
  → ONE "Add to Bag" button, always visible on Overview
     (carries a suggested size if Fit flagged one)
  → tap Add to Bag → confirmation toast → return to Wishlist
```

No separate "which check do you want?" selection screen. No dead ends.
Every applicable check's verdict is visible on Overview before the shopper
taps into anything, because it's all deterministic from data — there's
nothing to "load" per check.

---

## Phase 10a — Quick Check data + Overview screen

**Which checks are applicable, per department (hard rule, not per-product
guesswork):**

| Department | Fit | Looks | Worth It |
|---|---|---|---|
| Fashion (apparel) | yes | yes | yes |
| Footwear | yes | yes | yes |
| Beauty — colour cosmetics | no | yes (shade only) | yes |
| Beauty — skincare | no | no | yes |
| Home & Living | no | yes (colour/print) | yes |
| Accessories | no | yes (colour/material) | yes |

Build `getApplicableChecks(product)` returning only the checks valid for
that product's department — this drives which rows Overview renders. A
skincare product's Overview shows exactly one row: Worth It.

**Overview screen contents:**
- Product name + hero image
- One row per applicable check: icon, check name, short status label
  (e.g. "Runs small at chest" / "Matches photos" / "Cheaper than 4 of 5
  similar picks") — pulled from that check's real verdict, computed on
  load, not on tap
- One synthesis line combining every flag into a single sentence (only
  when 2+ checks apply — a single-check product skips straight to that
  check's own headline as the synthesis line)
- One "Add to Bag" button

**Checkpoint:** open Overview for one Fashion product (all 3 rows +
synthesis line) and one Beauty skincare product (1 row only, no blank
rows, no greyed-out Fit/Looks). Confirm every status label reflects real
per-product data, not placeholder text.

---

## Phase 10b — Fit Check detail screen

**Only for Fashion/Footwear.** Data is indexed by size (and by piece —
top/bottom — for sets), never one flat verdict per product.

```json
"fit": {
  "S": { "status": "true" },
  "XL": { "top": {"direction":"loose","zone":"chest"},
          "bottom": {"direction":"short","zone":"length"} }
}
```

**UI:** size chips across the top (all sizes carried by this product),
defaulting to the shopper's known size if available. Tapping a chip
updates the verdict below live — this is not static.

**Copy — direct statement, no third-party attribution ("buyers say" is
banned):**

| State | Headline | Sub-line |
|---|---|---|
| true to size | "True to size in {size}" | "Fits just right — no adjustments needed." |
| flagged, apparel (piece-level) | "Runs loose on top, short on the bottoms" | "Consider sizing down on top and a longer inseam if available." |
| flagged, footwear | "Runs a little small — go half a size up" | (visual only) |
| no data for that size | "Not enough to say for {size} yet" | "Check the size chart before you buy." |

Visual: garment icon with the specific flagged zone marked + a slider
scoped to that zone only (not a generic full-body slider). Footwear uses
size-accuracy + width, no "chest/waist" vocabulary.

**Add to Bag on this screen (if reached directly) carries the selected
size** — "Add to Bag — Size {size}." Same rule applies when Add to Bag is
tapped from Overview after visiting Fit: the size carries through.

**Checkpoint:** tap through every size chip on one multi-piece apparel
product and confirm the verdict changes correctly per size, including at
least one size showing the honest "not enough to say" fallback if your
data has a gap. Confirm the footwear version uses size-accuracy/width
language, not chest/waist.

---

## Phase 10c — Looks Check detail screen

**Applicable per the department table above (skip entirely for
skincare).** Headline is generated from two real fields, never fixed text:

| attribute | direction | Headline |
|---|---|---|
| fabric | lighter | "Fabric reads a shade lighter than photos" |
| colour | warmer | "Colour looks slightly warmer than shown" |
| print | smaller | "Print runs a bit smaller than the listing photo" |
| (none) | match | "Matches the photos closely" |

**Visual: swipeable "as shown ↔ as worn" comparison, and the visual must
visually agree with the claim** — if the headline says "lighter," the "as
worn" swatch must be a visibly lighter variant of the "as shown" swatch,
not an identical block with a different label. This is a real requirement,
not a nice-to-have — a contradicting visual undermines the whole check.

**Checkpoint:** open Looks on two different products with two different
`attribute`/`direction` combinations and confirm genuinely different
headlines are produced (not the same sentence twice), and confirm the
swatch colour shift visually matches each claim's direction.

---

## Phase 10d — Worth It detail screen

**Always applicable, every department. Never shows a competing product —
this is a hard rule, not a frequency setting.**

**Headline — a specific computed fact, never a vague adjective:**

| Real comparison result | Headline |
|---|---|
| cheaper + comparable/better rating vs. similar products | "Cheaper than {N} of {M} similar {subcategory}, similar rating" |
| cheapest + best-rated among comparables | "The best-priced, best-rated pick in this style" |
| only price stands out | "Cheaper than {N} of {M} similar {subcategory}" |
| only rating stands out | "Rated higher than most similar picks in this style" |
| no standout | "Priced in line with similar picks we compared" |
| no comparable products exist | "Best price we found for this style" |

Comparison pool = other products in the same department + subcategory.
For pack-size-variable categories (Beauty, some Home & Living), compare
price-per-unit, not raw price — raw price across different sizes is
misleading even when technically true.

**Sub-line — the shopper's own saved-time, real and first-party, not
manufactured urgency:** "Still ₹{price} — same price since you saved it
{N} days ago," computed from the wishlist item's real `addedAt` timestamp.

**Visual:** single product card — the shopper's own pick only. No
alternative product image, no second price, no second "Add to Bag," in
any state, ever.

**Checkpoint:** confirm at least 3 of the 6 headline states are reachable
across your actual catalogue's data (not just the "no comparable" fallback
everywhere — if most products land on the fallback, the comparison pool
per subcategory is too small and needs more products per subcategory).
Confirm no alternative product ever renders on this screen under any
condition.

---

## Phase 10e — Add to Bag wiring + final voice check

- Add to Bag from Overview: adds the wishlisted item, with the suggested
  size from Fit if one was flagged, no second size-picker screen.
- Confirmation toast on tap, return to Wishlist.
- **Voice check (do not skip):** read every string produced across all
  three checks, across at least one Fashion and one Beauty product,
  against this banned list: "reviews," "buyers say," "shoppers found,"
  "score," "confidence," "signal," "evidence," "algorithm," any invented
  headcount, any fake urgency/stock claim. Any hit fails this checkpoint.

**Final checkpoint for this whole spec:** a full run-through — tap Quick
Check on a Fashion product, see all 3 rows resolved on Overview, drill
into each, back out cleanly, tap Add to Bag with the correct size carried
through, confirmation shows, returns to Wishlist. Repeat once for a
single-check (Beauty skincare) product to confirm the shorter path works
too.
