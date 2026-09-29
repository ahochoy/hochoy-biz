import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Currently from '../../src/components/Currently.astro';
import current from '../../src/data/currently.json';

describe('<Currently />', () => {
  it('renders current venture information, logo, and external link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Currently);
    const $ = cheerio.load(html);

    expect($('.now-text').text()).toContain(current.name);
    expect($('.now-text').text()).toContain(current.tagline);
    expect($('.now-text').text()).toContain(current.role);

    const logo = $('img.now-logo');
    expect(logo.attr('src')).toBe(current.logo);
    expect(logo.attr('alt')).toBe(current.name);

    const btn = $('a.now-btn');
    expect(btn.attr('href')).toBe(current.href);
    expect(btn.text()).toContain(current.ctaLabel);
    expect(btn.attr('target')).toBe('_blank');
    expect(btn.attr('rel')).toBe('noopener noreferrer');
  });
});
