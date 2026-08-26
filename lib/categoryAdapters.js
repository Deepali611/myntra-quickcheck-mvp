/**
 * lib/categoryAdapters.js
 * Department to vocabulary & Layer-4 mapping per architecture.md §5a
 */

export function getAdapter(department, subcategory = '', garmentType = null) {
  const dept = department ? department.trim() : 'Women';
  const subcat = subcategory ? subcategory.toLowerCase() : '';

  if (['Women', 'Men', 'Kids'].includes(dept)) {
    let fitVocab = [];
    if (['top', 'shirt', 'tshirt', 'kurta_set'].includes(garmentType)) {
      fitVocab = ['chest', 'shoulder', 'sleeve'];
    } else if (['pants', 'jeans'].includes(garmentType)) {
      fitVocab = ['waist', 'length', 'hip'];
    } else if (garmentType === 'dress') {
      fitVocab = ['bust', 'waist', 'length'];
    } else if (garmentType === 'kidswear') {
      fitVocab = ['chest', 'length'];
    } else {
      // saree or null -> whole garment true/small/large
      fitVocab = [];
    }

    return {
      department: dept,
      tier: 'full',
      fitApplicable: true,
      fitMeaning: 'Size/fit zone',
      fitVocabulary: fitVocab,
      looksMeaning: 'Photo/fabric accuracy',
      looksVocabulary: ['colour', 'fabric', 'print', 'fit_in_photo'],
      layer4FitType: 'size_chart',
      layer4LooksType: 'photo_viewer'
    };
  }

  if (dept === 'Footwear') {
    return {
      department: dept,
      tier: 'full',
      fitApplicable: true,
      fitMeaning: 'Size/comfort',
      fitVocabulary: [], // whole-shoe small/true/large
      looksMeaning: 'Material/construction vs. photos',
      looksVocabulary: ['colour', 'material', 'sole_feel'],
      layer4FitType: 'size_chart',
      layer4LooksType: 'photo_viewer'
    };
  }

  if (dept === 'Beauty') {
    return {
      department: dept,
      tier: 'extended',
      fitApplicable: true,
      fitMeaning: 'Suitability for skin tone/type',
      fitVocabulary: ['shade_match', 'skin_type_fit'],
      looksMeaning: 'Texture/finish/wear-through-day',
      looksVocabulary: ['texture', 'finish', 'longevity'],
      layer4FitType: 'shade_finder',
      layer4LooksType: 'swatch_viewer'
    };
  }

  if (dept === 'Accessories') {
    const isBag = subcat.includes('bag') || subcat.includes('handbag') || subcat.includes('tote');
    return {
      department: dept,
      tier: 'extended',
      fitApplicable: isBag,
      fitMeaning: isBag ? 'Capacity/use-fit' : 'Style/use-fit',
      fitVocabulary: isBag ? ['capacity'] : [],
      looksMeaning: 'Material/finish quality',
      looksVocabulary: ['material', 'finish', 'hardware', 'plating'],
      layer4FitType: isBag ? 'capacity_guide' : 'none',
      layer4LooksType: 'material_viewer'
    };
  }

  if (dept === 'HomeLiving' || dept === 'Home & Living') {
    return {
      department: 'HomeLiving',
      tier: 'extended',
      fitApplicable: true,
      fitMeaning: 'Size/space fit',
      fitVocabulary: ['space_fit'],
      looksMeaning: 'Material/finish/durability',
      looksVocabulary: ['material', 'finish', 'texture'],
      layer4FitType: 'space_calculator',
      layer4LooksType: 'material_viewer'
    };
  }

  // Generic fallback adapter
  return {
    department: dept,
    tier: 'extended',
    fitApplicable: false,
    fitMeaning: 'Not applicable',
    fitVocabulary: [],
    looksMeaning: 'Photo accuracy',
    looksVocabulary: ['colour', 'material'],
    layer4FitType: 'none',
    layer4LooksType: 'material_viewer'
  };
}
