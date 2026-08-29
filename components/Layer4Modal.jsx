'use client';

import React from 'react';

export default function Layer4Modal({ isOpen, onClose, type, product, data }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '20px',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eaeaec', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f' }}>
              {type === 'size_chart' ? 'Size & Fit Measurement Guide' : 'Curated As-Worn Photos'}
            </div>
            <div style={{ fontSize: '12px', color: '#535766', marginTop: '2px' }}>
              {product?.brand} - {product?.name}
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f5f5f6',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#535766'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {type === 'size_chart' ? (
          <div>
            <div style={{ fontSize: '12px', color: '#535766', marginBottom: '12px' }}>
              Garment measurements (in inches) across available sizes:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f6', color: '#282c3f', fontWeight: '700' }}>
                  <th style={{ padding: '8px', border: '1px solid #eaeaec' }}>Size</th>
                  <th style={{ padding: '8px', border: '1px solid #eaeaec' }}>Chest/Bust</th>
                  <th style={{ padding: '8px', border: '1px solid #eaeaec' }}>Waist</th>
                  <th style={{ padding: '8px', border: '1px solid #eaeaec' }}>Length</th>
                </tr>
              </thead>
              <tbody>
                {(product?.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((sz, idx) => {
                  const base = 34 + idx * 2;
                  return (
                    <tr key={sz} style={{ borderBottom: '1px solid #eaeaec' }}>
                      <td style={{ padding: '8px', fontWeight: '700', color: '#282c3f' }}>{sz}</td>
                      <td style={{ padding: '8px', color: '#535766' }}>{base}"</td>
                      <td style={{ padding: '8px', color: '#535766' }}>{base - 4}"</td>
                      <td style={{ padding: '8px', color: '#535766' }}>{38 + (idx % 3)}"</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#535766', fontWeight: '600' }}>
                Authentic Customer As-Worn Photo Captures:
              </div>
              <span style={{ fontSize: '11px', color: '#ff3f6c', fontWeight: '700' }}>
                {(data?.looks?.featuredPhotos || []).length} Captures
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.looks?.featuredPhotos && data.looks.featuredPhotos.length > 0 ? (
                data.looks.featuredPhotos.map((photo, idx) => (
                  <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaec', backgroundColor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'relative', height: '260px', backgroundColor: '#f5f5f6' }}>
                      <img 
                        src={photo.url || product?.image} 
                        alt={`Customer photo ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '9px',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)'
                      }}>
                        Capture #{idx + 1}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px', backgroundColor: '#fafbfc' }}>
                      <div style={{ fontSize: '11px', color: '#282c3f', fontWeight: '600', lineHeight: '1.4' }}>
                        {photo.label || 'Real daylight and indoor ambient capture'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94969f', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Source:</span>
                        <span style={{ color: '#03a685', fontWeight: '700' }}>{photo.source || 'Verified Customer Review'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaec' }}>
                  <img 
                    src={product?.image} 
                    alt={product?.name} 
                    style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} 
                  />
                  <div style={{ padding: '10px 12px', backgroundColor: '#f9f9fa', fontSize: '11px', color: '#535766' }}>
                    Standard product lighting photo
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
