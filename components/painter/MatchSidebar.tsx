'use client';
import React, { useState, useMemo } from 'react';
import { DNAMatch, PaintedSegment } from '@/data/types';
import { GLButton } from '@/components/gl/GLButton';

interface MatchSidebarProps {
  matches: DNAMatch[];
  paintedSegments: PaintedSegment[];
  activeMatchId: string | null;
  paintMode: boolean;
  cMThreshold: number;
  onPaintMatch: (matchId: string) => void;
  onUnpaintMatch: (matchId: string) => void;
  onPreviewMatch: (matchId: string | null) => void;
  onSelectMatch: (matchId: string) => void;
}

export function MatchSidebar({
  matches,
  paintedSegments,
  activeMatchId,
  paintMode,
  cMThreshold,
  onPaintMatch,
  onUnpaintMatch,
  onPreviewMatch,
  onSelectMatch,
}: MatchSidebarProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'cM' | 'name'>('cM');

  const paintedMatchIds = useMemo(
    () => new Set(paintedSegments.map(s => s.matchId)),
    [paintedSegments]
  );

  const filteredMatches = useMemo(() => {
    let result = matches.filter(m =>
      m.segments.length > 0 &&
      m.segments.some(s => s.cM >= cMThreshold) &&
      (search === '' || m.name.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === 'cM') {
      result = [...result].sort((a, b) => b.sharedCM - a.sharedCM);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [matches, cMThreshold, search, sortBy]);

  return (
    <div style={{
      width: 280, borderLeft: '1px solid #dce2ea', background: 'white',
      display: 'flex', flexDirection: 'column', height: '100%',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #dce2ea' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#2d3e52' }}>
          Matches ({filteredMatches.length})
        </h3>
        <input
          type="text"
          placeholder="Search matches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', marginTop: 8, padding: '6px 10px',
            border: '1px solid #dce2ea', borderRadius: 6, fontSize: 12,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <button
            onClick={() => setSortBy('cM')}
            style={{
              padding: '2px 8px', borderRadius: 4, fontSize: 11,
              border: '1px solid #dce2ea', cursor: 'pointer',
              background: sortBy === 'cM' ? '#4582c9' : 'white',
              color: sortBy === 'cM' ? 'white' : '#5a6f86',
            }}
          >
            By cM
          </button>
          <button
            onClick={() => setSortBy('name')}
            style={{
              padding: '2px 8px', borderRadius: 4, fontSize: 11,
              border: '1px solid #dce2ea', cursor: 'pointer',
              background: sortBy === 'name' ? '#4582c9' : 'white',
              color: sortBy === 'name' ? 'white' : '#5a6f86',
            }}
          >
            By Name
          </button>
        </div>
      </div>

      {/* Match list */}
      <div className="custom-scrollbar" style={{
        flex: 1, overflowY: 'auto', padding: 8,
      }}>
        {filteredMatches.map((match) => {
          const isPainted = paintedMatchIds.has(match.id);
          const isActive = activeMatchId === match.id;
          return (
            <div
              key={match.id}
              style={{
                padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                border: `1px solid ${isActive ? '#4582c9' : 'transparent'}`,
                background: isActive ? '#f0f6ff' : isPainted ? '#f0fdf4' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onClick={() => onSelectMatch(match.id)}
              onMouseEnter={() => paintMode && !isPainted && onPreviewMatch(match.id)}
              onMouseLeave={() => paintMode && onPreviewMatch(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: match.avatarColor, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, color: 'white',
                  flexShrink: 0,
                }}>
                  {match.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: '#2d3e52',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {match.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#7b8fa3' }}>
                    {match.sharedCM} cM · {match.segments.length} seg
                  </div>
                </div>
                {/* Paint/Unpaint button */}
                {paintMode && (
                  <GLButton
                    variant={isPainted ? 'error' : 'primary'}
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPainted) { onUnpaintMatch(match.id); } else { onPaintMatch(match.id); }
                    }}
                    style={{ flexShrink: 0 }}
                  >
                    {isPainted ? '✕' : 'Paint'}
                  </GLButton>
                )}
                {!paintMode && isPainted && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#7abf43', flexShrink: 0,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
