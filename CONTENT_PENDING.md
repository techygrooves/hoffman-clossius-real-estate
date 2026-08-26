# CONTENT_PENDING.md

Information the client must confirm. **Nothing on this list may be invented,
guessed, approximated or filled in with a plausible substitute.** When an item
is confirmed, add it to `src/config/site.ts`, delete the entry here, and note
the change in `BUILD_PROGRESS.md`.

Status key: 🔴 blocking · 🟠 needed soon · 🟡 needed before launch

---

## 1. Brand assets

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1.1 | **Official Keyes logo — light background** | 🔴 | Drop at `public/brand/keyes-logo.svg` (`.png`/`.webp` accepted). Until then the header, drawer and footer show a **neutral graphic placeholder** — a generic image glyph, deliberately not a wordmark, so nothing on the site approximates the Keyes trademark. |
| 1.2 | **Official Keyes logo — reversed / white** | 🔴 | `public/brand/keyes-logo-white.svg`, for the evergreen footer. |
| 1.3 | Logo intrinsic dimensions | 🔴 | Set `brokerageBrand.width` / `.height` in `src/config/site.ts` once the file exists, so the aspect ratio is exact. |
| 1.4 | Any Keyes brand-usage guidelines | 🟠 | Minimum clear space, minimum size, permitted backgrounds. |
| 1.5 | `apple-touch-icon.png` (180×180) and `favicon.ico` | 🟡 | A Hoffman & Closius monogram `favicon.svg` exists; the raster versions still need producing. |

> The logo is displayed unmodified and with **no explanatory relationship
> wording**. See `PROJECT_CONTEXT.md` §4.

---

## 2. Business details

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 2.1 | **Office address** | 🔴 | Street, suite, city, state, ZIP. Needed for the footer, `/contact/`, and `RealEstateAgent` structured data. **Do not manufacture one.** |
| 2.2 | Shared office phone | 🟠 | Only the two direct lines are confirmed. |
| 2.3 | Office hours | 🟡 | Publish only if the client wants them shown. |
| 2.4 | Mailing address, if different | 🟡 | |
| 2.5 | Spelling of the team name | 🟠 | Brief and site use **"Closius"**; the git repository is named `hoffman-clossius-real-estate` (double *s*). Confirm which is correct before launch — it appears in the wordmark, page titles and the domain. |

---

## 3. Domain and hosting

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 3.1 | **Primary production domain** | 🔴 | `site.url` in `src/config/site.ts` is the placeholder `https://hoffmanclosius.com` with `urlConfirmed: false`. While that flag is false the build **suppresses `<link rel="canonical">` and `og:url`** rather than publish a wrong host. Set both once confirmed and regenerate `public/robots.txt`. |
| 3.2 | Static host / deployment target | 🟠 | Netlify, Vercel, S3, cPanel…? Affects redirects and the 404 wiring. |
| 3.3 | Redirects from the existing site | 🟠 | Old URL → new URL map, so existing search rankings survive. |
| 3.4 | Google Search Console verification token | 🟡 | `pending.analytics.googleSiteVerification`. |

---

## 4. Legal and disclosures

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 4.1 | **Brokerage legal name for the footer** | 🔴 | Exact wording as the brokerage requires it. |
| 4.2 | **Required brokerage/Keyes footer disclosure** | 🔴 | Verbatim text, if any is mandated. |
| 4.3 | Florida real estate licence numbers | 🔴 | For Martin and MaryEllen individually. |
| 4.4 | **Fair Housing / Equal Housing Opportunity** | 🟠 | Confirm whether the Fair Housing statement and/or the Equal Housing Opportunity and REALTOR® marks must appear in the footer, and supply the approved wording and artwork. The footer renders them automatically once `pending.legal` is populated — nothing is invented meanwhile. |
| 4.5 | MLS attribution + IDX disclaimer wording | 🔴 | Mandated by the MLS; exact text comes from the IDX provider. |
| 4.6 | DMCA notice text | 🟡 | |
| 4.7 | Privacy policy source text | 🟠 | Drafted only once forms, analytics and embeds are known — the policy must describe what the site actually does. |
| 4.8 | Terms of use source text | 🟠 | |
| 4.9 | Accessibility statement contact route | 🟠 | Who receives accessibility reports, and by what channel. **The statement will not claim ADA certification.** |

