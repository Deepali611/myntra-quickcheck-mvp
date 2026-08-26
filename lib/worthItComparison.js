import { getProduct, getAllProducts } from './catalog.js';

/**
 * Worth It Comparison Algorithm per architecture.md §6
 * 
 * Rules & Thresholds:
 * 1. Candidate Pool: Same department AND same subcategory, price within ±25% of wishlisted item.
 * 2. Reason Order (evaluated strictly in this priority order):
 *    - Reason 1 (PRICE): candidate.salePrice is >= ₹150 AND >= 10% lower than target, AND candidate.rating >= target.rating - 0.2
 *    - Reason 2 (RATING): candidate.rating >= target.rating + 0.3 AND candidate.salePrice <= target.salePrice * 1.15
 *    - Reason 3 (FIT): target.fit.direction != "true" (and fit.confidence == "high"), AND candidate.fit.direction == "true" within ±15% price
 *    - Reason 4 (LOOKS): target.looks.flaggedAttribute != null, AND candidate.looks.flaggedAttribute == null within ±15% price
 * 3. Returns exactly ONE alternative (the best candidate for the first clearing reason type), or hasAlternative = false.
 */

export function getWorthItComparison(targetInput, candidatesPool = getAllProducts(), getQuickCheckDataFn = null) {
  const targetProduct = typeof targetInput === 'object' ? targetInput : getProduct(targetInput);
  
  if (!targetProduct) {
    return {
      hasAlternative: false,
      alternativeId: null,
      alternativeProduct: null,
      reasonType: null,
      reasonValue: null,
      headline: "This looks like a good pick",
      fallbackWhy: "Similar options don't offer a clear advantage."
    };
  }

  // Helper to fetch quick check data lazily without circular dependency
  const getQCData = (pid) => {
    if (getQuickCheckDataFn) return getQuickCheckDataFn(pid);
    return null;
  };

  const targetQC = getQCData(targetProduct.id);

  // Filter Candidate Pool: same department, same subcategory, price within ±25%
  const candidatePool = candidatesPool.filter(c => 
    c.id !== targetProduct.id &&
    c.department === targetProduct.department &&
    c.subcategory.toLowerCase() === targetProduct.subcategory.toLowerCase() &&
    c.salePrice >= targetProduct.salePrice * 0.75 &&
    c.salePrice <= targetProduct.salePrice * 1.25
  );

  if (candidatePool.length === 0) {
    return {
      hasAlternative: false,
      alternativeId: null,
      alternativeProduct: null,
      reasonType: null,
      reasonValue: null,
      headline: "This looks like a good pick",
      fallbackWhy: "Similar options don't offer a clear advantage."
    };
  }

  // --- REASON 1: PRICE ---
  // Threshold: savings >= ₹150 AND >= 10% lower, AND candidate.rating >= target.rating - 0.2
  let bestPriceCandidate = null;
  let maxSavings = 0;

  candidatePool.forEach(cand => {
    const savings = targetProduct.salePrice - cand.salePrice;
    const savingsPct = (savings / targetProduct.salePrice) * 100;
    const ratingCheck = cand.rating >= (targetProduct.rating - 0.2);

    if (savings >= 150 && savingsPct >= 10 && ratingCheck) {
      if (savings > maxSavings) {
        maxSavings = savings;
        bestPriceCandidate = cand;
      }
    }
  });

  if (bestPriceCandidate) {
    const reasonValue = `₹${maxSavings} cheaper, similar rating`;
    return {
      hasAlternative: true,
      alternativeId: bestPriceCandidate.id,
      alternativeProduct: bestPriceCandidate,
      reasonType: 'price',
      reasonValue: reasonValue,
      headline: "You may want to compare",
      fallbackWhy: reasonValue
    };
  }

  // --- REASON 2: RATING ---
  // Threshold: candidate.rating >= target.rating + 0.3 AND candidate.salePrice <= target.salePrice * 1.15
  let bestRatingCandidate = null;
  let maxRatingDiff = 0;

  candidatePool.forEach(cand => {
    const ratingDiff = cand.rating - targetProduct.rating;
    const pricePctDiff = ((cand.salePrice - targetProduct.salePrice) / targetProduct.salePrice) * 100;

    if (ratingDiff >= 0.3 && pricePctDiff <= 15) {
      if (ratingDiff > maxRatingDiff) {
        maxRatingDiff = ratingDiff;
        bestRatingCandidate = cand;
      }
    }
  });

  if (bestRatingCandidate) {
    const reasonValue = `Rated ${bestRatingCandidate.rating.toFixed(1)} vs ${targetProduct.rating.toFixed(1)}, similar price`;
    return {
      hasAlternative: true,
      alternativeId: bestRatingCandidate.id,
      alternativeProduct: bestRatingCandidate,
      reasonType: 'rating',
      reasonValue: reasonValue,
      headline: "You may want to compare",
      fallbackWhy: reasonValue
    };
  }

  // --- REASON 3: FIT ---
  // Threshold: target fit.confidence == "high" AND target fit.direction != "true" (runs small/large),
  // AND candidate fit.direction == "true" within ±15% price
  if (targetQC && targetQC.fit && targetQC.fit.confidence === 'high' && targetQC.fit.direction && targetQC.fit.direction !== 'true') {
    const targetDirection = targetQC.fit.direction;
    const fitCandidates = candidatePool.filter(cand => {
      const candQC = getQCData(cand.id);
      const priceDiffPct = Math.abs(cand.salePrice - targetProduct.salePrice) / targetProduct.salePrice;
      return candQC && candQC.fit && candQC.fit.direction === 'true' && priceDiffPct <= 0.15;
    });

    if (fitCandidates.length > 0) {
      const bestFitCand = fitCandidates[0];
      const reasonValue = `Fits true to size, this one runs ${targetDirection}`;
      return {
        hasAlternative: true,
        alternativeId: bestFitCand.id,
        alternativeProduct: bestFitCand,
        reasonType: 'fit',
        reasonValue: reasonValue,
        headline: "You may want to compare",
        fallbackWhy: reasonValue
      };
    }
  }

  // --- REASON 4: LOOKS ---
  // Threshold: target looks.flaggedAttribute != null, AND candidate looks.flaggedAttribute == null within ±15% price
  if (targetQC && targetQC.looks && targetQC.looks.flaggedAttribute) {
    const looksCandidates = candidatePool.filter(cand => {
      const candQC = getQCData(cand.id);
      const priceDiffPct = Math.abs(cand.salePrice - targetProduct.salePrice) / targetProduct.salePrice;
      return candQC && candQC.looks && candQC.looks.flaggedAttribute === null && priceDiffPct <= 0.15;
    });

    if (looksCandidates.length > 0) {
      const bestLooksCand = looksCandidates[0];
      const reasonValue = "Matches its photos closely, this one doesn't quite";
      return {
        hasAlternative: true,
        alternativeId: bestLooksCand.id,
        alternativeProduct: bestLooksCand,
        reasonType: 'looks',
        reasonValue: reasonValue,
        headline: "You may want to compare",
        fallbackWhy: reasonValue
      };
    }
  }

  // Default: No candidate cleared thresholds
  return {
    hasAlternative: false,
    alternativeId: null,
    alternativeProduct: null,
    reasonType: null,
    reasonValue: null,
    headline: "This looks like a good pick",
    fallbackWhy: "Similar options don't offer a clear advantage."
  };
}
