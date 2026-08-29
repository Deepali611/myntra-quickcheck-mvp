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
      return 'Natural indoor and ambient lighting makes the material appear one shade lighter than studio flash photography.';
    }
    if (direction === 'warmer') {
      return 'Daylight and warm ambient lighting brings out rich golden undertones slightly warmer than catalogue lighting.';
    }
    if (direction === 'smaller') {
      return 'Print pattern motif scale is slightly finer in person than close-up macro photography.';
    }
    if (direction === 'deeper') {
      return 'Pigment applies with rich full coverage, appearing slightly deeper in tone than digital preview.';
    }
    return 'Fabric texture, colour tone, and print scale align consistently with catalogue photos.';
  };

  // Visual filter matching the claim
  const getImageFilter = (tab) => {
    if (tab === 'as_shown') return 'none';
    if (direction === 'lighter') return 'brightness(1.18) saturate(0.92) contrast(0.96)';
    if (direction === 'warmer') return 'sepia(0.35) saturate(1.3) hue-rotate(-12deg)';
    if (direction === 'deeper') return 'brightness(0.82) contrast(1.15) saturate(1.1)';
    return 'none';
  };

  // Swatch colors showing visual agreement
  const getSwatches = () => {
    if (direction === 'lighter') {
      return { asShown: '#88304e', asWorn: '#b55877', labelShown: 'Studio (Base)', labelWorn: 'As Worn (Lighter)' };
    }
    if (direction === 'warmer') {
      return { asShown: '#2c4a6f', asWorn: '#5a5438', labelShown: 'Studio (Cool)', labelWorn: 'As Worn (Warmer)' };
    }
    if (direction === 'deeper') {
      return { asShown: '#d64562', asWorn: '#9e1b36', labelShown: 'Digital Preview', labelWorn: 'As Worn (Deeper)' };
    }
    return { asShown: '#c85a54', asWorn: '#c85a54', labelShown: 'Studio', labelWorn: 'As Worn (Exact Match)' };
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

