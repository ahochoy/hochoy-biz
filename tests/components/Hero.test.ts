import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Hero from '../../src/components/Hero.astro';

describe('<Hero />', () => {
  it('renders hero masthead and navigation', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero);
    const $ = cheerio.load(html);

    expect($('h1.hero-name').text()).toContain('Andrew');
    expect($('h1.hero-name').text()).toContain('HoChoy');
    expect($('.hero-kicker').text()).toContain('Educator · Engineer · Entrepreneur');
    expect($('.hero-tagline').text()).toContain('AI Engineer');
    expect($('.hero-tagline').text()).toContain('Forward-Deployed Engineer');
    expect($('a.hero-scroll').attr('href')).toBe('#section-connect');
    expect($('canvas#hero-dither').length).toBe(1);
  });
});
