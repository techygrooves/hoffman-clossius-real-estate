/**
 * Shared formatting helpers.
 *
 * NOTE: these format data that has been supplied to us. They never invent
 * values — a null input returns an empty string so callers can skip rendering.
 */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** $1,250,000 — used for listing prices once real MLS data is connected. */
export const formatPrice = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) ? usd.format(value) : '';

/** 1,842 */
export const formatNumber = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en-US').format(value)
    : '';

/** March 4, 2026 */
export const formatDate = (value: Date | string | null | undefined): string => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

/** 2026-03-04 — for <time datetime=""> */
export const toISODate = (value: Date | string | null | undefined): string => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};
