# BUILD_PROGRESS.md

Living record of what exists, what is broken and what comes next.
**Update this file at the end of every session.**

Last updated: **2026-08-24** — Session 3 (homepage)

---

## Current state

Foundation, global chrome and **the complete homepage** are built.

Every other route still renders a hero plus an honest "in preparation" band.

| Metric | Value |
| --- | --- |
| Build | ✅ passing — `astro check`: 0 errors, 0 warnings, 0 hints |
| Pages generated | 36 static HTML pages |
| Internal links | ✅ all resolve (`npm run verify:links`, wired into `npm run build`) |
| Tests | ✅ 14/14 homepage · 21/21 navigation · 5/5 with JavaScript disabled |
| Homepage weight | ~123 KB HTML (15 KB gzipped), 54 KB CSS (10 KB gzipped) |
| JavaScript | ~5 KB total, inlined, no dependencies |
| Third-party runtime requests | none |

---

## ✅ Completed — Session 3 (2026-08-24) · Homepage

Twelve sections, composed in `src/pages/index.astro`. Each owns its own data,
so nothing in the page needs to change when the MLS feed, photography or first
article arrives.

| # | Section | Component | State without client data |
| --- | --- | --- | --- |
| 1 | Hero | `HomeHero` | Abstract media placeholder; one line sets the photo |
| 2 | Property search | `PropertySearch` | Fully working — routes criteria to `/properties/search/` |
| 3 | Featured properties | `FeaturedListings` | Demo records in dev; honest empty state in production |
| 4 | Meet Martin & MaryEllen | `AgentsSection` + `AgentCard` | Portrait slots; role-descriptive intros only |
| 5 | Buy / Sell | `BuySellPanels` | Complete |
| 6 | Explore South Florida | `CommunitiesGrid` | Complete — six communities, data-driven |
| 7 | New Developments | `DevelopmentsPreview` | Honest empty state; **no demo counterpart** |
| 8 | Home valuation | `HomeValuationCta` | Complete — routes the address, never estimates |
| 9 | Testimonials | `TestimonialsSection` | Neutral shell; **verified quotes only, ever** |
| 10 | Relocation | `RelocationSection` | Complete |
| 11 | Insights | `InsightsSection` | Honest empty state until the first article |
| 12 | Final CTA | `FinalCta` | Complete |

### Demo content layer
- [x] `src/config/flags.ts` — one flag: ON in dev, OFF in production builds,
      overridable with `PUBLIC_DEMO_CONTENT`. `npm run build:demo` gives a
      populated build for design review.
- [x] `src/data/demo/listings.demo.ts` — six records, every one typed
      `isDemo: true` with a `DEMO-` reference, empty `images`, and a header
      stating plainly that none of it is real. Nothing scraped.
- [x] `src/lib/content.ts` — the one place that decides real vs demo vs empty.
      **Real data always wins.**
- [x] `<DemoNotice>` on the section and a "Sample" badge on every card, so demo
      content cannot be mistaken for inventory in a screenshot.
- [x] Verified: a production build contains **zero** occurrences of `DEMO-`,
      "Sample properties" or any demo address.
- [x] Testimonials and developments are deliberately excluded from the
      mechanism — see PROJECT_CONTEXT.md §8.

### Imagery
- [x] `MediaSlot` — every image position on the site. Renders a responsive,
      layout-stable `<img>` with a `src`, and a neutral abstract placeholder
      without one. Never a stock photo or a borrowed picture.
- [x] Aspect ratio always reserved, so nothing shifts when an image loads.

### Forms that actually go somewhere
- [x] Search and valuation forms submit real criteria as query parameters.
- [x] `QueryEcho` + `src/lib/query-echo.ts` read them back on the destination
      page and show what was received, with prices formatted. No fabricated
      results, and no estimated value is ever generated.
- [x] `StubPage` gained a slot so a stub can carry real functionality.

### New components
`MediaSlot`, `ListingCard`, `AgentCard`, `DemoNotice`, `QueryEcho`, plus the
twelve homepage sections in `src/components/home/`.

**Four bugs found by testing** — see the session log.

---

## ✅ Completed — Session 2 (2026-08-24) · Global chrome

### Header
- [x] Rebuilt as three desktop rows — evergreen utility bar (both direct lines,
      social slot, Contact, account links), a spacious white brand row
      (wordmark · **Keyes logo, prominent** · Search Homes), and a nav row.
