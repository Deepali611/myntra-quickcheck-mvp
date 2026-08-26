import { getProduct } from './catalog.js';
import { getAdapter } from './categoryAdapters.js';

// Designated 10 Tier 1 curated Looks Check products per architecture.md §7
const CURATED_LOOKS_PRODUCT_IDS = new Set(['w1', 'w2', 'w15', 'm1', 'm5', 'm20', 'k1', 'k10', 'f1', 'f5']);

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic Quick Check data generator per product id
 */
export function getQuickCheckData(productId) {
  const product = typeof productId === 'object' ? productId : getProduct(productId);
  if (!product) return null;

  const adapter = getAdapter(product.department, product.subcategory, product.garmentType);
  const hash = hashString(product.id);

  // 1. FIT CHECK
  let fitApplicable = adapter.fitApplicable;
  let fitConfidence = 'low';
  let fitDirection = null;
  let flaggedZone = null;

  if (fitApplicable) {
    const isTier2 = adapter.tier === 'extended';
    const confVal = hash % 100;
    
    // Tier 1: ~70% high confidence, Tier 2: ~30% high confidence (honesty rule §5a)
    if (isTier2) {
      fitConfidence = confVal < 30 ? 'high' : 'low';
    } else {
      fitConfidence = confVal < 70 ? 'high' : 'low';
    }

    if (fitConfidence === 'high') {
      const dirVal = (hash >> 3) % 3;
      fitDirection = dirVal === 0 ? 'true' : (dirVal === 1 ? 'small' : 'large');

      if (adapter.fitVocabulary.length > 0) {
        const zoneIdx = (hash >> 5) % adapter.fitVocabulary.length;
        flaggedZone = adapter.fitVocabulary[zoneIdx];
      }
    }
  } else {
    fitConfidence = 'low';
  }

  // 2. LOOKS CHECK
  let looksConfidence = 'low';
  let flaggedAttribute = null;
  let featuredPhotos = [];

  const isCuratedProduct = CURATED_LOOKS_PRODUCT_IDS.has(product.id);

  if (isCuratedProduct) {
    looksConfidence = 'high';
    const attrIdx = (hash >> 7) % adapter.looksVocabulary.length;
    flaggedAttribute = (hash % 2 === 0) ? null : adapter.looksVocabulary[attrIdx];
    
    featuredPhotos = [
      { url: product.image, label: 'as_shown' },
      { url: product.image, label: 'as_worn' },
      { url: product.image, label: 'buyer_photo' }
    ];
  } else {
    looksConfidence = 'low';
    flaggedAttribute = null;
    featuredPhotos = [];
  }

  // 3. WORTH IT PLACEHOLDER (Phase 3 builds full algorithm)
  const worth = {
    hasAlternative: false,
    alternativeId: null,
    reasonType: null,
    reasonValue: null
  };

  return {
    productId: product.id,
    department: product.department,
    quickCheckTier: adapter.tier,
    adapter: adapter,
    fit: {
      applicable: fitApplicable,
      flaggedZone: flaggedZone,
      direction: fitDirection,
      confidence: fitConfidence
    },
    looks: {
      flaggedAttribute: flaggedAttribute,
      confidence: looksConfidence,
      featuredPhotos: featuredPhotos
    },
    worth: worth
  };
}
