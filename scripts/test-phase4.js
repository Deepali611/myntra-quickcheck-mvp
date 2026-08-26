import { appReducer, loadInitialState } from '../state/reducer.js';
import { buildSeedWishlist, isWishlistEligible } from '../data/seedWishlist.js';
import { getProduct } from '../lib/catalog.js';

console.log('=== Phase 4 Verification Suite — State Management ===\n');

// 1. Seeded Wishlist Split Verification
console.log('--- 1. Seeded Wishlist Split Check ---');
const seedItems = buildSeedWishlist();
console.log(`Total seeded wishlist items: ${seedItems.length}`);

let eligibleCount = 0;
let ineligibleCount = 0;
let tier2Count = 0;

seedItems.forEach(item => {
  const eligible = isWishlistEligible(item);
  if (eligible) eligibleCount++;
  else ineligibleCount++;

  if (['Beauty', 'Accessories', 'HomeLiving'].includes(item.product.department)) {
    tier2Count++;
  }

  console.log(`[${item.productId}] ${item.product.department.padEnd(12)} | ${item.product.name.padEnd(28)} | Age: ${item.addedAt.split('T')[0]} | Views: ${item.viewCount} | Eligible: ${eligible ? 'YES' : 'NO (Locked)'}`);
});

console.log(`\nEligible items: ${eligibleCount} | Ineligible items: ${ineligibleCount} | Tier 2 items: ${tier2Count}`);

if (eligibleCount >= 8 && ineligibleCount >= 2 && tier2Count >= 1) {
  console.log('✓ Seeded wishlist split PASSED! Correct split between eligible and ineligible items, including Tier 2 products.');
} else {
  console.error('❌ Seeded wishlist split failed validation!');
  process.exit(1);
}

// 2. Headless Reducer State Transitions Test
console.log('\n--- 2. Headless Reducer State Transitions Test ---');
let state = loadInitialState();
console.log(`Initial state wishlist size: ${state.wishlist.length}, bag size: ${state.bag.length}`);

// Test Action A: Add new item to wishlist
const initialWishlistCount = state.wishlist.length;
state = appReducer(state, { type: 'ADD_TO_WISHLIST', productId: 'w40' });
console.log(`[ADD_TO_WISHLIST w40] Wishlist size: ${state.wishlist.length}`);
if (state.wishlist.length !== initialWishlistCount + 1 || state.wishlist[0].productId !== 'w40') {
  console.error('❌ ADD_TO_WISHLIST failed!');
  process.exit(1);
}

// Test Action B: Duplicate add to wishlist (No-op)
state = appReducer(state, { type: 'ADD_TO_WISHLIST', productId: 'w40' });
console.log(`[ADD_TO_WISHLIST Duplicate w40] Wishlist size (no-op check): ${state.wishlist.length}`);
if (state.wishlist.length !== initialWishlistCount + 1) {
  console.error('❌ Duplicate add should be no-op!');
  process.exit(1);
}

// Test Action C: Remove item from wishlist
state = appReducer(state, { type: 'REMOVE_FROM_WISHLIST', productId: 'w40' });
console.log(`[REMOVE_FROM_WISHLIST w40] Wishlist size: ${state.wishlist.length}`);
if (state.wishlist.length !== initialWishlistCount) {
  console.error('❌ REMOVE_FROM_WISHLIST failed!');
  process.exit(1);
}

// Test Action D: Add to Bag with inferred size
state = appReducer(state, { type: 'ADD_TO_BAG', productId: 'w1', quantity: 1 });
console.log(`[ADD_TO_BAG w1] Bag size: ${state.bag.length}, Size: "${state.bag[0].selectedSize}", Qty: ${state.bag[0].quantity}`);
if (state.bag.length !== 1 || state.bag[0].selectedSize !== 'M') {
  console.error('❌ ADD_TO_BAG size inference failed!');
  process.exit(1);
}

// Test Action E: Update Bag Quantity stepper safety
const bagItemId = state.bag[0].id;
state = appReducer(state, { type: 'UPDATE_BAG_QUANTITY', bagItemId, quantity: 3 });
console.log(`[UPDATE_BAG_QUANTITY -> 3] Qty: ${state.bag[0].quantity}`);
if (state.bag[0].quantity !== 3) {
  console.error('❌ UPDATE_BAG_QUANTITY failed!');
  process.exit(1);
}

state = appReducer(state, { type: 'UPDATE_BAG_QUANTITY', bagItemId, quantity: 0 });
console.log(`[UPDATE_BAG_QUANTITY -> 0 (Stepper Safety Check)] Qty: ${state.bag[0].quantity}`);
if (state.bag[0].quantity !== 1) {
  console.error('❌ Stepper safety failed! Quantity dropped below 1.');
  process.exit(1);
}

// Test Action F: Cache AI why-line
state = appReducer(state, { type: 'SET_CACHED_WHY_LINE', productId: 'w1', checkType: 'fit', whyLine: 'Most buyers said the chest felt snug.' });
console.log(`[SET_CACHED_WHY_LINE] Cached string: "${state.cachedWhyLines['w1_fit']}"`);
if (state.cachedWhyLines['w1_fit'] !== 'Most buyers said the chest felt snug.') {
  console.error('❌ SET_CACHED_WHY_LINE failed!');
  process.exit(1);
}

console.log('✓ Headless reducer state transitions PASSED!');

// 3. Storage Blocked / Corrupt Fallback Test
console.log('\n--- 3. Storage Blocked & Corrupted Fallback Test ---');

// Mock window.sessionStorage throwing error (Private Browsing / Blocked)
global.window = {
  sessionStorage: {
    getItem: () => { throw new Error('SecurityError: Access is denied for sessionStorage'); }
  }
};

let fallbackState = loadInitialState();
console.log(`[Blocked Storage Fallback] Wishlist size: ${fallbackState.wishlist.length}, Bag size: ${fallbackState.bag.length}`);
if (!fallbackState || fallbackState.wishlist.length === 0) {
  console.error('❌ Blocked storage fallback failed!');
  process.exit(1);
}

// Mock corrupt JSON
global.window.sessionStorage.getItem = () => '{ corrupt_json_data...';
fallbackState = loadInitialState();
console.log(`[Corrupt Storage Fallback] Wishlist size: ${fallbackState.wishlist.length}, Bag size: ${fallbackState.bag.length}`);
if (!fallbackState || fallbackState.wishlist.length === 0) {
  console.error('❌ Corrupt storage fallback failed!');
  process.exit(1);
}

delete global.window;
console.log('✓ Storage blocked & corrupt fallback PASSED! App gracefully falls back to seed wishlist without crashing.');

console.log('\n🎉 ALL PHASE 4 CHECKPOINTS PASSED SUCCESSFULLY!');
