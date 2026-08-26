/**
 * Lead form behaviour: validation, submission and the four states a form can
 * end in.
 *
 * ── Validation ────────────────────────────────────────────────────────────
 * Built on the browser's own constraint validation, with the native bubbles
 * suppressed so messages can be rendered accessibly instead:
 *
 *   - each message lands in a `role="alert"` element the field points at
 *     through aria-describedby, so a screen reader announces it
 *   - the field gets aria-invalid
 *   - an error summary lists every problem as links, and takes focus on a
 *     failed submit — the pattern that works for someone who cannot see the
 *     fields turn red
 *   - fields are only validated on blur AFTER a first submit attempt, so a
 *     form does not shout at someone still filling it in
 *
 * ── Submission ────────────────────────────────────────────────────────────
 * `sent` · `unconfigured` · `error`. The middle one matters: with no
 * destination configured the form says the message was not sent and hands over
 * a person to contact. It never fakes a success.
 */
import { leadTransport } from './transport';
import type { LeadKind, LeadSubmission } from './types';

const FOCUSABLE_FIELDS = 'input, select, textarea';

/** Messages we write ourselves, so they read like a person wrote them. */
function messageFor(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  // A radio or checkbox carries its own option label; the group's legend is
  // what a person recognises, so that wins when it is there.
  const label = field.dataset.groupLabel ?? field.dataset.label ?? 'This field';
  const v = field.validity;
  const isChoice =
    field instanceof HTMLInputElement &&
    (field.type === 'radio' || field.type === 'checkbox');

  if (v.valueMissing) {
    return field instanceof HTMLSelectElement || isChoice
      ? `Choose an option for ${label.toLowerCase()}.`
      : `${label} is required.`;
  }
  if (v.typeMismatch && field.type === 'email') {
    return 'Enter an email address, like name@example.com.';
  }
  if (v.typeMismatch && field.type === 'tel') {
    return 'Enter a phone number we can reach you on.';
  }
  if (v.patternMismatch) {
    return field.dataset.patternMessage ?? `${label} is not in the expected format.`;
  }
  if (v.tooShort) {
    return `${label} is too short.`;
  }
  if (v.rangeUnderflow || v.rangeOverflow) {
    return `${label} is outside the range we can accept.`;
  }
  return `${label} is not valid.`;
}

export function initLeadForm(): void {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('[data-lead-form]'));
  forms.forEach(setup);
}

