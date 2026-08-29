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
 * Deterministic Quick Check data generator with wide multi-dimensional combinatorial variety.
 */
export function getQuickCheckData(productId) {
  const product = typeof productId === 'object' ? productId : getProduct(productId);
  if (!product) return null;

  const availableChecks = getApplicableChecks(product);
  const hash = hashString(product.id || 'p1');
  const subcat = (product.subcategory || product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const garmentType = product.garmentType || (subcat.includes('kurta') ? 'kurta_set' : subcat.includes('dress') ? 'dress' : subcat.includes('shoe') || subcat.includes('heel') || subcat.includes('sneaker') || subcat.includes('flat') || subcat.includes('sandal') ? 'footwear' : subcat.includes('jean') ? 'jeans' : subcat.includes('shirt') || subcat.includes('top') || subcat.includes('tshirt') ? 'top' : 'other');

  const data = {
    productId: product.id,
    department: product.department,
    availableChecks: availableChecks
  };

  // 1. FIT CHECK (Multi-dimensional: zone x direction x severity)
  if (availableChecks.includes('fit')) {
    const fitData = {};
    const sizes = product.sizes && product.sizes.length > 0 
      ? product.sizes 
      : (product.department === 'Footwear' || garmentType === 'footwear' ? ['6', '7', '8', '9', '10', '11'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

    sizes.forEach((size, idx) => {
      // Last size intentionally left undefined as honest fallback case per Phase 10b
      if (idx === sizes.length - 1) {
        return;
      }

      // Bit slices for independent variation per size
      const sizeHash = hashString(`${product.id}_${size}_${idx}`);
      const zoneIdx = (sizeHash >> 2) & 7;
      const dirIdx = (sizeHash >> 5) & 1;
      const sevIdx = (sizeHash >> 6) & 1;
      const severity = sevIdx === 0 ? 'a little' : 'noticeably';

      if (product.department === 'Footwear' || garmentType === 'footwear') {
        const isTrue = ((sizeHash >> 1) % 4) === 0;
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const sizeAcc = dirIdx === 0 ? 'small' : 'large';
          const widthProfiles = ['true', 'narrow toe box', 'wide arch', 'snug heel'];
          const widthChoice = widthProfiles[zoneIdx % widthProfiles.length];
          fitData[size] = {
            sizeAccuracy: sizeAcc,
            severity: severity,
            width: widthChoice,
            headline: `Runs ${severity} ${sizeAcc} — ${sizeAcc === 'small' ? 'go half a size up' : 'go half a size down'}`
          };
        }
      } else if (garmentType === 'kurta_set') {
        const isTrue = idx === 0 && (sizeHash % 3 === 0);
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const topZones = ['chest', 'shoulders', 'bust', 'arms'];
          const bottomZones = ['length', 'waist', 'hips', 'ankles'];
          const topDir = dirIdx === 0 ? 'snug' : 'loose';
          const bottomDir = ((sizeHash >> 7) & 1) === 0 ? 'short' : 'long';
          const topZone = topZones[zoneIdx % topZones.length];
          const bottomZone = bottomZones[((sizeHash >> 3) & 3)];

          fitData[size] = {
            top: { direction: topDir, zone: topZone, severity: severity },
            bottom: { direction: bottomDir, zone: bottomZone, severity: severity },
            headline: `Runs ${severity} ${topDir} at ${topZone}, ${bottomDir} in ${bottomZone}`
          };
        }
      } else if (garmentType === 'dress') {
        const isTrue = idx === 0 && (sizeHash % 3 === 0);
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const dressZones = ['bust', 'waist', 'hips', 'hem', 'ribcage', 'shoulders', 'torso', 'length'];
          const dressDirs = ['loose', 'snug', 'long', 'short', 'fitted', 'relaxed'];
          const chosenZone = dressZones[zoneIdx % dressZones.length];
          const chosenDir = dressDirs[(sizeHash >> 4) % dressDirs.length];

          fitData[size] = {
            direction: chosenDir,
            zone: chosenZone,
            severity: severity,
            headline: `Runs ${severity} ${chosenDir} at the ${chosenZone}`
          };
        }
      } else if (garmentType === 'jeans' || garmentType === 'pants' || subcat.includes('trouser')) {
        const isTrue = idx === 0 && (sizeHash % 3 === 0);
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const pantZones = ['waist', 'thighs', 'inseam', 'hips', 'rise', 'calves'];
          const pantDirs = ['snug', 'relaxed', 'long', 'short', 'tight', 'loose'];
          const chosenZone = pantZones[zoneIdx % pantZones.length];
          const chosenDir = pantDirs[(sizeHash >> 4) % pantDirs.length];

          fitData[size] = {
            direction: chosenDir,
            zone: chosenZone,
            severity: severity,
            headline: `Runs ${severity} ${chosenDir} at the ${chosenZone}`
          };
        }
      } else if (garmentType === 'top' || garmentType === 'shirt' || garmentType === 'tshirt') {
        const isTrue = idx === 0 && (sizeHash % 3 === 0);
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const topZones = ['chest', 'shoulders', 'sleeves', 'torso', 'neckline', 'arms'];
          const topDirs = ['snug', 'loose', 'fitted', 'relaxed', 'short', 'long'];
          const chosenZone = topZones[zoneIdx % topZones.length];
          const chosenDir = topDirs[(sizeHash >> 4) % topDirs.length];

          fitData[size] = {
            direction: chosenDir,
            zone: chosenZone,
            severity: severity,
            headline: `Runs ${severity} ${chosenDir} across the ${chosenZone}`
          };
        }
      } else {
        const isTrue = idx === 0 && (sizeHash % 3 === 0);
        if (isTrue) {
          fitData[size] = { status: 'true' };
        } else {
          const genZones = ['fit', 'silhouette', 'proportions', 'length'];
          const genDirs = ['snug', 'loose', 'fitted', 'relaxed'];
          const chosenZone = genZones[zoneIdx % genZones.length];
          const chosenDir = genDirs[(sizeHash >> 4) % genDirs.length];

          fitData[size] = {
            direction: chosenDir,
            zone: chosenZone,
            severity: severity,
            headline: `Runs ${severity} ${chosenDir} in ${chosenZone}`
          };
        }
      }
    });

    data.fit = fitData;
  }

  // 2. LOOKS CHECK (Multi-dimensional: attribute x direction x degree modifier)
  if (availableChecks.includes('looks')) {
    let attribute = 'fabric';
    let direction = 'lighter';
    let headline = 'Fabric reads a shade lighter than photos';

    const lookHash = (hash ^ 0x5bf0387b);
    const attrChoice = (lookHash >> 2) % 6;
    const dirChoice = (lookHash >> 5) % 4;
    const degChoice = (lookHash >> 7) % 3;
    const degrees = ['a shade', 'slightly', 'a bit'];
    const degree = degrees[degChoice];

    if (product.department === 'Beauty') {
      const beautyAttrs = ['shade', 'undertone', 'finish', 'pigment'];
      const beautyDirs = ['deeper', 'lighter', 'warmer', 'richer'];
      attribute = beautyAttrs[attrChoice % beautyAttrs.length];
      direction = beautyDirs[dirChoice % beautyDirs.length];
      headline = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} reads ${degree} ${direction} than digital preview`;
    } else if (product.department === 'Accessories') {
      const accAttrs = ['material finish', 'hardware tone', 'texture', 'colour tone'];
      const accDirs = ['lighter', 'warmer', 'subtler', 'deeper'];
      attribute = accAttrs[attrChoice % accAttrs.length];
      direction = accDirs[dirChoice % accDirs.length];
      headline = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} reads ${degree} ${direction} than photos`;
    } else if (subcat.includes('print') || name.includes('print') || name.includes('polka') || name.includes('floral')) {
      const printAttrs = ['print pattern', 'motif scale', 'contrast', 'print vibrancy'];
      const printDirs = ['finer', 'smaller', 'softer', 'subtler'];
      attribute = printAttrs[attrChoice % printAttrs.length];
      direction = printDirs[dirChoice % printDirs.length];
      headline = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} runs ${degree} ${direction} than the listing photo`;
    } else {
      const fashionAttrs = ['fabric tone', 'colour warmth', 'material finish', 'weave texture', 'drape', 'sheen'];
      const fashionDirs = ['lighter', 'warmer', 'softer', 'crisper', 'deeper', 'subtler'];
      attribute = fashionAttrs[attrChoice % fashionAttrs.length];
      direction = fashionDirs[dirChoice % fashionDirs.length];
      headline = `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} reads ${degree} ${direction} than photos`;
    }

    const customerPhotos = product.customerPhotos || [];
    const asWornUrl = customerPhotos.length > 0 ? customerPhotos[0].url : product.image;

    data.looks = {
      attribute: attribute,
      direction: direction,
      degree: degree,
      headline: headline,
      confidence: 'high',
      asWornImage: asWornUrl,
      customerPhotos: customerPhotos,
      featuredPhotos: customerPhotos.length > 0 
        ? customerPhotos.map(cp => ({ url: cp.url, label: cp.caption, source: cp.source }))
        : [
            { url: product.image, label: 'Studio Capture (As Shown)', source: 'Studio' },
            { url: product.image, label: 'Ambient Light Capture (As Worn)', source: 'Real Lighting' }
          ]
    };
  }

  // 3. WORTH IT (Computed from real catalogue prices and ratings within subcategory)
  if (availableChecks.includes('worth')) {
    data.worth = getWorthItComparison(product, getAllProducts());
  }

  return data;
}
