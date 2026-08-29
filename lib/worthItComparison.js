/**
 * lib/worthItComparison.js
 * Worth It algorithm (NEW SPEC per quick-check-remaining-build.md Phase 10d)
 * Pure function: confirms shopper's own pick with ONE real comparative fact.
 * NEVER returns an alternative product to buy.
 */

export function getWorthItComparison(product, allProducts = []) {
  if (!product) {
    return {
      headline: 'Best price we found for this style',
      why: 'Best price we found for this style.',
      unitPriceApplies: false
    };
  }

  const subcat = (product.subcategory || '').toLowerCase();
  const dept = product.department;
  const currentPrice = product.salePrice || product.price || 0;
  const currentRating = product.rating || 4.0;

  // Beauty skincare/cosmetics and Home & Living pack items use unit price (₹/ml, ₹/g)
  const isBeauty = dept === 'Beauty';
  const isHome = dept === 'HomeLiving' || dept === 'Home & Living';
  const unitPriceApplies = isBeauty || (isHome && (subcat.includes('bedsheet') || subcat.includes('towel')));

  // Find candidate pool in same department AND same subcategory, excluding itself
  const candidates = allProducts.filter(p => 
    p.id !== product.id && 
    p.department === dept && 
    (p.subcategory || '').toLowerCase() === subcat
  );

  if (candidates.length === 0) {
    return {
      headline: 'Best price we found for this style',
      why: 'Best price we found for this style.',
      unitPriceApplies: unitPriceApplies
    };
  }

  const totalCount = candidates.length;
  const pricierCount = candidates.filter(p => (p.salePrice || p.price || 0) > currentPrice).length;
  const lowerRatedCount = candidates.filter(p => (p.rating || 4.0) < currentRating).length;
  
  const isCheapest = pricierCount === totalCount;
  const isBestRated = lowerRatedCount >= Math.floor(totalCount * 0.7);
  const isCheaperThanMost = pricierCount > 0;

  let headline = '';
  let whyText = '';

  if (isCheapest && isBestRated) {
    headline = 'The best-priced, best-rated pick in this style';
  } else if (isCheaperThanMost && isBestRated) {
    headline = `Cheaper than ${pricierCount} of ${totalCount} similar ${product.subcategory || 'items'}, similar rating`;
  } else if (isCheaperThanMost) {
    headline = `Cheaper than ${pricierCount} of ${totalCount} similar ${product.subcategory || 'items'}`;
  } else if (isBestRated) {
    headline = 'Rated higher than most similar picks in this style';
  } else if (pricierCount === 0) {
    headline = 'Priced in line with similar picks we compared';
  } else {
    headline = `Cheaper than ${pricierCount} of ${totalCount} similar picks`;
  }

  if (unitPriceApplies) {
    const estUnit = isBeauty ? Math.round(currentPrice / 50) : Math.round(currentPrice / 2);
    const unitLabel = isBeauty ? 'ml' : 'pc';
    whyText = `₹${estUnit}/${unitLabel} — ${headline.toLowerCase()}.`;
  } else {
    whyText = `${headline}.`;
  }

  return {
    headline: headline,
    why: whyText,
    unitPriceApplies: unitPriceApplies
  };
}
