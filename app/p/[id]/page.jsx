import Link from 'next/link';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href="/" style={{ fontSize: '14px', color: '#ff3f6c' }}>&larr; Back</Link>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Product Details</div>
        <Link href="/bag" style={{ fontSize: '14px', color: '#282c3f' }}>Bag</Link>
      </header>
      <h1>Product {id}</h1>
      <p style={{ color: '#7e818c', marginTop: '8px' }}>Product Details Page</p>
    </div>
  );
}
