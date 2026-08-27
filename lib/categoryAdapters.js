/**
 * lib/categoryAdapters.js
 * Department & subcategory to applicable checks & Layer-4 mapping per architecture.md §5a (NEW SPEC)
 */

export function getApplicableChecks(department = 'Women', subcategory = '') {
  const dept = department ? department.trim() : 'Women';
  const subcat = subcategory ? subcategory.toLowerCase() : '';

  if (['Women', 'Men', 'Kids', 'Footwear'].includes(dept)) {
    return ['fit', 'looks', 'worth'];
  }

  if (dept === 'Beauty') {
    // Skincare (serum, cream, moisturizer, shampoo) gets Worth It only
    if (subcat.includes('serum') || subcat.includes('cream') || subcat.includes('moisturizer') || subcat.includes('shampoo')) {
      return ['worth'];
    }
    // Colour cosmetics (lipstick, foundation, shade products) get Looks + Worth
    return ['looks', 'worth'];
  }

  if (dept === 'Accessories' || dept === 'HomeLiving' || dept === 'Home & Living') {
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
