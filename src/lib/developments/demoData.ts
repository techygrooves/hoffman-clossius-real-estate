/**
 * ═══════════════════════════════════════════════════════════════════════════
 *   DEMO CONTENT — MUST NOT BE PRESENTED AS REAL DEVELOPMENTS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  NOT REAL PROJECTS. NOT CLIENT DATA. NOT DEVELOPER MATERIAL. NOT SCRAPED.
 *
 * These records exist for one reason: so the development card, grid, filters,
 * gallery, amenities, residences and detail page can be built and reviewed
 * before the client supplies authorised developer material
 * (CONTENT_PENDING.md 10.6).
 *
 *  - Every record carries `demo: true`, and the UI labels anything with it.
 *  - Every name begins "Sample", which no real project is called.
 *  - No developer, architect, price, delivery date, amenity or residence type
 *    below describes a real project. They are shapes, not claims.
 *  - `images` and every `floorPlan` are empty. Renderings and floor plans are
 *    copyrighted developer material: none has been downloaded, redrawn or
 *    approximated, and components fall back to neutral placeholders.
 *  - `verified: false` throughout — these could never pass the publication
 *    gate even if the demo flag were forced on in production.
 *
 * Gated behind `flags.demoContent`, which is OFF in production builds.
 *
 * TO REMOVE ENTIRELY: delete this file and `demoProvider.ts`. The selector in
 * `provider.ts` then falls through, and every page keeps working with its real
 * empty state.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import {
  EMPTY_AMENITIES,
  type Development,
  type DevelopmentAmenityGroups,
  type DevelopmentCategory,
  type DevelopmentStatus,
  type DevelopmentType,
  type NumericRange,
  type ResidenceType,
} from './types';

const range = (min: number | null, max: number | null): NumericRange => ({ min, max });

type DemoInput = {
  n: number;
  slug: string;
  name: string;
  category: DevelopmentCategory;
  status: DevelopmentStatus;
  type: DevelopmentType;
  city: string;
  line1?: string;
  zip?: string;
  county?: string;
  lat: number;
  lng: number;
  startingPrice: number | null;
  beds: NumericRange;
  baths: NumericRange;
  sqft: NumericRange;
  completionYear: number | null;
  developer: string | null;
  architect: string | null;
  summary: string;
  description: string;
  amenities?: Partial<DevelopmentAmenityGroups>;
  residences?: readonly Omit<ResidenceType, 'floorPlan'>[];
  totalResidences?: number | null;
  availabilityNote?: string | null;
  updatedAt: string;
};

const demo = (input: DemoInput): Development => ({
  id: `demo-dev-${String(input.n).padStart(3, '0')}`,
  slug: input.slug,
  name: input.name,
  category: input.category,
  status: input.status,
  developmentType: input.type,
  developmentTypeLabel: null,
  city: input.city,
  address: {
    line1: input.line1 ?? null,
    city: input.city,
    state: 'FL',
    zip: input.zip ?? null,
    county: input.county ?? 'Broward County',
  },
  latitude: input.lat,
  longitude: input.lng,
  startingPrice: input.startingPrice,
  bedroomRange: input.beds,
  bathroomRange: input.baths,
  squareFootageRange: input.sqft,
  completionYear: input.completionYear,
  developer: input.developer,
  architect: input.architect,
  summary: input.summary,
  description: input.description,
  images: [],
  amenities: { ...EMPTY_AMENITIES, ...input.amenities },
  // Floor plans are never manufactured — the slot stays empty.
  residences: (input.residences ?? []).map((r) => ({ ...r, floorPlan: null })),
  totalResidences: input.totalResidences ?? null,
  availabilityNote: input.availabilityNote ?? null,
  verified: false,
  demo: true,
  updatedAt: input.updatedAt,
});

export const demoDevelopments: readonly Development[] = [
  demo({
    n: 1,
    slug: 'sample-shoreline-residences',
    name: 'Sample Shoreline Residences',
    category: 'new',
    status: 'pre-construction',
    type: 'condominium',
    city: 'Hollywood',
    line1: '400 Sample Ocean Drive',
    zip: '33019',
    lat: 26.0142,
    lng: -80.1163,
    startingPrice: 1250000,
    beds: range(1, 4),
    baths: range(1, 4),
    sqft: range(890, 3400),
    completionYear: 2028,
    developer: 'Sample Development Group',
    architect: 'Sample Architecture Studio',
    summary:
      'A sample record used to build and review the development pages. It describes no real project.',
    description:
      'A sample record used to build and review the development pages. It describes no real project, developer, architect, delivery date or price.',
    amenities: {
      building: ['Lobby lounge', 'Fitness centre', 'Residents’ library'],
      outdoor: ['Pool deck', 'Sunrise terrace'],
      services: ['24-hour attendant', 'Valet parking'],
    },
    residences: [
      { id: 'r1', name: 'One Bedroom', beds: 1, baths: 1, halfBaths: null, sqft: range(890, 1020), priceFrom: 1250000, availability: null },
      { id: 'r2', name: 'Two Bedroom', beds: 2, baths: 2, halfBaths: 1, sqft: range(1340, 1580), priceFrom: 1780000, availability: null },
      { id: 'r3', name: 'Penthouse Collection', beds: 4, baths: 4, halfBaths: 1, sqft: range(3100, 3400), priceFrom: null, availability: null },
    ],
    totalResidences: 96,
    availabilityNote: null,
    updatedAt: '2026-08-20T10:00:00-04:00',
  }),
  demo({
    n: 2,
    slug: 'sample-harbour-collection',
    name: 'Sample Harbour Collection',
    category: 'new',
    status: 'now-selling',
    type: 'townhome',
    city: 'Dania Beach',
    line1: '120 Sample Marina Way',
    zip: '33004',
    lat: 26.0538,
    lng: -80.1449,
    startingPrice: 895000,
    beds: range(3, 4),
    baths: range(2, 4),
    sqft: range(1980, 2640),
    completionYear: 2027,
    developer: 'Sample Development Group',
    architect: null,
    summary:
      'A sample record used to build and review the development pages. It describes no real project.',
    description:
      'A sample record used to build and review the development pages. It describes no real project, developer, architect, delivery date or price.',
    amenities: {
      building: ['Private lift in select homes'],
      outdoor: ['Rooftop terraces', 'Community dock'],
      services: ['Gated entry'],
    },
    residences: [
      { id: 'r1', name: 'Three Bedroom Townhome', beds: 3, baths: 2, halfBaths: 1, sqft: range(1980, 2180), priceFrom: 895000, availability: null },
      { id: 'r2', name: 'Four Bedroom Townhome', beds: 4, baths: 3, halfBaths: 1, sqft: range(2400, 2640), priceFrom: 1120000, availability: null },
    ],
    totalResidences: 34,
    updatedAt: '2026-08-22T09:30:00-04:00',
  }),
  demo({
    n: 3,
    slug: 'sample-parkside-tower',
    name: 'Sample Parkside Tower',
    category: 'new',
    status: 'under-construction',
    type: 'mixed-use',
    city: 'Fort Lauderdale',
    line1: '77 Sample Riverside Avenue',
    zip: '33301',
    lat: 26.1201,
    lng: -80.1421,
    startingPrice: 720000,
    beds: range(1, 3),
    baths: range(1, 3),
    sqft: range(760, 2100),
    completionYear: 2027,
    developer: null,
    architect: 'Sample Architecture Studio',
    summary:
      'A sample record used to build and review the development pages. It describes no real project.',
    description:
      'A sample record used to build and review the development pages. It describes no real project, developer, architect, delivery date or price.',
    amenities: {
      building: ['Co-working lounge', 'Screening room'],
      outdoor: ['Elevated pool terrace'],
      services: ['Concierge'],
    },
    residences: [
      { id: 'r1', name: 'Studio', beds: null, baths: 1, halfBaths: null, sqft: range(760, 820), priceFrom: 720000, availability: null },
      { id: 'r2', name: 'Two Bedroom', beds: 2, baths: 2, halfBaths: null, sqft: range(1180, 1420), priceFrom: 985000, availability: null },
    ],
    totalResidences: null,
    updatedAt: '2026-08-18T14:00:00-04:00',
  }),
  demo({
    n: 4,
    slug: 'sample-cypress-preserve',
    name: 'Sample Cypress Preserve',
    category: 'existing',
    status: 'completed',
    type: 'gated-community',
    city: 'Pembroke Pines',
    line1: '18000 Sample Preserve Boulevard',
    zip: '33029',
    lat: 26.0102,
    lng: -80.3341,
    startingPrice: 640000,
    beds: range(3, 5),
    baths: range(2, 4),
    sqft: range(2100, 3600),
    completionYear: 2006,
    developer: null,
    architect: null,
    summary:
      'A sample record used to build and review the development pages. It describes no real community.',
    description:
      'A sample record used to build and review the development pages. It describes no real community, its amenities or its values.',
    amenities: {
      building: ['Clubhouse'],
      outdoor: ['Community pool', 'Tennis courts', 'Walking trails'],
      services: ['Manned gate'],
    },
    residences: [],
    totalResidences: 280,
    availabilityNote: null,
    updatedAt: '2026-08-10T11:00:00-04:00',
  }),
  demo({
    n: 5,
    slug: 'sample-country-club-village',
    name: 'Sample Country Club Village',
    category: 'existing',
    status: 'completed',
    type: 'condominium',
    city: 'Aventura',
    line1: '3600 Sample Club Drive',
    zip: '33180',
    county: 'Miami-Dade County',
    lat: 25.9689,
    lng: -80.1412,
    startingPrice: 480000,
    beds: range(1, 3),
    baths: range(1, 3),
    sqft: range(920, 2260),
    completionYear: 1998,
    developer: null,
    architect: null,
    summary:
      'A sample record used to build and review the development pages. It describes no real community.',
    description:
      'A sample record used to build and review the development pages. It describes no real community, its amenities or its values.',
    amenities: {
      building: ['Renovated lobby', 'Fitness room'],
      outdoor: ['Golf outlook', 'Two pools'],
      services: ['On-site management'],
    },
    residences: [],
    totalResidences: 412,
    updatedAt: '2026-08-05T08:00:00-04:00',
  }),
  demo({
    n: 6,
    slug: 'sample-beachwalk-estates',
    name: 'Sample Beachwalk Estates',
    category: 'existing',
    status: 'completed',
    type: 'single-family',
    city: 'Hallandale Beach',
    line1: '900 Sample Shoreline Avenue',
    zip: '33009',
    lat: 25.9856,
    lng: -80.1387,
    startingPrice: 1150000,
    beds: range(3, 6),
    baths: range(2, 5),
    sqft: range(2400, 4800),
    completionYear: 2012,
    developer: null,
    architect: null,
    summary:
      'A sample record used to build and review the development pages. It describes no real community.',
    description:
      'A sample record used to build and review the development pages. It describes no real community, its amenities or its values.',
    amenities: {
      building: [],
      outdoor: ['Private beach access', 'Green corridor'],
      services: ['Gated entry'],
    },
    residences: [],
    totalResidences: 64,
    updatedAt: '2026-08-14T16:00:00-04:00',
  }),
];
