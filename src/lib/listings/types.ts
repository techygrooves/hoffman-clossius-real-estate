/**
 * ---------------------------------------------------------------------------
 * LISTING DOMAIN TYPES
 * ---------------------------------------------------------------------------
 * The normalised shape every listing provider must produce. Components and
 * pages depend on THIS and never on a provider's wire format, so swapping the
 * data source — demo records today, a real IDX/MLS feed later — touches only
 * the adapter that maps into these types.
 *
 * Two rules run through the whole design:
 *
 *  1. **Every fact is optional except identity.** A field is `null` when the
 *     provider did not supply it. Components render nothing for a null rather
 *     than a dash, a zero or a guess — a missing bathroom count must never
 *     become "0 baths" on a live real estate site.
 *  2. **`demo` is carried on the record itself**, so placeholder data can
 *     never be laundered into looking real by passing through a component.
 *
 * See IDX_INTEGRATION.md for how a provider maps its payload onto this shape.
 * ---------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Enumerations                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Lifecycle of a listing. A provider's own vocabulary is mapped onto this set
 * by its adapter; unmappable values become 'other' rather than being invented.
 */
export type ListingStatus =
  | 'for-sale'
  | 'for-rent'
  | 'coming-soon'
  | 'pending'
  | 'sold'
  | 'leased'
  | 'off-market';

/** Statuses a visitor can currently act on. */
export const ACTIVE_STATUSES: readonly ListingStatus[] = [
  'for-sale',
  'for-rent',
  'coming-soon',
];

export type PropertyType =
  | 'single-family'
  | 'condominium'
  | 'townhouse'
  | 'villa'
  | 'multi-family'
  | 'land'
  | 'commercial'
  | 'other';

/* -------------------------------------------------------------------------- */
/* Value objects                                                               */
/* -------------------------------------------------------------------------- */

export interface ListingImage {
  /** Absolute or root-relative URL as supplied by the provider. */
  readonly url: string;
  /**
   * Descriptive alternative text. Most MLS feeds supply no alt text; the
   * adapter should pass an empty string rather than inventing a description
   * of a photograph it cannot see.
   */
  readonly alt: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly caption: string | null;
}

export interface ListingAddress {
  readonly line1: string;
  /** Unit, suite or apartment. */
  readonly line2: string | null;
  readonly city: string;
  /** Two-letter state code. */
  readonly state: string;
  readonly zip: string;
  readonly county: string | null;
  readonly neighborhood: string | null;
}

export interface ListingAgent {
  readonly name: string;
  readonly title: string | null;
  readonly phone: string | null;
  readonly email: string | null;
  /** Set when the agent has a profile page on this site. */
  readonly profilePath: string | null;
  /** True when this is Martin or MaryEllen rather than a co-listing agent. */
  readonly isOurAgent: boolean;
}

/**
 * Features grouped the way a buyer reads them. Every group is a plain list of
 * strings exactly as the provider supplied them — never re-worded, never
 * padded out to make a listing look better appointed than it is.
 */
export interface ListingFeatures {
  readonly interior: readonly string[];
  readonly exterior: readonly string[];
  readonly community: readonly string[];
}

export const EMPTY_FEATURES: ListingFeatures = {
  interior: [],
  exterior: [],
  community: [],
};

export interface OpenHouse {
  /** ISO 8601 with offset, e.g. 2026-03-07T13:00:00-05:00. */
  readonly start: string;
  readonly end: string;
  readonly appointmentOnly: boolean;
  readonly notes: string | null;
}

/* -------------------------------------------------------------------------- */
/* The listing                                                                 */
/* -------------------------------------------------------------------------- */

export interface Listing {
  /** Provider-stable identifier. Unique within a provider. */
  readonly id: string;
  /** MLS number as displayed to the public. Null when the feed omits it. */
  readonly mlsNumber: string | null;
  /** URL segment for /property/<slug>/. Stable across refreshes. */
  readonly slug: string;

  readonly status: ListingStatus;
  /** Whole dollars. Rentals are per month. Null when withheld. */
  readonly price: number | null;

  readonly address: ListingAddress;
  readonly latitude: number | null;
  readonly longitude: number | null;

  readonly beds: number | null;
  /** Full bathrooms. */
  readonly baths: number | null;
  readonly halfBaths: number | null;
  /** Living area in square feet. */
  readonly sqft: number | null;
  /** Lot size in square feet. */
  readonly lotSize: number | null;

