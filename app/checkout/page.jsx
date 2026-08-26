import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #eaeaec', pb: '12px' }}>
        <h1 style={{ fontSize: '16px' }}>Order Confirmation</h1>
      </header>
      <p style={{ color: '#7e818c' }}>Static order confirmation screen.</p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '16px', color: '#ff3f6c' }}>Continue Shopping</Link>
    </div>
  );
}
