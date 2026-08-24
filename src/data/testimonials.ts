/**
 * ---------------------------------------------------------------------------
 * TESTIMONIALS
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY.
 *
 * Every testimonial must be a real, attributable quote supplied or approved by
 * the client. Do NOT write sample testimonials, paraphrase reviews from
 * third-party sites, or fabricate names, ratings or review counts.
 *
 * Testimonials are excluded from the demo-content mechanism in
 * src/config/flags.ts on purpose: a fabricated review is unacceptable in every
 * mode, including local development. Only entries with `verified: true` are
 * ever rendered, and that flag means the client has confirmed the quote and
 * that we may publish it.
 * ---------------------------------------------------------------------------
 */

export type Testimonial = {
  readonly id: string;
  readonly quote: string;
  /** As the client wants it attributed, e.g. "R. and D. Alvarez". */
  readonly attribution: string;
  readonly context: string | null;
  /** Where the review was originally published, if it was. */
  readonly source: string | null;
  readonly sourceUrl: string | null;
  readonly date: string | null;
  /**
   * True only once the client has confirmed the quote is real and may be
   * published. Unverified entries never render. Never set this by default.
   */
  readonly verified: boolean;
};

export const testimonials: readonly Testimonial[] = [];
