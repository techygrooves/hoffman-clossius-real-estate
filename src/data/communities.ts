/**
 * ---------------------------------------------------------------------------
 * COMMUNITY / NEIGHBOURHOOD GUIDES
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY. Community write-ups are authored with the client and
 * must be factually checkable. Do not invent statistics, school ratings,
 * median values, HOA figures or demographic claims.
 * ---------------------------------------------------------------------------
 */

export type Community = {
  readonly slug: string;
  readonly name: string;
  readonly county: string;
  readonly summary: string;
  readonly body: string | null;
  readonly heroImage: { src: string; alt: string } | null;
  /** Only populated from a cited, dated source. */
  readonly medianHomeValue: { value: number; source: string; asOf: string } | null;
};

export const communities: readonly Community[] = [];

export const getCommunity = (slug: string): Community | undefined =>
  communities.find((c) => c.slug === slug);
