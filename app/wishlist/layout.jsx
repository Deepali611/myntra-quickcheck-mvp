'use client';

import React from 'react';

export default function WishlistLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f6' }}>
      {children}
    </div>
  );
}
