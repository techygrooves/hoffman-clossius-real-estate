# SEO_PHASE_2.md

The content and strategy phase. **None of this has been done**, deliberately —
this file is the scope, not the work.

What exists today is the technical foundation: unique titles and descriptions
on every route, canonical URLs on one confirmed host, robots directives, Open
Graph and Twitter metadata, a sitemap, breadcrumbs, and structured-data
generators that emit only what the client has actually confirmed. That is the
platform. What follows is the campaign.

---

## The rule that governs all of it

Everything here still obeys `PROJECT_CONTEXT.md` §9: **no invented facts.** SEO
work creates unusually strong pressure to break that rule, because the highest-
converting content is exactly the content that needs figures — median prices,
days on market, school ratings, "best neighbourhood for…". Every one of those
needs a citable, dated source, and none may be written to fill a template.

A page that ranks on an invented statistic is a liability that ranks.

---

## 1. Keyword research

- Terms Martin and MaryEllen are actually asked, not just terms with volume.
- Intent split: buying vs selling vs relocating vs browsing. A "homes for sale
  in Hollywood FL" searcher and a "should I sell now" searcher need different
  pages, and one page serving both serves neither.
- Realistic difficulty. National portals own the generic head terms; the
  winnable ground is specific — a neighbourhood, a building, a situation.
- Map each target term to **one** page. Two pages targeting one term compete
  with each other.

## 2. Competitor analysis

- Which local teams and brokerages rank for the target terms, and what those
  pages actually contain.
- Where the portals (Zillow, Realtor.com, Redfin) are unbeatable, and where a
  two-person team with genuine local knowledge can outrank them — usually
  depth on a small area, not breadth.
- Gap analysis against the fifteen community guides already scaffolded.

## 3. Location SEO

- Which cities and neighbourhoods to prioritise, given the three counties
  served.
- Whether any warrant a dedicated landing page beyond the community guide.
- **No `LocalBusiness` address markup until an office address is confirmed**
  (`CONTENT_PENDING.md` 2.1). Local SEO leans heavily on NAP consistency, and
  the site currently has no verified A.

## 4. Community content expansion

Fifteen guides exist as pages with a one-line locational fact each. They are
the largest content opportunity on the site — and the largest risk.

- Real guide copy in `introduction` on each record in `src/data/communities.ts`.
- Lifestyle points (`highlights`) — client-approved, each one something they
  will stand behind.
- **No school ratings, crime statistics, median prices, population figures,
  commute times, appreciation rates or "best of" superlatives** without a
  citable, dated source. That list is in the header of `communities.ts` and it
  does not relax for SEO.
- Photography per community (`CONTENT_PENDING.md` 9.6). The card design already
  switches to its photographic treatment per community as images land.

## 5. Title and meta optimisation

Titles today are clean and descriptive. Phase 2 revisits them **with data**:

- Search Console query data per page, once there is some.
- Click-through rate against position — a page ranking 6th with a poor CTR is a
  title problem, not a ranking problem.
- The `seo` object is already reserved and empty on every community record and
  every journal post. It stays empty until this phase.
- Still no keyword stuffing: a title is read by a person deciding whether to
  click.

## 6. Internal linking strategy

- Deliberate hub-and-spoke: community guides ↔ property search ↔ relevant
  journal articles.
- Descriptive anchor text rather than "read more".
- An orphan check — every indexable page reachable from navigation or
  in-content links, not only from the sitemap.
- `npm run verify:links` already fails the build on a dead link; it does not
  yet assess whether the linking is *useful*.

## 7. Blog plan

- An editorial calendar the team can actually sustain. One good post a month
  beats four thin ones and then silence.
- Topics from real client questions — the FAQ is a source list.
- **Articles are written, never generated** (`docs/authoring-blog-posts.md`).
  Every post carries a named byline, which makes a fabricated one worse than
  fabricated listing data.
- Delete the two `sample-*.md` placeholders once the first real article lands.

## 8. Schema refinement

The generators exist in `src/lib/seo/schema.ts` and each returns `null` when
its facts are missing. Phase 2 turns some of them on:

- `FAQPage` — wired and **emitting nothing**, gated on `reviewed: true` per
  answer in `src/data/faqs.ts`. Reviewing the 24 drafted answers switches it on
  with no code change.
- `RealEstateListing` — implemented, called by nothing, and refuses demo
  records. Activates with the IDX feed.
- `SearchAction` / sitelinks searchbox — deliberately absent, because it would
  advertise a search that currently returns nothing. Add with the feed.
- `LocalBusiness` address / `openingHours` / `geo` — blocked on 2.1–2.3.
- **Never** `aggregateRating` or `review`. The site holds no ratings and no
  review counts, and marked-up ratings render as stars in a search result.

## 9. Google Search Console

- Verify the property (`pending.analytics.googleSiteVerification` in
  `src/config/site.ts` is wired and empty).
- Submit `sitemap-index.xml`.
- **Export a traffic baseline from the old site before launch.** After the
  switch there is nothing to compare against, and this is not recoverable.
- Watch Coverage weekly for the first month.

## 10. Bing Webmaster Tools

- Verify and submit the same sitemap. Can import from Search Console.
- Worth the twenty minutes: Bing also feeds several assistants' answers.

## 11. Local SEO / Google Business Profile

- Blocked on the office address (2.1) and a decision about whether the team
  publishes one at all.
- NAP consistency across GBP, the site footer and every directory listing —
  the name, address and phone must match character for character.
- Review strategy is a **client decision with real constraints**: reviews may
  only be published here with permission (10.1c), and no rating may be
  displayed or marked up without a source.

## 12. Migration redirect mapping

See `LEGACY_REDIRECTS.md`. It is listed here because it is the single
highest-risk SEO task in the project and it is time-bound: the mapping must be
complete and tested **before** DNS switches, and the old site's URL inventory
must be captured before it goes away.

---

## Suggested order

1. **Redirect mapping** (`LEGACY_REDIRECTS.md`) — time-bound, and the inventory
   disappears with the old site.
2. **Search Console + Bing**, with a pre-launch baseline exported.
3. **Keyword research and competitor analysis** — everything below depends on it.
4. **FAQ review** — 24 answers already written; reviewing them switches on
   `FAQPage` markup for free.
5. **Community guide copy and photography** — the largest content opportunity.
6. **Title/meta optimisation**, once Search Console has data to optimise against.
7. **Blog plan**, sustainably.
8. **Local SEO / GBP**, once an address exists.
