import { ClusterRun, Cluster, SegmentCluster } from '../types';

export const CLUSTER_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
];

const clusters: Cluster[] = [
  {
    id: 1, color: CLUSTER_COLORS[0], name: 'Cluster 1',
    matchIds: ['AA6944936', 'BD8395908', 'LH2037412', 'BV7122186', 'LN9616855', 'CM4282482', 'AT1277057'],
    avgSharedCM: 44.7, minCM: 38.4, maxCM: 51.6,
    chromosomes: [3, 5, 8, 9, 14, 19], segmentClusterCount: 4, tags: [],
    lineage: 'paternal',
  },
  {
    id: 2, color: CLUSTER_COLORS[1], name: 'Cluster 2',
    matchIds: ['AH2522709', 'GA6180050', 'MP1122867', 'RV8404118', 'BA6625398', 'BD2350643'],
    avgSharedCM: 49.5, minCM: 36.8, maxCM: 65.3,
    chromosomes: [2, 4, 10, 11, 12, 22], segmentClusterCount: 5, tags: [],
    lineage: 'paternal',
  },
  {
    id: 3, color: CLUSTER_COLORS[2], name: 'Cluster 3',
    matchIds: ['LQ7491671', 'MY3994172', 'NY3840941', 'DE1534183', 'GW7762244'],
    avgSharedCM: 46.1, minCM: 34.8, maxCM: 58.1,
    chromosomes: [5, 7, 11, 14, 15, 16, 20], segmentClusterCount: 3, tags: [],
    lineage: 'maternal',
  },
  {
    id: 4, color: CLUSTER_COLORS[3], name: 'Cluster 4',
    matchIds: ['HU5956991', 'PA3344471', 'MA1803671', 'XR7538735', 'ZN1325093'],
    avgSharedCM: 31.4, minCM: 28.7, maxCM: 35.3,
    chromosomes: [1, 6, 17, 18], segmentClusterCount: 2, tags: [],
    lineage: 'unassigned',
  },
  {
    id: 5, color: CLUSTER_COLORS[4], name: 'Cluster 5',
    matchIds: ['m1', 'm2', 'm3'],
    avgSharedCM: 19.1, minCM: 15.72, maxCM: 22.9,
    chromosomes: [3, 9, 21], segmentClusterCount: 1, tags: [],
    lineage: 'maternal',
  },
];

const segmentClusters: SegmentCluster[] = [
  { id: 'sc1', clusterId: 1, chromosome: 5, startBp: 115000000, endBp: 128000000, cM: 12.5, snps: 980, matchIds: ['AA6944936', 'BD8395908', 'BV7122186'] },
  { id: 'sc2', clusterId: 1, chromosome: 8, startBp: 60000000, endBp: 73000000, cM: 11.8, snps: 920, matchIds: ['AA6944936', 'CM4282482', 'AT1277057'] },
  { id: 'sc3', clusterId: 1, chromosome: 19, startBp: 10000000, endBp: 26000000, cM: 14.2, snps: 1100, matchIds: ['BD8395908', 'LH2037412', 'LN9616855'] },
  { id: 'sc4', clusterId: 2, chromosome: 4, startBp: 80000000, endBp: 92000000, cM: 10.4, snps: 815, matchIds: ['AH2522709', 'GA6180050', 'BA6625398'] },
  { id: 'sc5', clusterId: 2, chromosome: 11, startBp: 94000000, endBp: 106000000, cM: 11.2, snps: 875, matchIds: ['AH2522709', 'MP1122867', 'RV8404118'] },
  { id: 'sc6', clusterId: 2, chromosome: 22, startBp: 18000000, endBp: 33000000, cM: 13.8, snps: 1050, matchIds: ['GA6180050', 'BD2350643', 'MP1122867'] },
  { id: 'sc7', clusterId: 3, chromosome: 7, startBp: 98000000, endBp: 110000000, cM: 10.8, snps: 845, matchIds: ['GA6180050', 'LQ7491671', 'MY3994172'] },
  { id: 'sc8', clusterId: 3, chromosome: 15, startBp: 43000000, endBp: 58000000, cM: 13.5, snps: 1020, matchIds: ['AH2522709', 'NY3840941', 'GW7762244'] },
  { id: 'sc9', clusterId: 3, chromosome: 20, startBp: 13000000, endBp: 29000000, cM: 15.1, snps: 1180, matchIds: ['LH2037412', 'DE1534183', 'LQ7491671'] },
  { id: 'sc10', clusterId: 4, chromosome: 17, startBp: 22000000, endBp: 35000000, cM: 11.5, snps: 890, matchIds: ['HU5956991', 'PA3344471', 'XR7538735'] },
  { id: 'sc11', clusterId: 4, chromosome: 18, startBp: 48000000, endBp: 60000000, cM: 10.2, snps: 795, matchIds: ['MA1803671', 'ZN1325093', 'HU5956991'] },
  { id: 'sc12', clusterId: 5, chromosome: 9, startBp: 70000000, endBp: 82000000, cM: 9.8, snps: 760, matchIds: ['m1', 'm2', 'm3'] },
];

export const mockClusterRuns: ClusterRun[] = [
  {
    id: 'run-001',
    name: 'Segment Analysis - Standard',
    method: 'segment-based',
    createdAt: '2026-02-16T15:42:00Z',
    config: {
      method: 'segment-based',
      mode: 'simple',
      preset: 'standard',
      params: {
        maxCM: 400, minCM: 10, minSharedCM: 20,
        minOverlapCM: 10, minSNPs: 500, minClusterSize: 2, filterPileUp: true,
      },
    },
    totalMatches: 38,
    clusters,
    unclusteredMatchIds: ['m4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'CD7711377'],
    segmentClusters,
  },
  {
    id: 'run-002',
    name: 'Shared Match - Extended Family',
    method: 'shared-match',
    createdAt: '2026-02-15T10:15:00Z',
    config: {
      method: 'shared-match',
      mode: 'simple',
      preset: 'extended-family',
      params: {
        maxCM: 400, minCM: 20, minSharedCM: 20,
        minOverlapCM: 10, minSNPs: 500, minClusterSize: 2, filterPileUp: true,
      },
    },
    totalMatches: 32,
    clusters: clusters.slice(0, 4).map(c => ({ ...c })),
    unclusteredMatchIds: ['m4', 'm6', 'm8', 'm10', 'm12', 'm14'],
  },
  {
    id: 'run-003',
    name: 'Deep Ancestry Scan',
    method: 'segment-based',
    createdAt: '2026-03-01T09:30:00Z',
    config: {
      method: 'segment-based',
      mode: 'advanced',
      preset: 'broad-search',
      params: {
        maxCM: 400, minCM: 7, minSharedCM: 20,
        minOverlapCM: 7, minSNPs: 300, minClusterSize: 2, filterPileUp: false,
      },
    },
    totalMatches: 42,
    clusters: clusters.map(c => ({ ...c })),
    unclusteredMatchIds: ['m4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'CD7711377'],
    segmentClusters,
  },
];

export function getClusterRunById(id: string): ClusterRun | undefined {
  return mockClusterRuns.find(r => r.id === id);
}
