/** Currency formatter — treats 0 as "Free". */
export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

/** Human-friendly date, e.g. "30 May 2026". */
export const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

/** Whole days remaining until a date (never negative). */
export const daysRemaining = (endDate) => {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/** Capitalize the first letter of a string. */
export const capitalize = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1);

/** Derive initials from a name for avatar fallbacks. */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';
