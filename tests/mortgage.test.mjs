/**
 * Unit tests for the mortgage maths. Node's built-in test runner, no
 * dependencies: `npm run test:unit`.
 *
 * The expected values below are computed independently of the implementation —
 * either by hand from the amortisation formula, or from figures that are
 * standard enough to check against any lender's calculator. A test that
 * re-derives its expectation the same way the code does proves nothing.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMortgage,
  monthlyPrincipalAndInterest,
  parseAmount,
  resolveDownPayment,
} from '../src/lib/mortgage/calculate.ts';

/** Two figures agree to the cent. */
const closeTo = (actual, expected, tolerance = 0.01) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${expected}, got ${actual} (tolerance ${tolerance})`,
  );

/* -------------------------------------------------------------------------- */
/* Principal and interest                                                      */
/* -------------------------------------------------------------------------- */

test('P&I matches the amortisation formula on a textbook case', () => {
  // $200,000 at 6% over 30 years is the canonical worked example: $1,199.10.
  closeTo(monthlyPrincipalAndInterest(200000, 6, 30), 1199.1, 0.05);
});

test('P&I matches a hand-computed case', () => {
  // M = P·i / (1 − (1+i)^−n), P = 500000, i = 0.065/12, n = 360.
  const P = 500000;
  const i = 0.065 / 12;
  const n = 360;
  const expected = (P * i) / (1 - Math.pow(1 + i, -n));
  closeTo(monthlyPrincipalAndInterest(P, 6.5, 30), expected);
});

test('a shorter term costs more per month and less overall', () => {
  const thirty = monthlyPrincipalAndInterest(400000, 6, 30);
  const fifteen = monthlyPrincipalAndInterest(400000, 6, 15);
  assert.ok(fifteen > thirty, 'a 15-year payment should be larger');
  assert.ok(fifteen * 180 < thirty * 360, 'but should cost less in total');
});

test('a zero rate is straight-line, not NaN', () => {
  // Division by zero in the formula — handled explicitly.
  closeTo(monthlyPrincipalAndInterest(360000, 0, 30), 1000);
});

test('a zero-length term does not divide by zero', () => {
  assert.equal(monthlyPrincipalAndInterest(200000, 6, 0), 0);
});

test('nothing borrowed means nothing owed', () => {
  assert.equal(monthlyPrincipalAndInterest(0, 6, 30), 0);
});

test('negative and non-finite inputs are treated as zero, never NaN', () => {
  for (const value of [monthlyPrincipalAndInterest(-1000, 6, 30),
                       monthlyPrincipalAndInterest(200000, -5, 30),
                       monthlyPrincipalAndInterest(NaN, 6, 30),
                       monthlyPrincipalAndInterest(200000, Infinity, 30)]) {
    assert.ok(Number.isFinite(value), `expected a finite number, got ${value}`);
    assert.ok(value >= 0, `expected a non-negative number, got ${value}`);
  }
});

/* -------------------------------------------------------------------------- */
/* Full breakdown                                                              */
/* -------------------------------------------------------------------------- */

test('the monthly total is the sum of its parts', () => {
  const r = calculateMortgage({
    price: 600000,
    downPayment: 120000,
    annualRatePercent: 6.5,
    termYears: 30,
    annualPropertyTax: 9000,
    annualInsurance: 4800,
    monthlyHoa: 350,
  });

  assert.equal(r.loanAmount, 480000);
  closeTo(r.downPaymentPercent, 20);
  closeTo(r.monthlyPropertyTax, 750);   // 9000 / 12
  closeTo(r.monthlyInsurance, 400);     // 4800 / 12
  closeTo(r.monthlyHoa, 350);
  closeTo(
    r.monthlyTotal,
    r.monthlyPrincipalAndInterest + 750 + 400 + 350,
  );
});

test('annual costs are divided by twelve, not by anything else', () => {
  const r = calculateMortgage({
    price: 100000, downPayment: 100000,   // no loan, so only the extras remain
    annualRatePercent: 6, termYears: 30,
    annualPropertyTax: 1200, annualInsurance: 600, monthlyHoa: 100,
  });
  closeTo(r.monthlyPrincipalAndInterest, 0);
  closeTo(r.monthlyTotal, 100 + 50 + 100);
});

test('omitted taxes, insurance and HOA count as zero rather than breaking', () => {
  const r = calculateMortgage({
    price: 300000, downPayment: 60000, annualRatePercent: 5, termYears: 30,
  });
  assert.equal(r.monthlyPropertyTax, 0);
  assert.equal(r.monthlyInsurance, 0);
  assert.equal(r.monthlyHoa, 0);
  closeTo(r.monthlyTotal, r.monthlyPrincipalAndInterest);
});

test('a down payment above the price clamps instead of going negative', () => {
  const r = calculateMortgage({
    price: 400000, downPayment: 500000, annualRatePercent: 6, termYears: 30,
  });
  assert.equal(r.loanAmount, 0);
  assert.equal(r.monthlyPrincipalAndInterest, 0);
  closeTo(r.downPaymentPercent, 100);
  assert.ok(r.monthlyTotal >= 0);
});

test('a zero price does not divide by zero when working out the percentage', () => {
  const r = calculateMortgage({
    price: 0, downPayment: 0, annualRatePercent: 6, termYears: 30,
  });
  assert.equal(r.downPaymentPercent, 0);
  assert.ok(Number.isFinite(r.monthlyTotal));
});

test('total interest is the sum of payments less the amount borrowed', () => {
  const r = calculateMortgage({
    price: 500000, downPayment: 100000, annualRatePercent: 6.5, termYears: 30,
  });
  closeTo(r.totalOfPayments, r.monthlyPrincipalAndInterest * 360, 0.02);
  closeTo(r.totalInterest, r.totalOfPayments - 400000, 0.02);
  assert.ok(r.totalInterest > 0, 'a 6.5% loan should accrue interest');
});

test('total interest is never negative at a zero rate', () => {
  const r = calculateMortgage({
    price: 360000, downPayment: 0, annualRatePercent: 0, termYears: 30,
  });
  closeTo(r.totalInterest, 0);
  closeTo(r.totalOfPayments, 360000);
});

/* -------------------------------------------------------------------------- */
/* Input parsing                                                               */
/* -------------------------------------------------------------------------- */

test('parseAmount reads what people actually type', () => {
  assert.equal(parseAmount('1,295,000'), 1295000);
  assert.equal(parseAmount('$450,000'), 450000);
  assert.equal(parseAmount('6.5%'), 6.5);
  assert.equal(parseAmount(' 30 '), 30);
  assert.equal(parseAmount('0'), 0);
});

test('parseAmount distinguishes blank from zero', () => {
  // A form needs to tell "left empty" from "entered 0" — they are different
  // answers, and only one of them is a number.
  assert.equal(parseAmount(''), null);
  assert.equal(parseAmount('   '), null);
  assert.equal(parseAmount('abc'), null);
  assert.equal(parseAmount('.'), null);
  assert.equal(parseAmount('0'), 0);
});

test('resolveDownPayment handles both modes', () => {
  assert.equal(resolveDownPayment(600000, 'percent', 20), 120000);
  assert.equal(resolveDownPayment(600000, 'amount', 120000), 120000);
  assert.equal(resolveDownPayment(600000, 'percent', 0), 0);
  assert.equal(resolveDownPayment(0, 'percent', 20), 0);
  assert.equal(resolveDownPayment(600000, 'amount', -5), 0);
});