- [x] **Sticky after scrolling**: the utility and brand rows scroll away and
      the nav row pins to the top, taking a subtle shadow and revealing a
      condensed Keyes logo + Search Homes call to action.
- [x] Navigation restructured to the specified map — Home, Properties,
      Developments, Buy, Sell, Communities (7 entries, two columns),
      About, Resources (6 entries, two columns), Contact.
- [x] Dropdown panels right-align for the last groups so none can overflow the
      viewport edge.
- [x] Compact sticky bar below xl: wordmark · Keyes logo · menu button.

### Mobile navigation
- [x] Drawer rebuilt rather than shrunk — quick-action tiles (Search Homes /
      Home Value), then an **exclusive accordion** (`<details name="mobile-nav">`)
      so only one category is open at a time, nested links set off by a hairline
      rule, then both agents' direct contacts, social slot and account links.
- [x] **Sticky mobile action bar**: Call · Search · Home Value · Contact, with
      `aria-label`s that read as full sentences. The footer absorbs its height
      so nothing is trapped behind it at the bottom of the page.
- [x] **Call** opens a chooser listing both agents rather than dialling one of
      them — there is no confirmed shared number and lead routing is unconfirmed
      (`CONTENT_PENDING.md` 2.2 / 6.3).

### Footer
- [x] Rebuilt as a substantial four-column footer: identity, Keyes logo, both
      agents' full contacts, and Properties / Services / Explore / Legal columns.
- [x] **"Accessibility / ADA Compliance"** in the Legal column and the bottom
      legal row, plus a compact accessibility note naming WCAG 2.2 AA and
      inviting reports. **No compliance or certification is claimed** — verified
      by scanning the built output.
- [x] Dynamic copyright year. No "Powered by" vendor line.
- [x] Fair Housing / brokerage disclosure renders automatically once
      `pending.legal` is populated; nothing invented meanwhile.

### Keyes logo
- [x] Placeholder replaced with a **neutral graphic** — a generic image glyph in
      a dashed slot. The previous placeholder set the word "Keyes" as styled
      text, which approximated the trademark; it no longer does.
- [x] The image slot is documented in the component header, `docs/keyes-logo.md`
      and `CONTENT_PENDING.md`. Dropping the real file in swaps it with no code
      change.

### New components
- [x] `SocialLinks` — icon row that renders **nothing** until a URL is confirmed.
- [x] `MobileActionBar` — the sticky bottom bar.

### Routes
- [x] Six community pages added so every navigation link resolves: Hollywood,
      Fort Lauderdale, Dania Beach, Hallandale Beach, Pembroke Pines, Aventura.
      Each carries only a verifiable locational one-liner — see
      `CONTENT_PENDING.md` 10.5.

### Verification
- [x] `scripts/verify-links.mjs` — walks the built output *and* the navigation
      config and fails on any dead link. Wired into `npm run build`.
- [x] 21 behavioural checks in Chromium at 390 / 1440 px: dropdown open/close,
      `aria-expanded`, Escape, focus return, one-panel-at-a-time, no overflow,
      sticky pinning, drawer focus trap, exclusive accordion, Call disclosure,
      action-bar clearance.
- [x] 5 checks with **JavaScript disabled**: dropdowns still open on keyboard
      focus, no content hidden, footer still exposes the full sitemap.

