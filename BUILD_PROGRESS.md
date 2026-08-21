# BUILD_PROGRESS.md

Living record of what exists, what is broken and what comes next.
**Update this file at the end of every session.**

Last updated: **2026-08-21** — Session 1 (project foundation)

---

## Current state

Foundation complete. Astro + Tailwind configured, design tokens established,
base layout architecture built, all 32 routes scaffolded, build green.

**No page content has been written yet — that is intentional.** Every route
except `/404` renders a hero plus an honest "in preparation" band.

| Metric | Value |
| --- | --- |
| Build | ✅ passing — `astro check`: 0 errors, 0 warnings, 0 hints |
| Pages generated | 30 static HTML pages (4 dynamic routes generate 0 until data exists) |
| CSS bundle | ~36 KB uncompressed, one file |
| JavaScript | ~3.6 KB total, inlined, no dependencies |
| Third-party runtime requests | none |

---

## ✅ Completed — Session 1 (2026-08-21)

### Project setup
- [x] Inspected repository — found empty (README + initial commit only).
- [x] Initialised Astro 7 project, `output: 'static'`, `trailingSlash: 'always'`.
- [x] Tailwind CSS 4 wired through `@tailwindcss/vite`.
- [x] TypeScript strict, path aliases (`@components`, `@layouts`, `@config`,
      `@data`, `@lib`, `@styles`, `@/`).
- [x] `@astrojs/sitemap` (excludes `/login/` and `/register/`).
- [x] `.gitignore`, `.editorconfig`, VS Code extension recommendations.

### Design system
- [x] `src/styles/tokens.css` — full colour ramps for evergreen, gold, cream and
      charcoal; semantic aliases; fluid display type scale; radii; shadows;
      easing curves; layout constants.
- [x] Contrast pass over every token pairing; four failures found and fixed —
      `ink-subtle` darkened to `#5F6A65`, outline-button borders raised to a
      3:1 floor, footer column headings from `white/50` to `white/70`, and the
      focus ring made surface-aware (evergreen on light, gold-300 on dark).
- [x] `src/styles/global.css` — base layer, focus ring, custom utilities
      (`container-page`, `section-space`, `eyebrow`, `rule-gold`,
      `link-underline`, `skip-link`), scroll-reveal rules, print styles.
- [x] `src/styles/fonts.css` — self-hosted Cormorant Garamond + Inter,
      latin subset, variable weight, `font-display: swap`.
- [x] Font files vendored to `public/fonts/` (3 files, 125 KB total) and
      preloaded in `<head>`.

### Configuration
- [x] `src/config/site.ts` — confirmed identity, both professionals with real
      phone/email, brokerage brand asset paths, design constants, service area,
      and a `pending` namespace of explicit `null`s for everything unconfirmed.
- [x] `src/config/navigation.ts` — primary nav (6 groups + Contact), footer nav
      (4 columns), legal nav, account nav, and active-path helpers.

### Layout architecture
- [x] `BaseLayout` — `<head>`, SEO, Open Graph, `RealEstateAgent` structured
      data built only from confirmed facts, skip link, header, `<main>`, footer.
- [x] `StubPage` — temporary layout for un-built routes.
- [x] `Header` — utility bar with both direct lines, sticky main bar, Keyes
      logo, desktop mega-menus, mobile drawer.
- [x] `Footer` — brand masthead, Keyes logo, both agents' contacts, four-column
      sitemap, legal row. Unconfirmed data renders as nothing.
- [x] `KeyesLogo` — build-time asset resolution with a visible placeholder.
- [x] `Wordmark` — typographic Hoffman & Closius lockup.
- [x] `Container`, `Section`, `SectionHeader`, `Button`, `Breadcrumbs`
      (with `BreadcrumbList` JSON-LD), `PageHero`.
- [x] `InPreparation` — honest build-stage section.

