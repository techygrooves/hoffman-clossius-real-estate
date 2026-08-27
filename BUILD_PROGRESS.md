# BUILD_PROGRESS.md

Living record of what exists, what is broken and what comes next.
**Update this file at the end of every session.**

Last updated: **2026-08-27** — Session 10 (contact, accounts & legal pages)

---

## Current state

Foundation, global chrome, homepage, the property/listing system, the
developments subsystem, the buyer and seller conversion pages, the people and
testimonial pages, the communities architecture, the resources system and
**the contact, account and legal pages** are built. Listings, developments,
valuation data, biographies, portraits, testimonials, community guide copy,
journal articles, approved legal text and an account provider are all still
unsupplied, and in every case the architecture makes that a supply step rather
than a rewrite.

**Only `/accessibility/` remains unbuilt**, and it is blocked on 4.9 — who
receives accessibility reports, and by what channel.

| Metric | Value |
| --- | --- |
| Build | ✅ passing — `astro check`: 0 errors, 0 warnings, 0 hints |
| Pages | 45 in production · 65 with demo content on |
| Internal links | ✅ all resolve, both modes |
| Tests | ✅ **1,335 checks passing** — see below |
| Contrast | ✅ every rendered text node on all 64 pages × 2 widths clears WCAG 2.2 AA |
| JavaScript | ~22 KB total across the site, inlined, no dependencies |
| Third-party runtime requests | none |

| Suite | Checks |
| --- | --- |
| Mortgage maths — unit tests, in the build | 17 |
| Contact, accounts & legal — structure, contrast ×2 widths, forms, no-JS, targets | 524 |
| Mortgage calculator — browser, validation, reset, honesty | 52 |
| Resources — blog, FAQ, guides (production) | 57 |
| Resources — blog, FAQ, guides, article template (demo) | 83 |
| Resources — mobile, no-JavaScript, SC 2.5.8 targets | 32 |
| Communities & relocation — no invented statistics | 77 |
| Communities — mobile, no-JavaScript, SC 2.5.8 targets | 34 |
| One-object add + client-supplied content | 22 |
| Per-community listing attribution | 12 |
| About, profiles & testimonials — no invented credentials | 104 |
| People pages — mobile, no-JavaScript, SC 2.5.8 targets | 32 |
| Populated content — bios, specialities, verified quotes, badges | 32 |
| Per-agent listings attribution | 9 |
| Lead forms — fields, validation, states, prefill | 114 |
| Forms — mobile + no-JavaScript | 36 |
| Forms — contrast, keyboard, focus | 15 |
| Developments | 34 |
| Developments — mobile + no-JavaScript | 6 |
| Listing search | 18 |
| Property detail | 29 |
| Listings — mobile + no-JavaScript | 8 |
| Homepage | 15 |
| Navigation | 21 |

---

## ✅ Completed — Session 10 (2026-08-27) · Contact, accounts & legal pages

Five routes, an account seam, and a legal-content architecture. `StubPage` now
survives on exactly one route.

### Contact — `/contact/`
- [x] Both professionals with title, direct line and email, presented before
      the form — a phone number is a faster way to reach someone than a form,
      so it comes first.
- [x] Every specified field: name, email, phone, "I am interested in"
      (Buying · Selling · Renting · Relocating · New Development · Other),
      message, preferred contact method.
- [x] Routed through the existing `LeadForm` service, so it inherits the
      validation, the error summary, the busy state and the honesty rule
      without reimplementing any of them.
- [x] Privacy policy linked under the submit button, as on every other form.

**No office address, no office hours, no shared number** — none is confirmed
(`CONTENT_PENDING.md` 2.1–2.3). The page presents what *is* confirmed rather
than explaining what is missing, which reads as a design decision rather than
a gap.

### Accounts — `/login/` and `/register/`

**No page on this site renders an `input[type=password]`, in any build mode.**
Verified in production, with demo content on, and with an account provider
configured. This is the session's central decision and it is structural, not
stylistic: the site is statically generated and has no backend, so a sign-in
form here could only be decorative or homemade. A decorative password field is
not harmless — browsers offer to save what is typed into it, password managers
fill it, and people reuse credentials.

So the credential step belongs to the provider, on the provider's origin. That
is also the standing project rule (`CONTENT_PENDING.md` 5.10).

- [x] `src/lib/auth/` — the provider seam, selected exactly as listings and
      developments are. `AuthProvider` deliberately has **no method that
      accepts a credential**: an interface decides what gets built against it.
- [x] Connecting a provider is two environment variables and a rebuild. A
      half-configured environment falls back rather than shipping a link that
      404s — verified.
- [x] `/login/` states plainly that accounts are not available, and explains
      where the properties someone has already saved actually live (this
      browser, this device, gone with site data).
- [x] `/register/` is not a dead end: it collects the four specified fields —
      name, email, phone, ZIP/area — and sends them as a `property-alerts`
      enquiry for Martin and MaryEllen to action by hand. It says it is not an
      account, in the hero, above the form and in the heading.
- [x] `AUTH_INTEGRATION.md` documents all of it, including what must never be
      built here.

**There is no demo account mode, and there must never be one.** A fake
signed-in state is not a placeholder — it is a claim that an account exists,
and the worst outcome available is someone believing they registered for
alerts nobody will send.

### Legal — `/privacy-policy/` and `/terms/`

No approved text exists, so none was written. `src/data/legal.ts` gates
publication on `approved: true` — the same shape as `verified` on developments
and `reviewed` on FAQ answers — and `LegalDocument.astro` renders either the
approved document (contents list, dated, anchored) or a clearly marked empty
slot. Supplying text is a change to one data file.

What the pages *do* publish is carefully bounded:

- `/privacy-policy/` carries a factual description of how the site behaves —
  no analytics, no cookies set by us, no third-party requests, and the two
  per-device values in the browser — **each line verified against the code**,
  and labelled on the page as not being the policy.
- `/terms/` carries **no** acceptance wording, limitation of liability,
  warranty disclaimer, indemnity, governing-law clause or IP assertion. Those
  are a contract, and a plausible draft of a contract is not a placeholder —
  it is an unreviewed contract that happens to be published.

### Fixed while testing
- **Standalone link targets were under the 24px floor.** The aside CTAs and
  the legal "Related" lists rendered 20px tall at 390px — below WCAG 2.2
  SC 2.5.8. Padded to 28px; no visible change.
- **"Terms of Use is being prepared."** The pending heading interpolated the
  document title into a fixed sentence, which reads correctly for a policy and
  wrongly for plural terms. The heading is now supplied per page.
- **"…not the privacy policyand it is not…"** Astro collapsed the newline after
  a `</strong>`, welding two words together. Fixed with the `{' '}` pattern
  `LeadForm` already uses. Invisible in the markup; obvious in a screenshot.
- **14px headings came out in the display serif.** `h1`–`h4` take the serif
  family from the base layer, which is right at 20px and wrong for a small
  label. Set `font-sans` explicitly, as `Footer.astro` does for the same
  reason. **A small `<h3>` on this site needs `font-sans` stating outright.**

### Found, not fixed — and why
A **site-wide** target-size gap predating this session: breadcrumb links render
37×16 and the stacked phone/email lists 20px tall, on every page built so far.
Verified against untouched pages from earlier sessions. Both come from shared
components whose call sites span all 45 pages, so fixing them is a deliberate
pass, not a side effect of this task (`PROJECT_CONTEXT.md` §10.5). Recorded as
problem 22.

