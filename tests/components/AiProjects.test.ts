import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import AiProjects from '../../src/components/AiProjects.astro';
import projects from '../../src/data/ai-projects.json';

describe('<AiProjects />', () => {
  it('renders all 3 AI projects with tags, project & GitHub CTAs, and private badges/notes', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(AiProjects);
    const $ = cheerio.load(html);

    const cards = $('.ai-card[data-id]');
    expect(cards.length).toBe(3);

    projects.forEach((project, i) => {
      const card = cards.eq(i);
      expect(card.attr('data-id')).toBe(project.id);
      expect(card.find('.ai-title').text().trim()).toBe(project.name);
      expect(card.find('.ai-desc').text().trim()).toBe(project.description);

      const primaryBtn = card.find('.ai-btn--primary');
      expect(primaryBtn.attr('href')).toBe(project.href);
      expect(primaryBtn.attr('target')).toBe('_blank');
      expect(primaryBtn.text()).toContain(project.ctaLabel);

      const githubBtn = card.find('.ai-btn--ghost');
      expect(githubBtn.attr('href')).toBe(project.githubHref);
      expect(githubBtn.attr('target')).toBe('_blank');
      expect(githubBtn.text()).toContain('GitHub');

      const renderedTags = card
        .find('.ai-tag')
        .map((_, el) => $(el).text().trim())
        .get();
      expect(renderedTags).toEqual(project.tags);

      if (project.isPrivate) {
        expect(card.find('.ai-badge--private').text().trim()).toBe('Private');
        expect(card.find('.ai-private-note').text().trim()).toBe(project.privateNote);
      } else {
        expect(card.find('.ai-badge--public').text().trim()).toBe('Public');
        expect(card.find('.ai-private-note').length).toBe(0);
      }
    });
  });
});
