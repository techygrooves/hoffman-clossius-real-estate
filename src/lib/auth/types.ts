/**
 * ---------------------------------------------------------------------------
 * ACCOUNT / AUTHENTICATION CONTRACT
 * ---------------------------------------------------------------------------
 * Saved searches and property alerts belong to an account, and this site has
 * no account system. It also must never grow one of its own.
 *
 * ── The rule this file exists to enforce ──────────────────────────────────
 * **This site never collects a credential.** Not a password, not a one-time
 * code, not a security answer. There is deliberately NO method on
 * `AuthProvider` that accepts one, because the shape of an interface decides
 * what gets built against it: give this file a `signIn(email, password)` and
 * sooner or later something will implement it, and that something would be
 * homemade authentication on a static site with no backend.
 *
 * A connected provider owns the credential step entirely, on its own origin.
 * All this contract carries is *where to send someone* and *how the provider
 * takes over*. See AUTH_INTEGRATION.md.
 *
 * ── What must never appear in this directory ──────────────────────────────
 *   - a password field, hash, comparison or reset flow
 *   - a session token, JWT or cookie written by us
 *   - localStorage or sessionStorage holding anything credential-shaped
 *   - a "remember me" that is anything other than the provider's own
 *
 * The one piece of per-device state this site does keep is the saved-property
 * list in `src/lib/listings/favorites.ts` — a list of listing ids, no identity
 * attached, replaced by the provider's account system when one is connected
 * (CONTENT_PENDING.md 5.10).
 * ---------------------------------------------------------------------------
 */

/**
 * How a connected provider takes over the credential step.
 *
 *  'hosted'    The visitor leaves for the provider's own sign-in page and
 *              comes back signed in. Nothing credential-shaped ever touches
 *              this origin. **Prefer this.**
 *
 *  'embedded'  The provider's own script mounts its own form into a slot on
 *              our page. The markup, the fields and the submission are the
 *              provider's; we supply a container and nothing else. Still not
 *              our form — but it does put a third-party script on the page,
 *              which has privacy-policy and cookie-consent consequences
 *              (CONTENT_PENDING.md 4.7, 11.2).
 */
export type AuthHandoff = 'hosted' | 'embedded';

/**
 * Where the provider's own pages live.
 *
 * These are ordinary public URLs — links, not secrets — which is why the
 * environment variables behind them carry the `PUBLIC_` prefix. An API key
 * never does. If a provider requires a key to render its widget, that key
 * belongs behind a server-side relay, never in this object.
 */
export interface AuthDestinations {
  /** The provider's sign-in page. */
  readonly signIn: string;
  /** The provider's registration page. */
  readonly register: string;
  /** Where an already-signed-in visitor manages saved searches. */
  readonly account: string | null;
}

export interface AuthProvider {
  readonly id: 'unconfigured' | 'hosted';
  readonly name: string;
  /**
   * True only when a real provider is connected and every destination it
   * needs is present. False is the honest state today, and the account pages
   * render their "not available yet" treatment from it.
   */
  readonly isConfigured: boolean;
  readonly handoff: AuthHandoff | null;
  readonly destinations: AuthDestinations | null;
}
