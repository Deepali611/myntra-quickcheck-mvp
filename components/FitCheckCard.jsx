'use client';

import React, { useState, useEffect } from 'react';

export default function FitCheckCard({ product, data, selectedSize, onSelectSize, onOpenLayer4, onAddToBag }) {
  const [whyLine, setWhyLine] = useState('');
  const [loadingWhy, setLoadingWhy] = useState(false);

  const sizes = product?.sizes && product.sizes.length > 0 
    ? product.sizes 
    : (product?.department === 'Footwear' ? ['6', '7', '8', '9', '10', '11'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  const currentFit = data?.fit ? data.fit[selectedSize] : null;

  useEffect(() => {
    let isMounted = true;
    setLoadingWhy(true);

    async function fetchWhy() {
      try {
        const res = await fetch('/api/fit-check-why', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fit: currentFit,
            department: product?.department,
            garmentType: product?.garmentType,
            size: selectedSize
          })
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.why) {
            setWhyLine(json.why);
            setLoadingWhy(false);
            return;
          }
        }
      } catch (err) {
        // fallback handles error
      }

      if (isMounted) {
        if (!currentFit) {
          setWhyLine(`Not enough to say for ${selectedSize} yet.`);
        } else if (currentFit.status === 'true') {
          setWhyLine(`Fits true to size in ${selectedSize}. Standard measurements match this garment.`);
        } else if (currentFit.sizeAccuracy === 'small') {
          setWhyLine(`Runs small in size ${selectedSize}. We recommend choosing half a size larger for comfort.`);
        } else if (currentFit.top && currentFit.bottom) {
          setWhyLine(`Runs ${currentFit.top.direction} on top chest, and ${currentFit.bottom.direction} on bottom length.`);
        } else if (currentFit.direction && currentFit.zone) {
          setWhyLine(`Runs ${currentFit.direction} at ${currentFit.zone} in size ${selectedSize}.`);
        } else {
          setWhyLine(`Fits true to size in ${selectedSize}.`);
        }
        setLoadingWhy(false);
      }
    }

    fetchWhy();

    return () => { isMounted = false; };
  }, [selectedSize, currentFit, product]);

  const getHeadline = () => {
    if (!currentFit) return `Not enough to say for ${selectedSize} yet`;
    if (currentFit.status === 'true') return `True to size in ${selectedSize}`;
    if (currentFit.sizeAccuracy === 'small') return `Runs small — go size up`;
    if (currentFit.sizeAccuracy === 'large') return `Runs large — go size down`;
    if (currentFit.top && currentFit.bottom) {
      return `Runs ${currentFit.top.direction} on top, ${currentFit.bottom.direction} on bottom`;
    }
    if (currentFit.direction && currentFit.zone) {
      return `Runs ${currentFit.direction} at ${currentFit.zone}`;
    }
    return `True to size in ${selectedSize}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Size Selector Chips */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94969f', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          Select Size ({product?.department === 'Footwear' ? 'UK Size' : 'Garment Size'}):
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
                  cursor: 'pointer'
                }}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fit Verdict Card */}
      <div style={{ backgroundColor: '#f9f9fa', border: '1px solid #eaeaec', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#535766', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Size {selectedSize} Fit Verdict
        </div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#282c3f', marginBottom: '6px' }}>
          {getHeadline()}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4' }}>
          {loadingWhy ? 'Analyzing size measurements...' : whyLine}
        </div>
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

      {/* Action Button */}
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
          marginTop: '4px'
        }}
      >
        ADD TO BAG — SIZE {selectedSize}
      </button>
    </div>
  );
}
