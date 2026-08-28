# Hoffman & Closius — South Florida Real Estate

Production website for **Martin Hoffman P.A.** and **MaryEllen Closius P.A.**

Astro · Tailwind CSS · static output · no framework runtime.

---

## Read first

| File | What it is |
| --- | --- |
| [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) | Permanent project rules — client identity, branding, Keyes logo rules, architecture, accessibility, and the rules against inventing facts. **Read before every task.** |
| [`BUILD_PROGRESS.md`](./BUILD_PROGRESS.md) | What is built, what is broken, what is next. **Update after every task.** |
| [`CONTENT_PENDING.md`](./CONTENT_PENDING.md) | Everything awaiting client confirmation. Never fill one of these in with a guess. |
| [`FINAL_QA_REPORT.md`](./FINAL_QA_REPORT.md) | What is finished, what needs client assets, what needs confirmation, what needs a third party — and the launch checklist. |

---

## Quick reference

Everything a new developer needs in one place. Details follow in the sections
below.

```bash
npm install          # once
npm run dev          # http://localhost:4321, hot reload
npm run build        # type check → unit tests → build → dead-link check
```

`npm run build` must finish with **0 errors and 0 warnings**. It is not just a
build: it runs `astro check`, the mortgage unit tests and the link verifier, so
a broken type, a broken sum or a dead link fails it.

| Where | What lives there |
| --- | --- |
| **Static output** | `dist/` — plain HTML/CSS/JS, no server needed. Upload its *contents* to the web root. |
| **Site configuration** | `src/config/site.ts` — the single source of truth for names, phone numbers, emails, the domain and the brand. Anything unconfirmed sits in its `pending` object as `null`. `src/config/navigation.ts` owns every menu. |
| **Listing data provider** | `src/lib/listings/` — implement `idxProvider.ts` and nothing else. Full instructions in [`IDX_INTEGRATION.md`](./IDX_INTEGRATION.md). Developments follow the same pattern in `src/lib/developments/`, accounts in `src/lib/auth/` ([`AUTH_INTEGRATION.md`](./AUTH_INTEGRATION.md)). |
| **Content editing** | Communities: `src/data/communities.ts` · FAQ: `src/data/faqs.ts` · Testimonials: `src/data/testimonials.ts` · Legal text: `src/data/legal.ts` · Journal articles: one Markdown file each in `src/content/blog/` ([`docs/authoring-blog-posts.md`](./docs/authoring-blog-posts.md)) · Page copy: the `.astro` file for that route in `src/pages/`. |

