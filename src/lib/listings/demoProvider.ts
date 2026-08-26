/**
 * Demo provider — serves the placeholder dataset in `demoData.ts`.
 *
 * `isLive` is false and every record carries `demo: true`, so the UI labels
 * everything it renders. Selected only when `flags.demoContent` is on, which
 * never happens in a production build.
 */
import { queryListings, findSimilar } from './filter';
import { demoListings } from './demoData';
import type {
  Listing,
  ListingProvider,
  ListingQuery,
  ListingResult,
} from './types';

export const demoProvider: ListingProvider = {
  id: 'demo',
  name: 'Demo dataset',
  isLive: false,
  isDemo: true,
  // No MLS supplied this data, so there is nothing to attribute.
  attribution: null,

  async search(query: ListingQuery): Promise<ListingResult> {
    return queryListings(demoListings, query);
  },

  async getBySlug(slug: string): Promise<Listing | null> {
    return demoListings.find((listing) => listing.slug === slug) ?? null;
  },

  async getAll(): Promise<readonly Listing[]> {
    return demoListings;
  },

  async getSimilar(listing: Listing, limit = 3): Promise<readonly Listing[]> {
    return findSimilar(demoListings, listing, limit);
  },
};
