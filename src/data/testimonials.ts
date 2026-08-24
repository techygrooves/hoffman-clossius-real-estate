/**
 * ---------------------------------------------------------------------------
 * TESTIMONIALS
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY.
 *
 * Every testimonial must be a real, attributable quote supplied or approved by
 * the client. Do NOT write sample testimonials, paraphrase reviews from
 * third-party sites, or fabricate names, ratings or review counts.
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
};

export const testimonials: readonly Testimonial[] = [];
