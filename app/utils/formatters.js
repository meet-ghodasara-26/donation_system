/**
 * Format a number as Indian currency (₹)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Generate initials from a name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Get a color for avatar based on name
 * @param {string} name
 * @returns {string}
 */
export function getAvatarColor(name) {
  const colors = [
    '#FF6B35', '#F7931E', '#FFD700', '#E8A000',
    '#C0392B', '#E67E22', '#D4A017', '#B8860B',
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Determine donor tier based on amount
 * @param {number} amount
 * @returns {{ label: string, color: string }}
 */
export function getDonorTier(amount) {
  if (amount >= 50000) return { label: 'Mahadaani', color: '#FFD700' };
  if (amount >= 10000) return { label: 'Suvarnadaani', color: '#FFA500' };
  if (amount >= 5000) return { label: 'Rajatdaani', color: '#C0C0C0' };
  if (amount >= 1000) return { label: 'Shreshthadaani', color: '#CD7F32' };
  return { label: 'Daani', color: '#8B4513' };
}
