'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';
import { isWishlistEligible } from '../../data/seedWishlist.js';
import { BagIcon } from '../../components/Icons.jsx';

export default function WishlistPage() {
  const { state, dispatch } = useAppStore();
  const wishlistItems = state?.wishlist || [];
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  const [toastMessage, setToastMessage] = useState('');

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

  const handleTriggerQuickCheck = (item) => {
    const prod = item.product || item;
    showToast(`Quick Check opened for ${prod.brand} ${prod.name}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6', paddingBottom: '32px' }}>
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
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Wishlist Own Header (architecture.md §2) */}
      <header style={{
        position: 'sticky',
        top: 0,
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
                My Wishlist
              </h1>
              <span style={{ fontSize: '11px', color: '#535766', fontWeight: '500' }}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        {/* Location Bar */}
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

      {/* Main Wishlist Body */}
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
        <div style={{ padding: '12px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {wishlistItems.map((item) => {
              const prod = item.product || item;
              const eligible = isWishlistEligible(item);
              const discount = prod.discount || (prod.price && prod.salePrice ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100) : 0);

              return (
                <div key={item.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #eaeaec',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {/* Remove Button Cross */}
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      color: '#535766',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                    }}
                    title="Remove item"
                  >
                    ✕
                  </button>

                  {/* Product Image Link */}
                  <Link href={`/p/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f8f8f9', width: '100%' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {prod.department === 'Beauty' && (
                        <span style={{
                          position: 'absolute',
                          bottom: '6px',
                          left: '6px',
                          backgroundColor: '#282c3f',
                          color: '#ffffff',
                          fontSize: '9px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          Beauty
                        </span>
                      )}
                    </div>

                    {/* Content Block */}
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
                  </Link>

                  {/* Full-Width "👁 Quick Check" Button (Eligible cards only) */}
                  {eligible && (
                    <div style={{ padding: '0 8px 6px 8px' }}>
                      <button
                        onClick={() => handleTriggerQuickCheck(item)}
                        style={{
                          width: '100%',
                          padding: '7px 0',
                          backgroundColor: '#fff0f3',
                          border: '1px solid #ff3f6c',
                          borderRadius: '4px',
                          color: '#ff3f6c',
                          fontSize: '11px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          letterSpacing: '0.2px'
                        }}
                      >
                        <span style={{ fontSize: '12px' }}>👁</span>
                        <span>Quick Check</span>
                      </button>
                    </div>
                  )}

                  {/* Move to Bag Action Button */}
                  <div style={{ marginTop: 'auto', borderTop: '1px solid #eaeaec' }}>
                    <button
                      onClick={() => handleMoveToBag(item)}
                      style={{
                        width: '100%',
                        padding: '9px 0',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        color: '#ff3f6c',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      MOVE TO BAG
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
