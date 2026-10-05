import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import DevlogPreview from '../../src/components/DevlogPreview.astro';

describe('<DevlogPreview />', () => {
  it('renders the devlog preview component with link to /devlog', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(DevlogPreview);
    const $ = cheerio.load(html);

    expect($('.dl-prev').length).toBe(1);
    expect($('.dl-prev-label').text()).toContain('Devlog');

    const allBtn = $('a.dl-btn');
    expect(allBtn.length).toBe(1);
    expect(allBtn.attr('href')).toBe('/devlog');
  });
});
