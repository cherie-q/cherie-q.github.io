import { getCollection, type CollectionEntry } from 'astro:content';
import { SERIES, type SeriesId } from '../data/site';

export type Post = CollectionEntry<'posts'>;

// Posts whose body is hand-built HTML keep it in src/fragments/<id>.html; others render their Markdown.
const fragments = import.meta.glob<string>('/src/fragments/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function fragment(path: string): string | undefined {
  return fragments[`/src/fragments/${path}.html`];
}

export function requireFragment(path: string): string {
  const html = fragment(path);
  if (html === undefined) throw new Error(`Missing fragment src/fragments/${path}.html`);
  return html;
}

export const postUrl = (post: Post) => `/${post.id}/`;
export const seriesUrl = (id: SeriesId) => `/${id}/`;

export async function getPosts(): Promise<Post[]> {
  return getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
}

/** Numbered parts of a series, in order. */
export async function getSeriesParts(id: SeriesId): Promise<Post[]> {
  const parts = (await getPosts()).filter((p) => p.data.series === id && p.data.kind === 'post');
  return parts.sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0));
}

export async function getSeriesReferences(id: SeriesId): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.data.series === id && p.data.kind === 'reference');
}

/** Newest first when dated; undated posts keep series order after dated ones. */
export async function getWriting(): Promise<Post[]> {
  const posts = (await getPosts()).filter((p) => p.data.kind === 'post');
  return posts.sort((a, b) => {
    const da = a.data.date?.valueOf() ?? 0;
    const db = b.data.date?.valueOf() ?? 0;
    if (da !== db) return db - da;
    return (a.data.part ?? 0) - (b.data.part ?? 0);
  });
}

export function seriesOf(post: Post) {
  return post.data.series ? SERIES[post.data.series] : undefined;
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
