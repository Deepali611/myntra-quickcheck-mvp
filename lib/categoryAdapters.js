/**
 * lib/categoryAdapters.js
 * Department & subcategory check applicability & Layer-4 mapping per architecture.md §5a (NEW SPEC)
 * No more Tier 1 / Tier 2 adapter objects returned.
 */

export function getApplicableChecks(productOrDept = 'Women', maybeSubcat = '') {
  let dept = 'Women';
  let subcat = '';

  if (typeof productOrDept === 'object' && productOrDept !== null) {
    dept = productOrDept.department || 'Women';
    subcat = productOrDept.subcategory || productOrDept.category || '';
  } else {
    dept = productOrDept || 'Women';
    subcat = maybeSubcat || '';
  }

  dept = dept.trim();
  subcat = subcat.toLowerCase();

  // 1. Fashion (apparel) & Footwear -> Fit, Looks, Worth It
  if (['Women', 'Men', 'Kids', 'Footwear'].includes(dept)) {
    return ['fit', 'looks', 'worth'];
  }

  // 2. Beauty
  if (dept === 'Beauty') {
    // Skincare (serum, cream, moisturizer, lotion, sunscreen, cleanser, shampoo, face wash) -> Worth It ONLY
    const isSkincare = subcat.includes('serum') || 
                       subcat.includes('cream') || 
                       subcat.includes('moisturizer') || 
                       subcat.includes('lotion') || 
                       subcat.includes('sunscreen') || 
                       subcat.includes('cleanser') || 
                       subcat.includes('shampoo') || 
                       subcat.includes('facewash') || 
                       subcat.includes('skincare');
    if (isSkincare) {
      return ['worth'];
    }
    // Colour cosmetics (lipstick, foundation, compact, nail, eyeshadow, etc.) -> Looks (shade) + Worth It
    return ['looks', 'worth'];
  }

  // 3. Home & Living -> Looks (colour/print) + Worth It
  if (dept === 'HomeLiving' || dept === 'Home & Living' || dept === 'Home') {
    return ['looks', 'worth'];
  }

  // 4. Accessories -> Looks (colour/material) + Worth It
  if (dept === 'Accessories') {
    return ['looks', 'worth'];
  }

  return ['worth'];
}

export function getLayer4Type(check, department = 'Women') {
  const dept = department ? department.trim() : 'Women';

  if (check === 'fit') {
    if (['Women', 'Men', 'Kids', 'Footwear'].includes(dept)) {
      return 'size_chart';
    }
    return 'none';
  }

  if (check === 'looks') {
    if (['Women', 'Men', 'Kids', 'Footwear'].includes(dept)) {
      return 'photo_viewer';
    }
    if (dept === 'Beauty') {
      return 'swatch_viewer';
    }
    return 'material_viewer'; // HomeLiving, Accessories
  }

  if (check === 'worth') {
    return 'unit_price_info';
  }

  return 'none';
}

export function getGarmentZones(garmentType = null) {
  if (['top', 'shirt', 'tshirt'].includes(garmentType)) {
    return ['chest', 'shoulder', 'sleeve'];
  }
  if (['pants', 'jeans'].includes(garmentType)) {
    return ['waist', 'length', 'hip'];
  }
  if (garmentType === 'dress') {
    return ['bust', 'waist', 'length'];
  }
  if (garmentType === 'kidswear') {
    return ['chest', 'length'];
  }
  if (garmentType === 'kurta_set') {
    return { top: ['chest', 'shoulder'], bottom: ['length', 'waist'] };
  }
  return [];
}
