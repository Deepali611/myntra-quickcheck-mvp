'use client';

import React from 'react';
import { FitIcon, LooksIcon, WorthIcon, SparklesIcon } from './Icons.jsx';

export default function OverviewCard({ product, data, selectedSize, onNavigateCheck, onAddToBag }) {
  if (!product || !data) return null;

  const availableChecks = data.availableChecks || ['worth'];

  // Status label mapping per check computed strictly from real data
  function getCheckStatusLabel(check) {
    if (check === 'fit') {
      const currentFit = data.fit ? data.fit[selectedSize] : null;
      if (!currentFit) return `Not enough to say for ${selectedSize} yet`;
      if (currentFit.status === 'true') {
        return product.department === 'Footwear' ? `True to size in UK ${selectedSize}` : `True to size in ${selectedSize}`;
      }
      if (currentFit.headline) return currentFit.headline;
      
      if (product.department === 'Footwear') {
        const isSmall = currentFit.sizeAccuracy === 'small';
        const sev = currentFit.severity || 'a little';
        return isSmall ? `Runs ${sev} small — go half a size up` : `Runs ${sev} large — go half a size down`;
      }

      if (currentFit.top && currentFit.bottom) {
        const sev = currentFit.top.severity || 'a little';
        return `Runs ${sev} ${currentFit.top.direction} at ${currentFit.top.zone || 'top'}, ${currentFit.bottom.direction} in ${currentFit.bottom.zone || 'bottom'}`;
      }
      if (currentFit.direction && currentFit.zone) {
        const sev = currentFit.severity || 'a little';
        return `Runs ${sev} ${currentFit.direction} at ${currentFit.zone}`;
      }
      return `True to size in ${selectedSize}`;
    }

    if (check === 'looks') {
      const looks = data.looks || {};
      if (looks.headline) return looks.headline;
      if (looks.attribute === 'none' || looks.direction === 'match') {
        return 'Matches the photos closely';
      }
      return `${looks.attribute || 'Fabric'} reads ${looks.degree || 'a shade'} ${looks.direction || 'lighter'} than photos`;
    }

    if (check === 'worth') {
      const worth = data.worth || {};
      return worth.headline || 'Best price we found for this style';
    }

    return 'Check details';
  }

  // Synthesis line per Phase 10a rule:
  // "only when 2+ checks apply — a single-check product skips straight to that check's own headline as the synthesis line"
  function getSynthesisLine() {
    if (availableChecks.length === 1) {
      return getCheckStatusLabel(availableChecks[0]);
    }

    const sentences = [];
    if (availableChecks.includes('fit')) {
      sentences.push(getCheckStatusLabel('fit'));
    }
    if (availableChecks.includes('looks')) {
      sentences.push(getCheckStatusLabel('looks'));
    }
    if (availableChecks.includes('worth')) {
      sentences.push(getCheckStatusLabel('worth'));
    }

    return sentences.join('. ') + '.';
  }

  const checkConfig = {
    fit: { name: 'Fit Check', IconComponent: FitIcon },
    looks: { name: 'Looks Check', IconComponent: LooksIcon },
    worth: { name: 'Worth It', IconComponent: WorthIcon }
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
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#94969f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Quick Check Summary ({availableChecks.length} {availableChecks.length === 1 ? 'Check' : 'Checks'})
      </div>

      {/* Applicable Check Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {availableChecks.map(checkKey => {
          const cfg = checkConfig[checkKey] || { name: checkKey, IconComponent: WorthIcon };
          const Icon = cfg.IconComponent;
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
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff0f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#ff3f6c" strokeWidth={2} />
                </div>
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
      <div style={{ backgroundColor: '#fff0f3', border: '1px solid #ffd8e0', borderRadius: '12px', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          <SparklesIcon size={14} color="#ff3f6c" />
          <span>Decision Synthesis</span>
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

