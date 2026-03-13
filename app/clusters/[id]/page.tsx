'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageShell } from '@/components/layout/PageShell';
import { GLTabs } from '@/components/gl/GLTabs';
import { ChromosomePainter } from '@/components/painter/ChromosomePainter';
import { getClusterRunById } from '@/data/mock/clusters';
import type { ViewTab } from '@/data/types';

const tabs = [
  { id: 'grid' as const, label: 'Grid' },
  { id: 'list' as const, label: 'List' },
  { id: 'painter' as const, label: 'Chromosome Painter' },
];

export default function ClusterResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const run = getClusterRunById(id);
  const [activeTab, setActiveTab] = useState<ViewTab>('painter');

  if (!run) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f8fc' }}>
        <Header />
        <PageShell>
          <p style={{ color: '#5a6f86', fontSize: 15 }}>Cluster run not found.</p>
        </PageShell>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fc' }}>
      <Header />
      <PageShell breadcrumb={['My Clusters', run.name]}>
        <div style={{ marginBottom: 24 }}>
          <GLTabs
            items={tabs}
            activeId={activeTab}
            onChange={(tabId) => setActiveTab(tabId as ViewTab)}
            variant="pill"
          />
        </div>

        {activeTab === 'grid' && (
          <div style={{
            background: '#ffffff', borderRadius: 12,
            border: '1px solid #dce2ea', padding: 32, minHeight: 400,
          }}>
            <p style={{ color: '#5a6f86', fontSize: 14 }}>
              Grid view &mdash; correlation matrix placeholder
            </p>
          </div>
        )}

        {activeTab === 'list' && (
          <div style={{
            background: '#ffffff', borderRadius: 12,
            border: '1px solid #dce2ea', padding: 32, minHeight: 400,
          }}>
            <p style={{ color: '#5a6f86', fontSize: 14 }}>
              List view &mdash; match groupings placeholder
            </p>
          </div>
        )}

        <div style={{
          background: '#ffffff', borderRadius: 12,
          border: '1px solid #dce2ea', padding: '16px 24px',
          display: activeTab === 'painter' ? 'block' : 'none',
        }}>
          <ChromosomePainter clusterRun={run} />
        </div>
      </PageShell>
    </div>
  );
}
