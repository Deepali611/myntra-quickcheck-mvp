'use client';

import React from 'react';
import { FitIcon } from './Icons.jsx';

export default function FitCheckCard({ product, data, selectedSize, onSelectSize, onOpenLayer4, onAddToBag }) {
  const isFootwear = product?.department === 'Footwear';

  const sizes = product?.sizes && product.sizes.length > 0 
    ? product.sizes 
    : (isFootwear ? ['6', '7', '8', '9', '10', '11'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  const currentFit = data?.fit ? data.fit[selectedSize] : null;

  // Multi-dimensional Phase 10b Copy Mapping
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
        headline: isFootwear ? `True to size in UK ${selectedSize}` : `True to size in ${selectedSize}`,
        subline: `Fits just right — no adjustments needed.`,
        isFallback: false,
        flaggedZone: null
      };
    }

    // 3. Multi-dimensional Headline
    if (currentFit.headline) {
      return {
        headline: currentFit.headline,
        subline: isFootwear ? `Standard width profile with ${currentFit.width || 'comfortable'} fit.` : `Consider adjusting size for ${currentFit.zone || 'your preference'}.`,
        isFallback: false,
        flaggedZone: currentFit.zone || 'fit'
      };
    }

    // 4. Footwear Flagged Case
    if (isFootwear) {
      const isSmall = currentFit.sizeAccuracy === 'small';
      const sev = currentFit.severity || 'a little';
      return {
        headline: isSmall ? `Runs ${sev} small — go half a size up` : `Runs ${sev} large — go half a size down`,
        subline: `Standard width profile with ${isSmall ? 'snug' : 'relaxed'} toe box.`,
        isFallback: false,
        flaggedZone: 'footwear_fit'
      };
    }

    // 5. Apparel Multi-piece / Single-piece Flagged Case
    if (currentFit.top && currentFit.bottom) {
      const sev = currentFit.top.severity || 'a little';
      return {
        headline: `Runs ${sev} ${currentFit.top.direction} on top, ${currentFit.bottom.direction} on the bottoms`,
        subline: `Consider sizing down on top and a longer inseam if available.`,
        isFallback: false,
        flaggedZone: 'chest & length'
      };
    }

    if (currentFit.direction && currentFit.zone) {
      const sev = currentFit.severity || 'a little';
      return {
        headline: `Runs ${sev} ${currentFit.direction} at ${currentFit.zone}`,
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
                  padding: '7px 14px',
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
        border: copyInfo.isFallback ? '1px solid #d4d5d9' : '1px solid #ffd8e0', 
        borderRadius: '14px', 
        padding: '16px' 
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: copyInfo.isFallback ? '#94969f' : '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Size {selectedSize} Verdict
        </div>
        <div style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', marginBottom: '4px' }}>
          {copyInfo.headline}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4' }}>
          {copyInfo.subline}
        </div>

        {/* Zone-Scoped Fit Slider Visual */}
        {!copyInfo.isFallback && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #eaeaec' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94969f', fontWeight: '600', marginBottom: '6px' }}>
              <span>{isFootwear ? 'Runs Small' : 'Tight / Snug'}</span>
              <span style={{ color: '#ff3f6c', fontWeight: '700', textTransform: 'uppercase' }}>
                {isFootwear ? 'Standard Width' : (copyInfo.flaggedZone ? copyInfo.flaggedZone : 'True Fit')}
              </span>
              <span>{isFootwear ? 'Runs Large' : 'Loose / Relaxed'}</span>
            </div>
            <div style={{ position: 'relative', height: '6px', backgroundColor: '#eaeaec', borderRadius: '3px' }}>
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  left: copyInfo.headline.includes('loose') || copyInfo.headline.includes('large') 
                    ? '80%' 
                    : (copyInfo.headline.includes('small') || copyInfo.headline.includes('short') ? '20%' : '50%'),
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

      {/* Measurement Chart Launcher */}
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
          <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: '#fff0f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FitIcon size={16} color="#ff3f6c" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>View Size & Fit Measurement Chart</div>
            <div style={{ fontSize: '11px', color: '#94969f' }}>Garment dimensions and measurement guide</div>
          </div>
        </div>
        <span style={{ fontSize: '13px', color: '#ff3f6c', fontWeight: '700' }}>View ›</span>
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
          boxShadow: '0 4px 12px rgba(255, 63, 108, 0.35)'
        }}
      >
        ADD TO BAG — SIZE {selectedSize}
      </button>
    </div>
  );
}

