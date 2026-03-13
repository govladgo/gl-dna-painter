'use client';
import React from 'react';
import { Cluster } from '@/data/types';

interface ClusterTogglePillsProps {
  clusters: Cluster[];
  visibleClusterIds: Set<number>;
  onToggle: (clusterId: number) => void;
  onAutoPaint: (clusterId: number) => void;
}

export function ClusterTogglePills({
  clusters,
  visibleClusterIds,
  onToggle,
  onAutoPaint,
}: ClusterTogglePillsProps) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 0',
    }}>
      {clusters.map((cluster) => {
        const isVisible = visibleClusterIds.has(cluster.id);
        return (
          <div
            key={cluster.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 20,
              border: `1px solid ${isVisible ? cluster.color : '#dce2ea'}`,
              background: isVisible ? `${cluster.color}10` : 'white',
              cursor: 'pointer', fontSize: 12, userSelect: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Color dot */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: cluster.color,
              opacity: isVisible ? 1 : 0.4,
            }} />

            {/* Name + count */}
            <span
              style={{ color: isVisible ? '#2d3e52' : '#9baab9' }}
              onClick={() => onToggle(cluster.id)}
            >
              {cluster.name || `Cluster ${cluster.id}`}
              <span style={{ color: '#9baab9', marginLeft: 4 }}>
                ({cluster.matchIds.length})
              </span>
            </span>

            {/* Eye toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(cluster.id); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontSize: 14, color: isVisible ? '#5a6f86' : '#bcc7d3',
                lineHeight: 1,
              }}
              title={isVisible ? 'Hide cluster' : 'Show cluster'}
            >
              {isVisible ? '👁' : '👁‍🗨'}
            </button>

            {/* Auto-paint button */}
            <button
              onClick={(e) => { e.stopPropagation(); onAutoPaint(cluster.id); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontSize: 12, color: '#4582c9',
                lineHeight: 1, fontWeight: 600,
              }}
              title="Auto-paint all matches in this cluster"
            >
              Paint
            </button>
          </div>
        );
      })}
    </div>
  );
}
