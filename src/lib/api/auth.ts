import { createHash, timingSafeEqual } from 'node:crypto';
import { BLOG_API_KEY } from 'astro:env/server';
import { json } from './http';

/**
 * Accepts the key as `Authorization: Bearer <key>` or `x-api-key: <key>`.
 * Returns an error Response if the request isn't allowed, or null if it is.
 */
export function requireApiKey(request: Request): Response | null {
  if (!BLOG_API_KEY) {
    return json({ error: 'Blog API is disabled: BLOG_API_KEY is not set on the server.' }, 503);
  }
  const header = request.headers.get('authorization') ?? '';
  const provided = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7).trim()
    : (request.headers.get('x-api-key') ?? '').trim();

  if (!provided || !safeEqual(provided, BLOG_API_KEY)) {
    return json({ error: 'Unauthorized: missing or invalid API key.' }, 401, { 'WWW-Authenticate': 'Bearer' });
  }
  return null;
}

/** Constant-time comparison so the key can't be guessed via response timing. */
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}
