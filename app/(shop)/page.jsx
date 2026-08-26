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
    </div>
  );
}
