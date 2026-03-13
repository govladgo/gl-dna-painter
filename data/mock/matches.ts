import { DNAMatch, Segment } from '../types';

const AVATAR_COLORS: Record<string, string> = {
  A: '#FF6B6B', B: '#4ECDC4', C: '#45B7D1', D: '#96CEB4',
  E: '#FFEAA7', F: '#DDA0DD', G: '#98D8C8', H: '#F7DC6F',
  I: '#BB8FCE', J: '#85C1E9', K: '#F0B27A', L: '#AED6F1',
  M: '#D5A6BD', N: '#A3E4D7', O: '#F5CBA7', P: '#AEB6BF',
  Q: '#D2B4DE', R: '#A9DFBF', S: '#FAD7A0', T: '#A9CCE3',
  U: '#D7BDE2', V: '#A2D9CE', W: '#F9E79F', X: '#ABEBC6',
  Y: '#F5B7B1', Z: '#D6DBDF',
};

function getAvatarColor(name: string): string {
  const letter = name.charAt(0).toUpperCase();
  return AVATAR_COLORS[letter] || '#AEB6BF';
}

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelationship(cM: number): string {
  if (cM > 3400) return 'Self';
  if (cM > 2200) return 'Full Sibling';
  if (cM > 1500) return 'Grandparent';
  if (cM > 1000) return 'Uncle/Aunt';
  if (cM > 500) return '1st Cousin';
  if (cM > 200) return '2nd Cousin';
  if (cM > 90) return '3rd Cousin';
  if (cM > 40) return '4th Cousin';
  if (cM > 20) return '5th Cousin';
  if (cM > 10) return '6th Cousin Once Removed';
  return '6th Cousin or Beyond';
}

function makeMatch(
  id: string, name: string, sharedCM: number,
  source: DNAMatch['source'],
  opts: Partial<DNAMatch> = {}
): DNAMatch {
  return {
    id, name, sharedCM,
    sharedPercentage: +(sharedCM / 7082.58 * 100).toFixed(2),
    relationship: formatRelationship(sharedCM),
    source,
    profileType: 'open',
    isNew: false,
    segments: [],
    tags: [],
    avatarColor: getAvatarColor(name),
    initials: getInitials(name),
    ...opts,
  };
}

