'use client';

import React, { useState } from 'react';
import { LooksIcon } from './Icons.jsx';

export default function LooksCheckCard({ product, data, onOpenLayer4, onAddToBag }) {
  const [activeTab, setActiveTab] = useState('as_shown'); // 'as_shown' | 'as_worn'

  const looks = data?.looks || {};
  const attribute = looks.attribute || 'none';
  const direction = looks.direction || 'match';

  // Multi-dimensional Phase 10c Table Headline Mapping
  const getHeadline = () => {
    if (looks.headline) return looks.headline;
    if (attribute === 'fabric' && direction === 'lighter') return 'Fabric reads a shade lighter than photos';
    if (attribute === 'colour' && direction === 'warmer') return 'Colour looks slightly warmer than shown';
    if (attribute === 'print' && direction === 'smaller') return 'Print runs a bit smaller than the listing photo';
    if (attribute === 'shade' && direction === 'deeper') return 'Shade runs slightly deeper than shown';
    if (attribute === 'material' && direction === 'lighter') return 'Material finish reads a shade lighter than photos';
    return 'Matches the photos closely';
  };

  const getSubline = () => {
    if (direction === 'lighter') {
      return 'Natural daylight and indoor lighting make the fabric look slightly lighter than studio flash photos.';
    }
    if (direction === 'warmer') {
      return 'Daylight and indoor lighting bring out warm, rich undertones slightly warmer than studio photos.';
    }
    if (direction === 'smaller') {
      return 'Print and pattern motifs appear slightly smaller and subtler in person than in close-up photos.';
    }
    if (direction === 'deeper') {
      return 'Applies with rich full coverage, looking slightly deeper in shade than on screen.';
    }
    return 'Fabric texture, colour shade, and print look consistent with the photos.';
  };

  // Visual filter matching the claim
  const getImageFilter = (tab) => {
    if (tab === 'as_shown') return 'none';
    if (direction === 'lighter') return 'brightness(1.18) saturate(0.92) contrast(0.96)';
    if (direction === 'warmer') return 'sepia(0.35) saturate(1.3) hue-rotate(-12deg)';
    if (direction === 'deeper') return 'brightness(0.82) contrast(1.15) saturate(1.1)';
    return 'none';
  };

  // Dynamic Product Swatches based on product's actual shade and lighting shift
  const getSwatches = () => {
    const name = (product?.name || '').toLowerCase();
    const photoCaptions = (product?.customerPhotos || []).map(cp => cp.caption || '').join(' ').toLowerCase();
    const fullText = `${name} ${photoCaptions} ${(product?.subcategory || '')}`.toLowerCase();

    const colors = [
      { k: 'striped', hex: '#3b82f6', lightHex: '#93c5fd', warmHex: '#60a5fa', deepHex: '#1d4ed8', name: 'Sky Blue & White' },
      { k: 'light blue', hex: '#38bdf8', lightHex: '#bae6fd', warmHex: '#7dd3fc', deepHex: '#0284c7', name: 'Light Blue' },
      { k: 'navy', hex: '#1b2a4a', lightHex: '#2d4474', warmHex: '#2b334d', deepHex: '#0e172a', name: 'Navy Blue' },
      { k: 'blue', hex: '#2563eb', lightHex: '#60a5fa', warmHex: '#3b82f6', deepHex: '#1d4ed8', name: 'Blue' },
      { k: 'rust', hex: '#b7410e', lightHex: '#d95d24', warmHex: '#a13b0c', deepHex: '#7c2d12', name: 'Rust Orange' },
      { k: 'orange', hex: '#ea580c', lightHex: '#fb923c', warmHex: '#c2410c', deepHex: '#9a3412', name: 'Orange' },
      { k: 'mustard', hex: '#d97706', lightHex: '#f59e0b', warmHex: '#b45309', deepHex: '#92400e', name: 'Mustard Yellow' },
      { k: 'yellow', hex: '#ca8a04', lightHex: '#facc15', warmHex: '#ea580c', deepHex: '#a16207', name: 'Yellow' },
      { k: 'maroon', hex: '#800020', lightHex: '#a31d36', warmHex: '#9a3412', deepHex: '#580c1f', name: 'Maroon' },
      { k: 'wine', hex: '#722f37', lightHex: '#9b434e', warmHex: '#8b3a3a', deepHex: '#4a151b', name: 'Wine' },
      { k: 'red', hex: '#b91c1c', lightHex: '#ef4444', warmHex: '#c2410c', deepHex: '#7f1d1d', name: 'Red' },
      { k: 'green', hex: '#15803d', lightHex: '#22c55e', warmHex: '#4d7c0f', deepHex: '#14532d', name: 'Green' },
      { k: 'olive', hex: '#556b2f', lightHex: '#6b8e23', warmHex: '#78716c', deepHex: '#3d4f1f', name: 'Olive' },
      { k: 'pink', hex: '#db2777', lightHex: '#f472b6', warmHex: '#fb7185', deepHex: '#9d174d', name: 'Pink' },
      { k: 'peach', hex: '#f87171', lightHex: '#fca5a5', warmHex: '#fb923c', deepHex: '#dc2626', name: 'Peach' },
      { k: 'purple', hex: '#7e22ce', lightHex: '#a855f7', warmHex: '#86198f', deepHex: '#581c87', name: 'Purple' },
      { k: 'lavender', hex: '#8b5cf6', lightHex: '#c4b5fd', warmHex: '#a78bfa', deepHex: '#6d28d9', name: 'Lavender' },
      { k: 'brown', hex: '#78350f', lightHex: '#a16207', warmHex: '#92400e', deepHex: '#451a03', name: 'Tan Brown' },
      { k: 'beige', hex: '#c5a880', lightHex: '#e2d4be', warmHex: '#b89467', deepHex: '#997b53', name: 'Beige' },
      { k: 'gold', hex: '#d97706', lightHex: '#fbbf24', warmHex: '#b45309', deepHex: '#92400e', name: 'Gold' },
      { k: 'white', hex: '#f1f5f9', lightHex: '#ffffff', warmHex: '#fef3c7', deepHex: '#e2e8f0', name: 'White' },
      { k: 'black', hex: '#242424', lightHex: '#4a4a4a', warmHex: '#3a3328', deepHex: '#111111', name: 'Black' },
      { k: 'teal', hex: '#0f766e', lightHex: '#14b8a6', warmHex: '#0d9488', deepHex: '#115e59', name: 'Teal' },
      { k: 'grey', hex: '#64748b', lightHex: '#94a3b8', warmHex: '#78716c', deepHex: '#334155', name: 'Grey' }
    ];

    let matched = colors.find(c => fullText.includes(c.k));
    if (!matched) {
      const hash = (product?.id || 'p1').split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
      matched = colors[Math.abs(hash) % colors.length];
    }

    if (direction === 'lighter') {
      return {
        asShown: matched.hex,
        asWorn: matched.lightHex,
        labelShown: `Studio (${matched.name})`,
        labelWorn: `As Worn (Lighter ${matched.name})`
      };
    }
    if (direction === 'warmer') {
      return {
        asShown: matched.hex,
        asWorn: matched.warmHex,
        labelShown: `Studio (${matched.name})`,
        labelWorn: `As Worn (Warmer ${matched.name})`
      };
    }
    if (direction === 'deeper') {
      return {
        asShown: matched.hex,
        asWorn: matched.deepHex,
        labelShown: `Screen (${matched.name})`,
        labelWorn: `As Worn (Deeper ${matched.name})`
      };
    }
    return {
      asShown: matched.hex,
      asWorn: matched.hex,
      labelShown: `Studio (${matched.name})`,
      labelWorn: `As Worn (Exact Match)`
    };
  };

  const swatches = getSwatches();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Headline & Verification Card */}
      <div style={{ backgroundColor: '#f9f9fa', border: '1px solid #ffd8e0', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#ff3f6c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Looks Check Verdict
        </div>
        <div style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', marginBottom: '4px' }}>
          {getHeadline()}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4' }}>
          {getSubline()}
        </div>
      </div>

      {/* Swipeable / Interactive As Shown ↔ As Worn Visual Comparison */}
      <div style={{ border: '1px solid #eaeaec', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Toggle Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eaeaec', backgroundColor: '#f8f8f9' }}>
          <button 
            onClick={() => setActiveTab('as_shown')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              backgroundColor: activeTab === 'as_shown' ? '#ffffff' : 'transparent',
              fontWeight: activeTab === 'as_shown' ? '800' : '600',
              color: activeTab === 'as_shown' ? '#ff3f6c' : '#535766',
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'as_shown' ? '2px solid #ff3f6c' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            As Shown (Studio)
          </button>
          <button 
            onClick={() => setActiveTab('as_worn')}
            style={{
              flex: 1,
              padding: '11px',
              border: 'none',
              backgroundColor: activeTab === 'as_worn' ? '#ffffff' : 'transparent',
              fontWeight: activeTab === 'as_worn' ? '800' : '600',
              color: activeTab === 'as_worn' ? '#ff3f6c' : '#535766',
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'as_worn' ? '2px solid #ff3f6c' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            As Worn (Real Lighting)
          </button>
        </div>

        {/* Image Preview with Real Customer Photo & Filter */}
        <div style={{ position: 'relative', height: '240px', backgroundColor: '#f9f9fa', overflow: 'hidden' }}>
          <img 
            src={activeTab === 'as_shown' ? product?.image : (looks?.asWornImage || product?.image)} 
            alt={product?.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: activeTab === 'as_shown' ? 'none' : (looks?.asWornImage ? 'none' : getImageFilter(activeTab)),
              transition: 'all 0.25s ease'
            }} 
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '700',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {activeTab === 'as_shown' ? (
              <span>Studio Listing Photo</span>
            ) : (
              <span>📸 Customer As-Worn Photo (Real Lighting)</span>
            )}
          </div>
        </div>

        {/* Visual Swatch Comparison Bar */}
        <div style={{ padding: '12px 14px', backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: swatches.asShown, border: '1px solid #d4d5d9' }} />
            <div>
              <div style={{ fontSize: '10px', color: '#94969f', fontWeight: '700', textTransform: 'uppercase' }}>Studio Swatch</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#282c3f' }}>{swatches.labelShown}</div>
            </div>
          </div>

          <div style={{ fontSize: '14px', color: '#94969f', fontWeight: '800' }}>→</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: swatches.asWorn, border: '1.5px solid #ff3f6c', boxShadow: '0 1px 4px rgba(255, 63, 108, 0.2)' }} />
            <div>
              <div style={{ fontSize: '10px', color: '#ff3f6c', fontWeight: '700', textTransform: 'uppercase' }}>Real Lighting</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#282c3f' }}>{swatches.labelWorn}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Gallery Launcher */}
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
            <LooksIcon size={16} color="#ff3f6c" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>View Lighting & Material Breakdown</div>
            <div style={{ fontSize: '11px', color: '#94969f' }}>High-resolution natural light captures</div>
          </div>
        </div>
        <span style={{ fontSize: '13px', color: '#ff3f6c', fontWeight: '700' }}>View ›</span>
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
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(255, 63, 108, 0.35)'
        }}
      >
        ADD TO BAG
      </button>
    </div>
  );
}

