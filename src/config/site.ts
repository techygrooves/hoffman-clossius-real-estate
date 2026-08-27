/**
 * ---------------------------------------------------------------------------
 * CENTRAL SITE CONFIGURATION — Hoffman & Closius
 * ---------------------------------------------------------------------------
 * This is the single source of truth for reusable, CONFIRMED client data.
 * Components must import from here instead of hardcoding names, phones,
 * emails or brand values.
 *
 * RULES (see PROJECT_CONTEXT.md):
 *  - Only add a value here once the client has CONFIRMED it.
 *  - Anything unconfirmed lives in `pending` below as `null` and is logged in
 *    CONTENT_PENDING.md. Never replace a `null` with an invented value.
 *  - Components must handle `null` gracefully (render nothing, not a guess).
 * ---------------------------------------------------------------------------
 */

export type ContactChannel = {
  readonly label: string;
  readonly value: string;
  readonly href: string;
};

export type Professional = {
  readonly slug: string;
  readonly firstName: string;
  readonly lastName: string;
  /** Full name exactly as the client presents it, including the P.A. suffix. */
  readonly name: string;
  readonly title: string;
  /** Optional secondary title, e.g. a specialisation. */
  readonly specialty: string | null;
  readonly phone: ContactChannel;
  readonly email: ContactChannel;
  readonly href: string;
  /** Portrait lives in /public/images/team/. Null until the client supplies it. */
  readonly portrait: string | null;
  /**
   * Long-form biography, as paragraphs. Null until the client supplies or
   * approves it — never written from scratch, and never assembled from a
   * brokerage profile page (CONTENT_PENDING.md 8.1–8.2).
   *
   * `PersonBio` renders these verbatim when present and a neutral, factual
   * introduction when null, so supplying the copy is a one-line change here.
   */
  readonly bio: readonly string[] | null;
  /**
   * Areas of focus, in the person's own words or approved by them.
   *
   * Empty today, and it stays empty until confirmed: a speciality is a claim
   * about competence, and guessing one from a job title is the kind of thing
   * a client gets asked about in a listing appointment. MaryEllen's
   * "Relocation Specialist" lives in `specialty` above because it is part of
   * her confirmed title — it is not evidence of anything else.
   * CONTENT_PENDING.md 8.5.
   */
  readonly specialties: readonly string[];
  /** State licence number, null until confirmed. */
  readonly licenseNumber: string | null;
};

/** Formats "9546054823" style digits for tel: hrefs. */
const tel = (digits: string) => `tel:+1${digits.replace(/\D/g, '')}`;

/* -------------------------------------------------------------------------- */
/* Identity                                                                    */
/* -------------------------------------------------------------------------- */

export const site = {
  /** Public-facing name of the team. */
  name: 'Hoffman & Closius',
  /** Short form for tight spaces (mobile header, breadcrumbs). */
  shortName: 'Hoffman & Closius',
  /** Used in <title> suffixes. */
  titleSuffix: 'Hoffman & Closius',
  tagline: 'South Florida Real Estate',
  description:
    'Hoffman & Closius — South Florida real estate representation for buyers, sellers and relocating families across Broward, Palm Beach and Miami-Dade.',
  locale: 'en-US',
  lang: 'en',
  region: 'South Florida',

  /**
   * PLACEHOLDER DOMAIN — NOT CONFIRMED BY THE CLIENT.
   * Canonical / og:url tags stay suppressed while `urlConfirmed` is false.
   * See CONTENT_PENDING.md → "Primary domain".
   */
  url: 'https://hoffmanclosius.com',
  urlConfirmed: false,
} as const;

/* -------------------------------------------------------------------------- */
/* Professionals — CONFIRMED contact details                                   */
/* -------------------------------------------------------------------------- */

export const professionals: readonly Professional[] = [
  {
    slug: 'martin-hoffman',
    firstName: 'Martin',
    lastName: 'Hoffman',
    name: 'Martin Hoffman P.A.',
    title: 'Broker-Associate',
    specialty: null,
    phone: { label: 'Phone', value: '954-605-4823', href: tel('9546054823') },
    email: {
      label: 'Email',
      value: 'MartinHoffman@keyes.com',
      href: 'mailto:MartinHoffman@keyes.com',
    },
    href: '/about/martin-hoffman/',
    portrait: null,
    bio: null,
    specialties: [],
    licenseNumber: null,
  },
  {
    slug: 'maryellen-closius',
    firstName: 'MaryEllen',
    lastName: 'Closius',
    name: 'MaryEllen Closius P.A.',
    title: 'Realtor Associate',
    specialty: 'Relocation Specialist',
    phone: { label: 'Phone', value: '954-471-4626', href: tel('9544714626') },
    email: {
      label: 'Email',
      value: 'MaryEllenC@keyes.com',
      href: 'mailto:MaryEllenC@keyes.com',
    },
    href: '/about/maryellen-closius/',
    portrait: null,
    bio: null,
    specialties: [],
    licenseNumber: null,
  },
] as const;