**Before changing anything, read [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).**
The rule that matters most: never invent a client fact. If it has not been
supplied, leave it out and add it to
[`CONTENT_PENDING.md`](./CONTENT_PENDING.md).

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
```

## Commands

| Command | Effect |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type check, then build to `dist/` |
| `npm run build:fast` | Build without the type check |
| `npm run build:portable` | Build, then rewrite `dist/` to relative URLs so `dist/index.html` opens straight off the filesystem |
| `npm run preview` | Serve the built `dist/` |
| `npm run check` | `astro check` only |

`npm run build` must finish with **0 errors and 0 warnings**.

## Environment variables

Copy `.env.example` to `.env` for local work, and set the same values in the
host's build environment for production. Astro reads them at build time, so a
change needs a rebuild.

| Variable | Effect |
| --- | --- |
| `PUBLIC_LEAD_FORM_ENDPOINT` | Where enquiry forms send submissions. **Unset today.** |
| `PUBLIC_DEMO_CONTENT` | Forces the sample listings/developments on or off. |
| `PUBLIC_AUTH_SIGN_IN_URL` | The account provider's own sign-in page. **Unset today.** |
| `PUBLIC_AUTH_REGISTER_URL` | The account provider's own registration page. **Unset today.** |
| `PUBLIC_AUTH_ACCOUNT_URL` | Optional — where a signed-in visitor manages saved searches. |

**Until `PUBLIC_LEAD_FORM_ENDPOINT` is set, no form claims to have sent
anything.** Submitting shows the visitor their own answers with a prefilled
email link to Martin and MaryEllen and both direct numbers — so their effort is
not lost and nobody waits for a reply that was never coming. Setting the
variable and rebuilding switches every form over; there is no code to change.

Setting both `PUBLIC_AUTH_*` URLs switches `/login/` and `/register/` from
"accounts are not available yet" to handing off to the provider. **This site
never collects a password** — there is no backend here to verify one, so the
credential step belongs to the provider, on the provider's own origin. See
[`AUTH_INTEGRATION.md`](./AUTH_INTEGRATION.md).

Every variable here is `PUBLIC_`, meaning it is compiled into the pages and
visible to anyone. That is correct for a browser-submitted form endpoint, but
it means the endpoint URL must never itself be a credential. A provider that
needs an API key needs a server-side relay instead.

## Deploying

`dist/` is plain static HTML, CSS and JavaScript. No Node, no database and no
build step on the server — every route is a real folder with its own
`index.html`.

### Preview on GitHub Pages

`.github/workflows/preview.yml` builds the site and publishes it, so the work
can be reviewed at a URL before it goes anywhere near Hostinger.

**One manual step, once:** Settings → Pages → Build and deployment → Source:
**GitHub Actions**. Until that is changed, GitHub keeps running its own
built-in Jekyll workflow instead, which fails — Jekyll reads the `---` fences
at the top of every `.astro` file as YAML front matter and chokes on the
TypeScript inside. Nothing is wrong with the site.

The workflow runs on every push to `main`, and can be run by hand from any
branch: Actions → Preview on GitHub Pages → Run workflow.

The preview differs from production in three deliberate ways:

- Served from a subpath (`…github.io/<repo>/`), so the build is rewritten to
  match with `make-portable.mjs --base`.
- **Includes the clearly-marked sample properties**, so the design reads fully
  before the MLS feed exists. Untick the option when running the workflow by
  hand to see the true production state.
- `robots.txt` blocks all crawlers, so the preview URL can never compete with
  the real domain in search results.

### Hostinger / cPanel / any Apache host

```bash
npm run build
```

Upload **the contents of `dist/`** — not the `dist` folder itself — into
`public_html/`, so you end up with `public_html/index.html` at the top level.

If the site goes into a subfolder rather than the domain root, the ordinary
build loads unstyled, because its asset paths start at `/`. Use
`node scripts/make-portable.mjs --base=/your-subfolder` after building.

### Opening the files with no server at all

`npm run build:portable` rewrites `dist/` to document-relative URLs, so
`dist/index.html` works when opened straight off the filesystem — useful for
sending the site to someone as a folder.

### Other hosts

Netlify, Vercel, Cloudflare Pages and S3 serve `dist/` as-is.

## Structure

```
public/brand/    Keyes logo assets — see docs/keyes-logo.md
public/fonts/    Self-hosted woff2 (latin subset)
src/config/      site.ts · navigation.ts — the only place client data lives
src/components/  layout/ · sections/ · ui/ · forms/ · auth/ · legal/
src/layouts/     BaseLayout · StubPage
src/data/        Typed data modules — intentionally empty until sources are
                 confirmed. legal.ts holds the privacy/terms text, gated on
                 `approved`.
src/lib/auth/    Account provider seam — see AUTH_INTEGRATION.md
src/pages/       Routes
src/styles/      tokens.css · fonts.css · global.css
scripts/         make-portable.mjs
```

## Two rules worth repeating

1. **Never invent client facts** — no addresses, licence numbers, awards,
   statistics, testimonials or listing data. If it has not been supplied, leave
   it out and add it to `CONTENT_PENDING.md`.
2. **Never modify the Keyes logo**, and never write wording that explains the
   business relationship. The logo appears on its own.
3. **No form pretends to succeed.** If nothing received a submission, the page
   says so and hands the visitor a person to contact. A "thank you, we'll be in
   touch" over a message that went nowhere is worse than no form at all.
4. **No figure without a source and a date.** That applies to median home
   values, market statistics and anything else numeric about the market. The
   site calculates no home values, and an automated estimate — if one is ever
   connected — is a statistical model over comparable sales, never described as
   artificial intelligence.