**Three bugs found and fixed by that testing** (see Session log).

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
| `Header` | `src/components/layout/Header.astro` | ✅ stable — rebuilt in session 2 |
| `Footer` | `src/components/layout/Footer.astro` | ✅ stable — rebuilt in session 2 |
| `MobileActionBar` | `src/components/layout/MobileActionBar.astro` | ✅ stable — new in session 2 |
| `SocialLinks` | `src/components/layout/SocialLinks.astro` | ✅ stable — renders nothing until URLs are confirmed |
| `KeyesLogo` | `src/components/layout/KeyesLogo.astro` | ⚠️ neutral graphic placeholder until the asset arrives |
| `Wordmark` | `src/components/layout/Wordmark.astro` | ✅ stable |
| `Container` | `src/components/ui/Container.astro` | ✅ stable |
| `Section` | `src/components/ui/Section.astro` | ✅ stable |
| `SectionHeader` | `src/components/ui/SectionHeader.astro` | ✅ stable |
| `Button` | `src/components/ui/Button.astro` | ✅ stable |
| `Breadcrumbs` | `src/components/ui/Breadcrumbs.astro` | ✅ stable |
| `PageHero` | `src/components/ui/PageHero.astro` | ✅ image variant untested — no photography yet |
| `MediaSlot` | `src/components/ui/MediaSlot.astro` | ✅ stable — every image position goes through it |
| `ListingCard` | `src/components/ui/ListingCard.astro` | ✅ stable — reuse for search results and listing indexes |
| `AgentCard` | `src/components/ui/AgentCard.astro` | ✅ stable — reuse on /about/ |
| `DemoNotice` | `src/components/ui/DemoNotice.astro` | ✅ stable — dev-only by construction |
| `QueryEcho` | `src/components/ui/QueryEcho.astro` | ✅ stable |
| Homepage sections | `src/components/home/*.astro` | ✅ stable — twelve sections |
| `InPreparation` | `src/components/sections/InPreparation.astro` | ⚠️ temporary |

**Before building anything new, check this table.** Extend an existing
primitive rather than adding a near-duplicate.

---

## Known problems and open questions

| # | Item | Severity | Detail |
| --- | --- | --- | --- |
| 1 | Keyes logo is a placeholder | 🔴 high | Header, drawer and footer show a **neutral dashed image-glyph slot** — deliberately not a wordmark, so nothing approximates the trademark. Resolves itself the moment the real files land in `public/brand/`. `CONTENT_PENDING.md` 1.1–1.3. |
| 2 | No canonical URLs | 🟠 med | Suppressed on purpose while `site.urlConfirmed` is false. Flip it once the domain is confirmed. |
| 3 | Parent paths 404 | 🟠 med | `/properties/`, `/developments/`, `/resources/` have no index page — they were not in the specified route list. Nothing links to them (verified by `verify:links`; the nav points at leaf routes) but a typed URL will 404. **Decide with the client:** add index pages, or redirect to the first child. |
| 4 | Build logs a benign content warning | 🟢 low | `The collection "blog" does not exist or is empty` and `No files found matching …` — expected with zero posts. Disappears with the first article. |
| 5 | `PageHero` image variant unverified | 🟢 low | Built but never rendered with a real photograph. Re-check contrast over the scrim when imagery arrives. |
| 6 | Tailwind display-utility pitfall | 🟢 low | `.inline-flex` is emitted after `.hidden`, so `class="hidden xl:block"` passed into `Button`/`KeyesLogo` is silently ignored. Responsive visibility goes on a **wrapper element** — apply that pattern everywhere. (Alignment utilities like `self-start` are safe to pass through.) |
| 7 | Team-name spelling | 🟠 med | Site uses "Closius"; the repository is `hoffman-clossius-real-estate`. Confirm before launch (`CONTENT_PENDING.md` 2.5). |
| 8 | No automated a11y/perf testing yet | 🟠 med | Structural checks (single `h1`, landmarks, skip link, title, description, lang, viewport across all 30 pages) and a computed contrast pass are done. Screen-reader, keyboard-path and Lighthouse passes still to come once real pages exist. |
| 9a | Four homepage sections are empty in production | 🟠 med | Featured properties, developments, testimonials and insights all show empty states until their data arrives. Each carries a distinct, useful call to action, and this is the honest state — but the page is visibly lighter than it will be. `npm run build:demo` shows the populated design. |
| 9b | Homepage has no photography | 🔴 high | Fourteen media placeholders. The design is built around real imagery and reads flat without it. `CONTENT_PENDING.md` §9. |
| 9 | Gold on white is 2.4:1 | 🟢 low | By design — gold is ornament only. The wordmark ampersand is a logotype (SC 1.4.3 exempt). Do not extend gold to body text or links on light surfaces. |

---

## Next tasks

### Immediate — next session
1. **`/about/` and the two profile pages.** `AgentCard` and `MediaSlot` are
   already built and reusable. Blocked on biographies and portraits
   (`CONTENT_PENDING.md` 8.1–8.3) for the copy; the layout can be built now.

### Then, roughly in order
2. `/contact/` — blocked on the form destination and office address.
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