---

## 5. IDX / MLS integration

Nothing on this site is connected to an MLS. The provider architecture is
built and waiting — see `IDX_INTEGRATION.md` for how it plugs in. Every item
below must come from the client or the provider; none may be assumed.

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 5.1 | **Authorised IDX/MLS provider** | 🔴 | Which provider is the client contracted with and authorised to display data from? e.g. IDX Broker, Showcase IDX, iHomefinder, Realtyna, a RESO Web API feed, or the MLS directly. **Do not assume — displaying MLS data without authorisation is a contract breach, not a technical detail.** |
| 5.2 | **API documentation** | 🔴 | Endpoint reference, authentication method, query parameters, response schema, rate limits, sandbox environment if there is one. Needed to write the adapter in `idxProvider.ts`. |
| 5.3 | **Credentials** | 🔴 | API key/secret, account ID, and any allow-listed domains or IPs. Given to whoever deploys, stored as server-side environment variables. **Never committed, and never `PUBLIC_`-prefixed** — that would ship the key to every visitor. |
| 5.4 | **Agent / office MLS IDs** | 🔴 | Required for `/properties/our-listings/` to filter to the team's own listings. |
| 5.5 | **Listing attribution requirements** | 🔴 | The exact courtesy line ("Listing information provided courtesy of …"), whether the listing brokerage must be named on each card or only on the detail page, and any required MLS logo artwork. **Verbatim — this wording is dictated by the MLS and may not be written by us.** |
| 5.6 | **Required MLS disclaimers** | 🔴 | The full disclaimer paragraph, where it must appear (index pages, detail pages, or both), and any required "information deemed reliable but not guaranteed" language. Renders automatically once `attribution.disclaimer` is set. |
| 5.7 | **Refresh and cache requirements** | 🔴 | How often data must be refreshed, the maximum permitted staleness, whether records may be cached or must be fetched live, and how quickly a withdrawn listing must disappear. **This decides whether a build-time fetch is permitted at all**, or whether the site needs a runtime proxy. |
| 5.8 | Photo usage and caching rules | 🟠 | May images be downloaded and re-served, or must they be hot-linked from the provider? Any watermark or attribution requirement? |
| 5.9 | Search URL structure | 🟠 | Whether the provider owns `/properties/search/` or is embedded within it. |
| 5.10 | Saved-search / account behaviour | 🟠 | `/login/` and `/register/` are provider-hosted. This site must never collect credentials directly. The current "save property" button is a per-device placeholder only. |
| 5.11 | Expected feed size | 🟡 | Dozens, hundreds or thousands? Decides whether the browser can keep filtering client-side or the provider must paginate — see `IDX_INTEGRATION.md` §7. |

> Until 5.1–5.7 are supplied, `idxProvider.ts` stays unimplemented, the site
> serves the unconfigured provider, and every listing page shows
> "Live property search is being configured." That is the correct behaviour.

## 6. Forms

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 6.1 | **Form destination** | 🔴 | Email inbox, CRM, Formspree/Netlify Forms, or the IDX provider's lead capture. Blocks `/contact/`, `/buy/dream-home-finder/`, `/sell/home-evaluation/`. |
| 6.2 | Which fields are required | 🟠 | Especially for the Dream Home Finder and the home evaluation request. |
| 6.3 | **Lead routing** | 🟠 | Do enquiries go to Martin, MaryEllen, or both? Also governs the mobile action bar's **Call** button: with no confirmed shared number and no routing rule, it opens a chooser listing both direct lines rather than silently picking an agent. Confirm a single number and it can dial directly. |
| 6.4 | Spam protection | 🟠 | Honeypot, hCaptcha, provider-side — affects whether third-party script is added. |
| 6.5 | Consent / opt-in wording | 🟠 | Required text under the submit button. |
| 6.6 | Confirmation behaviour | 🟡 | Inline message or a thank-you page. |

