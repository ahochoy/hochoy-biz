import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import DevlogIndex from '../../src/pages/devlog/index.astro';

describe('Page: /devlog', () => {
  it('renders the devlog listing page with header and links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(DevlogIndex);
    const $ = cheerio.load(html);

    expect($('h1.devlog-title').length).toBe(1);
    expect($('.devlog-nav').length).toBe(1);
    expect($('.devlog-list-bar').length).toBe(1);
  });
});
