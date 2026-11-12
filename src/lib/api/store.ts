/**
 * Where blog posts are saved.
 *
 * - On Netlify (production): commits Markdown files to your GitHub repo via the
 *   GitHub API. The commit triggers a normal Netlify rebuild, so the post goes
 *   live ~1–2 minutes later and GitHub keeps the full history.
 * - In `npm run dev` with no GITHUB_TOKEN: reads/writes src/content/blog/ on
 *   your own computer, so you can test the API locally.
 */
import { GITHUB_BRANCH, GITHUB_REPO, GITHUB_TOKEN } from 'astro:env/server';
import { HttpError } from './http';

export const POSTS_DIR = 'src/content/blog';

export type StoredFile = { slug: string; raw: string; sha?: string };
export type WriteResult = { path: string; commitUrl?: string; storage: 'github' | 'local' };

export interface PostStore {
  list(): Promise<string[]>;
  get(slug: string): Promise<StoredFile | null>;
  put(slug: string, raw: string, message: string, sha?: string): Promise<WriteResult>;
}

export function getStore(): PostStore {
  if (GITHUB_TOKEN && GITHUB_REPO) return githubStore(GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH || 'main');
  if (import.meta.env.DEV) return localStore();
  throw new HttpError(503, 'Blog API storage is not configured: set GITHUB_TOKEN and GITHUB_REPO in Netlify.');
}

/* ───────── GitHub ───────── */
function githubStore(token: string, repo: string, branch: string): PostStore {
  const base = `https://api.github.com/repos/${repo}/contents`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'personal-site-blog-api',
  };
  const fileUrl = (slug: string) => `${base}/${POSTS_DIR}/${encodeURIComponent(slug)}.md`;

  async function fail(res: Response, what: string): Promise<never> {
    const detail = await res.text();
    console.error(`[blog-api] GitHub ${what} failed`, res.status, detail);
    if (res.status === 401 || res.status === 403)
      throw new HttpError(502, 'GitHub rejected the token. Check GITHUB_TOKEN has Contents: Read and write on this repo.');
    if (res.status === 409 || res.status === 422)
      throw new HttpError(409, 'The post changed on GitHub while saving. Fetch it again and retry.');
    throw new HttpError(502, `GitHub ${what} failed (${res.status}).`);
  }

  return {
    async list() {
      const res = await fetch(`${base}/${POSTS_DIR}?ref=${encodeURIComponent(branch)}`, { headers });
      if (res.status === 404) return [];
      if (!res.ok) return fail(res, 'list');
      const items = (await res.json()) as { name: string; type: string }[];
      return items
        .filter((i) => i.type === 'file' && i.name.endsWith('.md') && !i.name.startsWith('_'))
        .map((i) => i.name.replace(/\.md$/, ''));
    },
    async get(slug) {
      const res = await fetch(`${fileUrl(slug)}?ref=${encodeURIComponent(branch)}`, { headers });
      if (res.status === 404) return null;
      if (!res.ok) return fail(res, 'read');
      const body = (await res.json()) as { content: string; sha: string };
      return { slug, raw: Buffer.from(body.content, 'base64').toString('utf-8'), sha: body.sha };
    },
    async put(slug, raw, message, sha) {
      const res = await fetch(fileUrl(slug), {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          content: Buffer.from(raw, 'utf-8').toString('base64'),
          branch,
          ...(sha ? { sha } : {}),
        }),
      });
      if (!res.ok) return fail(res, 'write');
      const body = (await res.json()) as { commit?: { html_url?: string } };
      return { path: `${POSTS_DIR}/${slug}.md`, commitUrl: body.commit?.html_url, storage: 'github' };
    },
  };
}

/* ───────── Local files (dev only) ───────── */
function localStore(): PostStore {
  const load = async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const dir = path.join(process.cwd(), POSTS_DIR);
    return { fs, dir, file: (slug: string) => path.join(dir, `${slug}.md`) };
  };
  return {
    async list() {
      const { fs, dir } = await load();
      const names = await fs.readdir(dir).catch(() => [] as string[]);
      return names.filter((n) => n.endsWith('.md') && !n.startsWith('_')).map((n) => n.replace(/\.md$/, ''));
    },
    async get(slug) {
      const { fs, file } = await load();
      try {
        return { slug, raw: await fs.readFile(file(slug), 'utf-8') };
      } catch {
        return null;
      }
    },
    async put(slug, raw) {
      const { fs, dir, file } = await load();
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(slug), raw, 'utf-8');
      return { path: `${POSTS_DIR}/${slug}.md`, storage: 'local' };
    },
  };
}

/** Human-readable explanation returned with every write. */
export function noteFor(storage: 'github' | 'local', draft: boolean) {
  if (storage === 'local') return 'Saved to your local files. The dev server picks it up automatically.';
  return draft
    ? 'Committed to GitHub as a draft. It will NOT appear on the live site until you PATCH { "draft": false }.'
    : 'Committed to GitHub. Netlify is rebuilding; the post will be live in about 1–2 minutes.';
}
