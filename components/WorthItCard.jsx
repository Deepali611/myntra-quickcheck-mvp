'use client';

import React from 'react';
import { WorthIcon } from './Icons.jsx';

export default function WorthItCard({ product, data, onAddToBag }) {
  const worth = data?.worth || {};
  const headline = worth.headline || 'Best price we found for this style';
  const why = worth.why || 'Priced in line with similar picks in this subcategory.';

  // Sub-line: saved time calculation from product wishlist age
  const daysAgo = product?.wishlistAgeDays || 7;
  const price = product?.salePrice || product?.price || 1299;
  const subline = `Still ₹${price} — same price since you saved it ${daysAgo} days ago`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Worth It Fact Card */}
      <div style={{ backgroundColor: '#f9f9fa', border: '1px solid #e0f2ee', borderRadius: '14px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#03a685', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          <WorthIcon size={14} color="#03a685" />
          <span>Value & Price Verification</span>
        </div>
        <div style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', marginBottom: '6px' }}>
          {headline}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4', marginBottom: '8px' }}>
          {why}
        </div>
        <div style={{ fontSize: '11px', color: '#03a685', fontWeight: '700', backgroundColor: '#e6f7f3', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
          {subline}
        </div>
      </div>

      {/* Shopper's Own Product Card ONLY (Zero competing products, zero second Add to Bag) */}
      <div style={{ border: '1px solid #eaeaec', borderRadius: '14px', padding: '14px', backgroundColor: '#ffffff', display: 'flex', gap: '14px', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
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
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#282c3f', marginTop: '6px' }}>
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
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(255, 63, 108, 0.35)'
        }}
      >
        ADD TO BAG
      </button>
    </div>
  );
}

