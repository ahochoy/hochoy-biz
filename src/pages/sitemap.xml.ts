import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE_ORIGIN = 'https://andrewhochoy.com';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('devlog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const latestPostDate = posts[0]?.data.pubDate.toISOString().split('T')[0];

  const urls = [
    {
      loc: `${SITE_ORIGIN}/`,
      lastmod: latestPostDate,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${SITE_ORIGIN}/devlog`,
      lastmod: latestPostDate,
      changefreq: 'weekly',
      priority: '0.8',
    },
    ...posts.map((post) => ({
      loc: `${SITE_ORIGIN}/devlog/${post.id}`,
      lastmod: post.data.pubDate.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${
      entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
    }
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
