# Journal posts

One Markdown file per article in `src/content/blog/`. The filename becomes the
URL slug (`market-notes-q1.md` → `/blog/market-notes-q1/`).

## The rule that comes before everything else

**Articles are written, never generated.** Every post carries a named byline,
which makes a fabricated article worse than fabricated listing data — it puts
words in Martin's or MaryEllen's mouth, on a subject their clients act on.

Do not write market commentary, statistics, predictions or neighbourhood claims
without a citable, dated source. If the article needs a figure nobody has
supplied, leave the figure out and say what is actually known.

## Front matter

```yaml
---
title: 'Article title'
excerpt: 'One or two sentences. Used on cards and as the meta description.'
publishedAt: 2026-03-04
updatedAt: 2026-04-01          # optional — shows an "updated" line
author: martin-hoffman         # or maryellen-closius
category: market               # market | buying | selling | communities | relocation
tags: ['inspections', 'condominiums']
heroImage:
  src: /images/blog/example.jpg
  alt: 'Describe what the photograph shows.'
relatedCommunities: ['hollywood', 'aventura']   # slugs from src/data/communities.ts
relatedProperties: []          # listing slugs, resolved through the provider
draft: false
---
```

| Field | Effect |
| --- | --- |
| `title` | The `<h1>` and the browser title. |
| `excerpt` | Card copy and the meta description. Required. |
| `publishedAt` | Orders the index. Required. |
| `updatedAt` | Optional. Shows "Updated …" beside the published date. |
| `author` | Must be `martin-hoffman` or `maryellen-closius`. Drives the byline and the author card. |
| `category` | Groups the post on the index; drives related reading. |
| `tags` | Free text. Rendered under the article and searchable on the index. |
| `heroImage` | Full-width image above the body. Omitted → the neutral placeholder. |
| `relatedCommunities` | Community slugs. Unknown slugs are dropped, never guessed. |
| `relatedProperties` | Listing slugs. Resolved live; absent listings simply do not render. |
| `draft` | Hidden everywhere, in every mode. Use while writing. |
| `seo` | **Reserved for the later SEO phase. Leave empty.** |

## What the template does for you

- **Table of contents** — generated from the article's own `##` and `###`
  headings. It appears only once there are two or more `##` sections; a
  one-item contents list is furniture.
- **Reading time** — from the word count. An estimate, and labelled as one.
- **Related reading** — same category first, then anything else.
- **Author card** — name, title and both direct lines. No biography: that lives
  in `professionals[].bio` and renders on the profile page.

## Sample posts

`src/content/blog/sample-*.md` carry `sample: true`. They are **structural
placeholders**, not editorial content: they exist so the template can be
reviewed before anything real has been written.

A sample post:

- renders only when `flags.demoContent` is on — so **never in a production
  build**;
- is badged on every card and behind a notice at the top of the article;
- is marked `noindex` and excluded from the sitemap;
- only ever appears as related reading from another sample post.

**Delete them once the first real article exists.** Nothing references them by
name, and the journal falls back to its empty state.

Never set `sample: true` on a real article, and never set it `false` on one of
these files to "get it live".

## Publishing checklist

- [ ] Written or approved by the person in the byline.
- [ ] Every figure has a source, or has been removed.
- [ ] No prediction about where prices are going.
- [ ] `excerpt` reads well on a card and as a search result.
- [ ] `relatedCommunities` slugs match `src/data/communities.ts`.
- [ ] `npm run build` passes.
