/**
 * Lead transport selection — the one place that decides where enquiries go.
 *
 * Configure a destination with:
 *
 *     PUBLIC_LEAD_FORM_ENDPOINT=https://…
 *
 * It is `PUBLIC_` on purpose: the browser posts to it directly, so the value
 * is visible to anyone. That is fine for a form endpoint (Formspree, Netlify
 * Forms, a CRM webhook) which is designed to receive public submissions —
 * but it means **the endpoint must not be a URL that carries a secret**. An
 * API key belongs behind a server-side proxy, never here. See
 * CONTENT_PENDING.md §6.
 *
 * With nothing configured the unconfigured transport reports `unconfigured`,
 * and the form shows a contact fallback rather than a false success.
 */
import type { LeadResult, LeadSubmission, LeadTransport } from './types';

const ENDPOINT = import.meta.env.PUBLIC_LEAD_FORM_ENDPOINT as string | undefined;

/** Posts the submission as JSON. */
const endpointTransport = (url: string): LeadTransport => ({
  id: 'endpoint',
  isConfigured: true,
  async send(submission: LeadSubmission): Promise<LeadResult> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          kind: submission.kind,
          source: submission.sourcePath,
          submittedAt: submission.submittedAt,
          ...submission.fields,
          // Same answers as a person would read them, so an email
          // notification from the form service is legible without a lookup
          // table. Namespaced so it cannot collide with a field name.
          _readable: submission.display,
          _labels: submission.labels,
        }),
      });

      if (!response.ok) {
        return { status: 'error', detail: `HTTP ${response.status}` };
      }
      return { status: 'sent' };
    } catch (error) {
      return {
        status: 'error',
        detail: error instanceof Error ? error.message : 'network error',
      };
    }
  },
});

/**
 * No destination. Reports it plainly so the UI can offer a person instead.
 *
 * In development it logs the submission to the console, so a form can be
 * exercised end to end while building. It never does this in production, and
 * it never claims the submission was sent.
 */
const unconfiguredTransport: LeadTransport = {
  id: 'unconfigured',
  isConfigured: false,
  async send(submission: LeadSubmission): Promise<LeadResult> {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(
        '[lead form] No PUBLIC_LEAD_FORM_ENDPOINT configured. Submission was NOT sent:',
        submission,
      );
    }
    return { status: 'unconfigured' };
  },
};

export const leadTransport: LeadTransport =
  ENDPOINT && ENDPOINT.trim() !== ''
    ? endpointTransport(ENDPOINT.trim())
    : unconfiguredTransport;

export const hasLeadDestination = leadTransport.isConfigured;
