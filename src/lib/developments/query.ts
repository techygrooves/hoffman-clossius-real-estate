/**
 * Reading and writing a DevelopmentQuery as URL query parameters, so a
 * filtered view can be bookmarked or sent to someone.
 *
 * Imported by both the Astro pages and the browser script, so no Node or DOM
 * dependency belongs here.
 */
import type {
  DevelopmentQuery,
  DevelopmentSort,
  DevelopmentStatus,
  DevelopmentType,
} from './types';

export const DEV_PARAM = {
  search: 'q',
  city: 'city',
  status: 'status',
  developmentType: 'type',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  beds: 'beds',
  sort: 'sort',
} as const;

const STATUSES: readonly DevelopmentStatus[] = [
  'pre-construction',
  'under-construction',
  'now-selling',
  'completed',
  'sold-out',
];

const TYPES: readonly DevelopmentType[] = [
  'condominium',
  'single-family',
  'townhome',
  'mixed-use',
  'gated-community',
  'other',
];

const SORTS: readonly DevelopmentSort[] = [
  'name-asc',
  'price-asc',
  'price-desc',
  'completion-asc',
];

export const DEVELOPMENT_STATUS_LABELS: Record<DevelopmentStatus, string> = {
  'pre-construction': 'Pre-Construction',
  'under-construction': 'Under Construction',
  'now-selling': 'Now Selling',
  completed: 'Completed',
  'sold-out': 'Sold Out',
};

export const DEVELOPMENT_TYPE_LABELS: Record<DevelopmentType, string> = {
  condominium: 'Condominium',
  'single-family': 'Single Family',
  townhome: 'Townhome',
  'mixed-use': 'Mixed Use',
  'gated-community': 'Gated Community',
  other: 'Other',
};

export const DEVELOPMENT_SORT_LABELS: Record<DevelopmentSort, string> = {
  'name-asc': 'Name A–Z',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'completion-asc': 'Soonest completion',
};

export const SELECTABLE_DEVELOPMENT_STATUSES = STATUSES;
export const SELECTABLE_DEVELOPMENT_TYPES = TYPES;
export const SELECTABLE_DEVELOPMENT_SORTS = SORTS;

/* -------------------------------------------------------------------------- */

const toPositiveInt = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
};

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

/** Malformed values are dropped, not rejected — a mangled URL still works. */
export function parseDevelopmentQuery(
  input: URLSearchParams | string,
): DevelopmentQuery {
  const params = typeof input === 'string' ? new URLSearchParams(input) : input;

  const search = params.get(DEV_PARAM.search)?.trim();
  const city = params.get(DEV_PARAM.city)?.trim();
  const sortRaw = params.get(DEV_PARAM.sort);
  const sort = SORTS.includes(sortRaw as DevelopmentSort)
    ? (sortRaw as DevelopmentSort)
    : undefined;

  return {
    ...(search ? { search } : {}),
    ...(city ? { city } : {}),
    ...(toList(params, DEV_PARAM.status, STATUSES)
      ? { status: toList(params, DEV_PARAM.status, STATUSES) }
      : {}),
    ...(toList(params, DEV_PARAM.developmentType, TYPES)
      ? { developmentType: toList(params, DEV_PARAM.developmentType, TYPES) }
      : {}),
    ...(toPositiveInt(params.get(DEV_PARAM.minPrice)) !== undefined
      ? { minPrice: toPositiveInt(params.get(DEV_PARAM.minPrice)) }
      : {}),
    ...(toPositiveInt(params.get(DEV_PARAM.maxPrice)) !== undefined
      ? { maxPrice: toPositiveInt(params.get(DEV_PARAM.maxPrice)) }
      : {}),
    ...(toPositiveInt(params.get(DEV_PARAM.beds)) !== undefined
      ? { beds: toPositiveInt(params.get(DEV_PARAM.beds)) }
      : {}),
    ...(sort ? { sort } : {}),
  };
}

export function serialiseDevelopmentQuery(query: DevelopmentQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set(DEV_PARAM.search, query.search);
  if (query.city) params.set(DEV_PARAM.city, query.city);
  query.status?.forEach((s) => params.append(DEV_PARAM.status, s));
  query.developmentType?.forEach((t) => params.append(DEV_PARAM.developmentType, t));
  if (query.minPrice) params.set(DEV_PARAM.minPrice, String(query.minPrice));
  if (query.maxPrice) params.set(DEV_PARAM.maxPrice, String(query.maxPrice));
  if (query.beds) params.set(DEV_PARAM.beds, String(query.beds));
  if (query.sort && query.sort !== 'name-asc') params.set(DEV_PARAM.sort, query.sort);
  return params.toString();
}
