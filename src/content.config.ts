/**
 * ---------------------------------------------------------------------------
 * JOURNAL / BLOG COLLECTION
 * ---------------------------------------------------------------------------
 * One Markdown file per article in `src/content/blog/`. The filename becomes
 * the slug. Authoring guide: `docs/authoring-blog-posts.md`.
 *
 * ── Articles are written, never generated ─────────────────────────────────
 * Every post carries a named author who is a real person on the team. That
 * makes a fabricated article worse than fabricated listing data: it puts words
 * in someone's mouth, under their byline, on a subject their clients act on.
 *
 * So: no generated market commentary, no invented statistics, no predictions,
 * and no back-dated articles that were never written (PROJECT_CONTEXT.md §9).
 *
 * `sample: true` marks a structural placeholder — a file that exists to show
 * what the template does, not to say anything about the market. Sample posts
 * render ONLY when `flags.demoContent` is on (so never in a production build),
 * are visibly badged, and are excluded from the sitemap and from related-post
 * links. See `src/lib/blog/posts.ts`.
 *
 * `seo` is reserved for the later SEO phase and is empty by default. Do not
 * pre-fill it with keyword variations.
 * ---------------------------------------------------------------------------
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const BLOG_CATEGORIES = [
  'market',
  'buying',
  'selling',
  'communities',
  'relocation',
] as const;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences, used on cards and as the meta description. */
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Must be a real person on the team — see `professionals` in site.ts. */
    author: z.enum(['martin-hoffman', 'maryellen-closius']),
    category: z.enum(BLOG_CATEGORIES).default('market'),
    tags: z.array(z.string()).default([]),
    heroImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional(),
    /** Community slugs from `src/data/communities.ts`. */
    relatedCommunities: z.array(z.string()).default([]),
    /** Listing slugs. Resolved through the listing provider, never hardcoded. */
    relatedProperties: z.array(z.string()).default([]),
    /** Hidden everywhere. Use while drafting. */
    draft: z.boolean().default(false),
    /**
     * Structural placeholder, not editorial content. Dev-only, badged, and
     * excluded from the sitemap. Never set this on a real article.
     */
    sample: z.boolean().default(false),
    /** Reserved for the SEO phase. Leave empty. */
    seo: z
      .object({
        title: z.string().nullable().default(null),
        description: z.string().nullable().default(null),
        keywords: z.array(z.string()).default([]),
      })
      .default({ title: null, description: null, keywords: [] }),
  }),
});

export const collections = { blog };
