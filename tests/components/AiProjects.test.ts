import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import AiProjects from '../../src/components/AiProjects.astro';
import projects from '../../src/data/ai-projects.json';

describe('<AiProjects />', () => {
  it('renders all 3 AI projects with tags, CTA, and private badges', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AiProjects);
    const $ = cheerio.load(html);

    const cards = $('.ai-card[data-id]');
    expect(cards.length).toBe(3);

    projects.forEach((project, i) => {
      const card = cards.eq(i);
      expect(card.attr('data-id')).toBe(project.id);
      expect(card.attr('href')).toBe(project.href);
      expect(card.attr('target')).toBe('_blank');
      expect(card.find('.ai-title').text().trim()).toBe(project.name);
      expect(card.find('.ai-desc').text().trim()).toBe(project.description);
      expect(card.find('.ai-cta').text()).toContain(project.ctaLabel);

      const renderedTags = card
        .find('.ai-tag')
        .map((_, el) => $(el).text().trim())
        .get();
      expect(renderedTags).toEqual(project.tags);

      if (project.isPrivate) {
        expect(card.find('.ai-badge--private').text().trim()).toBe(project.badge);
      } else {
        expect(card.find('.ai-badge--public').text().trim()).toBe('Public');
      }
    });
  });
});