### Session 2 — 2026-08-24 · Global header, navigation and footer
Rebuilt the whole global chrome: three-row desktop header with the Keyes logo
given real prominence, the specified nine-group navigation, a rebuilt mobile
drawer, a new sticky mobile action bar, and a substantial four-column footer
carrying "Accessibility / ADA Compliance". Added `SocialLinks` and
`MobileActionBar`, six community routes, and `scripts/verify-links.mjs`.

Three real bugs were found by testing rather than by reading the code:

1. **The sticky header never stuck.** A `position: sticky` child can only stick
   inside its parent's box, and the `<header>` box was only as tall as its rows
   — so the nav row scrolled away with it. (This dated from session 1 and had
   never been verified.) The `<header>` itself now sticks, pulled up by exactly
   the measured height of the rows above the pinning one.
2. **Two dropdowns could sit open at once**, because `:focus-within` stays true
   after a mouse click on a trigger. Worse, the same thing meant **Escape could
   not actually close a menu** — closing returns focus to the trigger, which
   immediately reopened it. Open state now lives in `[data-open]` on the group,
   managed by the script; the CSS-only `:focus-visible` fallback is scoped to a
   nav the script has *not* enhanced, so keyboard users keep working with no
   JavaScript and Escape works when there is.
3. **The logo placeholder stretched to full width** inside flex-column parents
   and **clipped its own label** at small sizes.

Also corrected: a missing space around the footer's WCAG note, and the previous
"KEYES" text placeholder, which approximated the trademark as styled type.

### Session 3a — 2026-08-24 · GitHub Pages preview
Added `.github/workflows/preview.yml` so the site can be reviewed at a URL
before it goes to Hostinger. It replaces GitHub's built-in Pages workflow,
which was failing: that one runs Jekyll over the repository root, and Jekyll
reads the `---` fences in `.astro` files as YAML front matter. Nothing was
wrong with the site — **the repository owner must switch Settings → Pages →
Source to "GitHub Actions"** for the new workflow to take over.

`make-portable.mjs` gained a `--base=/prefix` mode for hosting at a known
subpath, which is what Pages project sites are. Absolute-with-prefix rather
than relative, because `404.html` is served for arbitrary depths and relative
asset paths break under it. Verified by serving the output at a subpath and
rendering it: styles, fonts, navigation and the 404 page all resolve.

Two bugs caught before pushing, both by running the workflow's own steps
locally first:

1. **The workflow YAML was invalid.** `run: printf 'User-agent: *…'` — YAML
   read the colon inside the string as a second mapping key.
2. **The demo build shipped three dead links.** Listing cards link to
   `/property/<slug>/`, but that route generated pages from real listings only,
   so the demo cards pointed at pages that were never built. Route generation
   now uses the same resolver the cards use. `npm run verify:links` catches
   this class of mistake, which is why it runs in the workflow.

### Session 3 — 2026-08-24 · Homepage
Built all twelve homepage sections plus the demo-content layer, `MediaSlot`,
`ListingCard`, `AgentCard`, `DemoNotice` and `QueryEcho`. The search and
valuation forms now carry real criteria to their destination pages, which read
them back.

Four bugs found by testing rather than by reading the code:

1. **SVG gradient ids collide across the document.** Every `MediaSlot` defined
   its wash as an SVG `<linearGradient>` with an id derived from its seed — and
   SVG ids are document-global, so the first definition won for every slot
   sharing that id. Light listing cards rendered with the hero's dark palette,
   and the evergreen Buy panel rendered pale. The wash is now a CSS gradient
   with no `<defs>` at all.
2. **117px of horizontal overflow on a 390px phone.** The community card passed
   `absolute inset-0` into `MediaSlot`, which sets its own `position: relative`;
   the two fought and the grid item sized itself from the slot's aspect ratio
   instead of the track. The slot is now wrapped in a positioned element, the
   pattern `HomeHero` already used.
3. **Portrait slots ran to 800px tall** in the two-column agent grid and swamped
   the copy. Capped.
4. **Placeholder text at 3.66:1** in the valuation address field, and the search
   inputs left on the browser's default placeholder grey, which sits right on
   the 4.5:1 line. Both raised and re-verified.

Also corrected: a missing space in the demo notice, hero copy that claimed
experience we cannot evidence, and the Buy/Sell panels floating in a white band
instead of running full-bleed.