  readonly propertyType: PropertyType;
  /** Provider's own label, kept for display when it is more specific. */
  readonly propertyTypeLabel: string | null;

  readonly description: string | null;
  readonly images: readonly ListingImage[];
  readonly features: ListingFeatures;

  readonly yearBuilt: number | null;
  /** Garage spaces. Null when unknown; 0 means genuinely none. */
  readonly garage: number | null;
  readonly pool: boolean | null;
  readonly waterfront: boolean | null;

  readonly listingAgent: ListingAgent | null;
  readonly openHouses: readonly OpenHouse[];

  /** ISO 8601. When the provider last changed this record. */
  readonly updatedAt: string | null;

  /**
   * True for placeholder records. Set by the demo provider and by nothing
   * else. The UI must label anything carrying this flag.
   */
  readonly demo: boolean;
}

/* -------------------------------------------------------------------------- */
/* Query + results                                                             */
/* -------------------------------------------------------------------------- */

export type ListingSort =
  | 'newest'
  | 'price-desc'
  | 'price-asc'
  | 'beds-desc'
  | 'sqft-desc';

export const DEFAULT_SORT: ListingSort = 'newest';
export const DEFAULT_PAGE_SIZE = 9;

/**
 * A search request. Every field is optional; an empty query means "everything
 * this provider will show".
 */
export interface ListingQuery {
  /** Free text matched against city, ZIP, neighbourhood and street. */
  readonly location?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  /** Minimum, not exact. */
  readonly beds?: number;
  readonly baths?: number;
  readonly propertyType?: readonly PropertyType[];
  readonly status?: readonly ListingStatus[];
  readonly waterfront?: boolean;
  readonly pool?: boolean;
  /** Restrict to listings represented by this site's own agents. */
  readonly ourListingsOnly?: boolean;
  /**
   * Restrict to one professional's listings, matched on the profile path the
   * provider set (`listingAgent.profilePath`, e.g. `/about/martin-hoffman/`).
   *
   * Matched on the path rather than on a name because names arrive from a feed
   * in whatever form the MLS holds them — "Martin Hoffman", "Hoffman, Martin
   * P.A.", a middle initial — and a profile page must not quietly show nothing
   * because of a punctuation difference.
   */
  readonly agentProfilePath?: string;
  readonly sort?: ListingSort;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface ListingResult {
  readonly listings: readonly Listing[];
  /** Matches before pagination. */
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export const EMPTY_RESULT: ListingResult = {
  listings: [],
  total: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalPages: 0,
};

/* -------------------------------------------------------------------------- */
/* Provider contract                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Attribution and disclaimer text an MLS requires alongside its data.
 *
 * Every value is supplied by the provider or the brokerage — none of it may be
 * written by us. Until the client confirms the wording
 * (CONTENT_PENDING.md §5) this is null and the UI shows nothing.
 */
export interface ProviderAttribution {
  /** e.g. "Listing information provided courtesy of …". */
  readonly courtesyText: string | null;
  /** Full disclaimer paragraph, verbatim. */
  readonly disclaimer: string | null;
  /** Path under /public to the MLS logo, if one must be displayed. */
  readonly logoPath: string | null;
  /** "Data last updated …" — the feed's own timestamp, not ours. */
  readonly lastUpdated: string | null;
}

/**
 * Why a provider cannot serve data. Drives the public-facing empty state,
 * which never exposes any of these identifiers to a visitor.
 */
export type ProviderUnavailableReason =
  | 'not-configured'
  | 'no-results'
  | 'error';

export interface ListingProvider {
  /** Stable identifier for logs and diagnostics. Never shown to visitors. */
  readonly id: string;
  /** Human-readable name for internal use. */
  readonly name: string;
  /**
   * True only when this provider serves real, authorised listing data.
   * The demo and unconfigured providers are both false, and pages use this
   * to decide whether to present results as real inventory.
   */
  readonly isLive: boolean;
  /** True when the records carry the `demo` flag. */
  readonly isDemo: boolean;
  /** Required MLS attribution, or null when none has been supplied. */
  readonly attribution: ProviderAttribution | null;

  /** Paginated, filtered search. */
  search(query: ListingQuery): Promise<ListingResult>;
  /** One listing, or null when the slug is unknown. */
  getBySlug(slug: string): Promise<Listing | null>;
  /** Everything the provider will expose — used to generate static routes. */
  getAll(): Promise<readonly Listing[]>;
  /** Comparable listings for a detail page. */
  getSimilar(listing: Listing, limit?: number): Promise<readonly Listing[]>;
}
