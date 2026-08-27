/**
 * Unconfigured account provider — the honest default, and the state today.
 *
 * No IDX platform has been chosen, so there is no account system to sign in
 * to. `/login/` and `/register/` detect this through `isConfigured === false`
 * and say so plainly rather than showing a form that cannot work.
 *
 * There is deliberately no fallback behaviour here. A listing page with no
 * provider can still show an honest empty state; an account page with no
 * provider cannot "partly" sign someone in, and pretending otherwise is the
 * exact failure this whole directory exists to prevent.
 */
import type { AuthProvider } from './types';

export const unconfiguredAuthProvider: AuthProvider = {
  id: 'unconfigured',
  name: 'No account provider configured',
  isConfigured: false,
  handoff: null,
  destinations: null,
};
