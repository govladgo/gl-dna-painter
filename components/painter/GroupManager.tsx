'use client';
import React, { useState } from 'react';
import { PaintGroup } from '@/data/types';
import { GLButton } from '@/components/gl/GLButton';
import { GROUP_COLOR_PALETTE } from '@/data/mock/groups';

interface GroupManagerProps {
  open: boolean;
  groups: PaintGroup[];
  onClose: () => void;
  onAddGroup: (group: Omit<PaintGroup, 'id' | 'createdAt'>) => void;
  onUpdateGroup: (id: string, updates: Partial<PaintGroup>) => void;
  onDeleteGroup: (id: string) => void;
}

export function GroupManager({
  open,
  groups,
  onClose,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
}: GroupManagerProps) {
  const [newName, setNewName] = useState('');
  const [newSide, setNewSide] = useState<PaintGroup['side']>('unknown');
  const [newColor, setNewColor] = useState(GROUP_COLOR_PALETTE[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddGroup({ name: newName.trim(), color: newColor, side: newSide });
    setNewName('');
    setNewColor(GROUP_COLOR_PALETTE[(groups.length + 1) % GROUP_COLOR_PALETTE.length]);
  };

  return (
    <div
      className={`group-panel${open ? ' group-panel--open' : ''}`}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 340, background: 'white', zIndex: 200,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #dce2ea',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#2d3e52' }}>
          Ancestor Groups
        </h3>
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

      {/* Group list */}
      <div className="custom-scrollbar" style={{
        flex: 1, overflowY: 'auto', padding: '12px 20px',
      }}>
        {groups.map(group => (
          <div key={group.id} style={{
            padding: '10px 12px', borderRadius: 8, marginBottom: 8,
            border: '1px solid #dce2ea', background: `${group.color}08`,
          }}>
            {editingId === group.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => onUpdateGroup(group.id, { name: e.target.value })}
                  style={{
                    padding: '4px 8px', border: '1px solid #dce2ea',
                    borderRadius: 4, fontSize: 13,
                  }}
                />
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {GROUP_COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      onClick={() => onUpdateGroup(group.id, { color: c })}
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: c, border: c === group.color ? '2px solid #2d3e52' : '2px solid transparent',
                        cursor: 'pointer', padding: 0,
                      }}
                    />
                  ))}
                </div>
                <select
                  value={group.side}
                  onChange={(e) => onUpdateGroup(group.id, { side: e.target.value as PaintGroup['side'] })}
                  style={{
                    padding: '4px 8px', border: '1px solid #dce2ea',
                    borderRadius: 4, fontSize: 12,
                  }}
                >
                  <option value="paternal">Paternal</option>
                  <option value="maternal">Maternal</option>
                  <option value="unknown">Unknown</option>
                </select>
                <GLButton size="xs" variant="secondary" onClick={() => setEditingId(null)}>
                  Done
                </GLButton>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: group.color, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#2d3e52' }}>
                    {group.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#7b8fa3', textTransform: 'capitalize' }}>
                    {group.side}
                  </div>
                </div>
                <button
                  onClick={() => setEditingId(group.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, color: '#4582c9', padding: 4,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteGroup(group.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, color: '#d52c43', padding: 4,
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new group */}
      <div style={{
        padding: '16px 20px', borderTop: '1px solid #dce2ea',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#5a6f86', marginBottom: 8 }}>
          Add New Group
        </div>
        <input
          type="text"
          placeholder="Group name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{
            width: '100%', padding: '6px 10px', border: '1px solid #dce2ea',
            borderRadius: 6, fontSize: 13, marginBottom: 8,
          }}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {GROUP_COLOR_PALETTE.map(c => (
            <button
              key={c}
              onClick={() => setNewColor(c)}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c, border: c === newColor ? '2px solid #2d3e52' : '2px solid transparent',
                cursor: 'pointer', padding: 0,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={newSide}
            onChange={(e) => setNewSide(e.target.value as PaintGroup['side'])}
            style={{
              padding: '6px 8px', border: '1px solid #dce2ea',
              borderRadius: 6, fontSize: 12, flex: 1,
            }}
          >
            <option value="paternal">Paternal</option>
            <option value="maternal">Maternal</option>
            <option value="unknown">Unknown</option>
          </select>
          <GLButton variant="primary" size="sm" onClick={handleAdd}>
            Add Group
          </GLButton>
        </div>
      </div>
    </div>
  );
}
