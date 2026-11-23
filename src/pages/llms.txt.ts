import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import aiProjects from '../data/ai-projects.json';
import capabilities from '../data/capabilities.json';
import companies from '../data/companies.json';
import currently from '../data/currently.json';
import householder from '../data/householder.json';
import contact from '../data/contact.json';
import connect from '../data/connect.json';
import newsletter from '../data/content.json';

export const prerender = true;

const SITE_ORIGIN = 'https://andrewhochoy.com';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('devlog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const lines: string[] = [
    '# Andrew HoChoy — AI Engineer & Forward-Deployed Engineer',
    '',
    '> Bay Area AI Engineer, Forward-Deployed Engineer, educator, and entrepreneur building production agentic systems, permission-aware RAG pipelines, deterministic eval harnesses, and serverless AWS infrastructure.',
    '',
    '## Overview',
    `- Canonical Website: ${SITE_ORIGIN}/`,
    '- Location: San Francisco Bay Area, CA',
    '- Focus Roles: AI Engineer, Forward-Deployed Engineer (FDE)',
    `- Currently: ${currently.role} ${currently.name} — ${currently.tagline} (${currently.href})`,
    `- Companies Worked With: ${companies.map((c) => c.name).join(', ')}`,
    '',
    '## Shipped AI Projects',
    ...aiProjects.map(
      (p) =>
        `- [${p.name}](${p.href}): ${p.description} Stack: ${p.tags.join(', ')}. Source: ${p.githubHref}${p.isPrivate ? ' (Live demo is password protected; contact Andrew for access.)' : ''}`
    ),
    '',
    '## Consumer Apps',
    `- [${householder.name}](${householder.href}): ${householder.description} (${householder.status})`,
    '',
    '## Capabilities',
    ...capabilities.map((cap) => `- **${cap.title}**: ${cap.description}`),
    '',
    '## Devlog & Engineering Notes',
    `- [All Devlog Entries](${SITE_ORIGIN}/devlog): Architecture trade-offs, benchmarks, and build notes from shipping AI systems.`,
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${SITE_ORIGIN}/devlog/${post.id}) (${post.data.pubDate.toISOString().split('T')[0]}): ${post.data.description}`
    ),
    '',
    '## Newsletter & Profiles',
    `- [${newsletter.name}](${newsletter.latestHref}): ${newsletter.description}`,
    '- [GitHub](https://github.com/ahochoy): Open-source repositories including Phil Coding, Phoebe Onboarding, and Phineas Finance.',
    ...connect.map((c) => `- [${c.title}](${c.href}): ${c.description}`),
    '',
    '## Contact',
    ...contact.map((c) => `- [${c.label}](${c.href})`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
