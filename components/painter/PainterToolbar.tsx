'use client';
import React from 'react';
import { GLButton } from '@/components/gl/GLButton';

interface PainterToolbarProps {
  paintMode: boolean;
  onTogglePaintMode: () => void;
  onOpenGroupManager: () => void;
  onOpenSharedCm: () => void;
  onExportPng: () => void;
  onExportCsv: () => void;
  cMThreshold: number;
  onThresholdChange: (value: number) => void;
}

export function PainterToolbar({
  paintMode,
  onTogglePaintMode,
  onOpenGroupManager,
  onOpenSharedCm,
  onExportPng,
  onExportCsv,
  cMThreshold,
  onThresholdChange,
}: PainterToolbarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
      borderBottom: '1px solid #dce2ea', flexWrap: 'wrap',
    }}>
      {/* Paint mode toggle */}
      <GLButton
        variant={paintMode ? 'primary' : 'secondary'}
        size="sm"
        onClick={onTogglePaintMode}
      >
        <span style={{ marginRight: 6 }}>&#x1F58C;</span>
        {paintMode ? 'Exit Paint Mode' : 'Paint Mode'}
      </GLButton>

      {/* Group manager */}
      <GLButton variant="secondary" size="sm" onClick={onOpenGroupManager}>
        <span style={{ marginRight: 6 }}>&#x25CF;</span>
        Groups
      </GLButton>

      {/* Shared cM tool */}
      <GLButton variant="secondary" size="sm" onClick={onOpenSharedCm}>
        Shared cM Tool
      </GLButton>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Threshold slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#5a6f86', whiteSpace: 'nowrap' }}>
          Min cM:
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={0.5}
          value={cMThreshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          style={{ width: 100 }}
        />
        <span style={{ fontSize: 12, color: '#2d3e52', fontWeight: 600, minWidth: 32 }}>
          {cMThreshold}
        </span>
      </div>

      {/* Export */}
      <div style={{ display: 'flex', gap: 4 }}>
        <GLButton variant="secondary" size="xs" onClick={onExportPng}>PNG</GLButton>
        <GLButton variant="secondary" size="xs" onClick={onExportCsv}>CSV</GLButton>
      </div>
    </div>
  );
}
