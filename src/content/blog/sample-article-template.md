---
title: 'Sample: what an article looks like'
excerpt: 'A structural placeholder showing the article template — headings, lists, quotes and a table of contents. It is not editorial content and says nothing about the market.'
publishedAt: 2026-08-27
author: martin-hoffman
category: market
tags: ['sample', 'template']
sample: true
relatedCommunities: ['hollywood', 'fort-lauderdale']
---

This file exists so the article template can be reviewed before anything real
has been written. It is **not** an article, it makes no claim about property in
South Florida, and it never appears in a production build.

Everything below is here to exercise a piece of the template: heading levels,
the generated table of contents, lists, quotes, links and long-form typography.
Replace this file with a real post and delete it.

## How a real article gets written

Articles are written by Martin or MaryEllen, or written from a conversation
with them and approved before publishing. Nothing here is generated.

That matters more on a journal than anywhere else on the site. A post carries a
named byline, and the person under it has to stand behind every sentence to
clients who read it.

### What a post should not contain

- Market statistics, medians or forecasts without a citable, dated source.
- Predictions about where prices are going.
- Anything about a specific building, association or neighbourhood that has not
  been checked.

### What a post is good for

- Explaining a stage of the process that people repeatedly ask about.
- Writing up something genuinely learned from a recent transaction, with the
  identifying details removed.
- Answering a question properly, once, so it can be sent to the next person who
  asks it.

## Typography this template handles

Body copy sets at a comfortable measure with generous leading. Links inside a
paragraph, such as [the buying guide](/resources/buying-guide/), pick up the
site's underline treatment. Emphasis is available as *italic* and **bold**, and
`inline code` is styled although a real estate journal will rarely need it.

> A block quote sits inset with a gold rule. Useful for quoting a contract
> clause, a lender's wording, or something a client said that they have given
> permission to publish.

Numbered sequences work too:

1. First step.
2. Second step.
3. Third step.

---

A horizontal rule separates sections where a heading would be too heavy.

## Front matter reference

Every field on this file is documented in `docs/authoring-blog-posts.md`. The
ones that shape the page:

| Field | Effect |
| --- | --- |
| `heroImage` | Full-width image above the title. Omitted here, so the template shows its placeholder. |
| `category` | Groups the post on the index and drives related reading. |
| `tags` | Free text, shown under the article. |
| `relatedCommunities` | Slugs from the communities data; renders links to those guides. |
| `updatedAt` | Shows an "updated" line beside the published date. |

## Removing this file

Delete `src/content/blog/sample-article-template.md`. Nothing references it by
name, and the journal falls back to its empty state until a real post exists.
