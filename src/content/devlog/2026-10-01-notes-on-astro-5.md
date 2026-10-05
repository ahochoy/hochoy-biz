---
title: "Notes on Astro 5 and Cloudflare Workers"
description: "Key takeaways from moving to Astro 5's Content Layer API and deploying static-first architectures to edge workers."
pubDate: 2026-10-01
tags: ["astro", "cloudflare", "architecture"]
---

Reflecting on the recent updates to this site's deployment pipeline:

### The Shift to Astro 5's Content Layer

Astro 5 introduced the Content Layer API, abstracting content loading behind loaders (`glob`, `file`, or custom API fetchers) rather than rigid filesystem conventions.

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

### Why Edge Deployment Still Matters

Deploying on Cloudflare Workers via `@astrojs/cloudflare` gives instantaneous time-to-first-byte across global edges without maintaining server infrastructure. When coupled with prerendered static assets, the edge worker handles lightweight routing while assets serve directly from cache.

Keeping the site lean—relying on semantic HTML, CSS tokens, and zero client JS by default—keeps the entire site footprint under a few dozen kilobytes.
