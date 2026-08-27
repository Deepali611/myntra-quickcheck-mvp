import Link from 'next/link';
import { getAllProducts } from '../../lib/catalog.js';
import ProductCard from '../../components/ProductCard.jsx';

const DEPARTMENTS = [
  { name: 'Fashion', path: '/c/women', deptKey: 'Women' },
  { name: 'Beauty', path: '/c/beauty', deptKey: 'Beauty' },
  { name: 'Home & Living', path: '/c/homeliving', deptKey: 'HomeLiving' },
  { name: 'Footwear', path: '/c/footwear', deptKey: 'Footwear' },
  { name: 'Accessories', path: '/c/accessories', deptKey: 'Accessories' },
  { name: 'Men', path: '/c/men', deptKey: 'Men' },
  { name: 'Kids', path: '/c/kids', deptKey: 'Kids' }
];

const SUBCATEGORIES = [
  { label: 'Kurta Sets', path: '/c/women/kurta_set', subcatKey: 'kurta set' },
  { label: 'Shirts', path: '/c/men/shirt', subcatKey: 'casual shirt' },
  { label: 'Jeans', path: '/c/men/jeans', subcatKey: 'jeans' },
  { label: 'T-Shirts', path: '/c/men/tshirt', subcatKey: 'tshirt' },
  { label: 'Watches', path: '/c/accessories', subcatKey: 'watch' },
  { label: 'Footwear', path: '/c/footwear', subcatKey: 'heels' },
  { label: 'Kids Wear', path: '/c/kids', subcatKey: 'boys tshirt' },
  { label: 'Lipstick', path: '/c/beauty', subcatKey: 'lipstick' },
  { label: 'Bedsheets', path: '/c/homeliving', subcatKey: 'bedsheet' },
  { label: 'Dresses', path: '/c/women/dress', subcatKey: 'dress' }
];

const BRAND_DEALS = [
  { brand: 'Libas', title: 'Min. 50% Off', bg: '#fff0f3', tag: 'Ethnic' },
  { brand: 'Roadster', title: 'Under ₹799', bg: '#f0f7ff', tag: 'Casual' },
  { brand: 'HRX', title: '40-70% Off', bg: '#fdf0ff', tag: 'Activewear' },
  { brand: 'Anouk', title: 'Flat 60% Off', bg: '#fffdf0', tag: 'Festive' }
];

export default function HomePage() {
  const allProducts = getAllProducts();

  const getDeptImage = (deptKey) => {
    const p = allProducts.find(prod => prod.department === deptKey);
    return p ? p.image : '/products/w1.jpg';
  };

  const getSubcatImage = (subcatKey) => {
    const p = allProducts.find(prod => 
      (prod.subcategory || '').toLowerCase().includes(subcatKey) || 
      (prod.category || '').toLowerCase().includes(subcatKey) ||
      (prod.garmentType || '').toLowerCase().includes(subcatKey)
    );
    return p ? p.image : '/products/w1.jpg';
  };

  const featuredProducts = allProducts.slice(0, 8);

  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Department Circle Rail with Live Scraped Myntra Product Images */}
      <div className="dept-circle-rail">
        {DEPARTMENTS.map((dept, idx) => (
          <Link href={dept.path} key={idx} className="dept-circle-tile">
            <div className="dept-circle-img-wrap">
              <img src={getDeptImage(dept.deptKey)} alt={dept.name} />
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

      {/* Subcategory Grid Section with Live Scraped Myntra Product Images */}
      <div className="subcategory-grid-section">
        <div className="section-title">Shop By Category</div>
        <div className="subcategory-grid">
          {SUBCATEGORIES.map((cat, idx) => (
            <Link href={cat.path} key={idx} className="subcategory-tile">
              <div className="subcategory-img-wrap">
                <img src={getSubcatImage(cat.subcatKey)} alt={cat.label} />
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

      {/* Featured Catalogue Product Grid */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px 12px', marginTop: '8px' }}>
        <div className="section-title">Trending Now</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
