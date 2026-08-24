# PROJECT_CONTEXT.md

**Permanent rules for the Hoffman & Closius website.**
Read this file *and* `BUILD_PROGRESS.md` at the start of every session, before
writing any code. Nothing in this file may be changed without the client's
instruction.

---

## 1. Client identity

**Hoffman & Closius** — a two-person South Florida real estate team.

| | |
| --- | --- |
| Team name | Hoffman & Closius |
| Tagline used on site | South Florida Real Estate |
| Service area | Broward, Palm Beach and Miami-Dade counties |

### Primary professionals

**Martin Hoffman P.A.**
Broker-Associate
Phone `954-605-4823` · Email `MartinHoffman@keyes.com`

**MaryEllen Closius P.A.**
Realtor Associate | Relocation Specialist
Phone `954-471-4626` · Email `MaryEllenC@keyes.com`

These are the **only** confirmed facts about the people. Everything else about
them — biography, photograph, licence number, years in the business, awards,
transaction history, designations, languages — is **unknown** and must not be
written, inferred or filled in with plausible-sounding text.

---

## 2. Confirmed contact information

Stored once, in `src/config/site.ts`, under `professionals`. Import from there.
Never retype a phone number or email address into a component.

```ts
import { professionals, getProfessional } from '@config/site';
```

There is **no confirmed office address, office phone, office hours, social
profile, review URL or website domain.** See `CONTENT_PENDING.md`.

---

## 3. Branding direction

Premium South Florida real estate. Highly professional, elegant, eye-catching.
Luxury **without** pretension. Editorial rather than templated.

- Primarily **green and white**, with generous white space.
- **Small, restrained gold accents** only — a hairline rule, an ampersand, a
  single call to action. Gold is never a large surface and never body text.
- Strong property photography, given room to breathe.
- Elegant editorial typography.
- Premium micro-interactions: slow, small, purposeful. No bounce, no parallax
  gimmicks, nothing that fires more than once.
- Excellent mobile UX is a requirement, not an afterthought.
- It must not read as a generic real-estate template.

### Palette (canonical — defined in `src/styles/tokens.css`)

| Role | Hex | Token |
| --- | --- | --- |
| Deep evergreen (primary) | `#063F35` | `--color-evergreen-800` |
| White | `#FFFFFF` | `--color-surface` |
| Warm off-white | `#F7F6F2` | `--color-cream-100` |
| Soft sage | `#E8EFEA` | `--color-evergreen-100` |
| Charcoal (body ink) | `#1C2522` | `--color-charcoal-700` / `--color-ink` |
| Gold accent | `#C9A34A` | `--color-gold-500` |

Ramps around each of these exist in `tokens.css`. **Do not introduce arbitrary
hex values in components** — add a token first if a genuinely new value is
needed.

### Typography

| Use | Family | Fallbacks |
| --- | --- | --- |
| Display + headings | Cormorant Garamond (variable) | Garamond, Iowan Old Style, Times New Roman, serif |
| Interface + body | Inter (variable) | system UI stack, Helvetica, Arial, sans-serif |

Both are **self-hosted**, latin subset only, in `public/fonts/`, declared in
`src/styles/fonts.css` and preloaded in `BaseLayout`. There are no third-party
font requests at runtime. Do not add Google Fonts links.

---

## 4. Keyes logo requirements

The Keyes logo appears **prominently in the global site header** and again in
the footer.

### Hard rules

1. **Never modify the logo.** No recolouring, redrawing, stretching, cropping,
   rotating, drop shadows, gradients, outlines or decorative frames. Only the
   rendered height varies; the aspect ratio is always preserved.
2. **Never write relationship wording anywhere on the site.** Specifically
   forbidden: "affiliated with Keyes", "backed by Keyes", "working under
   Keyes", "proudly affiliated with Keyes", "part of Keyes", and any
   paraphrase of them. The logo stands on its own with no explanation.
3. The logo is rendered only through `src/components/layout/KeyesLogo.astro`.
   Do not inline `<img src="/brand/...">` anywhere else.

### Asset status

The official files have **not been supplied yet**. Expected paths:

| File | Used on |
| --- | --- |
| `public/brand/keyes-logo.svg` | Light backgrounds (header, drawer) |
| `public/brand/keyes-logo-white.svg` | Evergreen backgrounds (footer) |

`.png` / `.webp` are accepted fallbacks. `KeyesLogo.astro` probes for these
files at build time and switches from its visible placeholder to the real asset
automatically — no code change required. After adding the files, set
`brokerageBrand.width` / `.height` in `src/config/site.ts` to the asset's true
intrinsic dimensions. Details in `docs/keyes-logo.md`.

---

## 5. Site architecture

