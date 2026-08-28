# FINAL_QA_REPORT.md

Quality-assurance pass over the whole project. **2026-08-27.**

Nothing below is asserted because a file exists. Every claim in the COMPLETED
section was produced by running the thing and reading what came back — 867
functional checks driving the built site in a real browser, plus the
accessibility, responsive and build suites.

**Nothing in this report has been filled in to look complete.** The four
"REQUIRES" sections are long because the work genuinely depends on information
and assets nobody has supplied, and inventing any of it is the one thing this
project forbids (`PROJECT_CONTEXT.md` §9).

---

## Test results

| Suite | Scope | Result |
| --- | --- | --- |
| Functional QA | 45 production routes — every route, header/footer link, CTA, dropdown, mobile nav | **327 passed, 0 failed** |
| Functional QA | 65 routes with demo content — as above, plus cards, filters, galleries | **467 passed, 0 failed** |
| Feature QA | Filtering, detail pages, developments, communities, blog, calculator, accordions, 3 forms, accounts, breadcrumbs, 404, legal | **73 passed, 0 failed** |
| Accessibility (axe-core + custom) | 45 routes × 2 widths | **0 violations · 653 checks** |
| Accessibility (axe-core + custom) | 65 routes × 2 widths, demo | **0 violations · 933 checks** |
| Responsive | 64 routes × 8 widths (360→1920) | **0 overflow · 0 image-ratio defects** |
| Build pipeline | `astro check` → unit tests → build → link check | **0 errors, 0 warnings, 0 hints · 17/17 tests · 45 pages · 0 dead links · 0 orphans** |

Two failures appeared in the first feature run. **Both were the test being
wrong, not the site** — recorded here because a QA report that hides its own
false starts is not worth much:

- The calculator returned `$0.00`. The down-payment field has a Percent/Dollars
  mode that defaults to Percent, and the test had typed `100000` into it —
  i.e. 100,000% down. Re-tested in both modes: `$500,000` at 6% over 30 years
  returns **$2,398** P&I from a 20% entry and from a `$100,000` entry
  identically, and the zero-rate case returns exactly `$1,000` rather than
  dividing by zero.
- A filter test reported "no change" because it drove the wrong `<select>`.
  Driven correctly, `beds=4` takes the demo set from **9 cards to 5** and
  writes `?beds=4` into the URL.

### Placeholder sweep

`href="#"`, `javascript:`, `TODO`, `FIXME`, `XXX`, `HACK`, lorem ipsum, fake
telephone numbers: **zero occurrences** in `src/`, `scripts/` or `tests/`.

One `example.com` exists, in a form validation message — *"Enter an email
address, like name@example.com."* That is the RFC 2606 reserved example domain
and is correct there. **Intentional.**

### Defects found and fixed in this pass

1. **Two unused modules asserting a convention nothing follows.**
   `src/lib/listings/index.ts` and `src/lib/developments/index.ts` were barrel
   files whose own comment read *"Import from here, not from files"* — and
   nothing imported them; every consumer imports the individual files. Deleted.
   The build proves they were dead.
2. **Two implementations of the same form control disagreed.** The mortgage
   calculator carries its own field class, which kept a 2px radius when the
   shared `FormField` moved to 4px in session 12. Matched.

### Finding recorded, deliberately not fixed

Session 12 claimed to have "reconciled radii throughout". It did not: it
changed the shared controls and card roots, which is **7 occurrences against
225** still using the 2px radius for panels, notices and badges. So cards and
buttons sit at 4px inside panels at 2px.

It is subtle, it is consistent *within* each group, and closing it means
touching 225 call sites — a visual change across every page, which is a
redesign and out of scope here. **Flagged for a decision rather than actioned:
either finish it or revert the 7.** Correcting the earlier overstatement is the
point.

---

## COMPLETED

### Pages — 45 in production, 65 with demo content
Every route returns 200, renders exactly one `<h1>`, carries breadcrumbs where
it should, and is reachable from navigation or in-content links (**0 orphans**).

