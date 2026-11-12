/**
 * /api/posts/:slug
 *   GET   → the post's metadata + Markdown content (drafts included)
 *   PATCH → update any of: title, description, content, tags, draft, featured, pubDate
 * Both require the API key. See README.md → "Blog API".
 */
import type { APIRoute } from 'astro';
import { requireApiKey } from '../../../lib/api/auth';
import { HttpError, handleError, json, readJson } from '../../../lib/api/http';
import { SLUG_RE, parsePost, serializePost, today } from '../../../lib/api/markdown';
import { issues, patchPostSchema } from '../../../lib/api/schemas';
import { getStore, noteFor } from '../../../lib/api/store';

export const prerender = false;

function checkSlug(slug: string | undefined): string {
  if (!slug || !SLUG_RE.test(slug)) throw new HttpError(400, 'Invalid slug.');
  return slug;
}

export const GET: APIRoute = async ({ request, params, url }) => {
  const denied = requireApiKey(request);
  if (denied) return denied;
  try {
    const slug = checkSlug(params.slug);
    const file = await getStore().get(slug);
    if (!file) throw new HttpError(404, `No post with slug "${slug}".`);
    const { meta, content } = parsePost(file.raw);
    return json({ slug, url: new URL(`/blog/${slug}`, url).href, ...meta, content });
  } catch (err) {
    return handleError(err);
  }
};

export const PATCH: APIRoute = async ({ request, params, url }) => {
  const denied = requireApiKey(request);
  if (denied) return denied;
  try {
    const slug = checkSlug(params.slug);
    const body = await readJson(request);
    if ('error' in body) return body.error;

    const parsed = patchPostSchema.safeParse(body.data);
    if (!parsed.success) return json({ error: 'Invalid update', issues: issues(parsed.error) }, 400);
    const changes = parsed.data;

    const store = getStore();
    const file = await store.get(slug);
    if (!file) throw new HttpError(404, `No post with slug "${slug}". Create it with POST /api/posts.`);

    const { meta, content } = parsePost(file.raw);
    const wasDraft = meta.draft;
    const { content: newContent, ...metaChanges } = changes;
    const next = { ...meta, ...metaChanges };

    // Publishing a draft: stamp today's date unless one was given.
    if (wasDraft && changes.draft === false && !changes.pubDate) next.pubDate = today();
    // Editing an already-published post: record when it was updated.
    const editedText = changes.title || changes.description || newContent !== undefined;
    if (!wasDraft && !next.draft && editedText) next.updatedDate = today();

    const raw = serializePost(next, newContent ?? content);
    const action = wasDraft && next.draft === false ? 'publish' : !wasDraft && next.draft ? 'unpublish' : 'update';
    const result = await store.put(slug, raw, `blog: ${action} "${next.title}"`, file.sha);

    return json({
      ok: true,
      slug,
      action,
      draft: next.draft,
      changed: Object.keys(changes),
      url: new URL(`/blog/${slug}`, url).href,
      ...result,
      note: noteFor(result.storage, next.draft),
    });
  } catch (err) {
    return handleError(err);
  }
};
