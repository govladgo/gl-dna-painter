'use client';
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { ClusterRun, PaintedSegment, PaintGroup, Note } from '@/data/types';
import { CHROMOSOME_DATA, MAX_CHROMOSOME_LENGTH_MB } from '@/data/mock/chromosomeLengths';
import { mockMatches } from '@/data/mock/matches';
import { INITIAL_GROUPS } from '@/data/mock/groups';
import { ChromosomeRow } from './ChromosomeRow';
import { PainterToolbar } from './PainterToolbar';
import { ClusterTogglePills } from './ClusterTogglePills';
import { MatchSidebar } from './MatchSidebar';
import { SegmentDetailDrawer } from './SegmentDetailDrawer';
import { GroupManager } from './GroupManager';
import { SharedCmTool } from '@/components/tools/SharedCmTool';

const STORAGE_KEY_SEGMENTS = 'dna-painter-segments';
const STORAGE_KEY_GROUPS = 'dna-painter-groups';
const STORAGE_KEY_NOTES = 'dna-painter-notes';

interface ChromosomePainterProps {
  clusterRun: ClusterRun;
}

export function ChromosomePainter({ clusterRun }: ChromosomePainterProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Core state
  const [paintedSegments, setPaintedSegments] = useState<PaintedSegment[]>([]);
  const [groups, setGroups] = useState<PaintGroup[]>(INITIAL_GROUPS);
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [paintMode, setPaintMode] = useState(false);
  const [cMThreshold, setCMThreshold] = useState(7);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [previewSegments, setPreviewSegments] = useState<PaintedSegment[]>([]);
  const [visibleClusterIds, setVisibleClusterIds] = useState<Set<number>>(
    () => new Set(clusterRun.clusters.map(c => c.id))
  );
  const [groupManagerOpen, setGroupManagerOpen] = useState(false);
  const [sharedCmOpen, setSharedCmOpen] = useState(false);
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSegments = localStorage.getItem(STORAGE_KEY_SEGMENTS);
      if (savedSegments) setPaintedSegments(JSON.parse(savedSegments));
      const savedGroups = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(paintedSegments));
  }, [paintedSegments]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  }, [groups]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  // Get all matches relevant to this cluster run
  const allMatches = useMemo(() => {
    const matchIds = new Set<string>();
    clusterRun.clusters.forEach(c => c.matchIds.forEach(id => matchIds.add(id)));
    clusterRun.unclusteredMatchIds.forEach(id => matchIds.add(id));
    return mockMatches.filter(m => matchIds.has(m.id));
  }, [clusterRun]);

  // Paint a match
  const paintMatch = useCallback((matchId: string) => {
    const match = mockMatches.find(m => m.id === matchId);
    if (!match) return;

    const cluster = clusterRun.clusters.find(c => c.matchIds.includes(matchId));
    const newSegments: PaintedSegment[] = match.segments
      .filter(seg => seg.cM >= cMThreshold)
      .map((seg, i) => ({
        id: `${matchId}-${seg.chromosome}-${i}-${Date.now()}`,
        matchId,
        matchName: match.name,
        groupId: null,
        chromosome: seg.chromosome,
        startBp: seg.startBp,
        endBp: seg.endBp,
        cM: seg.cM,
        snps: seg.snps,
        side: cluster?.lineage === 'paternal' ? 'paternal' as const
          : cluster?.lineage === 'maternal' ? 'maternal' as const
          : 'unknown' as const,
        isTriangulated: seg.isTriangulated,
        triangulationMatchIds: [],
        clusterRunId: clusterRun.id,
        clusterId: cluster?.id ?? null,
        color: cluster?.color ?? '#9baab9',
      }));

    setPaintedSegments(prev => {
      // Remove existing segments for this match first
      const filtered = prev.filter(s => s.matchId !== matchId);
      return [...filtered, ...newSegments];
    });
  }, [clusterRun, cMThreshold]);

  // Unpaint a match
  const unpaintMatch = useCallback((matchId: string) => {
    setPaintedSegments(prev => prev.filter(s => s.matchId !== matchId));
  }, []);

  // Auto-paint entire cluster
  const autoPaintCluster = useCallback((clusterId: number) => {
    const cluster = clusterRun.clusters.find(c => c.id === clusterId);
    if (!cluster) return;
    cluster.matchIds.forEach(id => paintMatch(id));
  }, [clusterRun, paintMatch]);

  // Preview match segments on hover
  const previewMatch = useCallback((matchId: string | null) => {
    if (!matchId) {
      setPreviewSegments([]);
      return;
    }
    const match = mockMatches.find(m => m.id === matchId);
    if (!match) return;
    const cluster = clusterRun.clusters.find(c => c.matchIds.includes(matchId));
    setPreviewSegments(
      match.segments
        .filter(seg => seg.cM >= cMThreshold)
        .map((seg, i) => ({
          id: `preview-${matchId}-${i}`,
          matchId, matchName: match.name, groupId: null,
          chromosome: seg.chromosome, startBp: seg.startBp, endBp: seg.endBp,
          cM: seg.cM, snps: seg.snps,
          side: cluster?.lineage === 'paternal' ? 'paternal' as const
            : cluster?.lineage === 'maternal' ? 'maternal' as const
            : 'unknown' as const,
          isTriangulated: false, triangulationMatchIds: [],
          clusterRunId: clusterRun.id, clusterId: cluster?.id ?? null,
          color: cluster?.color ?? '#9baab9',
        }))
    );
  }, [clusterRun, cMThreshold]);

  // Toggle cluster visibility
  const toggleCluster = useCallback((clusterId: number) => {
    setVisibleClusterIds(prev => {
      const next = new Set(prev);
      if (next.has(clusterId)) next.delete(clusterId);
      else next.add(clusterId);
      return next;
    });
  }, []);

  // Assign group to segment
  const assignGroup = useCallback((segmentId: string, groupId: string | null) => {
    setPaintedSegments(prev => prev.map(s => {
      if (s.id !== segmentId) return s;
      const group = groupId ? groups.find(g => g.id === groupId) : null;
      return {
        ...s,
        groupId,
        color: group?.color ?? (s.clusterId
          ? clusterRun.clusters.find(c => c.id === s.clusterId)?.color ?? '#9baab9'
          : '#9baab9'),
        side: group?.side ?? s.side,
      };
    }));
  }, [groups, clusterRun]);

  // Group management
  const addGroup = useCallback((group: Omit<PaintGroup, 'id' | 'createdAt'>) => {
    setGroups(prev => [...prev, {
      ...group,
      id: `grp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  const updateGroup = useCallback((id: string, updates: Partial<PaintGroup>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    // Unassign segments from deleted group
    setPaintedSegments(prev => prev.map(s =>
      s.groupId === id ? { ...s, groupId: null } : s
    ));
  }, []);

  // Notes
  const addNote = useCallback((segmentId: string, text: string) => {
    setNotes(prev => ({
      ...prev,
      [segmentId]: [
        ...(prev[segmentId] || []),
        {
          id: `note-${Date.now()}`,
          targetType: 'segment' as const,
          targetId: segmentId,
          text,
          status: 'todo' as const,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter(n => n.id !== noteId);
      }
      return next;
    });
  }, []);

  const updateNoteStatus = useCallback((noteId: string, status: Note['status']) => {
    setNotes(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map(n => n.id === noteId ? { ...n, status } : n);
      }
      return next;
    });
  }, []);

  // Filter segments by threshold and visibility
  const visibleSegments = useMemo(() => {
    return paintedSegments.filter(seg => {
      if (seg.cM < cMThreshold) return false;
      if (seg.clusterId && !visibleClusterIds.has(seg.clusterId)) return false;
      return true;
    });
  }, [paintedSegments, cMThreshold, visibleClusterIds]);

  // Segments per chromosome
  const segmentsByChromosome = useMemo(() => {
    const map: Record<number, PaintedSegment[]> = {};
    for (let i = 1; i <= 22; i++) map[i] = [];
    visibleSegments.forEach(seg => {
      if (map[seg.chromosome]) map[seg.chromosome].push(seg);
    });
    return map;
  }, [visibleSegments]);

  const previewByChromosome = useMemo(() => {
    const map: Record<number, PaintedSegment[]> = {};
    for (let i = 1; i <= 22; i++) map[i] = [];
    previewSegments.forEach(seg => {
      if (map[seg.chromosome]) map[seg.chromosome].push(seg);
    });
    return map;
  }, [previewSegments]);

  // Selected segment
  const selectedSegment = useMemo(
    () => paintedSegments.find(s => s.id === selectedSegmentId) ?? null,
    [paintedSegments, selectedSegmentId]
  );

  // Hovered segment for tooltip
  const hoveredSegment = useMemo(
    () => paintedSegments.find(s => s.id === hoveredSegmentId) ?? null,
    [paintedSegments, hoveredSegmentId]
  );

  // Export functions
  const handleExportPng = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(mapRef.current, { backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `chromosome-map-${clusterRun.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [clusterRun.name]);

  const handleExportCsv = useCallback(() => {
    const headers = 'Chromosome,Start (Mb),End (Mb),cM,SNPs,Match,Group,Side\n';
    const rows = paintedSegments.map(s => {
      const group = groups.find(g => g.id === s.groupId);
      return [
        s.chromosome,
        (s.startBp / 1_000_000).toFixed(2),
        (s.endBp / 1_000_000).toFixed(2),
        s.cM.toFixed(1),
        s.snps,
        `"${s.matchName}"`,
        group?.name ?? '',
        s.side,
      ].join(',');
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `chromosome-data-${clusterRun.name}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [paintedSegments, groups, clusterRun.name]);

  // Segment hover handler
  const handleSegmentHover = useCallback((segmentId: string | null, event?: React.MouseEvent) => {
    setHoveredSegmentId(segmentId);
    if (segmentId && event) {
      setTooltipPos({ x: event.clientX, y: event.clientY });
    } else {
      setTooltipPos(null);
    }
  }, []);

  // Stats
  const stats = useMemo(() => ({
    totalPainted: paintedSegments.length,
    uniqueMatches: new Set(paintedSegments.map(s => s.matchId)).size,
    triangulated: paintedSegments.filter(s => s.isTriangulated).length,
    totalCM: paintedSegments.reduce((sum, s) => sum + s.cM, 0),
  }), [paintedSegments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 500 }}>
      {/* Toolbar */}
      <PainterToolbar
        paintMode={paintMode}
        onTogglePaintMode={() => setPaintMode(p => !p)}
        onOpenGroupManager={() => setGroupManagerOpen(true)}
        onOpenSharedCm={() => setSharedCmOpen(true)}
        onExportPng={handleExportPng}
        onExportCsv={handleExportCsv}
        cMThreshold={cMThreshold}
        onThresholdChange={setCMThreshold}
      />

      {/* Cluster toggle pills */}
      <ClusterTogglePills
        clusters={clusterRun.clusters}
        visibleClusterIds={visibleClusterIds}
        onToggle={toggleCluster}
        onAutoPaint={autoPaintCluster}
      />

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 20, padding: '8px 0', fontSize: 12, color: '#5a6f86',
        borderBottom: '1px solid #edf1f5',
      }}>
        <span><strong>{stats.uniqueMatches}</strong> matches painted</span>
        <span><strong>{stats.totalPainted}</strong> segments</span>
        <span><strong>{stats.triangulated}</strong> triangulated</span>
        <span><strong>{stats.totalCM.toFixed(0)}</strong> total cM</span>
      </div>

      {/* Main content: chromosome map + sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Chromosome map */}
        <div
          ref={mapRef}
          className="custom-scrollbar"
          style={{ flex: 1, padding: '12px 16px 12px 0' }}
        >
          {/* Labels row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
            paddingLeft: 36,
          }}>
            <div style={{ flex: 1, display: 'flex', fontSize: 9, color: '#9baab9' }}>
              <span>Paternal</span>
              <span style={{ marginLeft: 'auto', marginRight: 48 }}>Maternal</span>
            </div>
          </div>

          {CHROMOSOME_DATA.map(chr => (
            <ChromosomeRow
              key={chr.chromosome}
              chrInfo={chr}
              maxLengthMb={MAX_CHROMOSOME_LENGTH_MB}
              segments={segmentsByChromosome[chr.chromosome] || []}
              previewSegments={previewByChromosome[chr.chromosome] || []}
              selectedSegmentId={selectedSegmentId}
              onSegmentClick={(id) => setSelectedSegmentId(id)}
              onSegmentHover={handleSegmentHover}
            />
          ))}
        </div>

        {/* Match sidebar (in paint mode) */}
        {paintMode && (
          <MatchSidebar
            matches={allMatches}
            paintedSegments={paintedSegments}
            activeMatchId={activeMatchId}
            paintMode={paintMode}
            cMThreshold={cMThreshold}
            onPaintMatch={paintMatch}
            onUnpaintMatch={unpaintMatch}
            onPreviewMatch={previewMatch}
            onSelectMatch={setActiveMatchId}
          />
        )}
      </div>

      {/* Segment detail drawer */}
      <SegmentDetailDrawer
        segment={selectedSegment}
        groups={groups}
        notes={selectedSegmentId ? (notes[selectedSegmentId] || []) : []}
        onClose={() => setSelectedSegmentId(null)}
        onAssignGroup={assignGroup}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
        onUpdateNoteStatus={updateNoteStatus}
      />

      {/* Group manager panel */}
      {groupManagerOpen && (
        <>
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
              zIndex: 199,
            }}
            onClick={() => setGroupManagerOpen(false)}
          />
          <GroupManager
            open={groupManagerOpen}
            groups={groups}
            onClose={() => setGroupManagerOpen(false)}
            onAddGroup={addGroup}
            onUpdateGroup={updateGroup}
            onDeleteGroup={deleteGroup}
          />
        </>
      )}

      {/* Shared cM tool modal */}
      <SharedCmTool
        open={sharedCmOpen}
        onClose={() => setSharedCmOpen(false)}
      />

      {/* Tooltip */}
      {hoveredSegment && tooltipPos && (
        <div
          className="painter-tooltip"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 10,
            position: 'fixed',
          }}
        >
          <strong>{hoveredSegment.matchName}</strong>
          <br />
          Chr {hoveredSegment.chromosome}: {(hoveredSegment.startBp / 1_000_000).toFixed(1)}–
          {(hoveredSegment.endBp / 1_000_000).toFixed(1)} Mb
          <br />
          {hoveredSegment.cM.toFixed(1)} cM · {hoveredSegment.snps.toLocaleString()} SNPs
          {hoveredSegment.isTriangulated && <><br />&#x25B2; Triangulated</>}
        </div>
      )}
    </div>
  );
}