---

## 7. Social and reviews

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 7.1 | Facebook URL | 🟠 | `pending.social.facebook`. Footer links appear only when set. |
| 7.2 | Instagram URL | 🟠 | |
| 7.3 | LinkedIn URL(s) | 🟠 | Per person or shared. |
| 7.4 | YouTube / video URL | 🟡 | |
| 7.5 | **Google review URL** | 🟠 | The place/review link. **No review counts or ratings until supplied.** |
| 7.6 | **Zillow profile / review URL** | 🟠 | Same rule. |
| 7.7 | Realtor.com profile | 🟡 | |

---

## 8. People — copy and imagery

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 8.1 | **Martin Hoffman — biography** | 🔴 | In his own words, or approved by him. Not to be written from scratch. |
| 8.2 | **MaryEllen Closius — biography** | 🔴 | Same. |
| 8.3 | **Professional portraits** | 🔴 | High resolution, plus photographer credit if required. Set `professionals[].portrait` in `src/config/site.ts` and the homepage, About pages and agent cards all pick it up. Portrait orientation (4:5) suits the slot best. |
| 8.4 | Designations, memberships, languages | 🟠 | Only the two confirmed titles are on record. |
| 8.5 | Areas of focus / specialities | 🟠 | Beyond MaryEllen's confirmed "Relocation Specialist". |
| 8.6 | Team story — how they work together | 🟠 | For `/about/`. |

---

## 9. Photography

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 9.1 | **Homepage hero photography** | 🔴 | The design depends on strong South Florida imagery. Licensed or client-owned only. Drop the file under `/public/images/home/` and set `heroImage` at the top of `src/components/home/HomeHero.astro` — one line, no other change. A muted background video can replace the same slot later. |
| 9.2 | Interior page hero images | 🟠 | `PageHero` supports an image variant; pages use the plain variant until real photography exists. |
| 9.3 | Community / neighbourhood photography | 🟠 | |
| 9.4 | Image licensing and credits | 🟠 | Confirm usage rights for every supplied image. |
| 9.5 | Alt text intent | 🟡 | What each image is meant to convey, so alt text is accurate. |
| 9.6 | **Community card imagery** | 🟠 | One image per community (Hollywood, Fort Lauderdale, Dania Beach, Hallandale Beach, Pembroke Pines, Aventura). Set `heroImage` on each entry in `src/data/communities.ts`. |
| 9.7 | Relocation section image | 🟡 | One supporting image for the "Moving to South Florida?" band. |

---

