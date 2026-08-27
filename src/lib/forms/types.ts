/**
 * ---------------------------------------------------------------------------
 * LEAD FORM CONTRACT
 * ---------------------------------------------------------------------------
 * Every enquiry form on the site — Dream Home Finder, home evaluation, contact
 * — produces a `LeadSubmission` and hands it to a `LeadTransport`. Forms know
 * nothing about where the data goes, so connecting a real destination later
 * touches one file.
 *
 * The rule that shapes everything here: **a form must never appear to succeed
 * when nothing received the data.** A "Thank you, we'll be in touch" over a
 * submission that went nowhere is worse than no form at all — someone waits
 * for a call that will never come. When no destination is configured the UI
 * says so and hands the person a way to reach a human instead.
 * ---------------------------------------------------------------------------
 */

/** Which form produced this, so a destination can route or label it. */
export type LeadKind =
  | 'dream-home-finder'
  | 'home-evaluation'
  | 'contact'
  | 'relocation'
  | 'development-enquiry'
  | 'property-enquiry';

export interface LeadSubmission {
  readonly kind: LeadKind;
  /**
   * Field name → machine value: what a select or checkbox actually carries
   * (`1000000`, `condominium`), and for free text exactly what was typed.
   * This is what a CRM or webhook wants.
   */
  readonly fields: Readonly<Record<string, string>>;
  /** Human-readable labels for those fields, for the fallback summary. */
  readonly labels: Readonly<Record<string, string>>;
  /**
   * Field name → the text the person actually saw ("$1,000,000", "3+
   * bedrooms"). Used wherever a human reads the submission — the fallback
   * summary and the prefilled email. Sent alongside `fields`, never instead
   * of them.
   */
  readonly display: Readonly<Record<string, string>>;
  /** Page the enquiry came from. */
  readonly sourcePath: string;
  /** ISO 8601. */
  readonly submittedAt: string;
}

/**
 * What happened. Deliberately three outcomes rather than a boolean, because
 * "nowhere to send it" is not a failure and must not be reported as one — nor
 * as a success.
 */
export type LeadResult =
  | { readonly status: 'sent' }
  | {
      /** No destination configured. The UI shows the contact fallback. */
      readonly status: 'unconfigured';
    }
  | {
      readonly status: 'error';
      /** Internal detail for logs. Never shown to a visitor verbatim. */
      readonly detail: string;
    };

export interface LeadTransport {
  readonly id: 'endpoint' | 'unconfigured';
  /** True when a real destination will receive the submission. */
  readonly isConfigured: boolean;
  send(submission: LeadSubmission): Promise<LeadResult>;
}