function setup(form: HTMLFormElement): void {
  const kind = (form.dataset.leadKind ?? 'contact') as LeadKind;
  const submitButton = form.querySelector<HTMLButtonElement>('[data-lead-submit]');
  const summary = form.querySelector<HTMLElement>('[data-lead-error-summary]');
  const summaryList = summary?.querySelector<HTMLElement>('[data-lead-error-list]');
  const status = form.querySelector<HTMLElement>('[data-lead-status]');
  const fallback = form.querySelector<HTMLElement>('[data-lead-fallback]');
  const fallbackSummary = fallback?.querySelector<HTMLElement>('[data-lead-fallback-summary]');
  const fallbackMail = fallback?.querySelectorAll<HTMLAnchorElement>('[data-lead-fallback-mail]');
  const fields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      FOCUSABLE_FIELDS,
    ),
  ).filter((f) => f.type !== 'hidden' && !f.disabled);

  // Native bubbles are unreadable to assistive tech and unstyleable; we render
  // the messages ourselves.
  form.setAttribute('novalidate', '');

  let hasAttemptedSubmit = false;

  const errorEl = (field: Element) =>
    field.closest('[data-field]')?.querySelector<HTMLElement>('[data-field-error]') ?? null;

  function showError(
    field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    message: string,
  ) {
    field.setAttribute('aria-invalid', 'true');
    const el = errorEl(field);
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
  }

  function clearError(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    field.removeAttribute('aria-invalid');
    const el = errorEl(field);
    if (el) {
      el.textContent = '';
      el.hidden = true;
    }
  }

  function validate(): (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] {
    const invalid: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] = [];
    // When a required radio group has nothing chosen, EVERY radio in it reports
    // valueMissing — that is what the spec says. Reported straight through, a
    // three-option group would list the same problem three times. One entry per
    // group, anchored on the first radio so focus lands somewhere sensible.
    const reportedGroups = new Set<string>();

    for (const field of fields) {
      if (field.checkValidity()) {
        clearError(field);
        continue;
      }

      showError(field, messageFor(field));

      const isRadio = field instanceof HTMLInputElement && field.type === 'radio';
      if (isRadio) {
        if (reportedGroups.has(field.name)) continue;
        reportedGroups.add(field.name);
      }
      invalid.push(field);
    }
    return invalid;
  }

  function renderSummary(invalid: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]) {
    if (!summary || !summaryList) return;

    if (invalid.length === 0) {
      summary.hidden = true;
      summaryList.innerHTML = '';
      return;
    }

    summaryList.innerHTML = '';
    for (const field of invalid) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${field.id}`;
      link.className = 'link-underline';
      link.textContent = messageFor(field);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        field.focus();
      });
      li.append(link);
      summaryList.append(li);
    }
    summary.hidden = false;
    summary.focus();
  }

  // Re-validate on blur, but only once the person has tried to submit.
  for (const field of fields) {
    field.addEventListener('blur', () => {
      if (!hasAttemptedSubmit) return;
      if (field.checkValidity()) clearError(field);
      else showError(field, messageFor(field));
    });
    field.addEventListener('input', () => {
      if (hasAttemptedSubmit && field.checkValidity()) clearError(field);
    });
  }

  function setBusy(busy: boolean) {
    form.setAttribute('aria-busy', String(busy));
    if (!submitButton) return;
    submitButton.disabled = busy;
    const label = submitButton.querySelector<HTMLElement>('[data-lead-submit-label]');
    const spinner = submitButton.querySelector<HTMLElement>('[data-lead-spinner]');
    if (label) {
      label.textContent = busy
        ? (submitButton.dataset.busyLabel ?? 'Sending…')
        : (submitButton.dataset.idleLabel ?? label.textContent ?? 'Send');
    }
    if (spinner) spinner.hidden = !busy;
  }

  function showStatus(tone: 'sent' | 'error', message: string) {
    if (!status) return;
    status.hidden = false;
    status.dataset.tone = tone;
    status.textContent = message;
    status.focus();
  }

  /**
   * Two views of the same answer: the machine value a destination wants, and
   * the text the person actually saw. A select carries `1000000`; what they
   * chose was "$1,000,000", and that is what belongs in an email to Martin.
   */
  function collect(): LeadSubmission {
    const values: Record<string, string> = {};
    const display: Record<string, string> = {};
    const labels: Record<string, string> = {};

    const append = (record: Record<string, string>, name: string, value: string) => {
      const existing = record[name];
      record[name] = existing ? `${existing}, ${value}` : value;
    };

    for (const field of fields) {
      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        if (!field.checked) continue;
        append(values, field.name, field.value);
        append(display, field.name, field.dataset.label ?? field.value);
        labels[field.name] = field.dataset.groupLabel ?? field.dataset.label ?? field.name;
        continue;
      }
      if (field instanceof HTMLInputElement && field.type === 'radio') {
        if (!field.checked) continue;
        values[field.name] = field.value;
        display[field.name] = field.dataset.label ?? field.value;
        // The legend, not the option — "Preferred contact method: Email"
        // rather than "Email: Email".
        labels[field.name] = field.dataset.groupLabel ?? field.dataset.label ?? field.name;
        continue;
      }
      if (field.value.trim() === '') continue;
      values[field.name] = field.value.trim();
      display[field.name] =
        field instanceof HTMLSelectElement
          ? (field.selectedOptions[0]?.textContent?.trim() ?? field.value)
          : field.value.trim();
      labels[field.name] = field.dataset.label ?? field.name;
    }

    return {
      kind,
      fields: values,
      display,
      labels,
      sourcePath: window.location.pathname,
      submittedAt: new Date().toISOString(),
    };
  }

  function renderFallback(submission: LeadSubmission) {
    if (!fallback) return;

    if (fallbackSummary) {
      fallbackSummary.innerHTML = '';
      // The readable view — this panel is read by a person.
      for (const [name, value] of Object.entries(submission.display)) {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        dt.className = 'text-xs uppercase tracking-wide-sm text-ink-subtle';
        dt.textContent = submission.labels[name] ?? name;
        const dd = document.createElement('dd');
        dd.className = 'mt-1 text-sm text-evergreen-800';
        // textContent throughout — this is what the visitor typed.
        dd.textContent = value;
        row.append(dt, dd);
        fallbackSummary.append(row);
      }
    }

    // A mailto that carries the details, so nothing has to be retyped.
    const body = Object.entries(submission.display)
      .map(([name, value]) => `${submission.labels[name] ?? name}: ${value}`)
      .join('\n')
      .slice(0, 1500);

    fallbackMail?.forEach((link) => {
      const address = link.dataset.email ?? '';
      const subject = link.dataset.subject ?? 'Website enquiry';
      link.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    fallback.hidden = false;
    fallback.focus();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hasAttemptedSubmit = true;

    const invalid = validate();
    // Focus lands on the summary, not on the first bad field: it names every
    // problem at once and links to each. Jumping straight to field one hides
    // the rest until you have fixed it.
    renderSummary(invalid);
    if (invalid.length > 0) return;

    if (status) status.hidden = true;
    if (fallback) fallback.hidden = true;

    setBusy(true);
    const submission = collect();
    const result = await leadTransport.send(submission);
    setBusy(false);

    if (result.status === 'sent') {
      showStatus(
        'sent',
        'Thank you — your message has been sent. Martin or MaryEllen will be in touch.',
      );
      form.querySelector<HTMLElement>('[data-lead-fields]')?.setAttribute('hidden', '');
      submitButton?.setAttribute('hidden', '');
      return;
    }

    if (result.status === 'unconfigured') {
      renderFallback(submission);
      return;
    }

    showStatus(
      'error',
      'We could not send that just now. Please try again, or call Martin or MaryEllen directly.',
    );
  });
}
