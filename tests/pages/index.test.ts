import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import IndexPage from '../../src/pages/index.astro';

describe('Page: index.astro', () => {
  it('renders the home page with all key sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage);
    const $ = cheerio.load(html);

    // Hero section
    expect($('h1.hero-name').length).toBe(1);

    // Key content sections
    expect($('#section-connect').length).toBe(1);
    expect($('#section-content').length).toBe(1);
    expect($('#section-capabilities').length).toBe(1);
    expect($('#section-companies-i-ve-worked-with').length).toBe(1);
    expect($('section.hh').length).toBe(1);
    expect($('#section-contact').length).toBe(1);
  });
});
