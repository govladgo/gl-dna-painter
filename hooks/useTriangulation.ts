'use client';

import { useMemo } from 'react';
import type { PaintedSegment } from '@/data/types';

interface SegmentEvent {
  bp: number;
  isStart: boolean;
  segmentId: string;
  matchId: string;
}

/**
 * Sweep-line triangulation detection.
 *
 * For each chromosome, sorts segment start/end events by position, then sweeps
 * through to find regions where 3+ segments from different matches overlap.
 *
 * Returns a Map where keys are segmentIds that participate in triangulation,
 * and values are arrays of the other matchIds that overlap with that segment.
 */
export function useTriangulation(
  paintedSegments: PaintedSegment[],
): Map<string, string[]> {
  return useMemo(() => {
    const result = new Map<string, string[]>();

    // Group segments by chromosome
    const byChromosome = new Map<number, PaintedSegment[]>();
    for (const seg of paintedSegments) {
      const existing = byChromosome.get(seg.chromosome);
      if (existing) {
        existing.push(seg);
      } else {
        byChromosome.set(seg.chromosome, [seg]);
      }
    }

    byChromosome.forEach((segments) => {
      if (segments.length < 3) return;

      // Build sweep-line events
      const events: SegmentEvent[] = [];
      for (const seg of segments) {
        events.push({ bp: seg.startBp, isStart: true, segmentId: seg.id, matchId: seg.matchId });
        events.push({ bp: seg.endBp, isStart: false, segmentId: seg.id, matchId: seg.matchId });
      }

      // Sort: by position, starts before ends at same position
      events.sort((a, b) => {
        if (a.bp !== b.bp) return a.bp - b.bp;
        return a.isStart === b.isStart ? 0 : a.isStart ? -1 : 1;
      });

      // Sweep: track active segments
      const active = new Map<string, string>(); // segmentId -> matchId

      for (const event of events) {
        if (event.isStart) {
          active.set(event.segmentId, event.matchId);

          // Check if we have 3+ segments from different matches
          const activeEntries = Array.from(active.entries());
          const uniqueMatchIds = new Set(activeEntries.map(([, mid]) => mid));
          if (uniqueMatchIds.size >= 3) {
            // Mark all currently active segments as triangulated
            activeEntries.forEach(([segId, matchId]) => {
              const otherMatchIds = activeEntries
                .filter(([, mid]) => mid !== matchId)
                .map(([, mid]) => mid);
              const uniqueOthers = Array.from(new Set(otherMatchIds));

              const existing = result.get(segId);
              if (existing) {
                const merged = new Set([...existing, ...uniqueOthers]);
                result.set(segId, Array.from(merged));
              } else {
                result.set(segId, uniqueOthers);
              }
            });
          }
        } else {
          active.delete(event.segmentId);
        }
      }
    });

    return result;
  }, [paintedSegments]);
}
