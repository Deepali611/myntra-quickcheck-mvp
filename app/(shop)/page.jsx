import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Myntra Quick Check MVP</h1>
      <p style={{ color: '#7e818c', marginBottom: '24px' }}>
        Resolve purchase doubts in seconds inside the wishlist.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <Link href="/c/women" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Women
        </Link>
        <Link href="/c/men" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Men
        </Link>
        <Link href="/c/kids" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Kids
        </Link>
        <Link href="/c/footwear" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Footwear
        </Link>
        <Link href="/c/beauty" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Beauty (Tier 2)
        </Link>
        <Link href="/c/accessories" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Accessories (Tier 2)
        </Link>
        <Link href="/c/homeliving" style={{ padding: '16px', background: '#f5f5f6', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          Home & Living (Tier 2)
        </Link>
      </div>
    </div>
  );
}
