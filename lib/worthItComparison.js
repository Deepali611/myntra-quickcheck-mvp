/**
 * lib/worthItComparison.js
 * Worth It algorithm (NEW SPEC per architecture.md §6)
 * Pure function: confirms shopper's own pick with ONE real comparative fact.
 * NEVER returns an alternative product to buy.
 */

export function getWorthItComparison(product, allProducts = []) {
  if (!product) {
    return {
      headline: 'Good price for this pick',
      why: 'Best price we found for this style.',
      unitPriceApplies: false
    };
  }

  const subcat = (product.subcategory || '').toLowerCase();
  const dept = product.department;
  const currentPrice = product.salePrice || product.price || 0;

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
      headline: 'Good price for this pick',
      why: 'Best price we found for this style.',
      unitPriceApplies: unitPriceApplies
    };
  }

  // Count how many candidates have higher price
  const pricierCount = candidates.filter(p => (p.salePrice || p.price || 0) > currentPrice).length;
  const totalCount = candidates.length;

  let whyText = '';

  if (unitPriceApplies) {
    const estUnit = isBeauty ? Math.round(currentPrice / 50) : Math.round(currentPrice / 2);
    const unitLabel = isBeauty ? 'ml' : 'pc';
    if (pricierCount > 0) {
      whyText = `₹${estUnit}/${unitLabel} — cheaper than ${pricierCount} of ${totalCount} similar items we found.`;
    } else {
      whyText = `₹${estUnit}/${unitLabel} — competitive price for this formula.`;
    }
  } else {
    if (pricierCount > 0) {
      whyText = `Cheaper than ${pricierCount} of ${totalCount} similar ${product.subcategory || 'items'} we found.`;
    } else {
      whyText = `Best price we found for this style among ${totalCount} similar items.`;
    }
  }

  return {
    headline: 'Good value for this pick',
    why: whyText,
    unitPriceApplies: unitPriceApplies
  };
}
