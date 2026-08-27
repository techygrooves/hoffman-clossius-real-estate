# AUTH_INTEGRATION.md

How to connect real accounts — sign-in, registration, saved searches and
property alerts — to this site.

**Nothing is connected today.** There is no account system, no user record, no
session and no password anywhere in this project. What exists is the seam a
real provider plugs into, and a set of rules about what may never be built
here.

---

## 1. The short version

Set two environment variables. That is the integration.

```bash
PUBLIC_AUTH_SIGN_IN_URL=https://accounts.example-provider.com/sign-in
PUBLIC_AUTH_REGISTER_URL=https://accounts.example-provider.com/register
PUBLIC_AUTH_ACCOUNT_URL=https://accounts.example-provider.com/saved-searches   # optional
```

Rebuild, and `/login/` and `/register/` switch from their "not available yet"
state to handing off to the provider. **No component or page changes.**

```
src/lib/auth/
  types.ts                 the contract — AuthProvider, AuthDestinations
  provider.ts              selects which provider is active
  hostedProvider.ts        reads the environment variables above
  unconfiguredProvider.ts  serves nothing, honestly

src/components/auth/
  AccountHandoff.astro     the "continue to sign in" panel
  AccountBenefits.astro    what an account is for
```

---

## 2. Why this site never collects a password

This is the rule the whole directory exists to enforce, and it is not a
stylistic preference.

**This site is statically generated and has no backend of its own.** There is
no server here to receive a password, nothing to verify it against, no session
to issue and nowhere to store a hash. A sign-in form on these pages could
therefore only ever be one of two things:

1. **Decorative** — a form that does nothing. Not harmless: browsers offer to
   save what is typed into a password field, password managers fill it, and
   people reuse credentials across sites. A field that goes nowhere still
   collects a real password into a page that cannot protect it.
2. **Homemade authentication** — credentials checked in client-side JavaScript,
   or posted to some endpoint improvised for the purpose. Every visitor can
   read that code. This is worse than no login at all.

So the credential step belongs to the provider, on the provider's own origin.
That is also the standing project rule: `CONTENT_PENDING.md` 5.10 — *"`/login/`
and `/register/` are provider-hosted. This site must never collect credentials
directly."*

### This is enforced by the shape of the contract

`AuthProvider` in `src/lib/auth/types.ts` has **no method that accepts a
credential**. There is no `signIn(email, password)`, and adding one is the
change to refuse in review. An interface decides what gets built against it: a
credential-shaped parameter is an invitation, and eventually somebody accepts
it.

What the contract carries is *where to send someone* and *how the provider
takes over*. Nothing else.

### Never, in this project

- an `<input type="password">` on any page, in any build mode, disabled or not
- a password hash, comparison, strength meter or reset flow
- a session token, JWT or cookie written by this site
- `localStorage` or `sessionStorage` holding anything credential-shaped
- a fake or demo signed-in state (see §6)

---

## 3. What a provider must supply

| # | Item | Why |
| --- | --- | --- |
| 1 | A hosted sign-in URL | `PUBLIC_AUTH_SIGN_IN_URL` |
| 2 | A hosted registration URL | `PUBLIC_AUTH_REGISTER_URL` |
| 3 | A return URL or redirect rule | So a visitor lands back here after signing in, rather than stranded on the provider's site |
| 4 | Confirmation of what the provider stores | Needed for the privacy policy — `CONTENT_PENDING.md` 4.7, 6.7 |
| 5 | Whether the provider sets cookies on our domain | Decides the cookie-consent question — `CONTENT_PENDING.md` 11.2 |
| 6 | How saved searches map to the listing feed | An account is only useful if its alerts match the same inventory `/properties/` shows |

Items 4 and 5 are not paperwork. A third party that receives a visitor's name
and email, or sets a cookie in this site's context, has to be named in the
privacy policy — and that policy cannot be finished until it is.

---

## 4. Connecting a hosted provider

The default and the one to prefer. The visitor leaves for the provider's page,
signs in there, and returns. Nothing credential-shaped touches this origin.

1. Set the variables in §1, in the host's build environment as well as `.env`.
2. Rebuild. `hostedProvider.isConfigured()` requires **both** required URLs —
   a half-configured environment falls back to the unconfigured provider rather
   than shipping a sign-in link that 404s.
