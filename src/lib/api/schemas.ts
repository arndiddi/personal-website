import { z } from 'astro/zod';
import { SLUG_RE } from './markdown';

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Not a real date');

const tags = z.array(z.string().trim().min(1).max(40)).max(12);

export const createPostSchema = z.strictObject({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(320),
  content: z.string().min(1, 'content (Markdown body) is required'),
  slug: z.string().regex(SLUG_RE, 'lowercase letters, numbers and dashes only').max(80).optional(),
  tags: tags.default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  pubDate: date.optional(),
});

export const patchPostSchema = z
  .strictObject({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(320),
    content: z.string().min(1),
    tags,
    draft: z.boolean(),
    featured: z.boolean(),
    pubDate: date,
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'Send at least one field to change.');

/** Turns a Zod error into a readable list like ["title: Required"]. */
export function issues(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`);
}
