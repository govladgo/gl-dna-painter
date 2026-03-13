'use client';
import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: string[];
}

export function PageShell({ children, title, breadcrumb }: PageShellProps) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '24px 24px',
      }}
    >
      {breadcrumb && breadcrumb.length > 0 && (
        <nav style={{ marginBottom: 12, fontSize: 13, color: '#5a6f86' }}>
          {breadcrumb.map((item, i) => (
            <span key={i}>
              {i > 0 && (
                <span style={{ margin: '0 6px', color: '#8a9bb0' }}>&gt;</span>
              )}
              <span
                style={{
                  color: i === breadcrumb.length - 1 ? '#2d3e52' : '#5a6f86',
                  fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
                }}
              >
                {item}
              </span>
            </span>
          ))}
        </nav>
      )}

      {title && (
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#111d2e',
            margin: '0 0 24px 0',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>
      )}

      {children}
    </div>
  );
}
