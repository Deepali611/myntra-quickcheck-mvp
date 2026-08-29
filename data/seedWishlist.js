import { getAllProducts, getProduct } from '../lib/catalog.js';

/**
 * Deterministic Seed Wishlist per architecture.md §11 & Phase 9
 * Seeds 9 eligible backdated items (>=3 days old, >=2 views, not purchased)
 * and 3 ineligible freshly-added items (<3 days old or <2 views)
 * Includes Tier 1 (Women, Men, Kids, Footwear) AND Tier 2 (Beauty, Accessories, Home & Living)
 */

export function buildSeedWishlist() {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const allProducts = getAllProducts();

  if (!allProducts || allProducts.length === 0) return [];

  // 8 Premier Products with authentic customer as-worn review photos
  const curatedIds = [
    { id: 'm_39187946', daysAgo: 7, viewCount: 4 }, // Sangria Kurta Set (8 photos)
    { id: 'm_31472271', daysAgo: 5, viewCount: 3 }, // CAHOOT Checked Shirt (7 photos)
    { id: 'm_40076381', daysAgo: 8, viewCount: 5 }, // LMG Wedge Pumps (5 photos)
    { id: 'm_18744574', daysAgo: 4, viewCount: 3 }, // Aqualogica Face Serum (7 photos)
    { id: 'm_35959915', daysAgo: 6, viewCount: 4 }, // Mast & Harbour Shoulder Bag (4 photos)
    { id: 'm_39032685', daysAgo: 9, viewCount: 6 }, // Keitra Floral Kurta Set (11 photos)
    { id: 'm_42005719', daysAgo: 5, viewCount: 3 }, // Roadster Striped Shirt (13 photos)
    { id: 'm_27380480', daysAgo: 3, viewCount: 2 }  // BAESD Embellished Pumps (8 photos)
  ];

  const seed = [];

  curatedIds.forEach((spec, idx) => {
    const product = getProduct(spec.id);
    if (product) {
      seed.push({
        id: `wish_${product.id}_${idx}`,
        productId: product.id,
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
