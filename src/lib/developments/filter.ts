/**
 * Filtering and sorting developments. Pure functions, no I/O.
 *
 * Shared by the build and the browser, so a filter behaves identically
 * whichever runs it.
 */
import {
  DEFAULT_DEVELOPMENT_SORT,
  type Development,
  type DevelopmentCategory,
  type DevelopmentQuery,
  type NumericRange,
} from './types';

/** True when a range could contain `value`. Unknown ends never exclude. */
const rangeAllows = (range: NumericRange, value: number): boolean => {
  if (range.max !== null && range.max < value) return false;
  // A minimum above the requested value still qualifies: asking for 2+ beds
  // should match a development starting at 3.
  return true;
};

export function matchesDevelopment(
  development: Development,
  query: DevelopmentQuery,
): boolean {
  if (query.category && development.category !== query.category) return false;

  if (query.search) {
    const needle = query.search.trim().toLowerCase();
    const haystack = [
      development.name,
      development.city,
      development.address.line1,
      development.address.zip,
      development.developer,
      development.architect,
      development.summary,
    ]
      .filter((v): v is string => Boolean(v))
      .join(' ')
      .toLowerCase();
    if (!needle.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }

  if (query.city && development.city.toLowerCase() !== query.city.toLowerCase()) {
    return false;
  }

  if (query.status?.length && !query.status.includes(development.status)) return false;

  if (
    query.developmentType?.length &&
    !query.developmentType.includes(development.developmentType)
  ) {
    return false;
  }

  // An unpublished starting price is excluded from a price-bounded search
  // rather than assumed to fall inside it.
  if (query.minPrice !== undefined) {
    if (development.startingPrice === null) return false;
    if (development.startingPrice < query.minPrice) return false;
  }
  if (query.maxPrice !== undefined) {
    if (development.startingPrice === null) return false;
    if (development.startingPrice > query.maxPrice) return false;
  }

  if (query.beds !== undefined) {
    const { bedroomRange } = development;
    if (bedroomRange.min === null && bedroomRange.max === null) return false;
    if (!rangeAllows(bedroomRange, query.beds)) return false;
  }

  return true;
}

const compareNumbers = (
  a: number | null,
  b: number | null,
  direction: 'asc' | 'desc',
): number => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === 'asc' ? a - b : b - a;
};

export function sortDevelopments(
  developments: readonly Development[],
  sort = DEFAULT_DEVELOPMENT_SORT,
): Development[] {
  const out = [...developments];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => compareNumbers(a.startingPrice, b.startingPrice, 'asc'));
    case 'price-desc':
      return out.sort((a, b) => compareNumbers(a.startingPrice, b.startingPrice, 'desc'));
    case 'completion-asc':
      return out.sort((a, b) => compareNumbers(a.completionYear, b.completionYear, 'asc'));
    case 'name-asc':
    default:
      return out.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }
}

export function queryDevelopments(
  developments: readonly Development[],
  query: DevelopmentQuery,
): Development[] {
  return sortDevelopments(
    developments.filter((d) => matchesDevelopment(d, query)),
    query.sort,
  );
}

/** Same category first, then same city, then nearest starting price. */
export function findRelatedDevelopments(
  developments: readonly Development[],
  target: Development,
  limit = 3,
): Development[] {
  return developments
    .filter((d) => d.id !== target.id)
    .map((d) => {
      const sameCategory = d.category === target.category ? 0 : 4;
      const sameCity = d.city === target.city ? 0 : 2;
      const priceGap =
        d.startingPrice !== null && target.startingPrice !== null
          ? Math.abs(d.startingPrice - target.startingPrice) /
            Math.max(target.startingPrice, 1)
          : 1;
      return { development: d, score: sameCategory + sameCity + priceGap };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((entry) => entry.development);
}

/** Distinct cities, alphabetical, for the filter control. */
export function citiesFrom(
  developments: readonly Development[],
  category?: DevelopmentCategory,
): string[] {
  const scoped = category
    ? developments.filter((d) => d.category === category)
    : developments;
  return [...new Set(scoped.map((d) => d.city))].sort((a, b) => a.localeCompare(b, 'en'));
}
