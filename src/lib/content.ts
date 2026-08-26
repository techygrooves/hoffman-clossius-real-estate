/**
 * Content resolution for testimonials and developments.
 *
 * Listings are NOT here: they come from the provider architecture in
 * src/lib/listings/, which handles the same real/demo/empty decision behind a
 * swappable interface. This file covers the two content types that have no
 * provider and never get a demo counterpart.
 *
 * Both are gated on the client having supplied the content. `isDemo` is
 * always false here, and is kept in the return shape so callers can treat
 * these the same way they treat provider-backed content.
 */
import { testimonials, type Testimonial } from '@data/testimonials';
import { developments, type Development } from '@data/developments';

export type Resolved<T> = {
  readonly items: readonly T[];
  /** True when what is being shown is placeholder content, not client data. */
  readonly isDemo: boolean;
};

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
