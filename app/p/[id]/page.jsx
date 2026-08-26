'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '../../../state/store.jsx';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams?.id;

  const { state } = useAppStore();
  const wishlistCount = state?.wishlist ? state.wishlist.length : 0;
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* PDP Full-Bleed Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
          ←
        </Link>

        <div className="search-input-box" style={{ flex: 1 }}>
          <span style={{ color: '#ff3f6c', fontWeight: 'bold' }}>M</span>
          <span style={{ flex: 1, color: '#94969f', fontSize: '12px' }}>Search in Myntra</span>
          <span style={{ fontSize: '12px' }}>🔍</span>
        </div>

        <div className="header-icon-actions">
          <Link href="/wishlist" className="icon-btn" title="Wishlist">
            ❤️
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </Link>
          <Link href="/bag" className="icon-btn" title="Shopping Bag">
            🛍️
            {bagCount > 0 && <span className="badge-count">{bagCount}</span>}
          </Link>
        </div>
      </header>

      <div style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Product Detail Page ({id})</h2>
        <p style={{ color: '#535766', fontSize: '13px' }}>
          Full-bleed PDP App Shell loaded without shared bottom tab bar per architecture.md §2.
        </p>
      </div>
    </div>
  );
}
