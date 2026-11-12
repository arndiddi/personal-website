/**
 * /api/posts
 *   GET  → list every post (including drafts) with its metadata
 *   POST → create a new post
 * Both require the API key. See README.md → "Blog API".
 */
import type { APIRoute } from 'astro';
import { requireApiKey } from '../../../lib/api/auth';
import { HttpError, handleError, json, readJson } from '../../../lib/api/http';
import { parsePost, serializePost, slugify, today } from '../../../lib/api/markdown';
import { createPostSchema, issues } from '../../../lib/api/schemas';
import { getStore, noteFor } from '../../../lib/api/store';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const denied = requireApiKey(request);
  if (denied) return denied;
  try {
    const store = getStore();
    const slugs = await store.list();
    const posts = [];
    for (const slug of slugs) {
      const file = await store.get(slug);
      if (!file) continue;
      try {
        const { meta } = parsePost(file.raw);
        posts.push({ slug, url: new URL(`/blog/${slug}`, url).href, ...meta });
      } catch {
        posts.push({ slug, error: 'Could not parse frontmatter' });
      }
    }
    posts.sort((a, b) => String((b as { pubDate?: string }).pubDate).localeCompare(String((a as { pubDate?: string }).pubDate)));
    return json({ count: posts.length, posts });
  } catch (err) {
    return handleError(err);
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  const denied = requireApiKey(request);
  if (denied) return denied;
  try {
    const body = await readJson(request);
    if ('error' in body) return body.error;

    const parsed = createPostSchema.safeParse(body.data);
    if (!parsed.success) return json({ error: 'Invalid post', issues: issues(parsed.error) }, 400);
    const input = parsed.data;

    const slug = input.slug ?? slugify(input.title);
    if (!slug) throw new HttpError(400, 'Could not make a URL slug from the title; pass "slug" explicitly.');

    const store = getStore();
    if (await store.get(slug)) {
      throw new HttpError(409, `A post with slug "${slug}" already exists. Use PATCH /api/posts/${slug} to edit it.`);
    }

    const raw = serializePost(
      {
        title: input.title,
        description: input.description,
        pubDate: input.pubDate ?? today(),
        draft: input.draft,
        featured: input.featured,
        tags: input.tags,
      },
      input.content,
    );
    const result = await store.put(slug, raw, `blog: ${input.draft ? 'draft' : 'publish'} "${input.title}"`);

    return json(
      {
        ok: true,
        slug,
        draft: input.draft,
        url: new URL(`/blog/${slug}`, url).href,
        ...result,
        note: noteFor(result.storage, input.draft),
      },
      201,
    );
  } catch (err) {
    return handleError(err);
  }
};
