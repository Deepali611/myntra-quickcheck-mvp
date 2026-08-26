import fs from 'fs';
import path from 'path';
import { getQuickCheckData } from '../lib/quickCheckData.js';
import { getAllProducts } from '../lib/catalog.js';

console.log('=== Phase 2 Verification Suite ===\n');

const allProducts = getAllProducts();
console.log(`Total catalogue products loaded: ${allProducts.length}`);

// 1. Test sample products from each department
console.log('\n--- 1. Department Sample Quick Check Data Output ---');
const sampleProducts = ['w1', 'm1', 'k1', 'f1', 'b1', 'a1', 'a10', 'h1'];

sampleProducts.forEach(id => {
  const data = getQuickCheckData(id);
  console.log(`\nProduct ID: ${data.productId} (${data.department})`);
  console.log(`  Tier: ${data.quickCheckTier}`);
  console.log(`  Fit Meaning: "${data.adapter.fitMeaning}" | Vocabulary: [${data.adapter.fitVocabulary.join(', ')}]`);
  console.log(`  Fit Verdict Data: applicable=${data.fit.applicable}, zone=${data.fit.flaggedZone}, direction=${data.fit.direction}, confidence=${data.fit.confidence}`);
  console.log(`  Looks Meaning: "${data.adapter.looksMeaning}" | Vocabulary: [${data.adapter.looksVocabulary.join(', ')}]`);
  console.log(`  Looks Verdict Data: confidence=${data.looks.confidence}, attribute=${data.looks.flaggedAttribute}, featuredPhotos=${data.looks.featuredPhotos.length} photos`);
});

// 2. Vocabulary Isolation Verification (Confirm Beauty/Accessories/HomeLiving NEVER return clothing fit zones)
console.log('\n--- 2. Vocabulary Isolation Verification ---');
const clothingZones = new Set(['chest', 'waist', 'shoulder', 'sleeve', 'hip', 'length', 'bust']);
let vocabularyViolations = 0;

allProducts.forEach(p => {
  const data = getQuickCheckData(p.id);
  if (['Beauty', 'Accessories', 'HomeLiving'].includes(p.department)) {
    if (data.fit.flaggedZone && clothingZones.has(data.fit.flaggedZone)) {
      console.error(`❌ Vocabulary violation! ${p.department} product ${p.id} returned clothing fit zone "${data.fit.flaggedZone}"`);
      vocabularyViolations++;
    }
  }
});

if (vocabularyViolations === 0) {
  console.log('✓ Vocabulary Isolation PASSED! Tier 2 departments never return clothing fit zones.');
} else {
  console.error(`❌ ${vocabularyViolations} vocabulary violations found!`);
  process.exit(1);
}

// 3. Featured Photos Curation Check (Only 10 curated products have featuredPhotos)
console.log('\n--- 3. Featured Photos Curation Verification ---');
const productsWithPhotos = allProducts.filter(p => {
  const data = getQuickCheckData(p.id);
  return data.looks.featuredPhotos && data.looks.featuredPhotos.length > 0;
});

console.log(`Products with non-empty featuredPhotos array: ${productsWithPhotos.length}`);
productsWithPhotos.forEach(p => {
  const data = getQuickCheckData(p.id);
  console.log(`  - [Curated] ${p.id} (${p.department}): ${data.looks.featuredPhotos.length} photos`);
});

if (productsWithPhotos.length >= 8 && productsWithPhotos.length <= 12) {
  console.log(`✓ Curated Looks Check Photos PASSED! Exactly ${productsWithPhotos.length} curated products have featuredPhotos (target 8-12).`);
} else {
  console.error(`❌ Curated photos count mismatch: expected 8-12, got ${productsWithPhotos.length}`);
  process.exit(1);
}

// 4. Confidence Distribution Check (Tier 2 skews lower confidence than Tier 1)
console.log('\n--- 4. Confidence Distribution Comparison (Tier 1 vs Tier 2) ---');
const tier1Products = allProducts.filter(p => ['Women', 'Men', 'Kids', 'Footwear'].includes(p.department));
const tier2Products = allProducts.filter(p => ['Beauty', 'Accessories', 'HomeLiving'].includes(p.department));

const tier1HighConfCount = tier1Products.filter(p => getQuickCheckData(p.id).fit.confidence === 'high').length;
const tier2HighConfCount = tier2Products.filter(p => getQuickCheckData(p.id).fit.confidence === 'high').length;

const tier1HighPct = ((tier1HighConfCount / tier1Products.length) * 100).toFixed(1);
const tier2HighPct = ((tier2HighConfCount / tier2Products.length) * 100).toFixed(1);

console.log(`Tier 1 Fit High Confidence: ${tier1HighConfCount}/${tier1Products.length} (${tier1HighPct}%)`);
console.log(`Tier 2 Fit High Confidence: ${tier2HighConfCount}/${tier2Products.length} (${tier2HighPct}%)`);

if (Number(tier2HighPct) < Number(tier1HighPct)) {
  console.log(`✓ Tier 2 Honesty Rule PASSED! Tier 2 shows a visibly lower average fit confidence (${tier2HighPct}%) than Tier 1 (${tier1HighPct}%).`);
} else {
  console.error('❌ Tier 2 confidence is not lower than Tier 1!');
  process.exit(1);
}

console.log('\n🎉 ALL PHASE 2 CHECKPOINTS PASSED SUCCESSFULLY!');
