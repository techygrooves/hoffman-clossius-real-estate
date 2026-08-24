/**
 * ---------------------------------------------------------------------------
 * NAVIGATION MAP
 * ---------------------------------------------------------------------------
 * Single source of truth for the header, mobile drawer, mobile action bar and
 * footer menus. Adding a route here is what makes it appear in the UI — pages
 * never declare their own nav position.
 *
 * Every href here must resolve to a real route. `npm run verify:links` walks
 * this file against the built output and fails on any dead link.
 * ---------------------------------------------------------------------------
 */

export type NavLink = {
  readonly label: string;
  readonly href: string;
  /** Short supporting line shown in the desktop dropdown. */
  readonly description?: string;
};

export type NavGroup = {
  readonly label: string;
  /** The group's own landing page, when it has one. */
  readonly href?: string;
  /** Renders the dropdown in two columns — for longer lists only. */
  readonly columns?: 1 | 2;
  readonly items: readonly NavLink[];
};

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup =>
  'items' in entry;

/* -------------------------------------------------------------------------- */
/* Primary navigation                                                          */
/* -------------------------------------------------------------------------- */

export const primaryNav: readonly NavEntry[] = [
  { label: 'Home', href: '/' },

  {
    label: 'Properties',
    href: '/properties/search/',
    items: [
      {
        label: 'For Sale',
        href: '/properties/for-sale/',
        description: 'Homes and condominiums currently on the market.',
      },
      {
        label: 'For Rent',
        href: '/properties/for-rent/',
        description: 'Seasonal and annual rental opportunities.',
      },
      {
        label: 'Our Listings',
        href: '/properties/our-listings/',
        description: 'Properties represented by Hoffman & Closius.',
      },
      {
        label: 'Property Search',
        href: '/properties/search/',
        description: 'Search by location, price and features.',
      },
    ],
  },

  {
    label: 'Developments',
    items: [
      {
        label: 'New Developments',
        href: '/developments/new/',
        description: 'Pre-construction and newly delivered communities.',
      },
      {
        label: 'Existing Developments',
        href: '/developments/existing/',
        description: 'Long-established South Florida communities.',
      },
    ],
  },

  {
    label: 'Buy',
    href: '/buy/',
    items: [
      {
        label: 'Buyer Services',
        href: '/buy/',
        description: 'How representation works from search to closing.',
      },
      {
        label: 'Dream Home Finder',
        href: '/buy/dream-home-finder/',
        description: 'Tell us what you are looking for.',
      },
    ],
  },

  {
    label: 'Sell',
    href: '/sell/',
    items: [
      {
        label: 'Seller Services',
        href: '/sell/',
        description: 'Preparation, pricing, marketing and negotiation.',
      },
      {
        label: 'Free Home Evaluation',
        href: '/sell/home-evaluation/',
        description: 'Request a considered opinion of value.',
      },
      {
        label: 'Median Home Values',
        href: '/sell/median-home-values/',
        description: 'See where your neighbourhood stands.',
      },
    ],
  },

  {
    label: 'Communities',
    href: '/communities/',
    columns: 2,
    items: [
      { label: 'Explore Communities', href: '/communities/' },
      { label: 'Hollywood', href: '/communities/hollywood/' },
      { label: 'Fort Lauderdale', href: '/communities/fort-lauderdale/' },
      { label: 'Dania Beach', href: '/communities/dania-beach/' },
      { label: 'Hallandale Beach', href: '/communities/hallandale-beach/' },
      { label: 'Pembroke Pines', href: '/communities/pembroke-pines/' },
      { label: 'Aventura', href: '/communities/aventura/' },
    ],
  },

  {
    label: 'About',
    href: '/about/',
    items: [
      {
        label: 'About Hoffman & Closius',
        href: '/about/',
        description: 'How we work and who we work with.',
      },
      { label: 'Martin Hoffman P.A.', href: '/about/martin-hoffman/' },
      { label: 'MaryEllen Closius P.A.', href: '/about/maryellen-closius/' },
      {
        label: 'Testimonials',
        href: '/testimonials/',
        description: 'In the words of the people we have represented.',
      },
    ],
  },

  {
    label: 'Resources',
    columns: 2,
    items: [
      { label: 'Blog', href: '/blog/' },
      { label: 'Mortgage Calculator', href: '/mortgage-calculator/' },
      { label: 'Buying Guide', href: '/resources/buying-guide/' },
      { label: 'Selling Guide', href: '/resources/selling-guide/' },
      { label: 'Relocation', href: '/relocation/' },
      { label: 'FAQs', href: '/faq/' },
    ],
  },

  { label: 'Contact', href: '/contact/' },
];

