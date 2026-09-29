import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Newsletter from '../../src/components/Newsletter.astro';
import newsletter from '../../src/data/content.json';

describe('<Newsletter />', () => {
  it('renders newsletter content with correct wordmark and links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Newsletter);
    const $ = cheerio.load(html);

    const img = $('img.nl-wordmark');
    expect(img.attr('src')).toBe(newsletter.wordmark);
    expect(img.attr('alt')).toBe(newsletter.name);

    expect($('.nl-desc').text().trim()).toBe(newsletter.description);
    expect($('.nl-cadence').text().trim()).toBe(newsletter.cadence);

    const latest = $('a.nl-btn--ghost');
    expect(latest.attr('href')).toBe(newsletter.latestHref);

    const subscribe = $('a.nl-btn--subscribe');
    expect(subscribe.attr('href')).toBe(newsletter.subscribeHref);
  });
});
