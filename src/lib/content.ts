/**
 * Content resolution for testimonials.
 *
 * Listings and developments are NOT here: each has its own provider
 * architecture (src/lib/listings/ and src/lib/developments/) handling the same
 * real/demo/empty decision behind a swappable interface. Testimonials have no
 * provider and never get a demo counterpart — a fabricated review is
 * unacceptable in every environment.
 *
 * Both are gated on the client having supplied the content. `isDemo` is
 * always false here, and is kept in the return shape so callers can treat
 * these the same way they treat provider-backed content.
 */
import { testimonials, type Testimonial } from '@data/testimonials';

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
