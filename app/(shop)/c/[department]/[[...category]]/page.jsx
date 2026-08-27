import Link from 'next/link';
import { getAllProducts } from '../../../../../lib/catalog.js';
import ProductCard from '../../../../../components/ProductCard.jsx';

const DEPT_MAP = {
  women: 'Women',
  men: 'Men',
  kids: 'Kids',
  footwear: 'Footwear',
  beauty: 'Beauty',
  accessories: 'Accessories',
  homeliving: 'HomeLiving',
  'home-living': 'HomeLiving'
};

const DEPT_TITLE_MAP = {
  Women: "Women's Fashion",
  Men: "Men's Wear",
  Kids: 'Kids Wear',
  Footwear: 'Footwear & Shoes',
  Beauty: 'Beauty & Skincare',
  Accessories: 'Bags & Accessories',
  HomeLiving: 'Home & Living'
};

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const rawDept = (resolvedParams.department || 'women').toLowerCase();
  const targetDept = DEPT_MAP[rawDept] || 'Women';
  const subcategoryArray = resolvedParams.category || [];
  const selectedSubcat = subcategoryArray.length > 0 ? subcategoryArray[0].toLowerCase() : null;

  const allProducts = getAllProducts();

  // Filter products by department
  let deptProducts = allProducts.filter(p => p.department === targetDept);

  // If subcategory filter selected, filter by subcategory
  if (selectedSubcat) {
    const subcatFiltered = deptProducts.filter(p => 
      (p.subcategory || '').toLowerCase().includes(selectedSubcat) ||
      (p.category || '').toLowerCase().includes(selectedSubcat) ||
      (p.garmentType || '').toLowerCase().includes(selectedSubcat)
    );
    if (subcatFiltered.length > 0) {
      deptProducts = subcatFiltered;
    }
  }

  // Get available subcategories for filter pill rail
  const subcatSet = new Set();
  allProducts.filter(p => p.department === targetDept).forEach(p => {
    if (p.subcategory) subcatSet.add(p.subcategory);
  });
  const subcategories = Array.from(subcatSet);

  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Category Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '12px 14px',
        borderBottom: '1px solid #eaeaec',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#282c3f' }}>
          {DEPT_TITLE_MAP[targetDept] || targetDept}
        </div>
        <div style={{ fontSize: '11px', color: '#535766' }}>
          {deptProducts.length} Products Found
        </div>
      </div>

      {/* Subcategory Filter Pill Rail */}
      {subcategories.length > 0 && (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '8px 12px',
          gap: '8px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eaeaec',
          scrollbarWidth: 'none'
        }}>
          <Link 
            href={`/c/${rawDept}`} 
            style={{
              padding: '5px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: '600',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              backgroundColor: !selectedSubcat ? '#282c3f' : '#f5f5f6',
              color: !selectedSubcat ? '#ffffff' : '#535766',
              border: '1px solid #eaeaec'
            }}
          >
            All
          </Link>
          {subcategories.map((sub, idx) => {
            const isSelected = selectedSubcat === sub.toLowerCase();
            return (
              <Link
                key={idx}
                href={`/c/${rawDept}/${encodeURIComponent(sub.toLowerCase())}`}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  backgroundColor: isSelected ? '#ff3f6c' : '#f5f5f6',
                  color: isSelected ? '#ffffff' : '#535766',
                  border: isSelected ? '1px solid #ff3f6c' : '1px solid #eaeaec'
                }}
              >
                {sub}
              </Link>
            );
          })}
        </div>
      )}

      {/* Product Grid */}
      <div style={{ padding: '12px', backgroundColor: '#f5f5f6' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          {deptProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