Home · About + two profiles · Properties (for sale, for rent, our listings,
search) · Property detail · Developments (new, existing, detail) · Buy + Dream
Home Finder · Sell + Home Evaluation + Median Home Values · Communities index +
15 guides · Relocation · Testimonials · Mortgage Calculator · Journal index +
article template · Buying and Selling guides · FAQ · Contact · Accessibility ·
Privacy · Terms · Sign in · Create account · 404.

### Components
Verified by driving them, not by reading them:

- **Header dropdowns** — all 8 open on keyboard focus, all close on Escape,
  focus returns to the trigger. They also work with JavaScript disabled.
- **Mobile drawer** — opens, moves focus to the close button, contains focus
  while open (verified over 60 consecutive Tab presses), closes on Escape,
  returns focus, unlocks body scroll. Categories are native `<details>`.
- **Mobile action bar** — present below `xl`; the Call disclosure opens and
  offers **both** direct lines rather than picking an agent.
- **Property filtering** — reduces the set, writes to the URL, and a URL with
  filters is honoured on load. Sort and clear-all operate.
- **Property / development detail** — 200, one `<h1>`, price rendered,
  breadcrumbs present.
- **FAQ accordions** — 24, native `<details>`, start closed, open on click,
  work without JavaScript.
- **Three lead forms** — each surfaces an accessible error summary that takes
  focus and lists exactly its required fields (contact 5, home evaluation 6,
  dream home finder 3), and **none claims success**.
- **Mortgage calculator** — arithmetic correct in both entry modes, zero-rate
  handled, output labelled an estimate and stated not to be a lending quote.
- **Account pages** — no `<input type="password">` in any build mode;
  `/register/` states in the page that it does not create an account.

### Responsive behaviour
360, 390, 430, 768, 1024, 1280, 1440, 1920 — **no horizontal overflow and no
cropped or squashed image on any page at any width** (512 page-measurements).

### Accessibility work
**axe-core reports 0 violations** across both build modes at two widths, against
the WCAG 2.0/2.1/2.2 A + AA rulesets plus best-practice. Landmarks, one `<h1>`
per page, heading order, keyboard operation, focus management, contrast
(measured by painting the colour, not parsing it), reduced motion, 200% reflow,
labels, alt handling. Full method and limits in `ACCESSIBILITY_AUDIT.md`,
including what still needs a human.

### Technical SEO foundation
Unique title and description on all 45 routes · canonical on every indexable
page and deliberately absent on the three noindexed ones · Open Graph and
Twitter · `sitemap-index.xml` with 42 entries on the confirmed domain ·
`robots.txt` · breadcrumbs in markup and JSON-LD from one generator ·
structured data that returns `null` rather than invent (`WebSite`, `WebPage`,
`BreadcrumbList`, `RealEstateAgent`, `Person`; `BlogPosting`, `FAQPage` and
`RealEstateListing` wired and gated).

**Core Web Vitals:** CLS **0** on every page measured, FCP 116–236ms, 4–6
requests per page, 72.6 KB CSS, 27.6 KB JS across per-page chunks, three
self-hosted fonts with two preloaded, **zero third-party hosts**.

---

## REQUIRES CLIENT ASSETS

Nothing here can be substituted. Each has a defined drop-in point.

| Asset | Where it goes | What happens today |
| --- | --- | --- |
| **Official Keyes logo** (light + reversed) | `public/brand/keyes-logo.svg` and `-white.svg` | Header, drawer and footer show a neutral dashed image glyph — deliberately *not* a wordmark, so nothing approximates the trademark. `KeyesLogo.astro` picks the files up at build time with no code change. |
| Logo intrinsic dimensions | `brokerageBrand.width/.height` in `src/config/site.ts` | Aspect ratio is a placeholder until the file exists. |
| **Martin Hoffman — high-resolution portrait** | `professionals[0].portrait` in `src/config/site.ts` | Homepage, About, profile hero and agent cards all render the neutral placeholder. Portrait orientation (4:5) suits the slot. |
| **MaryEllen Closius — high-resolution portrait** | `professionals[1].portrait` | As above. |
| Joint photograph of the two of them | one `src` on the `/about/` hero MediaSlot | Neutral placeholder. **Never** a stock photograph of two other people. |
| **Property photography** | Arrives with the IDX feed | Every listing image is a placeholder; the gallery has never rendered because no listing has images. |
| **Community photography** (15) | `heroImage` per record in `src/data/communities.ts` | Cards render a light placeholder treatment and switch to the photographic dark treatment per community as images land. |
| Homepage hero photography | `heroImage` at the top of `HomeHero.astro` | One line, no other change. The right half of the hero at desktop widths is composed for it. |
| `apple-touch-icon.png` (180×180), `favicon.ico` | `public/` | A monogram `favicon.svg` exists; raster versions still need producing. |
| Developer imagery for developments | With written permission only | Nothing has been downloaded from any developer's site. |

