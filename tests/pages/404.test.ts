import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import NotFoundPage from '../../src/pages/404.astro';

describe('Page: 404.astro', () => {
  it('renders the 404 error page with link back home', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(NotFoundPage);
    const $ = cheerio.load(html);

    expect($('.not-found-number').text().trim()).toBe('404');
    expect($('h1.not-found-heading').text()).toContain('Page');
    expect($('a.not-found-link').attr('href')).toBe('/');
  });
});
