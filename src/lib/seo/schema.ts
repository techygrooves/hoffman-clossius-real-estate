/**
 * ---------------------------------------------------------------------------
 * STRUCTURED DATA — JSON-LD generators
 * ---------------------------------------------------------------------------
 * Every generator here is built from CONFIRMED data and returns `null` when
 * the facts it needs do not exist. That is the whole design: a generator that
 * cannot be honest emits nothing, so a page can call it unconditionally.
 *
 * ── What must never be generated here ─────────────────────────────────────
 *   - `aggregateRating` or `review` of any kind. The site holds no ratings and
 *     no review counts (CONTENT_PENDING.md 10.1d). Marked-up ratings appear in
 *     search results as stars; inventing them is fabricating a public claim.
 *   - `LocalBusiness` address, opening hours or geo. No office address has
 *     been confirmed (2.1). Fields are omitted, never approximated.
 *   - `FAQPage` over answers nobody has approved. Structured data lifts an
 *     answer into a search result stated as fact, above the page that
 *     qualifies it — see `faqPageSchema` below.
 *   - `RealEstateListing` for demo records. Sample inventory must never be
 *     marked up as real property.
 *   - `SearchAction` / sitelinks searchbox. The search UI exists but no feed
 *     is connected, so it would advertise a search that returns nothing.
 *     Add it when the IDX provider goes live (IDX_INTEGRATION.md).
 *
 * PROJECT_CONTEXT.md §9 governs all of it: if it has not been supplied, it
 * does not go in the markup either.
 * ---------------------------------------------------------------------------
 */
import {
  brokerageBrand,
  professionals,
  pending,
  serviceArea,
  site,
  type Professional,
} from '@config/site';
import { absolute } from './meta';

/** A JSON-LD node. Loose by design — schema.org shapes vary per type. */
export type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

/** Drops null/undefined/empty entries so no key is emitted with no value. */
function compact(node: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(node).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );
}

/** Stable @id for the site-wide entities, so nodes can reference each other. */
export const ORGANISATION_ID = `${site.url}/#organisation`;
export const WEBSITE_ID = `${site.url}/#website`;

/* -------------------------------------------------------------------------- */
/* Site-wide entities                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The team as an entity.
 *
 * `RealEstateAgent` is a LocalBusiness subtype, and LocalBusiness properties
 * that we cannot verify are simply absent: no address, no opening hours, no
 * geo, no price range, no rating. Present here is only what the client has
 * confirmed — the name, what they do, where they work, and two people with
 * their own direct lines.
 */
export function organisationSchema(): JsonLd {
  return compact({
    '@type': 'RealEstateAgent',
    '@id': ORGANISATION_ID,
    name: site.name,
    description: site.description,
    url: absolute('/'),
    areaServed: serviceArea.counties.map((county) => ({
      '@type': 'AdministrativeArea',
      name: `${county}, Florida`,
    })),
    // Omitted deliberately: address (CONTENT_PENDING.md 2.1), openingHours
    // (2.3), telephone (no confirmed shared line, 2.2), aggregateRating and
    // review (10.1d), priceRange (never supplied).
    ...(pending.officeAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: pending.officeAddress.street,
            addressLocality: pending.officeAddress.city,
            addressRegion: pending.officeAddress.state,
            postalCode: pending.officeAddress.postalCode,
            addressCountry: 'US',
          },
        }
      : {}),
    ...(pending.officePhone ? { telephone: pending.officePhone.value } : {}),
    employee: professionals.map((person) => personSchema(person)),
    // Social profiles are `sameAs` only once the client supplies real URLs.
    sameAs: Object.values(pending.social).filter(
      (url): url is string => typeof url === 'string',
    ),
    brand: { '@type': 'Brand', name: brokerageBrand.name },
  });
}

/** The site itself. No SearchAction — see the header of this file. */
export function websiteSchema(): JsonLd {
  return compact({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absolute('/'),
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': ORGANISATION_ID },
  });
}

/* -------------------------------------------------------------------------- */
/* Per-page entities                                                           */
/* -------------------------------------------------------------------------- */

export function webPageSchema(input: {
  title: string;
  description: string;
  canonical: string | null;
}): JsonLd | null {
  if (!input.canonical) return null;
  return compact({
    '@type': 'WebPage',
    '@id': `${input.canonical}#webpage`,
    url: input.canonical,
    name: input.title,
    description: input.description,
    inLanguage: site.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANISATION_ID },
  });
}

export type Crumb = { label: string; href?: string };

/**
 * BreadcrumbList. Home is prepended by the caller's trail, matching exactly
 * what `Breadcrumbs.astro` renders — markup and structured data describing
 * different trails is worse than having neither.
 */