3. Check `/login/` and `/register/` render the handoff panel.
4. Confirm the return journey actually returns, on a phone as well as a
   desktop.

### Why these variables are `PUBLIC_`

They are destinations a browser navigates to — links, visible in the markup by
definition. `PUBLIC_` is correct for that and only that.

**An API key or secret must never carry the prefix.** Astro compiles
`PUBLIC_*` into the client bundle, where anyone can read it. A provider whose
widget needs a key needs a server-side relay instead — the same rule as
`IDX_INTEGRATION.md` §2.

---

## 5. The embedded alternative, and what it costs

Some platforms offer a widget: their script renders their own form into a
container on our page. The form, the fields and the submission are still
theirs, so it does not break the rule in §2 — but it is a bigger change than
setting two URLs, and it is not free:

- a third-party script now runs on the page, which the site currently has none
  of (`PROJECT_CONTEXT.md` §6 — no third-party runtime requests)
- that script must be described in the privacy policy, and it may set cookies,
  which reopens `CONTENT_PENDING.md` 11.2
- the widget's own markup has to be checked against WCAG 2.2 AA. It is not
  covered by this project's accessibility work, and an inaccessible sign-in
  form is a sign-in form some people cannot use
- the honest privacy claim on `/privacy-policy/` — that no page contacts
  another company — stops being true and must be corrected

`hostedProvider.ts` sets `handoff: 'hosted'`. Do not change it to `'embedded'`
without doing the four things above.

---

## 6. What `/register/` does today, and why

With no provider configured, `/register/` is not a dead page. It collects the
four details a saved search needs — name, email, phone, and the ZIP or area
being watched — and sends them through the ordinary lead service
(`src/lib/forms/`) as a `property-alerts` enquiry. Martin and MaryEllen set the
alerts up by hand.

This is deliberate, and it is bounded:

- **It asks for no password**, because there is no account to protect.
- **It does not claim to create an account.** The page says so above the form,
  in the hero, and in the heading — someone filling in a page they arrived at
  by clicking "create account" learns within a sentence that they are not
  creating one.
- It inherits the lead service's honesty rule: with no
  `PUBLIC_LEAD_FORM_ENDPOINT` configured it does **not** claim to have sent
  anything (`CONTENT_PENDING.md` 6.1).

`/login/` has no equivalent, deliberately: there is no honest way to "partly"
sign someone in. It states that accounts are not available yet and points at
what does work.

### There is no demo account mode

`src/lib/auth/provider.ts` has no demo branch, and must not gain one. A fake
signed-in state is not a design placeholder — it is a claim that an account
exists. The worst outcome available here is a visitor who believes they have
registered for alerts that nobody will ever send. Testimonials and developments
are excluded from the demo layer for the same reason
(`PROJECT_CONTEXT.md` §8).

---

## 7. What replaces the per-device saved list

Saved properties currently live in this browser's `localStorage`, under
`hc:saved-properties` (`src/lib/listings/favorites.ts`). It is a list of
listing ids with no identity attached — not an account, not synced, not sent
anywhere, and gone when site data is cleared. `/login/` says exactly that to
anyone who has saved something.

When accounts are connected, that list is replaced by the provider's own saved
properties. Decide deliberately what happens to anything already stored on a
device: migrating it silently into a new account is a surprise, and discarding
it without warning loses someone's shortlist.

---

## 8. Checklist

- [ ] Provider chosen, and it is the same platform serving the listing feed
      (`IDX_INTEGRATION.md` §1) — or its alerts will not match the inventory
- [ ] Hosted sign-in and registration URLs obtained
- [ ] Return-to-site behaviour confirmed, on mobile as well as desktop
- [ ] `PUBLIC_AUTH_SIGN_IN_URL` and `PUBLIC_AUTH_REGISTER_URL` set in the
      host's build environment
- [ ] No credential-bearing variable carries the `PUBLIC_` prefix
- [ ] `/login/` and `/register/` verified against the live provider
- [ ] What the provider stores, and for how long, written into the privacy
      policy (`CONTENT_PENDING.md` 4.7, 6.7)
- [ ] Cookie-consent decision made if the provider sets cookies (11.2)
- [ ] Saved-property migration decided (§7)
- [ ] `/register/`'s interim alerts form retired or kept deliberately — if the
      provider handles registration, decide whether the by-hand route stays