---

## REQUIRES CLIENT CONFIRMATION

**None of this may be written on the client's behalf.**

| # | Item | Notes |
| --- | --- | --- |
| 8.1 / 8.2 | **Biography text** for Martin and MaryEllen | In their own words or approved by them. Set `professionals[].bio` to an array of paragraphs and the page renders it verbatim, replacing the neutral stand-in. |
| 8.5 | Areas of focus / specialities | A speciality is a claim about competence. Empty array renders nothing at all — not an empty band. |
| 4.1 / 4.2 | **Brokerage legal name and any required disclosure** | Verbatim, as the brokerage requires it. The footer renders them the moment `pending.legal` is populated. |
| 4.3 | **Florida licence numbers** for each professional | Nothing on the site claims a licence number. |
| 4.4 | Fair Housing / Equal Housing Opportunity / REALTOR® marks | Confirm whether required, and supply approved wording and artwork. |
| 2.1 | **Office address, if one is to be published** | Needed for the footer, `/contact/` and `LocalBusiness` structured data. Currently omitted everywhere rather than approximated — including from the JSON-LD. |
| 2.2 / 2.3 | Shared office phone, office hours | Only the two direct lines are confirmed. |
| 7.1–7.4 | **Social URLs** (Facebook, Instagram, LinkedIn, YouTube) | Footer icons and `sameAs` markup appear only when set. |
| 7.5 | **Google review link** | No review counts or ratings until supplied — and a rating is a separate decision (10.1d). |
| 7.6 | **Zillow profile / review link** | Same rule. |
| 10.1 | **Approved testimonials** | Real, attributable quotes with written permission to publish, each `verified: true`. **No sample testimonials in any environment**, including local development. |
| 4.7 / 4.8 | **Privacy policy and terms legal copy** | Both pages are built and render a clearly marked "awaiting legal review" slot. Paste approved text into `src/data/legal.ts`, set `approved: true`, and the placeholder disappears. Neither may be drafted by us. |
| 10.2 | FAQ answers — 24 drafted, **none reviewed** | Both `/faq/` and `/sell/` say so in public. Setting `reviewed: true` per answer also switches on `FAQPage` structured data automatically. |
| 10.5 | Community guide copy for 15 pages | No statistics, school ratings, crime figures, median values or superlatives without a citable, dated source. |
| 6.2 / 6.3 | Which form fields are required, and lead routing | Current choices are recorded for confirmation. Routing also governs the mobile Call button. |

---

## REQUIRES THIRD-PARTY INTEGRATION

| # | Integration | State | Reference |
| --- | --- | --- | --- |
| 1 | **IDX / MLS provider** | Not chosen. No credentials, no authorisation. Every listing page shows an honest "being configured" state. | `IDX_INTEGRATION.md` |
| 2 | **Live listings** | The whole contract is built: implementing `idxProvider.ts` is the integration — no component, page, filter or route changes. Includes the agent-ID → profile-path mapping, which **fails silently** if wrong. | `IDX_INTEGRATION.md` §4 |
| 3 | **Authentication** | No provider. `/login/` and `/register/` are provider-hosted by design; **this site never collects a password**, and `AuthProvider` has no method that accepts one. Two environment variables switch it on. | `AUTH_INTEGRATION.md` |
| 4 | **Saved searches** | Belongs to the account system. Today's "save property" is per-device `localStorage` only, and `/login/` says so plainly. | `AUTH_INTEGRATION.md` §7 |
| 5 | **Listing alerts** | Belongs to the account system. Until then `/register/` collects the details and Martin and MaryEllen set alerts up by hand. | `AUTH_INTEGRATION.md` §6 |
| 6 | **Valuation API** (if wanted) | Seam exists in `src/lib/valuation/`; nothing connected and no figure published. Every figure requires a source and a date — both are required fields. **Never to be described as artificial intelligence.** | `CONTENT_PENDING.md` 10.7 |
| 7 | **Form delivery endpoint** | **The single highest-value item outstanding.** One environment variable (`PUBLIC_LEAD_FORM_ENDPOINT`) plus a rebuild switches all five forms from the honest fallback to real delivery. No code change. | `CONTENT_PENDING.md` 6.1 |
| 8 | Map provider | Locations are stated in words; no pin is plotted. | 11.4 |
| 9 | Analytics / cookie consent | None installed. The privacy page currently states, truthfully, that nothing tracks a visit. Adding analytics changes that sentence. | 11.1 / 11.2 |

