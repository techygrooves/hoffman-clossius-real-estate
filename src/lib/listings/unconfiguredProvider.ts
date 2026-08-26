/**
 * Unconfigured provider — the honest default.
 *
 * Selected when no IDX/MLS integration has been configured and demo content is
 * off, which is exactly the state of a production build today. It serves
 * nothing and says nothing it cannot support.
 *
 * Pages detect this through `isLive === false` and show
 * `<ListingEmptyState variant="not-configured">`, which tells a visitor that
 * live property search is being set up and points them at a person. No
 * developer jargon, no error, no empty grid with no explanation.
 */
import { EMPTY_RESULT, type Listing, type ListingProvider, type ListingResult } from './types';

export const unconfiguredProvider: ListingProvider = {
  id: 'unconfigured',
  name: 'No listing provider configured',
  isLive: false,
  isDemo: false,
  attribution: null,

  async search(): Promise<ListingResult> {
    return EMPTY_RESULT;
  },

  async getBySlug(): Promise<Listing | null> {
    return null;
  },

  async getAll(): Promise<readonly Listing[]> {
    return [];
  },

  async getSimilar(): Promise<readonly Listing[]> {
    return [];
  },
};
