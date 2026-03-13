'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { PaintGroup } from '@/data/types';
import { INITIAL_GROUPS, GROUP_COLOR_PALETTE } from '@/data/mock/groups';

export { GROUP_COLOR_PALETTE };

const STORAGE_KEY = 'dna-painter-groups';

function loadGroups(): PaintGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PaintGroup[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_GROUPS;
}

function saveGroups(groups: PaintGroup[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch {
    // ignore
  }
}

export function useGroups() {
  const [groups, setGroups] = useState<PaintGroup[]>(INITIAL_GROUPS);
  const isInitialized = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    setGroups(loadGroups());
  }, []);

  // Persist on change
  useEffect(() => {
    if (!isInitialized.current) return;
    saveGroups(groups);
  }, [groups]);

  const addGroup = useCallback((group: PaintGroup) => {
    setGroups((prev) => [...prev, group]);
  }, []);

  const updateGroup = useCallback((id: string, updates: Partial<Omit<PaintGroup, 'id'>>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    );
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const getGroupById = useCallback(
    (id: string): PaintGroup | undefined => {
      return groups.find((g) => g.id === id);
    },
    [groups],
  );

  return { groups, addGroup, updateGroup, deleteGroup, getGroupById };
}
