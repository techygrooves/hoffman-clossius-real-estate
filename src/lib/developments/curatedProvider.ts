/**
 * Curated provider — serves the client-supplied developments in
 * `curatedData.ts`.
 *
 * Only `verified` entries are ever exposed. That gate is the whole point: an
 * entry can be added and worked on without the risk of half-checked details
 * about someone else's project reaching the public site.
 */
import { curatedDevelopments } from './curatedData';
import {
  citiesFrom,
  findRelatedDevelopments,
  queryDevelopments,
} from './filter';
import type {
  Development,
  DevelopmentCategory,
  DevelopmentProvider,
  DevelopmentQuery,
} from './types';

/** The only set this provider will serve. */
const published = curatedDevelopments.filter((d) => d.verified);

export const curatedDevelopmentProvider: DevelopmentProvider = {
  id: 'curated',
  name: 'Client-supplied developments',
  isLive: true,
  isDemo: false,

  async search(query: DevelopmentQuery) {
    return queryDevelopments(published, query);
  },

  async getBySlug(slug: string): Promise<Development | null> {
    return published.find((d) => d.slug === slug) ?? null;
  },

  async getAll() {
    return published;
  },

  async getRelated(development: Development, limit = 3) {
    return findRelatedDevelopments(published, development, limit);
  },

  async getCities(category?: DevelopmentCategory) {
    return citiesFrom(published, category);
  },
};

/** True when the client has supplied at least one publishable development. */
export const hasCuratedDevelopments = published.length > 0;
