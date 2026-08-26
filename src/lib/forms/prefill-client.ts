/**
 * Prefilling a form from the URL.
 *
 * The site is statically generated, so Astro cannot see a query string at
 * build time — a page is rendered once and served to everybody. Anything that
 * arrives as `?address=…` therefore has to be read in the browser.
 *
 * Two journeys depend on this:
 *   - the homepage valuation strip posts an address to /sell/home-evaluation/
 *   - a saved property search can carry its filters into the Dream Home Finder
 *
 * A control opts in with `prefillParam` on FormField / FormChoiceGroup, which
 * renders as `data-prefill`. Nothing is written that the visitor did not send,
 * and values that do not match an option are ignored rather than forced in.
 */

const decode = (value: string) => value.trim();

export function initPrefill(root: ParentNode = document): void {
  const params = new URLSearchParams(window.location.search);
  if ([...params.keys()].length === 0) return;

  for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-prefill]'))) {
    const key = el.dataset.prefill;
    if (!key) continue;

    // Repeated params (?type=a&type=b) and comma lists both work, matching the
    // property search URLs these links come from.
    const values = params
      .getAll(key)
      .flatMap((v) => v.split(','))
      .map(decode)
      .filter(Boolean);
    if (values.length === 0) continue;

    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      const value = values[0] as string;
      if (el instanceof HTMLSelectElement) {
        // Leave the prompt selected if the value is not one we offer.
        const match = Array.from(el.options).some((o) => o.value === value);
        if (!match) continue;
      }
      el.value = value;
      continue;
    }

    // A fieldset of radios or checkboxes.
    const inputs = el.querySelectorAll<HTMLInputElement>('input[type=radio], input[type=checkbox]');
    for (const input of Array.from(inputs)) {
      if (values.includes(input.value)) input.checked = true;
    }
  }
}
