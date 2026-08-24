/**
 * ---------------------------------------------------------------------------
 * COMMUNITY / NEIGHBOURHOOD GUIDES
 * ---------------------------------------------------------------------------
 * The entries below exist so the six communities named in the site navigation
 * resolve to real routes. They carry ONLY verifiable geographic facts —
 * which county each municipality sits in, and where it sits relative to its
 * neighbours.
 *
 * `body` is null on every entry: the actual guides are written with the client.
 * Do NOT fill them in with invented statistics, school ratings, median values,
 * HOA figures, demographic claims or marketing superlatives.
 * `medianHomeValue` is populated only from a cited, dated source.
 * ---------------------------------------------------------------------------
 */

export type Community = {
  readonly slug: string;
  readonly name: string;
  readonly county: string;
  /** Factual locational summary only, until the real guide is written. */
  readonly summary: string;
  readonly body: string | null;
  readonly heroImage: { src: string; alt: string } | null;
  /** Only populated from a cited, dated source. */
  readonly medianHomeValue: { value: number; source: string; asOf: string } | null;
};

export const communities: readonly Community[] = [
  {
    slug: 'hollywood',
    name: 'Hollywood',
    county: 'Broward County',
    summary:
      'A coastal city in Broward County, between Fort Lauderdale and Hallandale Beach.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
  {
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    county: 'Broward County',
    summary:
      'The county seat of Broward County, on the Atlantic coast.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
  {
    slug: 'dania-beach',
    name: 'Dania Beach',
    county: 'Broward County',
    summary:
      'A coastal city in Broward County, immediately south of Fort Lauderdale.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
  {
    slug: 'hallandale-beach',
    name: 'Hallandale Beach',
    county: 'Broward County',
    summary:
      'A coastal city in southern Broward County, on the Miami-Dade county line.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
  {
    slug: 'pembroke-pines',
    name: 'Pembroke Pines',
    county: 'Broward County',
    summary: 'An inland city in southwestern Broward County.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
  {
    slug: 'aventura',
    name: 'Aventura',
    county: 'Miami-Dade County',
    summary:
      'A city in northeastern Miami-Dade County, on the Broward county line.',
    body: null,
    heroImage: null,
    medianHomeValue: null,
  },
];

export const getCommunity = (slug: string): Community | undefined =>
  communities.find((c) => c.slug === slug);
