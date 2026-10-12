import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SERIES_IDS } from './data/site';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    // Shown as the lead and used for meta/OG description.
    description: z.string(),
    // One line for post lists; falls back to description.
    summary: z.string().optional(),
    date: z.coerce.date().optional(),
    series: z.enum(SERIES_IDS).optional(),
    part: z.number().int().positive().optional(),
    kind: z.enum(['post', 'reference']).default('post'),
    lesson: z.string().optional(),
    draft: z.boolean().default(false),
    toc: z.array(z.object({ id: z.string(), title: z.string() })).default([]),
  }),
});

export const collections = { posts };
