/**
 * Provider selection — the single place that decides where developments come
 * from.
 *
 *   1. **Curated**, when the client has supplied verified developments.
 *   2. **Demo**, when `flags.demoContent` is on. Placeholder records, always
 *      labelled, never in a production build.
 *   3. **Unconfigured**. Serves nothing, and pages say so plainly.
 *
 * Real data always wins. Everything downstream imports `developmentProvider`
 * from here and never a specific provider, so this is the only file that
 * changes when the client's material arrives — and even that change is
 * automatic, because adding a verified entry to `curatedData.ts` flips the
 * selection on its own.
 */
import { flags } from '@config/flags';
import { curatedDevelopmentProvider, hasCuratedDevelopments } from './curatedProvider';
import { demoDevelopmentProvider } from './demoProvider';
import { unconfiguredDevelopmentProvider } from './unconfiguredProvider';
import type { DevelopmentProvider } from './types';

function select(): DevelopmentProvider {
  if (hasCuratedDevelopments) return curatedDevelopmentProvider;
  if (flags.demoContent) return demoDevelopmentProvider;
  return unconfiguredDevelopmentProvider;
}

export const developmentProvider: DevelopmentProvider = select();

/** True when the site can show developments at all. */
export const hasDevelopmentData =
  developmentProvider.isLive || developmentProvider.isDemo;

export type { DevelopmentProvider };
