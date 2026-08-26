/**
 * ═══════════════════════════════════════════════════════════════════════════
 *   DEMO DATA — MUST NOT BE USED AS LIVE MLS DATA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  NOT REAL INVENTORY. NOT CLIENT DATA. NOT MLS DATA. NOT SCRAPED.
 *
 * These records exist for one reason: so the listing card, grid, filters,
 * gallery and detail page can be built and reviewed before an authorised
 * IDX/MLS feed exists (CONTENT_PENDING.md §5).
 *
 *  - Every record carries `demo: true`, and the UI labels anything with it.
 *  - Every `mlsNumber` is `DEMO-####`, which no MLS issues.
 *  - Every street name contains "Sample". None of these addresses is a real
 *    property, and no price, feature or measurement describes one.
 *  - `images` is empty throughout. There is no photography yet, and borrowing
 *    pictures of real homes would be worse than showing none.
 *  - Nothing here was taken from an MLS, a portal, Keyes, or any competitor.
 *
 * Gated behind `flags.demoContent`, which is OFF in production builds.
 *
 * TO REMOVE ENTIRELY: delete this file and `demoProvider.ts`. The provider
 * selector in `provider.ts` then falls through to the unconfigured provider,
 * and every page keeps working with its real empty state.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { professionals } from '@config/site';
import {
  EMPTY_FEATURES,
  type Listing,
  type ListingAgent,
  type ListingFeatures,
  type ListingStatus,
  type PropertyType,
} from './types';

const [martin, maryellen] = professionals;

const asAgent = (person: (typeof professionals)[number]): ListingAgent => ({
  name: person.name,
  title: person.specialty ? `${person.title} · ${person.specialty}` : person.title,
  phone: person.phone.value,
  email: person.email.value,
  profilePath: person.href,
  isOurAgent: true,
});

const MARTIN = martin ? asAgent(martin) : null;
const MARYELLEN = maryellen ? asAgent(maryellen) : null;

type DemoInput = {
  n: number;
  slug: string;
  status: ListingStatus;
  price: number | null;
  line1: string;
  line2?: string;
  city: string;
  zip: string;
  county?: string;
  lat: number;
  lng: number;
  beds: number | null;
  baths: number | null;
  halfBaths?: number | null;
  sqft: number | null;
  lotSize?: number | null;
  type: PropertyType;
  typeLabel?: string;
  description: string;
  features?: Partial<ListingFeatures>;
  yearBuilt: number | null;
  garage?: number | null;
  pool?: boolean | null;
  waterfront?: boolean | null;
  agent: ListingAgent | null;
  updatedAt: string;
};

/** Fills the shape so each record below stays readable. */
const demo = (input: DemoInput): Listing => ({
  id: `demo-${String(input.n).padStart(4, '0')}`,
  mlsNumber: `DEMO-${String(input.n).padStart(4, '0')}`,
  slug: input.slug,
  status: input.status,
  price: input.price,
  address: {
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city,
    state: 'FL',
    zip: input.zip,
    county: input.county ?? 'Broward County',
    neighborhood: null,
  },
  latitude: input.lat,
  longitude: input.lng,
  beds: input.beds,
  baths: input.baths,
  halfBaths: input.halfBaths ?? null,
  sqft: input.sqft,
  lotSize: input.lotSize ?? null,
  propertyType: input.type,
  propertyTypeLabel: input.typeLabel ?? null,
  description: input.description,
  images: [],
  features: { ...EMPTY_FEATURES, ...input.features },
  yearBuilt: input.yearBuilt,
  garage: input.garage ?? null,
  pool: input.pool ?? null,
  waterfront: input.waterfront ?? null,
  listingAgent: input.agent,
  openHouses: [],
  updatedAt: input.updatedAt,
  demo: true,
});

