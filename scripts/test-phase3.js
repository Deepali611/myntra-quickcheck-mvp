import { getWorthItComparison } from '../lib/worthItComparison.js';
import { getQuickCheckData } from '../lib/quickCheckData.js';
import { getAllProducts, getProduct } from '../lib/catalog.js';

console.log('=== Phase 3 Verification Suite — Worth It Algorithm ===\n');

const allProducts = getAllProducts();
console.log(`Total products evaluated: ${allProducts.length}`);

// 1. Evaluate Worth It across all 7 departments (including Tier 2)
console.log('\n--- 1. Real Department Evaluation Samples ---');
const sampleIds = ['w1', 'w10', 'm1', 'm15', 'k1', 'f1', 'b1', 'b10', 'a1', 'a15', 'h1', 'h10'];

sampleIds.forEach(id => {
  const p = getProduct(id);
  const worth = getWorthItComparison(p, allProducts, getQuickCheckData);
  console.log(`\nProduct [${p.id}] ${p.department} (${p.subcategory}) - ₹${p.salePrice}, Rating: ${p.rating}`);
  console.log(`  hasAlternative: ${worth.hasAlternative}`);
  if (worth.hasAlternative) {
    const alt = worth.alternativeProduct;
    console.log(`  Alternative: [${alt.id}] ${alt.name} - ₹${alt.salePrice}, Rating: ${alt.rating}`);
    console.log(`  Reason Type: ${worth.reasonType}`);
    console.log(`  Reason Value: "${worth.reasonValue}"`);
    console.log(`  Headline: "${worth.headline}"`);
    
    // Cross-department assertion
    if (alt.department !== p.department || alt.subcategory.toLowerCase() !== p.subcategory.toLowerCase()) {
      console.error(`❌ CROSS-DEPARTMENT VIOLATION! Target ${p.id} (${p.department}/${p.subcategory}) matched with ${alt.id} (${alt.department}/${alt.subcategory})`);
      process.exit(1);
    }
  } else {
    console.log(`  Verdict: "${worth.headline}" - "${worth.fallbackWhy}"`);
  }
});

// 2. Department & Subcategory Isolation Assertion across entire catalog
console.log('\n--- 2. Catalog-wide Department & Subcategory Isolation Check ---');
let crossDeptViolations = 0;
allProducts.forEach(p => {
  const worth = getWorthItComparison(p, allProducts, getQuickCheckData);
  if (worth.hasAlternative) {
    const alt = worth.alternativeProduct;
    if (alt.department !== p.department || alt.subcategory.toLowerCase() !== p.subcategory.toLowerCase()) {
      crossDeptViolations++;
    }
  }
});

if (crossDeptViolations === 0) {
  console.log('✓ Department & Subcategory Isolation PASSED! Zero cross-department or cross-subcategory comparisons found.');
} else {
  console.error(`❌ ${crossDeptViolations} cross-department comparison violations!`);
  process.exit(1);
}

// 3. Reason Type Distribution across catalog
console.log('\n--- 3. Worth It Reason Type Distribution ---');
const reasonCounts = { price: 0, rating: 0, fit: 0, looks: 0, no_alternative: 0 };
allProducts.forEach(p => {
  const worth = getWorthItComparison(p, allProducts, getQuickCheckData);
  if (worth.hasAlternative) {
    reasonCounts[worth.reasonType]++;
  } else {
    reasonCounts.no_alternative++;
  }
});

Object.keys(reasonCounts).forEach(type => {
  console.log(`Reason: ${type.padEnd(15)} -> ${reasonCounts[type]} products`);
});

// 4. Threshold Enforcement & Near-Miss Unit Tests
console.log('\n--- 4. Threshold & Near-Miss Unit Tests ---');

// Test Synthetic Target & Candidate Pool
const mockTarget = {
  id: 'test_target',
  department: 'Beauty',
  subcategory: 'face serum',
  salePrice: 1000,
  price: 1500,
  rating: 4.0
};

// Case 1: PRICE Threshold Pass
const mockCandPricePass = {
  id: 'cand_price_pass',
  department: 'Beauty',
  subcategory: 'face serum',
  salePrice: 800, // ₹200 cheaper (>=150 & 20% >= 10%)
  price: 1200,
  rating: 3.9 // >= 4.0 - 0.2
};
const resPricePass = getWorthItComparison(mockTarget, [mockTarget, mockCandPricePass]);
console.log(`[Price Pass Test] expected: price -> got: ${resPricePass.reasonType} ("${resPricePass.reasonValue}")`);
if (resPricePass.reasonType !== 'price' || !resPricePass.reasonValue.includes('₹200 cheaper')) {
  console.error('❌ Price threshold test failed!');
  process.exit(1);
}

