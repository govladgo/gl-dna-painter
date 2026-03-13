'use client';

import { toPng } from 'html-to-image';
import type { PaintedSegment } from '@/data/types';

/**
 * Captures an HTML element as a PNG and triggers a file download.
 */
export async function exportToPng(
  element: HTMLElement,
  filename = 'dna-painter-export.png',
): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Converts painted segments to CSV and triggers a file download.
 */
export function exportToCsv(
  segments: PaintedSegment[],
  filename = 'dna-painter-segments.csv',
): void {
  const headers = [
    'chromosome',
    'startBp',
    'endBp',
    'cM',
    'snps',
    'matchName',
    'groupId',
    'side',
  ];

  const rows = segments.map((seg) => [
    String(seg.chromosome),
    String(seg.startBp),
    String(seg.endBp),
    String(seg.cM),
    String(seg.snps),
    `"${seg.matchName.replace(/"/g, '""')}"`,
    seg.groupId ?? '',
    seg.side,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