Routes are defined by files in `src/pages/`. Menu placement is defined **only**
in `src/config/navigation.ts` — pages never declare their own nav position.

```
/                                 Home
/about/                           About the team
/about/martin-hoffman/            Martin Hoffman P.A.
/about/maryellen-closius/         MaryEllen Closius P.A.
/properties/for-sale/             For-sale results (IDX)
/properties/for-rent/             Rental results (IDX)
/properties/our-listings/         Team's own listings (IDX, filtered)
/properties/search/               Search interface (IDX)
/property/[slug]/                 Property detail          — dynamic
/developments/new/                New construction index
/developments/existing/           Established communities index
/developments/[slug]/             Development detail       — dynamic
/buy/                             Buying overview
/buy/dream-home-finder/           Buyer preferences form
/sell/                            Selling overview
/sell/home-evaluation/            Valuation request form
/sell/median-home-values/         Median values, each with a cited source
/communities/                     Community guide index
/communities/[slug]/              Community guide          — dynamic
/relocation/                      Relocation
/testimonials/                    Client testimonials
/mortgage-calculator/             Client-side calculator
/blog/                            Journal index
/blog/[slug]/                     Journal article          — dynamic
/resources/buying-guide/          Buying guide
/resources/selling-guide/         Selling guide
/faq/                             FAQ
/contact/                         Contact
/accessibility/                   Accessibility statement
/privacy-policy/                  Privacy policy
/terms/                           Terms of use
/login/                           Sign in    (noindex)
/register/                        Create account (noindex)
404                               Not found  (noindex)
```

`trailingSlash: 'always'` and `build.format: 'directory'` — every internal link
must end with a slash (`/about/`, not `/about`).

### Folder layout

```
public/
  brand/      Keyes logo assets (client-supplied)
  fonts/      Self-hosted woff2, latin subset
  images/     Photography
src/
  components/
    layout/   Header, Footer, KeyesLogo, Wordmark
    sections/ Composed page sections
    ui/       Primitives: Container, Section, SectionHeader, Button,
              Breadcrumbs, PageHero
  config/     site.ts (identity + confirmed data), navigation.ts (menus)
  content/    Markdown content collections (blog)
  data/       Typed data modules — all intentionally empty, see §8
  layouts/    BaseLayout, StubPage
  lib/        cn, format, reveal, header — small helpers, no framework
  pages/      Routes
  styles/     tokens.css, fonts.css, global.css
scripts/      make-portable.mjs (post-build relative-URL rewrite)
docs/         Authoring notes
```

---

## 6. Technical stack

| | |
| --- | --- |
| Framework | Astro 7, `output: 'static'` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, tokens in `@theme` |
| Scripting | Vanilla TypeScript, ~3.6 KB total, inlined at build |
| Content | Astro content collections (Markdown) for the journal |
| Sitemap | `@astrojs/sitemap` |
| **No React**, no Vue, no Svelte, no jQuery, no UI kit, no animation library. | |

### Commands

| Command | Effect |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `astro check` then `astro build` → `dist/` |
| `npm run build:fast` | Build without the type check |
| `npm run build:portable` | Build, then rewrite `dist/` URLs to relative so `dist/index.html` opens straight off the filesystem |
| `npm run preview` | Serve `dist/` |

`dist/` is plain static HTML/CSS/JS. It deploys to any static host, and after
`build:portable` it also runs by opening `dist/index.html` directly.

### Conventions

- Path aliases: `@components/*`, `@layouts/*`, `@config/*`, `@data/*`,
  `@lib/*`, `@styles/*`, `@/*`.
- `npm run build` must pass with **0 errors and 0 warnings** from `astro check`.
- **Tailwind display-utility pitfall:** Tailwind emits `.inline-flex` *after*
  `.hidden`, so passing `class="hidden xl:block"` into a component whose base
  classes already set a display (`Button`, `KeyesLogo`) silently does nothing.
  Put responsive visibility on a **wrapper element** instead.

---

## 7. Accessibility requirements

Target: **WCAG 2.2 Level AA**.

- **Never claim the site is "ADA certified", "ADA compliant" or "WCAG
  certified".** No such certification exists. The accessibility statement
  describes the standard the site is *built toward* and how to report a
  barrier.
- Every page: one `<h1>`, headings in order, landmarks (`header`, `nav`,
  `main`, `footer`), a working skip link.
- Visible focus on every interactive element. The ring colour is the
  `--focus-ring` variable: deep evergreen on light surfaces (11.9:1 on white),
  flipping to `gold-300` on any element carrying `data-surface="dark"`
  (7.2:1 on evergreen). **Add `data-surface="dark"` to every new deep-evergreen
  band**, or focus will be invisible there. Never remove an outline without
  replacing it.
