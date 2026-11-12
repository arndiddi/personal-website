import { parse, stringify } from 'yaml';

export type PostMeta = {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  draft: boolean;
  featured: boolean;
  tags: string[];
  [key: string]: unknown;
};

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Reads a Markdown file into { meta, content }. */
export function parsePost(raw: string): { meta: PostMeta; content: string } {
  const match = raw.match(FM);
  if (!match) throw new Error('File has no frontmatter block.');
  const data = (parse(match[1]) ?? {}) as Record<string, unknown>;
  const asDate = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : v == null ? undefined : String(v));
  return {
    meta: {
      ...data,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      pubDate: asDate(data.pubDate) ?? today(),
      updatedDate: asDate(data.updatedDate),
      draft: data.draft === true,
      featured: data.featured === true,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    },
    content: match[2].trim(),
  };
}

/** Writes { meta, content } back into a Markdown file, keeping a tidy key order. */
export function serializePost(meta: PostMeta, content: string): string {
  const { title, description, pubDate, updatedDate, draft, featured, tags, ...rest } = meta;
  const ordered: Record<string, unknown> = { title, description, pubDate };
  if (updatedDate) ordered.updatedDate = updatedDate;
  Object.assign(ordered, { draft, featured, tags }, rest);
  for (const k of Object.keys(ordered)) if (ordered[k] === undefined) delete ordered[k];
  const yaml = stringify(ordered, { lineWidth: 0 }).trim();
  return `---\n${yaml}\n---\n\n${content.trim()}\n`;
}

/** Today's date as YYYY-MM-DD in Boston time (not UTC), so evening posts get the right date. */
export function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