export const mockMatches: DNAMatch[] = [
  // Original Genomelink matches (smaller cM, from 23andme/myheritage)
  makeMatch('m1', 'Incognito Otter', 22.9, '23andme', {
    isNew: true,
    segments: [
      { chromosome: 3, startBp: 55000000, endBp: 65000000, cM: 10.2, snps: 780, isTriangulated: false },
      { chromosome: 9, startBp: 72000000, endBp: 82000000, cM: 8.5, snps: 640, isTriangulated: true, clusterId: 5 },
      { chromosome: 21, startBp: 20000000, endBp: 26000000, cM: 4.2, snps: 310, isTriangulated: false },
    ],
  }),
  makeMatch('m2', 'Incognito Gecko', 18.81, 'myheritage', {
    segments: [
      { chromosome: 9, startBp: 70000000, endBp: 80000000, cM: 8.1, snps: 620, isTriangulated: true, clusterId: 5 },
      { chromosome: 15, startBp: 60000000, endBp: 70000000, cM: 7.5, snps: 570, isTriangulated: false },
      { chromosome: 21, startBp: 22000000, endBp: 27000000, cM: 3.2, snps: 240, isTriangulated: false },
    ],
  }),
  makeMatch('m3', 'Anastasiya', 15.72, '23andme', {
    birthYear: '1980-1990', location: 'Russia',
    segments: [
      { chromosome: 3, startBp: 58000000, endBp: 66000000, cM: 8.3, snps: 630, isTriangulated: false },
      { chromosome: 9, startBp: 74000000, endBp: 82000000, cM: 7.4, snps: 560, isTriangulated: true, clusterId: 5 },
    ],
  }),
  makeMatch('m4', 'M*** Caldeira', 14.62, 'myheritage', {
    birthYear: '1960-1970', profileType: 'limited',
    segments: [
      { chromosome: 6, startBp: 90000000, endBp: 100000000, cM: 8.8, snps: 670, isTriangulated: false },
      { chromosome: 17, startBp: 45000000, endBp: 52000000, cM: 5.8, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('m5', 'U*** Blom', 13.86, 'myheritage', {
    birthYear: '1960-1970', location: 'Sweden',
    segments: [
      { chromosome: 2, startBp: 120000000, endBp: 130000000, cM: 7.9, snps: 600, isTriangulated: false },
      { chromosome: 18, startBp: 35000000, endBp: 42000000, cM: 5.9, snps: 440, isTriangulated: false },
    ],
  }),
  makeMatch('m6', 'D*** Sorensen', 13.27, 'myheritage', {
    birthYear: '1970-1980', location: 'Sverige',
    segments: [
      { chromosome: 4, startBp: 120000000, endBp: 128000000, cM: 7.2, snps: 550, isTriangulated: false },
      { chromosome: 11, startBp: 60000000, endBp: 66000000, cM: 6.1, snps: 460, isTriangulated: false },
    ],
  }),
  makeMatch('m7', 'Madeleine', 13.23, 'myheritage', {
    birthYear: '1990-2000', location: 'Brisbane QLD, Australia',
    segments: [
      { chromosome: 1, startBp: 150000000, endBp: 158000000, cM: 7.5, snps: 570, isTriangulated: false },
      { chromosome: 20, startBp: 40000000, endBp: 46000000, cM: 5.7, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('m8', 'Incognito Rhino', 13.1, 'myheritage', {
    birthYear: '2000-2010', location: 'UK',
    segments: [
      { chromosome: 7, startBp: 80000000, endBp: 88000000, cM: 7.3, snps: 555, isTriangulated: false },
      { chromosome: 16, startBp: 50000000, endBp: 56000000, cM: 5.8, snps: 435, isTriangulated: false },
    ],
  }),

  // GEDmatch matches with rich segments (from original mock data)
  makeMatch('AA6944936', 'James T Morrow', 45.9, 'gedmatch', {
    segments: [
      { chromosome: 3, startBp: 42000000, endBp: 49500000, cM: 7.5, snps: 612, isTriangulated: false },
      { chromosome: 5, startBp: 118000000, endBp: 125700000, cM: 7.7, snps: 580, isTriangulated: true, clusterId: 1 },
      { chromosome: 8, startBp: 62000000, endBp: 71200000, cM: 9.2, snps: 720, isTriangulated: true, clusterId: 1 },
      { chromosome: 12, startBp: 88000000, endBp: 98300000, cM: 10.3, snps: 830, isTriangulated: true, clusterId: 2 },
      { chromosome: 18, startBp: 22000000, endBp: 33300000, cM: 11.3, snps: 910, isTriangulated: false },
    ],
  }),
  makeMatch('AH2522709', 'Galina Panarina', 40.9, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 150000000, endBp: 157100000, cM: 7.1, snps: 540, isTriangulated: false },
      { chromosome: 4, startBp: 82000000, endBp: 89600000, cM: 7.6, snps: 590, isTriangulated: true, clusterId: 2 },
      { chromosome: 7, startBp: 34000000, endBp: 41600000, cM: 7.6, snps: 600, isTriangulated: false },
      { chromosome: 11, startBp: 96000000, endBp: 104100000, cM: 8.1, snps: 650, isTriangulated: true, clusterId: 2 },
      { chromosome: 15, startBp: 45000000, endBp: 55700000, cM: 10.7, snps: 860, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('BD8395908', 'Michelle Featherstone', 51.6, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 180000000, endBp: 187000000, cM: 7.0, snps: 510, isTriangulated: false },
      { chromosome: 3, startBp: 122000000, endBp: 129300000, cM: 7.3, snps: 560, isTriangulated: true, clusterId: 1 },
      { chromosome: 6, startBp: 45000000, endBp: 52300000, cM: 7.3, snps: 550, isTriangulated: false },
      { chromosome: 9, startBp: 98000000, endBp: 105600000, cM: 7.6, snps: 600, isTriangulated: true, clusterId: 1 },
      { chromosome: 14, startBp: 66000000, endBp: 76000000, cM: 10.0, snps: 810, isTriangulated: true, clusterId: 3 },
      { chromosome: 19, startBp: 12000000, endBp: 24400000, cM: 12.4, snps: 980, isTriangulated: true, clusterId: 1 },
    ],
  }),
  makeMatch('GA6180050', 'Marta', 57.7, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 88000000, endBp: 95100000, cM: 7.1, snps: 530, isTriangulated: true, clusterId: 2 },
      { chromosome: 4, startBp: 155000000, endBp: 162300000, cM: 7.3, snps: 555, isTriangulated: false },
      { chromosome: 7, startBp: 100000000, endBp: 107800000, cM: 7.8, snps: 610, isTriangulated: true, clusterId: 3 },
      { chromosome: 10, startBp: 50000000, endBp: 58000000, cM: 8.0, snps: 640, isTriangulated: true, clusterId: 2 },
      { chromosome: 13, startBp: 72000000, endBp: 80200000, cM: 8.2, snps: 660, isTriangulated: false },
      { chromosome: 16, startBp: 30000000, endBp: 38200000, cM: 8.2, snps: 650, isTriangulated: true, clusterId: 3 },
      { chromosome: 22, startBp: 20000000, endBp: 31100000, cM: 11.1, snps: 890, isTriangulated: true, clusterId: 2 },
    ],
  }),
  makeMatch('LH2037412', 'Ghislaine Reine', 49.8, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 85000000, endBp: 92000000, cM: 7.0, snps: 520, isTriangulated: false },
      { chromosome: 5, startBp: 55000000, endBp: 62400000, cM: 7.4, snps: 570, isTriangulated: true, clusterId: 3 },
      { chromosome: 8, startBp: 120000000, endBp: 127400000, cM: 7.4, snps: 575, isTriangulated: false },
      { chromosome: 11, startBp: 40000000, endBp: 47700000, cM: 7.7, snps: 605, isTriangulated: true, clusterId: 3 },
      { chromosome: 14, startBp: 30000000, endBp: 37900000, cM: 7.9, snps: 625, isTriangulated: true, clusterId: 1 },
      { chromosome: 20, startBp: 15000000, endBp: 27400000, cM: 12.4, snps: 990, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('MP1122867', 'Alex Romanov', 65.3, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 85000000, endBp: 97000000, cM: 12.1, snps: 950, isTriangulated: true, clusterId: 2 },
      { chromosome: 4, startBp: 84000000, endBp: 92000000, cM: 8.2, snps: 640, isTriangulated: true, clusterId: 2 },
      { chromosome: 10, startBp: 48000000, endBp: 60000000, cM: 11.5, snps: 900, isTriangulated: true, clusterId: 2 },
      { chromosome: 11, startBp: 94000000, endBp: 106000000, cM: 11.8, snps: 920, isTriangulated: true, clusterId: 2 },
      { chromosome: 16, startBp: 28000000, endBp: 40000000, cM: 10.5, snps: 820, isTriangulated: true, clusterId: 3 },
      { chromosome: 22, startBp: 18000000, endBp: 32000000, cM: 11.2, snps: 870, isTriangulated: true, clusterId: 2 },
    ],
  }),
  makeMatch('RV8404118', 'Sarah Romanov', 62.8, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 86000000, endBp: 96000000, cM: 10.8, snps: 840, isTriangulated: true, clusterId: 2 },
      { chromosome: 4, startBp: 83000000, endBp: 91000000, cM: 7.8, snps: 610, isTriangulated: true, clusterId: 2 },
      { chromosome: 10, startBp: 49000000, endBp: 59000000, cM: 10.2, snps: 800, isTriangulated: true, clusterId: 2 },
      { chromosome: 11, startBp: 95000000, endBp: 105000000, cM: 9.8, snps: 760, isTriangulated: true, clusterId: 2 },
      { chromosome: 14, startBp: 64000000, endBp: 74000000, cM: 10.4, snps: 810, isTriangulated: true, clusterId: 3 },
      { chromosome: 22, startBp: 19000000, endBp: 33000000, cM: 13.8, snps: 1070, isTriangulated: true, clusterId: 2 },
    ],
  }),
  makeMatch('MY3994172', 'Nikolai Petrov', 58.1, 'gedmatch', {
    segments: [
      { chromosome: 5, startBp: 53000000, endBp: 64000000, cM: 10.8, snps: 840, isTriangulated: true, clusterId: 3 },
      { chromosome: 7, startBp: 98000000, endBp: 109000000, cM: 9.8, snps: 760, isTriangulated: true, clusterId: 3 },
      { chromosome: 11, startBp: 38000000, endBp: 49000000, cM: 10.5, snps: 820, isTriangulated: true, clusterId: 3 },
      { chromosome: 15, startBp: 44000000, endBp: 56000000, cM: 11.2, snps: 870, isTriangulated: true, clusterId: 3 },
      { chromosome: 17, startBp: 24000000, endBp: 34000000, cM: 8.6, snps: 670, isTriangulated: false },
      { chromosome: 20, startBp: 14000000, endBp: 28000000, cM: 7.2, snps: 550, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('NY3840941', 'Elena Petrova', 55.4, 'gedmatch', {
    segments: [
      { chromosome: 5, startBp: 54000000, endBp: 63000000, cM: 9.2, snps: 710, isTriangulated: true, clusterId: 3 },
      { chromosome: 7, startBp: 99000000, endBp: 108000000, cM: 8.5, snps: 660, isTriangulated: true, clusterId: 3 },
      { chromosome: 14, startBp: 65000000, endBp: 75000000, cM: 10.6, snps: 830, isTriangulated: true, clusterId: 3 },
      { chromosome: 15, startBp: 43000000, endBp: 57000000, cM: 12.8, snps: 990, isTriangulated: true, clusterId: 3 },
      { chromosome: 20, startBp: 13000000, endBp: 26000000, cM: 14.3, snps: 1110, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('BV7122186', 'Mart', 43.0, 'gedmatch', {
    segments: [
      { chromosome: 3, startBp: 40000000, endBp: 50000000, cM: 9.8, snps: 760, isTriangulated: false },
      { chromosome: 5, startBp: 116000000, endBp: 126000000, cM: 9.5, snps: 740, isTriangulated: true, clusterId: 1 },
      { chromosome: 8, startBp: 60000000, endBp: 70000000, cM: 10.1, snps: 790, isTriangulated: true, clusterId: 1 },
      { chromosome: 14, startBp: 32000000, endBp: 40000000, cM: 8.0, snps: 620, isTriangulated: true, clusterId: 1 },
      { chromosome: 19, startBp: 11000000, endBp: 18000000, cM: 5.6, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('LN9616855', 'Jadwiga Szlapa', 44.4, 'gedmatch', {
    segments: [
      { chromosome: 3, startBp: 120000000, endBp: 130000000, cM: 9.6, snps: 750, isTriangulated: true, clusterId: 1 },
      { chromosome: 5, startBp: 117000000, endBp: 127000000, cM: 9.0, snps: 700, isTriangulated: true, clusterId: 1 },
      { chromosome: 9, startBp: 96000000, endBp: 107000000, cM: 10.2, snps: 790, isTriangulated: true, clusterId: 1 },
      { chromosome: 14, startBp: 28000000, endBp: 39000000, cM: 10.0, snps: 780, isTriangulated: true, clusterId: 1 },
      { chromosome: 19, startBp: 10000000, endBp: 25000000, cM: 5.6, snps: 430, isTriangulated: true, clusterId: 1 },
    ],
  }),
  makeMatch('LQ7491671', 'Lillian L H', 46.2, 'gedmatch', {
    segments: [
      { chromosome: 5, startBp: 52000000, endBp: 63000000, cM: 10.4, snps: 810, isTriangulated: true, clusterId: 3 },
      { chromosome: 7, startBp: 97000000, endBp: 110000000, cM: 11.6, snps: 900, isTriangulated: true, clusterId: 3 },
      { chromosome: 15, startBp: 42000000, endBp: 55000000, cM: 12.0, snps: 930, isTriangulated: true, clusterId: 3 },
      { chromosome: 20, startBp: 12000000, endBp: 28000000, cM: 12.2, snps: 950, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('HU5956991', 'Demetrios Xypolitos', 35.3, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 40000000, endBp: 50000000, cM: 9.2, snps: 710, isTriangulated: false },
      { chromosome: 6, startBp: 100000000, endBp: 110000000, cM: 8.5, snps: 660, isTriangulated: false },
      { chromosome: 17, startBp: 22000000, endBp: 35000000, cM: 10.8, snps: 840, isTriangulated: true, clusterId: 4 },
      { chromosome: 18, startBp: 48000000, endBp: 58000000, cM: 6.8, snps: 520, isTriangulated: true, clusterId: 4 },
    ],
  }),
  makeMatch('PA3344471', 'Yuri Gromov', 32.1, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 42000000, endBp: 51000000, cM: 8.4, snps: 650, isTriangulated: false },
      { chromosome: 17, startBp: 23000000, endBp: 34000000, cM: 9.5, snps: 740, isTriangulated: true, clusterId: 4 },
      { chromosome: 18, startBp: 49000000, endBp: 59000000, cM: 7.2, snps: 555, isTriangulated: true, clusterId: 4 },
      { chromosome: 22, startBp: 35000000, endBp: 42000000, cM: 7.0, snps: 535, isTriangulated: false },
    ],
  }),
  makeMatch('MA1803671', 'Chen Wei', 28.7, 'gedmatch', {
    segments: [
      { chromosome: 6, startBp: 102000000, endBp: 111000000, cM: 7.8, snps: 600, isTriangulated: false },
      { chromosome: 17, startBp: 25000000, endBp: 33000000, cM: 7.0, snps: 540, isTriangulated: true, clusterId: 4 },
      { chromosome: 18, startBp: 50000000, endBp: 60000000, cM: 8.4, snps: 650, isTriangulated: true, clusterId: 4 },
      { chromosome: 21, startBp: 30000000, endBp: 37000000, cM: 5.5, snps: 420, isTriangulated: false },
    ],
  }),
  makeMatch('XR7538735', 'Annika Berg', 31.5, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 43000000, endBp: 52000000, cM: 8.0, snps: 620, isTriangulated: false },
      { chromosome: 6, startBp: 103000000, endBp: 112000000, cM: 8.2, snps: 635, isTriangulated: false },
      { chromosome: 17, startBp: 24000000, endBp: 36000000, cM: 9.8, snps: 760, isTriangulated: true, clusterId: 4 },
      { chromosome: 18, startBp: 47000000, endBp: 57000000, cM: 5.5, snps: 420, isTriangulated: true, clusterId: 4 },
    ],
  }),
  makeMatch('ZN1325093', 'Karl Lindberg', 29.3, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 44000000, endBp: 53000000, cM: 7.6, snps: 585, isTriangulated: false },
      { chromosome: 17, startBp: 26000000, endBp: 34000000, cM: 7.2, snps: 555, isTriangulated: true, clusterId: 4 },
      { chromosome: 18, startBp: 51000000, endBp: 61000000, cM: 8.8, snps: 680, isTriangulated: true, clusterId: 4 },
      { chromosome: 22, startBp: 33000000, endBp: 40000000, cM: 5.7, snps: 435, isTriangulated: false },
    ],
  }),
  // Additional unclustered matches
  makeMatch('AT1277057', 'Billy W Stephens', 38.4, 'gedmatch', {
    segments: [
      { chromosome: 5, startBp: 119000000, endBp: 127000000, cM: 8.0, snps: 620, isTriangulated: true, clusterId: 1 },
      { chromosome: 8, startBp: 63000000, endBp: 72000000, cM: 9.5, snps: 740, isTriangulated: true, clusterId: 1 },
      { chromosome: 12, startBp: 85000000, endBp: 95000000, cM: 10.0, snps: 780, isTriangulated: false },
      { chromosome: 19, startBp: 13000000, endBp: 22000000, cM: 10.9, snps: 850, isTriangulated: true, clusterId: 1 },
    ],
  }),
  makeMatch('BA6625398', 'Loel P Wilson', 39.4, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 87000000, endBp: 96000000, cM: 9.0, snps: 700, isTriangulated: true, clusterId: 2 },
      { chromosome: 4, startBp: 81000000, endBp: 90000000, cM: 8.8, snps: 685, isTriangulated: true, clusterId: 2 },
      { chromosome: 10, startBp: 51000000, endBp: 59000000, cM: 7.5, snps: 580, isTriangulated: true, clusterId: 2 },
      { chromosome: 12, startBp: 87000000, endBp: 97000000, cM: 9.6, snps: 750, isTriangulated: false },
      { chromosome: 22, startBp: 20000000, endBp: 30000000, cM: 4.5, snps: 345, isTriangulated: false },
    ],
  }),
  makeMatch('BD2350643', 'Milosh', 36.8, 'gedmatch', {
    segments: [
      { chromosome: 2, startBp: 89000000, endBp: 97000000, cM: 8.2, snps: 635, isTriangulated: true, clusterId: 2 },
      { chromosome: 10, startBp: 52000000, endBp: 60000000, cM: 7.8, snps: 605, isTriangulated: true, clusterId: 2 },
      { chromosome: 13, startBp: 70000000, endBp: 78000000, cM: 7.0, snps: 540, isTriangulated: false },
      { chromosome: 22, startBp: 19000000, endBp: 32000000, cM: 13.8, snps: 1070, isTriangulated: true, clusterId: 2 },
    ],
  }),
  makeMatch('CM4282482', 'Daisy', 39.7, 'gedmatch', {
    segments: [
      { chromosome: 3, startBp: 44000000, endBp: 52000000, cM: 8.0, snps: 620, isTriangulated: false },
      { chromosome: 5, startBp: 120000000, endBp: 128000000, cM: 8.4, snps: 650, isTriangulated: true, clusterId: 1 },
      { chromosome: 8, startBp: 61000000, endBp: 72000000, cM: 10.8, snps: 840, isTriangulated: true, clusterId: 1 },
      { chromosome: 14, startBp: 31000000, endBp: 39000000, cM: 7.5, snps: 580, isTriangulated: true, clusterId: 1 },
      { chromosome: 19, startBp: 14000000, endBp: 21000000, cM: 5.0, snps: 385, isTriangulated: false },
    ],
  }),
  makeMatch('DE1534183', 'Jordi', 34.8, 'gedmatch', {
    segments: [
      { chromosome: 7, startBp: 101000000, endBp: 110000000, cM: 8.0, snps: 620, isTriangulated: true, clusterId: 3 },
      { chromosome: 11, startBp: 39000000, endBp: 48000000, cM: 8.5, snps: 660, isTriangulated: true, clusterId: 3 },
      { chromosome: 15, startBp: 46000000, endBp: 54000000, cM: 7.2, snps: 555, isTriangulated: true, clusterId: 3 },
      { chromosome: 20, startBp: 16000000, endBp: 27000000, cM: 11.1, snps: 860, isTriangulated: true, clusterId: 3 },
    ],
  }),
  makeMatch('GW7762244', 'Savannah Heffner', 35.8, 'gedmatch', {
    treeUrl: '#',
    segments: [
      { chromosome: 5, startBp: 56000000, endBp: 64000000, cM: 7.8, snps: 605, isTriangulated: true, clusterId: 3 },
      { chromosome: 14, startBp: 67000000, endBp: 77000000, cM: 10.2, snps: 790, isTriangulated: true, clusterId: 3 },
      { chromosome: 15, startBp: 44000000, endBp: 57000000, cM: 12.5, snps: 970, isTriangulated: true, clusterId: 3 },
      { chromosome: 20, startBp: 14000000, endBp: 25000000, cM: 5.3, snps: 410, isTriangulated: false },
    ],
  }),
  makeMatch('CD7711377', 'Viktoriia Veselova', 34.2, 'gedmatch', {
    segments: [
      { chromosome: 1, startBp: 100000000, endBp: 108000000, cM: 7.5, snps: 580, isTriangulated: false },
      { chromosome: 6, startBp: 48000000, endBp: 56000000, cM: 7.0, snps: 540, isTriangulated: false },
      { chromosome: 12, startBp: 90000000, endBp: 100000000, cM: 10.0, snps: 780, isTriangulated: false },
      { chromosome: 19, startBp: 30000000, endBp: 40000000, cM: 9.7, snps: 750, isTriangulated: false },
    ],
  }),
  // Some small unclustered ones
  makeMatch('m9', 'Lara', 12.81, '23andme', {
    birthYear: '1980-1990',
    segments: [
      { chromosome: 10, startBp: 80000000, endBp: 88000000, cM: 7.2, snps: 555, isTriangulated: false },
      { chromosome: 19, startBp: 40000000, endBp: 46000000, cM: 5.6, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('m10', 'A*** Hetman', 12.97, 'myheritage', {
    birthYear: '1990-2000', location: 'Odessa, Ukraine',
    segments: [
      { chromosome: 8, startBp: 100000000, endBp: 108000000, cM: 7.4, snps: 570, isTriangulated: false },
      { chromosome: 16, startBp: 60000000, endBp: 66000000, cM: 5.6, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('m11', 'Incognito Flamingo', 12.76, 'myheritage', {
    segments: [
      { chromosome: 5, startBp: 80000000, endBp: 88000000, cM: 7.1, snps: 545, isTriangulated: false },
      { chromosome: 13, startBp: 40000000, endBp: 46000000, cM: 5.7, snps: 435, isTriangulated: false },
    ],
  }),
  makeMatch('m12', 'E*** Abankina', 12.35, 'myheritage', {
    birthYear: '1980-1990', location: 'Kemerovo, Russia',
    segments: [
      { chromosome: 3, startBp: 90000000, endBp: 97000000, cM: 6.8, snps: 520, isTriangulated: false },
      { chromosome: 11, startBp: 80000000, endBp: 86000000, cM: 5.6, snps: 430, isTriangulated: false },
    ],
  }),
  makeMatch('m13', 'Incognito Capybara', 11.83, '23andme', {
    segments: [
      { chromosome: 2, startBp: 180000000, endBp: 188000000, cM: 7.0, snps: 540, isTriangulated: false },
      { chromosome: 20, startBp: 50000000, endBp: 55000000, cM: 4.8, snps: 370, isTriangulated: false },
    ],
  }),
  makeMatch('m14', 'Incognito Rhino', 12.15, 'myheritage', {
    segments: [
      { chromosome: 7, startBp: 50000000, endBp: 57000000, cM: 6.5, snps: 500, isTriangulated: false },
      { chromosome: 15, startBp: 80000000, endBp: 86000000, cM: 5.7, snps: 435, isTriangulated: false },
    ],
  }),
];

// Helper to find a match by ID
export function getMatchById(id: string): DNAMatch | undefined {
  return mockMatches.find(m => m.id === id);
}

// Helper to get all matches for a list of IDs
export function getMatchesByIds(ids: string[]): DNAMatch[] {
  return ids.map(id => mockMatches.find(m => m.id === id)).filter(Boolean) as DNAMatch[];
}
