# ACCESSIBILITY_AUDIT.md

Full-site accessibility audit of the Hoffman & Closius website.

**Audited:** 2026-08-27 · **Target:** WCAG 2.2 Level AA
**Scope:** every route in both build modes — 45 pages in a production build,
65 with demo content on — at 1440px and 390px, plus a 640px reflow pass.

> **This is not a conformance claim.** It records what was checked, by whom,
> with what tools, and what remains untested. The site has **not** been audited
> by an independent accessibility specialist and has **not** been tested with
> people who use assistive technology daily. Neither automated tooling nor a
> sighted developer's keyboard pass substitutes for either. Nothing on the site
> claims ADA certification, ADA compliance or WCAG conformance, and nothing
> may be worded to imply them (`PROJECT_CONTEXT.md` §7).

---

## 1. Result

| Pass | Scope | Result |
| --- | --- | --- |
| axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) | 45 routes × 2 widths | **0 violations** |
| axe-core, same rulesets | 65 routes × 2 widths, demo content on | **0 violations** |
| Structural / behavioural checks (below) | 45 routes production | **653 passed, 0 failed** |
| Structural / behavioural checks | 65 routes demo | **933 passed, 0 failed** |
| Component interaction (gallery, favourites, filters, pagination) | demo build | **8 passed, 0 failed** |

Five defects were found and fixed; they are listed in §3.

### Why the demo build is audited too

A production build renders **no listings and no developments**, so the listing
cards, development cards, filters, sort, pagination, favourite buttons and the
gallery never appear in it. Auditing only production would have declared the
site clean while leaving a large part of the component library unexercised —
and in fact the heading-order defect in §3.3 exists **only** on pages that
production cannot currently render.

---

## 2. Method

**Tooling.** axe-core 4.x driven through Playwright against the built static
output served by `astro preview` — the same bytes a visitor receives, not a dev
server. Plus a purpose-written check suite for the things axe cannot assess
statically: keyboard traps, Escape behaviour, focus movement into and out of
the drawer, skip-link function, and reflow at 200% zoom.

**One methodology note worth keeping.** The first three runs reported up to 55
`color-contrast` violations, including on an `<h1>` that measures 11.5:1. All
were false. The site fades content in on scroll (`[data-reveal]`, opacity 0 →
1 over 700ms), and axe was measuring elements mid-fade, computing the blended
colour of a half-transparent element. Two attempted fixes also failed:

- setting `data-revealed` only **starts** the transition;
- removing `data-reveal-enabled` from `<html>` **races** `initReveal()`, which
  sets it after `DOMContentLoaded`.

The reliable fix is to override the rule outright before measuring:

```js
await page.addStyleTag({ content:
  '[data-reveal]{opacity:1!important;transform:none!important;transition:none!important}' });
```

**Any automated contrast pass on this site must neutralise the reveal
animation first, or it will report confident nonsense.** This sits alongside
the existing rule in `PROJECT_CONTEXT.md` §7 about measuring contrast by
painting the colour rather than parsing the string — both failure modes
produce plausible numbers that are wrong.

---

## 3. Defects found and fixed

### 3.1 Image links had no accessible name — *serious*, 42 occurrences
`AgentCard`, `PostAuthorCard`, `InsightsSection` and the `/about/` team cards
each wrapped a `MediaSlot` in a link. With no photography supplied the slot's
`alt` is empty, so the link announced as **"link"** with nothing after it —
WCAG 2.4.4 (Link Purpose) and 4.1.2 (Name, Role, Value).

Every one of those cards already carries a named link to the same destination
immediately below, so the image link was a nameless duplicate. Fixed with
`aria-hidden="true" tabindex="-1"`, which removes it from the accessibility
tree *and* removes a redundant tab stop, while leaving it clickable by mouse.

### 3.2 Two footer landmarks both named "Legal" — *moderate*, 88 occurrences
The footer sitemap column "Legal" and the small-print row were both
`<nav aria-label="Legal">`, on every page. Anyone navigating by landmark saw
two identical entries.

The small-print row repeats the column above verbatim, so it did not warrant a
landmark at all: the `<nav>` wrapper was removed and the list left in place.

### 3.3 Heading order jumped h1 → h3 — *moderate*, 12 occurrences
On `/properties/for-sale/`, `/for-rent/`, `/our-listings/`, `/search/`,
`/developments/new/` and `/existing/`, the results region carried an
`aria-label` but **no heading**, so the card `<h3>`s followed the page `<h1>`
with nothing between. On the development pages the outline ran `1 > 3 > 3 > 3 > 2`.

Fixed by giving the region a real visually-hidden `<h2>` and pointing
`aria-labelledby` at it. This is better than relabelling the cards: a heading
is navigable by heading shortcut, which an `aria-label` on a section is not.

**Only reproducible in the demo build** — see §1.

### 3.4 Decorative glyph exposed to screen readers — *minor*
The "Image pending" badge in `MediaSlot` paired an icon with its own text
label; the `<svg>` lacked `aria-hidden`, so it announced as an unnamed graphic
before the text. Hidden.

