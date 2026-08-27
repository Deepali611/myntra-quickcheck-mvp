'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';

export default function BagPage() {
  const { state, dispatch } = useAppStore();
  const bagItems = state?.bag || [];
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_BAG', payload: index });
    showToast('Item removed from Bag');
  };

  const handleUpdateQty = (index, delta) => {
    dispatch({ type: 'UPDATE_BAG_QTY', payload: { index, delta } });
  };

  // Price Summary Calculations
  const totalMrp = bagItems.reduce((sum, item) => {
    const p = item.product || item;
    const price = p.price || p.salePrice || 1000;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const totalSalePrice = bagItems.reduce((sum, item) => {
    const p = item.product || item;
    const salePrice = p.salePrice || p.price || 800;
    return sum + (salePrice * (item.quantity || 1));
  }, 0);

  const discountAmount = totalMrp - totalSalePrice;
  const couponDiscount = totalSalePrice > 1000 ? 300 : 0;
  const convenienceFee = bagItems.length > 0 ? 20 : 0;
  const finalAmount = Math.max(0, totalSalePrice - couponDiscount + convenienceFee);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6', paddingBottom: '90px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
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

      {/* Bag Header (architecture.md §2) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
            ←
          </Link>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              SHOPPING BAG
            </h1>
            <span style={{ fontSize: '11px', color: '#535766' }}>
              {bagItems.length} {bagItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#03a685', fontWeight: '700' }}>
          <span>🔒</span>
          <span>100% SECURE</span>
        </div>
      </header>

      {/* Bag Content */}
      {bagItems.length === 0 ? (
        <div style={{ padding: '60px 16px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '60vh' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#282c3f' }}>Hey, it feels so light!</h2>
          <p style={{ color: '#535766', fontSize: '12px', marginTop: '4px', maxWidth: '240px', margin: '6px auto 0 auto' }}>
            There is nothing in your bag. Let’s add some items to it.
          </p>
          <Link href="/wishlist" style={{
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
            ADD ITEMS FROM WISHLIST
          </Link>
        </div>
      ) : (
        <div style={{ padding: '12px' }}>
          {/* Coupon Offer Bar */}
          <div style={{
            backgroundColor: '#fff0f3',
            border: '1px solid #ffd8e0',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '11px', color: '#282c3f', fontWeight: '600' }}>
              <span style={{ color: '#ff3f6c', fontWeight: '700' }}>MYNTRA300</span> Applied (₹300 Off)
            </div>
            <span style={{ fontSize: '11px', color: '#03a685', fontWeight: '700' }}>SAVED</span>
          </div>

          {/* Bag Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {bagItems.map((item, idx) => {
              const prod = item.product || item;
              const size = item.size || 'M';
              const qty = item.quantity || 1;

              return (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #eaeaec',
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}>
                  {/* Remove Item Cross */}
                  <button 
                    onClick={() => handleRemoveItem(idx)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#94969f',
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ✕
                  </button>

                  {/* Thumbnail Photo */}
                  <div style={{ width: '70px', height: '90px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f8f8f9' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Item Specs & Controls */}
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f', textTransform: 'uppercase' }}>
                      {prod.brand}
                    </div>
                    <div style={{ fontSize: '11px', color: '#535766', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prod.name}
                    </div>

                    {/* Size & Quantity Selector Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#f5f5f6', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', color: '#282c3f' }}>
                        Size: {size}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #eaeaec', borderRadius: '4px', padding: '1px 4px' }}>
                        <button onClick={() => handleUpdateQty(idx, -1)} style={{ border: 'none', background: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: '11px', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>{qty}</span>
                        <button onClick={() => handleUpdateQty(idx, 1)} style={{ border: 'none', background: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#282c3f' }}>
                        ₹{(prod.salePrice || prod.price) * qty}
                      </span>
                      {prod.price && prod.salePrice && prod.price > prod.salePrice && (
                        <span style={{ fontSize: '10px', color: '#94969f', textDecoration: 'line-through' }}>
                          ₹{prod.price * qty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price Order Summary */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '14px', border: '1px solid #eaeaec' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#535766', textTransform: 'uppercase', marginBottom: '12px' }}>
              PRICE DETAILS ({bagItems.length} {bagItems.length === 1 ? 'Item' : 'Items'})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#282c3f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total MRP</span>
                <span>₹{totalMrp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Discount on MRP</span>
                <span style={{ color: '#03a685' }}>-₹{discountAmount}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Coupon Discount</span>
                  <span style={{ color: '#03a685' }}>-₹{couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Convenience Fee</span>
                <span>₹{convenienceFee}</span>
              </div>

              <div style={{ borderTop: '1px solid #eaeaec', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px' }}>
                <span>Total Amount</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      {bagItems.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '414px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #eaeaec',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 200,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#282c3f' }}>₹{finalAmount}</div>
            <div style={{ fontSize: '10px', color: '#ff3f6c', fontWeight: '700', cursor: 'pointer' }}>VIEW DETAILS</div>
          </div>

          <Link href="/checkout" style={{
            backgroundColor: '#ff3f6c',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            PLACE ORDER
          </Link>
        </div>
      )}
    </div>
  );
}
