import Link from 'next/link';

const DEPARTMENTS = [
  { name: 'Fashion', path: '/c/women', icon: '👗' },
  { name: 'Beauty', path: '/c/beauty', icon: '💄' },
  { name: 'Home & Living', path: '/c/homeliving', icon: '🛋️' },
  { name: 'Footwear', path: '/c/footwear', icon: '👠' },
  { name: 'Accessories', path: '/c/accessories', icon: '👜' },
  { name: 'Men', path: '/c/men', icon: '👔' },
  { name: 'Kids', path: '/c/kids', icon: '🧸' }
];

const SUBCATEGORIES = [
  { label: 'Kurta Sets', path: '/c/women/kurta_set', icon: '🥻' },
  { label: 'Shirts', path: '/c/men/shirt', icon: '👔' },
  { label: 'Jeans', path: '/c/women/jeans', icon: '👖' },
  { label: 'T-Shirts', path: '/c/men/tshirt', icon: '👕' },
  { label: 'Footwear', path: '/c/footwear', icon: '👟' },
  { label: 'Kids Wear', path: '/c/kids', icon: '👶' },
  { label: 'Lipsticks', path: '/c/beauty', icon: '💄' },
  { label: 'Bedsheets', path: '/c/homeliving', icon: '🛏️' },
  { label: 'Handbags', path: '/c/accessories', icon: '👜' },
  { label: 'Dresses', path: '/c/women/dress', icon: '👗' }
];

const BRAND_DEALS = [
  { brand: 'Libas', title: 'Min. 50% Off', bg: '#fff0f3', tag: 'Ethnic' },
  { brand: 'Roadster', title: 'Under ₹799', bg: '#f0f7ff', tag: 'Casual' },
  { brand: 'HRX', title: '40-70% Off', bg: '#fdf0ff', tag: 'Activewear' },
  { brand: 'Anouk', title: 'Flat 60% Off', bg: '#fffdf0', tag: 'Festive' }
];

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Department Circle Rail with Dedicated Icons */}
      <div className="dept-circle-rail">
        {DEPARTMENTS.map((dept, idx) => (
          <Link href={dept.path} key={idx} className="dept-circle-tile">
            <div className="dept-icon-circle">
              {dept.icon}
            </div>
            <span className="dept-circle-label">{dept.name}</span>
          </Link>
        ))}
      </div>

      {/* Promo Coupon Banner */}
      <div className="promo-coupon-banner">
        <div>
          <div className="promo-title">Flat ₹300 Off</div>
          <div style={{ fontSize: '10px', color: '#535766', marginTop: '2px' }}>On your first order | T&C apply</div>
        </div>
        <div className="promo-code-badge">
          MYNTRA300
        </div>
      </div>

      {/* Subcategory Grid Section */}
      <div className="subcategory-grid-section">
        <div className="section-title">Shop By Category</div>
        <div className="subcategory-grid">
          {SUBCATEGORIES.map((cat, idx) => (
            <Link href={cat.path} key={idx} className="subcategory-tile">
              <div className="subcategory-icon-wrap">
                {cat.icon}
              </div>
              <span className="subcategory-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Grand Festive Banner */}
      <div style={{ margin: '12px', padding: '16px', background: 'linear-gradient(135deg, #ff3f6c 0%, #ff527b 100%)', borderRadius: '12px', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', opacity: 0.9 }}>
          Grand Festive Fiesta
        </div>
        <div style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0 8px 0' }}>
          Up To 70% Off On All Top Brands
        </div>
        <div style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#ff3f6c', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
          Explore Now →
        </div>
      </div>

      {/* Trending Brands Section */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px 12px', marginTop: '8px' }}>
        <div className="section-title">Top Brand Offers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {BRAND_DEALS.map((deal, idx) => (
            <div key={idx} style={{ backgroundColor: deal.bg, padding: '14px', borderRadius: '10px', border: '1px solid #eaeaec' }}>
              <div style={{ fontSize: '10px', color: '#535766', textTransform: 'uppercase', fontWeight: 'bold' }}>{deal.tag}</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#282c3f', marginTop: '2px' }}>{deal.brand}</div>
              <div style={{ fontSize: '12px', color: '#ff3f6c', fontWeight: 'bold', marginTop: '4px' }}>{deal.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Add Feature Banner */}
      <div style={{ margin: '12px', padding: '14px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #eaeaec', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#282c3f' }}>Express 2-Day Delivery</div>
            <div style={{ fontSize: '10px', color: '#535766' }}>Available on 10,000+ top wishlist picks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