### 3.5 Standalone link targets below 24×24 — *minor*
Carried over from the previous session's work on `/contact/`, `/register/`,
`/privacy-policy/` and `/terms/`: aside CTAs and "Related" lists rendered 20px
tall at 390px, under WCAG 2.2 SC 2.5.8. Padded to 28px, no visible change.

---

## 4. Checks completed

Each was run across every route in both build modes unless noted.

### Semantic structure
- `<html lang="en">` on every page.
- Exactly one `<h1>` per page — 110 page-loads, no exceptions.
- `<header>`, `<main>`, `<footer>` present exactly once; `<main>` is the skip
  link's target.
- Every `<nav>` individually named: Direct lines, Utility, Primary, Mobile,
  Breadcrumb, Pagination, Properties, Services, Explore, Legal, Quick actions.
- Heading levels never skip descending.
- No duplicate `id` attributes.
- Sections use `<section>` with an accessible name where they are landmarks.

### Keyboard
- Every link, button, form control, disclosure and menu reachable by Tab in
  document order.
- Desktop dropdowns open on keyboard focus, close on Escape, and return focus
  to their trigger.
- Mobile drawer: focus moves to the close button on open, is contained while
  open (verified over 60 consecutive Tab presses), Escape closes it, focus
  returns to the toggle, `aria-expanded` tracks state, and body scroll unlocks.
- No keyboard trap anywhere — the drawer's containment is deliberate and
  escapable by Escape, which is the exception SC 2.1.2 allows.
- Drawer accordions are native `<details>`, operable without JavaScript.
- The mobile "Call" disclosure is a native `<details>` plus Escape and
  outside-click.

### Focus
- Visible focus ring on every interactive element; `:focus-visible` outline is
  2px with a 3px offset.
- The ring colour flips to `gold-300` on any element marked
  `data-surface="dark"`, so it stays visible on evergreen bands.
- Focus is never removed without replacement.

### Forms
- Every control has a real `<label for>`; **no placeholder is used as a label**
  (checked explicitly, 0 occurrences).
- Required fields marked with a symbol *and* the word; optional fields say
  "(optional)" rather than leaving people to infer.
- Hints and errors associated via `aria-describedby`.
- Errors announced in `role="alert"` regions; a failed submit renders a summary
  that takes focus and links to each field.
- A required radio group reports once, not once per option.
- `autocomplete` on name, email, tel, street-address, postal-code,
  address-level2 and address-line2.
- No form claims success when nothing received the submission.

### Images
- Every image goes through `MediaSlot`; informative images take descriptive
  `alt`, decorative placeholders take `alt=""`.
- No keyword-stuffed alt text — alt values are a name and a role
  ("Martin Hoffman P.A., Broker-Associate"), not a keyword list.

### Colour
- Contrast measured by painting the colour to a canvas and reading the pixel
  back, on every rendered text node, at both widths.
- Gold is ornament only; it is never body text on a light surface.
- Nothing is conveyed by colour alone — required, selected, current and error
  states each carry text or a symbol as well.

### Motion
- `prefers-reduced-motion` honoured globally; the reveal script shows
  everything immediately when it is set.
- No auto-rotating carousel, marquee or auto-advancing content anywhere on the
  site (checked explicitly, 0 occurrences).
- Nothing flashes.

### Navigation
- Skip link is the first focusable element on every page and moves focus to
  `#main` (verified by activating it).
- Navigation is identical in position and order across pages.
- Breadcrumbs are a labelled `<nav>` with `aria-current="page"` on the last
  item and matching `BreadcrumbList` structured data.

### Icons
- Decorative SVGs carry `aria-hidden="true"` or sit inside an `aria-hidden`
  parent.
- Icon-only controls carry an accessible name: drawer open/close, gallery
  controls, mobile action bar items, favourite toggle.

### Touch
- axe-core's `target-size` rule (SC 2.5.8) was confirmed to actually execute —
  not merely to be absent from the violation list — and passes: 76 nodes
  checked on `/faq/` at 390px alone, 0 violations and 0 needing review, on
  every page in both build modes.
- Breadcrumb links (37×16) and stacked phone/email links (20px tall) sit below
  24×24 in raw pixels but fall under the criterion's **inline exception** — a
  target in a sentence, or constrained by the line-height of surrounding text —
  which is why axe passes them. They remain below this project's own stricter
  44×44 aim; see §5.10.

### Responsive / zoom
- `<meta name="viewport" content="width=device-width, initial-scale=1">` —
  pinch-zoom **not** disabled, no `maximum-scale`, no `user-scalable=no`.
- At a 640×512 viewport (equivalent to 200% zoom on a 1280px window) no page
  scrolls horizontally and no text is clipped.

### Tables
- **The site contains no `<table>` elements.** Nothing to check; noted so a
  future author knows the header requirement has not simply been overlooked.

### Carousels / galleries
- No auto-rotating carousel exists, and none should be added.
- The property gallery is built on a native `<dialog>`, so focus containment
  and Escape come from the platform rather than from script. **Not exercisable
  today** — see §5.

