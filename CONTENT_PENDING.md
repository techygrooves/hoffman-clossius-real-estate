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
| 6.1 | **Form destination — `PUBLIC_LEAD_FORM_ENDPOINT`** | 🔴 | **This is the one item that switches every form on.** A URL that accepts a `POST` of JSON: Formspree, Netlify Forms, a CRM webhook, a Zapier/Make hook, or the IDX provider's lead capture. Set it in `.env` (and in the host's build environment) as `PUBLIC_LEAD_FORM_ENDPOINT=https://…` and rebuild — no code change. Wired to `src/lib/forms/transport.ts`. **Until it is set, no form claims to have sent anything**: submitting shows the visitor their own answers with a prefilled email link to Martin and MaryEllen and both direct numbers. Affects `/contact/`, `/buy/dream-home-finder/`, `/sell/home-evaluation/`. |
| 6.1a | Confirm the endpoint carries no secret | 🟠 | `PUBLIC_` means the value is compiled into the page and visible to anyone — that is correct for a browser-submitted form, but the URL itself must not be a credential. A provider that needs an API key needs a server-side relay instead. |
| 6.2 | Which fields are required | 🟠 | Currently required — Dream Home Finder: name, email, preferred contact method. Home evaluation: address, city, ZIP, property type, name, email. Everything else is explicitly marked "(optional)". Confirm or change. |
| 6.3 | **Lead routing** | 🟠 | Do enquiries go to Martin, MaryEllen, or both? Also governs the mobile action bar's **Call** button: with no confirmed shared number and no routing rule, it opens a chooser listing both direct lines rather than silently picking an agent. Confirm a single number and it can dial directly. |
| 6.4 | Spam protection | 🟠 | Honeypot, hCaptcha, provider-side — affects whether third-party script is added. Choose alongside 6.1: most form services include it. |
| 6.5 | Consent / opt-in wording | 🟠 | Required text under the submit button. Today it says only that details are used to reply and links the privacy policy. **Nothing is pre-ticked and there is no marketing opt-in** — if one is wanted it must be an unticked checkbox, never a default. |
| 6.6 | Confirmation behaviour | 🟡 | Inline message (current) or a thank-you page. Also: should a copy of each enquiry be emailed to the sender? |
| 6.7 | Where submissions are stored, and for how long | 🟠 | Needed for the privacy policy (4.7). A CRM retains data; an email inbox retains it indefinitely. |

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
| 8.1 | **Martin Hoffman — biography** | 🔴 | In his own words, or approved by him. Not to be written from scratch. Set `professionals[0].bio` in `src/config/site.ts` to an **array of paragraphs** and `/about/martin-hoffman/` renders them verbatim, replacing the neutral stand-in and removing the "a fuller profile is on the way" note. No other change. |
| 8.2 | **MaryEllen Closius — biography** | 🔴 | Same, at `professionals[1].bio`. |
| 8.3 | **Professional portraits** | 🔴 | High resolution, plus photographer credit if required. Set `professionals[].portrait` in `src/config/site.ts` and the homepage, About pages, profile heroes and agent cards all pick it up. Portrait orientation (4:5) suits the slot best. |
| 8.3a | **Joint photograph of the two of them** | 🟠 | For the `/about/` hero, landscape (4:3). Currently the neutral placeholder — **never** a stock photograph of two people who are not Martin and MaryEllen. Set it in `src/pages/about/index.astro`, one `src` on the hero `MediaSlot`. |
| 8.4 | Designations, memberships, languages | 🟠 | Only the two confirmed titles are on record. Nothing on the site claims a certification, a designation, an association membership or a licence number, and nothing may be added without documentation — including anything that might be inferred from "Relocation Specialist". |
| 8.5 | **Areas of focus / specialities** | 🟠 | Beyond MaryEllen's confirmed "Relocation Specialist". Add strings to `professionals[].specialties` in `src/config/site.ts` and the "Areas of focus" section appears on that person's page; with an empty array it renders **nothing at all**, not an empty band. A speciality is a claim about competence, so each one needs the professional's own confirmation. |
| 8.6 | Team story — how they work together | 🟠 | For `/about/`. The page currently describes the shape of the team (two people, two licences, three counties, direct lines) without asserting any history, founding date or record. |
| 8.7 | What MaryEllen's relocation service actually includes | 🟠 | Her profile page describes what makes an out-of-state move *difficult* — properties of the problem, not of the service. No network, partner, corporate programme, referral membership or number of relocations handled is claimed. See also 10.8. |

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
| 10.1 | **Testimonials** | 🟠 | Real, attributable quotes with permission to publish. `src/data/testimonials.ts` stays empty until then, and each entry needs `verified: true` — meaning the client has confirmed the quote and that we may publish it. Unverified entries never render. **No sample testimonials, in any environment.** Per entry: `quote` (as written, not tidied), `clientName` (as they want to be credited), `location`, `source`, `sourceUrl`, `date`. Everything but the quote, the name and `verified` may be null. |
| 10.1a | **Which source each quote came from** | 🟠 | `source` is one of `'Google'`, `'Zillow'` or `'Direct Client'`, and drives the badge on the card. Null when the client has not said. Once two or more sources are in use, `/testimonials/` groups the quotes by source automatically. |
| 10.1b | **Real review URLs** | 🟠 | `sourceUrl` links to the review as published, and is **only ever a URL the client supplies**. Never constructed from a profile page, a search result or a guess at a review id. Null is fine — the badge then names the platform without linking. |
| 10.1c | Written permission to quote each client | 🔴 | `verified: true` means two things: the quote is real, **and** the client has agreed we may publish it under that name. Do not set it on the strength of a public review alone. |
| 10.1d | Whether star ratings may ever be shown | 🟡 | There is deliberately no rating field: we hold no Google or Zillow rating and no review count, and `/testimonials/` states in public that none is shown. Displaying platform ratings is a separate decision with its own terms-of-use questions — it is not something to approximate from a quote's tone. |
| 10.2 | **FAQ answers — 24 drafted, none reviewed** | 🟠 | `/faq/` is live with answers describing **general practice** across Buying, Selling, Listings, Relocation and Website. Every entry in `src/data/faqs.ts` carries `reviewed: false`, and both `/faq/` and `/sell/` say in public that the answers are being reviewed and are not policy. **Read them and set `reviewed: true` on each one you are happy with** — the caveat disappears once every answer on a page is reviewed. Correct anything that does not match how you actually work. |
| 10.2a | **Anything an answer had to leave out** | 🟠 | No answer quotes a fee, a commission, a timescale or a guarantee, because none has been supplied. Several say "ask" where a specific figure would have been more useful — tell us which of those you want answered directly and they can be. |
| 10.2b | Further questions worth adding | 🟡 | The ones you are actually asked most. A question you answer on the phone five times a week belongs here. |
| 10.3 | Buying guide content | 🟠 | |
| 10.4 | Selling guide content | 🟠 | |
| 10.5 | **Community guide copy — fifteen pages now live** | 🟠 | Every community page carries **only a one-line verifiable locational fact** plus a visible "the full guide is being written" note. Real copy goes in `introduction` (an array of paragraphs) on the record in `src/data/communities.ts`; the note disappears on its own. **No statistics, school ratings, crime figures, median values, population counts, commute times or superlatives** may be added without a citable, dated source — see the header of that file for the full list. |
| 10.5a | **Confirm each community's locational line** | 🟠 | Fifteen written from geography alone. The four Hollywood-area subareas need the closest look: neighbourhood boundaries are locally understood and vary between who you ask. |
| 10.5b | **Sheridan Lakes — which municipality?** | 🟠 | Recorded as `kind: 'neighborhood'` with `parent: null`, i.e. a neighbourhood whose city we have not confirmed. Setting `parent` to the right slug links it to that city's page and lists it under that city's subareas automatically. It is deliberately not guessed. |
| 10.5c | **Verify the latitude/longitude on each record** | 🟠 | Approximate municipal centroids, carried so the map seam is ready. **No pin is plotted from them today** — `CommunityMap` states the location in words. Verify against an authoritative source before any map goes live (see also 11.4). The four subareas have none at all. |
| 10.5d | **Community lifestyle points** (`highlights`) | 🟠 | The "Living in …" section renders **nothing at all** until these are supplied — deliberately, because a lifestyle section is where invented neighbourhood claims usually live. Each entry must be something Martin or MaryEllen will stand behind. "Walkable to the beach" is fine if true; "top-rated schools" is not, ever, without a source. |
| 10.5e | Named subareas without their own page (`neighborhoods`) | 🟡 | Extra subarea names per community. Any community record with `parent` set is merged in automatically, so this is only for areas that do not warrant their own guide. |
| 10.5f | Which communities are `featured` | 🟡 | `featured: true` puts a community in the header dropdown and the index's featured row. Currently Hollywood, Dania Beach, Hallandale Beach, Fort Lauderdale, Pembroke Pines and Aventura — an editorial guess, not a client instruction. |
| 10.5g | Any further communities to add | 🟡 | One object in `src/data/communities.ts` creates the page, the index card, the navigation entry and the cross-links. No page code is written per community. |
| 10.5h | **Community SEO fields** — reserved | 🟡 | `seo.title`, `seo.description`, `seo.body` and `seo.faqs` are empty on every record and are for a later, deliberate SEO phase. **Do not pre-fill them with keyword variations or generated copy.** An FAQ written to catch a search query is still an invented answer about somebody's neighbourhood; `FAQPage` structured data is deliberately not emitted for the same reason. |
| 10.6 | **Developments to feature** | 🟠 | Which projects should appear under New and Established. For each: the published starting price, delivery year, residence count, developer and architect, amenities and residence types — **published figures only, never estimates**. Supply guide: `DEVELOPMENTS_DATA.md`. |
| 10.6a | **Written permission for developer imagery** | 🔴 | Renderings, photographs and site plans are copyrighted developer material. Nothing may be published without the client holding written permission. **Nothing has been downloaded from any developer's site.** |
| 10.6b | **Authorised floor plans** | 🟠 | Floor plans are never drawn, approximated or reconstructed. Until an authorised asset exists, each residence type says "Floor plans are available on request". |
| 10.6c | Which images are renderings | 🟠 | Each image needs `isRendering` set truthfully, so a buyer is never shown an artist's impression as though it were a finished building. |
| 10.6d | Availability wording per development | 🟡 | Free text, exactly as the developer states it. Availability changes constantly and the site publishes only what it was told. |
| 10.7 | **Median home value data source** | 🟠 | Every figure needs a source and a date — both are required fields, not optional ones. Two ways to supply them: a per-city figure on `src/data/communities.ts` (`medianHomeValue: { value, source, asOf }`), or a live feed implementing `ValuationProvider` in `src/lib/valuation/`. `/sell/median-home-values/` renders figures automatically from either; with neither it publishes none. Before connecting a feed: a licence permitting public display, the provider's attribution and disclaimer wording **verbatim**, and the refresh cadence the licence requires. |
| 10.7a | Whether an automated estimate should ever appear | 🟠 | Nothing on the site calculates a home value today, and the pages say so. If an AVM is added later it must be presented as a statistical model over comparable sales, always as a range, always sourced and dated — **never described as artificial intelligence**, and never as a substitute for an appraisal. |
| 10.8 | Relocation content | 🟠 | What MaryEllen's relocation service actually includes. |
| 10.9 | **Journal / blog articles** | 🟡 | The `/blog/` index and article template are built. **No real articles exist**, so a production build shows an honest empty state. One Markdown file in `src/content/blog/` publishes an article — format and checklist in `docs/authoring-blog-posts.md`. **Articles are written, never generated**: a post carries a named byline, which makes a fabricated one worse than fabricated listing data. |
| 10.9a | **Delete the sample posts once the first real article lands** | 🟡 | `src/content/blog/sample-*.md` are structural placeholders carrying `sample: true`. They are dev-only, badged, `noindex`, excluded from the sitemap, and never appear as related reading from a real article. Nothing references them by name. |
| 10.9b | Article photography | 🟡 | One image per post (`heroImage`). Without one the template uses the neutral placeholder. |
| 10.9c | Article SEO fields — reserved | 🟡 | `seo.title`, `seo.description` and `seo.keywords` are empty on every post and are for the later SEO phase. Do not pre-fill with keyword variations. |

