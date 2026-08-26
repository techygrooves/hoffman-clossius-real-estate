/**
 * ---------------------------------------------------------------------------
 * DEVELOPMENT DOMAIN TYPES
 * ---------------------------------------------------------------------------
 * The normalised shape every development source must produce. Pages and
 * components depend on THIS and never on where the data came from, so the
 * client can supply real developments later without any page being redesigned.
 *
 * Three rules run through the design, and they matter more here than almost
 * anywhere else on the site:
 *
 *  1. **Every fact is optional except identity.** `null` means nobody told us.
 *     Components render nothing for a null — never a dash, never a zero,
 *     never "TBC". A delivery date or a starting price we invented would be a
 *     claim about someone else's project.
 *  2. **`verified` gates publication.** Only entries the client has confirmed
 *     are real and publishable ever render outside demo mode.
 *  3. **`demo` is carried on the record**, so placeholder data cannot be
 *     laundered into looking real by passing through a component.
 *
 * See DEVELOPMENTS_DATA.md for how to supply real developments.
 * ---------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Enumerations                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Which index a development belongs to. `new` covers pre-construction and
 * recently delivered projects; `existing` covers established communities.
 */
export type DevelopmentCategory = 'new' | 'existing';

/** Where the project is in its life. */
export type DevelopmentStatus =
  | 'pre-construction'
  | 'under-construction'
  | 'now-selling'
  | 'completed'
  | 'sold-out';

export type DevelopmentType =
  | 'condominium'
  | 'single-family'
  | 'townhome'
  | 'mixed-use'
  | 'gated-community'
  | 'other';

/* -------------------------------------------------------------------------- */
/* Value objects                                                               */
/* -------------------------------------------------------------------------- */

export interface DevelopmentImage {
  readonly url: string;
  /**
   * Descriptive alternative text. Developer material rarely ships with any;
   * supply a real description or an empty string — never a guess at what a
   * rendering shows.
   */
  readonly alt: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly caption: string | null;
  /**
   * Renderings are not photographs. When true the UI labels the image, so a
   * buyer is never shown an artist's impression as though it were built.
   */
  readonly isRendering: boolean;
}

export interface DevelopmentAddress {
  readonly line1: string | null;
  readonly city: string;
  readonly state: string;
  readonly zip: string | null;
  readonly county: string | null;
}

/**
 * An inclusive numeric range. Either end may be null when only one is known —
 * "from 2 bedrooms" is a fact; "2–4" when nobody said 4 is not.
 */
export interface NumericRange {
  readonly min: number | null;
  readonly max: number | null;
}

/**
 * One residence type within a development.
 *
 * `floorPlan` is a slot for an AUTHORISED floor-plan asset. Floor plans are
 * copyrighted developer material: they are never drawn, approximated or
 * downloaded from a developer's site. Null renders a "plans on request" state.
 */
export interface ResidenceType {
  readonly id: string;
  readonly name: string;
  readonly beds: number | null;
  readonly baths: number | null;
  readonly halfBaths: number | null;
  readonly sqft: NumericRange;
  readonly priceFrom: number | null;
  /** Authorised floor-plan image only. Never manufactured. */
  readonly floorPlan: DevelopmentImage | null;
  /** Free text exactly as supplied, e.g. "Limited availability". */
  readonly availability: string | null;
}

/**
 * Amenities grouped the way a buyer reads them. Plain lists, exactly as
 * supplied — never re-worded, never padded to make a project look better
 * appointed than it is.
 */
export interface DevelopmentAmenityGroups {
  readonly building: readonly string[];
  readonly outdoor: readonly string[];
  readonly services: readonly string[];
}

export const EMPTY_AMENITIES: DevelopmentAmenityGroups = {
  building: [],
  outdoor: [],
  services: [],
};

/* -------------------------------------------------------------------------- */
/* The development                                                             */
/* -------------------------------------------------------------------------- */

export interface Development {
  readonly id: string;
  readonly slug: string;
  readonly name: string;

  readonly category: DevelopmentCategory;
  readonly status: DevelopmentStatus;
  readonly developmentType: DevelopmentType;
  /** The source's own label, when it is more specific than the enum. */
  readonly developmentTypeLabel: string | null;

  readonly city: string;
  readonly address: DevelopmentAddress;
  readonly latitude: number | null;
  readonly longitude: number | null;

  readonly startingPrice: number | null;
  readonly bedroomRange: NumericRange;
  readonly bathroomRange: NumericRange;
  readonly squareFootageRange: NumericRange;

  /** Year of completion or expected delivery. Null when not announced. */
  readonly completionYear: number | null;
  readonly developer: string | null;
  readonly architect: string | null;

  /** Short line for cards. */
  readonly summary: string | null;
  /** Long-form copy for the detail page. */
  readonly description: string | null;

  readonly images: readonly DevelopmentImage[];
  readonly amenities: DevelopmentAmenityGroups;
  readonly residences: readonly ResidenceType[];

  /** Total residences in the project, when published. */
  readonly totalResidences: number | null;
  /** Free text describing what is currently available, exactly as supplied. */
  readonly availabilityNote: string | null;

  /**
   * True only when the client has confirmed every detail is accurate and may
   * be published. Unverified entries never render outside demo mode.
   */
  readonly verified: boolean;

  /** True for placeholder records. The UI labels anything carrying it. */
  readonly demo: boolean;

  readonly updatedAt: string | null;
}

/* -------------------------------------------------------------------------- */
/* Query + results                                                             */
/* -------------------------------------------------------------------------- */

export type DevelopmentSort =
  | 'name-asc'
  | 'price-asc'
  | 'price-desc'
  | 'completion-asc';

export const DEFAULT_DEVELOPMENT_SORT: DevelopmentSort = 'name-asc';

export interface DevelopmentQuery {
  readonly category?: DevelopmentCategory;
  /** Free text over name, city, developer and architect. */
  readonly search?: string;
  readonly city?: string;
  readonly status?: readonly DevelopmentStatus[];
  readonly developmentType?: readonly DevelopmentType[];
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly beds?: number;
  readonly sort?: DevelopmentSort;
}

/* -------------------------------------------------------------------------- */
/* Provider contract                                                           */
/* -------------------------------------------------------------------------- */

export type DevelopmentProviderKind = 'curated' | 'demo' | 'unconfigured';

export interface DevelopmentProvider {
  readonly id: DevelopmentProviderKind;
  readonly name: string;
  /** True only when serving real, client-confirmed developments. */
  readonly isLive: boolean;
  /** True when records carry the `demo` flag. */
  readonly isDemo: boolean;

  search(query: DevelopmentQuery): Promise<readonly Development[]>;
  getBySlug(slug: string): Promise<Development | null>;
  getAll(): Promise<readonly Development[]>;
  getRelated(development: Development, limit?: number): Promise<readonly Development[]>;
  /** Distinct cities across everything the provider serves, for the filters. */
  getCities(category?: DevelopmentCategory): Promise<readonly string[]>;
}
