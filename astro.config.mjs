// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';

export default defineConfig({
  adapter: cloudflare(),
  integrations: [partytown({
    config: {
      forward: ['dataLayer.push'],
    },
  })]
});
