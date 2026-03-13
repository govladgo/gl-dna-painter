import { ChromosomeInfo } from '../types';

export const CHROMOSOME_DATA: ChromosomeInfo[] = [
  { chromosome: 1, lengthMb: 248.96, lengthCM: 286.3 },
  { chromosome: 2, lengthMb: 242.19, lengthCM: 268.8 },
  { chromosome: 3, lengthMb: 198.30, lengthCM: 223.4 },
  { chromosome: 4, lengthMb: 190.21, lengthCM: 214.7 },
  { chromosome: 5, lengthMb: 181.54, lengthCM: 204.1 },
  { chromosome: 6, lengthMb: 170.81, lengthCM: 192.0 },
  { chromosome: 7, lengthMb: 159.35, lengthCM: 187.2 },
  { chromosome: 8, lengthMb: 145.14, lengthCM: 168.0 },
  { chromosome: 9, lengthMb: 138.39, lengthCM: 166.4 },
  { chromosome: 10, lengthMb: 133.80, lengthCM: 181.1 },
  { chromosome: 11, lengthMb: 135.09, lengthCM: 158.2 },
  { chromosome: 12, lengthMb: 133.28, lengthCM: 174.7 },
  { chromosome: 13, lengthMb: 114.36, lengthCM: 125.6 },
  { chromosome: 14, lengthMb: 107.04, lengthCM: 120.2 },
  { chromosome: 15, lengthMb: 101.99, lengthCM: 141.4 },
  { chromosome: 16, lengthMb: 90.34, lengthCM: 134.0 },
  { chromosome: 17, lengthMb: 83.26, lengthCM: 128.5 },
  { chromosome: 18, lengthMb: 80.37, lengthCM: 117.7 },
  { chromosome: 19, lengthMb: 58.62, lengthCM: 107.7 },
  { chromosome: 20, lengthMb: 64.44, lengthCM: 108.3 },
  { chromosome: 21, lengthMb: 46.71, lengthCM: 62.8 },
  { chromosome: 22, lengthMb: 50.82, lengthCM: 74.1 },
];

export const MAX_CHROMOSOME_LENGTH_MB = Math.max(...CHROMOSOME_DATA.map(c => c.lengthMb));
