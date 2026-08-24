/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  DEMO CONTENT — NOT REAL INVENTORY. NOT CLIENT DATA. NOT MLS DATA.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * These records exist ONLY so the listing card and grid design can be
 * reviewed before the IDX/MLS feed is connected (CONTENT_PENDING.md §5).
 *
 *  - Every entry carries `isDemo: true` and a `DEMO-` prefixed reference.
 *  - Nothing here was scraped from an MLS, portal or competitor site.
 *  - No address, price or property below belongs to a real listing.
 *  - `images` is empty on purpose: there is no photography yet, so cards fall
 *    back to a neutral media placeholder rather than borrowed pictures.
 *
 * They are gated behind `flags.demoContent` (src/config/flags.ts), which is
 * OFF for production builds. To remove them entirely: delete this file and the
 * `demoListings` import in src/lib/content.ts — nothing else references it.
 *
 * When real listings arrive they go into src/data/listings.ts, and this file
 * stops being used automatically: real data always wins.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import type { Listing } from '@data/listings';

export type DemoListing = Listing & { readonly isDemo: true };

export const demoListings: readonly DemoListing[] = [
  {
    isDemo: true,
    slug: 'demo-intracoastal-residence',
    mlsId: 'DEMO-0001',
    status: 'for-sale',
    headline: 'Intracoastal residence with private dockage',
    addressLine: '1200 Sample Waterway Drive',
    city: 'Fort Lauderdale',
    state: 'FL',
    postalCode: '33301',
    price: 3450000,
    beds: 5,
    baths: 4,
    halfBaths: 1,
    livingAreaSqFt: 4820,
    lotSizeSqFt: 11250,
    yearBuilt: 2019,
    propertyType: 'Single Family',
    description: null,
    images: [],
    isOurListing: true,
  },
  {
    isDemo: true,
    slug: 'demo-oceanfront-condominium',
    mlsId: 'DEMO-0002',
    status: 'for-sale',
    headline: 'Oceanfront condominium with direct Atlantic views',
    addressLine: '900 Sample Ocean Boulevard, Unit 1704',
    city: 'Hollywood',
    state: 'FL',
    postalCode: '33019',
    price: 1295000,
    beds: 3,
    baths: 3,
    halfBaths: null,
    livingAreaSqFt: 2140,
    lotSizeSqFt: null,
    yearBuilt: 2016,
    propertyType: 'Condominium',
    description: null,
    images: [],
    isOurListing: true,
  },
  {
    isDemo: true,
    slug: 'demo-golf-course-villa',
    mlsId: 'DEMO-0003',
    status: 'for-sale',
    headline: 'Villa overlooking the fairway',
    addressLine: '48 Sample Fairway Lane',
    city: 'Aventura',
    state: 'FL',
    postalCode: '33180',
    price: 985000,
    beds: 3,
    baths: 2,
    halfBaths: 1,
    livingAreaSqFt: 2380,
    lotSizeSqFt: 6100,
    yearBuilt: 2004,
    propertyType: 'Villa',
    description: null,
    images: [],
    isOurListing: false,
  },
  {
    isDemo: true,
    slug: 'demo-coastal-townhome',
    mlsId: 'DEMO-0004',
    status: 'for-sale',
    headline: 'Coastal townhome moments from the beach',
    addressLine: '312 Sample Palm Court',
    city: 'Dania Beach',
    state: 'FL',
    postalCode: '33004',
    price: 749000,
    beds: 3,
    baths: 2,
    halfBaths: null,
    livingAreaSqFt: 1860,
    lotSizeSqFt: 2400,
    yearBuilt: 2021,
    propertyType: 'Townhouse',
    description: null,
    images: [],
    isOurListing: true,
  },
  {
    isDemo: true,
    slug: 'demo-family-home-west',
    mlsId: 'DEMO-0005',
    status: 'for-sale',
    headline: 'Family home on a landscaped corner lot',
    addressLine: '17540 Sample Cypress Way',
    city: 'Pembroke Pines',
    state: 'FL',
    postalCode: '33029',
    price: 615000,
    beds: 4,
    baths: 3,
    halfBaths: null,
    livingAreaSqFt: 2540,
    lotSizeSqFt: 8700,
    yearBuilt: 2002,
    propertyType: 'Single Family',
    description: null,
    images: [],
    isOurListing: false,
  },
  {
    isDemo: true,
    slug: 'demo-seasonal-rental',
    mlsId: 'DEMO-0006',
    status: 'for-rent',
    headline: 'Furnished seasonal rental near the marina',
    addressLine: '77 Sample Harbour Terrace, Unit 5B',
    city: 'Hallandale Beach',
    state: 'FL',
    postalCode: '33009',
    price: 8500,
    beds: 2,
    baths: 2,
    halfBaths: null,
    livingAreaSqFt: 1420,
    lotSizeSqFt: null,
    yearBuilt: 2013,
    propertyType: 'Condominium',
    description: null,
    images: [],
    isOurListing: true,
  },
];