---

## ✅ Completed — Session 9 (2026-08-27) · Resources system

Six routes: the journal and its article template, both guides, the FAQ, and a
mortgage calculator with its arithmetic under unit test.

### Unit tests now run in the build

`npm run build` is `astro check && node --test tests/*.test.mjs && astro build
&& node scripts/verify-links.mjs`. The mortgage maths is pure and lives in
`src/lib/mortgage/calculate.ts`; `tests/mortgage.test.mjs` covers it with 17
assertions whose expected values are computed independently of the
implementation — a test that re-derives its expectation the same way the code
does proves nothing.

The property-detail estimate was refactored to import the same module. Two
copies of an amortisation formula is one copy too many: they would eventually
disagree, and only one of them would be under test.

### Mortgage calculator — `/mortgage-calculator/`
- [x] Every specified input: price, down payment (dollars **or** percent),
      rate, term, annual taxes, annual insurance, monthly HOA.
- [x] Every specified output: P&I, tax, insurance, HOA, total — plus loan
      amount, down-payment percentage, total interest and total of payments.
- [x] Standard amortisation formula, with the zero-rate case handled explicitly
      rather than left to divide by zero.
- [x] Accessible validation: native constraint validation with the bubbles
      suppressed, messages in `role="alert"` regions the field points at.
- [x] Reset, proportional breakdown bars, and a `<noscript>` panel offering both
      direct lines.

**No rate is stored or fetched.** The field starts empty and nothing is
calculated until a visitor supplies one — pre-filling a plausible rate would be
the site asserting a market figure it has no source for. Taxes, insurance and
HOA start blank for the same reason. Verified in the browser: zero network
requests while calculating.

### Journal — `/blog/` and `/blog/[slug]/`
- [x] Content collection extended to the full contract: title, excerpt,
      publishedAt, updatedAt, author, category, tags, heroImage,
      relatedCommunities, relatedProperties, draft, and a reserved `seo` object.
- [x] `src/lib/blog/posts.ts` decides in one place what is publishable, so the
      index, the routes, related reading and the sitemap cannot disagree.
- [x] Index: featured article, archive grid, search and category filters,
      community links, contact CTA. Filtering follows the established pattern —
      server-render every card once, show and hide in the browser.
- [x] Article: breadcrumb, h1, dates, byline, feature image, long-form
      typography, generated table of contents, tags, author card, related
      communities, related articles, contact CTA.

**Two sample posts, and what makes them safe.** `sample: true` marks a
structural placeholder. It renders only when `flags.demoContent` is on — never
in a production build — is badged on every card and behind a notice at the top
of the article, is `noindex`, is excluded from the sitemap, and only ever
relates to other samples. Their subject is the template itself; neither says
anything about the market.

That care is because of the byline. A fabricated article is worse than
fabricated listing data: it puts words in a named person's mouth on a subject
their clients act on.

### Guides — `/resources/buying-guide/` and `/resources/selling-guide/`
Nine steps and seven steps, sharing one `GuideSteps` component so the two
cannot drift. Each carries a contents list of plain anchors, per-step
checklists, and an explicit statement of what the guide is not.

**No timescale is promised anywhere in either.** A guide that says "closing
takes 30 days" is promising on behalf of a lender, an appraiser, a title
company and a seller, none of whom agreed to it — and the reader is the one
left holding it. No fee, no commission, no days-on-market figure, no guarantee.

### FAQ — `/faq/`
Twenty-four answers across the five specified categories, as native `<details>`
accordions that work with no script.

Every answer carries `reviewed: false`, and the page **says so in public**: the
answers describe general practice, not policy, and are still being reviewed.
None quotes a fee, a commission, a timescale or a guarantee; several say "ask"
where a specific figure would have been more useful, which is the honest
version of not having been told. The shared `FaqAccordion` carries that caveat,
so `/sell/` — which now publishes the selling answers automatically — cannot
publish them without it.

### Fixed while testing
- **A shared class silently overrode a fixed width.** The calculator's `field`
  constant carried `w-full`, and Tailwind emits `w-full` after `w-28`, so the
  down-payment mode select went full-width and pushed the form 31px past the
  viewport at 390px. This is problem 6 in the table below, hit again. Width is
  no longer baked into the shared class.
- **"Not a lending quote" was only visible after calculating.** It lived inside
  the results panel. Someone needs to know a number is an estimate before they
  read it, not after — it now sits beside the form, always visible.
- **The percent affix rendered "%20".** One element that swapped its character
  between `$` and `%` sat on the left in both modes. A currency symbol belongs
  before the number and a percent sign after it; there are now two.
- **Reset was a 20px text link.** Awkward to tap on a phone. Now a real target.
- **Searching "relocation" in the journal found nothing.** The filter searched
  title, excerpt and tags — technically consistent, practically wrong, since
  the category is the obvious thing to type. Category and its label are now
  searchable.

---

## ✅ Completed — Session 8 (2026-08-27) · Communities architecture

Fifteen communities, one template, and a data file that is the only thing
anyone should ever have to edit to add a sixteenth.

### The rule that shaped this session

**A community page is where invented neighbourhood claims live.** School
ratings, crime figures, median prices, population, commute times — every one
of them reads like a fact, is unverifiable by the reader, and is the sort of
thing a buyer acts on. None appears anywhere in this subsystem, and the
sections that would normally carry them render **nothing at all** rather than
generic filler.

That is the deliberate choice: an absent "Living in Hollywood" section is a
visible prompt to write a real one. A section headed "Lifestyle" containing
cards labelled Dining, Beaches and Schools would look finished and say nothing.

### Data — `src/data/communities.ts`
- [x] Rebuilt around the specified contract: `name`, `slug`, `county`,
      `shortDescription`, `heroImage`, `latitude`, `longitude`,
      `neighborhoods`, `highlights`, `propertySearchQuery`, `featured`, and a
      `seo` object reserved for later. Plus `kind`, `parent` and
      `introduction`, which the structure needed.
- [x] A `base` object supplies every default, so a new community is a short
      literal — slug, name, county, one factual line, a search query.
- [x] Fifteen communities: eleven municipalities and four neighbourhoods.
- [x] Helpers: `featuredCommunities`, `cityCommunities`, `childCommunities`,
      `communityCounties`, `communityNeighborhoods`, `nearbyCommunities`.

### `kind` is explicit, and that matters
`kind: 'city' | 'neighborhood'` is stated on every record rather than inferred
from whether `parent` is set. **Sheridan Lakes has no `parent` because we do
not know its municipality**, not because it is a city — and inferring
cityhood from a null parent listed it as one on `/sell/median-home-values/`.
Two different facts, two different fields.

### Components — `src/components/communities/`
`CommunityCard`, `CommunityFilters`, `CommunityHero`, `CommunityIntro`,
`CommunityListings`, `CommunityHighlights`, `CommunityNeighborhoods`,
`CommunityPropertyTypes`, `CommunityMap`, `NearbyCommunities`,
`CommunityCtas`, `CommunityFaq`. Each section component owns its own
`<Section>`, so an empty one costs no layout at all.

### Pages
- [x] `/communities/` — hero, featured grid, search + county + type filters
      over every community, honest empty state, relocation CTA. Filtering
      follows the listings pattern: server-render every card once, show and
      hide in the browser, full list without JavaScript.
- [x] `/communities/[slug]/` — all fourteen specified sections in one
      template. Subareas and cross-links derive from the data.
