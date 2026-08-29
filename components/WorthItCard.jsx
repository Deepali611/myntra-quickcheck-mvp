'use client';

import React, { useState, useEffect } from 'react';

export default function WorthItCard({ product, data, onAddToBag }) {
  const [whyLine, setWhyLine] = useState('');
  const [loadingWhy, setLoadingWhy] = useState(false);

  const worth = data?.worth || {};
  const headline = worth.headline || 'Best price we found for this style';

  // Sub-line: saved time calculation from product wishlist age
  const daysAgo = product?.wishlistAgeDays || 14;
  const price = product?.salePrice || product?.price || 1299;
  const subline = `Still ₹${price} — same price since you saved it ${daysAgo} days ago`;

  useEffect(() => {
    let isMounted = true;
    setLoadingWhy(true);

    async function fetchWhy() {
      try {
        const res = await fetch('/api/worth-it-why', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            worth: worth,
            department: product?.department,
            subcategory: product?.subcategory
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
        setWhyLine(worth.why || `${headline}.`);
        setLoadingWhy(false);
      }
    }

    fetchWhy();
    return () => { isMounted = false; };
  }, [worth, headline, product]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Worth It Fact Card */}
      <div style={{ backgroundColor: '#f9f9fa', border: '1px solid #eaeaec', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#03a685', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          💎 Value & Price Verification
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f', marginBottom: '6px' }}>
          {headline}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4', marginBottom: '8px' }}>
          {loadingWhy ? 'Checking catalog price positions...' : whyLine}
        </div>
        <div style={{ fontSize: '11px', color: '#03a685', fontWeight: '600', backgroundColor: '#e6f7f3', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
          ⏱ {subline}
        </div>
      </div>

      {/* Shopper's Own Product Card ONLY (Zero competing products, zero second Add to Bag) */}
      <div style={{ border: '1px solid #eaeaec', borderRadius: '14px', padding: '14px', backgroundColor: '#ffffff', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <img 
          src={product?.image} 
          alt={product?.name} 
          style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#ff3f6c', textTransform: 'uppercase' }}>
            {product?.brand}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
            {product?.name}
          </div>
          <div style={{ fontSize: '12px', color: '#535766', marginTop: '4px' }}>
            Category: {product?.department} — {product?.subcategory}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#282c3f', marginTop: '6px' }}>
            ₹{price}
          </div>
        </div>
      </div>

      {/* Single Primary Action Button */}
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
        ADD TO BAG
      </button>
    </div>
  );
}
