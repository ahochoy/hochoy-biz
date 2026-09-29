import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Householder from '../../src/components/Householder.astro';
import app from '../../src/data/householder.json';

describe('<Householder />', () => {
  it('renders Householder app showcase with correct copy and links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Householder);
    const $ = cheerio.load(html);

    expect($('.hh-title').text()).toContain(app.name);
    expect($('.hh-desc').text()).toContain(app.description);
    expect($('.hh-status').text()).toContain(app.status);
    expect($('.hh-icon').attr('src')).toBe(app.icon);
    expect($('.hh-screen').attr('src')).toBe(app.screenshot);

    const cta = $('a.hh-cta');
    expect(cta.attr('href')).toBe(app.href);
    expect(cta.text()).toContain(app.ctaLabel);

    const domain = $('a.hh-domain');
    expect(domain.attr('href')).toBe(app.href);
    expect(domain.text().trim()).toBe(app.domain);
  });
});
