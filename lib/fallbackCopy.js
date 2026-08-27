/**
 * lib/fallbackCopy.js
 * Hand-written fallback copy generators per architecture.md §9
 * Factual direct statements — ZERO "buyers say" or third-party attribution
 */

export function getFitFallbackWhy(fitEntry, size, garmentType) {
  if (!fitEntry) {
    return 'Check the size chart before you buy.';
  }

  if (fitEntry.status === 'true') {
    return `Fits just right in ${size || 'this size'} — no adjustments needed.`;
  }

  if (fitEntry.sizeAccuracy === 'small') {
    return `Runs a little small in ${size || 'this size'} — go half a size up.`;
  }

  if (fitEntry.sizeAccuracy === 'large') {
    return `Runs a little large in ${size || 'this size'} — go half a size down.`;
  }

  if (fitEntry.top && fitEntry.bottom) {
    return `Runs loose on top (${fitEntry.top.zone}), short on the bottoms (${fitEntry.bottom.zone}).`;
  }

  if (fitEntry.direction === 'loose' || fitEntry.direction === 'large') {
    return `Runs loose at the ${fitEntry.zone || 'garment'}. Consider sizing down for a closer fit.`;
  }

  if (fitEntry.direction === 'snug' || fitEntry.direction === 'small' || fitEntry.direction === 'short') {
    return `Runs snug at the ${fitEntry.zone || 'garment'}. Consider sizing up for more room.`;
  }

  return `Fits just right in ${size || 'this size'}.`;
}

export function getLooksFallbackWhy(looks, department) {
  if (!looks || looks.confidence === 'low') {
    return 'Not enough photos yet for this item.';
  }

  if (looks.attribute === 'none' || looks.direction === 'match') {
    return 'Matches the listing photos closely.';
  }

  if (looks.attribute === 'fabric' && looks.direction === 'lighter') {
    return 'Fabric reads a shade lighter than photos.';
  }

  if (looks.attribute === 'colour' && looks.direction === 'warmer') {
    return 'Colour looks slightly warmer than shown.';
  }

  if (looks.attribute === 'print' && looks.direction === 'smaller') {
    return 'Print runs a bit smaller than the listing photo.';
  }

  if (looks.attribute === 'shade' && looks.direction === 'deeper') {
    return 'Shade runs deeper in person than in the photo.';
  }

  if (looks.attribute === 'material') {
    return 'Material texture felt slightly different from the listing photos.';
  }

  return 'Matches the listing photos closely.';
}

export function getWorthFallbackWhy(worth) {
  if (!worth || !worth.why) {
    return 'Best price we found for this style.';
  }
  return worth.why;
}
