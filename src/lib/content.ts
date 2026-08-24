/**
 * Content resolution — the one place that decides whether a section shows real
 * data, demo data, or an honest empty state.
 *
 * The rule everywhere: **real data always wins.** Demo content appears only
 * when there is no real data AND `flags.demoContent` is on (never in a
 * production build). Callers receive `isDemo` so the UI can label it.
 */
import { flags } from '@config/flags';
import { listings, type Listing } from '@data/listings';
import { demoListings } from '@data/demo/listings.demo';
import { testimonials, type Testimonial } from '@data/testimonials';
import { developments, type Development } from '@data/developments';

export type Resolved<T> = {
  readonly items: readonly T[];
  /** True when what is being shown is placeholder content, not client data. */
  readonly isDemo: boolean;
};

const resolve = <T>(real: readonly T[], demo: readonly T[]): Resolved<T> =>
  real.length > 0
    ? { items: real, isDemo: false }
    : { items: flags.demoContent ? demo : [], isDemo: flags.demoContent && demo.length > 0 };

/** Listings for the homepage grid. `for-sale` first, our own listings first. */
export const resolveFeaturedListings = (limit = 3): Resolved<Listing> => {
  const rank = (l: Listing) =>
    (l.isOurListing ? 0 : 1) + (l.status === 'for-sale' ? 0 : 2);
  const { items, isDemo } = resolve<Listing>(listings, demoListings);
  return { items: [...items].sort((a, b) => rank(a) - rank(b)).slice(0, limit), isDemo };
};

/**
 * Every listing that should have a detail page generated.
 *
 * Must use the same resolver the cards use, or a demo build links to detail
 * pages that were never built. `npm run verify:links` catches that.
 */
export const resolveRoutableListings = (): Resolved<Listing> =>
  resolve<Listing>(listings, demoListings);

/**
 * Testimonials are deliberately NOT part of the demo mechanism: a fabricated
 * review is unacceptable in any mode. Only entries the client has supplied and
 * marked `verified` are ever rendered.
 */
export const resolveTestimonials = (limit = 3): Resolved<Testimonial> => ({
  items: testimonials.filter((t) => t.verified).slice(0, limit),
  isDemo: false,
});

/**
 * Developments carry no demo counterpart either — inventing a development,
 * its delivery date or its pricing would be a claim about the market, not a
 * design placeholder.
 */
export const resolveDevelopments = (limit = 3): Resolved<Development> => ({
  items: developments.filter((d) => d.kind === 'new').slice(0, limit),
  isDemo: false,
});
