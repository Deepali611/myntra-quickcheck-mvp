import { getProduct, getAllProducts } from './catalog.js';
import { getApplicableChecks } from './categoryAdapters.js';
import { getWorthItComparison } from './worthItComparison.js';

// 8-12 designated products with curated featuredPhotos (architecture.md §7)
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
 * Deterministic Quick Check data generator per product id (Corrected spec per architecture.md §5)
 */
export function getQuickCheckData(productId) {
  const product = typeof productId === 'object' ? productId : getProduct(productId);
  if (!product) return null;

  const availableChecks = getApplicableChecks(product.department, product.subcategory);
  const hash = hashString(product.id);

  const data = {
    productId: product.id,
    department: product.department,
    availableChecks: availableChecks
  };

  // 1. FIT CHECK (Indexed by size — Apparel/Footwear only; absent if not in availableChecks)
  if (availableChecks.includes('fit')) {
    const fitData = {};
    const sizes = product.sizes && product.sizes.length > 0 
      ? product.sizes 
      : (product.department === 'Footwear' ? ['6', '7', '8', '9', '10', '11'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

    sizes.forEach((size, idx) => {
      // Small sizes are true to size; larger sizes get directional flags
      if (idx < 3) {
        fitData[size] = { status: 'true' };
      } else if (product.department === 'Footwear') {
        fitData[size] = (idx % 2 === 0) 
          ? { sizeAccuracy: 'small', width: 'true' }
          : { sizeAccuracy: 'large', width: 'true' };
      } else if (product.garmentType === 'kurta_set') {
        fitData[size] = {
          top: { direction: 'loose', zone: 'chest' },
          bottom: { direction: 'short', zone: 'length' }
        };
      } else if (['top', 'shirt', 'tshirt'].includes(product.garmentType)) {
        fitData[size] = { direction: (hash % 2 === 0 ? 'loose' : 'snug'), zone: 'chest' };
      } else if (['pants', 'jeans'].includes(product.garmentType)) {
        fitData[size] = { direction: 'snug', zone: 'waist' };
      } else if (product.garmentType === 'dress') {
        fitData[size] = { direction: 'loose', zone: 'length' };
      } else {
        fitData[size] = { direction: 'snug', zone: 'chest' };
      }
    });

    data.fit = fitData;
  }

  // 2. LOOKS CHECK (Absent if not in availableChecks)
  if (availableChecks.includes('looks')) {
    const isCurated = CURATED_LOOKS_PRODUCT_IDS.has(product.id);
    const looksConfidence = isCurated ? 'high' : 'low';
    
    let attribute = 'none';
    let direction = 'match';

    if (isCurated) {
      if (product.department === 'Beauty') {
        attribute = 'shade';
        direction = (hash % 2 === 0) ? 'deeper' : 'match';
      } else if (product.department === 'Accessories' || product.department === 'HomeLiving') {
        attribute = 'material';
        direction = (hash % 2 === 0) ? 'lighter' : 'match';
      } else {
        attribute = (hash % 3 === 0) ? 'fabric' : ((hash % 3 === 1) ? 'colour' : 'print');
        direction = (hash % 2 === 0) ? 'lighter' : 'warmer';
      }
    }

    data.looks = {
      attribute: attribute,
      direction: direction,
      confidence: looksConfidence,
      featuredPhotos: isCurated ? [
        { url: product.image, label: 'as_shown' },
        { url: product.image, label: 'as_worn' }
      ] : []
    };
  }

  // 3. WORTH IT ALGORITHM (Absent if not in availableChecks)
  if (availableChecks.includes('worth')) {
    data.worth = getWorthItComparison(product, getAllProducts());
  }

  return data;
}
