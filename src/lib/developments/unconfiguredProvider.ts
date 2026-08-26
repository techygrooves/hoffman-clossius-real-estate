/**
 * Unconfigured provider — the honest default.
 *
 * Selected when the client has supplied no publishable developments and demo
 * content is off, which is the state of a production build today. It serves
 * nothing and claims nothing.
 *
 * Pages detect this through `isLive === false` and show a message telling a
 * visitor that developments are added as they are released, and pointing them
 * at a person. No developer jargon reaches the public.
 */
import type { Development, DevelopmentProvider } from './types';

export const unconfiguredDevelopmentProvider: DevelopmentProvider = {
  id: 'unconfigured',
  name: 'No developments supplied',
  isLive: false,
  isDemo: false,

  async search() {
    return [];
  },
  async getBySlug(): Promise<Development | null> {
    return null;
  },
  async getAll() {
    return [];
  },
  async getRelated() {
    return [];
  },
  async getCities() {
    return [];
  },
};
