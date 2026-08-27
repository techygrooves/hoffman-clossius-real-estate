/**
 * ---------------------------------------------------------------------------
 * COMMUNITIES
 * ---------------------------------------------------------------------------
 * One object per community. Adding a community to this array creates its page,
 * its card on the index, its entry in the navigation and its cross-links from
 * neighbouring communities — there is no page code to duplicate.
 *
 * ── What may go in these records ───────────────────────────────────────────
 * Verifiable geography, and copy the client has written or approved. That is
 * all.
 *
 * Do NOT add — in any field, including as a "placeholder":
 *   school ratings or rankings · crime statistics · median or average prices ·
 *   population figures · commute or travel times · days on market · rent
 *   figures · HOA fees · appreciation rates · demographic claims · "best of"
 *   or "most desirable" superlatives.
 *
 * Those are the sentences a buyer acts on, and every one of them needs a
 * citable, dated source (PROJECT_CONTEXT.md §9). `highlights`, `introduction`
 * and `neighborhoods` are empty on every record for exactly that reason — the
 * components render nothing at all when they are empty, so an unwritten guide
 * looks unwritten rather than looking wrong.
 *
 * ── Coordinates ───────────────────────────────────────────────────────────
 * `latitude` / `longitude` are APPROXIMATE municipal centroids, carried so the
 * map seam is ready. No map is drawn from them yet: `CommunityMap` states the
 * location in words, exactly as `DevelopmentMap` does, and no pin is plotted.
 * Verify them against an authoritative source before any map goes live
 * (CONTENT_PENDING.md 10.5c, 11.4).
 *
 * ── SEO ───────────────────────────────────────────────────────────────────
 * `seo` is reserved for the later SEO phase and is deliberately empty. Do not
 * pre-fill it with keyword variations or generated descriptions — that work is
 * a separate, deliberate pass, not a side effect of building the template.
 * ---------------------------------------------------------------------------
 */

import type { ListingQuery } from '@lib/listings/types';

/** A named subarea within a community. `slug` links it to its own page. */
export type Neighborhood = {
  readonly name: string;
  /** Set when this subarea has its own community record. */
  readonly slug: string | null;
  /** One factual line. Never a claim about schools, prices or desirability. */
  readonly note: string | null;
};

/**
 * A single, client-approved point about living in a community.
 *
 * Empty on every record today. When it is filled, each entry must be something
 * the client will stand behind — "walkable to the beach" is fine if it is
 * true; "top-rated schools" is not, ever, without a cited and dated source.
 */
export type CommunityHighlight = {
  readonly title: string;
  readonly body: string;
};

/**
 * Reserved for the SEO phase. Nothing here is written yet, and nothing here
 * should be generated: an FAQ invented to catch a search query is still an
 * invented answer about somebody's neighbourhood.
 */
export type CommunitySeo = {
  /** Overrides the default `<title>`. */
  readonly title: string | null;
  /** Overrides the default meta description. */
  readonly description: string | null;
  /** Long-form copy for the page, as paragraphs. */
  readonly body: readonly string[] | null;
  /** Client-approved Q&A. Renders only when non-empty. */
  readonly faqs: readonly { question: string; answer: string }[];
};

export type Community = {
  readonly slug: string;
  readonly name: string;
  readonly county: string;
  /**
   * Whether this is an incorporated municipality or a subarea within one.
   *
   * Stated explicitly rather than inferred from `parent`, because "we have not
   * recorded a parent" and "it has no parent" are different facts. Sheridan
   * Lakes is a neighbourhood whose municipality is not yet confirmed; treating
   * a null parent as proof of cityhood would have listed it as a city on
   * /sell/median-home-values/.
   */
  readonly kind: 'city' | 'neighborhood';
  /**
   * The municipality this sits inside. Null on a city, and null on a
   * neighbourhood whose parent the client has not confirmed yet.
   */
  readonly parent: string | null;
  /**
   * One factual line: what kind of place it is and where it sits relative to
   * its neighbours. Never a market or lifestyle claim.
   */
  readonly shortDescription: string;
  /** Guide copy, as paragraphs. Null until the client writes or approves it. */
  readonly introduction: readonly string[] | null;
  readonly heroImage: { readonly src: string; readonly alt: string } | null;
  /** Approximate centroid. Not plotted until verified — see the file header. */
  readonly latitude: number | null;
  readonly longitude: number | null;
  /** Client-supplied subareas. Child community records are merged in automatically. */
  readonly neighborhoods: readonly Neighborhood[];
  /** Client-approved points about living here. Empty renders nothing. */
  readonly highlights: readonly CommunityHighlight[];
  /** Feeds the listing provider and the "search this area" links. */
  readonly propertySearchQuery: Partial<ListingQuery>;
  /** Shown on the homepage grid and in the header navigation. */
  readonly featured: boolean;
  readonly seo: CommunitySeo;
  /** Only ever populated from a cited, dated source. */
  readonly medianHomeValue: {
    readonly value: number;
    readonly source: string;
    readonly asOf: string;
  } | null;
};

