import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import BentoGrid from '../../src/components/BentoGrid.astro';
import capabilities from '../../src/data/capabilities.json';

describe('<BentoGrid />', () => {
  it('renders all capabilities from data', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BentoGrid);
    const $ = cheerio.load(html);

    const cells = $('.cap-cell[data-id]');
    expect(cells.length).toBe(capabilities.length);

    capabilities.forEach((cap, i) => {
      const cell = cells.eq(i);
      expect(cell.attr('data-id')).toBe(cap.id);
      expect(cell.find('.cap-title').text().trim()).toBe(cap.title);
      expect(cell.find('.cap-num').text().trim()).toBe(String(i + 1).padStart(2, '0'));
      if (cap.description) {
        expect(cell.find('.cap-desc').text().trim()).toBe(cap.description);
      }
    });
  });
});