- [x] `/relocation/` — "Moving to South Florida?", introduction, community
      explorer, buy-or-rent trade-offs, property search, new developments,
      checklist teaser, MaryEllen's confirmed title, and a `kind: 'relocation'`
      lead form.

### Deliberate omissions on `/relocation/`
No response-time promise, no relocation certification or network, no corporate
programme, no "download our relocation guide" gate. The checklist is simply on
the page — if it is useful it should not cost an email address.

### Fixed while testing
- **The link verifier had gone silent.** Adding `@data/communities` to
  `navigation.ts` made it unresolvable under plain Node, where
  `scripts/verify-links.mjs` imports it. A `.catch()` swallowed the failure and
  the script reported "0 from the nav config" while still exiting zero — the
  dead-link check was off and nothing said so. The import is now relative with
  an explicit extension, and the script **exits non-zero** if it ever breaks
  again, or if `allNavHrefs()` returns nothing.
- **Neighbourhoods were being listed as cities.** See `kind`, above.
- **The intro stand-in said the county twice** — "Hollywood is a community in
  Broward County. A coastal city in Broward County, between …". It now leads
  with the record's own line instead of wrapping it.

### Verified by temporarily adding a community, then reverting
The "one data object" claim is tested rather than asserted. Two records were
patched in — a city and a child neighbourhood, in a county that did not exist
yet — and with no other edit: both pages built, the index showed 17 cards, the
subarea section appeared on the parent and linked the child, the child's
breadcrumb pointed at its parent, the new county became a filter option, and
the header navigation picked up the featured one. Client-supplied
`introduction`, `highlights`, `neighborhoods` and `seo` were exercised the same
way. Then reverted and the build re-scanned for leakage.

---

## ✅ Completed — Session 7 (2026-08-27) · About, profiles & testimonials

Four pages about the two people the business is, built on almost no
information about them. `PROJECT_CONTEXT.md` §1 is explicit that name, title,
phone and email are the **only** confirmed facts — so the work was deciding
what a profile page can honestly be without a biography, a portrait, a
credential or a track record.

### The rule that shaped this session

**An invented credential does the most damage exactly here.** A visitor reaches
`/about/` while deciding whether to trust two people with the largest
transaction of their life, and every reassuring number on a page like this is
unverifiable by the reader. So none appears: no years in business, no
transaction count, no sales volume, no award, no ranking, no designation, no
association membership, no licence number, no star rating, no review count.

What the pages say instead is what is true and checkable: there are two of
them, here is what each is licensed as, here is the area they cover, and here
are their direct lines. That is a real proposition.

### Testimonials — `src/data/testimonials.ts`
- [x] Reshaped to the specified contract: `quote`, `clientName`, `location`,
      `source`, `sourceUrl`, `date`, `verified` (plus `id`). Everything but the
      quote, the name and `verified` is nullable, and a null renders **nothing**
      — no dash, no "Location not provided".
- [x] `TestimonialSource` is a union of `'Google' | 'Zillow' | 'Direct Client'`,
      with `SOURCE_BADGES` carrying the label and an explanatory description.
      Adding a platform is one entry in that map.
- [x] **No rating field, deliberately.** We hold no Google or Zillow rating and
      no review count, and `/testimonials/` says so in public. A star row
      inferred from a quote's tone would be a fabrication.
- [x] **No constructed URLs.** `sourceUrl` is only ever a link the client
      supplies — never built from a profile page, a search result or a guess at
      a review id. Null simply means the badge names the platform without
      linking.

### Components
- [x] `TestimonialCard` — quote, name, optional location, optional source badge,
      optional date. `feature` variant for the lead quote on a page.
- [x] `TestimonialSourceBadge` — **wording only, no logos.** Google's and
      Zillow's marks are trademarks with their own usage rules and neither has
      been licensed. Links open in a new tab with `rel="noopener"`.
- [x] `TestimonialEmptyState` — shared by the homepage, `/about/` and
      `/testimonials/`, so the three cannot drift. Renders identically in
      development and production: testimonials are the one thing excluded from
      the demo-content mechanism.
- [x] `PersonHero`, `PersonBio`, `PersonSpecialties`, `PersonContactCard`,
      `PersonListings`, `ConsultationCta` — the profile page kit.

### How the pending content is handled
- `professionals[].bio` became `readonly string[] | null`. With copy supplied,
  `PersonBio` renders the paragraphs verbatim. With none, it renders a
  two-sentence stand-in built **only** from confirmed facts — name, title,
  service area — plus a visible note that a fuller profile is coming. The note
  is phrased as a fact about the website, not about the person.
- `professionals[].specialties` is new and empty. `PersonSpecialties` owns its
  own `<Section>`, so an empty list renders **nothing at all** rather than a
  heading over a blank band.
- Portraits and the joint `/about/` photograph go through `MediaSlot`, so the
  placeholder is the neutral abstract wash — never a stock headshot of someone
  who is not them.

### Listings on a profile page
- [x] `ListingQuery` gained `agentProfilePath`, matched against
      `listingAgent.profilePath` rather than a name — a feed returns "Martin
      Hoffman", "Hoffman, Martin P.A." or a middle initial depending on the MLS,
      and a profile page must not silently show nothing over a punctuation
      difference.
- [x] `PersonListings` never pads a thin section with the other agent's
      properties. Verified: the two pages share no listing in the demo build.

### Pages
- [x] `/about/` — hero with joint photograph slot, introduction, profile
      previews, approach for buyers/sellers/relocating clients, South Florida
      focus with all six community guides, service links, testimonial preview,
      final contact CTA.
- [x] `/about/martin-hoffman/` — portrait, title, biography component, listings,
      contact card, consultation CTA. Carries three notes on what a
      Broker-Associate licence **is**, which is Florida licensing law rather
      than a claim about his record.
- [x] `/about/maryellen-closius/` — the same, plus a relocation feature. Her
      confirmed "Relocation Specialist" title is used as a title and nothing
      more: the section describes what makes an out-of-state move difficult —
      properties of the problem, not of a service nobody has described to us.
- [x] `/testimonials/` — empty state today; grouped by source with working jump
      links once two or more sources are in use. Carries a public statement of
      what will and will not appear on it.

### Verified by temporarily supplying content, then reverting
Both the empty and the populated paths are tested, because a component that
only works empty is not finished. With test bios, specialities and five
testimonials (one deliberately `verified: false`) patched in: paragraphs
rendered, the pending note disappeared, the specialities section appeared, all
three badges rendered, the one supplied URL became the only link, the
unverified quote **did not render anywhere**, and every jump link resolved to a
real section. The patch was reverted and the build re-scanned for leakage.

---

## ✅ Completed — Session 6 (2026-08-26) · Buyer & seller conversion pages

Five pages, and the two pieces of infrastructure underneath them: a form
service every enquiry goes through, and a valuation seam nothing is plugged
into yet.

### The rule that shaped this session

**No form pretends to succeed.** `PUBLIC_LEAD_FORM_ENDPOINT` is unset, so
nothing receives a submission — and rather than show "thank you, we'll be in
touch" over a message that went nowhere, a submit renders the visitor's own
answers back with a prefilled email link to Martin and MaryEllen and both
direct numbers. Their effort is not lost, and nobody waits for a reply that was
never coming. Setting the environment variable switches this off with no code
change.

