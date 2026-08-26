'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '../../state/store.jsx';

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const { state } = useAppStore();

  const wishlistCount = state?.wishlist ? state.wishlist.length : 0;
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Shared Header Chrome */}
      <header className="shop-header">
        {/* Location Bar */}
        <div className="location-bar">
          <span style={{ color: '#ff3f6c', fontSize: '13px' }}>📍</span>
          <span>Deliver to</span>
          <span className="loc-text">Anupam Nagar Road - Gauripada, Thane, Kalyan, 421301...</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </div>

        {/* Top Search & Actions Row */}
        <div className="search-header-row">
          <Link href="/" className="brand-logo-btn" title="Myntra Home">
            M
          </Link>
          
          <Link href="/search" className="search-input-box" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            <span style={{ flex: 1, color: '#94969f' }}>Search for products, brands and more</span>
            <span style={{ fontSize: '14px' }}>🎙️</span>
            <span style={{ fontSize: '14px' }}>📷</span>
          </Link>

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
        </div>

        {/* Sub-nav Category Rail */}
        <nav className="category-tab-rail">
          <Link href="/" className={`category-tab-item ${pathname === '/' ? 'active' : ''}`}>
            ALL
          </Link>
          <Link href="/c/men" className={`category-tab-item ${pathname.includes('/c/men') ? 'active' : ''}`}>
            MEN
          </Link>
          <Link href="/c/women" className={`category-tab-item ${pathname.includes('/c/women') ? 'active' : ''}`}>
            WOMEN
          </Link>
          <Link href="/c/kids" className={`category-tab-item ${pathname.includes('/c/kids') ? 'active' : ''}`}>
            KIDS
          </Link>
          <Link href="/c/footwear" className={`category-tab-item ${pathname.includes('/c/footwear') ? 'active' : ''}`}>
            FOOTWEAR
          </Link>
          <Link href="/c/beauty" className={`category-tab-item ${pathname.includes('/c/beauty') ? 'active' : ''}`}>
            BEAUTY
          </Link>
          <Link href="/c/accessories" className={`category-tab-item ${pathname.includes('/c/accessories') ? 'active' : ''}`}>
            ACCESSORIES
          </Link>
          <Link href="/c/homeliving" className={`category-tab-item ${pathname.includes('/c/homeliving') ? 'active' : ''}`}>
            HOME & LIVING
          </Link>
        </nav>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, backgroundColor: '#f5f5f6' }}>
        {children}
      </main>

      {/* Shared Bottom Tab Bar */}
      <nav className="bottom-tab-bar">
        <Link href="/" className={`tab-link ${pathname === '/' ? 'active' : ''}`}>
          <span className="tab-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/c/women" className={`tab-link ${pathname.includes('/c/women') ? 'active' : ''}`}>
          <span className="tab-icon">⚡</span>
          <span>fwd</span>
        </Link>
        <Link href="/c/men" className={`tab-link ${pathname.includes('/c/men') ? 'active' : ''}`}>
          <span className="tab-icon">🚀</span>
          <span>mnow</span>
        </Link>
        <Link href="/c/beauty" className={`tab-link ${pathname.includes('/c/beauty') ? 'active' : ''}`}>
          <span className="tab-icon">✨</span>
          <span>LUXE</span>
        </Link>
        <Link href="/bag" className={`tab-link ${pathname === '/bag' ? 'active' : ''}`}>
          <span className="tab-icon">🛍️</span>
          <span>Bag</span>
          {bagCount > 0 && <span className="badge-count" style={{ top: '-2px', right: '4px' }}>{bagCount}</span>}
        </Link>
      </nav>
    </div>
  );
}