## 10. Editorial content

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 10.1 | **Testimonials** | 🟠 | Real, attributable quotes with permission to publish. `src/data/testimonials.ts` stays empty until then, and each entry needs `verified: true` — meaning the client has confirmed the quote and that we may publish it. Unverified entries never render. **No sample testimonials, in any environment.** |
| 10.2 | **FAQ answers** | 🟠 | Questions touching process, fees and Florida practice must be client-reviewed. |
| 10.3 | Buying guide content | 🟠 | |
| 10.4 | Selling guide content | 🟠 | |
| 10.5 | **Community guide copy — six pages already live** | 🟠 | The navigation names Hollywood, Fort Lauderdale, Dania Beach, Hallandale Beach, Pembroke Pines and Aventura, so those six routes now exist. Each currently carries **only a one-line verifiable locational fact** (which county it sits in and where, relative to its neighbours) and an "in preparation" band. Real guide copy, photography and any figures — with sources — are needed. No statistics, school ratings, median values or superlatives may be added without them. |
| 10.5a | Any further communities to add | 🟡 | Beyond the six above. |
| 10.6 | **Developments to feature** | 🟠 | Which projects should appear under New and Established. For each: the published starting price, delivery year, residence count, developer and architect, amenities and residence types — **published figures only, never estimates**. Supply guide: `DEVELOPMENTS_DATA.md`. |
| 10.6a | **Written permission for developer imagery** | 🔴 | Renderings, photographs and site plans are copyrighted developer material. Nothing may be published without the client holding written permission. **Nothing has been downloaded from any developer's site.** |
| 10.6b | **Authorised floor plans** | 🟠 | Floor plans are never drawn, approximated or reconstructed. Until an authorised asset exists, each residence type says "Floor plans are available on request". |
| 10.6c | Which images are renderings | 🟠 | Each image needs `isRendering` set truthfully, so a buyer is never shown an artist's impression as though it were a finished building. |
| 10.6d | Availability wording per development | 🟡 | Free text, exactly as the developer states it. Availability changes constantly and the site publishes only what it was told. |
| 10.7 | Median home value data source | 🟠 | Every figure needs a source and a date. |
| 10.8 | Relocation content | 🟠 | What MaryEllen's relocation service actually includes. |
| 10.9 | Journal / blog articles | 🟡 | Authoring format: `docs/authoring-blog-posts.md`. |

---

## 11. Tooling and third parties

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 11.1 | Google Analytics / GA4 ID | 🟡 | Affects the privacy policy and the cookie position. |
| 11.2 | Cookie consent requirement | 🟠 | Depends on analytics and on the IDX provider's tracking. |
| 11.3 | Mortgage calculator assumptions | 🟠 | Default rate, term, tax and insurance rates — must be presented as estimates with a clear disclaimer, never as a lending offer. |
| 11.4 | Map provider | 🟡 | For property and community maps, if wanted. |
| 11.5 | Live chat / scheduling tool | 🟡 | |

---

## Active placeholders currently in the codebase

Every placeholder shipped today, so none can be forgotten:

| Placeholder | Where | Removed when |
| --- | --- | --- |
| Neutral dashed image-glyph box in the header, drawer and footer | `src/components/layout/KeyesLogo.astro` | 1.1 / 1.2 supplied |
| `site.url = 'https://hoffmanclosius.com'`, `urlConfirmed: false` | `src/config/site.ts` | 3.1 confirmed |
| "Content for this page is on the way" band | `src/components/sections/InPreparation.astro`, on every stub route | Each page is built out |
| Empty data modules | `src/data/*.ts` | The matching source is confirmed |
| Six community pages carrying only a locational one-liner | `src/data/communities.ts` | 10.5 supplied |
| Social icon slots rendering nothing | `src/components/layout/SocialLinks.astro` | §7 URLs supplied |
| Abstract media placeholders in every image position | `src/components/ui/MediaSlot.astro` | §9 photography supplied |
| Twelve demo listings, dev-only, badged "Sample" | `src/lib/listings/demoData.ts` | §5 IDX feed connected (delete the file) |
| "Save property" stored per-device only | `src/lib/listings/favorites.ts` | 5.10 — replaced by the IDX account system |
| Map placeholder on property detail pages | `src/pages/property/[slug].astro` | 11.4 map provider chosen |
| Six demo developments, dev-only, badged "Sample" | `src/lib/developments/demoData.ts` | 10.6 supplied (delete the file) |
| Empty floor-plan slots on every residence type | `src/components/developments/DevelopmentResidences.astro` | 10.6b authorised plans supplied |
| Map placeholder on development detail pages | `src/components/developments/DevelopmentMap.astro` | 11.4 map provider chosen |
| Homepage empty states: listings, developments, testimonials, insights | the matching section components | Each data source is supplied |

No placeholder above is phrased as a factual claim about the client, and none
uses lorem ipsum.
