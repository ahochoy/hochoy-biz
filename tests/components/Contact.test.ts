import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Contact from '../../src/components/Contact.astro';
import contactData from '../../src/data/contact.json';

describe('<Contact />', () => {
  it('renders all contact links from data', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    const $ = cheerio.load(html);

    const buttons = $('a.contact-btn');
    expect(buttons.length).toBe(contactData.length);

    contactData.forEach((item, index) => {
      const btn = buttons.eq(index);
      expect(btn.attr('href')).toBe(item.href);
      expect(btn.text()).toContain(item.label);
      expect(btn.attr('target')).toBe('_blank');
      expect(btn.attr('rel')).toBe('noopener noreferrer');
    });
  });
});