export const getProfessional = (slug: string): Professional | undefined =>
  professionals.find((p) => p.slug === slug);

/* -------------------------------------------------------------------------- */
/* Brokerage brand assets                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The Keyes logo is displayed as an unmodified brand asset.
 * Do NOT recolour, redraw, stretch, crop or add effects to it, and do NOT add
 * explanatory relationship wording anywhere in the UI.
 *
 * Drop the official files at the paths below and the <KeyesLogo> component
 * picks them up automatically at build time.
 */
export const brokerageBrand = {
  name: 'Keyes',
  /** Full-colour / dark-ink lockup for light backgrounds. */
  logoLight: '/brand/keyes-logo.svg',
  /** Reversed (white) lockup for evergreen / dark backgrounds. */
  logoDark: '/brand/keyes-logo-white.svg',
  /** Accessible name for the image. Intentionally descriptive only. */
  alt: 'Keyes',
  /** Intrinsic dimensions of the supplied asset; update when the file lands. */
  width: 320,
  height: 96,
} as const;

/* -------------------------------------------------------------------------- */
/* Design tokens (mirrors src/styles/tokens.css — keep the two in sync)        */
/* -------------------------------------------------------------------------- */

export const brand = {
  colors: {
    evergreen: '#063F35',
    white: '#FFFFFF',
    offWhite: '#F7F6F2',
    sage: '#E8EFEA',
    charcoal: '#1C2522',
    gold: '#C9A34A',
  },
  fonts: {
    serif: '"Cormorant Garamond Variable", "Cormorant Garamond", Garamond, "Times New Roman", serif',
    sans: '"Inter Variable", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  /** Browser UI colour + PWA theme colour. */
  themeColor: '#063F35',
} as const;

/* -------------------------------------------------------------------------- */
/* Service area — geographic scope the client works in                         */
/* -------------------------------------------------------------------------- */

export const serviceArea = {
  counties: ['Broward County', 'Palm Beach County', 'Miami-Dade County'],
} as const;

/* -------------------------------------------------------------------------- */
/* PENDING CLIENT CONFIRMATION — do not invent values for anything below       */
/* -------------------------------------------------------------------------- */

export const pending = {
  /** Physical office address. */
  officeAddress: null as null | {
    street: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
  },
  /** Shared office / team phone, if different from the individual numbers. */
  officePhone: null as ContactChannel | null,
  /** Public office hours. */
  officeHours: null as string | null,

  /** Social profiles. Add entries only once URLs are confirmed. */
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    x: null as string | null,
  },

  /** Third-party review destinations. */
  reviews: {
    google: null as string | null,
    zillow: null as string | null,
    realtorDotCom: null as string | null,
  },

  /** IDX / MLS feed. No listing data may be fabricated or scraped. */
  idx: {
    provider: null as string | null,
    embedType: null as null | 'iframe' | 'script' | 'api',
    searchUrl: null as string | null,
    agentIds: null as string[] | null,
  },

  /** Where contact / lead forms POST to. */
  forms: {
    endpoint: null as string | null,
    method: 'POST' as const,
    successUrl: null as string | null,
  },

  /** Brokerage legal / licence footer wording, supplied by the brokerage. */
  legal: {
    brokerageLegalName: null as string | null,
    brokerageLicense: null as string | null,
    footerDisclosure: null as string | null,
    equalHousingRequired: null as boolean | null,
    dmcaNotice: null as string | null,
  },

  /** Analytics / tracking. */
  analytics: {
    googleAnalyticsId: null as string | null,
    googleSiteVerification: null as string | null,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Convenience helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Social links that actually have a confirmed URL. */
export const activeSocialLinks = Object.entries(pending.social)
  .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  .map(([key, href]) => ({ key, href }));

/** Absolute URL builder — falls back to a root-relative path until the domain is confirmed. */
export const absoluteUrl = (path: string): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return site.urlConfirmed ? new URL(clean, site.url).toString() : clean;
};
