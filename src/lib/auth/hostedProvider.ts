/**
 * ---------------------------------------------------------------------------
 * HOSTED ACCOUNT PROVIDER — the seam a real platform plugs into
 * ---------------------------------------------------------------------------
 * Configured entirely by environment variables. There is no code to write to
 * connect a provider that offers hosted sign-in and registration pages, which
 * is what IDX platforms typically do: set the URLs, rebuild, and `/login/` and
 * `/register/` switch from their "not available yet" state to handing off.
 *
 *     PUBLIC_AUTH_SIGN_IN_URL=https://…
 *     PUBLIC_AUTH_REGISTER_URL=https://…
 *     PUBLIC_AUTH_ACCOUNT_URL=https://…      # optional
 *
 * ── Why these are PUBLIC_ ─────────────────────────────────────────────────
 * They are destinations a visitor's browser navigates to — links on a page,
 * visible in the markup by definition. `PUBLIC_` is correct for that and only
 * that. **An API key or secret must never carry the prefix**, because Astro
 * compiles `PUBLIC_*` into the client bundle where anyone can read it. A
 * provider whose widget needs a key needs a server-side relay instead.
 *
 * ── Why there is no fetch here ────────────────────────────────────────────
 * Nothing on this origin talks to the provider's authentication API, so there
 * is nothing to authenticate with and no token to mishandle. The visitor goes
 * to the provider, the provider signs them in, the provider brings them back.
 *
 * See AUTH_INTEGRATION.md.
 * ---------------------------------------------------------------------------
 */
import type { AuthDestinations, AuthHandoff, AuthProvider } from './types';

const SIGN_IN_URL = import.meta.env.PUBLIC_AUTH_SIGN_IN_URL as string | undefined;
const REGISTER_URL = import.meta.env.PUBLIC_AUTH_REGISTER_URL as string | undefined;
const ACCOUNT_URL = import.meta.env.PUBLIC_AUTH_ACCOUNT_URL as string | undefined;

const clean = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * True only when BOTH required destinations are present. A half-configured
 * environment falls back to the unconfigured provider rather than shipping a
 * sign-in link that 404s — the same gate `idxProvider.isConfigured()` applies.
 */
export function isConfigured(): boolean {
  return Boolean(clean(SIGN_IN_URL) && clean(REGISTER_URL));
}

const destinations = (): AuthDestinations | null => {
  const signIn = clean(SIGN_IN_URL);
  const register = clean(REGISTER_URL);
  if (!signIn || !register) return null;
  return { signIn, register, account: clean(ACCOUNT_URL) };
};

/**
 * 'hosted' is the only handoff this file implements, and the one to prefer.
 *
 * An 'embedded' provider — one whose script renders its own form into a slot
 * on our page — is a separate integration: it needs the script added, a mount
 * point on both account pages, a privacy-policy entry describing what that
 * third party receives, and a cookie-consent decision. Do not set this to
 * 'embedded' without doing that work; see AUTH_INTEGRATION.md §5.
 */
const handoff: AuthHandoff = 'hosted';

export const hostedAuthProvider: AuthProvider = {
  id: 'hosted',
  name: 'Hosted account provider',
  isConfigured: isConfigured(),
  handoff,
  destinations: destinations(),
};
