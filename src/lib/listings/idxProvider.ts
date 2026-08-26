/**
 * ---------------------------------------------------------------------------
 * IDX / MLS PROVIDER — NOT YET IMPLEMENTED
 * ---------------------------------------------------------------------------
 * The seam where a real feed plugs in. Deliberately unimplemented: the client
 * has not yet confirmed which provider they are authorised to use, and writing
 * speculative request code against a guessed API would be worse than nothing —
 * it would have to be thrown away, and it might imply an integration exists.
 *
 * What is settled here is the CONTRACT. Everything above this file — pages,
 * components, filters, the detail route — already speaks `Listing` and
 * `ListingQuery`. Implementing this file is the whole integration; **no
 * component or page needs to change.**
 *
 * ── To implement ──────────────────────────────────────────────────────────
 *
 *  1. Put credentials in server-side environment variables. Astro exposes
 *     `PUBLIC_*` to the browser — an IDX key must NEVER carry that prefix.
 *     See IDX_INTEGRATION.md.
 *
 *  2. Fill in `fetchListings()` below: call the provider, then map each record
 *     onto `Listing` through a single adapter function. Keep the mapping in
 *     one place so the provider's vocabulary never leaks upward.
 *
 *  3. Fill in `attribution` from what the MLS requires verbatim — courtesy
 *     line, disclaimer, logo, last-updated. Do not compose this wording.
 *
 *  4. Set `isLive: true` only once the feed is authorised and returning data.
 *     `isConfigured()` below gates provider selection, so a half-configured
 *     environment falls back to the unconfigured provider rather than
 *     rendering a broken page.
 *
 *  5. Decide fetch timing. This site is statically generated:
 *       - build-time fetch → listings are baked into the HTML, fastest for
 *         visitors, needs a scheduled rebuild to stay fresh
 *       - runtime fetch from the browser → always current, but the request
 *         must go through a proxy so the key stays server-side
 *     Most MLS agreements cap how stale displayed data may be; check the
 *     refresh requirement before choosing (CONTENT_PENDING.md §5).
 * ---------------------------------------------------------------------------
 */
import {
  EMPTY_RESULT,
  type Listing,
  type ListingProvider,
  type ListingQuery,
  type ListingResult,
  type ProviderAttribution,
} from './types';

/**
 * Server-side only. No `PUBLIC_` prefix, so Astro keeps these out of the
 * client bundle. Absent today, which is why `isConfigured()` returns false.
 */
const IDX_BASE_URL = import.meta.env.IDX_BASE_URL as string | undefined;
const IDX_API_KEY = import.meta.env.IDX_API_KEY as string | undefined;

/** True only when every credential the integration needs is present. */
export function isConfigured(): boolean {
  return Boolean(IDX_BASE_URL && IDX_API_KEY);
}

/**
 * Attribution required by the MLS. Null until the client supplies the exact
 * wording — this text is dictated by the MLS and may not be written by us.
 */
const attribution: ProviderAttribution | null = null;

/**
 * Maps one provider record onto the normalised `Listing` shape.
 *
 * Implementation notes for whoever writes this:
 *  - Return `null` for any field the payload does not contain. Never
 *    substitute 0, an empty string or a plausible default: components treat
 *    null as "not stated" and render nothing, which is correct.
 *  - Map the provider's status vocabulary onto `ListingStatus` explicitly.
 *    Anything unrecognised becomes 'off-market', not a guess.
 *  - `slug` must be stable across refreshes, or every URL breaks on each
 *    rebuild. Derive it from the MLS number plus a slugified address.
 *  - `demo` is always false here.
 */
export function adaptRecord(_raw: unknown): Listing | null {
  throw new Error('IDX adapter not implemented — see IDX_INTEGRATION.md');
}

/** Calls the provider. Runs server-side only. */
async function fetchListings(_query: ListingQuery): Promise<readonly Listing[]> {
  throw new Error('IDX provider not implemented — see IDX_INTEGRATION.md');
}

export const idxProvider: ListingProvider = {
  id: 'idx',
  name: 'IDX/MLS provider',
  // Flipped to true by the implementer, once the feed is authorised and live.
  isLive: false,
  isDemo: false,
  attribution,

  async search(query: ListingQuery): Promise<ListingResult> {
    if (!isConfigured()) return EMPTY_RESULT;
    const listings = await fetchListings(query);
    return {
      listings,
      total: listings.length,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? listings.length,
      totalPages: 1,
    };
  },

  async getBySlug(slug: string): Promise<Listing | null> {
    if (!isConfigured()) return null;
    const listings = await fetchListings({ location: slug });
    return listings.find((listing) => listing.slug === slug) ?? null;
  },

  async getAll(): Promise<readonly Listing[]> {
    if (!isConfigured()) return [];
    return fetchListings({});
  },

  async getSimilar(): Promise<readonly Listing[]> {
    if (!isConfigured()) return [];
    return [];
  },
};
