'use client';
import React from 'react';

export function Header() {
  return (
    <header
      style={{
        width: '100%',
        background: '#111d2e',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
        <span
          style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          GENOMELINK
        </span>
        <span style={{ color: '#8a9bb0', fontSize: 12, lineHeight: 1 }}>
          DNA Match Clusters
        </span>
      </div>

      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#4582c9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        VK
      </div>
    </header>
  );
}
