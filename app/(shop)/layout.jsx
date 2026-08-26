'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '../../state/store.jsx';
import { 
  SearchIcon, 
  MicIcon, 
  CameraIcon, 
  BellIcon, 
  HeartIcon, 
  BagIcon, 
  HomeIcon, 
  FwdIcon, 
  MnowIcon, 
  LuxeIcon 
} from '../../components/Icons.jsx';

export default function ShopLayout({ children }) {
  const pathname = usePathname();
  const { state } = useAppStore();

  const wishlistCount = state?.wishlist ? state.wishlist.length : 0;
  const bagCount = state?.bag ? state.bag.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, flex: 1, overflow: 'hidden' }}>
      {/* Shared Header Chrome (Fixed top) */}
      <header className="shop-header">
        {/* Location Bar */}
        <div className="location-bar">
          <span className="loc-icon">📍</span>
          <span>Deliver to</span>
          <span className="loc-text">Anupam Nagar Road - Gauripada, Thane, Kalyan, 421301...</span>
          <span className="chevron">▼</span>
        </div>

        {/* Primary Search Header Row */}
        <div className="search-header-row">
          <Link href="/" className="brand-logo-btn" title="Myntra Home">
            M
          </Link>

          <Link href="/search" className="search-input-box" style={{ textDecoration: 'none' }}>
            <SearchIcon size={15} color="#535766" />
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              readOnly
              style={{ cursor: 'pointer' }}
            />
            <MicIcon size={16} color="#535766" />
            <CameraIcon size={16} color="#535766" />
          </Link>

          <div className="header-icon-actions">
            <Link href="/wishlist" className="icon-btn" title="Wishlist">
              <HeartIcon size={21} color="#282c3f" />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>
            <Link href="/bag" className="icon-btn" title="Shopping Bag">
              <BagIcon size={20} color="#282c3f" />
              {bagCount > 0 && <span className="badge-count">{bagCount}</span>}
            </Link>
          </div>
        </div>

        {/* Sub-nav Category Tabs */}
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

      {/* Internal Scrollable Content Body Region */}
      <main className="scrollable-content">
        {children}
      </main>

      {/* Shared Bottom Tab Bar (Fixed bottom) */}
      <nav className="bottom-tab-bar">
        <Link href="/" className={`tab-link ${pathname === '/' ? 'active' : ''}`}>
          <span className="tab-icon"><HomeIcon size={20} /></span>
          <span>Home</span>
        </Link>
        <Link href="#" className="tab-link">
          <span className="tab-icon"><FwdIcon size={20} /></span>
          <span>fwd</span>
          <span className="tab-subtext">Under ₹999</span>
        </Link>
        <Link href="#" className="tab-link">
          <span className="tab-icon"><MnowIcon size={20} /></span>
          <span>mnow</span>
          <span className="tab-subtext">From 30 min</span>
        </Link>
        <Link href="#" className="tab-link">
          <span className="tab-icon"><LuxeIcon size={20} /></span>
          <span>LUXE</span>
          <span className="tab-subtext">Luxury</span>
        </Link>
        <Link href="/bag" className={`tab-link ${pathname === '/bag' ? 'active' : ''}`}>
          <span className="tab-icon"><BagIcon size={20} /></span>
          <span>Bag</span>
          {bagCount > 0 && <span className="badge-count" style={{ top: '-2px', right: '4px' }}>{bagCount}</span>}
        </Link>
      </nav>
    </div>
  );
}
