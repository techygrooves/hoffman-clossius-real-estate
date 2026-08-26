/**
 * Valuation provider selection.
 *
 * Only one provider exists today — the unconfigured one. When the client
 * subscribes to an AVM or a market-data feed, add `avmProvider.ts`
 * implementing `ValuationProvider`, map its payload onto the types in exactly
 * one place, and add it to the branch below.
 *
 * **No page changes.** `/sell/median-home-values/` already renders sourced
 * figures when `isLive` is true and the neutral explanation when it is not.
 *
 * Requirements before connecting one:
 *  - a licence permitting public display of the figures
 *  - the provider's required attribution and disclaimer wording, verbatim
 *  - the refresh cadence the licence demands
 *  See CONTENT_PENDING.md 10.7.
 */
import { unconfiguredValuationProvider } from './unconfiguredProvider';
import type { ValuationProvider } from './types';

export const valuationProvider: ValuationProvider = unconfiguredValuationProvider;

/** True when the site can publish sourced market figures. */
export const hasValuationData = valuationProvider.isLive;

export type { ValuationProvider };
