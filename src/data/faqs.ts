/**
 * ---------------------------------------------------------------------------
 * FREQUENTLY ASKED QUESTIONS
 * ---------------------------------------------------------------------------
 * INTENTIONALLY EMPTY until the answers are reviewed by the client. Answers
 * touch on process, fees and Florida real estate practice — none of it may be
 * guessed. Draft questions live in CONTENT_PENDING.md.
 * ---------------------------------------------------------------------------
 */

export type Faq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: 'buying' | 'selling' | 'relocation' | 'working-with-us';
};

export const faqs: readonly Faq[] = [];
