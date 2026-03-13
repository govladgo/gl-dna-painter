import { SharedCmEntry } from '../types';

export const SHARED_CM_DATA: SharedCmEntry[] = [
  { relationship: 'Identical Twin', minCM: 3400, maxCM: 3600, avgCM: 3500, probability: 0 },
  { relationship: 'Parent/Child', minCM: 3330, maxCM: 3720, avgCM: 3485, probability: 0 },
  { relationship: 'Full Sibling', minCM: 2209, maxCM: 3384, avgCM: 2613, probability: 0 },
  { relationship: 'Grandparent/Grandchild', minCM: 1156, maxCM: 2311, avgCM: 1766, probability: 0 },
  { relationship: 'Uncle/Aunt / Nephew/Niece', minCM: 1201, maxCM: 2282, avgCM: 1741, probability: 0 },
  { relationship: 'Half Sibling', minCM: 1160, maxCM: 2436, avgCM: 1759, probability: 0 },
  { relationship: 'Great-Grandparent', minCM: 485, maxCM: 1486, avgCM: 887, probability: 0 },
  { relationship: '1st Cousin', minCM: 553, maxCM: 1225, avgCM: 866, probability: 0 },
  { relationship: 'Great-Uncle/Aunt', minCM: 251, maxCM: 1172, avgCM: 712, probability: 0 },
  { relationship: 'Half Uncle/Aunt', minCM: 500, maxCM: 1446, avgCM: 880, probability: 0 },
  { relationship: '1st Cousin Once Removed', minCM: 220, maxCM: 871, avgCM: 433, probability: 0 },
  { relationship: 'Half 1st Cousin', minCM: 137, maxCM: 856, avgCM: 449, probability: 0 },
  { relationship: '2nd Cousin', minCM: 41, maxCM: 592, avgCM: 229, probability: 0 },
  { relationship: '2nd Cousin Once Removed', minCM: 0, maxCM: 325, avgCM: 122, probability: 0 },
  { relationship: '3rd Cousin', minCM: 0, maxCM: 234, avgCM: 73, probability: 0 },
  { relationship: '3rd Cousin Once Removed', minCM: 0, maxCM: 192, avgCM: 48, probability: 0 },
  { relationship: '4th Cousin', minCM: 0, maxCM: 139, avgCM: 35, probability: 0 },
  { relationship: '4th Cousin Once Removed', minCM: 0, maxCM: 126, avgCM: 24, probability: 0 },
  { relationship: '5th Cousin', minCM: 0, maxCM: 117, avgCM: 18, probability: 0 },
  { relationship: '5th Cousin Once Removed', minCM: 0, maxCM: 99, avgCM: 13, probability: 0 },
  { relationship: '6th Cousin', minCM: 0, maxCM: 84, avgCM: 11, probability: 0 },
  { relationship: '6th Cousin Once Removed', minCM: 0, maxCM: 73, avgCM: 8, probability: 0 },
  { relationship: '7th Cousin', minCM: 0, maxCM: 50, avgCM: 6, probability: 0 },
  { relationship: '8th Cousin', minCM: 0, maxCM: 30, avgCM: 4, probability: 0 },
];

// Function to get matching relationships for a given cM value
export function getRelationshipsForCM(cM: number): (SharedCmEntry & { probability: number })[] {
  const matches = SHARED_CM_DATA.filter(
    (entry) => cM >= entry.minCM && cM <= entry.maxCM
  );

  if (matches.length === 0) return [];

  // Calculate probability based on how close cM is to avgCM using normal distribution approximation
  const withProbability = matches.map((entry) => {
    const range = entry.maxCM - entry.minCM;
    if (range === 0) return { ...entry, probability: 1 };
    const sigma = range / 4; // Approximate std dev
    const z = (cM - entry.avgCM) / sigma;
    const prob = Math.exp(-0.5 * z * z);
    return { ...entry, probability: prob };
  });

  // Normalize probabilities to sum to 1
  const totalProb = withProbability.reduce((sum, e) => sum + e.probability, 0);
  return withProbability
    .map((e) => ({ ...e, probability: totalProb > 0 ? e.probability / totalProb : 0 }))
    .sort((a, b) => b.probability - a.probability);
}
