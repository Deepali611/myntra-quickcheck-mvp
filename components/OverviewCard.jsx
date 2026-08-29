'use client';

import React from 'react';

export default function OverviewCard({ product, data, selectedSize, onNavigateCheck, onAddToBag }) {
  if (!product || !data) return null;

  const availableChecks = data.availableChecks || ['worth'];

  // Status label mapping per check
  function getCheckStatusLabel(check) {
    if (check === 'fit') {
      const currentFit = data.fit ? data.fit[selectedSize] : null;
      if (!currentFit) return `Not enough to say for ${selectedSize} yet`;
      if (currentFit.status === 'true') return `True to size in ${selectedSize}`;
      if (currentFit.sizeAccuracy === 'small') return `Runs small in ${selectedSize} — go size up`;
      if (currentFit.sizeAccuracy === 'large') return `Runs large in ${selectedSize} — go size down`;
      if (currentFit.top && currentFit.bottom) {
        return `Runs ${currentFit.top.direction} on top, ${currentFit.bottom.direction} on bottom`;
      }
      if (currentFit.direction && currentFit.zone) {
        return `Runs ${currentFit.direction} at ${currentFit.zone}`;
      }
      return `True to size in ${selectedSize}`;
    }

    if (check === 'looks') {
      const looks = data.looks || {};
      if (looks.confidence === 'low' || looks.attribute === 'none') {
        return 'Matches photos closely';
      }
      if (looks.attribute === 'fabric') {
        return `Fabric reads ${looks.direction} than photos`;
      }
      if (looks.attribute === 'colour') {
        return `Colour looks slightly ${looks.direction} than shown`;
      }
      if (looks.attribute === 'print') {
        return `Print runs a bit ${looks.direction} than photo`;
      }
      if (looks.attribute === 'shade') {
        return `Shade runs ${looks.direction} than shown`;
      }
      if (looks.attribute === 'material') {
        return `Material finish reads ${looks.direction} than photos`;
      }
      return 'Matches photos closely';
    }

    if (check === 'worth') {
      const worth = data.worth || {};
      return worth.headline || 'Good price for this pick';
    }

    return 'Check details';
  }

  // Synthesize multi-check findings into one clean sentence
  function getSynthesisLine() {
    if (availableChecks.length === 1) {
      return getCheckStatusLabel(availableChecks[0]);
    }

    const parts = [];
    if (availableChecks.includes('fit')) {
      const fitLabel = getCheckStatusLabel('fit');
      parts.push(fitLabel);
    }
    if (availableChecks.includes('looks')) {
      const looksLabel = getCheckStatusLabel('looks');
      parts.push(looksLabel);
    }
    if (availableChecks.includes('worth')) {
      const worthLabel = getCheckStatusLabel('worth');
      parts.push(worthLabel);
    }

    return parts.join('; ') + '.';
  }

  const checkConfig = {
    fit: { name: 'Fit Check', icon: '📏' },
    looks: { name: 'Looks Check', icon: '👁' },
    worth: { name: 'Worth It', icon: '💎' }
  };

  const hasSize = product.sizes && product.sizes.length > 0;
  const buttonLabel = hasSize ? `ADD TO BAG — SIZE ${selectedSize}` : 'ADD TO BAG';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Product Summary Header Card */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', backgroundColor: '#f9f9fa', padding: '12px', borderRadius: '12px', border: '1px solid #eaeaec' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.brand}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#282c3f' }}>₹{product.salePrice || product.price}</span>
            {product.price && product.salePrice && product.price > product.salePrice && (
              <>
                <span style={{ fontSize: '12px', color: '#94969f', textDecoration: 'line-through' }}>₹{product.price}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#ff3f6c' }}>({product.discount}% OFF)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#94969f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Quick Check Summary ({availableChecks.length} {availableChecks.length === 1 ? 'Check' : 'Checks'})
      </div>

      {/* Applicable Check Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {availableChecks.map(checkKey => {
          const cfg = checkConfig[checkKey] || { name: checkKey, icon: '🔍' };
          const statusLabel = getCheckStatusLabel(checkKey);

          return (
            <div 
              key={checkKey}
              onClick={() => onNavigateCheck(checkKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #eaeaec',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '18px' }}>{cfg.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>
                    {cfg.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#535766', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {statusLabel}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '18px', color: '#94969f', fontWeight: 'bold', marginLeft: '8px' }}>›</span>
            </div>
          );
        })}
      </div>

      {/* Synthesis Line Card */}
      <div style={{ backgroundColor: '#fff0f3', border: '1px solid #ffccd5', borderRadius: '12px', padding: '12px 14px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          💡 Decision Synthesis
        </div>
        <div style={{ fontSize: '12px', color: '#282c3f', lineHeight: '1.4', fontWeight: '500' }}>
          "{getSynthesisLine()}"
        </div>
      </div>

      {/* Primary Action: Single Add to Bag Button */}
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
        {buttonLabel}
      </button>
    </div>
  );
}
