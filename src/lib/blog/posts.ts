/**
 * Reading the journal collection.
 *
 * One place decides what is publishable, so the index, the article routes, the
 * related-reading lists and the sitemap can never disagree about it.
 *
 * ── The rules ─────────────────────────────────────────────────────────────
 *  - `draft: true`  → never rendered, in any mode.
 *  - `sample: true` → rendered only when `flags.demoContent` is on, always
 *                     badged, never in the sitemap, never offered as related
 *                     reading from a real article.
 *
 * A sample post is scaffolding: it exists so the template can be reviewed
 * before the client has written anything. It is not editorial content and must
 * never read as though it were.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { flags } from '@config/flags';

export type Post = CollectionEntry<'blog'>;

export const isSample = (post: Post): boolean => post.data.sample === true;

/** Newest first. Ties broken by title so the order is stable across builds. */
const byDate = (a: Post, b: Post): number => {
  const diff = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  return diff !== 0 ? diff : a.data.title.localeCompare(b.data.title);
};

/**
 * Everything that may be rendered in the current mode.
 *
 * Note the `sample` gate reads `flags.demoContent`, which is false in a
 * production build — so a production site with no real articles has an empty
 * journal, which is the honest state.
 */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts
    .filter((post) => (isSample(post) ? flags.demoContent : true))
    .sort(byDate);
}

/** Real articles only. Used for the sitemap and for related reading. */
export async function realPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.filter((post) => !isSample(post)).sort(byDate);
}

/** True when the journal has at least one genuine article. */
export async function hasRealPosts(): Promise<boolean> {
  return (await realPosts()).length > 0;
}

/**
 * Related reading for an article.
 *
 * Same category first, then anything else, newest first. A sample post only
 * ever relates to other sample posts — a structural placeholder must never be
 * recommended from a real article, and a real article should not have its
 * related list padded with scaffolding.
 */
export async function relatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const pool = (await publishedPosts()).filter(
    (candidate) =>
      candidate.id !== post.id && isSample(candidate) === isSample(post),
  );

  const sameCategory = pool.filter(
    (candidate) => candidate.data.category === post.data.category,
  );
  const rest = pool.filter(
    (candidate) => candidate.data.category !== post.data.category,
  );

  return [...sameCategory, ...rest].slice(0, limit);
}

/** Categories actually in use, with counts. Drives the index filter chips. */
export function categoryCounts(
  posts: readonly Post[],
): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.data.category, (counts.get(post.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

/** Every tag in use across the given posts, alphabetically. */
export function allTags(posts: readonly Post[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) for (const tag of post.data.tags) tags.add(tag);
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export const CATEGORY_LABELS: Record<string, string> = {
  market: 'Market',
  buying: 'Buying',
  selling: 'Selling',
  communities: 'Communities',
  relocation: 'Relocation',
};

export const categoryLabel = (category: string): string =>
  CATEGORY_LABELS[category] ?? category;

/**
 * Reading time, from a word count at 200 words per minute.
 *
 * Rounded up and floored at one minute — "0 min read" is never useful, and a
 * decimal is false precision on an estimate this rough.
 */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * A table of contents from the rendered headings Astro gives us.
 *
 * Only h2 and h3: an article deep enough to need h4 in its contents is an
 * article that should be split. Returns an empty array when there are fewer
 * than two h2s, because a one-item contents list is furniture.
 */
export interface TocEntry {
  readonly depth: number;
  readonly slug: string;
  readonly text: string;
}

export function buildToc(
  headings: readonly { depth: number; slug: string; text: string }[],
): TocEntry[] {
  const usable = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const topLevel = usable.filter((h) => h.depth === 2);
  if (topLevel.length < 2) return [];
  return usable.map((h) => ({ depth: h.depth, slug: h.slug, text: h.text }));
}
