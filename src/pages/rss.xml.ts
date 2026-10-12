import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, SERIES } from '../data/site';
import { getWriting, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getWriting();
  return rss({
    title: `${SITE.title}, ${SITE.name}`,
    description: SITE.tagline,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: postUrl(p),
      pubDate: p.data.date,
      categories: p.data.series ? [SERIES[p.data.series].title] : [],
    })),
  });
}
