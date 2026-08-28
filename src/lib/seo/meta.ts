/**
 * ---------------------------------------------------------------------------
 * PAGE METADATA — one place that decides what goes in every <head>
 * ---------------------------------------------------------------------------
 * `BaseLayout` used to assemble titles, canonicals and social tags inline,
 * which meant every rule about them lived in a template. This module owns them
 * instead, so a page supplies facts and the rules are applied once.
 *
 * ── What this deliberately does not do ────────────────────────────────────
 * It writes no copy. Titles and descriptions come from the page, and the only
 * transformation is appending the site name. **No keyword stuffing, no
 * "Best …", no city lists bolted onto a title.** Descriptive titles now; the
 * deliberate optimisation pass is SEO_PHASE_2.md.
 * ---------------------------------------------------------------------------
 */
import { site } from '@config/site';

/** Robots directives. `noindex` also implies `nofollow` here. */
export type RobotsPolicy = 'index' | 'noindex';

export interface PageMetaInput {
  /** Page title without the site suffix. Omit on the homepage. */
  readonly title?: string;
  /** Overrides the automatic "Title | Site" pattern entirely. */
  readonly fullTitle?: string;
  readonly description?: string;
  /** Pathname of the current page, e.g. "/about/". */
  readonly pathname: string;
  /** Social share image, a path under /public. */
  readonly ogImage?: string;
  readonly robots?: RobotsPolicy;
  /** 'article' for journal posts; 'website' everywhere else. */
  readonly ogType?: 'website' | 'article';
  /** ISO dates, articles only. */
  readonly publishedTime?: string | null;
  readonly modifiedTime?: string | null;
}

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  /** Absolute canonical URL, or null while the domain is unconfirmed. */
  readonly canonical: string | null;
  /** The `robots` meta content, or null when the page is indexable. */
  readonly robots: string | null;
  readonly ogType: 'website' | 'article';
  readonly ogImage: string | null;
  readonly publishedTime: string | null;
  readonly modifiedTime: string | null;
}

/**
 * Absolute URL on the canonical origin.
 *
 * Returns null while `site.urlConfirmed` is false — publishing a canonical
 * that points at a host the site is not served from is worse than publishing
 * none, because it tells a crawler the real page is somewhere else.
 */
export function absolute(pathname: string): string | null {
  if (!site.urlConfirmed) return null;
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(clean, site.url).toString();
}

/**
 * Trailing slash, always.
 *
 * `trailingSlash: 'always'` and `build.format: 'directory'` mean /about/ and
 * /about are the same page served at one URL. A canonical that disagrees with
 * the served URL invites a crawler to treat them as two.
 */
export function canonicalPath(pathname: string): string {
  if (pathname === '/') return '/';
  const [path] = pathname.split(/[?#]/);
  const trimmed = (path ?? '/').replace(/\/+$/, '');
  return `${trimmed}/`;
}

export function buildPageMeta(input: PageMetaInput): PageMeta {
  const {
    title,
    fullTitle,
    description = site.description,
    pathname,
    ogImage,
    robots = 'index',
    ogType = 'website',
    publishedTime = null,
    modifiedTime = null,
  } = input;

  return {
    title:
      fullTitle ??
      (title ? `${title} | ${site.titleSuffix}` : `${site.name} — ${site.tagline}`),
    description,
    // A noindexed page gets no canonical: it is not asking to be indexed
    // anywhere, and a canonical on it is a mixed signal.
    canonical: robots === 'noindex' ? null : absolute(canonicalPath(pathname)),
    robots: robots === 'noindex' ? 'noindex, nofollow' : null,
    ogType,
    ogImage: ogImage ?? null,
    publishedTime,
    modifiedTime,
  };
}
