'use client';

import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6' }}>
      {/* Checkout Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
          ←
        </Link>
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#282c3f', margin: 0 }}>
          ORDER CONFIRMATION
        </h1>
      </header>

      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', color: '#03a685', marginBottom: '8px' }}>✓ Order Placed Successfully</h2>
        <p style={{ color: '#535766', fontSize: '14px', marginBottom: '24px' }}>
          Thank you for shopping! Your order confirmation has been generated.
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: '#ff3f6c',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
