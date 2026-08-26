# DEVELOPMENTS_DATA.md

How to supply real developments to this site.

**Nothing real is connected today.** No developer material has been supplied,
and no development on this site describes a real project. What *does* exist is
the data shape and the pages that render it — so supplying a development is
filling in a file, not a redesign.

---

## 1. The short version

Add an entry to `src/lib/developments/curatedData.ts` with `verified: true`.

That is the whole integration. The provider selector notices there is now real
data, switches to it automatically, and the demo records stop being used.
**No page or component changes.**

```
src/lib/developments/
  types.ts                 the contract — Development, ResidenceType, …
  provider.ts              selects which source is active
  curatedData.ts           ← client-supplied developments go here
  curatedProvider.ts       serves only `verified` entries
  demoProvider.ts          placeholder data, dev only
  unconfiguredProvider.ts  serves nothing, honestly
  filter.ts                filter/sort/related (pure)
  query.ts                 URL ⇄ DevelopmentQuery
  filter-client.ts         browser-side filtering
```

Unlike listings there is no feed here. New construction has no MLS equivalent:
the material comes from the client, who gets it from the developer.

---

## 2. The `verified` gate

`verified: true` means **the client has confirmed every detail is accurate and
that we are permitted to publish it.**

Only verified entries render. That gate exists so a development can be added,
half-filled and worked on over several days without any risk of unchecked
claims about someone else's project reaching the public site.

Do not set it to get something on screen. Use the demo flag for that:

```bash
npm run build:demo     # or just `npm run dev`
```

---

## 3. What may and may not be filled in

| Field | Rule |
| --- | --- |
| `startingPrice` | Only a price the developer has published. Never derived from a listing, never "about". |
| `completionYear` | Only an announced delivery year. Delivery dates slip; publishing a guess is a claim you cannot stand behind. |
| `totalResidences` | Only a published count. |
| `developer`, `architect` | Only when named publicly by the project. |
| `bedroomRange`, `bathroomRange`, `squareFootageRange` | `{ min, max }`. Leave an end `null` when only one is known — "from 2 bedrooms" is a fact; "2–4" when nobody said 4 is not. |
| `amenities` | Exactly as published. Never re-worded to sound better, never padded. |
| `residences` | Each type as published. `floorPlan: null` unless you hold an authorised asset. |
| `availabilityNote` | Free text, exactly as supplied. Availability changes constantly — say what you were told, and when. |
| `summary`, `description` | The developer's own copy, or copy the client wrote. Not invented. |

**Anything not confirmed is `null`.** Components render nothing for a null —
never a dash, never a zero, never "TBC".

---

## 4. Images, renderings and floor plans

Developer material is **copyrighted**. This matters more here than anywhere
else on the site.

### Rules

- **Never download images from a developer's website**, a portal, or a
  brochure PDF.
- Only publish assets the client has **written permission** to use.
- Put them under `/public/images/developments/<slug>/`.
- **Mark renderings.** Set `isRendering: true` and the UI labels them, so a
  buyer is never shown an artist's impression as though it were a photograph
  of a finished building. For a pre-construction project nearly every image is
  one.
- **Never draw, approximate or reconstruct a floor plan.** Not from a
  description, not from a site plan, not from a similar unit. `floorPlan` is a
  slot for an authorised asset; until one exists, the page says plans are
  available on request. A made-up floor plan is a misrepresentation of
  someone's home.

```ts
images: [
  {
    url: '/images/developments/harbour-collection/exterior.jpg',
    alt: 'Street elevation of the building from the south',
    width: 1600,
    height: 1200,
    caption: null,
    isRendering: true,          // ← label it
  },
],
```

---

## 5. A worked template

```ts
import type { Development } from './types';

export const curatedDevelopments: readonly Development[] = [
  {
    id: 'harbour-collection',
    slug: 'harbour-collection',        // stable — the URL depends on it
    name: 'Harbour Collection',

    category: 'new',                   // 'new' | 'existing'
    status: 'now-selling',
    developmentType: 'townhome',
    developmentTypeLabel: null,        // set when the project's own label is better

    city: 'Dania Beach',
    address: {
      line1: '120 Marina Way',
      city: 'Dania Beach',
      state: 'FL',
      zip: '33004',
      county: 'Broward County',
    },
    latitude: 26.0538,
    longitude: -80.1449,

    startingPrice: 895000,             // null if not published
    bedroomRange: { min: 3, max: 4 },
    bathroomRange: { min: 2, max: 4 },
    squareFootageRange: { min: 1980, max: 2640 },

    completionYear: 2027,              // null if not announced
    developer: 'Developer Name',       // null if not named publicly
    architect: null,

    summary: 'One line for cards.',
    description: 'Longer copy for the detail page.',

    images: [],                        // authorised assets only — see §4
    amenities: {
      building: ['Private lift in select homes'],
      outdoor: ['Rooftop terraces'],
      services: ['Gated entry'],
    },
    residences: [
      {
        id: 'three-bed',
        name: 'Three Bedroom Townhome',
        beds: 3,
        baths: 2,
        halfBaths: 1,
        sqft: { min: 1980, max: 2180 },
        priceFrom: 895000,
        floorPlan: null,               // authorised asset only — never drawn
        availability: null,
      },
    ],

    totalResidences: 34,
    availabilityNote: null,

    verified: true,                    // ← the publication gate
    demo: false,
    updatedAt: '2026-09-01T10:00:00-04:00',
  },
];
```

---

## 6. If the data ever comes from a feed

Some developers and aggregators do publish structured data. If one is ever
used, write a `feedProvider.ts` implementing `DevelopmentProvider` and add it
to the selector in `provider.ts` above `curatedProvider`.

**No page or component changes** — they already speak `Development` and
`DevelopmentQuery`. Follow the same adapter rules as the listing system: map
the source's vocabulary in exactly one place, and return `null` for anything
the payload lacks.

---

## 7. Checklist for each development

- [ ] Client confirms the project may be featured on their site
- [ ] Written permission obtained for every image used
- [ ] Renderings marked `isRendering: true`
- [ ] Floor plans are authorised assets, or `null`
- [ ] Prices, delivery year and residence counts are published figures
- [ ] Amenities transcribed, not re-worded
- [ ] `slug` agreed — the URL depends on it and should not change later
- [ ] `verified: true` set last, once everything above is true
- [ ] `npm run build` passes and the page reads correctly

---

## 8. Removing the demo data

When real developments arrive:

```bash
rm src/lib/developments/demoData.ts src/lib/developments/demoProvider.ts
```

Then delete the `demoDevelopmentProvider` import and its branch in
`provider.ts`. Nothing else references either file, and real data already takes
precedence — so this is tidying rather than a functional change.
