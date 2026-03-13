'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { PaintedSegment, Note, DNAMatch } from '@/data/types';
import { getMatchById } from '@/data/mock/matches';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface PainterState {
  paintedSegments: PaintedSegment[];
  activeMatchId: string | null;
  selectedSegmentId: string | null;
  cMThreshold: number;
  visibleClusterIds: Set<number>;
  visibleGroupIds: Set<string>;
  paintMode: boolean;
  previewSegments: PaintedSegment[];
  notes: Record<string, Note[]>;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type PainterAction =
  | {
      type: 'PAINT_MATCH';
      matchId: string;
      clusterRunId: string;
      clusterId: number | null;
      groupId?: string | null;
    }
  | { type: 'UNPAINT_MATCH'; matchId: string }
  | {
      type: 'AUTO_PAINT_CLUSTER';
      matchIds: string[];
      clusterRunId: string;
      clusterId: number;
      groupId?: string | null;
    }
  | { type: 'SET_SEGMENT_GROUP'; segmentId: string; groupId: string | null; color: string }
  | { type: 'SET_ACTIVE_MATCH'; matchId: string | null }
  | { type: 'SET_SELECTED_SEGMENT'; segmentId: string | null }
  | { type: 'SET_THRESHOLD'; cMThreshold: number }
  | { type: 'TOGGLE_CLUSTER_VISIBILITY'; clusterId: number }
  | { type: 'TOGGLE_GROUP_VISIBILITY'; groupId: string }
  | { type: 'SET_PAINT_MODE'; paintMode: boolean }
  | { type: 'SET_PREVIEW_SEGMENTS'; segments: PaintedSegment[] }
  | { type: 'ADD_NOTE'; note: Note }
  | { type: 'UPDATE_NOTE'; noteId: string; targetId: string; text?: string; status?: Note['status'] }
  | { type: 'DELETE_NOTE'; noteId: string; targetId: string }
  | { type: 'LOAD_STATE'; state: Partial<SerializedPainterState> };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _idCounter = 0;
function uid(): string {
  _idCounter += 1;
  return `ps-${Date.now()}-${_idCounter}`;
}

function createPaintedSegmentsForMatch(
  match: DNAMatch,
  clusterRunId: string,
  clusterId: number | null,
  groupId: string | null,
  clusterColor: string,
): PaintedSegment[] {
  return match.segments.map((seg) => ({
    id: uid(),
    matchId: match.id,
    matchName: match.name,
    groupId,
    chromosome: seg.chromosome,
    startBp: seg.startBp,
    endBp: seg.endBp,
    cM: seg.cM,
    snps: seg.snps,
    side: (match.lineage === 'paternal' || match.lineage === 'maternal') ? match.lineage : 'unknown',
    isTriangulated: seg.isTriangulated,
    triangulationMatchIds: [],
    clusterRunId,
    clusterId,
    color: clusterColor,
  }));
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function painterReducer(state: PainterState, action: PainterAction): PainterState {
  switch (action.type) {
    case 'PAINT_MATCH': {
      const match = getMatchById(action.matchId);
      if (!match) return state;
      // Avoid duplicate painting
      if (state.paintedSegments.some((s) => s.matchId === action.matchId)) return state;

      const newSegments = createPaintedSegmentsForMatch(
        match,
        action.clusterRunId,
        action.clusterId,
        action.groupId ?? null,
        match.avatarColor,
      );
      return { ...state, paintedSegments: [...state.paintedSegments, ...newSegments] };
    }

    case 'UNPAINT_MATCH': {
      return {
        ...state,
        paintedSegments: state.paintedSegments.filter((s) => s.matchId !== action.matchId),
      };
    }

    case 'AUTO_PAINT_CLUSTER': {
      let segments = [...state.paintedSegments];
      for (const matchId of action.matchIds) {
        // Skip already-painted
        if (segments.some((s) => s.matchId === matchId)) continue;
        const match = getMatchById(matchId);
        if (!match) continue;
        const newSegs = createPaintedSegmentsForMatch(
          match,
          action.clusterRunId,
          action.clusterId,
          action.groupId ?? null,
          match.avatarColor,
        );
        segments = [...segments, ...newSegs];
      }
      return { ...state, paintedSegments: segments };
    }

    case 'SET_SEGMENT_GROUP': {
      return {
        ...state,
        paintedSegments: state.paintedSegments.map((s) =>
          s.id === action.segmentId
            ? { ...s, groupId: action.groupId, color: action.color }
            : s,
        ),
      };
    }

    case 'SET_ACTIVE_MATCH':
      return { ...state, activeMatchId: action.matchId };

    case 'SET_SELECTED_SEGMENT':
      return { ...state, selectedSegmentId: action.segmentId };

    case 'SET_THRESHOLD':
      return { ...state, cMThreshold: action.cMThreshold };

    case 'TOGGLE_CLUSTER_VISIBILITY': {
      const next = new Set(state.visibleClusterIds);
      if (next.has(action.clusterId)) {
        next.delete(action.clusterId);
      } else {
        next.add(action.clusterId);
      }
      return { ...state, visibleClusterIds: next };
    }

    case 'TOGGLE_GROUP_VISIBILITY': {
      const next = new Set(state.visibleGroupIds);
      if (next.has(action.groupId)) {
        next.delete(action.groupId);
      } else {
        next.add(action.groupId);
      }
      return { ...state, visibleGroupIds: next };
    }

    case 'SET_PAINT_MODE':
      return { ...state, paintMode: action.paintMode };

    case 'SET_PREVIEW_SEGMENTS':
      return { ...state, previewSegments: action.segments };

    case 'ADD_NOTE': {
      const targetId = action.note.targetId;
      const existing = state.notes[targetId] ?? [];
      return { ...state, notes: { ...state.notes, [targetId]: [...existing, action.note] } };
    }

    case 'UPDATE_NOTE': {
      const notes = state.notes[action.targetId];
      if (!notes) return state;
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.targetId]: notes.map((n) =>
            n.id === action.noteId
              ? {
                  ...n,
                  ...(action.text !== undefined ? { text: action.text } : {}),
                  ...(action.status !== undefined ? { status: action.status } : {}),
                }
              : n,
          ),
        },
      };
    }

    case 'DELETE_NOTE': {
      const notes = state.notes[action.targetId];
      if (!notes) return state;
      const filtered = notes.filter((n) => n.id !== action.noteId);
      const next = { ...state.notes };
      if (filtered.length === 0) {
        delete next[action.targetId];
      } else {
        next[action.targetId] = filtered;
      }
      return { ...state, notes: next };
    }

    case 'LOAD_STATE': {
      const loaded = action.state;
      return {
        ...state,
        paintedSegments: loaded.paintedSegments ?? state.paintedSegments,
        notes: loaded.notes ?? state.notes,
        visibleClusterIds: loaded.visibleClusterIds
          ? new Set(loaded.visibleClusterIds)
          : state.visibleClusterIds,
        visibleGroupIds: loaded.visibleGroupIds
          ? new Set(loaded.visibleGroupIds)
          : state.visibleGroupIds,
        cMThreshold: loaded.cMThreshold ?? state.cMThreshold,
      };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Serialization for localStorage
// ---------------------------------------------------------------------------

interface SerializedPainterState {
  paintedSegments: PaintedSegment[];
  notes: Record<string, Note[]>;
  visibleClusterIds: number[];
  visibleGroupIds: string[];
  cMThreshold: number;
}

const STORAGE_KEY = 'dna-painter-state';

function saveToStorage(state: PainterState): void {
  try {
    const serialized: SerializedPainterState = {
      paintedSegments: state.paintedSegments,
      notes: state.notes,
      visibleClusterIds: Array.from(state.visibleClusterIds),
      visibleGroupIds: Array.from(state.visibleGroupIds),
      cMThreshold: state.cMThreshold,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // Storage full or unavailable - silently ignore
  }
}

function loadFromStorage(): Partial<SerializedPainterState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<SerializedPainterState>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: PainterState = {
  paintedSegments: [],
  activeMatchId: null,
  selectedSegmentId: null,
  cMThreshold: 7,
  visibleClusterIds: new Set<number>(),
  visibleGroupIds: new Set<string>(),
  paintMode: false,
  previewSegments: [],
  notes: {},
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface PainterContextValue {
  state: PainterState;
  dispatch: Dispatch<PainterAction>;
}

const PainterContext = createContext<PainterContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function PainterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(painterReducer, initialState);
  const isInitialized = useRef(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const loaded = loadFromStorage();
    if (loaded) {
      dispatch({ type: 'LOAD_STATE', state: loaded });
    }
  }, []);

  // Debounced save on state change
  useEffect(() => {
    // Skip saving until we have initialized
    if (!isInitialized.current) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      saveToStorage(state);
    }, 500);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [state.paintedSegments, state.notes, state.visibleClusterIds, state.visibleGroupIds, state.cMThreshold]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <PainterContext.Provider value={value}>{children}</PainterContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePainter(): PainterContextValue {
  const ctx = useContext(PainterContext);
  if (!ctx) {
    throw new Error('usePainter must be used within a PainterProvider');
  }
  return ctx;
}
