import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import * as cheerio from 'cheerio';
import IndexPage from '../../src/pages/index.astro';
import NotFoundPage from '../../src/pages/404.astro';
import { GET as getSitemap } from '../../src/pages/sitemap.xml';
import { GET as getLlms } from '../../src/pages/llms.txt';

describe('SEO & AEO metadata and discovery endpoints', () => {
  it('renders canonical URL, Open Graph, Twitter, llms.txt link, and JSON-LD on homepage', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage);
    const $ = cheerio.load(html);

    expect($('title').text()).toContain('AI Engineer');
    expect($('title').text()).toContain('Forward-Deployed Engineer');
    expect($('link[rel="canonical"]').attr('href')).toBe('https://andrewhochoy.com/');
    expect($('link[rel="alternate"][title="LLMs.txt"]').attr('href')).toBe(
      'https://andrewhochoy.com/llms.txt'
    );
    expect($('meta[name="robots"]').attr('content')).toContain('index, follow');
    expect($('meta[property="og:type"]').attr('content')).toBe('profile');
    expect($('meta[property="og:url"]').attr('content')).toBe('https://andrewhochoy.com/');
    expect($('meta[name="twitter:card"]').attr('content')).toBe('summary');

    const jsonLdRaw = $('script[type="application/ld+json"]').html();
    expect(jsonLdRaw).toBeTruthy();
    const jsonLd = JSON.parse(jsonLdRaw!);
    expect(jsonLd['@context']).toBe('https://schema.org');

    const person = jsonLd['@graph'].find((node: { '@type': string }) => node['@type'] === 'Person');
    expect(person).toBeTruthy();
    expect(person.name).toBe('Andrew HoChoy');
    expect(person.jobTitle).toBe('AI Engineer & Forward-Deployed Engineer');

    const projectsList = jsonLd['@graph'].find(
      (node: { '@type': string }) => node['@type'] === 'ItemList'
    );
    expect(projectsList.itemListElement.length).toBeGreaterThanOrEqual(4);
  });

  it('sets noindex on 404 page', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(NotFoundPage);
    const $ = cheerio.load(html);

    expect($('meta[name="robots"]').attr('content')).toBe('noindex, follow');
  });

  it('generates a valid XML sitemap for andrewhochoy.com', async () => {
    const response = await getSitemap({} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/xml');

    const xml = await response.text();
    expect(xml).toContain('<loc>https://andrewhochoy.com/</loc>');
    expect(xml).toContain('<loc>https://andrewhochoy.com/devlog</loc>');
    expect(xml).toContain('<loc>https://andrewhochoy.com/devlog/2026-10-05-why-a-devlog</loc>');
  });

  it('generates an llms.txt document featuring AI Engineer / FDE persona and shipped projects', async () => {
    const response = await getLlms({} as never);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');

    const text = await response.text();
    expect(text).toContain('# Andrew HoChoy — AI Engineer & Forward-Deployed Engineer');
    expect(text).toContain('https://andrewhochoy.com/');
    expect(text).toContain('Phil Coding');
    expect(text).toContain('Phoebe Onboarding');
    expect(text).toContain('Phineas Finance');
    expect(text).toContain('https://andrewhochoy.com/devlog');
  });
});