### Form service — `src/lib/forms/`
- [x] `types.ts` — `LeadSubmission` (machine `fields`, human `display`, and
      `labels`), `LeadKind`, and a three-outcome `LeadResult`: `sent`,
      `unconfigured`, `error`. Three rather than a boolean because "nowhere to
      send it" is neither a success nor a failure.
- [x] `transport.ts` — selects the transport from
      `PUBLIC_LEAD_FORM_ENDPOINT`. Documents why the variable is `PUBLIC_`
      (the browser posts directly) and the constraint that follows: **the
      endpoint must never be a URL that carries a secret.**
- [x] `form-client.ts` — validation, busy state, the four end states, the
      error summary, and the contact fallback.
- [x] `prefill-client.ts` — a control opts in with `prefillParam`; the browser
      fills it from the query string. A static page cannot read one at build
      time, and two journeys depend on it (homepage address → evaluation form;
      saved search → Dream Home Finder).

### Form components — `src/components/forms/`
- [x] `LeadForm.astro` — the shell: error summary, submit, privacy line,
      result states, fallback panel, and the no-JavaScript panel.
- [x] `FormField.astro` — one labelled control with its hint and error slot.
      Real `<label for>`, `aria-describedby`, `role="alert"` error region.
- [x] `FormChoiceGroup.astro` — radios/checkboxes as chips in a real
      `<fieldset>` with a `<legend>`.
- [x] `FormSection.astro` — a numbered step with a 12-column grid.

### Accessibility built into the shell, so it is right everywhere at once
- Native constraint validation with the bubbles suppressed, messages rendered
  into `role="alert"` regions the field points at.
- An error summary that lists every problem as a link and **takes focus** on a
  failed submit — verified to scroll into view and clear the sticky header.
- Fields validate on blur only **after** a first submit attempt.
- Radio groups are one entry in the summary, not one per option.
- Every field says required or "(optional)". **Nothing is pre-ticked**, there
  is no default marketing opt-in, and there is no fake urgency anywhere.
- Chips are 40px tall; focus rings render on the chip, not the `sr-only` input.

### Valuation seam — `src/lib/valuation/`
- [x] `types.ts` — `ValuationRequest`, `ValuationEstimate`, `MarketSnapshot`,
      `ValuationProvider`. Two rules stated in the file: **every figure carries
      its source and its date** (both required, not optional), and **an AVM is
      never described as artificial intelligence** — it is a statistical model
      over comparable sales.
- [x] `unconfiguredProvider.ts` — returns null throughout.
- [x] `provider.ts` — selection, and what must be in place before an AVM is
      connected (licence, verbatim attribution and disclaimer, refresh cadence).

### Pages
- [x] `/buy/` — the seven stages of a purchase, four routes in, the Dream Home
      Finder, relocation, contact. No statistic, no guarantee, no claim about
      access or timescales.
- [x] `/buy/dream-home-finder/` — all fourteen specified fields across four
      steps. Prefills price, beds, baths, type and area from a saved search.
      Only name, email and contact method are required.
- [x] `/sell/` — preparation, positioning, marketing, showings, offer to
      closing, seller questions, contact. Testimonials render **only** if the
      client has supplied verified quotes; none exist, so the band is absent.
      Carries an explicit "this is not legal or tax advice" line.
- [x] `/sell/home-evaluation/` — all thirteen specified fields, CTA reads
      "Request My Complimentary Home Evaluation", address prefills from the
      homepage strip. States plainly that no estimate is generated and that an
      opinion of value is not an appraisal.
- [x] `/sell/median-home-values/` — address entry, what a median is and is not,
      per-city accordion, an honest section about automated estimates, and the
      valuation CTA. **Publishes no figure**, because none carries a source.

### What these pages will never do
- Generate, calculate or display a home value. Nothing on the site does.
- Describe a calculator or a model as artificial intelligence.
- Publish a median without a source and a date — the types make both required.
- Quote a commission, a timescale, a days-on-market figure or a success rate.
- Show a testimonial that has not been supplied and verified.

### Fixed while testing
- **Error summary listed one entry per radio option.** A required radio group
  makes *every* radio report `valueMissing` — that is what the spec says — so a
  three-option group reported the same problem three times. Collapsed to one
  entry per group.
- **A submit stole focus back from the error summary.** The summary was focused
  and then the first invalid field was focused immediately after, which hides
  every other problem until you fix the first. The summary keeps focus now.
- **The fallback summary read "Email: Email".** A radio carried its option
  label where the group's legend belonged. Radios now label by legend, and a
  select reports the text a person actually saw ("$1,000,000") rather than its
  value — while the machine value still goes to the destination.
- **No JavaScript meant a button that POSTed into a 405.** A `<style>` inside
  `<noscript>` now hides the submit block and shows a contact panel instead.
- **Placeholder markers failed contrast.** "Logo pending" (2.5:1) and "Image
  pending" (2.2:1) were too faint to read. Both now clear 4.5:1 — they are
  meant to be noticed.
- **Small gold text failed contrast.** `gold-600` clears 3:1 but not 4.5:1, so
  everything under 24px moved to `gold-700`. The 24px numerals are large text
  and stay.

### Documentation
- [x] `CONTENT_PENDING.md` §6 rewritten around `PUBLIC_LEAD_FORM_ENDPOINT`,
      plus 6.1a (the endpoint must carry no secret), 6.7 (retention, needed for
      the privacy policy), 10.7 (how to supply median figures) and 10.7a
      (the rule about ever adding an automated estimate). Four new active
      placeholders registered.

---

## ✅ Completed — Session 5 (2026-08-24) · Developments subsystem

Built on the same provider pattern as listings, with one difference that
matters: **there is no feed.** New construction has no MLS equivalent, so the
real source is client-supplied material gated by a `verified` flag.

### Provider architecture — `src/lib/developments/`
- [x] `types.ts` — `Development` with every field the brief named, plus
      `DevelopmentImage`, `DevelopmentAddress`, `NumericRange`, `ResidenceType`,
      `DevelopmentAmenityGroups`, `DevelopmentQuery` and `DevelopmentProvider`.
- [x] `provider.ts` — curated → demo → unconfigured. Adding a verified entry to
      `curatedData.ts` flips the selection on its own.
- [x] `curatedData.ts` + `curatedProvider.ts` — where real developments go.
      **Only `verified: true` entries are ever served**, so an entry can be
      added and worked on without unchecked claims reaching the public site.
- [x] `demoData.ts` + `demoProvider.ts` — six placeholder projects, every one
      flagged `demo`, named "Sample …", `verified: false`, no images.
- [x] `unconfiguredProvider.ts` — serves nothing, drives the honest empty state.
- [x] `filter.ts` / `query.ts` / `filter-client.ts` — filtering shared between
      the build and the browser, with every filter in the URL.

### Components — `src/components/developments/`
`DevelopmentCard`, `DevelopmentGrid`, `DevelopmentFilters`,
`DevelopmentGallery`, `DevelopmentFacts`, `DevelopmentAmenities`,
`DevelopmentContactCTA`, `DevelopmentMap`, plus `DevelopmentStatusBadge`,
`DevelopmentEmptyState`, `DevelopmentResidences` and `DevelopmentIndex`.

### Pages
- [x] `/developments/new/` — hero, introductory copy, filters, cards,
      new-construction CTA band and contact.
- [x] `/developments/existing/` — same architecture, community framing.
- [x] `/developments/[slug]/` — gallery, name and location, key facts,
      description, residences with floor-plan slots, amenities, availability,
      map, request-information panel, agent CTAs and related developments.