### Routes — all 32 scaffolded
- [x] `/`
- [x] `/about/`, `/about/martin-hoffman/`, `/about/maryellen-closius/`
- [x] `/properties/for-sale/`, `/for-rent/`, `/our-listings/`, `/search/`
- [x] `/property/[slug]/` *(dynamic — 0 pages, no MLS data)*
- [x] `/developments/new/`, `/developments/existing/`
- [x] `/developments/[slug]/` *(dynamic — 0 pages)*
- [x] `/buy/`, `/buy/dream-home-finder/`
- [x] `/sell/`, `/sell/home-evaluation/`, `/sell/median-home-values/`
- [x] `/communities/`, `/communities/[slug]/` *(dynamic — 0 pages)*
- [x] `/relocation/`, `/testimonials/`, `/mortgage-calculator/`
- [x] `/blog/`, `/blog/[slug]/` *(dynamic — 0 posts)*
- [x] `/resources/buying-guide/`, `/resources/selling-guide/`
- [x] `/faq/`, `/contact/`
- [x] `/accessibility/`, `/privacy-policy/`, `/terms/`
- [x] `/login/`, `/register/` *(both noindex)*
- [x] `404` — fully built, not a stub

### Data layer
- [x] `src/data/listings.ts`, `developments.ts`, `communities.ts`,
      `testimonials.ts`, `faqs.ts` — typed and **deliberately empty**, each
      carrying the rule against inventing or scraping its content.
- [x] `src/content.config.ts` — blog collection with a strict schema.

### Client interactivity (~3.6 KB total)
- [x] `src/lib/header.ts` — sticky-shadow observer, desktop menu
      click-toggle + `aria-expanded` + Escape, drawer with focus trap,
      scroll lock and breakpoint reset.
- [x] `src/lib/reveal.ts` — one-shot scroll reveal that degrades to
      always-visible without JS or under `prefers-reduced-motion`.

### Build and deployment
- [x] `scripts/make-portable.mjs` — rewrites `dist/` to document-relative URLs
      so `dist/index.html` opens straight off the filesystem.
- [x] `public/robots.txt`, `public/favicon.svg` (H&C monogram).
- [x] Verified in Chromium at 390 / 768 / 1440 px: header, drawer, dropdowns.

### Documentation
- [x] `PROJECT_CONTEXT.md`, `BUILD_PROGRESS.md`, `CONTENT_PENDING.md`.
- [x] `docs/keyes-logo.md`, `docs/authoring-blog-posts.md`, `README.md`.

---

## Current components

| Component | Path | Status |
| --- | --- | --- |
| `BaseLayout` | `src/layouts/BaseLayout.astro` | ✅ stable |
| `StubPage` | `src/layouts/StubPage.astro` | ⚠️ temporary — delete when the last page is built |
| `Header` | `src/components/layout/Header.astro` | ✅ stable |
| `Footer` | `src/components/layout/Footer.astro` | ✅ stable |
| `KeyesLogo` | `src/components/layout/KeyesLogo.astro` | ⚠️ placeholder until the asset arrives |
| `Wordmark` | `src/components/layout/Wordmark.astro` | ✅ stable |
| `Container` | `src/components/ui/Container.astro` | ✅ stable |
| `Section` | `src/components/ui/Section.astro` | ✅ stable |
| `SectionHeader` | `src/components/ui/SectionHeader.astro` | ✅ stable |
| `Button` | `src/components/ui/Button.astro` | ✅ stable |
| `Breadcrumbs` | `src/components/ui/Breadcrumbs.astro` | ✅ stable |
| `PageHero` | `src/components/ui/PageHero.astro` | ✅ image variant untested — no photography yet |
| `InPreparation` | `src/components/sections/InPreparation.astro` | ⚠️ temporary |

**Before building anything new, check this table.** Extend an existing
primitive rather than adding a near-duplicate.

---

## Known problems and open questions

