import Link from 'next/link';

export default function ShopLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff3f6c' }}>
          MYNTRA
        </Link>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <Link href="/search" style={{ color: '#282c3f' }}>Search</Link>
          <Link href="/wishlist" style={{ color: '#282c3f' }}>Wishlist</Link>
          <Link href="/bag" style={{ color: '#282c3f' }}>Bag</Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <nav style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eaeaec',
        display: 'flex',
        justify: 'space-around',
        padding: '8px 0',
        fontSize: '12px',
        color: '#282c3f'
      }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Home</Link>
        <Link href="/c/women" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Categories</Link>
        <Link href="/search" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Search</Link>
        <Link href="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Wishlist</Link>
        <Link href="/bag" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Bag</Link>
      </nav>
    </div>
  );
}
