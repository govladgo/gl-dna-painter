'use client';

import { useMemo } from 'react';
import type { PaintedSegment } from '@/data/types';

/**
 * Filters painted segments to only include those at or above the cM threshold.
 */
export function useThreshold(
  paintedSegments: PaintedSegment[],
  cMThreshold: number,
): PaintedSegment[] {
  return useMemo(
    () => paintedSegments.filter((seg) => seg.cM >= cMThreshold),
    [paintedSegments, cMThreshold],
  );
}
