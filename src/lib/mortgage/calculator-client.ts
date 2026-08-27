/**
 * The full mortgage calculator's browser behaviour.
 *
 * All arithmetic lives in `calculate.ts` and is unit-tested there. This file
 * only reads the form, calls it, and writes the result — so a maths bug can
 * never hide behind DOM code.
 *
 * ── Validation ────────────────────────────────────────────────────────────
 * Same approach as the lead forms: native constraint validation with the
 * bubbles suppressed, messages rendered into `role="alert"` regions the field
 * points at through `aria-describedby`. Fields are only marked invalid after a
 * person has finished with them, so the form does not shout at someone still
 * typing a price.
 *
 * ── No stored rate ────────────────────────────────────────────────────────
 * The interest rate field starts empty and nothing is calculated until it is
 * filled in. The site holds no market rate, fetches none, and will not imply
 * one by pre-filling a plausible number.
 */
import {
  calculateMortgage,
  parseAmount,
  resolveDownPayment,
  type MortgageBreakdown,
} from './calculate';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

type Field = HTMLInputElement | HTMLSelectElement;

export function initMortgageCalculator(): void {
  const root = document.querySelector<HTMLFormElement>('[data-calculator]');
  if (!root) return;

  const q = <T extends HTMLElement>(name: string) =>
    root.querySelector<T>(`[data-calc="${name}"]`);

  const price = q<HTMLInputElement>('price');
  const downValue = q<HTMLInputElement>('down-value');
  const downMode = q<HTMLSelectElement>('down-mode');
  const rate = q<HTMLInputElement>('rate');
  const term = q<HTMLSelectElement>('term');
  const tax = q<HTMLInputElement>('tax');
  const insurance = q<HTMLInputElement>('insurance');
  const hoa = q<HTMLInputElement>('hoa');

  if (!price || !downValue || !downMode || !rate || !term) return;

  const results = q<HTMLElement>('results');
  const prompt = q<HTMLElement>('prompt');
  const out = {
    total: q<HTMLElement>('out-total'),
    pi: q<HTMLElement>('out-pi'),
    tax: q<HTMLElement>('out-tax'),
    insurance: q<HTMLElement>('out-insurance'),
    hoa: q<HTMLElement>('out-hoa'),
    loan: q<HTMLElement>('out-loan'),
    downPct: q<HTMLElement>('out-down-percent'),
    interest: q<HTMLElement>('out-interest'),
    totalPaid: q<HTMLElement>('out-total-paid'),
  };
  const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-calc-bar]'));

  // We render the messages ourselves; the native bubbles are unstyleable and
  // unreadable to assistive tech.
  root.setAttribute('novalidate', '');

  const numeric = [price, downValue, rate, tax, insurance, hoa].filter(
    (f): f is HTMLInputElement => f !== null,
  );

  /* ---------------------------------------------------------------- errors */

  const errorFor = (field: Field) =>
    field.closest('[data-calc-field]')?.querySelector<HTMLElement>('[data-calc-error]') ?? null;

  function setError(field: Field, message: string | null) {
    const el = errorFor(field);
    if (message === null) {
      field.removeAttribute('aria-invalid');
      if (el) {
        el.textContent = '';
        el.hidden = true;
      }
      return;
    }
    field.setAttribute('aria-invalid', 'true');
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
  }

  /**
   * A field is invalid only when it holds something that is not a number, or a
   * number outside what a mortgage can mean. Empty is not an error: the
   * optional fields are genuinely optional, and the required ones simply leave
   * the estimate unshown.
   */
  function validate(field: HTMLInputElement): boolean {
    const raw = field.value.trim();
    if (raw === '') {
      setError(field, null);
      return true;
    }

    const value = parseAmount(raw);
    if (value === null) {
      setError(field, `Enter ${field.dataset.calcNoun ?? 'a number'} using digits.`);
      return false;
    }
    if (value < 0) {
      setError(field, 'This cannot be a negative number.');
      return false;
    }
    if (field === rate && value > 25) {
      setError(field, 'Enter the rate as a percentage, for example 6.5.');
      return false;
    }
    setError(field, null);
    return true;
  }

  /* ------------------------------------------------------------ calculation */

  function read(field: HTMLInputElement | null): number {
    if (!field) return 0;
    return parseAmount(field.value) ?? 0;
  }

  function render(result: MortgageBreakdown) {
    if (out.total) out.total.textContent = usdCents.format(result.monthlyTotal);
    if (out.pi) out.pi.textContent = usdCents.format(result.monthlyPrincipalAndInterest);
    if (out.tax) out.tax.textContent = usdCents.format(result.monthlyPropertyTax);
    if (out.insurance) out.insurance.textContent = usdCents.format(result.monthlyInsurance);
    if (out.hoa) out.hoa.textContent = usdCents.format(result.monthlyHoa);
    if (out.loan) out.loan.textContent = usd.format(result.loanAmount);
    if (out.downPct) out.downPct.textContent = `${pct.format(result.downPaymentPercent)}%`;
    if (out.interest) out.interest.textContent = usd.format(result.totalInterest);
    if (out.totalPaid) out.totalPaid.textContent = usd.format(result.totalOfPayments);

    // Proportional bar per line. Purely decorative — the figures beside it are
    // what a person reads, and it is aria-hidden in the markup.
    const total = result.monthlyTotal;
    const parts: Record<string, number> = {
      pi: result.monthlyPrincipalAndInterest,
      tax: result.monthlyPropertyTax,
      insurance: result.monthlyInsurance,
      hoa: result.monthlyHoa,
    };
    for (const bar of bars) {
      const key = bar.dataset.calcBar ?? '';
      const share = total > 0 ? (parts[key] ?? 0) / total : 0;
      bar.style.setProperty('--share', `${(share * 100).toFixed(2)}%`);
    }
  }

  function update() {
    const priceValue = parseAmount(price!.value);
    const rateValue = parseAmount(rate!.value);

    const everyFieldValid = numeric.every((field) => {
      const raw = field.value.trim();
      if (raw === '') return true;
      const value = parseAmount(raw);
      if (value === null || value < 0) return false;
      if (field === rate && value > 25) return false;
      return true;
    });

    /*
     * Nothing is shown until there is a price AND a rate. A payment estimated
     * from a rate the visitor did not supply would be the site asserting a
     * market figure it has no source for.
     */
    const ready = everyFieldValid && priceValue !== null && priceValue > 0 && rateValue !== null;

    if (results) results.hidden = !ready;
    if (prompt) prompt.hidden = ready;
    if (!ready) return;

    const mode = downMode!.value === 'percent' ? 'percent' : 'amount';
    const downPayment = resolveDownPayment(priceValue, mode, read(downValue));

    render(
      calculateMortgage({
        price: priceValue,
        downPayment,
        annualRatePercent: rateValue,
        termYears: Number(term!.value) || 30,
        annualPropertyTax: read(tax),
        annualInsurance: read(insurance),
        monthlyHoa: read(hoa),
      }),
    );
  }

  /* ------------------------------------------------------------------ wiring */

  for (const field of numeric) {
    field.addEventListener('input', () => {
      // Clear a standing error as soon as the value becomes valid again.
      if (field.hasAttribute('aria-invalid')) validate(field);
      update();
    });
    field.addEventListener('blur', () => {
      validate(field);
      update();
    });
  }

  /**
   * Switching between "%" and "$" changes what the number means, so the
   * placeholder and the affix move with it. A currency symbol goes before the
   * number and a percent sign after it — one element that swapped its
   * character rendered "%20".
   */
  function syncDownMode() {
    const isPercent = downMode!.value === 'percent';
    downValue!.placeholder = isPercent ? '20' : '120,000';
    const percentAffix = q<HTMLElement>('down-affix-percent');
    const amountAffix = q<HTMLElement>('down-affix-amount');
    if (percentAffix) percentAffix.hidden = !isPercent;
    if (amountAffix) amountAffix.hidden = isPercent;
  }

  downMode.addEventListener('change', () => {
    syncDownMode();
    update();
  });

  term.addEventListener('change', update);

  root.addEventListener('submit', (event) => {
    // A static page has nothing to post to; the estimate is already live.
    event.preventDefault();
    numeric.forEach(validate);
    update();
  });

  root.addEventListener('reset', () => {
    // `reset` fires before the fields are cleared.
    window.setTimeout(() => {
      numeric.forEach((field) => setError(field, null));
      syncDownMode();
      update();
      price.focus();
    }, 0);
  });

  root.dataset.enhanced = 'true';
  syncDownMode();
  update();
}
