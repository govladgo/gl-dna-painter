'use client';
import React from 'react';
import { ClusterRun } from '@/data/types';
import { GLButton } from '@/components/gl/GLButton';

interface ClusterCardProps {
  run: ClusterRun;
  onClick: () => void;
}

export function ClusterCard({ run, onClick }: ClusterCardProps) {
  const isSegment = run.method === 'segment-based';
  const badgeColor = isSegment ? '#4582c9' : '#ff7c11';
  const badgeLabel = isSegment ? 'Segment-based' : 'Shared Match';

  const dateStr = new Date(run.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #dce2ea',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 16px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Top row: badge + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            display: 'inline-block',
            background: badgeColor,
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 100,
            letterSpacing: 0.3,
          }}
        >
          {badgeLabel}
        </span>
        <span style={{ fontSize: 12, color: '#5a6f86' }}>{dateStr}</span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#111d2e', lineHeight: 1.3 }}>
        {run.name}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#5a6f86' }}>
        <span>
          <strong style={{ color: '#2d3e52' }}>{run.totalMatches}</strong> matches
        </span>
        <span>
          <strong style={{ color: '#2d3e52' }}>{run.clusters.length}</strong> clusters
        </span>
      </div>

      {/* Bottom: button */}
      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        <GLButton
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Results
        </GLButton>
      </div>
    </div>
  );
}
