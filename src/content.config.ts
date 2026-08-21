import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Journal / blog collection.
 *
 * No posts exist yet — articles are written with the client, never generated.
 * Add Markdown files to src/content/blog/ and the /blog/ routes pick them up.
 * Authoring guide: docs/authoring-blog-posts.md
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Must be a real person on the team. */
    author: z.enum(['martin-hoffman', 'maryellen-closius']),
    category: z
      .enum(['market', 'buying', 'selling', 'communities', 'relocation'])
      .default('market'),
    heroImage: z
      .object({ src: z.string(), alt: z.string() })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
