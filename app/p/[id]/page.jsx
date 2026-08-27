'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProduct, getRelatedProducts } from '../../../lib/catalog.js';
import { useAppStore } from '../../../state/store.jsx';
import ProductCard from '../../../components/ProductCard.jsx';
import { HeartIcon, BagIcon, SearchIcon } from '../../../components/Icons.jsx';

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;

  const product = getProduct(id);
  const { state, dispatch } = useAppStore();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!product) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛍️</div>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#282c3f' }}>Product Not Found</h2>
        <p style={{ color: '#535766', fontSize: '12px', marginTop: '4px' }}>The requested product does not exist in the catalogue.</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#ff3f6c', color: '#ffffff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: '700' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const isWishlisted = state?.wishlist?.some(item => item.id === product.id);
  const wishlistCount = state?.wishlist ? state.wishlist.length : 0;
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  const relatedProducts = getRelatedProducts(product.id, 6);

  const gallery = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  const currentImage = gallery[selectedImageIndex] || product.image;

  const showSizeSelector = ['Women', 'Men', 'Kids', 'Footwear'].includes(product.department);

  const discountPercent = product.discount || (product.price && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0);

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      showToast('Removed from Wishlist');
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      showToast('Saved to Wishlist');
    }
  };

  const handleAddToBag = () => {
    if (showSizeSelector && !selectedSize) {
      showToast('Please select a size first');
      return;
    }

    dispatch({
      type: 'ADD_TO_BAG',
      payload: {
        product: product,
        size: selectedSize || (product.sizes ? product.sizes[0] : 'Standard')
      }
    });

    showToast('Added to Shopping Bag');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingBottom: '70px', position: 'relative' }}>
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#282c3f',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* PDP Full-Bleed Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <button 
          onClick={() => router.back()} 
          style={{ border: 'none', background: 'transparent', fontSize: '20px', color: '#282c3f', cursor: 'pointer', padding: '0 4px' }}
        >
          ←
        </button>

        <div style={{ flex: 1, fontSize: '13px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.brand}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/search" style={{ textDecoration: 'none', color: '#282c3f' }}>
            <SearchIcon size={18} color="#282c3f" />
          </Link>
          
          <Link href="/wishlist" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <HeartIcon size={18} color={wishlistCount > 0 ? '#ff3f6c' : '#282c3f'} fill={wishlistCount > 0 ? '#ff3f6c' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#ff3f6c',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/bag" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <BagIcon size={18} color="#282c3f" />
            {bagCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px',
                backgroundColor: '#ff3f6c',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {bagCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Product Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#f8f8f9', overflow: 'hidden' }}>
        <img 
          src={currentImage} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Rating Badge Overlay */}
        {product.rating && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#282c3f',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <span>{product.rating}</span>
            <span style={{ color: '#03a685', fontSize: '10px' }}>★</span>
            <span style={{ color: '#94969f', fontWeight: '400' }}>| {product.reviewCount || 120} Ratings</span>
          </div>
        )}

        {/* Wishlist Floating Button */}
        <button 
          onClick={toggleWishlist}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
          }}
        >
          <HeartIcon size={20} color={isWishlisted ? '#ff3f6c' : '#282c3f'} fill={isWishlisted ? '#ff3f6c' : 'none'} />
        </button>
      </div>

      {/* Gallery Image Thumbnails */}
      {gallery.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', overflowX: 'auto', borderBottom: '1px solid #f0f0f0', scrollbarWidth: 'none' }}>
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              style={{
                border: selectedImageIndex === idx ? '2px solid #ff3f6c' : '1px solid #eaeaec',
                borderRadius: '4px',
                padding: 0,
                width: '48px',
                height: '60px',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Product Title & Brand Info */}
      <div style={{ padding: '14px 14px 12px 14px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          {product.brand}
        </div>
        <div style={{ fontSize: '13px', color: '#535766', marginTop: '2px', lineHeight: '1.4' }}>
          {product.name}
        </div>

        {/* Pricing Block */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#282c3f' }}>
            ₹{product.salePrice || product.price}
          </span>
          {product.price && product.salePrice && product.price > product.salePrice && (
            <span style={{ fontSize: '13px', color: '#94969f', textDecoration: 'line-through' }}>
              MRP ₹{product.price}
            </span>
          )}
          {discountPercent > 0 && (
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ff3f6c' }}>
              ({discountPercent}% OFF)
            </span>
          )}
        </div>
        <div style={{ fontSize: '11px', color: '#03a685', fontWeight: '600', marginTop: '4px' }}>
          Inclusive of all taxes
        </div>
      </div>

      {/* Size Selector Section (Apparel & Footwear only per §4 & §5a) */}
      {showSizeSelector && product.sizes && product.sizes.length > 0 && (
        <div style={{ padding: '14px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase' }}>
              SELECT SIZE {product.department === 'Footwear' ? '(UK)' : ''}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ff3f6c', cursor: 'pointer' }}>
              SIZE CHART &gt;
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {product.sizes.map((size, idx) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    minWidth: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #ff3f6c' : '1px solid #d4d5d9',
                    backgroundColor: isSelected ? '#fff0f3' : '#ffffff',
                    color: isSelected ? '#ff3f6c' : '#282c3f',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 8px'
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pincode & Delivery Options */}
      <div style={{ padding: '14px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', marginBottom: '8px' }}>
          DELIVERY OPTIONS
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Enter Pincode" 
            value={pincode}
            maxLength={6}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #d4d5d9',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => setPincodeChecked(pincode.length === 6)}
            style={{
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              color: '#ff3f6c',
              border: '1px solid #ff3f6c',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            CHECK
          </button>
        </div>

        {pincodeChecked && (
          <div style={{ fontSize: '11px', color: '#03a685', fontWeight: '600', marginTop: '6px' }}>
            ✓ Express Delivery Available to {pincode}
          </div>
        )}

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#535766' }}>
          <div>✔ 100% Original Products</div>
          <div>✔ Pay on delivery available</div>
          <div>✔ Easy 14 days returns & exchanges</div>
        </div>
      </div>

      {/* Product Details & Specifications */}
      <div style={{ padding: '14px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', marginBottom: '8px' }}>
          PRODUCT DETAILS
        </div>

        <div style={{ fontSize: '12px', color: '#535766', lineHeight: '1.6' }}>
          {product.name} by {product.brand}. Crafted with premium quality materials for everyday comfort and style.
        </div>

        {product.specifications && (
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', backgroundColor: '#f9f9fa', padding: '10px', borderRadius: '6px' }}>
            {Object.entries(product.specifications).map(([key, val], idx) => (
              <div key={idx}>
                <div style={{ fontSize: '10px', color: '#94969f', textTransform: 'uppercase', fontWeight: '700' }}>{key}</div>
                <div style={{ fontSize: '11px', color: '#282c3f', fontWeight: '600', marginTop: '2px' }}>{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Similar Products Rail */}
      {relatedProducts.length > 0 && (
        <div style={{ padding: '14px', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', marginBottom: '12px' }}>
            SIMILAR PRODUCTS
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '414px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eaeaec',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 200,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={toggleWishlist}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #d4d5d9',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
            color: '#282c3f'
          }}
        >
          <HeartIcon size={16} color={isWishlisted ? '#ff3f6c' : '#282c3f'} fill={isWishlisted ? '#ff3f6c' : 'none'} />
          <span>WISHLIST</span>
        </button>

        <button
          onClick={handleAddToBag}
          style={{
            flex: 2,
            padding: '12px',
            backgroundColor: '#ff3f6c',
            border: 'none',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '0.5px'
          }}
        >
          <BagIcon size={16} color="#ffffff" />
          <span>ADD TO BAG</span>
        </button>
      </div>
    </div>
  );
}
