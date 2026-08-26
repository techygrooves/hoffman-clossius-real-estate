/**
 * Demo provider — serves the placeholder dataset in `demoData.ts`.
 *
 * `isLive` is false and every record carries `demo: true`, so the UI labels
 * everything it renders. Selected only when `flags.demoContent` is on, which
 * never happens in a production build.
 */
import { demoDevelopments } from './demoData';
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

export const demoDevelopmentProvider: DevelopmentProvider = {
  id: 'demo',
  name: 'Demo developments',
  isLive: false,
  isDemo: true,

  async search(query: DevelopmentQuery) {
    return queryDevelopments(demoDevelopments, query);
  },

  async getBySlug(slug: string): Promise<Development | null> {
    return demoDevelopments.find((d) => d.slug === slug) ?? null;
  },

  async getAll() {
    return demoDevelopments;
  },

  async getRelated(development: Development, limit = 3) {
    return findRelatedDevelopments(demoDevelopments, development, limit);
  },

  async getCities(category?: DevelopmentCategory) {
    return citiesFrom(demoDevelopments, category);
  },
};
