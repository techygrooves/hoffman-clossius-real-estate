/**
 * Provider selection — the single place that decides where listings come from.
 *
 * Order of preference:
 *
 *   1. **IDX/MLS**, when credentials are configured. Real, authorised data.
 *   2. **Demo**, when `flags.demoContent` is on. Placeholder records, always
 *      labelled, never in a production build.
 *   3. **Unconfigured**. Serves nothing, and pages show a message telling
 *      visitors that live property search is being set up.
 *
 * Real data always wins. Everything downstream imports `listingProvider` from
 * here and never a specific provider, so this is the only file that changes
 * when the feed goes live.
 */
import { flags } from '@config/flags';
import { demoProvider } from './demoProvider';
import { idxProvider, isConfigured as idxIsConfigured } from './idxProvider';
import { unconfiguredProvider } from './unconfiguredProvider';
import type { ListingProvider } from './types';

function select(): ListingProvider {
  if (idxIsConfigured()) return idxProvider;
  if (flags.demoContent) return demoProvider;
  return unconfiguredProvider;
}

export const listingProvider: ListingProvider = select();

/**
 * True when the site can show listings at all. False means every listing page
 * shows its "being configured" state — which is the honest position today.
 */
export const hasListingData =
  listingProvider.isLive || listingProvider.isDemo;

export type { ListingProvider };
