import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Card from '../../src/components/Card.astro';

describe('<Card />', () => {
  it('renders standard link card with title, handle, and description', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Card, {
      props: {
        title: 'Instagram / @ahochoy',
        description: 'Follow my life behind-the-scenes',
        href: 'https://instagram.com/ahochoy',
        index: 1,
      },
    });
    const $ = cheerio.load(html);

    const card = $('a.card');
    expect(card.length).toBe(1);
    expect(card.attr('href')).toBe('https://instagram.com/ahochoy');
    expect(card.attr('target')).toBe('_blank');
    expect(card.find('.card-num').text().trim()).toBe('01');
    expect(card.find('.card-title').text()).toContain('Instagram');
    expect(card.find('.card-handle').text().trim()).toBe('/ahochoy');
    expect(card.find('.card-desc').text().trim()).toBe('Follow my life behind-the-scenes');
  });

  it('renders coming-soon variant as a non-link element with coming soon chip', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Card, {
      props: {
        title: 'Local AI Workshop',
        description: 'Hands-on workshop',
        href: '#',
        comingSoon: true,
      },
    });
    const $ = cheerio.load(html);

    expect($('a.card').length).toBe(0);
    const card = $('div.card');
    expect(card.length).toBe(1);
    expect(card.hasClass('card--static')).toBe(true);
    expect(card.find('.card-chip').text().trim()).toBe('Coming soon');
  });
});