### ARIA
- ARIA is used only where semantic HTML cannot express the state:
  `aria-expanded` on menu triggers, `aria-pressed` on the favourite toggle,
  `aria-current` on active links, `aria-describedby` on form fields,
  `role="alert"` on error regions, `aria-modal` on the drawer.
- No element is given a role its native element already has.
- No `aria-hidden` element contains anything focusable (checked explicitly).

---

## 5. Requires human or manual testing

Automation cannot close these, and none of them should be described as done
until a person has done them.

| # | Item | Why it needs a person |
| --- | --- | --- |
| 5.1 | **Screen reader pass** — NVDA + Firefox, JAWS + Chrome, VoiceOver + Safari (macOS and iOS) | Automated tools check that a name exists, not whether it is *useful*. Reading order, announcement quality and whether the site is pleasant to work through cannot be measured. |
| 5.2 | **Testing with people who use assistive technology daily** | The single highest-value item here, and the one nothing else substitutes for. |
| 5.3 | **Independent audit** | Everything in this document was produced by the team that wrote the code. |
| 5.4 | **Property gallery / lightbox** | Demo listings carry `images: []` on purpose — fabricating property photography is forbidden — so the gallery has **never rendered**. Its keyboard behaviour, focus return and arrow navigation are untested against real data. Re-test as soon as photography or an IDX feed lands. |
| 5.5 | **Populated pagination** | Twelve demo listings fit one page, so the client script empties and hides the pagination nav. The static markup carries `aria-current="page"` and named disabled controls, but a multi-page state has not been exercised. |
| 5.6 | **Voice control** (Dragon, Voice Control) | Needs a human speaking to it; checks that visible labels match accessible names in the way voice targeting requires. |
| 5.7 | **Zoom to 400% and text-spacing overrides** (SC 1.4.10, 1.4.12) | Partially covered by the 640px reflow pass; the full matrix needs a person resizing and applying user stylesheets. |
| 5.8 | **Windows High Contrast Mode / forced-colors** | Not tested. Custom focus rings and the evergreen bands need checking under forced colours. |
| 5.9 | **Real photography** | Every image is a placeholder today. When photographs land, each needs alt text written to the intent of the image (`CONTENT_PENDING.md` 9.5), and contrast re-checked over any image scrim (`PageHero`'s image variant has never rendered). |
| 5.10 | **Touch target sizes against the 44px aim** | All targets clear the 24×24 requirement. Breadcrumb links (37×16) and the stacked phone/email lists (20px tall) sit below the project's own 44×44 aim — a site-wide pattern from shared components, tracked as problem 22 in `BUILD_PROGRESS.md`. A deliberate pass, not a defect. |

---

## 6. Requires third-party integration review

Nothing here is under our control today, and each becomes a live accessibility
question the moment it is connected.

| # | Item | What to check |
| --- | --- | --- |
| 6.1 | **IDX / MLS property search** (`CONTENT_PENDING.md` §5) | If the provider supplies an embed, iframe or script, its markup is theirs. Check keyboard operability, focus handling, labels and contrast **before** signing, and confirm whether an accessible alternative exists. A provider embed can undo everything in this document on the pages it occupies. |
| 6.2 | **Account provider** — sign-in and registration (`AUTH_INTEGRATION.md`) | The credential step happens on the provider's origin, so their pages carry it. If an *embedded* widget is chosen instead, its form must be checked against WCAG 2.2 AA — it is not covered by this audit. |
| 6.3 | **Map provider** (`CONTENT_PENDING.md` 11.4) | Map widgets are a common failure point: keyboard panning, focus order and a text alternative for the information the map conveys. The site currently states locations in words and plots nothing. |
| 6.4 | **Form endpoint** (`CONTENT_PENDING.md` 6.1) | If the destination redirects to its own confirmation or error page, that page's accessibility is the provider's. Prefer the current inline, announced result. |
| 6.5 | **Spam protection** (`CONTENT_PENDING.md` 6.4) | A visual CAPTCHA is an accessibility barrier. Prefer a honeypot or a provider-side check with no user-facing puzzle. |
| 6.6 | **Analytics / chat / scheduling widgets** (11.1, 11.5) | Third-party chat widgets frequently trap focus and are unlabelled. Audit before adding. |

---

## 7. Re-running this audit

The suite is not committed — it depends on `playwright` and `axe-core`, which
are not project dependencies and should not become ones for a site that ships
no JavaScript framework. Re-create it from this document's §2, or keep it in a
scratch directory. What matters is that it runs against **built output served
over HTTP**, in **both build modes**, with the **reveal animation neutralised**.

```bash
npm run build                       # production: 45 routes
PUBLIC_DEMO_CONTENT=true npx astro build   # demo: 65 routes
npx astro preview --port 4321
```

Re-run it whenever a shared component changes — `Header`, `Footer`,
`MediaSlot`, `Button`, the form components, or the tokens. Those are the
changes that alter many pages at once, which is exactly when a regression goes
unnoticed.
