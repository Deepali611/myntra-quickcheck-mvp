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

  const getProductByDept = (dept, index = 0) => {
    const list = allProducts.filter(p => p.department === dept);
    return list[index % list.length] || allProducts[index % allProducts.length];
  };

  // 9 Eligible items (>=3 days old, >=2 views)
  const eligibleDepts = [
    { dept: 'Women', index: 0, daysAgo: 7, viewCount: 4 },
    { dept: 'Men', index: 0, daysAgo: 5, viewCount: 3 },
    { dept: 'Kids', index: 0, daysAgo: 6, viewCount: 4 },
    { dept: 'Footwear', index: 0, daysAgo: 8, viewCount: 5 },
    { dept: 'Beauty', index: 0, daysAgo: 4, viewCount: 3 },     // Tier 2 Beauty
    { dept: 'HomeLiving', index: 0, daysAgo: 9, viewCount: 6 }, // Tier 2 HomeLiving
    { dept: 'Accessories', index: 0, daysAgo: 5, viewCount: 3 },// Tier 2 Accessories
    { dept: 'Women', index: 1, daysAgo: 6, viewCount: 4 },
    { dept: 'Men', index: 1, daysAgo: 4, viewCount: 3 }
  ];

  // 3 Ineligible items (<3 days old or <2 views)
  const ineligibleDepts = [
    { dept: 'Beauty', index: 1, daysAgo: 0, viewCount: 1 },    // Tier 2 Ineligible
    { dept: 'Women', index: 2, daysAgo: 1, viewCount: 1 },
    { dept: 'Footwear', index: 1, daysAgo: 0, viewCount: 1 }
  ];

  const seed = [];

  eligibleDepts.forEach((spec, idx) => {
    const product = getProductByDept(spec.dept, spec.index);
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

  ineligibleDepts.forEach((spec, idx) => {
    const product = getProductByDept(spec.dept, spec.index);
    if (product) {
      seed.push({
        id: `wish_${product.id}_inelig_${idx}`,
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
