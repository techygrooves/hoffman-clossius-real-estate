/**
 * ---------------------------------------------------------------------------
 * NAVIGATION MAP
 * ---------------------------------------------------------------------------
 * Single source of truth for header, mobile drawer and footer menus.
 * Adding a route here is what makes it appear in the UI — pages themselves
 * never declare their own nav position.
 * ---------------------------------------------------------------------------
 */

export type NavLink = {
  readonly label: string;
  readonly href: string;
  /** Short supporting line shown in the desktop mega-menu and mobile drawer. */
  readonly description?: string;
  /** Hidden from menus but kept here so route metadata stays centralised. */
  readonly hidden?: boolean;
};

export type NavGroup = {
  readonly label: string;
  /** Present when the group's own landing page exists. */
  readonly href?: string;
  readonly items: readonly NavLink[];
};

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup =>
  'items' in entry;

/* -------------------------------------------------------------------------- */
/* Primary navigation                                                          */
/* -------------------------------------------------------------------------- */

export const primaryNav: readonly NavEntry[] = [
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
        description: 'Search the market by location, price and features.',
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
        label: 'Established Developments',
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
        label: 'Buying With Us',
        href: '/buy/',
        description: 'How representation works from search to closing.',
      },
      {
        label: 'Dream Home Finder',
        href: '/buy/dream-home-finder/',
        description: 'Tell us what you are looking for and we will find it.',
      },
      {
        label: 'Buying Guide',
        href: '/resources/buying-guide/',
        description: 'A step-by-step walkthrough of the purchase process.',
      },
      {
        label: 'Mortgage Calculator',
        href: '/mortgage-calculator/',
        description: 'Estimate monthly payments before you tour.',
      },
    ],
  },
  {
    label: 'Sell',
    href: '/sell/',
    items: [
      {
        label: 'Selling With Us',
        href: '/sell/',
        description: 'Marketing, positioning and negotiation.',
      },
      {
        label: 'Home Evaluation',
        href: '/sell/home-evaluation/',
        description: 'Request a considered opinion of value.',
      },
      {
        label: 'Median Home Values',
        href: '/sell/median-home-values/',
        description: 'Understand where your neighbourhood stands.',
      },
      {
        label: 'Selling Guide',
        href: '/resources/selling-guide/',
        description: 'What to expect from listing to closing.',
      },
    ],
  },
  {
    label: 'Communities',
    href: '/communities/',
    items: [
      {
        label: 'All Communities',
        href: '/communities/',
        description: 'Neighbourhood guides across South Florida.',
      },
      {
        label: 'Relocation',
        href: '/relocation/',
        description: 'Moving to South Florida from out of state or abroad.',
      },
    ],
  },
  {
    label: 'About',
    href: '/about/',
    items: [
      {
        label: 'About Us',
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
      {
        label: 'Journal',
        href: '/blog/',
        description: 'Market notes and neighbourhood writing.',
      },
      { label: 'FAQ', href: '/faq/' },
    ],
  },
  { label: 'Contact', href: '/contact/' },
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
      { label: 'Established Developments', href: '/developments/existing/' },
    ],
  },
  {
    label: 'Buying & Selling',
    items: [
      { label: 'Buy', href: '/buy/' },
      { label: 'Dream Home Finder', href: '/buy/dream-home-finder/' },
      { label: 'Sell', href: '/sell/' },
      { label: 'Home Evaluation', href: '/sell/home-evaluation/' },
      { label: 'Median Home Values', href: '/sell/median-home-values/' },
      { label: 'Mortgage Calculator', href: '/mortgage-calculator/' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Communities', href: '/communities/' },
      { label: 'Relocation', href: '/relocation/' },
      { label: 'Buying Guide', href: '/resources/buying-guide/' },
      { label: 'Selling Guide', href: '/resources/selling-guide/' },
      { label: 'Journal', href: '/blog/' },
      { label: 'FAQ', href: '/faq/' },
    ],
  },
  {
    label: 'Our Team',
    items: [
      { label: 'About Us', href: '/about/' },
      { label: 'Martin Hoffman P.A.', href: '/about/martin-hoffman/' },
      { label: 'MaryEllen Closius P.A.', href: '/about/maryellen-closius/' },
      { label: 'Testimonials', href: '/testimonials/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

/** Small print row at the very bottom of the footer. */
export const legalNav: readonly NavLink[] = [
  { label: 'Accessibility', href: '/accessibility/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Use', href: '/terms/' },
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
    ? entry.items.some((item) => isWithin(item.href, current)) ||
      (entry.href ? isWithin(entry.href, current) : false)
    : isWithin(entry.href, current);
