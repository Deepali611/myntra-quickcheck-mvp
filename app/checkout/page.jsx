'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';

export default function CheckoutPage() {
  const { state, dispatch } = useAppStore();
  const bagItems = state?.bag || [];
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const totalAmount = bagItems.reduce((sum, item) => {
    const p = item.product || item;
    return sum + ((p.salePrice || p.price || 500) * (item.quantity || 1));
  }, 0);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    dispatch({ type: 'CLEAR_BAG' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6', paddingBottom: '32px' }}>
      {/* Checkout Header */}
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
          <Link href="/bag" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
            ←
          </Link>
          <h1 style={{ fontSize: '15px', fontWeight: '800', color: '#282c3f', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            PAYMENT & CHECKOUT
          </h1>
        </div>
        <div style={{ fontSize: '10px', color: '#03a685', fontWeight: '700' }}>
          🔒 100% SECURE
        </div>
      </header>

      {orderConfirmed ? (
        <div style={{ padding: '48px 16px', textAlign: 'center', backgroundColor: '#ffffff', minHeight: '70vh' }}>
          <div style={{ fontSize: '48px', color: '#03a685', marginBottom: '12px' }}>✓</div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#282c3f' }}>Order Placed Successfully!</h2>
          <p style={{ color: '#535766', fontSize: '12px', marginTop: '6px', maxWidth: '260px', margin: '6px auto 0 auto', lineHeight: '1.5' }}>
            Thank you for your purchase. Order confirmation #MYN-{Math.floor(100000 + Math.random() * 900000)} has been dispatched.
          </p>

          <Link href="/" style={{
            display: 'inline-block',
            marginTop: '24px',
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
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div style={{ padding: '12px' }}>
          {/* Delivery Address Section */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '14px', marginBottom: '12px', border: '1px solid #eaeaec' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#535766', textTransform: 'uppercase', marginBottom: '8px' }}>
              DELIVERY ADDRESS
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#282c3f' }}>Anupam Nagar Road</div>
            <div style={{ fontSize: '11px', color: '#535766', marginTop: '2px', lineHeight: '1.4' }}>
              Gauripada, Thane, Kalyan, 421301 · Mobile: +91 9876543210
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '14px', marginBottom: '16px', border: '1px solid #eaeaec' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#535766', textTransform: 'uppercase', marginBottom: '12px' }}>
              SELECT PAYMENT MODE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'UPI', label: 'Google Pay / PhonePe / BHIM UPI', badge: 'RECOMMENDED' },
                { id: 'CARD', label: 'Credit / Debit Card', badge: 'INSTANT' },
                { id: 'COD', label: 'Cash On Delivery', badge: 'AVAILABLE' }
              ].map(opt => (
                <label 
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '6px',
                    border: paymentMethod === opt.id ? '2px solid #ff3f6c' : '1px solid #eaeaec',
                    backgroundColor: paymentMethod === opt.id ? '#fff0f3' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === opt.id} 
                      onChange={() => setPaymentMethod(opt.id)}
                      style={{ accentColor: '#ff3f6c' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#282c3f' }}>{opt.label}</span>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: '#03a685', backgroundColor: '#e6f7f4', padding: '2px 6px', borderRadius: '4px' }}>
                    {opt.badge}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Total Payable & Confirm Action */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '14px', border: '1px solid #eaeaec' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: '#535766', fontWeight: '600' }}>Total Amount Payable</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#282c3f' }}>₹{totalAmount || 0}</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              style={{
                width: '100%',
                padding: '13px 0',
                backgroundColor: '#ff3f6c',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer'
              }}
            >
              PAY & CONFIRM ORDER
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
