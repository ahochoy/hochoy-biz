# hochoy-biz

Personal website of Andrew HoChoy: a one-page, link-in-bio style site that collects my links, latest content, capabilities, past clients and contact options in one place.

## Tech stack

- **[Astro](https://astro.build/)**: static site framework with component-based pages
- **[Cloudflare Workers](https://workers.cloudflare.com/)**: hosting, via `@astrojs/cloudflare` and Wrangler
- **[Partytown](https://partytown.qwik.dev/)**: runs third-party analytics scripts off the main thread
- **JSON data files** (`src/data/`): hold the site content, kept separate from the components

## Development

```sh
pnpm install
pnpm dev        # local dev server at localhost:4321
pnpm build      # production build to ./dist/
pnpm deploy     # build and deploy to Cloudflare
```
