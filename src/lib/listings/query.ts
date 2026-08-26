/**
 * Reading and writing a ListingQuery as URL query parameters.
 *
 * Searches are shareable: every filter lives in the URL, so a result page can
 * be bookmarked, sent to a client, or opened again later and look the same.
 *
 * This module is imported by both the Astro pages (at build time) and the
 * browser script (at runtime), so it must stay free of any Node or DOM
 * dependency — plain functions over URLSearchParams only.
 */
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  type ListingQuery,
  type ListingSort,
  type ListingStatus,
  type PropertyType,
} from './types';

/** Query-string keys. Kept short and readable, because people see them. */
export const PARAM = {
  location: 'location',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  beds: 'beds',
  baths: 'baths',
  propertyType: 'type',
  status: 'status',
  waterfront: 'waterfront',
  pool: 'pool',
  sort: 'sort',
  page: 'page',
} as const;

const PROPERTY_TYPES: readonly PropertyType[] = [
  'single-family',
  'condominium',
  'townhouse',
  'villa',
  'multi-family',
  'land',
  'commercial',
  'other',
];

const STATUSES: readonly ListingStatus[] = [
  'for-sale',
  'for-rent',
  'coming-soon',
  'pending',
  'sold',
  'leased',
  'off-market',
];

const SORTS: readonly ListingSort[] = [
  'newest',
  'price-desc',
  'price-asc',
  'beds-desc',
  'sqft-desc',
];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  'single-family': 'Single Family',
  condominium: 'Condominium',
  townhouse: 'Townhouse',
  villa: 'Villa',
  'multi-family': 'Multi-Family',
  land: 'Land',
  commercial: 'Commercial',
  other: 'Other',
};

export const STATUS_LABELS: Record<ListingStatus, string> = {
  'for-sale': 'For Sale',
  'for-rent': 'For Rent',
  'coming-soon': 'Coming Soon',
  pending: 'Pending',
  sold: 'Sold',
  leased: 'Leased',
  'off-market': 'Off Market',
};

export const SORT_LABELS: Record<ListingSort, string> = {
  newest: 'Newest first',
  'price-desc': 'Price: high to low',
  'price-asc': 'Price: low to high',
  'beds-desc': 'Most bedrooms',
  'sqft-desc': 'Largest',
};

export const SELECTABLE_PROPERTY_TYPES = PROPERTY_TYPES;
export const SELECTABLE_SORTS = SORTS;

/* -------------------------------------------------------------------------- */

const toPositiveInt = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
};

const toBool = (raw: string | null): boolean | undefined => {
  if (raw === null) return undefined;
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return undefined;
};

/** Accepts repeated params (?type=a&type=b) and comma lists (?type=a,b). */
function toList<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): readonly T[] | undefined {
  const raw = params.getAll(key).flatMap((v) => v.split(','));
  const valid = raw
    .map((v) => v.trim())
    .filter((v): v is T => (allowed as readonly string[]).includes(v));
  return valid.length > 0 ? [...new Set(valid)] : undefined;
}

/**
 * Parses a query string into a ListingQuery.
 * Unknown or malformed values are dropped rather than rejected — a mangled URL
 * should still show results, just fewer filters.
 */
export function parseListingQuery(
  input: URLSearchParams | string,
): ListingQuery {
  const params =
    typeof input === 'string' ? new URLSearchParams(input) : input;

  const location = params.get(PARAM.location)?.trim();
  const sortRaw = params.get(PARAM.sort);
  const sort = SORTS.includes(sortRaw as ListingSort)
    ? (sortRaw as ListingSort)
    : undefined;

  return {
    ...(location ? { location } : {}),
    ...(toPositiveInt(params.get(PARAM.minPrice)) !== undefined
      ? { minPrice: toPositiveInt(params.get(PARAM.minPrice)) }
      : {}),
    ...(toPositiveInt(params.get(PARAM.maxPrice)) !== undefined
      ? { maxPrice: toPositiveInt(params.get(PARAM.maxPrice)) }
      : {}),
    ...(toPositiveInt(params.get(PARAM.beds)) !== undefined
      ? { beds: toPositiveInt(params.get(PARAM.beds)) }
      : {}),
    ...(toPositiveInt(params.get(PARAM.baths)) !== undefined
      ? { baths: toPositiveInt(params.get(PARAM.baths)) }
      : {}),
    ...(toList(params, PARAM.propertyType, PROPERTY_TYPES)
      ? { propertyType: toList(params, PARAM.propertyType, PROPERTY_TYPES) }
      : {}),
    ...(toList(params, PARAM.status, STATUSES)
      ? { status: toList(params, PARAM.status, STATUSES) }
      : {}),
    ...(toBool(params.get(PARAM.waterfront)) !== undefined
      ? { waterfront: toBool(params.get(PARAM.waterfront)) }
      : {}),
    ...(toBool(params.get(PARAM.pool)) !== undefined
      ? { pool: toBool(params.get(PARAM.pool)) }
      : {}),
    ...(sort ? { sort } : {}),
    page: toPositiveInt(params.get(PARAM.page)) ?? 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

/**
 * Serialises a query back to a string. Defaults and empty values are omitted,
 * so a URL only ever carries the filters actually in effect.
 */
export function serialiseListingQuery(query: ListingQuery): string {
  const params = new URLSearchParams();

  if (query.location) params.set(PARAM.location, query.location);
  if (query.minPrice) params.set(PARAM.minPrice, String(query.minPrice));
  if (query.maxPrice) params.set(PARAM.maxPrice, String(query.maxPrice));
  if (query.beds) params.set(PARAM.beds, String(query.beds));
  if (query.baths) params.set(PARAM.baths, String(query.baths));
  query.propertyType?.forEach((t) => params.append(PARAM.propertyType, t));
  query.status?.forEach((s) => params.append(PARAM.status, s));
  if (query.waterfront) params.set(PARAM.waterfront, 'true');
  if (query.pool) params.set(PARAM.pool, 'true');
  if (query.sort && query.sort !== DEFAULT_SORT) params.set(PARAM.sort, query.sort);
  if (query.page && query.page > 1) params.set(PARAM.page, String(query.page));

  return params.toString();
}

/** True when the visitor has narrowed anything at all. */
export function hasActiveFilters(query: ListingQuery): boolean {
  return Boolean(
    query.location ||
      query.minPrice ||
      query.maxPrice ||
      query.beds ||
      query.baths ||
      query.propertyType?.length ||
      query.waterfront ||
      query.pool,
  );
}

/** Human-readable chips for the filters currently applied. */
export function describeFilters(
  query: ListingQuery,
  formatPrice: (n: number) => string,
): readonly { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];

  if (query.location) chips.push({ key: PARAM.location, label: query.location });
  if (query.minPrice)
    chips.push({ key: PARAM.minPrice, label: `From ${formatPrice(query.minPrice)}` });
  if (query.maxPrice)
    chips.push({ key: PARAM.maxPrice, label: `Up to ${formatPrice(query.maxPrice)}` });
  if (query.beds) chips.push({ key: PARAM.beds, label: `${query.beds}+ beds` });
  if (query.baths) chips.push({ key: PARAM.baths, label: `${query.baths}+ baths` });
  query.propertyType?.forEach((t) =>
    chips.push({ key: `${PARAM.propertyType}:${t}`, label: PROPERTY_TYPE_LABELS[t] }),
  );
  if (query.waterfront) chips.push({ key: PARAM.waterfront, label: 'Waterfront' });
  if (query.pool) chips.push({ key: PARAM.pool, label: 'Pool' });

  return chips;
}
