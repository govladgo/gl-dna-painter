import { PaintGroup } from '../types';

export const INITIAL_GROUPS: PaintGroup[] = [
  {
    id: 'grp-petrov',
    name: 'Petrov Line',
    color: '#3B82F6',
    side: 'paternal',
    createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'grp-romanov',
    name: 'Romanov Line',
    color: '#10B981',
    side: 'paternal',
    createdAt: '2026-02-12T14:00:00Z',
  },
  {
    id: 'grp-berg',
    name: 'Berg / Lindberg',
    color: '#8B5CF6',
    side: 'maternal',
    createdAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'grp-unknown-ee',
    name: 'Unknown Eastern European',
    color: '#F59E0B',
    side: 'unknown',
    createdAt: '2026-02-15T16:00:00Z',
  },
];

export const GROUP_COLOR_PALETTE = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#A855F7',
];
