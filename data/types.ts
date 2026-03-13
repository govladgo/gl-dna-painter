// DNA Match
export interface Segment {
  chromosome: number;
  startBp: number;
  endBp: number;
  cM: number;
  snps: number;
  isTriangulated: boolean;
  clusterId?: number;
}

export interface DNAMatch {
  id: string;
  name: string;
  sharedCM: number;
  sharedPercentage: number;
  relationship: string;
  source: '23andme' | 'myheritage' | 'ftdna' | 'gedmatch' | 'ancestry';
  profileType: 'open' | 'limited';
  isNew: boolean;
  segments: Segment[];
  tags: string[];
  avatarColor: string;
  initials: string;
  birthYear?: string;
  location?: string;
  treeUrl?: string;
  lineage?: 'paternal' | 'maternal' | 'unassigned';
}

// Clustering
export interface Cluster {
  id: number;
  color: string;
  matchIds: string[];
  avgSharedCM: number;
  minCM: number;
  maxCM: number;
  chromosomes: number[];
  segmentClusterCount: number;
  tags: string[];
  name?: string;
  lineage?: 'paternal' | 'maternal' | 'unassigned';
}

export interface SegmentCluster {
  id: string;
  clusterId: number;
  chromosome: number;
  startBp: number;
  endBp: number;
  cM: number;
  snps: number;
  matchIds: string[];
}

export interface ClusterRunConfig {
  method: 'segment-based' | 'shared-match';
  mode: 'simple' | 'advanced';
  preset: string;
  params: {
    maxCM: number;
    minCM: number;
    minSharedCM: number;
    minOverlapCM: number;
    minSNPs: number;
    minClusterSize: number;
    filterPileUp: boolean;
  };
}

export interface ClusterRun {
  id: string;
  name: string;
  method: 'segment-based' | 'shared-match';
  createdAt: string;
  config: ClusterRunConfig;
  totalMatches: number;
  clusters: Cluster[];
  unclusteredMatchIds: string[];
  segmentClusters?: SegmentCluster[];
}

// Painter-specific
export interface PaintGroup {
  id: string;
  name: string;
  color: string;
  side: 'paternal' | 'maternal' | 'unknown';
  createdAt: string;
}

export interface PaintedSegment {
  id: string;
  matchId: string;
  matchName: string;
  groupId: string | null;
  chromosome: number;
  startBp: number;
  endBp: number;
  cM: number;
  snps: number;
  side: 'paternal' | 'maternal' | 'unknown';
  isTriangulated: boolean;
  triangulationMatchIds: string[];
  clusterRunId: string;
  clusterId: number | null;
  color: string; // resolved color from group or cluster
}

export interface Note {
  id: string;
  targetType: 'segment' | 'match';
  targetId: string;
  text: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface ChromosomeInfo {
  chromosome: number;
  lengthMb: number;
  lengthCM: number;
}

export interface SharedCmEntry {
  relationship: string;
  minCM: number;
  maxCM: number;
  avgCM: number;
  probability: number;
}

export type ViewTab = 'grid' | 'list' | 'painter';
