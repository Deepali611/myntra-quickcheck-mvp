'use client';

import React from 'react';
import Link from 'next/link';
import { HeartIcon } from './Icons.jsx';
import { useAppStore } from '../state/store.jsx';

export default function ProductCard({ product, onShowToast }) {
  const { state, toggleWishlist } = useAppStore();
  
  if (!product) return null;

  const rawId = String(product.id).replace(/^wish_/, '');
  const isWishlisted = state?.wishlist?.some(item => 
    String(item.productId).replace(/^wish_/, '') === rawId || 
    String(item.id).replace(/^wish_/, '') === rawId
  );

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.discount || (product.price && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0);

  return (
    <div className="product-card-wrap" style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #eaeaec',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      textDecoration: 'none'
    }}>
      <Link href={`/p/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Product Image Container */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#f8f8f9', overflow: 'hidden' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Rating Badge Overlay */}
          {product.rating && (
            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#282c3f',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backdropFilter: 'blur(2px)'
            }}>
              <span>{product.rating}</span>
              <span style={{ color: '#03a685', fontSize: '9px' }}>★</span>
              <span style={{ color: '#94969f', fontWeight: '400' }}>| {product.reviewCount || 120}</span>
            </div>
          )}

          {/* Wishlist Heart Toggle Overlay */}
          <button 
            onClick={handleHeartClick}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
              zIndex: 2
            }}
          >
            <HeartIcon 
              size={16} 
              color={isWishlisted ? '#ff3f6c' : '#282c3f'} 
              fill={isWishlisted ? '#ff3f6c' : 'none'} 
            />
          </button>
        </div>

        {/* Product Details Section */}
        <div style={{ padding: '8px 10px 10px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            {product.brand || 'Myntra'}
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            color: '#535766', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            fontWeight: '400'
          }}>
            {product.name}
          </div>

          {/* Price & Discount Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>
              ₹{product.salePrice || product.price}
            </span>
            {product.price && product.salePrice && product.price > product.salePrice && (
              <span style={{ fontSize: '10px', color: '#94969f', textDecoration: 'line-through' }}>
                ₹{product.price}
              </span>
            )}
            {discountPercent > 0 && (
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#ff3f6c' }}>
                ({discountPercent}% OFF)
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