/** The single primary call to action in the header. */
export const headerCta = {
  label: 'Search Homes',
  href: '/properties/search/',
} as const;

/* -------------------------------------------------------------------------- */
/* Mobile sticky action bar                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The four thumb-reachable actions pinned to the bottom of the viewport on
 * phones and tablets. `kind: 'call'` opens a disclosure listing both direct
 * lines — there is no confirmed shared number and lead routing is unconfirmed
 * (CONTENT_PENDING.md 2.2 / 6.3), so the site must not pick an agent for the
 * caller.
 */
export type MobileAction =
  | { readonly kind: 'call'; readonly label: string; readonly srLabel: string }
  | {
      readonly kind: 'link';
      readonly label: string;
      readonly srLabel: string;
      readonly href: string;
    };

export const mobileActions: readonly MobileAction[] = [
  { kind: 'call', label: 'Call', srLabel: 'Call — choose an agent' },
  {
    kind: 'link',
    label: 'Search',
    srLabel: 'Search homes for sale',
    href: '/properties/search/',
  },
  {
    kind: 'link',
    label: 'Home Value',
    srLabel: 'Request a free home evaluation',
    href: '/sell/home-evaluation/',
  },
  {
    kind: 'link',
    label: 'Contact',
    srLabel: 'Contact Hoffman & Closius',
    href: '/contact/',
  },
];

/* -------------------------------------------------------------------------- */
/* Footer navigation                                                           */
/* -------------------------------------------------------------------------- */

export const footerNav: readonly NavGroup[] = [
  {
    label: 'Properties',
    items: [
      { label: 'For Sale', href: '/properties/for-sale/' },
      { label: 'For Rent', href: '/properties/for-rent/' },
      { label: 'Our Listings', href: '/properties/our-listings/' },
      { label: 'Property Search', href: '/properties/search/' },
      { label: 'New Developments', href: '/developments/new/' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Buy', href: '/buy/' },
      { label: 'Sell', href: '/sell/' },
      { label: 'Dream Home Finder', href: '/buy/dream-home-finder/' },
      { label: 'Home Evaluation', href: '/sell/home-evaluation/' },
      { label: 'Relocation', href: '/relocation/' },
      { label: 'Mortgage Calculator', href: '/mortgage-calculator/' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Communities', href: '/communities/' },
      { label: 'About', href: '/about/' },
      { label: 'Testimonials', href: '/testimonials/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Accessibility / ADA Compliance', href: '/accessibility/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms', href: '/terms/' },
    ],
  },
];

/** Small print row at the very bottom of the footer. */
export const legalNav: readonly NavLink[] = [
  { label: 'Accessibility / ADA Compliance', href: '/accessibility/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms', href: '/terms/' },
];

/** Account routes — deliberately kept out of the primary menu. */
export const accountNav: readonly NavLink[] = [
  { label: 'Sign In', href: '/login/' },
  { label: 'Create Account', href: '/register/' },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Normalises a pathname so `/buy` and `/buy/` compare equal. */
export const normalisePath = (path: string): string => {
  const [withoutQuery] = path.split(/[?#]/);
  const trimmed = (withoutQuery ?? '/').replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

/** True when `href` is the current page. */
export const isCurrent = (href: string, current: string): boolean =>
  normalisePath(href) === normalisePath(current);

/** True when `href` is the current page or one of its ancestors. */
export const isWithin = (href: string, current: string): boolean => {
  const target = normalisePath(href);
  const here = normalisePath(current);
  if (target === '/') return here === '/';
  return here === target || here.startsWith(`${target}/`);
};

/** True when any link inside a nav entry matches the current page. */
export const entryIsActive = (entry: NavEntry, current: string): boolean =>
  isNavGroup(entry)
    ? entry.items.some((item) => isWithin(item.href, current))
    : isWithin(entry.href, current);

/** Every href referenced anywhere in the navigation, de-duplicated. */
export const allNavHrefs = (): string[] => {
  const hrefs = new Set<string>();
  const add = (href: string) => {
    if (href.startsWith('/')) hrefs.add(href);
  };

  for (const entry of primaryNav) {
    if (isNavGroup(entry)) {
      if (entry.href) add(entry.href);
      entry.items.forEach((item) => add(item.href));
    } else {
      add(entry.href);
    }
  }
  for (const group of footerNav) group.items.forEach((i) => add(i.href));
  legalNav.forEach((l) => add(l.href));
  accountNav.forEach((l) => add(l.href));
  mobileActions.forEach((a) => {
    if (a.kind === 'link') add(a.href);
  });
  add(headerCta.href);

  return [...hrefs].sort();
};
