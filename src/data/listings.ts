/**
 * ---------------------------------------------------------------------------
 * PROPERTY LISTINGS
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY.
 *
 * Listing data comes from the client's IDX/MLS provider once that integration
 * is confirmed (CONTENT_PENDING.md → "IDX / MLS provider"). Until then:
 *
 *   - Do NOT add sample, demo or "representative" listings.
 *   - Do NOT scrape listing data from any MLS, portal or competitor site.
 *   - Do NOT invent prices, addresses, photos, square footage or MLS numbers.
 *
 * Pages that consume this module must render an honest empty state.
 * ---------------------------------------------------------------------------
 */

export type ListingStatus =
  | 'for-sale'
  | 'for-rent'
  | 'pending'
  | 'sold'
  | 'leased';

export type Listing = {
  readonly slug: string;
  readonly mlsId: string;
  readonly status: ListingStatus;
  readonly headline: string;
  readonly addressLine: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly price: number | null;
  readonly beds: number | null;
  readonly baths: number | null;
  readonly halfBaths: number | null;
  readonly livingAreaSqFt: number | null;
  readonly lotSizeSqFt: number | null;
  readonly yearBuilt: number | null;
  readonly propertyType: string | null;
  readonly description: string | null;
  readonly images: readonly { src: string; alt: string }[];
  /** True when Hoffman & Closius represent this property directly. */
  readonly isOurListing: boolean;
};

export const listings: readonly Listing[] = [];

export const listingsByStatus = (status: ListingStatus): readonly Listing[] =>
  listings.filter((listing) => listing.status === status);

export const ourListings = (): readonly Listing[] =>
  listings.filter((listing) => listing.isOurListing);

export const getListing = (slug: string): Listing | undefined =>
  listings.find((listing) => listing.slug === slug);
