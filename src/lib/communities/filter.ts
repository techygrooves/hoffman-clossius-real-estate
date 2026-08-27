/**
 * Filtering the community index.
 *
 * Shared by the page (at build time) and the browser script, so the two can
 * never disagree about what matches. Plain functions over plain data — no DOM,
 * no Node.
 */
import type { Community } from '@data/communities';

export type CommunityQuery = {
  /** Free text matched against name, county and the parent municipality. */
  readonly search?: string;
  readonly county?: string;
  /** Only communities that are municipalities, or only subareas. */
  readonly kind?: 'city' | 'neighborhood';
};

/** Query-string keys. Short, because people see them. */
export const COMMUNITY_PARAM = {
  search: 'q',
  county: 'county',
  kind: 'kind',
} as const;

const normalise = (value: string) => value.trim().toLowerCase();

export function matchesCommunity(
  community: Community,
  query: CommunityQuery,
  /** Parent name, resolved by the caller so this stays a pure function. */
  parentName: string | null = null,
): boolean {
  if (query.county && community.county !== query.county) return false;

  if (query.kind && community.kind !== query.kind) return false;

  if (query.search) {
    const needle = normalise(query.search);
    const haystack = [community.name, community.county, parentName ?? '']
      .map(normalise)
      .join(' ');
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

export function parseCommunityQuery(
  input: URLSearchParams | string,
): CommunityQuery {
  const params = typeof input === 'string' ? new URLSearchParams(input) : input;
  const search = params.get(COMMUNITY_PARAM.search)?.trim();
  const county = params.get(COMMUNITY_PARAM.county)?.trim();
  const kindRaw = params.get(COMMUNITY_PARAM.kind);
  const kind =
    kindRaw === 'city' || kindRaw === 'neighborhood' ? kindRaw : undefined;

  return {
    ...(search ? { search } : {}),
    ...(county ? { county } : {}),
    ...(kind ? { kind } : {}),
  };
}

export function serialiseCommunityQuery(query: CommunityQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set(COMMUNITY_PARAM.search, query.search);
  if (query.county) params.set(COMMUNITY_PARAM.county, query.county);
  if (query.kind) params.set(COMMUNITY_PARAM.kind, query.kind);
  return params.toString();
}

export const hasCommunityFilters = (query: CommunityQuery): boolean =>
  Boolean(query.search || query.county || query.kind);
