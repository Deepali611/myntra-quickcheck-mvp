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

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Department Circle Rail (Reference Screenshot 1) */}
      <div className="dept-circle-rail">
        {DEPARTMENTS.map((dept, idx) => (
          <Link href={dept.path} key={idx} className="dept-circle-tile">
            <img src={dept.img} alt={dept.name} className="dept-circle-img" />
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

      {/* Subcategory Grid Section (Reference Screenshot 2) */}
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
    </div>
  );
}
