/**
 * ---------------------------------------------------------------------------
 * VALUATION DATA CONTRACT
 * ---------------------------------------------------------------------------
 * The seam an automated valuation model (AVM) or market-data feed plugs into.
 *
 * **Nothing is connected today, and the site publishes no figures.** That is
 * the correct state: a number on a page about someone's home is a claim, and
 * an invented one could shape a real decision about the largest asset most
 * people own.
 *
 * Two rules:
 *
 *  1. **Every figure carries its source and its date.** A median with no
 *     provenance is a rumour. `source` and `asOf` are required, not optional.
 *  2. **Never describe this as artificial intelligence.** An AVM is a
 *     statistical model over comparable sales. Calling it AI oversells what it
 *     does and invites people to trust it more than it deserves. The UI says
 *     what it is: an estimate from recent sales data, and no substitute for a
 *     person who has seen the property.
 * ---------------------------------------------------------------------------
 */

export interface ValuationRequest {
  readonly address: string;
  readonly city: string;
  readonly zip: string;
  readonly propertyType?: string;
  readonly beds?: number;
  readonly baths?: number;
  readonly sqft?: number;
}

/**
 * An automated estimate. Always a range: a single number implies a precision
 * no model over comparable sales has.
 */
export interface ValuationEstimate {
  readonly low: number;
  readonly mid: number;
  readonly high: number;
  /** e.g. 'high' | 'medium' | 'low', exactly as the model reports it. */
  readonly confidence: string | null;
  /** Who produced it. Required — a figure without a source is not publishable. */
  readonly source: string;
  /** ISO date the model produced this. Required. */
  readonly asOf: string;
  /** The provider's own disclaimer, verbatim. */
  readonly disclaimer: string | null;
}

/**
 * Market context for an area. Every field that is a number carries the same
 * source and date as the snapshot it belongs to.
 */
export interface MarketSnapshot {
  readonly city: string;
  readonly medianSalePrice: number | null;
  readonly medianPricePerSqft: number | null;
  readonly medianDaysOnMarket: number | null;
  /** Who published these figures. Required. */
  readonly source: string;
  readonly sourceUrl: string | null;
  /** The period the figures cover, e.g. '2026-07'. Required. */
  readonly asOf: string;
}

export interface ValuationProvider {
  readonly id: 'avm' | 'unconfigured';
  readonly name: string;
  /** True only when real, sourced figures are available. */
  readonly isLive: boolean;

  /** Null when no estimate can be produced. Never a fabricated fallback. */
  getEstimate(request: ValuationRequest): Promise<ValuationEstimate | null>;
  /** Null when no sourced figures exist for the area. */
  getMarketSnapshot(city: string): Promise<MarketSnapshot | null>;
  /** Areas the provider can report on. */
  getCoveredCities(): Promise<readonly string[]>;
}
