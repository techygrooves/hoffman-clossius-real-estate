/**
 * ---------------------------------------------------------------------------
 * LEGAL DOCUMENTS — privacy policy and terms of use
 * ---------------------------------------------------------------------------
 * One record per legal page. The pages are built; the text is not, and this
 * file is where approved text lands when it exists.
 *
 * ── The rule this file enforces ───────────────────────────────────────────
 * **A legal document is never written here.** Not drafted, not adapted from
 * another site, not assembled from a generator, not "started" with plausible
 * boilerplate for someone to correct later.
 *
 * A privacy policy is a statement of what an organisation does with personal
 * data, and the terms are a contract offered to every visitor. Both bind the
 * client, not us. Text that merely *sounds* right creates two problems at
 * once: the client is held to promises nobody made, and the honest gap that
 * would have prompted a lawyer to look is papered over. An empty, clearly
 * marked slot is the state that gets fixed; a plausible draft is the state
 * that ships forever.
 *
 * ── Supplying a document ──────────────────────────────────────────────────
 *   1. Paste the approved text into `sections` as headings and paragraphs.
 *   2. Set `effectiveDate` to the date the client adopted it.
 *   3. Set `approvedBy` to who reviewed it, for the record.
 *   4. Set `approved: true`.
 *
 * The page renders it automatically, the placeholder disappears, and the
 * "being prepared" notice goes with it. No page code changes.
 *
 * ── The `approved` gate ───────────────────────────────────────────────────
 * `approved: true` means a qualified reviewer has read this exact text and
 * confirmed the client may publish it. It is not "looks finished" and not
 * "the client emailed us something". Text can sit in `sections` unapproved
 * while it is being worked on — it simply does not render, exactly as an
 * unverified development or an unverified testimonial does not render.
 *
 * CONTENT_PENDING.md 4.7, 4.7a, 4.8.
 * ---------------------------------------------------------------------------
 */

/** One numbered part of a legal document. `id` is its anchor. */
export type LegalSection = {
  readonly id: string;
  readonly heading: string;
  /** Paragraphs, verbatim as approved. */
  readonly body: readonly string[];
};

export type LegalDocumentRecord = {
  readonly slug: 'privacy-policy' | 'terms';
  /** The document's own title, as the approved text names it. */
  readonly title: string;
  /**
   * The approved text. Null means none has been supplied — the honest state
   * today, and the reason both pages render a marked content slot.
   */
  readonly sections: readonly LegalSection[] | null;
  /** ISO date the client adopted this text. Null while unsupplied. */
  readonly effectiveDate: string | null;
  /**
   * Who reviewed and approved it — the client's attorney, the brokerage's
   * legal team, whoever it was. Recorded so a later reader knows the text was
   * checked by someone, and by whom.
   */
  readonly approvedBy: string | null;
  /** Never set true on text a qualified reviewer has not approved. */
  readonly approved: boolean;
};

/*
 * Both documents are unsupplied. Nothing below is a draft, a stub or a
 * starting point — the fields are empty because the text does not exist yet.
 */
export const legalDocuments: readonly LegalDocumentRecord[] = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    sections: null,
    effectiveDate: null,
    approvedBy: null,
    approved: false,
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    sections: null,
    effectiveDate: null,
    approvedBy: null,
    approved: false,
  },
];

export const getLegalDocument = (
  slug: LegalDocumentRecord['slug'],
): LegalDocumentRecord | undefined =>
  legalDocuments.find((document) => document.slug === slug);

/**
 * The only way a legal page reads its own text.
 *
 * Returns the sections when — and only when — the document is approved and
 * actually has some. Everything else, including approved-but-empty and
 * present-but-unapproved, returns null and renders the placeholder. One gate,
 * in one place, so no page can accidentally publish unreviewed text.
 */
export const publishableSections = (
  document: LegalDocumentRecord | undefined,
): readonly LegalSection[] | null => {
  if (!document || !document.approved) return null;
  if (!document.sections || document.sections.length === 0) return null;
  return document.sections;
};

/** True when any legal document is still awaiting approved text. */
export const hasUnpublishedLegalDocuments = (): boolean =>
  legalDocuments.some((document) => publishableSections(document) === null);
