import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import CompanyLogos from '../../src/components/CompanyLogos.astro';
import companies from '../../src/data/companies.json';

describe('<CompanyLogos />', () => {
  it('renders all companies from data', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CompanyLogos);
    const $ = cheerio.load(html);

    companies.forEach((co) => {
      if (co.logoUrl) {
        const img = $(`img[alt="${co.name}"]`);
        expect(img.length).toBe(1);
        expect(img.attr('src')).toBe(co.logoUrl);
      } else {
        const textElements = $('.logo-word');
        const found = textElements.toArray().some((el) => $(el).text().trim() === co.name);
        expect(found).toBe(true);
      }
    });
  });
});
