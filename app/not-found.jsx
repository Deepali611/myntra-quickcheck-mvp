import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ color: '#7e818c', marginBottom: '16px' }}>We couldn't find the page you were looking for.</p>
      <Link href="/" style={{ color: '#ff3f6c', fontWeight: 'bold' }}>Return to Home</Link>
    </div>
  );
}
