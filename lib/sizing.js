/**
 * Sizing rules per architecture.md §4
 */

export function getSizes(department, garmentType) {
  if (['Beauty', 'Accessories', 'HomeLiving'].includes(department)) {
    return null;
  }
  if (department === 'Footwear') {
    return ['6', '7', '8', '9', '10', '11'];
  }
  if (department === 'Kids') {
    return ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];
  }
  if (['Women', 'Men'].includes(department)) {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }
  return null;
}

export function inferPreferredSize(bagItems = [], department, garmentType) {
  const validSizes = getSizes(department, garmentType);
  if (!validSizes || validSizes.length === 0) return null;

  // Search bag for items in the same department
  const sizeCounts = {};
  bagItems.forEach(item => {
    if (item.department === department && item.selectedSize) {
      sizeCounts[item.selectedSize] = (sizeCounts[item.selectedSize] || 0) + 1;
    }
  });

  let maxCount = 0;
  let preferred = null;
  Object.keys(sizeCounts).forEach(size => {
    if (sizeCounts[size] > maxCount && validSizes.includes(size)) {
      maxCount = sizeCounts[size];
      preferred = size;
    }
  });

  if (preferred) return preferred;

  // Fallback defaults per architecture.md §4
  if (department === 'Footwear') return '8';
  if (department === 'Kids') return '4-5Y';
  return 'M';
}
