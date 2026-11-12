import { getCollection } from 'astro:content';

/**
 * Drafts are visible when running `npm run dev` (so you can preview them),
 * and are left out of the live site.
 */
const visible = (entry: { data: { draft?: boolean } }) => import.meta.env.DEV || !entry.data.draft;

export async function getPosts() {
  const posts = await getCollection('blog', visible);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects() {
  const projects = await getCollection('projects', visible);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getTeardowns() {
  const teardowns = await getCollection('teardowns', visible);
  return teardowns.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getInterests() {
  const interests = await getCollection('interests');
  return interests.sort((a, b) => a.data.order - b.data.order);
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long') {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Rough reading time in minutes for a Markdown body. */
export function readingTime(body: string | undefined) {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
