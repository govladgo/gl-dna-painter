'use client';
import React, { useState } from 'react';
import { PaintedSegment, PaintGroup, Note } from '@/data/types';
import { GLButton } from '@/components/gl/GLButton';

interface SegmentDetailDrawerProps {
  segment: PaintedSegment | null;
  groups: PaintGroup[];
  notes: Note[];
  onClose: () => void;
  onAssignGroup: (segmentId: string, groupId: string | null) => void;
  onAddNote: (segmentId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateNoteStatus: (noteId: string, status: Note['status']) => void;
}

export function SegmentDetailDrawer({
  segment,
  groups,
  notes,
  onClose,
  onAssignGroup,
  onAddNote,
  onDeleteNote,
  onUpdateNoteStatus,
}: SegmentDetailDrawerProps) {
  const [noteText, setNoteText] = useState('');

  if (!segment) return null;

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(segment.id, noteText.trim());
      setNoteText('');
    }
  };

  const formatBp = (bp: number) => `${(bp / 1_000_000).toFixed(1)} Mb`;

  return (
    <div className={`detail-drawer detail-drawer--open`} style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'white', borderTop: '1px solid #dce2ea',
      borderRadius: '16px 16px 0 0', maxHeight: '40vh', overflow: 'auto',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
    }}>
      <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#2d3e52' }}>
              Segment Detail
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#5a6f86' }}>
              {segment.matchName} · Chr {segment.chromosome}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 18, color: '#5a6f86', padding: 4,
            }}
          >
            &#x2715;
          </button>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Segment info */}
          <div style={{ flex: '1 1 240px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px',
              fontSize: 13,
            }}>
              <span style={{ color: '#7b8fa3' }}>Chromosome</span>
              <span style={{ color: '#2d3e52', fontWeight: 500 }}>{segment.chromosome}</span>
              <span style={{ color: '#7b8fa3' }}>Position</span>
              <span style={{ color: '#2d3e52', fontWeight: 500 }}>
                {formatBp(segment.startBp)} – {formatBp(segment.endBp)}
              </span>
              <span style={{ color: '#7b8fa3' }}>Size</span>
              <span style={{ color: '#2d3e52', fontWeight: 500 }}>
                {segment.cM.toFixed(1)} cM · {segment.snps.toLocaleString()} SNPs
              </span>
              <span style={{ color: '#7b8fa3' }}>Side</span>
              <span style={{ color: '#2d3e52', fontWeight: 500, textTransform: 'capitalize' }}>
                {segment.side}
              </span>
              <span style={{ color: '#7b8fa3' }}>Triangulated</span>
              <span style={{ color: segment.isTriangulated ? '#7abf43' : '#9baab9', fontWeight: 500 }}>
                {segment.isTriangulated ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Group assignment */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 12, color: '#5a6f86', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Assign to Group
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={() => onAssignGroup(segment.id, null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', borderRadius: 6, fontSize: 12,
                  border: `1px solid ${!segment.groupId ? '#4582c9' : '#dce2ea'}`,
                  background: !segment.groupId ? '#f0f6ff' : 'white',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#dce2ea',
                }} />
                No group
              </button>
              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => onAssignGroup(segment.id, group.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 6, fontSize: 12,
                    border: `1px solid ${segment.groupId === group.id ? group.color : '#dce2ea'}`,
                    background: segment.groupId === group.id ? `${group.color}15` : 'white',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: group.color,
                  }} />
                  {group.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ fontSize: 12, color: '#5a6f86', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Notes
            </label>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                style={{
                  flex: 1, padding: '6px 10px', border: '1px solid #dce2ea',
                  borderRadius: 6, fontSize: 12, outline: 'none',
                }}
              />
              <GLButton variant="primary" size="xs" onClick={handleAddNote}>Add</GLButton>
            </div>
            <div style={{ maxHeight: 120, overflowY: 'auto' }}>
              {notes.map(note => (
                <div key={note.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  padding: '4px 0', fontSize: 12, color: '#2d3e52',
                }}>
                  <button
                    onClick={() => {
                      const statuses: Note['status'][] = ['todo', 'in-progress', 'done'];
                      const next = statuses[(statuses.indexOf(note.status) + 1) % 3];
                      onUpdateNoteStatus(note.id, next);
                    }}
                    style={{
                      width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                      marginTop: 1, cursor: 'pointer',
                      border: `1px solid ${note.status === 'done' ? '#7abf43' : '#dce2ea'}`,
                      background: note.status === 'done' ? '#7abf43' : note.status === 'in-progress' ? '#ffb300' : 'white',
                    }}
                  />
                  <span style={{
                    flex: 1,
                    textDecoration: note.status === 'done' ? 'line-through' : 'none',
                    color: note.status === 'done' ? '#9baab9' : '#2d3e52',
                  }}>
                    {note.text}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9baab9', fontSize: 12, padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
