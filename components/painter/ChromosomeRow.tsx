'use client';
import React, { useRef } from 'react';
import { ChromosomeInfo, PaintedSegment } from '@/data/types';

interface ChromosomeRowProps {
  chrInfo: ChromosomeInfo;
  maxLengthMb: number;
  segments: PaintedSegment[];
  previewSegments: PaintedSegment[];
  selectedSegmentId: string | null;
  onSegmentClick: (segmentId: string) => void;
  onSegmentHover: (segmentId: string | null, event?: React.MouseEvent) => void;
}

export function ChromosomeRow({
  chrInfo,
  maxLengthMb,
  segments,
  previewSegments,
  selectedSegmentId,
  onSegmentClick,
  onSegmentHover,
}: ChromosomeRowProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const widthPct = (chrInfo.lengthMb / maxLengthMb) * 100;

  const getSegmentStyle = (seg: PaintedSegment): React.CSSProperties => {
    const left = (seg.startBp / 1_000_000 / chrInfo.lengthMb) * 100;
    const width = ((seg.endBp - seg.startBp) / 1_000_000 / chrInfo.lengthMb) * 100;
    return {
      position: 'absolute',
      left: `${left}%`,
      width: `${Math.max(width, 0.5)}%`,
      top: seg.side === 'paternal' ? 0 : '50%',
      height: '50%',
      backgroundColor: seg.color,
      cursor: 'pointer',
      borderRadius: 1,
      transition: 'opacity 0.15s ease, filter 0.15s ease',
    };
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
      {/* Chromosome number */}
      <div style={{
        width: 28, textAlign: 'right', fontSize: 11, color: '#5a6f86',
        fontWeight: 500, flexShrink: 0,
      }}>
        {chrInfo.chromosome}
      </div>

      {/* Chromosome bar container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          ref={barRef}
          style={{
            width: `${widthPct}%`,
            height: 24,
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            background: '#edf1f5',
            border: '1px solid #dce2ea',
          }}
        >
          {/* Midline divider between paternal/maternal */}
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1, background: '#dce2ea', zIndex: 1,
          }} />

          {/* Painted segments */}
          {segments.map((seg) => (
            <div
              key={seg.id}
              className={`chromosome-segment${
                selectedSegmentId === seg.id ? ' chromosome-segment--selected' : ''
              }`}
              style={getSegmentStyle(seg)}
              onClick={(e) => { e.stopPropagation(); onSegmentClick(seg.id); }}
              onMouseEnter={(e) => onSegmentHover(seg.id, e)}
              onMouseLeave={() => onSegmentHover(null)}
            >
              {/* Triangulation badge */}
              {seg.isTriangulated && (
                <div className="triangulation-badge" style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#ff7c11', border: '1.5px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 6, color: 'white', fontWeight: 700 }}>T</span>
                </div>
              )}
            </div>
          ))}

          {/* Preview segments (semi-transparent, striped) */}
          {previewSegments.map((seg) => (
            <div
              key={`preview-${seg.id}`}
              className="chromosome-segment chromosome-segment--preview"
              style={{
                ...getSegmentStyle(seg),
                opacity: 0.5,
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Length label */}
      <div style={{
        width: 48, fontSize: 10, color: '#9baab9',
        textAlign: 'right', flexShrink: 0,
      }}>
        {chrInfo.lengthMb.toFixed(0)} Mb
      </div>
    </div>
  );
}
