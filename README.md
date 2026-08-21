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

`dist/` is plain static HTML, CSS and JavaScript — upload it to any static
host, or point a web server at it. After `npm run build:portable` the same
folder also works when `dist/index.html` is opened directly, with no server.

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