/** Every record starts from this, so a new community is a short object. */
const base = {
  kind: 'city',
  parent: null,
  introduction: null,
  heroImage: null,
  latitude: null,
  longitude: null,
  neighborhoods: [],
  highlights: [],
  featured: false,
  seo: { title: null, description: null, body: null, faqs: [] },
  medianHomeValue: null,
} satisfies Partial<Community>;

const BROWARD = 'Broward County';
const MIAMI_DADE = 'Miami-Dade County';

export const communities: readonly Community[] = [
  /* ---------------------------------------------------------------- Hollywood */
  {
    ...base,
    slug: 'hollywood',
    name: 'Hollywood',
    county: BROWARD,
    shortDescription:
      'A coastal city in Broward County, between Fort Lauderdale and Hallandale Beach.',
    latitude: 26.0112,
    longitude: -80.1495,
    propertySearchQuery: { location: 'Hollywood' },
    featured: true,
  },
  {
    ...base,
    slug: 'hollywood-hills',
    kind: 'neighborhood',
    name: 'Hollywood Hills',
    county: BROWARD,
    parent: 'hollywood',
    shortDescription: 'A residential neighbourhood in Hollywood, west of downtown.',
    propertySearchQuery: { location: 'Hollywood Hills' },
  },
  {
    ...base,
    slug: 'hollywood-lakes',
    kind: 'neighborhood',
    name: 'Hollywood Lakes',
    county: BROWARD,
    parent: 'hollywood',
    shortDescription:
      'A residential neighbourhood in Hollywood, east of downtown toward the Intracoastal.',
    propertySearchQuery: { location: 'Hollywood Lakes' },
  },
  {
    ...base,
    slug: 'emerald-hills',
    kind: 'neighborhood',
    name: 'Emerald Hills',
    county: BROWARD,
    parent: 'hollywood',
    shortDescription: 'A residential neighbourhood in western Hollywood.',
    propertySearchQuery: { location: 'Emerald Hills' },
  },
  {
    ...base,
    slug: 'sheridan-lakes',
    kind: 'neighborhood',
    name: 'Sheridan Lakes',
    county: BROWARD,
    /*
     * `parent` is deliberately null. Sheridan Lakes is a named residential
     * community in southern Broward; which municipality it falls within is not
     * something to state from memory. The client confirms it
     * (CONTENT_PENDING.md 10.5b) and it becomes a subarea then.
     */
    shortDescription: 'A residential community in southern Broward County.',
    propertySearchQuery: { location: 'Sheridan Lakes' },
  },

  /* -------------------------------------------------------------- Broward east */
  {
    ...base,
    slug: 'dania-beach',
    name: 'Dania Beach',
    county: BROWARD,
    shortDescription:
      'A coastal city in Broward County, immediately south of Fort Lauderdale.',
    latitude: 26.0523,
    longitude: -80.1439,
    propertySearchQuery: { location: 'Dania Beach' },
    featured: true,
  },
  {
    ...base,
    slug: 'hallandale-beach',
    name: 'Hallandale Beach',
    county: BROWARD,
    shortDescription:
      'A coastal city in southern Broward County, on the Miami-Dade county line.',
    latitude: 25.9812,
    longitude: -80.1484,
    propertySearchQuery: { location: 'Hallandale Beach' },
    featured: true,
  },
  {
    ...base,
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    county: BROWARD,
    shortDescription: 'The county seat of Broward County, on the Atlantic coast.',
    latitude: 26.1224,
    longitude: -80.1373,
    propertySearchQuery: { location: 'Fort Lauderdale' },
    featured: true,
  },

  /* -------------------------------------------------------------- Broward west */
  {
    ...base,
    slug: 'pembroke-pines',
    name: 'Pembroke Pines',
    county: BROWARD,
    shortDescription: 'An inland city in southwestern Broward County.',
    latitude: 26.0078,
    longitude: -80.2963,
    propertySearchQuery: { location: 'Pembroke Pines' },
    featured: true,
  },
  {
    ...base,
    slug: 'cooper-city',
    name: 'Cooper City',
    county: BROWARD,
    shortDescription:
      'An inland city in southwestern Broward County, between Davie and Pembroke Pines.',
    latitude: 26.057,
    longitude: -80.2717,
    propertySearchQuery: { location: 'Cooper City' },
  },
  {
    ...base,
    slug: 'davie',
    name: 'Davie',
    county: BROWARD,
    shortDescription: 'An inland town in central-western Broward County.',
    latitude: 26.0765,
    longitude: -80.2521,
    propertySearchQuery: { location: 'Davie' },
  },
  {
    ...base,
    slug: 'plantation',
    name: 'Plantation',
    county: BROWARD,
    shortDescription: 'An inland city in Broward County, west of Fort Lauderdale.',
    latitude: 26.1276,
    longitude: -80.2331,
    propertySearchQuery: { location: 'Plantation' },
  },

  /* --------------------------------------------------------------- Miami-Dade */
  {
    ...base,
    slug: 'aventura',
    name: 'Aventura',
    county: MIAMI_DADE,
    shortDescription:
      'A city in northeastern Miami-Dade County, on the Broward county line.',
    latitude: 25.9565,
    longitude: -80.1392,
    propertySearchQuery: { location: 'Aventura' },
    featured: true,
  },
  {
    ...base,
    slug: 'sunny-isles-beach',
    name: 'Sunny Isles Beach',
    county: MIAMI_DADE,
    shortDescription:
      'A barrier-island city in northeastern Miami-Dade County, south of the Broward line.',
    latitude: 25.9529,
    longitude: -80.122,
    propertySearchQuery: { location: 'Sunny Isles Beach' },
  },
  {
    ...base,
    slug: 'miami-beach',
    name: 'Miami Beach',
    county: MIAMI_DADE,
    shortDescription:
      'A barrier-island city in Miami-Dade County, across Biscayne Bay from Miami.',
    latitude: 25.7907,
    longitude: -80.13,
    propertySearchQuery: { location: 'Miami Beach' },
  },
];

