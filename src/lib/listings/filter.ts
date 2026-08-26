/**
 * Filtering, sorting and pagination over an in-memory set of listings.
 *
 * Pure functions, no I/O. Used in two places, and it matters that they share
 * one implementation:
 *
 *  - the demo provider, at build time
 *  - the browser, when a visitor changes a filter without a page reload
 *
 * A provider that filters server-side (most IDX APIs do) simply does not use
 * this — it translates ListingQuery into its own request instead.
 */
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  type Listing,
  type ListingQuery,
  type ListingResult,
} from './types';

/** Free-text match across the parts of an address a person would type. */
function matchesLocation(listing: Listing, term: string): boolean {
  const needle = term.trim().toLowerCase();
  if (needle === '') return true;

  const haystack = [
    listing.address.line1,
    listing.address.city,
    listing.address.state,
    listing.address.zip,
    listing.address.county,
    listing.address.neighborhood,
  ]
    .filter((v): v is string => Boolean(v))
    .join(' ')
    .toLowerCase();

  // Every word must appear somewhere, so "hollywood 33019" narrows rather
  // than widening the way an OR would.
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

export function matchesQuery(listing: Listing, query: ListingQuery): boolean {
  if (query.location && !matchesLocation(listing, query.location)) return false;

  if (query.status?.length && !query.status.includes(listing.status)) return false;

  if (query.propertyType?.length && !query.propertyType.includes(listing.propertyType)) {
    return false;
  }

  // A listing with no price is excluded from a price-bounded search rather
  // than being assumed to fall inside it.
  if (query.minPrice !== undefined) {
    if (listing.price === null || listing.price < query.minPrice) return false;
  }
  if (query.maxPrice !== undefined) {
    if (listing.price === null || listing.price > query.maxPrice) return false;
  }

  if (query.beds !== undefined) {
    if (listing.beds === null || listing.beds < query.beds) return false;
  }
  if (query.baths !== undefined) {
    const total = (listing.baths ?? 0) + (listing.halfBaths ?? 0) * 0.5;
    if (listing.baths === null || total < query.baths) return false;
  }

  // An unknown feature is not a match: `null` means the feed did not say, and
  // showing it under "Waterfront" would be asserting something we don't know.
  if (query.waterfront === true && listing.waterfront !== true) return false;
  if (query.pool === true && listing.pool !== true) return false;

  if (query.ourListingsOnly && listing.listingAgent?.isOurAgent !== true) return false;

  return true;
}

/** Nulls always sort last, whichever direction is asked for. */
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

export function sortListings(
  listings: readonly Listing[],
  sort = DEFAULT_SORT,
): Listing[] {
  const out = [...listings];

  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => compareNumbers(a.price, b.price, 'asc'));
    case 'price-desc':
      return out.sort((a, b) => compareNumbers(a.price, b.price, 'desc'));
    case 'beds-desc':
      return out.sort((a, b) => compareNumbers(a.beds, b.beds, 'desc'));
    case 'sqft-desc':
      return out.sort((a, b) => compareNumbers(a.sqft, b.sqft, 'desc'));
    case 'newest':
    default:
      return out.sort((a, b) => {
        const at = a.updatedAt ? Date.parse(a.updatedAt) : NaN;
        const bt = b.updatedAt ? Date.parse(b.updatedAt) : NaN;
        return compareNumbers(
          Number.isNaN(at) ? null : at,
          Number.isNaN(bt) ? null : bt,
          'desc',
        );
      });
  }
}

/** Filter, sort and paginate in one pass. */
export function queryListings(
  listings: readonly Listing[],
  query: ListingQuery,
): ListingResult {
  const matched = listings.filter((listing) => matchesQuery(listing, query));
  const sorted = sortListings(matched, query.sort);

  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  // A page number past the end lands on the last page rather than showing
  // nothing, which is what a stale bookmarked URL usually needs.
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    listings: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
    totalPages: sorted.length === 0 ? 0 : totalPages,
  };
}

/**
 * Comparable listings for a detail page: same status, nearest price, same city
 * preferred. Deliberately simple — a real provider usually has its own notion
 * of comparables and should override this.
 */
export function findSimilar(
  listings: readonly Listing[],
  target: Listing,
  limit = 3,
): Listing[] {
  return listings
    .filter((l) => l.id !== target.id && l.status === target.status)
    .map((l) => {
      const sameCity = l.address.city === target.address.city ? 0 : 1;
      const priceGap =
        l.price !== null && target.price !== null
          ? Math.abs(l.price - target.price) / Math.max(target.price, 1)
          : 1;
      return { listing: l, score: sameCity * 2 + priceGap };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((entry) => entry.listing);
}
