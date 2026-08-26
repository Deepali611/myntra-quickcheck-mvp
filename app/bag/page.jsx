'use client';

import Link from 'next/link';
import { useAppStore } from '../../state/store.jsx';

export default function BagPage() {
  const { state } = useAppStore();
  const bagItems = state?.bag || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f6' }}>
      {/* Bag Header (Own Layout per architecture.md §2) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaec',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ fontSize: '18px', color: '#282c3f', textDecoration: 'none' }}>
            ←
          </Link>
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#282c3f', margin: 0 }}>
            SHOPPING BAG
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#03a685', fontWeight: 'bold' }}>
          <span>🔒</span>
          <span>100% SECURE</span>
        </div>
      </header>

      {/* Main Bag Body Placeholder for Phase 6 */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#535766', fontSize: '14px', marginTop: '32px' }}>
          Shopping Bag App Shell loaded cleanly with own header chrome.
        </p>
      </div>
    </div>
  );
}