export const demoListings: readonly Listing[] = [
  demo({
    n: 1,
    slug: 'sample-intracoastal-residence-fort-lauderdale',
    status: 'for-sale',
    price: 3450000,
    line1: '1200 Sample Waterway Drive',
    city: 'Fort Lauderdale',
    zip: '33301',
    lat: 26.1224,
    lng: -80.1373,
    beds: 5,
    baths: 4,
    halfBaths: 1,
    sqft: 4820,
    lotSize: 11250,
    type: 'single-family',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Open plan living', 'Chef kitchen', 'Primary suite on ground floor'],
      exterior: ['Private dockage', 'Covered terrace', 'Summer kitchen'],
      community: ['No fixed bridges'],
    },
    yearBuilt: 2019,
    garage: 3,
    pool: true,
    waterfront: true,
    agent: MARTIN,
    updatedAt: '2026-08-18T14:00:00-04:00',
  }),
  demo({
    n: 2,
    slug: 'sample-oceanfront-condominium-hollywood',
    status: 'for-sale',
    price: 1295000,
    line1: '900 Sample Ocean Boulevard',
    line2: 'Unit 1704',
    city: 'Hollywood',
    zip: '33019',
    lat: 26.0112,
    lng: -80.1156,
    beds: 3,
    baths: 3,
    sqft: 2140,
    type: 'condominium',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Floor-to-ceiling glazing', 'Split bedroom plan'],
      exterior: ['Wraparound balcony'],
      community: ['Doorman', 'Fitness centre', 'Beach service'],
    },
    yearBuilt: 2016,
    garage: 2,
    pool: true,
    waterfront: true,
    agent: MARYELLEN,
    updatedAt: '2026-08-20T09:30:00-04:00',
  }),
  demo({
    n: 3,
    slug: 'sample-fairway-villa-aventura',
    status: 'for-sale',
    price: 985000,
    line1: '48 Sample Fairway Lane',
    city: 'Aventura',
    zip: '33180',
    county: 'Miami-Dade County',
    lat: 25.9565,
    lng: -80.139,
    beds: 3,
    baths: 2,
    halfBaths: 1,
    sqft: 2380,
    lotSize: 6100,
    type: 'villa',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Vaulted ceilings'],
      exterior: ['Screened patio'],
      community: ['Gated entry', 'Clubhouse'],
    },
    yearBuilt: 2004,
    garage: 2,
    pool: false,
    waterfront: false,
    agent: null,
    updatedAt: '2026-08-12T11:15:00-04:00',
  }),
  demo({
    n: 4,
    slug: 'sample-coastal-townhome-dania-beach',
    status: 'for-sale',
    price: 749000,
    line1: '312 Sample Palm Court',
    city: 'Dania Beach',
    zip: '33004',
    lat: 26.0526,
    lng: -80.1437,
    beds: 3,
    baths: 2,
    sqft: 1860,
    lotSize: 2400,
    type: 'townhouse',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Impact glass throughout'],
      exterior: ['Rooftop terrace'],
      community: ['Community pool'],
    },
    yearBuilt: 2021,
    garage: 1,
    pool: false,
    waterfront: false,
    agent: MARTIN,
    updatedAt: '2026-08-22T16:45:00-04:00',
  }),
  demo({
    n: 5,
    slug: 'sample-family-home-pembroke-pines',
    status: 'for-sale',
    price: 615000,
    line1: '17540 Sample Cypress Way',
    city: 'Pembroke Pines',
    zip: '33029',
    lat: 26.0128,
    lng: -80.3376,
    beds: 4,
    baths: 3,
    sqft: 2540,
    lotSize: 8700,
    type: 'single-family',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Renovated kitchen'],
      exterior: ['Fenced garden', 'Corner lot'],
      community: ['Playground'],
    },
    yearBuilt: 2002,
    garage: 2,
    pool: true,
    waterfront: false,
    agent: null,
    updatedAt: '2026-08-09T10:00:00-04:00',
  }),
  demo({
    n: 6,
    slug: 'sample-marina-rental-hallandale-beach',
    status: 'for-rent',
    price: 8500,
    line1: '77 Sample Harbour Terrace',
    line2: 'Unit 5B',
    city: 'Hallandale Beach',
    zip: '33009',
    lat: 25.9812,
    lng: -80.1484,
    beds: 2,
    baths: 2,
    sqft: 1420,
    type: 'condominium',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Furnished'],
      exterior: ['Marina outlook'],
      community: ['Valet parking', 'Pool deck'],
    },
    yearBuilt: 2013,
    garage: 1,
    pool: true,
    waterfront: true,
    agent: MARYELLEN,
    updatedAt: '2026-08-21T08:00:00-04:00',
  }),
  demo({
    n: 7,
    slug: 'sample-hollywood-lakes-residence',
    status: 'for-sale',
    price: 2150000,
    line1: '540 Sample Lakeview Road',
    city: 'Hollywood',
    zip: '33020',
    lat: 26.0262,
    lng: -80.1481,
    beds: 4,
    baths: 4,
    sqft: 3610,
    lotSize: 9800,
    type: 'single-family',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Study', 'Wine store'],
      exterior: ['Heated pool', 'Outdoor kitchen'],
      community: [],
    },
    yearBuilt: 2015,
    garage: 2,
    pool: true,
    waterfront: false,
    agent: MARTIN,
    updatedAt: '2026-08-19T13:20:00-04:00',
  }),
  demo({
    n: 8,
    slug: 'sample-las-olas-loft-fort-lauderdale',
    status: 'for-sale',
    price: 875000,
    line1: '25 Sample Riverside Avenue',
    line2: 'Loft 9',
    city: 'Fort Lauderdale',
    zip: '33312',
    lat: 26.1189,
    lng: -80.1489,
    beds: 2,
    baths: 2,
    sqft: 1580,
    type: 'condominium',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Double-height ceilings', 'Exposed structure'],
      exterior: ['River walk frontage'],
      community: ['Secure entry'],
    },
    yearBuilt: 2008,
    garage: 1,
    pool: false,
    waterfront: true,
    agent: null,
    updatedAt: '2026-08-15T15:05:00-04:00',
  }),
  demo({
    n: 9,
    slug: 'sample-golf-view-condominium-aventura',
    status: 'pending',
    price: 1150000,
    line1: '3400 Sample Country Club Drive',
    line2: 'Unit 2201',
    city: 'Aventura',
    zip: '33180',
    county: 'Miami-Dade County',
    lat: 25.9702,
    lng: -80.1428,
    beds: 3,
    baths: 3,
    halfBaths: 1,
    sqft: 2260,
    type: 'condominium',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Corner unit'],
      exterior: ['Two terraces'],
      community: ['Golf course', 'Spa'],
    },
    yearBuilt: 2011,
    garage: 2,
    pool: true,
    waterfront: false,
    agent: MARYELLEN,
    updatedAt: '2026-08-11T12:00:00-04:00',
  }),
  demo({
    n: 10,
    slug: 'sample-new-construction-pembroke-pines',
    status: 'coming-soon',
    price: 899000,
    line1: '2210 Sample Meadow Lane',
    city: 'Pembroke Pines',
    zip: '33028',
    lat: 26.0089,
    lng: -80.3271,
    beds: 5,
    baths: 4,
    sqft: 3240,
    lotSize: 7600,
    type: 'single-family',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Builder warranty'],
      exterior: ['Preserve outlook'],
      community: ['Gated'],
    },
    yearBuilt: 2026,
    garage: 3,
    pool: false,
    waterfront: false,
    agent: MARTIN,
    updatedAt: '2026-08-23T09:00:00-04:00',
  }),
  demo({
    n: 11,
    slug: 'sample-annual-rental-dania-beach',
    status: 'for-rent',
    price: 4200,
    line1: '860 Sample Seagrape Street',
    city: 'Dania Beach',
    zip: '33004',
    lat: 26.0491,
    lng: -80.1512,
    beds: 3,
    baths: 2,
    sqft: 1690,
    lotSize: 5200,
    type: 'single-family',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Unfurnished'],
      exterior: ['Fenced yard'],
      community: [],
    },
    yearBuilt: 1998,
    garage: 1,
    pool: false,
    waterfront: false,
    agent: null,
    updatedAt: '2026-08-17T10:30:00-04:00',
  }),
  demo({
    n: 12,
    slug: 'sample-beachside-penthouse-hallandale-beach',
    status: 'for-sale',
    price: 5750000,
    line1: '1801 Sample Shoreline Drive',
    line2: 'Penthouse 2',
    city: 'Hallandale Beach',
    zip: '33009',
    lat: 25.9878,
    lng: -80.1201,
    beds: 4,
    baths: 5,
    halfBaths: 1,
    sqft: 5100,
    type: 'condominium',
    description:
      'A sample record used to build and review the property detail page. It describes no real property.',
    features: {
      interior: ['Private lift lobby', 'Staff quarters'],
      exterior: ['Summer kitchen', 'Plunge pool'],
      community: ['Beach club', 'Concierge'],
    },
    yearBuilt: 2020,
    garage: 4,
    pool: true,
    waterfront: true,
    agent: MARTIN,
    updatedAt: '2026-08-24T08:15:00-04:00',
  }),
];
