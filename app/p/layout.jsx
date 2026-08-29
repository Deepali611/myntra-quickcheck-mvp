'use client';

import React from 'react';

export default function PDPLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, flex: 1, overflow: 'hidden', backgroundColor: '#ffffff' }}>
      {children}
    </div>
  );
}
