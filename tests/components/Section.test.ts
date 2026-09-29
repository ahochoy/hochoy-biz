import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import Section from '../../src/components/Section.astro';

describe('<Section />', () => {
  it('renders section title and slotted content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Section, {
      props: {
        title: 'Capabilities',
        collapsible: true,
        defaultOpen: true,
      },
      slots: {
        default: '<div class="test-child">Child Content</div>',
      },
    });
    const $ = cheerio.load(html);

    expect($('h2.section-title').text()).toBe('Capabilities');
    expect($('#section-capabilities').length).toBe(1);
    expect($('button.section-toggle').length).toBe(1);
    expect($('.test-child').text()).toBe('Child Content');
  });

  it('renders inline non-collapsible section without toggle button', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Section, {
      props: {
        title: 'Contact',
        layout: 'inline',
        collapsible: false,
      },
      slots: {
        default: '<span>Direct Contact</span>',
      },
    });
    const $ = cheerio.load(html);

    expect($('.section--inline').length).toBe(1);
    expect($('button.section-toggle').length).toBe(0);
    expect($('h2.section-title').text()).toBe('Contact');
  });
});