export function breadcrumbSchema(trail: readonly Crumb[]): JsonLd | null {
  if (trail.length === 0) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => {
      const item = crumb.href ? absolute(crumb.href) : null;
      return compact({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        ...(item ? { item } : {}),
      });
    }),
  };
}

/**
 * A person. Only the confirmed title, phone and email — no biography, licence
 * number, designation or award, because none has been supplied
 * (CONTENT_PENDING.md 8.1–8.5).
 */
export function personSchema(person: Professional): JsonLd {
  return compact({
    '@type': 'Person',
    '@id': `${site.url}${person.href}#person`,
    name: person.name,
    givenName: person.firstName,
    familyName: person.lastName,
    jobTitle: person.specialty
      ? `${person.title}, ${person.specialty}`
      : person.title,
    telephone: person.phone.value,
    email: person.email.value,
    url: absolute(person.href),
    worksFor: { '@id': ORGANISATION_ID },
    ...(person.portrait ? { image: absolute(person.portrait) } : {}),
    // knowsAbout / award / hasCredential omitted: nothing is confirmed.
  });
}

/** A journal article. Every field comes from the post's own front matter. */
export function blogPostingSchema(input: {
  title: string;
  description: string;
  canonical: string | null;
  publishedAt: Date;
  updatedAt?: Date | null;
  authorSlug: string;
  image?: string | null;
}): JsonLd | null {
  if (!input.canonical) return null;
  const author = professionals.find((p) => p.slug === input.authorSlug);
  return compact({
    '@type': 'BlogPosting',
    '@id': `${input.canonical}#article`,
    headline: input.title,
    description: input.description,
    url: input.canonical,
    datePublished: input.publishedAt.toISOString(),
    ...(input.updatedAt ? { dateModified: input.updatedAt.toISOString() } : {}),
    inLanguage: site.locale,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANISATION_ID },
    // A byline is a claim about who wrote it, so it is emitted only for a
    // person on record.
    ...(author ? { author: { '@id': `${site.url}${author.href}#person` } } : {}),
    ...(input.image ? { image: absolute(input.image) } : {}),
  });
}

/**
 * FAQPage — gated on review, and currently emits nothing.
 *
 * Marking up an answer puts it in a search result stated as fact, above the
 * page that qualifies it. Every answer in `src/data/faqs.ts` carries
 * `reviewed: false`, and both `/faq/` and `/sell/` say in public that the
 * answers are general practice and still being read. Marking them up would
 * contradict that in the one place a reader cannot see the caveat.
 *
 * Set `reviewed: true` per answer and this starts emitting on its own.
 */
export function faqPageSchema(
  entries: readonly { question: string; answer: string; reviewed: boolean }[],
): JsonLd | null {
  const approved = entries.filter((entry) => entry.reviewed);
  if (approved.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: approved.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/**
 * A property listing.
 *
 * Returns null for demo records and for anything without a price or an
 * address — an incomplete listing marked up as real is worse than no markup.
 * Nothing calls this yet: no feed is connected, and the demo provider's
 * records must never be published as structured data.
 */
export function realEstateListingSchema(input: {
  canonical: string | null;
  name: string;
  description: string | null;
  price: number | null;
  currency?: string;
  isDemo: boolean;
  address: {
    line1: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
  images?: readonly string[];
}): JsonLd | null {
  if (input.isDemo || !input.canonical) return null;
  if (input.price === null || !input.address.line1) return null;
  return compact({
    '@type': 'RealEstateListing',
    '@id': `${input.canonical}#listing`,
    url: input.canonical,
    name: input.name,
    description: input.description,
    datePosted: undefined,
    offers: {
      '@type': 'Offer',
      price: input.price,
      priceCurrency: input.currency ?? 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: compact({
      '@type': 'PostalAddress',
      streetAddress: input.address.line1,
      addressLocality: input.address.city,
      addressRegion: input.address.state,
      postalCode: input.address.zip,
      addressCountry: 'US',
    }),
    ...(input.images && input.images.length > 0 ? { image: [...input.images] } : {}),
    provider: { '@id': ORGANISATION_ID },
  });
}

/* -------------------------------------------------------------------------- */
/* Assembly                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Wraps nodes into a single `@graph`, which is one script tag instead of five
 * and lets nodes reference each other by `@id`. Nulls are dropped, so callers
 * pass generators' output straight through.
 */
export function graph(...nodes: (JsonLd | null | undefined)[]): string {
  const present = nodes.filter((n): n is JsonLd => Boolean(n));
  return JSON.stringify({ '@context': CONTEXT, '@graph': present });
}
