---
title: "Notes on Astro 5 and Cloudflare Workers"
description: "What changed when I moved this site to Astro 5's Content Layer API and kept it on Cloudflare Workers."
pubDate: 2026-10-01
tags: ["astro", "cloudflare", "architecture"]
---

A few notes from updating this site's build and deploy setup.

### Astro 5's Content Layer

Astro 5 moved content loading behind loaders (`glob`, `file`, or a custom fetcher) instead of tying everything to folder conventions. This devlog is a `glob` collection over a folder of Markdown files with a small zod schema:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});
```

The practical win is that the schema catches a bad or missing frontmatter field at build time, so a typo in a date fails the build rather than showing up on the page.

### Why I'm still on Cloudflare Workers

Deploying with `@astrojs/cloudflare` means there's no server to maintain and the first byte comes from an edge location near the reader. Since nearly everything here is prerendered, the worker only handles routing and the static assets serve straight from cache.

The site ships zero client JS by default and leans on semantic HTML and CSS tokens, which keeps the whole thing at a few dozen kilobytes.
