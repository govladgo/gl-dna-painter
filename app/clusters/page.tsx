'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageShell } from '@/components/layout/PageShell';
import { ClusterCard } from '@/components/clusters/ClusterCard';
import { mockClusterRuns } from '@/data/mock/clusters';

export default function ClustersPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fc' }}>
      <Header />
      <PageShell title="My Clusters">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {mockClusterRuns.map((run) => (
            <ClusterCard
              key={run.id}
              run={run}
              onClick={() => router.push(`/clusters/${run.id}`)}
            />
          ))}
        </div>
      </PageShell>
    </div>
  );
}