- Colour contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and for borders
  that identify a control.
  - Gold `#C9A34A` is **2.4:1 on white** — never body text, never a link, never
    a focus ring on a light surface. It is for hairline rules, ornament, the
    brand ampersand in the wordmark (a logotype, and therefore exempt under
    SC 1.4.3) and text on dark evergreen (`gold-300`, 7.2:1).
  - Use `--color-line` for decorative dividers, but `--color-line-control`
    (3:1) for input, select and outline-button borders.
  - Verified pairings: ink 15.7:1 · ink-muted 7.8:1 · ink-subtle 4.7:1 on
    white and 4.9:1 on cream · evergreen-800 11.9:1 · white/70 on
    evergreen-800 6.6:1. `white/50` on evergreen is 4.2:1 — too low for body
    text; `white/55` is the floor.
- Touch targets ≥ 44×44 px.
- Images carry meaningful `alt`; decorative images use `alt=""`.
- Forms: real `<label>` elements, `aria-describedby` for hints and errors,
  errors announced, never colour alone.
- Menus and dialogs: `aria-expanded`, `Escape` closes, focus returns to the
  trigger.
- Honour `prefers-reduced-motion` — already handled globally; do not add
  animation that bypasses it.
- The site must work with JavaScript disabled: the desktop menus open on
  hover/focus in pure CSS, and the drawer's links are duplicated in the footer.

---

## 8. Data and integration constraints

Every data module in `src/data/` is **intentionally empty**. That is the
correct state until the client confirms the corresponding source.

- **No MLS/IDX data exists yet.** Listings, prices, addresses, photographs,
  square footage and MLS numbers come from the client's IDX provider once
  confirmed (`CONTENT_PENDING.md`).
- **Never scrape MLS, Zillow, Realtor.com, Redfin or a competitor site.**
- **Never write sample, demo or "representative" listings**, not even as
  placeholder markup — this is a live real estate site and fabricated listing
  data is a legal problem, not a design one.
- Pages consuming empty data must render an honest empty state.
- Forms are not wired up until the destination endpoint is confirmed. A form
  that silently discards an enquiry is worse than no form.
- Community and market figures are published **only with a cited source and a
  date**.

---

## 9. Rule against inventing facts

Do not write, imply or "placeholder in" any of the following:

- Awards, rankings, production volume, transaction counts, sales totals,
  "top 1%" claims, years of experience, team size.
- Designations or certifications (CRS, GRI, ABR, CLHMS, …).
- Testimonials, client names, review text, star ratings, review counts.
- Google or Zillow statistics of any kind.
- An office address, suite number, office hours or a shared office phone.
- Licence numbers, brokerage legal names or legal disclosure wording.
- Biographies, personal history, education, languages spoken, specialities
  beyond the two confirmed titles.
- Market statistics, median values, forecasts or neighbourhood claims without
  a citable, dated source.

If a section needs one of these and it has not been supplied: **leave it out,
and add a line to `CONTENT_PENDING.md`.** An honest gap ships; a plausible
invention does not.

**Placeholders:** allowed only where a page genuinely cannot be built without
one. Every placeholder must be (a) obviously a placeholder to a reader,
(b) recorded in `CONTENT_PENDING.md`, and (c) never phrased as a factual claim
about the client. No lorem ipsum in any visible, production-facing section.

---

## 10. Rule against overwriting completed work

1. Read `PROJECT_CONTEXT.md` and `BUILD_PROGRESS.md` before starting.
2. **Inspect existing components before creating new ones.** If a primitive
   already covers the need, extend it rather than adding a near-duplicate.
3. **Preserve completed functionality.** A page marked complete in
   `BUILD_PROGRESS.md` is not to be rewritten as a side effect of another task.
4. **Do not rewrite the project when one component needs changing.** Scope the
   diff to the thing being asked for.
5. Changing a shared primitive (`Button`, `Section`, `BaseLayout`, tokens)
   affects every page — check the call sites before and after.
6. Update `BUILD_PROGRESS.md` at the end of every session: what was completed,
   what changed, what broke, what is next.
7. Never delete an entry from `CONTENT_PENDING.md` because it is inconvenient;
   remove it only when the client has actually supplied the information.

---

## 11. Performance

- Optimise for Core Web Vitals. Ship no JavaScript a page does not need.
- Images: correct intrinsic `width`/`height`, `loading="lazy"` below the fold,
  `fetchpriority="high"` on the LCP image only, modern formats.
- Fonts are preloaded and subset; do not add faces or weights casually.
- Keep the global CSS bundle lean — prefer tokens and utilities over one-off
  rules.
- Every page must work on mobile, tablet and desktop.
