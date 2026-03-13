export const AVATAR_COLORS: Record<string, string> = {
  A: '#FF6B6B', B: '#4ECDC4', C: '#45B7D1', D: '#96CEB4',
  E: '#FFEAA7', F: '#DDA0DD', G: '#98D8C8', H: '#F7DC6F',
  I: '#BB8FCE', J: '#85C1E9', K: '#F0B27A', L: '#AED6F1',
  M: '#D5A6BD', N: '#A3E4D7', O: '#F5CBA7', P: '#AEB6BF',
  Q: '#D2B4DE', R: '#A9DFBF', S: '#FAD7A0', T: '#A9CCE3',
  U: '#D7BDE2', V: '#A2D9CE', W: '#F9E79F', X: '#ABEBC6',
  Y: '#F5B7B1', Z: '#D6DBDF',
};

export function getAvatarColor(name: string): string {
  const letter = name.charAt(0).toUpperCase();
  return AVATAR_COLORS[letter] || '#AEB6BF';
}

export function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
