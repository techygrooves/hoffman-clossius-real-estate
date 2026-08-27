/**
 * ---------------------------------------------------------------------------
 * TESTIMONIALS
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY.
 *
 * Every testimonial must be a real, attributable quote supplied or approved by
 * the client. Do NOT write sample testimonials, paraphrase reviews from
 * third-party sites, or fabricate names, locations, dates or sources.
 *
 * Testimonials are excluded from the demo-content mechanism in
 * src/config/flags.ts on purpose: a fabricated review is unacceptable in every
 * mode, including local development. Only entries with `verified: true` are
 * ever rendered, and that flag means the client has confirmed the quote and
 * that we may publish it.
 *
 * ── No star ratings ────────────────────────────────────────────────────────
 * There is deliberately no rating field. A star count is a claim about a
 * platform's data, and we have none: no Google rating, no Zillow rating, no
 * review count. If the client later supplies ratings *with* the platform's
 * permission to display them, that is a new field and a new decision — it is
 * not something to approximate from a quote's tone.
 *
 * ── No invented URLs ───────────────────────────────────────────────────────
 * `sourceUrl` links to the review as published. It is null unless the client
 * supplies the actual URL. Never construct one from a profile page, a search
 * result or a guess at a review id.
 * ---------------------------------------------------------------------------
 */

/**
 * Where the words came from. Drives the badge on each card, so a reader can
 * tell a public review from something said directly to Martin or MaryEllen.
 *
 * Adding a platform means adding it here and to SOURCE_BADGES below — the
 * pages pick it up with no other change.
 */
export type TestimonialSource = 'Google' | 'Zillow' | 'Direct Client';

export type Testimonial = {
  /** Stable key. Any short slug the client's list can be traced back to. */
  readonly id: string;
  /** The words as published, never edited for tone or trimmed for fit. */
  readonly quote: string;
  /** As the client wants it attributed, e.g. "R. and D. Alvarez". */
  readonly clientName: string;
  /** Where they bought, sold or moved from. Null when not supplied. */
  readonly location: string | null;
  /** Which platform, or a direct client. Null when the client has not said. */
  readonly source: TestimonialSource | null;
  /** The review as published. Null unless the client supplies the real URL. */
  readonly sourceUrl: string | null;
  /** ISO date (YYYY-MM-DD) the review was left. Null when unknown. */
  readonly date: string | null;
  /**
   * True only once the client has confirmed the quote is real and may be
   * published. Unverified entries never render. Never set this by default.
   */
  readonly verified: boolean;
};

/**
 * Badge presentation per source. Wording only — no logos: Google's and
 * Zillow's marks are trademarks with their own usage rules, and neither has
 * been licensed here.
 */
export const SOURCE_BADGES: Record<
  TestimonialSource,
  { readonly label: string; readonly description: string }
> = {
  Google: {
    label: 'Google',
    description: 'Left as a public Google review',
  },
  Zillow: {
    label: 'Zillow',
    description: 'Left as a public Zillow review',
  },
  'Direct Client': {
    label: 'Direct Client',
    description: 'Given directly to Hoffman & Closius, shared with permission',
  },
};

export const testimonials: readonly Testimonial[] = [];

/** Only what the client has confirmed we may publish. */
export const verifiedTestimonials = (): readonly Testimonial[] =>
  testimonials.filter((t) => t.verified);

/** Sources actually present among verified entries — drives the filter chips. */
export const usedSources = (): readonly TestimonialSource[] => {
  const seen = new Set<TestimonialSource>();
  for (const t of verifiedTestimonials()) if (t.source) seen.add(t.source);
  return [...seen];
};
