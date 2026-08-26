import { getProduct } from '../lib/catalog.js';

/**
 * Deterministic Seed Wishlist per architecture.md §11
 * Seeds 9 eligible backdated items (>=3 days old, >=2 views, not purchased)
 * and 3 ineligible freshly-added items (<3 days old or <2 views)
 */

export function buildSeedWishlist() {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const eligibleSpecs = [
    { productId: 'w1', daysAgo: 7, viewCount: 4 },
    { productId: 'w15', daysAgo: 5, viewCount: 3 },
    { productId: 'm1', daysAgo: 6, viewCount: 4 },
    { productId: 'm5', daysAgo: 8, viewCount: 5 },
    { productId: 'k1', daysAgo: 4, viewCount: 3 },
    { productId: 'f1', daysAgo: 9, viewCount: 6 },
    { productId: 'b1', daysAgo: 5, viewCount: 3 }, // Tier 2 Beauty
    { productId: 'h1', daysAgo: 6, viewCount: 4 }, // Tier 2 HomeLiving
    { productId: 'a1', daysAgo: 4, viewCount: 3 }  // Tier 2 Accessories
  ];

  const ineligibleSpecs = [
    { productId: 'w3', daysAgo: 0, viewCount: 1 },
    { productId: 'm3', daysAgo: 1, viewCount: 1 },
    { productId: 'b3', daysAgo: 0, viewCount: 1 }
  ];

  const seed = [];

  eligibleSpecs.forEach(spec => {
    const product = getProduct(spec.productId);
    if (product) {
      seed.push({
        id: `wish_${spec.productId}`,
        productId: spec.productId,
        addedAt: new Date(now - spec.daysAgo * DAY_MS).toISOString(),
        viewCount: spec.viewCount,
        purchased: false,
        product: product
      });
    }
  });

  ineligibleSpecs.forEach(spec => {
    const product = getProduct(spec.productId);
    if (product) {
      seed.push({
        id: `wish_${spec.productId}`,
        productId: spec.productId,
        addedAt: new Date(now - spec.daysAgo * DAY_MS).toISOString(),
        viewCount: spec.viewCount,
        purchased: false,
        product: product
      });
    }
  });

  return seed;
}

/**
 * Eligibility Rule: wishlist_age >= 3 days AND viewCount >= 2 AND not purchased
 */
export function isWishlistEligible(item) {
  if (!item) return false;
  if (item.purchased) return false;
  
  const now = Date.now();
  const addedTime = new Date(item.addedAt).getTime();
  const ageDays = (now - addedTime) / (1000 * 60 * 60 * 24);
  const viewCount = item.viewCount || 0;

  return ageDays >= 3 && viewCount >= 2;
}