// Case 2: PRICE Near-Miss (only ₹140 cheaper, fails price threshold -> falls through to no alternative)
const mockCandPriceNearMiss = {
  id: 'cand_price_near_miss',
  department: 'Beauty',
  subcategory: 'face serum',
  salePrice: 860, // ₹140 cheaper (< 150 threshold!)
  price: 1200,
  rating: 3.9
};
const resPriceNearMiss = getWorthItComparison(mockTarget, [mockTarget, mockCandPriceNearMiss]);
console.log(`[Price Near-Miss Test] expected: hasAlternative=false -> got: hasAlternative=${resPriceNearMiss.hasAlternative}`);
if (resPriceNearMiss.hasAlternative !== false) {
  console.error('❌ Price near-miss failed! Should have fallen through.');
  process.exit(1);
}

// Case 3: RATING Threshold Pass
const mockCandRatingPass = {
  id: 'cand_rating_pass',
  department: 'Beauty',
  subcategory: 'face serum',
  salePrice: 1100, // +10% price (<= 15% threshold)
  price: 1500,
  rating: 4.4 // +0.4 rating (>= 0.3 threshold)
};
const resRatingPass = getWorthItComparison(mockTarget, [mockTarget, mockCandRatingPass]);
console.log(`[Rating Pass Test] expected: rating -> got: ${resRatingPass.reasonType} ("${resRatingPass.reasonValue}")`);
if (resRatingPass.reasonType !== 'rating' || !resRatingPass.reasonValue.includes('Rated 4.4 vs 4.0')) {
  console.error('❌ Rating threshold test failed!');
  process.exit(1);
}

// Case 4: RATING Near-Miss (only +0.2 rating higher -> fails rating threshold -> falls through)
const mockCandRatingNearMiss = {
  id: 'cand_rating_near_miss',
  department: 'Beauty',
  subcategory: 'face serum',
  salePrice: 1050,
  price: 1500,
  rating: 4.2 // +0.2 rating (< 0.3 threshold!)
};
const resRatingNearMiss = getWorthItComparison(mockTarget, [mockTarget, mockCandRatingNearMiss]);
console.log(`[Rating Near-Miss Test] expected: hasAlternative=false -> got: hasAlternative=${resRatingNearMiss.hasAlternative}`);
if (resRatingNearMiss.hasAlternative !== false) {
  console.error('❌ Rating near-miss failed! Should have fallen through.');
  process.exit(1);
}

console.log('✓ Threshold enforcement & near-miss unit tests PASSED perfectly!');

// 5. Tier 2 Department Example Demonstration
console.log('\n--- 5. Tier 2 Department (Beauty & HomeLiving) Example Verification ---');
const beautyTarget = getProduct('b1');
const beautyWorth = getWorthItComparison(beautyTarget, allProducts, getQuickCheckData);
console.log(`Beauty Product [${beautyTarget.id}]: ${beautyTarget.name} (₹${beautyTarget.salePrice})`);
console.log(`  Worth It Result: hasAlternative=${beautyWorth.hasAlternative}`);
if (beautyWorth.hasAlternative) {
  console.log(`  Alternative: [${beautyWorth.alternativeId}] ${beautyWorth.alternativeProduct.name} (₹${beautyWorth.alternativeProduct.salePrice})`);
  console.log(`  Reason: ${beautyWorth.reasonType} -> "${beautyWorth.reasonValue}"`);
} else {
  console.log(`  Verdict: "${beautyWorth.headline}" (${beautyWorth.fallbackWhy})`);
}

const homeTarget = getProduct('h1');
const homeWorth = getWorthItComparison(homeTarget, allProducts, getQuickCheckData);
console.log(`\nHomeLiving Product [${homeTarget.id}]: ${homeTarget.name} (₹${homeTarget.salePrice})`);
console.log(`  Worth It Result: hasAlternative=${homeWorth.hasAlternative}`);
if (homeWorth.hasAlternative) {
  console.log(`  Alternative: [${homeWorth.alternativeId}] ${homeWorth.alternativeProduct.name} (₹${homeWorth.alternativeProduct.salePrice})`);
  console.log(`  Reason: ${homeWorth.reasonType} -> "${homeWorth.reasonValue}"`);
} else {
  console.log(`  Verdict: "${homeWorth.headline}" (${homeWorth.fallbackWhy})`);
}

console.log('\n🎉 ALL PHASE 3 CHECKPOINTS PASSED SUCCESSFULLY!');