### The rules this subsystem enforces
- [x] **No developer material downloaded.** No rendering, photograph, site plan
      or brochure has been taken from any developer's site.
- [x] **No floor plan manufactured.** `floorPlan` is a slot for an authorised
      asset; empty, each residence says plans are available on request.
- [x] **Renderings are labelled** via `isRendering`, so an artist's impression
      is never shown as a finished building.
- [x] Prices, delivery years and residence counts are published figures or
      `null`. Components render nothing for a null.

### Documentation
- [x] `DEVELOPMENTS_DATA.md` — the `verified` gate, what may and may not be
      filled in, image and floor-plan rules, a worked template, and what to do
      if a feed ever exists.
- [x] `CONTENT_PENDING.md` 10.6 expanded into five specific items.

### Shared refactor
- [x] `gallery.ts` moved from `src/lib/listings/` to `src/lib/` — listings and
      developments now share one lightbox rather than having two.
- [x] Homepage `DevelopmentsPreview` migrated to the provider; the old
      `src/data/developments.ts` deleted.

**One bug found by testing** — see the session log.

---

## ✅ Completed — Session 4 (2026-08-24) · Property & listing system

Built the entire listing system without pretending an MLS feed exists.

### Provider architecture — `src/lib/listings/`
- [x] `types.ts` — the contract every provider produces: `Listing`,
      `ListingImage`, `ListingAddress`, `ListingAgent`, `ListingStatus`,
      `PropertyType`, `ListingFeatures`, `OpenHouse`, plus `ListingQuery`,
      `ListingResult` and `ListingProvider`.
- [x] `provider.ts` — selects IDX → demo → unconfigured. **Real data always
      wins.** The only file that changes when a feed goes live.
- [x] `idxProvider.ts` — the documented seam. Deliberately unimplemented:
      writing speculative requests against a guessed API would be thrown away
      and might imply an integration exists.
- [x] `demoProvider.ts` + `demoData.ts` — twelve placeholder records, every one
      flagged `demo`, `DEMO-` numbered, "Sample" street names, no images.
- [x] `unconfiguredProvider.ts` — serves nothing, drives the public
      "Live property search is being configured" message.
- [x] `filter.ts` — pure filter/sort/paginate, shared by the build and the
      browser so the two can never disagree.
- [x] `query.ts` — URL ⇄ `ListingQuery`. Every filter lives in the URL.

### Components — `src/components/listings/`
`ListingCard`, `ListingGrid`, `ListingFilters`, `ListingSort`,
`ListingGallery`, `ListingFacts`, `ListingContactCard`, `ListingStatusBadge`,
`ListingEmptyState`, `Pagination`, `FavoriteButton`, `ListingIndex`,
`MortgageEstimate`.

### Pages
- [x] `/properties/for-sale/`, `/for-rent/`, `/our-listings/`, `/search/` —
      all four share `ListingIndex`; they differ only in heading and base query.
- [x] `/property/[slug]/` — breadcrumb, gallery, price, address, status,
      facts row, full specification, description, features, location, mortgage
      estimate, enquiry + agent card, similar properties, recently viewed, and
      a mobile sticky CTA that replaces the site-wide action bar.

### Behaviour
- [x] **Shareable searches.** `?location=Hollywood&minPrice=500000&beds=3`
      filters on load and hydrates the form.
- [x] **Gallery** on a native `<dialog>` — focus trap and Escape come from the
      platform; the script only moves between images, restores focus and reads
      swipes. Under 1 KB, no library.
- [x] **Mortgage estimate** shows nothing until the visitor enters a rate. The
      site holds no market rate and will not imply one.
- [x] **Favourites** and **recently viewed** are per-device localStorage, every
      access guarded, and both say plainly that they are not an account.
- [x] No public-facing text contains developer vocabulary — verified by
      scanning the built output.

### Documentation
- [x] `IDX_INTEGRATION.md` — credentials, fetch logic, the adapter rules, the
      normalised shape, attribution, fetch timing, what happens at scale, and a
      go-live checklist.
- [x] `CONTENT_PENDING.md` §5 rewritten: authorised provider, API docs,
      credentials, agent IDs, attribution, disclaimers, refresh/cache rules.

