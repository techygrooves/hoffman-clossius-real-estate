# IDX_INTEGRATION.md

How to connect a real IDX/MLS feed to this site.

**Nothing is connected today.** No provider has been chosen, no credentials
exist, and no listing data on this site is real. What *does* exist is the
contract a provider plugs into — so connecting one is a contained piece of
work, not a rebuild.

---

## 1. The short version

Implement `src/lib/listings/idxProvider.ts`. That is the integration.

Every page and component already speaks the normalised `Listing` and
`ListingQuery` types. **No component, page, filter or route changes.** The
provider selector picks up a configured IDX automatically and the demo data
stops being used the moment it does.

```
src/lib/listings/
  types.ts               the contract — Listing, ListingQuery, ListingProvider
  provider.ts            selects which provider is active
  idxProvider.ts         ← you implement this
  demoProvider.ts        placeholder data, dev only
  unconfiguredProvider.ts serves nothing, honestly
  filter.ts              in-memory filter/sort/paginate (pure)
  query.ts               URL ⇄ ListingQuery
  search-client.ts       browser-side filtering
```

---

## 2. Where credentials go

**Server-side environment variables only.**

```bash
# .env — never committed. Add to .gitignore (already is).
IDX_BASE_URL=https://api.example-provider.com/v1
IDX_API_KEY=...
```

Read them in `idxProvider.ts`:

```ts
const IDX_BASE_URL = import.meta.env.IDX_BASE_URL;
const IDX_API_KEY  = import.meta.env.IDX_API_KEY;
```

### Never expose a key to the browser

Astro inlines any variable prefixed `PUBLIC_` into the client bundle, where
anyone can read it. **An IDX key must never carry that prefix**, and must never
be passed into a component that renders client-side.

- ✅ `IDX_API_KEY` — server only, stays out of the bundle
- ❌ `PUBLIC_IDX_API_KEY` — shipped to every visitor

For the deployment host, set these in the host's environment settings — not in
a file uploaded to `public_html/`.

If the browser must query the feed live, it calls **a small proxy you control**
that holds the key server-side. The browser never talks to the provider
directly.

---

## 3. Where fetch logic goes

Two functions in `idxProvider.ts`, both stubbed and commented:

**`fetchListings(query)`** — calls the provider. Translate `ListingQuery` into
the provider's own parameters here, and nowhere else.

**`adaptRecord(raw)`** — maps one provider record onto `Listing`. This is the
only place that knows the provider's vocabulary.

### Adapter rules

| Rule | Why |
| --- | --- |
| Return `null` for anything the payload lacks | Components treat `null` as "not stated" and render nothing. A `0` becomes "0 baths" on a live site. |
| Map status explicitly; unrecognised → `off-market` | Never guess a lifecycle state. |
| `slug` must be stable across refreshes | Every property URL breaks on rebuild otherwise. Derive it from the MLS number plus a slugified address. |
| `demo` is always `false` | That flag belongs to placeholder data only. |
| Never re-word a description or feature | Publish what the feed says, or nothing. |

Then set `isLive: true` and fill in `attribution`.

---

## 4. Expected normalised shape

The full definition is `src/lib/listings/types.ts`. In outline:

```ts
interface Listing {
  id: string;                    // provider-stable
  mlsNumber: string | null;
  slug: string;                  // stable across refreshes
  status: ListingStatus;         // for-sale | for-rent | coming-soon |
                                 // pending | sold | leased | off-market
  price: number | null;          // whole dollars; rentals per month
  address: ListingAddress;       // line1, line2, city, state, zip, county,
                                 //   neighborhood
  latitude: number | null;
  longitude: number | null;
  beds / baths / halfBaths: number | null;
  sqft / lotSize: number | null; // square feet
  propertyType: PropertyType;    // normalised enum
  propertyTypeLabel: string | null;  // provider's own, more specific label
  description: string | null;
  images: ListingImage[];        // url, alt, width, height, caption
  features: ListingFeatures;     // { interior[], exterior[], community[] }
  yearBuilt: number | null;
  garage: number | null;         // null = unknown, 0 = genuinely none
  pool / waterfront: boolean | null;
  listingAgent: ListingAgent | null;
  openHouses: OpenHouse[];
  updatedAt: string | null;      // ISO 8601
  demo: boolean;                 // false for real data
}
```

Anything the provider supplies that has no home here either extends the type
(and is then rendered somewhere) or is dropped. Do not stuff unmapped values
into `description`.

---

## 5. Attribution and disclaimers

`ProviderAttribution` carries the courtesy line, disclaimer paragraph, MLS logo
path and the feed's own "last updated" timestamp. The listing index pages
render `attribution.disclaimer` automatically when it is set.

**This wording is dictated by the MLS and may not be written by us.** It stays
`null` until the client supplies the exact text — see `CONTENT_PENDING.md` §5.

---

## 6. Fetch timing

The site is statically generated, so choose deliberately:

| Approach | Freshness | Notes |
| --- | --- | --- |
| **Build-time fetch** | As fresh as the last build | Fastest for visitors, works on any static host, no runtime key exposure. Needs a scheduled rebuild. |
| **Runtime fetch via a proxy** | Always current | Requires a server or serverless function to hold the key. |
| **Provider's own embed/iframe** | Provider's problem | Least control over design; check it can be made accessible. |

Most MLS agreements cap how stale displayed data may be — commonly measured in
hours. **Confirm the refresh requirement before choosing**, because it decides
whether a build-on-a-schedule is even permitted.

---

## 7. When the feed gets large

The index pages currently render every listing in scope and filter in the
browser (`search-client.ts`). That is right for dozens or a few hundred
listings and gives instant, shareable filtering with no server.

A feed of thousands should filter and paginate at the provider instead:

1. `idxProvider.search()` passes the query to the API and returns one page.
2. The page renders that page of results.
3. `search-client.ts` is replaced by a version that fetches on filter change.

**The URL contract and every component stay the same** — `ListingFilters`,
`ListingGrid`, `ListingCard`, `Pagination` and the query parameters do not
change. Only where the results come from does.

---

## 8. Checklist

- [ ] Provider chosen and the client is authorised to display its data
- [ ] API documentation obtained
- [ ] Credentials issued and stored server-side, never `PUBLIC_`-prefixed
- [ ] Agent/office IDs obtained, so `/properties/our-listings/` can filter
- [ ] `adaptRecord()` implemented, with null-safety per §3
- [ ] `fetchListings()` implemented
- [ ] `attribution` populated with the MLS's verbatim wording
- [ ] `isLive: true`
- [ ] Refresh cadence agreed and implemented
- [ ] Photo usage and caching rules confirmed and respected
- [ ] `src/lib/listings/demoData.ts` and `demoProvider.ts` deleted
- [ ] A production build shows real listings and the required disclaimer

---

## 9. Removing the demo data

When real listings arrive:

```bash
rm src/lib/listings/demoData.ts src/lib/listings/demoProvider.ts
```

Then delete the `demoProvider` import and its branch in `provider.ts`. Nothing
else references either file. Real data already takes precedence over demo data,
so this is tidying rather than a functional change.
