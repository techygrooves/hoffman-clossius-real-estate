# LEGACY_REDIRECTS.md

Mapping the existing site's URLs onto this one, so its search equity survives
the migration.

**Nothing is mapped yet, and nothing here is a guess.** The complete URL
inventory of the current hoffmanandclosius.com has not been supplied, and a
redirect map assembled from assumptions is worse than none: a wrong 301 sends
both a visitor and a crawler somewhere confidently incorrect, and it is
invisible afterwards because it returns 200.

This file is the format and the method. Fill it in once the inventory exists.

---

## 1. Why this matters more than it looks

A page that has been indexed for years carries links, rankings and direct
traffic. When its URL changes:

- a **301** passes nearly all of that to the new URL;
- a **404** discards it, and the rankings do not come back on their own;
- a **redirect to the homepage** is treated by Google as a soft 404 and passes
  little or nothing. It is the most common migration mistake, and it looks
  tidy while losing almost everything.

So every old URL needs its own considered destination, not a catch-all.

---

## 2. Before anything else: one canonical host

`site.url` is `https://www.hoffmanandclosius.com` and every canonical,
`og:url` and sitemap entry is built from that exact origin.

**The host must 301 the apex to `www`**, and http to https:

| From | To | Status |
| --- | --- | --- |
| `http://hoffmanandclosius.com/*` | `https://www.hoffmanandclosius.com/*` | 301 |
| `http://www.hoffmanandclosius.com/*` | `https://www.hoffmanandclosius.com/*` | 301 |
| `https://hoffmanandclosius.com/*` | `https://www.hoffmanandclosius.com/*` | 301 |

Without this, the site resolves at two hosts, they compete as duplicates, and
the canonical tags fight the served URLs. This is a hosting configuration, not
a code change.

**Trailing slashes.** This site is built with `trailingSlash: 'always'` and
`build.format: 'directory'`, so every route is a folder with its own
`index.html` and the canonical URL always ends in `/`. If the old site used
extensionless or `.html` URLs, those need mapping too — see §4.

---

## 3. Getting the inventory

The map cannot be written from a sitemap alone; a sitemap lists what the old
site *offers*, not what actually earns traffic. Gather all four:

| Source | What it gives | How |
| --- | --- | --- |
| **Google Search Console** | Every URL Google has indexed, with clicks and impressions — the ones that actually matter | Performance → Pages, export 12 months; Indexing → Pages |
| **The old site's sitemap** | What it intended to publish | `hoffmanandclosius.com/sitemap.xml` |
| **A crawl of the old site** | What is actually reachable, including pages missing from the sitemap | Screaming Frog (free to 500 URLs) or similar |
| **Server access logs / analytics** | URLs receiving real traffic, including ones nobody remembers | From the current host |

Then sort by traffic. A long tail of zero-traffic URLs can share a sensible
section destination; the top pages each need a deliberate one.

---

## 4. The table to fill in

One row per old URL. Do not delete rows once done — this file is the record of
what was decided and why.

| # | Old URL | New URL | Status | Confidence | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | | | 301 | | |
| 2 | | | 301 | | |

**Columns**

- **Old URL** — path only, exactly as indexed, including any query string that
  formed a distinct page.
- **New URL** — a path on this site. If there is no equivalent, say so and pick
  the nearest *section*, never the homepage.
- **Status** — 301 for a permanent move (almost always). 410 for a page that is
  genuinely gone and should be dropped from the index deliberately.
- **Confidence** — `exact` (same content), `near` (same subject, rewritten),
  `section` (no equivalent; nearest parent). Anything below `exact` is a
  judgement someone should review.
- **Notes** — why, especially for anything not `exact`.

### Known shape of the new site

The destinations available, for reference when mapping:

```
/                          /buy/                      /communities/
/about/                    /buy/dream-home-finder/    /communities/<slug>/
/about/martin-hoffman/     /sell/                     /developments/new/
/about/maryellen-closius/  /sell/home-evaluation/     /developments/existing/
/properties/for-sale/      /sell/median-home-values/  /developments/<slug>/
/properties/for-rent/      /relocation/               /blog/
/properties/our-listings/  /testimonials/             /blog/<slug>/
/properties/search/        /faq/                      /resources/buying-guide/
/property/<slug>/          /contact/                  /resources/selling-guide/
/mortgage-calculator/      /accessibility/            /privacy-policy/  /terms/
```

### Property URLs are the hard case

Old listing URLs almost never map one-to-one: the properties have sold, and
this site's property routes are generated from the IDX feed
(`/property/<slug>/`, slug derived from MLS number plus address). A sold
listing has no equivalent here.

Send those to the relevant **search or community** page rather than to a
property that is not the one requested — and never to the homepage. Decide the
rule once, apply it consistently, and record it here.

---

## 5. Implementing

Depends on the host (`CONTENT_PENDING.md` 3.2, still unconfirmed):

- **Apache / cPanel / Hostinger** — `.htaccess` with `Redirect 301` or
  `RewriteRule` lines. Keep them ordered most-specific first.
- **Netlify** — a `_redirects` file in `dist/`.
- **Vercel** — `vercel.json` `redirects`.
- **Cloudflare Pages** — a `_redirects` file, same format as Netlify.

Whichever it is, the redirect list becomes a build artefact and belongs in
this repository so it is reviewable and versioned.

---

## 6. Launch checklist

- [ ] Complete URL inventory gathered from all four sources in §3
- [ ] Every URL with recorded traffic mapped individually
- [ ] Apex → `www` and http → https redirects configured (§2)
- [ ] No redirect chains — old URL goes to its final destination in one hop
- [ ] No redirect loops
- [ ] Nothing lands on a 404, and nothing is parked on the homepage
- [ ] Redirects tested against the live list **before** DNS is switched
- [ ] `sitemap-index.xml` submitted in Google Search Console and Bing Webmaster
      Tools on launch day
- [ ] Old sitemap left reachable for a period, so crawlers rediscover the old
      URLs and follow the 301s
- [ ] Search Console watched weekly for the first month: Coverage errors, and
      the Performance report compared against the pre-launch baseline
- [ ] Baseline exported **before** launch, or there is nothing to compare to