| # | Item | Severity | Detail |
| --- | --- | --- | --- |
| 1 | Keyes logo is a placeholder | 🔴 high | Header, drawer and footer show a dashed "KEYES" box. Resolves itself the moment the real files land in `public/brand/`. `CONTENT_PENDING.md` 1.1–1.3. |
| 2 | No canonical URLs | 🟠 med | Suppressed on purpose while `site.urlConfirmed` is false. Flip it once the domain is confirmed. |
| 3 | Parent paths 404 | 🟠 med | `/properties/`, `/developments/`, `/resources/` have no index page — they were not in the specified route list. Nothing links to them (the nav points at leaf routes) but a typed URL will 404. **Decide with the client:** add index pages, or redirect to the first child. |
| 4 | Build logs a benign content warning | 🟢 low | `The collection "blog" does not exist or is empty` and `No files found matching …` — expected with zero posts. Disappears with the first article. |
| 5 | `PageHero` image variant unverified | 🟢 low | Built but never rendered with a real photograph. Re-check contrast over the scrim when imagery arrives. |
| 6 | Tailwind display-utility pitfall | 🟢 low | `.inline-flex` is emitted after `.hidden`, so `class="hidden xl:block"` passed into `Button`/`KeyesLogo` is silently ignored. Fixed in the header by using wrapper elements — **apply the same pattern everywhere.** |
| 7 | Team-name spelling | 🟠 med | Site uses "Closius"; the repository is `hoffman-clossius-real-estate`. Confirm before launch (`CONTENT_PENDING.md` 2.5). |
| 8 | No automated a11y/perf testing yet | 🟠 med | Structural checks (single `h1`, landmarks, skip link, title, description, lang, viewport across all 30 pages) and a computed contrast pass are done. Screen-reader, keyboard-path and Lighthouse passes still to come once real pages exist. |
| 9 | Gold on white is 2.4:1 | 🟢 low | By design — gold is ornament only. The wordmark ampersand is a logotype (SC 1.4.3 exempt). Do not extend gold to body text or links on light surfaces. |

---

## Next tasks

### Immediate — next session
1. **Build the homepage** (`/`). Hero, introduction to Martin and MaryEllen,
   the buy/sell/relocate paths, an honest listings placeholder, contact.
   Blocked on hero photography (`CONTENT_PENDING.md` 9.1) for the image
   treatment; the plain treatment can ship without it.

### Then, roughly in order
2. `/about/` and the two individual profiles — blocked on bios + portraits.
3. `/contact/` — blocked on the form destination and office address.
4. `/buy/` and `/sell/` overviews — buildable now, process copy only.
5. `/relocation/` — buildable once MaryEllen's service description arrives.
6. `/mortgage-calculator/` — buildable now; vanilla JS, estimates clearly
   labelled, no lending claims.
7. `/resources/buying-guide/` and `/selling-guide/` — blocked on copy.
8. `/faq/` — blocked on client-reviewed answers.
9. `/accessibility/`, `/privacy-policy/`, `/terms/` — blocked on legal wording.
10. `/communities/` and community guides — blocked on the priority list.
11. `/developments/new/` and `/existing/` — blocked on client material.
12. `/testimonials/` — blocked on real, attributable quotes.
13. `/blog/` index and article template — buildable ahead of the first post.
14. **IDX integration** — `/properties/*`, `/property/[slug]/`, `/login/`,
    `/register/`. Fully blocked on `CONTENT_PENDING.md` §5.

### Cross-cutting, before launch
- [ ] Real photography throughout; verify LCP and contrast over image scrims.
- [ ] Accessibility audit — axe, keyboard-only pass, screen reader pass,
      contrast check on every surface pairing.
- [ ] Lighthouse on the built output; confirm Core Web Vitals.
- [ ] Confirm domain, set `urlConfirmed: true`, regenerate `robots.txt`,
      verify the sitemap.
- [ ] Delete `StubPage.astro` and `InPreparation.astro` once no route uses them.
- [ ] Old-site redirect map.
- [ ] Cross-browser check: Safari (iOS + macOS), Chrome, Firefox, Edge.

---

## Session log

### Session 1 — 2026-08-21 · Project foundation
Repository was empty. Initialised Astro 7 + Tailwind 4, built the design token
system, the base layout architecture and all 32 routes as honest stubs, wrote
the three persistent documentation files. Build passes clean. Visual
verification done in Chromium at three viewport widths.

Fixed during the session: header overflow at 390 px; a lone "Home" breadcrumb
on the homepage; duplicate Keyes logo and Contact button caused by the Tailwind
display-utility ordering pitfall (see Known problems #6); a missing space in
the footer copy; four colour-contrast failures found by a computed pass over
every token pairing (`ink-subtle` on cream, outline-button borders, footer
column headings, and a gold focus ring that was only 2.4:1 on white).

Homepage deliberately **not** built — that is the next task.
