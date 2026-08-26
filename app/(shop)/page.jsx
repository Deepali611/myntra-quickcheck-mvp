import Link from 'next/link';

const DEPARTMENTS = [
  { name: 'Fashion', path: '/c/women', img: '/products/w1.jpg' },
  { name: 'Beauty', path: '/c/beauty', img: '/products/b1.jpg' },
  { name: 'Home & Living', path: '/c/homeliving', img: '/products/h1.jpg' },
  { name: 'Footwear', path: '/c/footwear', img: '/products/f1.jpg' },
  { name: 'Accessories', path: '/c/accessories', img: '/products/a1.jpg' },
  { name: 'Men', path: '/c/men', img: '/products/m1.jpg' },
  { name: 'Kids', path: '/c/kids', img: '/products/k1.jpg' }
];

const SUBCATEGORIES = [
  { label: 'Kurta Sets', path: '/c/women/kurta_set', img: '/products/w1.jpg' },
  { label: 'Shirts', path: '/c/men/shirt', img: '/products/m1.jpg' },
  { label: 'Jeans', path: '/c/women/jeans', img: '/products/w15.jpg' },
  { label: 'T-Shirts', path: '/c/men/tshirt', img: '/products/m5.jpg' },
  { label: 'Footwear', path: '/c/footwear', img: '/products/f1.jpg' },
  { label: 'Kids Wear', path: '/c/kids', img: '/products/k1.jpg' },
  { label: 'Lipsticks', path: '/c/beauty', img: '/products/b1.jpg' },
  { label: 'Bedsheets', path: '/c/homeliving', img: '/products/h1.jpg' },
  { label: 'Handbags', path: '/c/accessories', img: '/products/a1.jpg' },
  { label: 'Dresses', path: '/c/women/dress', img: '/products/w3.jpg' }
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
      {/* Department Circle Rail with Soft Muted Photographic Thumbnails */}
      <div className="dept-circle-rail">
        {DEPARTMENTS.map((dept, idx) => (
          <Link href={dept.path} key={idx} className="dept-circle-tile">
            <div className="dept-circle-img-wrap">
              <img src={dept.img} alt={dept.name} />
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
              <div className="subcategory-img-wrap">
                <img src={cat.img} alt={cat.label} />
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
    </div>
  );
}