---

## 11. Tooling and third parties

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 11.1 | Google Analytics / GA4 ID | 🟡 | Affects the privacy policy and the cookie position. |
| 11.2 | Cookie consent requirement | 🟠 | Depends on analytics and on the IDX provider's tracking. |
| 11.3 | **Mortgage calculator — confirm the defaults it does NOT have** | 🟡 | The calculator is live at `/mortgage-calculator/` and is mathematically correct (standard amortisation, unit-tested, `npm run test:unit`). **The interest rate starts empty and nothing is calculated until it is entered** — the site holds no market rate and fetches none. Property tax, insurance and HOA also start blank, because a Florida insurance default would be a guess presented as a starting point. If you want any of these pre-filled, they need a source we can cite and a date. |
| 11.3a | **A live rate provider, if ever wanted** | 🟡 | Nothing on the site fetches a rate today, and nothing should until a verified provider is integrated with terms permitting display. Until then the visitor's own lender quote is the only rate used. |
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
| Fifteen community pages carrying only a locational one-liner, with a visible "guide is being written" note | `src/components/communities/CommunityIntro.astro` | 10.5 supplied |
| "Living in …" lifestyle section absent from every community page | `src/components/communities/CommunityHighlights.astro` | 10.5d supplied |
| Map stated in words, no pin plotted, on every community page | `src/components/communities/CommunityMap.astro` | 10.5c verified **and** 11.4 map provider chosen |
| Community FAQ section absent from every community page | `src/components/communities/CommunityFaq.astro` | 10.5h — the SEO phase, with client-approved answers |
| Social icon slots rendering nothing | `src/components/layout/SocialLinks.astro` | §7 URLs supplied |
| Abstract media placeholders in every image position | `src/components/ui/MediaSlot.astro` | §9 photography supplied |
| Twelve demo listings, dev-only, badged "Sample" | `src/lib/listings/demoData.ts` | §5 IDX feed connected (delete the file) |
| "Save property" stored per-device only | `src/lib/listings/favorites.ts` | 5.10 — replaced by the IDX account system |
| Map placeholder on property detail pages | `src/pages/property/[slug].astro` | 11.4 map provider chosen |
| Six demo developments, dev-only, badged "Sample" | `src/lib/developments/demoData.ts` | 10.6 supplied (delete the file) |
| Empty floor-plan slots on every residence type | `src/components/developments/DevelopmentResidences.astro` | 10.6b authorised plans supplied |
| Map placeholder on development detail pages | `src/components/developments/DevelopmentMap.astro` | 11.4 map provider chosen |
| Homepage empty states: listings, developments, testimonials, insights | the matching section components | Each data source is supplied |
| Contact-fallback panel shown instead of a success message on every form | `src/components/forms/LeadForm.astro` | 6.1 `PUBLIC_LEAD_FORM_ENDPOINT` set |
| "Online submission is still being set up" note above every submit button | `src/components/forms/LeadForm.astro` | 6.1 `PUBLIC_LEAD_FORM_ENDPOINT` set |
| No median figure published for any of the eleven municipalities | `src/pages/sell/median-home-values.astro` | 10.7 sourced figures supplied, or a valuation provider connected |
| "Questions worth asking" list instead of seller FAQ answers | `src/pages/sell/index.astro` | 10.2 client-reviewed answers added to `src/data/faqs.ts` |
| Neutral two-line stand-in where each biography goes, with a visible "a fuller profile is on the way" note | `src/components/people/PersonBio.astro` | 8.1 / 8.2 supplied |
| "Areas of focus" section absent from both profile pages | `src/components/people/PersonSpecialties.astro` | 8.5 confirmed |
| Joint-photograph placeholder in the `/about/` hero | `src/pages/about/index.astro` | 8.3a supplied |
| Testimonials empty state on `/about/`, `/testimonials/` and the homepage | `src/components/testimonials/TestimonialEmptyState.astro` | 10.1 verified quotes supplied |
| Two dev-only sample journal posts, badged "Sample — not an article" | `src/content/blog/sample-*.md` | 10.9 first real article published (delete the files) |
| Empty journal on `/blog/` and the homepage insights band | `src/lib/blog/posts.ts` | 10.9 first real article published |
| "Being reviewed by Martin and MaryEllen" caveat under every FAQ answer | `src/components/faq/FaqAccordion.astro`, `/faq/` | 10.2 — set `reviewed: true` per answer |
| Blank interest rate, tax, insurance and HOA on the calculator | `src/pages/mortgage-calculator.astro` | 11.3 — only with a citable source |

No placeholder above is phrased as a factual claim about the client, and none
uses lorem ipsum.
