/**
 * Account provider selection — the single place that decides whether this
 * site has an account system at all.
 *
 * Order of preference:
 *
 *   1. **Hosted provider**, when its destination URLs are configured. The
 *      provider owns sign-in, registration and every credential involved.
 *   2. **Unconfigured**. There is no account system, the account pages say
 *      so, and nothing pretends otherwise.
 *
 * There is no demo branch here, deliberately. A fake signed-in state is not a
 * design placeholder — it is a claim that an account exists, and the one thing
 * worse than no account system is a visitor believing they have registered for
 * alerts that nobody will ever send. Testimonials and developments are
 * excluded from the demo layer for the same reason (PROJECT_CONTEXT.md §8).
 *
 * Everything downstream imports `authProvider` from here and never a specific
 * provider, so this is the only file that changes when a platform goes live.
 */
import { hostedAuthProvider, isConfigured as hostedIsConfigured } from './hostedProvider';
import { unconfiguredAuthProvider } from './unconfiguredProvider';
import type { AuthProvider } from './types';

function select(): AuthProvider {
  if (hostedIsConfigured()) return hostedAuthProvider;
  return unconfiguredAuthProvider;
}

export const authProvider: AuthProvider = select();

/**
 * True when a visitor can actually sign in or register. False means both
 * account pages render their honest "being set up" treatment — which is the
 * state today.
 */
export const hasAccounts = authProvider.isConfigured;

export type { AuthProvider };