**Three bugs found by testing** — see the session log.

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
| `StubPage` | `src/layouts/StubPage.astro` | ⚠️ temporary — **one route left** (`/accessibility/`); delete with it |
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
| Listing components | `src/components/listings/*.astro` | ✅ stable — thirteen components, provider-agnostic |
| Development components | `src/components/developments/*.astro` | ✅ stable — twelve components, provider-agnostic |
| `AgentCard` | `src/components/ui/AgentCard.astro` | ✅ stable — reuse on /about/ |
| `DemoNotice` | `src/components/ui/DemoNotice.astro` | ✅ stable — dev-only by construction |
| `QueryEcho` | `src/components/ui/QueryEcho.astro` | ✅ stable |
| `LeadForm` | `src/components/forms/LeadForm.astro` | ✅ stable — the shell every enquiry form uses |
| `FormField` | `src/components/forms/FormField.astro` | ✅ stable — one labelled control + hint + error |
| `FormChoiceGroup` | `src/components/forms/FormChoiceGroup.astro` | ✅ stable — fieldset + legend chips |
| `FormSection` | `src/components/forms/FormSection.astro` | ✅ stable — a numbered step of a longer form |
| `PersonHero` | `src/components/people/PersonHero.astro` | ✅ stable — profile masthead with portrait slot |
| `PersonBio` | `src/components/people/PersonBio.astro` | ⚠️ neutral stand-in until 8.1 / 8.2 supplied |
| `PersonSpecialties` | `src/components/people/PersonSpecialties.astro` | ✅ stable — renders nothing until 8.5 confirmed |
| `PersonContactCard` | `src/components/people/PersonContactCard.astro` | ✅ stable |
| `PersonListings` | `src/components/people/PersonListings.astro` | ✅ stable — filtered on `agentProfilePath` |
| `ConsultationCta` | `src/components/people/ConsultationCta.astro` | ✅ stable |
| `TestimonialCard` | `src/components/testimonials/TestimonialCard.astro` | ✅ stable — shared by home, /about/ and /testimonials/ |
| `TestimonialSourceBadge` | `src/components/testimonials/TestimonialSourceBadge.astro` | ✅ stable — wording only, no trademarked logos |
| `TestimonialEmptyState` | `src/components/testimonials/TestimonialEmptyState.astro` | ⚠️ the shipping state until 10.1 supplied |
| Community components | `src/components/communities/*.astro` | ✅ stable — twelve components, all data-driven |
| `CommunityIntro` | `src/components/communities/CommunityIntro.astro` | ⚠️ neutral stand-in until 10.5 supplied |
| `CommunityHighlights` | `src/components/communities/CommunityHighlights.astro` | ✅ stable — renders nothing until 10.5d confirmed |
| `CommunityFaq` | `src/components/communities/CommunityFaq.astro` | ✅ stable — reserved for the SEO phase (10.5h) |
| `CommunityMap` | `src/components/communities/CommunityMap.astro` | ⚠️ location in words; no pin until 10.5c + 11.4 |
| `PostCard` | `src/components/blog/PostCard.astro` | ✅ stable — badges sample posts on the card itself |
| `PostToc` | `src/components/blog/PostToc.astro` | ✅ stable — generated; absent under two sections |
| `PostAuthorCard` | `src/components/blog/PostAuthorCard.astro` | ✅ stable — no biography until 8.1 / 8.2 |
| `FaqAccordion` | `src/components/faq/FaqAccordion.astro` | ✅ stable — carries the review caveat with the answers |
| `GuideSteps` | `src/components/resources/GuideSteps.astro` | ✅ stable — shared by both guides |
| `AccountHandoff` | `src/components/auth/AccountHandoff.astro` | ✅ stable — renders nothing until a provider is configured |
| `AccountBenefits` | `src/components/auth/AccountBenefits.astro` | ✅ stable — shared by both account pages |
| `LegalDocument` | `src/components/legal/LegalDocument.astro` | ⚠️ pending state is the shipping state until 4.7 / 4.8 |
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
| 6 | Tailwind utility-ordering pitfall | 🟠 med | **Hit twice now.** `.inline-flex` is emitted after `.hidden`, so `class="hidden xl:block"` passed into `Button`/`KeyesLogo` is silently ignored — put responsive visibility on a **wrapper**. Session 9 hit the same shape with width: a shared `field` class containing `w-full` overrode `w-28` at the call site and pushed the calculator 31px past the viewport at 390px. **Never bake a width or a display utility into a shared class string.** Both failures were invisible in code review and only showed up in a 390px browser test. |
| 7 | Team-name spelling | 🟠 med | Site uses "Closius"; the repository is `hoffman-clossius-real-estate`. Confirm before launch (`CONTENT_PENDING.md` 2.5). |
| 8 | No screen-reader or Lighthouse pass yet | 🟠 med | Structural checks, keyboard paths through the forms, and a **pixel-accurate** contrast sweep of every rendered text node on all 53 pages at two widths now run in the browser. (The earlier sweep parsed colour strings, which Tailwind 4's `color-mix()` → `oklab()` output silently defeated; measurements now paint the colour to a canvas and read the pixel back.) A real screen-reader pass and Lighthouse are still to come. |
| 9a | Four homepage sections are empty in production | 🟠 med | Featured properties, developments, testimonials and insights all show empty states until their data arrives. Each carries a distinct, useful call to action, and this is the honest state — but the page is visibly lighter than it will be. `npm run build:demo` shows the populated design. |
| 9e | No developments in production | 🟠 med | Both development indexes show an honest invitation. Resolves by adding verified entries to `curatedData.ts` — `DEVELOPMENTS_DATA.md`, `CONTENT_PENDING.md` 10.6. |
| 9c | No listings anywhere in production | 🔴 high | Every property page shows "Live property search is being configured." Resolves entirely by implementing `idxProvider.ts` once the client confirms their provider — `CONTENT_PENDING.md` §5, `IDX_INTEGRATION.md`. |
| 9d | Filtering needs JavaScript | 🟢 low | A static host cannot filter server-side, so a shared filter URL only applies its filters once the script runs. Without JavaScript the pages degrade to the full browsable list, and pagination is hidden rather than shown as links that would all return page one. |
| 9b | Homepage has no photography | 🔴 high | Fourteen media placeholders. The design is built around real imagery and reads flat without it. `CONTENT_PENDING.md` §9. |
| 9 | Gold on white is 2.4:1 | 🟢 low | By design — gold is ornament only. The wordmark ampersand is a logotype (SC 1.4.3 exempt, and marked `data-wordmark` so the contrast sweep can say so). `gold-600` (3.4:1) is fine for text at 24px and above; **anything smaller uses `gold-700`** (5.5:1). Do not extend gold to body text or links on light surfaces. |
| 10 | No form goes anywhere | 🔴 high | `PUBLIC_LEAD_FORM_ENDPOINT` is unset, so every enquiry form shows the contact fallback rather than sending. This is the correct behaviour, not a bug — but it is the single highest-value item on `CONTENT_PENDING.md` (6.1), and it resolves with an environment variable and a rebuild. |
| 11 | Forms need JavaScript | 🟠 med | Submission runs in the browser, so with JavaScript off the submit block is replaced by a contact panel. Honest, but a real limitation — a server-side form handler would remove it, and is worth revisiting alongside 6.1. |
| 13 | No biographies or portraits | 🔴 high | Both profile pages carry a two-sentence neutral stand-in built only from confirmed facts, plus a visible note. `/about/` has no joint photograph. The pages are complete and correct — they are just thin, and they will stay thin until Martin and MaryEllen supply copy and photographs. `CONTENT_PENDING.md` 8.1–8.3a. |
| 14 | No testimonials anywhere | 🟠 med | Homepage, `/about/` and `/testimonials/` all show the shared empty state. `/testimonials/` is deliberately still a substantial page — it explains the policy — but it has no quotes on it. `CONTENT_PENDING.md` 10.1. |
| 19 | No journal articles | 🟡 low | `/blog/` shows an honest empty state in production; the homepage insights band does the same. The template is complete and two dev-only samples exercise it. One Markdown file publishes an article. `CONTENT_PENDING.md` 10.9. |
| 20 | FAQ answers are drafted, not reviewed | 🟠 med | Twenty-four answers describing general practice, every one `reviewed: false`. Both `/faq/` and `/sell/` say so in public. They need reading and correcting, and `reviewed: true` set per answer. `CONTENT_PENDING.md` 10.2. |
| 21 | Calculator has no default rate, tax or insurance | 🟢 low | By design — the site holds no market rate and a Florida insurance default would be a guess. Nothing is calculated until the visitor enters a rate. Pre-filling any of them needs a citable, dated source. `CONTENT_PENDING.md` 11.3. |
| 16 | No community guide copy | 🟠 med | All fifteen pages carry one factual line and a visible "the guide is being written" note. The template is complete; the copy is not, and the lifestyle and FAQ sections are absent until it arrives. `CONTENT_PENDING.md` 10.5, 10.5d. |
| 17 | Community locational lines are ours, not the client's | 🟠 med | Written from geography alone. The four Hollywood-area subareas need the closest review — neighbourhood boundaries are locally understood and vary. Sheridan Lakes deliberately has no parent municipality recorded. `CONTENT_PENDING.md` 10.5a, 10.5b. |
| 18 | Coordinates are unverified and unplotted | 🟢 low | Approximate centroids on the eleven municipalities, none on the subareas. `CommunityMap` states the location in words and plots nothing, so nothing incorrect ships — but they must be verified before a map provider goes in. `CONTENT_PENDING.md` 10.5c. |
| 15 | Per-agent listings untestable against real data | 🟢 low | `agentProfilePath` matches `listingAgent.profilePath`, which the demo provider sets from `professionals[].href`. A real IDX feed must map its own agent identity onto the same paths in `idxProvider.ts`, or both profile pages will show the honest "nothing on the open market" state forever. Noted in `IDX_INTEGRATION.md`. |
| 22 | Site-wide target sizes under WCAG 2.2 SC 2.5.8 | 🟠 med | **Predates session 10 and affects all 45 pages.** Breadcrumb links render 37×16 at 390px and the stacked phone/email lists 20px tall — both below the 24×24 floor, and well below this project's own 44px aim (`PROJECT_CONTEXT.md` §7). Verified against untouched pages from earlier sessions, so it is not a regression. Both come from shared components (`Breadcrumbs`, the contact-detail lists repeated across asides), so fixing it is a deliberate pass with every call site checked — not a side effect of another task. Session 10's own standalone links were brought to 28px. |
| 23 | No account provider connected | 🟠 med | `/login/` says accounts are not available; `/register/` collects alert details for Martin and MaryEllen to action by hand. Resolves with two environment variables — `CONTENT_PENDING.md` 5.10a, `AUTH_INTEGRATION.md`. **No page renders a password field in any build mode, and that does not change when a provider is connected** — the credential step is the provider's, on its own origin. |
| 24 | No approved legal text | 🔴 high | `/privacy-policy/` and `/terms/` are built and render a clearly marked "awaiting legal review" slot. Both documents bind the client and neither may be drafted by us. Resolves by pasting approved text into `src/data/legal.ts` and setting `approved: true` — `CONTENT_PENDING.md` 4.7, 4.7a, 4.8. The privacy policy is additionally blocked on 6.1/6.7 (where submissions go and how long they are kept) and 11.1 (analytics), because it must describe what the site actually does. |
| 12 | No median home values published | 🟠 med | `/sell/median-home-values/` shows no figure for any of the six cities, because none carries a source and a date. Resolves via a `medianHomeValue` on a community record, or a live `ValuationProvider`. `CONTENT_PENDING.md` 10.7. |

---

## Next tasks

### Immediate — next session
1. **`/accessibility/`** — the last route on `StubPage`, and the last page in
   the site. Blocked only on `CONTENT_PENDING.md` 4.9: who receives
   accessibility reports, and by what channel. The statement itself describes
   the standard the site is built toward (WCAG 2.2 AA) and how to report a
   barrier; **it will not claim any certification**. Building it retires
   `StubPage.astro` and `InPreparation.astro` for good.

### Then, roughly in order
2. **Approved privacy policy and terms text** — both pages are built and
   waiting on one data file (`CONTENT_PENDING.md` 4.7, 4.7a, 4.8). The privacy
   policy is the more urgent of the two: every form on the site links to it.
3. **Client review of the FAQ answers** — 24 are live and every one is flagged
   unreviewed in public. This is the cheapest quality win outstanding.
4. Community guide copy — the template is built; a sourced `medianHomeValue`
   on any record also lights up that city on `/sell/median-home-values/`.
5. `/developments/new/` and `/existing/` — blocked on client material.
6. The first journal article — one Markdown file. Delete the samples with it.
7. **IDX integration** — `/properties/*`, `/property/[slug]/`, `/login/`,
   `/register/`. Fully blocked on `CONTENT_PENDING.md` §5.

### The SEO phase — deferred on purpose, and scaffolded for
Every community record carries an empty `seo` object (`title`, `description`,
`body`, `faqs`) and `CommunityFaq` renders from it; every journal post carries
one too (`title`, `description`, `keywords`). So the pass has somewhere to
land. **Nothing there may be filled with keyword variations or generated
copy**: an FAQ written to catch a search query is still an invented answer
about somebody's neighbourhood, and `FAQPage` structured data is deliberately
not emitted for the same reason. `CONTENT_PENDING.md` 10.5h.

### Cross-cutting, before launch
- [ ] Real photography throughout; verify LCP and contrast over image scrims.
- [ ] Accessibility audit — axe, screen reader pass. (Keyboard paths through
      the forms and a pixel-accurate contrast sweep of every page now run in
      the browser suite.)
- [ ] **Set `PUBLIC_LEAD_FORM_ENDPOINT`** in the host's build environment and
      submit each form once end to end. Nothing else on this list changes as
      much for as little work.
- [ ] Lighthouse on the built output; confirm Core Web Vitals.
- [ ] Confirm domain, set `urlConfirmed: true`, regenerate `robots.txt`,
      verify the sitemap.
- [ ] Delete `StubPage.astro` and `InPreparation.astro` once no route uses them.
- [ ] **Chase 8.1–8.3.** Biographies and portraits are the highest-value
      outstanding content item after the form endpoint: two profile pages and
      every agent card on the site are visibly thin without them, and no amount
      of design work substitutes for them.
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

### Session 4 — 2026-08-24 · Property & listing system
Built the provider architecture, thirteen listing components, the four index
pages and the property detail page, plus `IDX_INTEGRATION.md`. Migrated the
homepage off the old ad-hoc listing types and deleted them
(`src/data/listings.ts`, `src/data/demo/listings.demo.ts`,
`src/components/ui/ListingCard.astro`).

Three bugs found by testing rather than by reading the code:

1. **Shared filter URLs did nothing.** The site is statically generated, so
   Astro cannot read a query string at build time — the server-rendered filter
   form was always empty, and the client then read that empty form and applied
   no filters. `?location=Hollywood` returned everything. The client now
   hydrates the form from the URL before applying, which is what makes a search
   shareable at all.
2. **The sort control was inert.** It sits outside the `<form>` and is
   associated by its `form` attribute, so `FormData` picked up its value but
   its change event never bubbled to the form's listener. Sorting by price
   ascending left the most expensive property first. It has its own listener
   now.
3. **No-JavaScript pagination was a dead end.** The server rendered page one
   and pagination links that all returned page one, because a static page
   cannot serve page two of a filtered set. Every card now renders visible and
   pagination stays hidden until the client takes over, so without JavaScript
   the page is a complete browsable list instead of a broken one.

Also corrected: an odd final row in the specification table left an empty grey
cell.

### Session 5 — 2026-08-24 · Developments subsystem
Built the provider architecture, twelve components, both index pages and the
detail page, plus `DEVELOPMENTS_DATA.md`. Moved the gallery lightbox to
`src/lib/gallery.ts` so listings and developments share one implementation, and
migrated the homepage preview off the old data file.

One bug found by testing:

**The category never reached the client script.** The index passed it through a
`window.__hcDevelopmentCategory` global set by an inline script — which
`astro check` rejected as untyped, and which would have silently defaulted to
`new` on the Established page had it shipped. The category now travels as a
`data-category` attribute on the filter form, which the script reads directly:
no global, no type hole, and the value is visible in the DOM where it belongs.

Worth recording for future sessions: the same three things caught in session 4
were all designed out from the start here — the client hydrates the form from
the URL, the sort control lives inside the form, and no-JavaScript gets the
full list rather than broken pagination.

### Session 6 — 2026-08-26 · Buyer & seller conversion pages
Built the lead-form service, four form components, the valuation seam and five
pages. Six bugs found and fixed by testing (all listed under Session 6 above);
the two worth remembering:

**A required radio group reports every one of its options as missing.** That is
what the HTML spec says — if any radio in a group is `required` and none is
checked, *all* of them suffer from being missing. Reported straight through,
the error summary listed the same problem once per option. Anything that walks
a form's fields and reports failures needs to collapse radio groups by name.

**Tailwind 4's `color-mix()` defeats string-based contrast checking.**
`text-white/55` computes to `oklab(0.999994 … / 0.55)`, and a regex pulling
numbers out of that reads `0.999994` as a red channel of 1 — near-black. The
earlier contrast passes were measuring nonsense for every opacity-modified
colour. The sweep now paints each colour onto a 1×1 canvas and reads the pixel
back, which is syntax-agnostic. It immediately found two placeholder markers
sitting at 2.2:1 that had been shipping since session 1.

Also worth recording: **the honest state is a design problem, not just a
correctness one.** A form with nowhere to send its data could have been a
disabled button and an apology. Instead it hands back what you typed, attached
to an email link and two phone numbers — which is arguably better than a
success message, and cost about thirty lines.

### Session 7 — 2026-08-27 · About, profiles & testimonials
Built four pages, six profile components, three testimonial components, and
reshaped `src/data/testimonials.ts` to the specified contract. Added
`agentProfilePath` to `ListingQuery` so a profile page can show one person's
listings without showing the other's.

The interesting problem this session was not technical. It was: **what is an
"about" page when you have been given four facts about each person?** The
temptation is to reach for the things every competitor writes — years in the
business, homes sold, a warm paragraph about a passion for South Florida — and
every one of them would have been invented. So the pages were built the other
way round: say what is checkable, and say plainly why the rest is missing.

That turned out to produce better copy than a padded version would have. "Most
real estate websites open with a number. You have no way to check any of it" is
a stronger opening than an unverifiable statistic, and it is true.

Three things worth remembering:

**A component that only works empty is not finished.** Both the empty and the
populated paths were tested by temporarily patching in test bios, specialities
and five testimonials — one deliberately `verified: false` — building, running
32 assertions against the populated output, then reverting and re-scanning the
build for leakage. That caught nothing broken, which is the point: the
supply-day change is now a known-good path rather than a hope.

**Match on identity, not on a name.** `agentProfilePath` compares against the
profile path the provider set rather than the agent's name, because an MLS
returns "Martin Hoffman", "Hoffman, Martin P.A." or a middle initial depending
on the feed. A name match would have looked correct in the demo build and shown
an empty section forever in production.

**WCAG 2.2 SC 2.5.8 is not a flat 24×24 rule.** A first pass flagged every
stacked contact link on the new pages. The success criterion has an explicit
spacing exception — an undersized target passes if a 24px circle centred on it
does not intersect another target's circle — and the contact lists clear it.
The test now implements the criterion as written rather than an approximation
of it, so it stops producing false failures on correct markup.

### Session 8 — 2026-08-27 · Communities architecture
Fifteen communities, one template, twelve components, a client-side filter and
a rebuilt `/relocation/`. Three bugs found by testing; two are worth carrying
forward.

**A safety net that fails open is worse than no safety net.** Adding a path
alias to `navigation.ts` made it unresolvable under plain Node, where
`scripts/verify-links.mjs` imports it directly. A `.catch()` turned that into
`allNavHrefs: null`, the script printed "0 from the nav config", and **exited
zero**. The dead-link check had been disabled and the only evidence was one
number in a line of output nobody reads closely. It was caught because the
number had been 35 in the previous build and was 0 in this one.

Two fixes, and the second matters more: the import is relative with an explicit
extension, *and* the script now exits non-zero if the import fails or if
`allNavHrefs()` returns nothing. Any check that can silently stop checking
should be made to fail loudly instead — that is the general lesson, and it is
worth auditing the other scripts for the same shape.

**Two different facts need two different fields.** `kind` was originally
inferred from `parent === null`. That reads as "no parent means it is a city",
which is false for Sheridan Lakes — it is a neighbourhood whose municipality we
have not confirmed. The inference put it under a heading reading "Choose a
city" on `/sell/median-home-values/`. Unknown and absent are not the same
value, and a schema that cannot tell them apart will eventually assert the
wrong one.

Also worth recording: **the empty state is the design.** The lifestyle section,
the subarea section and the FAQ all render nothing rather than generic cards.
That was a deliberate choice, not an omission — a "Lifestyle" band containing
Dining, Beaches and Schools would look finished and say nothing, and would make
it much less likely that anyone ever writes the real thing.

### Session 10 — 2026-08-27 · Contact, accounts & legal pages
Five routes, and two of them turned on questions about what a page is allowed
to *appear* to do.

**A password field with nothing behind it is not a placeholder.** The brief
listed email and password for `/login/`, and the same brief said not to
implement fake authentication or store passwords. Those pull in opposite
directions only until you notice what a decorative password field actually
does: browsers offer to save it, password managers fill it, and people type a
credential they use elsewhere into a page with no backend to protect it. So no
page on this site renders one, in any build mode — the credential step belongs
to the provider, on the provider's origin, which is also what
`CONTENT_PENDING.md` 5.10 already required.

The enforcement is in the shape of the contract rather than a comment:
`AuthProvider` has no method that accepts a credential. An interface is an
invitation, and a `signIn(email, password)` parameter eventually gets accepted.

**Honest does not have to mean empty.** `/register/` could have been a
statement that accounts do not exist. Instead it collects the four fields the
brief specified and sends them as a `property-alerts` enquiry for Martin and
MaryEllen to action by hand — a real service, using the existing lead
transport, with no password and no claim to have created anything. The page
says so in the hero, above the form, and in the heading, because someone who
clicked "create account" should learn within a sentence that they are not
creating one.

**A plausible legal draft is worse than an empty slot.** Neither the privacy
policy nor the terms could be written, so neither was. What could be written is
a *factual* description of the software — no analytics, no cookies, no
third-party requests, two per-device values in the browser — every line of it
verified against the code and labelled on the page as not being the policy.
That distinction is the whole point: describing what the software does is
engineering, and promising what an organisation will do with personal data is
not. `/terms/` got the stricter treatment and carries no contractual language
at all.

**Testing found the smaller things.** Standalone link targets were 20px tall at
390px, under SC 2.5.8's 24px floor; the pending heading read "Terms of Use is
being prepared". It also surfaced a site-wide target-size gap on breadcrumbs
and contact lists that predates this session and touches all 45 pages —
recorded as problem 22 rather than fixed in passing, because shared components
with 45 call sites are not a side quest.

**Two of the three "failures" in the first test run were the test being
wrong**, in a way worth remembering: it flagged the page for containing "has
been sent" (the fallback's honest line is "nothing has been sent") and for
containing "disclaim" (a reference to MLS wording that is still pending). An
assertion that matches on a substring will eventually accuse the correct
behaviour.

### Session 9 — 2026-08-27 · Resources system
Six routes, a content collection, a tested calculator, and unit tests wired
into the build. Five bugs found by testing; three are worth carrying forward.

**The same Tailwind ordering trap, in a new disguise.** Problem 6 in the table
above has been about display utilities since session 2: `.inline-flex` is
emitted after `.hidden`, so passing `hidden` into a component that sets its own
display silently does nothing. This session hit it with *width* — a shared
`field` class carrying `w-full` overrode a `w-28` at the call site, and the
calculator ran 31px past the viewport at 390px.

The lesson generalises past the specific utilities: **never bake a width or a
display utility into a shared class string.** Both instances were invisible in
code review and only appeared in a 390px browser test, which is the argument
for keeping that test cheap enough to run every time.

**Put the disclaimer where it is read, not where it is convenient.** "Not a
lending quote" was inside the results panel — technically present, invisible
until you had already calculated and read a number. A caveat that arrives after
the thing it qualifies is decoration. It now sits beside the form, always
visible. Worth auditing the other disclaimers on the site for the same shape.

**A filter should match what people would obviously type.** Searching
"relocation" in the journal returned nothing, because the filter covered title,
excerpt and tags but not the category — consistent with its own rules and
useless to a person. The fix was one line; noticing it needed someone using the
thing rather than reading it.

Also worth recording: **unit tests now run inside `npm run build`**, for the
same reason `verify-links` does. A check that only runs when someone remembers
is a check that has already stopped running. The mortgage maths is the first
thing on this site with arithmetic worth being wrong about, and its expected
values are computed independently of the implementation — a test that
re-derives its expectation the same way the code does proves nothing.
