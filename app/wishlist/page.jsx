'use client';

import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';

export default function WishlistPage() {
  const { state } = useAppStore();
  const wishlistItems = state?.wishlist || [];
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6' }}>
      {/* Wishlist Header (Own Layout per architecture.md §2) */}
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
          padding: '12px 16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
              ←
            </Link>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#282c3f', margin: 0 }}>
                Wishlist
              </h1>
              <span style={{ fontSize: '11px', color: '#535766' }}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '16px', cursor: 'pointer' }}>📋</span>
            <Link href="/bag" className="icon-btn" style={{ textDecoration: 'none' }}>
              🛍️
              {bagCount > 0 && <span className="badge-count">{bagCount}</span>}
            </Link>
          </div>
        </div>

        {/* Location Bar */}
        <div className="location-bar">
          <span style={{ color: '#ff3f6c', fontSize: '13px' }}>📍</span>
          <span className="loc-text">Anupam Nagar Road - Gauripada, Thane, Kalyan, 421301...</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </div>
      </header>

      {/* Main Wishlist Body Placeholder for Phase 6 */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#535766', fontSize: '14px', marginTop: '32px' }}>
          Wishlist App Shell loaded cleanly with own header chrome.
        </p>
      </div>
    </div>
  );
}
