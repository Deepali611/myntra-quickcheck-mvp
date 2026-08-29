'use client';

import React from 'react';

export default function FitCheckCard({ product, data, selectedSize, onSelectSize, onOpenLayer4, onAddToBag }) {
  const isFootwear = product?.department === 'Footwear';

  const sizes = product?.sizes && product.sizes.length > 0 
    ? product.sizes 
    : (isFootwear ? ['6', '7', '8', '9', '10', '11'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  const currentFit = data?.fit ? data.fit[selectedSize] : null;

  // Exact Phase 10b Copy Mapping
  const getCopy = () => {
    // 1. Fallback Case (no data for that size)
    if (!currentFit) {
      return {
        headline: `Not enough to say for ${selectedSize} yet`,
        subline: `Check the size chart before you buy.`,
        isFallback: true,
        flaggedZone: null
      };
    }

    // 2. True to Size Case
    if (currentFit.status === 'true') {
      return {
        headline: `True to size in ${selectedSize}`,
        subline: `Fits just right — no adjustments needed.`,
        isFallback: false,
        flaggedZone: null
      };
    }

    // 3. Footwear Flagged Case
    if (isFootwear) {
      const isSmall = currentFit.sizeAccuracy === 'small';
      return {
        headline: isSmall ? `Runs a little small — go half a size up` : `Runs a little large — consider sizing down`,
        subline: `Size accuracy: ${currentFit.sizeAccuracy} | Width: ${currentFit.width === 'true' ? 'Standard' : 'Wide'}`,
        isFallback: false,
        flaggedZone: 'footwear_length'
      };
    }

    // 4. Apparel Multi-piece / Single-piece Flagged Case
    if (currentFit.top && currentFit.bottom) {
      return {
        headline: `Runs ${currentFit.top.direction} on top, ${currentFit.bottom.direction} on the bottoms`,
        subline: `Consider sizing down on top and a longer inseam if available.`,
        isFallback: false,
        flaggedZone: 'top_chest'
      };
    }

    if (currentFit.direction && currentFit.zone) {
      return {
        headline: `Runs ${currentFit.direction} at ${currentFit.zone}`,
        subline: `Adjust size for ${currentFit.zone} fit preference.`,
        isFallback: false,
        flaggedZone: currentFit.zone
      };
    }

    return {
      headline: `True to size in ${selectedSize}`,
      subline: `Fits just right — no adjustments needed.`,
      isFallback: false,
      flaggedZone: null
    };
  };

  const copyInfo = getCopy();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Size Selector Chips */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94969f', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          Select Size ({isFootwear ? 'UK Size' : 'Garment Size'}):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {sizes.map(sz => {
            const isSelected = sz === selectedSize;
            return (
              <button
                key={sz}
                onClick={() => onSelectSize(sz)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: isSelected ? '1.5px solid #ff3f6c' : '1px solid #eaeaec',
                  backgroundColor: isSelected ? '#fff0f3' : '#ffffff',
                  color: isSelected ? '#ff3f6c' : '#282c3f',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fit Verdict Card */}
      <div style={{ 
        backgroundColor: copyInfo.isFallback ? '#f5f5f6' : '#f9f9fa', 
        border: copyInfo.isFallback ? '1px solid #d4d5d9' : '1px solid #eaeaec', 
        borderRadius: '14px', 
        padding: '16px' 
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: copyInfo.isFallback ? '#94969f' : '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Size {selectedSize} Fit Verdict
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f', marginBottom: '6px' }}>
          {copyInfo.headline}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4' }}>
          {copyInfo.subline}
        </div>

        {/* Zone-Scoped Fit Slider Visual */}
        {!copyInfo.isFallback && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #eaeaec' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94969f', fontWeight: '600', marginBottom: '4px' }}>
              <span>{isFootwear ? 'Tight / Small' : 'Snug / Tight'}</span>
              <span style={{ color: '#ff3f6c', fontWeight: '700' }}>
                {isFootwear ? 'Standard Width' : (copyInfo.flaggedZone ? copyInfo.flaggedZone.toUpperCase() : 'IDEAL')}
              </span>
              <span>{isFootwear ? 'Loose / Large' : 'Loose / Long'}</span>
            </div>
            <div style={{ position: 'relative', height: '6px', backgroundColor: '#eaeaec', borderRadius: '3px' }}>
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  left: copyInfo.headline.includes('loose') || copyInfo.headline.includes('large') ? '80%' : (copyInfo.headline.includes('small') || copyInfo.headline.includes('short') ? '20%' : '50%'),
                  transform: 'translateX(-50%)',
                  width: '14px', 
                  height: '14px', 
                  backgroundColor: '#ff3f6c', 
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Tappable Visual & Layer 4 launcher */}
      <div 
        onClick={onOpenLayer4}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          border: '1px solid #eaeaec',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>📐</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>View Size & Fit Measurement Chart</div>
            <div style={{ fontSize: '11px', color: '#94969f' }}>Chest, waist & length specifications</div>
          </div>
        </div>
        <span style={{ fontSize: '16px', color: '#ff3f6c', fontWeight: 'bold' }}>View ›</span>
      </div>

      {/* Action Button: Carries Selected Size */}
      <button
        onClick={onAddToBag}
        style={{
          width: '100%',
          backgroundColor: '#ff3f6c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '24px',
          padding: '14px',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          cursor: 'pointer',
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(255, 63, 108, 0.3)'
        }}
      >
        ADD TO BAG — SIZE {selectedSize}
      </button>
    </div>
  );
}
