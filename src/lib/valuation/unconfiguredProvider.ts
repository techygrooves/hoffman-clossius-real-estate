/**
 * The honest default: no valuation data source is connected.
 *
 * Returns null throughout. Pages detect `isLive === false` and explain the
 * tool neutrally — what a median is, what it cannot tell you about a specific
 * property — then invite a valuation from a person. They do not show a number,
 * a range, a gauge or a "estimated value" of any kind.
 */
import type {
  MarketSnapshot,
  ValuationEstimate,
  ValuationProvider,
} from './types';

export const unconfiguredValuationProvider: ValuationProvider = {
  id: 'unconfigured',
  name: 'No valuation data source configured',
  isLive: false,

  async getEstimate(): Promise<ValuationEstimate | null> {
    return null;
  },
  async getMarketSnapshot(): Promise<MarketSnapshot | null> {
    return null;
  },
  async getCoveredCities() {
    return [];
  },
};
