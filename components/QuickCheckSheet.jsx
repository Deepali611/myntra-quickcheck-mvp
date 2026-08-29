'use client';

import React, { useState, useEffect } from 'react';
import { getQuickCheckData } from '../lib/quickCheckData.js';
import OverviewCard from './OverviewCard.jsx';
import FitCheckCard from './FitCheckCard.jsx';
import LooksCheckCard from './LooksCheckCard.jsx';
import WorthItCard from './WorthItCard.jsx';
import Layer4Modal from './Layer4Modal.jsx';

export default function QuickCheckSheet({ isOpen, onClose, product, onAddToBagSuccess }) {
  const [currentScreen, setCurrentScreen] = useState('overview'); // 'overview' | 'fit' | 'looks' | 'worth'
  const [selectedSize, setSelectedSize] = useState('M');
  const [modalType, setModalType] = useState(null); // 'size_chart' | 'photo_viewer' | null

  useEffect(() => {
    if (product) {
      setCurrentScreen('overview');
      const defaultSz = (product.sizes && product.sizes.length > 0) 
        ? product.sizes[Math.floor(product.sizes.length / 2)] 
        : (product.department === 'Footwear' ? '8' : 'M');
      setSelectedSize(defaultSz);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const data = getQuickCheckData(product);
  if (!data) return null;

  const handleAddToBag = () => {
    if (onAddToBagSuccess) {
      onAddToBagSuccess(product, selectedSize);
    }
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1500,
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
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '16px 20px 24px 20px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '4px', backgroundColor: '#eaeaec', borderRadius: '2px' }} />
        </div>

        {/* Top Header Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentScreen !== 'overview' && (
              <button 
                onClick={() => setCurrentScreen('overview')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#282c3f',
                  padding: '0 4px',
                  fontWeight: 'bold'
                }}
                title="Back to Overview"
              >
                ←
              </button>
            )}
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#282c3f' }}>
              {currentScreen === 'overview' && `👁 Quick Check — ${product.brand}`}
              {currentScreen === 'fit' && `📏 Fit Check — ${product.brand}`}
              {currentScreen === 'looks' && `👁 Looks Check — ${product.brand}`}
              {currentScreen === 'worth' && `💎 Worth It — ${product.brand}`}
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

        {/* Dynamic Screen View */}
        {currentScreen === 'overview' && (
          <OverviewCard 
            product={product} 
            data={data} 
            selectedSize={selectedSize} 
            onNavigateCheck={(checkKey) => setCurrentScreen(checkKey)}
            onAddToBag={handleAddToBag}
          />
        )}

        {currentScreen === 'fit' && (
          <FitCheckCard 
            product={product} 
            data={data} 
            selectedSize={selectedSize} 
            onSelectSize={setSelectedSize}
            onOpenLayer4={() => setModalType('size_chart')}
            onAddToBag={handleAddToBag}
          />
        )}

        {currentScreen === 'looks' && (
          <LooksCheckCard 
            product={product} 
            data={data} 
            onOpenLayer4={() => setModalType('photo_viewer')}
            onAddToBag={handleAddToBag}
          />
        )}

        {currentScreen === 'worth' && (
          <WorthItCard 
            product={product} 
            data={data} 
            onAddToBag={handleAddToBag}
          />
        )}

        {/* Layer 4 Detail Modal */}
        <Layer4Modal 
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
          product={product}
          data={data}
        />
      </div>
    </div>
  );
}
