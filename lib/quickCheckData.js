import { getProduct, getAllProducts } from './catalog.js';
import { getApplicableChecks } from './categoryAdapters.js';
import { getWorthItComparison } from './worthItComparison.js';

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic Quick Check data generator per product id (Per quick-check-remaining-build.md Phase 10c)
 */
export function getQuickCheckData(productId) {
  const product = typeof productId === 'object' ? productId : getProduct(productId);
  if (!product) return null;

  const availableChecks = getApplicableChecks(product.department, product.subcategory);
  const hash = hashString(product.id || 'p1');

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
      // Last size (e.g. XXL / UK11) intentionally left undefined as honest fallback case per Phase 10b
      if (idx === sizes.length - 1) {
        return;
      }

      if (idx < 2) {
        fitData[size] = { status: 'true' };
      } else if (product.department === 'Footwear') {
        fitData[size] = (idx % 2 === 0) 
          ? { sizeAccuracy: 'small', width: 'true' }
          : { sizeAccuracy: 'large', width: 'true' };
      } else if (product.garmentType === 'kurta_set' || product.department === 'Women') {
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

  // 2. LOOKS CHECK (Per Phase 10c table — generated from attribute & direction)
  if (availableChecks.includes('looks')) {
    let attribute = 'none';
    let direction = 'match';

    if (product.department === 'Beauty') {
      attribute = 'shade';
      direction = 'deeper';
    } else if (product.department === 'Accessories' || product.department === 'HomeLiving') {
      attribute = 'material';
      direction = 'lighter';
    } else if (hash % 3 === 0) {
      attribute = 'fabric';
      direction = 'lighter';
    } else if (hash % 3 === 1) {
      attribute = 'colour';
      direction = 'warmer';
    } else {
      attribute = 'print';
      direction = 'smaller';
    }

    data.looks = {
      attribute: attribute,
      direction: direction,
      confidence: 'high',
      featuredPhotos: [
        { url: product.image, label: 'as_shown' },
        { url: product.image, label: 'as_worn' }
      ]
    };
  }

  // 3. WORTH IT ALGORITHM (Absent if not in availableChecks)
  if (availableChecks.includes('worth')) {
    data.worth = getWorthItComparison(product, getAllProducts());
  }

  return data;
}