/* -------------------------------------------------------------------------- */
/* Lookups                                                                     */
/* -------------------------------------------------------------------------- */

export const getCommunity = (slug: string): Community | undefined =>
  communities.find((c) => c.slug === slug);

export const featuredCommunities = (): readonly Community[] =>
  communities.filter((c) => c.featured);

/** Incorporated municipalities only. */
export const cityCommunities = (): readonly Community[] =>
  communities.filter((c) => c.kind === 'city');

/** Communities that are a subarea of this one. */
export const childCommunities = (slug: string): readonly Community[] =>
  communities.filter((c) => c.parent === slug);

/** Distinct counties, in the order they first appear. */
export const communityCounties = (): readonly string[] => [
  ...new Set(communities.map((c) => c.county)),
];

/**
 * The subareas to show on a community page: the client's own list, plus any
 * community record that names this one as its parent. Child records win on a
 * name collision, because they carry a link to a real page.
 */
export const communityNeighborhoods = (community: Community): readonly Neighborhood[] => {
  const children: Neighborhood[] = childCommunities(community.slug).map((child) => ({
    name: child.name,
    slug: child.slug,
    note: child.shortDescription,
  }));
  const childNames = new Set(children.map((c) => c.name.toLowerCase()));
  const supplied = community.neighborhoods.filter(
    (n) => !childNames.has(n.name.toLowerCase()),
  );
  return [...children, ...supplied];
};

/**
 * Communities to cross-link from a community page.
 *
 * Its parent, then its siblings, then others in the same county — geography,
 * not a ranking. Never claims two places are "similar": that is a judgement
 * nobody has made.
 */
export const nearbyCommunities = (
  community: Community,
  limit = 4,
): readonly Community[] => {
  const seen = new Set<string>([community.slug]);
  const out: Community[] = [];

  const add = (candidates: readonly Community[]) => {
    for (const c of candidates) {
      if (out.length >= limit) return;
      if (seen.has(c.slug)) continue;
      seen.add(c.slug);
      out.push(c);
    }
  };

  if (community.parent) {
    const parent = getCommunity(community.parent);
    if (parent) add([parent]);
    add(childCommunities(community.parent));
  }
  add(childCommunities(community.slug));
  add(communities.filter((c) => c.county === community.county && c.kind === 'city'));

  return out;
};
