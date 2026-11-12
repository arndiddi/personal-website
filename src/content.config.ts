/**
 * Content collections = folders of Markdown files under src/content/.
 * Each folder has a "schema" below listing the fields every file's
 * frontmatter (the block between the --- lines) must have.
 * If you add a field here, you can use it in the pages.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files that start with an underscore (e.g. _template.md) are ignored.
const md = (folder: string) => glob({ pattern: '**/[^_]*.md', base: `./src/content/${folder}` });

/** Blog posts → /blog/<file-name> */
const blog = defineCollection({
  loader: md('blog'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Drafts only appear when running `npm run dev` locally. */
    draft: z.boolean().default(false),
    /** Show in the home page "Featured" section. */
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

/** Projects / case studies → /portfolio/<file-name> */
const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    /** One sentence: what it is and who it's for. */
    summary: z.string(),
    status: z.enum(['In progress', 'Shipped', 'Prototype']),
    dates: z.string(),
    /** My role, e.g. "Solo builder: product, design, engineering" */
    role: z.string(),
    stack: z.array(z.string()).default([]),
    /** Headline metric or outcome, shown on the card. */
    outcome: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
    /** Lower numbers show first. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

/** Product teardowns → /portfolio/teardowns/<file-name> */
const teardowns = defineCollection({
  loader: md('teardowns'),
  schema: z.object({
    title: z.string(),
    product: z.string(),
    company: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    /** e.g. "Retention", "Onboarding", "Monetization" */
    focus: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** "Beyond the résumé" boxes on /about */
const interests = defineCollection({
  loader: md('interests'),
  schema: z.object({
    title: z.string(),
    /** Short mono label above the title, e.g. "Currently watching" */
    label: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { blog, projects, teardowns, interests };
