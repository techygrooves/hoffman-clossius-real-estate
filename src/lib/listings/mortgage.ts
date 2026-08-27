/**
 * Monthly principal-and-interest estimate on a property detail page.
 *
 * Nothing is shown until the visitor enters a rate — the site does not hold a
 * market rate and will not imply one. Taxes, insurance and association fees
 * are excluded, and the UI says so.
 *
 * The arithmetic is NOT here: it comes from `@lib/mortgage/calculate`, which
 * is pure and unit-tested, and is the same module the full calculator at
 * /mortgage-calculator/ uses. Two copies of an amortisation formula is one
 * copy too many — they would eventually disagree, and only one of them would
 * be under test.
 */
import { monthlyPrincipalAndInterest } from '@lib/mortgage/calculate';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const digits = (value: string): number => {
  const n = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export function initMortgageEstimate(): void {
  const root = document.querySelector<HTMLElement>('[data-mortgage]');
  if (!root) return;

  const priceInput = root.querySelector<HTMLInputElement>('[data-mortgage-price]');
  const downSelect = root.querySelector<HTMLSelectElement>('[data-mortgage-down]');
  const rateInput = root.querySelector<HTMLInputElement>('[data-mortgage-rate]');
  const result = root.querySelector<HTMLElement>('[data-mortgage-result]');
  if (!priceInput || !downSelect || !rateInput || !result) return;

  const TERM_YEARS = 30;

  const update = () => {
    const price = digits(priceInput.value);
    const downPct = Number(downSelect.value);
    const rate = digits(rateInput.value);

    if (!price || !rate) {
      result.textContent = 'Enter a rate to estimate';
      return;
    }

    const payment = monthlyPrincipalAndInterest(
      price * (1 - downPct / 100),
      rate,
      TERM_YEARS,
    );

    result.textContent =
      payment > 0 ? `${usd.format(payment)} / month` : 'Enter a rate to estimate';
  };

  [priceInput, rateInput].forEach((input) =>
    input.addEventListener('input', update),
  );
  downSelect.addEventListener('change', update);

  // Re-format the price on blur, so "1,295,000" stays readable.
  priceInput.addEventListener('blur', () => {
    const price = digits(priceInput.value);
    if (price) priceInput.value = usd.format(price);
  });

  update();
}
