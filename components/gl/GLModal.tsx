'use client';
import React, { useEffect, useCallback } from 'react';

interface GLModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function GLModal({ open, onClose, title, children, size = 'md' }: GLModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const widths = { sm: 400, md: 560, lg: 720 };

  return (
    <div
      className="gl-modal-overlay"
      style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 1000,
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="gl-modal"
        style={{ background: 'white', borderRadius: 16, padding: 32,
          maxWidth: widths[size], width: '90vw', maxHeight: '85vh',
          overflow: 'auto', position: 'relative' }}
      >
        <button
          className="gl-modal__close"
          aria-label="Close"
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none',
            border: 'none', cursor: 'pointer', padding: 4, fontSize: 20, color: '#5a6f86' }}
        >
          &#x2715;
        </button>
        {title && <h2 className="gl-h3" style={{ marginBottom: 16, paddingRight: 32 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