---

## SEO PHASE STILL TO DO

The technical foundation is built. **The strategy is not started** — full scope
in `SEO_PHASE_2.md`.

- **Keyword research** — terms the team is actually asked, mapped one term to
  one page.
- **Location expansion** — which cities and neighbourhoods warrant more than a
  community guide.
- **Community optimisation** — the 15 guides are the largest content
  opportunity and the largest risk: no statistic without a cited, dated source.
- **Metadata strategy** — titles are clean and descriptive today. Optimisation
  happens against Search Console data, not guesses. The `seo` objects on every
  community and post are reserved and empty.
- **Content strategy** — a sustainable editorial calendar. Articles are
  written, never generated.
- **Redirects** — `LEGACY_REDIRECTS.md`. **The most time-bound item in the
  project**: the old site's URL inventory, Search Console history and server
  logs all disappear with the old site, and a map built from assumptions fails
  invisibly because a wrong 301 still returns 200.
- **Google Search Console + Bing Webmaster Tools** — verify, submit the
  sitemap, and **export a traffic baseline before launch**; afterwards there is
  nothing to compare against.
- **Local SEO / Google Business Profile** — blocked on the office address, and
  on whether one is published at all.

---

## PRODUCTION LAUNCH CHECKLIST

### Blocking — the site should not go live without these

- [ ] `PUBLIC_LEAD_FORM_ENDPOINT` set in the host's build environment, and a
      test submission received end-to-end
- [ ] Keyes logo files supplied and rendering (light + reversed)
- [ ] Brokerage legal name and any required footer disclosure in place
- [ ] Privacy policy and terms text approved and published
- [ ] Apex domain 301s to `https://www.hoffmanandclosius.com`, and http → https
- [ ] Redirect map complete and **tested against the live list before DNS
      switches** (`LEGACY_REDIRECTS.md`)
- [ ] Traffic baseline exported from the existing site

### Before launch

- [ ] Portraits and homepage photography supplied
- [ ] Biographies supplied and published
- [ ] FAQ answers reviewed (also switches on `FAQPage` markup)
- [ ] Licence numbers and Fair Housing marks confirmed and placed
- [ ] Social and review URLs added, or confirmed as not wanted
- [ ] Decide whether demo content is disabled — it is off in a production build
      by default; confirm `PUBLIC_DEMO_CONTENT` is not set to `true` on the host
- [ ] `npm run build` green on the deployment host, not only locally
- [ ] Upload the **contents** of `dist/`, not the folder

### Launch day

- [ ] DNS switched, HTTPS certificate valid on both apex and `www`
- [ ] Spot-check redirects from the top 20 old URLs
- [ ] Submit `sitemap-index.xml` to Search Console and Bing
- [ ] Confirm `robots.txt` resolves and is not blocking the site
- [ ] Submit a real enquiry through each of the five forms and confirm receipt
- [ ] Test both phone links and both email links from a phone

### First month

- [ ] Search Console Coverage checked weekly; compare Performance against the
      pre-launch baseline
- [ ] Watch for 404s in host logs — they are the redirect map's misses
- [ ] Independent accessibility audit and assistive-technology user testing
      (`ACCESSIBILITY_AUDIT.md` §5)
- [ ] Delete the two sample journal posts once the first real article publishes
- [ ] Delete `src/lib/listings/demoData.ts` and `demoProvider.ts` once the IDX
      feed is live
