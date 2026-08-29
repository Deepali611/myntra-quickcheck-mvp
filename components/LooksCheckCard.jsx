'use client';

import React, { useState, useEffect } from 'react';

export default function LooksCheckCard({ product, data, onOpenLayer4, onAddToBag }) {
  const [whyLine, setWhyLine] = useState('');
  const [loadingWhy, setLoadingWhy] = useState(false);
  const [activeTab, setActiveTab] = useState('as_shown'); // 'as_shown' | 'as_worn'

  const looks = data?.looks || {};
  const attribute = looks.attribute || 'none';
  const direction = looks.direction || 'match';

  useEffect(() => {
    let isMounted = true;
    setLoadingWhy(true);

    async function fetchWhy() {
      try {
        const res = await fetch('/api/looks-check-why', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            looks: looks,
            department: product?.department,
            color: product?.color
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
        if (attribute === 'fabric' && direction === 'lighter') {
          setWhyLine('Fabric reads a shade lighter in natural indoor lighting compared to studio listing photos.');
        } else if (attribute === 'colour' && direction === 'warmer') {
          setWhyLine('Colour tone is slightly warmer under daylight conditions.');
        } else if (attribute === 'print' && direction === 'smaller') {
          setWhyLine('Print pattern scale is slightly finer in person than close-up photography.');
        } else if (attribute === 'shade' && direction === 'deeper') {
          setWhyLine('Shade intensity applies slightly deeper than online swatch preview.');
        } else if (attribute === 'material' && direction === 'lighter') {
          setWhyLine('Material finish has a softer, lighter texture in hand.');
        } else {
          setWhyLine('Colour, fabric texture, and finish match listing photos closely.');
        }
        setLoadingWhy(false);
      }
    }

    fetchWhy();
    return () => { isMounted = false; };
  }, [attribute, direction, product]);

  const getHeadline = () => {
    if (attribute === 'fabric' && direction === 'lighter') return 'Fabric reads a shade lighter than photos';
    if (attribute === 'colour' && direction === 'warmer') return 'Colour looks slightly warmer than shown';
    if (attribute === 'print' && direction === 'smaller') return 'Print runs a bit smaller than the listing photo';
    if (attribute === 'shade' && direction === 'deeper') return 'Shade runs deeper than shown';
    if (attribute === 'material' && direction === 'lighter') return 'Material finish reads lighter than photos';
    return 'Matches the photos closely';
  };

  // Swatch tint logic to ensure visual agrees with claim!
  const getImageStyle = (mode) => {
    if (mode === 'as_shown') return {};
    if (direction === 'lighter') return { filter: 'brightness(1.15) contrast(0.92)' };
    if (direction === 'warmer') return { filter: 'sepia(0.25) saturate(1.2)' };
    if (direction === 'deeper') return { filter: 'brightness(0.85) contrast(1.1)' };
    return {};
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Headline & Why Card */}
      <div style={{ backgroundColor: '#f9f9fa', border: '1px solid #eaeaec', borderRadius: '14px', padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#535766', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Looks & Visual Verification
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f', marginBottom: '6px' }}>
          {getHeadline()}
        </div>
        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.4' }}>
          {loadingWhy ? 'Verifying visual lighting match...' : whyLine}
        </div>
      </div>

      {/* Visual Comparison Swatch (As Shown ↔ As Worn) */}
      <div style={{ border: '1px solid #eaeaec', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #eaeaec' }}>
          <button 
            onClick={() => setActiveTab('as_shown')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              backgroundColor: activeTab === 'as_shown' ? '#ffffff' : '#f5f5f6',
              fontWeight: activeTab === 'as_shown' ? '700' : '500',
              color: activeTab === 'as_shown' ? '#ff3f6c' : '#535766',
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'as_shown' ? '2px solid #ff3f6c' : 'none'
            }}
          >
            Studio Photo (As Shown)
          </button>
          <button 
            onClick={() => setActiveTab('as_worn')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              backgroundColor: activeTab === 'as_worn' ? '#ffffff' : '#f5f5f6',
              fontWeight: activeTab === 'as_worn' ? '700' : '500',
              color: activeTab === 'as_worn' ? '#ff3f6c' : '#535766',
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'as_worn' ? '2px solid #ff3f6c' : 'none'
            }}
          >
            Real Indoor (As Worn)
          </button>
        </div>

        <div style={{ position: 'relative', height: '220px', backgroundColor: '#f9f9fa' }}>
          <img 
            src={product?.image} 
            alt={product?.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              ...getImageStyle(activeTab)
            }} 
          />
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#ffffff', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' }}>
            {activeTab === 'as_shown' ? 'Studio Lighting' : `As Worn (${direction})`}
          </div>
        </div>
      </div>

      {/* Layer 4 launcher */}
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
          <span style={{ fontSize: '18px' }}>🖼</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>View Curated As-Worn Photo Gallery</div>
            <div style={{ fontSize: '11px', color: '#94969f' }}>Verified customer photo highlights</div>
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
        ADD TO BAG
      </button>
    </div>
  );
}
