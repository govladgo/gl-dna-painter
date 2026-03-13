export function formatMb(bp: number): string {
  return `${(bp / 1_000_000).toFixed(1)} Mb`;
}

export function formatCM(cM: number): string {
  return `${cM.toFixed(1)} cM`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export function formatRelationship(cM: number): string {
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
