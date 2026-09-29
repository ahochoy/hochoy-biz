// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';

export default defineConfig({
  adapter: process.env.VITEST ? undefined : cloudflare(),
  integrations: [partytown({
    config: {
      forward: ['dataLayer.push'],
    },
  })]
});
