'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';
import { isWishlistEligible } from '../../data/seedWishlist.js';
import { BagIcon } from '../../components/Icons.jsx';
import QuickCheckSheet from '../../components/QuickCheckSheet.jsx';

export default function WishlistPage() {
  const { state, dispatch } = useAppStore();
  const wishlistItems = state?.wishlist || [];
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  const [toastMessage, setToastMessage] = useState('');
  const [activeQuickCheckProduct, setActiveQuickCheckProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [filterOutOfStockOnly, setFilterOutOfStockOnly] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleRemoveFromWishlist = (id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
    showToast('Item removed from Wishlist');
  };

  const handleMoveToBag = (item) => {
    const prod = item.product || item;
    dispatch({
      type: 'ADD_TO_BAG',
      payload: {
        product: prod,
        size: prod.sizes ? prod.sizes[0] : 'Standard'
      }
    });
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.id });
    showToast('Moved to Shopping Bag');
  };

  const handleShareItem = (prod) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast(`Shared ${prod.brand} link!`);
  };

  const handleTriggerQuickCheck = (item) => {
    const prod = item.product || item;
    setActiveQuickCheckProduct(prod);
  };

  const handleQuickCheckAddToBag = (product, size) => {
    dispatch({
      type: 'ADD_TO_BAG',
      payload: {
        product: product,
        size: size || 'Standard'
      }
    });
    showToast(`Added ${product.brand} (${size}) to Bag!`);
  };

  // Fix 3: Build Wishlist category circle row DYNAMICALLY from categories actually present in wishlist!
  const categoriesPresentMap = new Map();
  wishlistItems.forEach((item) => {
    const prod = item.product || item;
    const catLabel = prod.subcategory || prod.category || 'Apparel';
    if (!categoriesPresentMap.has(catLabel)) {
      categoriesPresentMap.set(catLabel, prod.image);
    }
  });

  const categoriesPresent = Array.from(categoriesPresentMap.entries()).map(([label, image]) => ({
    label,
    image
  }));

  // Helper to check deterministic stock status for demo (Fix 5: 1 in 5 items out of stock)
  const isOutOfStockItem = (item, index) => {
    return index % 5 === 2;
  };

  // Filter wishlist items
  let filteredItems = wishlistItems;
  if (selectedCategoryFilter) {
    filteredItems = filteredItems.filter(item => {
      const prod = item.product || item;
      const catLabel = prod.subcategory || prod.category || 'Apparel';
      return catLabel === selectedCategoryFilter;
    });
  }
  if (filterOutOfStockOnly) {
    filteredItems = filteredItems.filter((item, idx) => isOutOfStockItem(item, idx));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f6' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#282c3f',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Wishlist Header (Fix 1: Bell, Wishlist, Profile in shop header, Bag here with real count Fix 2) */}
      <header style={{
        flexShrink: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
              ←
            </Link>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Wishlist
              </h1>
              {/* Fix 2: Live wishlist item count from state */}
              <span style={{ fontSize: '11px', color: '#535766', fontWeight: '500' }}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '16px', color: '#282c3f', cursor: 'pointer' }}>✏️</span>
            <Link href="/bag" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <BagIcon size={20} color="#282c3f" />
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
        </div>

        {/* Delivery Location Bar */}
        <div style={{
          backgroundColor: '#fff0f3',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#282c3f',
          fontWeight: '500',
          borderTop: '1px solid #ffd8e0'
        }}>
          <span style={{ color: '#ff3f6c' }}>📍</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Deliver to: <b>Thane, Kalyan - 421301</b>
          </span>
          <span style={{ fontSize: '9px', color: '#ff3f6c', fontWeight: '700' }}>CHANGE</span>
        </div>
      </header>

      {/* Main Wishlist Independent Scroll Body */}
      <main className="scrollable-content" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {wishlistItems.length === 0 ? (
          <div style={{ padding: '60px 16px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '60vh' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>❤️</div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#282c3f' }}>Your Wishlist is Empty</h2>
            <p style={{ color: '#535766', fontSize: '12px', marginTop: '4px', maxWidth: '240px', margin: '6px auto 0 auto' }}>
              Save items that you like in your wishlist to review them anytime.
            </p>
            <Link href="/" style={{
              display: 'inline-block',
              marginTop: '20px',
              backgroundColor: '#ffffff',
              color: '#ff3f6c',
              border: '1px solid #ff3f6c',
              padding: '10px 24px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ padding: '12px 12px 24px 12px' }}>
            {/* Collections & Out of Stock Pill Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <button 
                onClick={() => { setSelectedCategoryFilter(null); setFilterOutOfStockOnly(false); }}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: !filterOutOfStockOnly ? '1.5px solid #ff3f6c' : '1px solid #d4d5d9',
                  backgroundColor: !filterOutOfStockOnly ? '#fff0f3' : '#ffffff',
                  color: !filterOutOfStockOnly ? '#ff3f6c' : '#282c3f',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>📦</span>
                <span>Collections</span>
              </button>

              <button 
                onClick={() => setFilterOutOfStockOnly(!filterOutOfStockOnly)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: filterOutOfStockOnly ? '1.5px solid #ff3f6c' : '1px solid #d4d5d9',
                  backgroundColor: filterOutOfStockOnly ? '#fff0f3' : '#ffffff',
                  color: filterOutOfStockOnly ? '#ff3f6c' : '#282c3f',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>📦</span>
                <span>Out of Stock</span>
              </button>
            </div>

            {/* Fix 3: Dynamic Category Circle Row (built from categories present in wishlist!) */}
            {categoriesPresent.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginBottom: '12px',
                scrollbarWidth: 'none'
              }}>
                {categoriesPresent.map((cat, idx) => {
                  const isSelected = selectedCategoryFilter === cat.label;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.label)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        width: '64px'
                      }}
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: isSelected ? '2px solid #ff3f6c' : '1px solid #eaeaec',
                        padding: '2px',
                        backgroundColor: '#ffffff'
                      }}>
                        <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      </div>
                      <span style={{
                        fontSize: '10px',
                        color: isSelected ? '#ff3f6c' : '#535766',
                        fontWeight: isSelected ? '700' : '500',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '64px'
                      }}>
                        {cat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Promo Cashback Card */}
            <div style={{
              background: 'linear-gradient(135deg, #7b1fa2 0%, #ad1457 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800' }}>Get 7.5% cashback</div>
                <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>With Flipkart Axis Credit Card</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', color: '#7b1fa2', padding: '6px 12px', borderRadius: '16px', fontSize: '10px', fontWeight: '800' }}>
                Apply Now ›
              </div>
            </div>

            {/* Wishlist Product Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {filteredItems.map((item, index) => {
                const prod = item.product || item;
                const eligible = isWishlistEligible(item);
                const isOutOfStock = isOutOfStockItem(item, index);
                const discount = prod.discount || (prod.price && prod.salePrice ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100) : 0);

                return (
                  <div key={item.id} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #eaeaec',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    {/* Product Image Link */}
                    <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f8f8f9', width: '100%', overflow: 'hidden' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.75 : 1 }}
                      />

                      {/* Out of Stock Center Banner Overlay (Fix 5) */}
                      {isOutOfStock && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '800',
                          textAlign: 'center',
                          padding: '6px 0',
                          letterSpacing: '1px'
                        }}>
                          OUT OF STOCK
                        </div>
                      )}

                      {/* Rating Overlay */}
                      {prod.rating && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.92)',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#282c3f',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span>{prod.rating}</span>
                          <span style={{ color: '#03a685', fontSize: '9px' }}>★</span>
                        </div>
                      )}

                      {/* Fix 5: Primary Button Slot (1 slot, 2 states: "Add" with bag icon vs "Similar") */}
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', zIndex: 10 }}>
                        {!isOutOfStock ? (
                          <button
                            onClick={() => eligible ? handleTriggerQuickCheck(item) : handleMoveToBag(item)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1.5px solid #ff3f6c',
                              color: '#ff3f6c',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '11px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <span>🛍️</span>
                            <span>Add</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast('Showing similar items...')}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1.5px solid #ff3f6c',
                              color: '#ff3f6c',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '11px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <span>📱</span>
                            <span>Similar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Details Block */}
                    <div style={{ padding: '10px 10px 8px 10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.brand}
                      </div>
                      <div style={{ fontSize: '11px', color: '#535766', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {prod.name}
                      </div>

                      {/* Pricing Row */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#282c3f' }}>
                          ₹{prod.salePrice || prod.price}
                        </span>
                        {prod.price && prod.salePrice && prod.price > prod.salePrice && (
                          <span style={{ fontSize: '10px', color: '#94969f', textDecoration: 'line-through' }}>
                            ₹{prod.price}
                          </span>
                        )}
                        {discount > 0 && (
                          <span style={{ fontSize: '10px', color: '#ff3f6c', fontWeight: '700' }}>
                            ({discount}% OFF)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Fix 4: Exactly Three Action Icons Below Card (Delete, Move to Bag/Collection, Share) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      borderTop: '1px solid #eaeaec',
                      backgroundColor: '#f9f9fa'
                    }}>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        title="Delete item"
                        style={{
                          padding: '10px 0',
                          border: 'none',
                          borderRight: '1px solid #eaeaec',
                          backgroundColor: 'transparent',
                          color: '#e53935',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        🗑️
                      </button>

                      <button
                        onClick={() => handleMoveToBag(item)}
                        title="Move to Bag"
                        style={{
                          padding: '10px 0',
                          border: 'none',
                          borderRight: '1px solid #eaeaec',
                          backgroundColor: 'transparent',
                          color: '#282c3f',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ➕
                      </button>

                      <button
                        onClick={() => handleShareItem(prod)}
                        title="Share item"
                        style={{
                          padding: '10px 0',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#282c3f',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        🔗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Quick Check Bottom Sheet Portal */}
      <QuickCheckSheet 
        isOpen={!!activeQuickCheckProduct}
        onClose={() => setActiveQuickCheckProduct(null)}
        product={activeQuickCheckProduct}
        onAddToBagSuccess={handleQuickCheckAddToBag}
      />
    </div>
  );
}
