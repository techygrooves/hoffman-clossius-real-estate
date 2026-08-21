/**
 * ---------------------------------------------------------------------------
 * DEVELOPMENTS (new construction + established communities)
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY. Entries are added only from material the client
 * supplies or from a confirmed developer/IDX feed. Do not invent developments,
 * price ranges, delivery dates, amenities or renderings.
 * ---------------------------------------------------------------------------
 */

export type Development = {
  readonly slug: string;
  readonly name: string;
  readonly kind: 'new' | 'existing';
  readonly city: string;
  readonly state: string;
  readonly summary: string;
  readonly body: string | null;
  readonly heroImage: { src: string; alt: string } | null;
  readonly priceFrom: number | null;
  readonly developer: string | null;
  readonly completion: string | null;
};

export const developments: readonly Development[] = [];

export const developmentsByKind = (
  kind: Development['kind'],
): readonly Development[] => developments.filter((d) => d.kind === kind);

export const getDevelopment = (slug: string): Development | undefined =>
  developments.find((d) => d.slug === slug);
