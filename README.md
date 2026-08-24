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
src/components/  layout/ · sections/ · ui/
src/layouts/     BaseLayout · StubPage
src/data/        Typed data modules — intentionally empty until sources are confirmed
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
