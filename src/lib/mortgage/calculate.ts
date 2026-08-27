/**
 * ---------------------------------------------------------------------------
 * MORTGAGE MATHS
 * ---------------------------------------------------------------------------
 * Pure functions. No DOM, no formatting, no framework — so the arithmetic can
 * be unit-tested on its own (`npm run test:unit`) and reused by both the
 * property-detail estimate and the full calculator.
 *
 * ── What this is not ──────────────────────────────────────────────────────
 * Not a lending quote, not an affordability assessment, and not a rate
 * source. The site holds no market interest rate and will not imply one: the
 * rate is always supplied by the person using it. Nothing here fetches
 * anything.
 *
 * It is also not artificial intelligence. It is the standard amortisation
 * formula — the same one a lender uses — applied to numbers a visitor typed
 * (PROJECT_CONTEXT.md §8).
 * ---------------------------------------------------------------------------
 */

export interface MortgageInput {
  /** Purchase price in dollars. */
  readonly price: number;
  /** Down payment in dollars. */
  readonly downPayment: number;
  /** Annual interest rate as a percentage, e.g. 6.5 for 6.5%. */
  readonly annualRatePercent: number;
  /** Loan term in years. */
  readonly termYears: number;
  /** Annual property taxes in dollars. */
  readonly annualPropertyTax?: number;
  /** Annual homeowners insurance in dollars. */
  readonly annualInsurance?: number;
  /** Monthly association fee in dollars. */
  readonly monthlyHoa?: number;
}

export interface MortgageBreakdown {
  /** Amount borrowed: price minus down payment, never below zero. */
  readonly loanAmount: number;
  /** Down payment as a share of the price, 0–100. Zero when price is zero. */
  readonly downPaymentPercent: number;
  readonly monthlyPrincipalAndInterest: number;
  readonly monthlyPropertyTax: number;
  readonly monthlyInsurance: number;
  readonly monthlyHoa: number;
  readonly monthlyTotal: number;
  /** Interest paid across the full term, if every payment is made on schedule. */
  readonly totalInterest: number;
  /** Principal + interest across the full term. */
  readonly totalOfPayments: number;
}

const nonNegative = (value: number): number =>
  Number.isFinite(value) && value > 0 ? value : 0;

/**
 * Monthly principal and interest, by the standard amortisation formula:
 *
 *     M = P · i / (1 − (1 + i)^−n)
 *
 * where `i` is the monthly rate and `n` the number of payments.
 *
 * A zero rate is a legitimate input (a private family loan, a promotional
 * builder rate), and the formula divides by zero there — so it is handled as
 * the straight-line case rather than allowed to produce NaN.
 */
export function monthlyPrincipalAndInterest(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number,
): number {
  const principal = nonNegative(loanAmount);
  const months = Math.round(nonNegative(termYears) * 12);
  if (principal === 0 || months === 0) return 0;

  const monthlyRate = nonNegative(annualRatePercent) / 100 / 12;
  if (monthlyRate === 0) return principal / months;

  const payment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return Number.isFinite(payment) ? payment : 0;
}

/** Every line of the monthly payment, plus the totals over the full term. */
export function calculateMortgage(input: MortgageInput): MortgageBreakdown {
  const price = nonNegative(input.price);

  /*
   * A down payment larger than the price is a typo, not a negative loan.
   * Clamping keeps every downstream figure sane instead of showing a negative
   * monthly payment, which would be worse than showing nothing.
   */
  const downPayment = Math.min(nonNegative(input.downPayment), price);
  const loanAmount = price - downPayment;

  const termYears = nonNegative(input.termYears);
  const months = Math.round(termYears * 12);

  const monthlyPI = monthlyPrincipalAndInterest(
    loanAmount,
    input.annualRatePercent,
    termYears,
  );

  const monthlyPropertyTax = nonNegative(input.annualPropertyTax ?? 0) / 12;
  const monthlyInsurance = nonNegative(input.annualInsurance ?? 0) / 12;
  const monthlyHoa = nonNegative(input.monthlyHoa ?? 0);

  const totalOfPayments = monthlyPI * months;

  return {
    loanAmount,
    downPaymentPercent: price === 0 ? 0 : (downPayment / price) * 100,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyTotal: monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHoa,
    totalInterest: Math.max(0, totalOfPayments - loanAmount),
    totalOfPayments,
  };
}

/**
 * Reads a number out of whatever a person actually typed: "1,295,000",
 * "$450,000", "6.5%", " 30 ". Returns null for anything that is not a number,
 * so a caller can tell "they left it blank" from "they entered zero" — the two
 * mean different things in a form.
 */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (cleaned === '' || cleaned === '.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Down payment in dollars, from either an amount or a percentage. */
export function resolveDownPayment(
  price: number,
  mode: 'amount' | 'percent',
  value: number,
): number {
  if (mode === 'percent') return (nonNegative(price) * nonNegative(value)) / 100;
  return nonNegative(value);
}

/** Loan terms offered. Years, longest first, as lenders quote them. */
export const LOAN_TERMS = [30, 20, 15, 10] as const;
