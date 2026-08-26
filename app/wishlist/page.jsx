import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eaeaec', pb: '12px' }}>
        <Link href="/" style={{ fontSize: '14px', color: '#ff3f6c' }}>&larr; Home</Link>
        <h1 style={{ fontSize: '16px' }}>My Wishlist</h1>
        <Link href="/bag" style={{ fontSize: '14px', color: '#282c3f' }}>Bag</Link>
      </header>
      <p style={{ color: '#7e818c' }}>Wishlist items with Quick Check entry points...</p>
    </div>
  );
}
