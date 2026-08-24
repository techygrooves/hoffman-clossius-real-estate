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

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 5.1 | **IDX provider name** | 🔴 | e.g. IDX Broker, Showcase IDX, iHomefinder, Realtyna, RESO Web API… |
| 5.2 | **Integration type** | 🔴 | iframe, JavaScript widget, or API feed. Determines whether search is truly static. |
| 5.3 | Account credentials / API keys | 🔴 | Supplied to whoever deploys — never committed to this repository. |
| 5.4 | **Agent / office MLS IDs** | 🔴 | Required for `/properties/our-listings/` to filter to the team's own listings. |
| 5.5 | Search URL structure | 🟠 | Whether the provider owns `/properties/search/` or is embedded within it. |
| 5.6 | Saved-search / account behaviour | 🟠 | `/login/` and `/register/` are provider-hosted. This site must never collect credentials directly. |
| 5.7 | Permitted photo usage and caching rules | 🟠 | |

> Until 5.1–5.4 are confirmed, `src/data/listings.ts` stays empty. **No sample
> listings, no scraping.**

---

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
| 8.3 | Professional portraits | 🔴 | High resolution, plus photographer credit if required. `professionals[].portrait` is `null` until then. |
| 8.4 | Designations, memberships, languages | 🟠 | Only the two confirmed titles are on record. |
| 8.5 | Areas of focus / specialities | 🟠 | Beyond MaryEllen's confirmed "Relocation Specialist". |
| 8.6 | Team story — how they work together | 🟠 | For `/about/`. |

---

## 9. Photography

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 9.1 | **Homepage hero photography** | 🔴 | The design depends on strong South Florida imagery. Licensed or client-owned only. |
| 9.2 | Interior page hero images | 🟠 | `PageHero` supports an image variant; pages use the plain variant until real photography exists. |
| 9.3 | Community / neighbourhood photography | 🟠 | |
| 9.4 | Image licensing and credits | 🟠 | Confirm usage rights for every supplied image. |
| 9.5 | Alt text intent | 🟡 | What each image is meant to convey, so alt text is accurate. |

---

## 10. Editorial content

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 10.1 | **Testimonials** | 🟠 | Real, attributable quotes with permission to publish. `src/data/testimonials.ts` stays empty until then. **No sample testimonials.** |
| 10.2 | **FAQ answers** | 🟠 | Questions touching process, fees and Florida practice must be client-reviewed. |
| 10.3 | Buying guide content | 🟠 | |
| 10.4 | Selling guide content | 🟠 | |
| 10.5 | **Community guide copy — six pages already live** | 🟠 | The navigation names Hollywood, Fort Lauderdale, Dania Beach, Hallandale Beach, Pembroke Pines and Aventura, so those six routes now exist. Each currently carries **only a one-line verifiable locational fact** (which county it sits in and where, relative to its neighbours) and an "in preparation" band. Real guide copy, photography and any figures — with sources — are needed. No statistics, school ratings, median values or superlatives may be added without them. |
| 10.5a | Any further communities to add | 🟡 | Beyond the six above. |
| 10.6 | Developments to feature | 🟠 | Plus permitted renderings and developer material. |
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

No placeholder above is phrased as a factual claim about the client, and none
uses lorem ipsum.
