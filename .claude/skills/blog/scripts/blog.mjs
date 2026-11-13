#!/usr/bin/env node
/**
 * Blog API helper for the /blog skill.
 *
 * Security:
 * - Preferred in Claude cloud sessions: a "network secret" on the cloud environment for the
 *   site's host. The key then never enters the VM; Anthropic's proxy adds the Authorization
 *   header after the request leaves. In that mode BLOG_API_KEY is simply not set.
 * - Otherwise the key is read ONLY from the BLOG_API_KEY environment variable. It is never
 *   accepted as an argument (arguments show up in `ps` and shell history), never printed,
 *   never written to disk, and scrubbed from anything this script outputs.
 * - The key is only sent over HTTPS (plain HTTP is allowed for localhost testing only).
 * - Every write needs --confirm, which Claude may add ONLY after the user said yes in chat.
 * - `create` saves a hidden draft unless --publish is given (only after the user approved
 *   publishing). Creating and publishing in one call makes one commit = one Netlify deploy.
 *
 * Usage (Node 18+):
 *   node blog.mjs check
 *   node blog.mjs list
 *   node blog.mjs get <slug>
 *   node blog.mjs create <meta.json> [body.md] --confirm      (saved as a hidden draft)
 *   node blog.mjs create <meta.json> [body.md] --publish --confirm   (straight to live)
 *   node blog.mjs update <slug> <changes.json> [body.md] --confirm
 *   node blog.mjs publish <slug> --confirm
 *   node blog.mjs unpublish <slug> --confirm
 *   node blog.mjs delete <slug> --confirm
 *
 * Env:
 *   BLOG_API_KEY   optional when a network secret supplies the key, otherwise required
 *   BLOG_SITE_URL  optional, defaults to https://arnavdiddi.netlify.app
 */
import { readFileSync } from 'node:fs';

const DEFAULT_SITE = 'https://arnavdiddi.netlify.app';
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const WRITES = new Set(['create', 'update', 'publish', 'unpublish', 'delete']);

const KEY = (process.env.BLOG_API_KEY ?? '').trim();

/** Never let the key reach stdout/stderr, even inside an error message. */
function scrub(text) {
  const s = String(text);
  return KEY && KEY.length >= 4 ? s.split(KEY).join('[REDACTED]') : s;
}
function out(obj) {
  process.stdout.write(scrub(typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)) + '\n');
}
function die(msg, code = 1) {
  process.stderr.write(scrub(`error: ${msg}`) + '\n');
  process.exit(code);
}

function siteUrl() {
  const raw = (process.env.BLOG_SITE_URL ?? '').trim() || DEFAULT_SITE;
  let u;
  try {
    u = new URL(raw);
  } catch {
    die('BLOG_SITE_URL is not a valid URL.');
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
  if (u.protocol !== 'https:' && !(local && u.protocol === 'http:')) {
    die('Refusing to send the API key over plain HTTP. Use an https:// BLOG_SITE_URL (http is allowed only for localhost).');
  }
  if (u.username || u.password) die('BLOG_SITE_URL must not contain credentials.');
  return u.origin;
}

const NO_AUTH_HINT =
  'No key reached the API. Either add a network secret for this host on the cloud environment (preferred), ' +
  'or set BLOG_API_KEY as an environment variable. Never paste the key into chat or a file.';

function slugArg(s) {
  if (!s || !SLUG_RE.test(s)) die('Give a valid slug (lowercase letters, numbers and dashes), e.g. my-first-post.');
  return s;
}

function readJsonFile(path) {
  if (!path) die('Missing JSON file argument.');
  try {
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) die(`${path} must contain a JSON object.`);
    return data;
  } catch (e) {
    die(`Could not read ${path}: ${e.message}`);
  }
}

function readBody(path) {
  if (!path) return undefined;
  try {
    return readFileSync(path, 'utf-8');
  } catch (e) {
    die(`Could not read ${path}: ${e.message}`);
  }
}

async function call(method, path, body) {
  const url = siteUrl() + path;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  let res;
  try {
    res = await fetch(url, {
      method,
      redirect: 'error', // never follow a redirect with the key attached
      signal: controller.signal,
      headers: {
        // Without KEY, send no Authorization header so a network secret can supply it.
        ...(KEY ? { Authorization: `Bearer ${KEY}` } : {}),
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    die(`Request to ${url} failed: ${e.name === 'AbortError' ? 'timed out' : e.message}`);
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 500) };
  }
  if (!res.ok) {
    if (res.status === 401 && !KEY) data.hint = NO_AUTH_HINT;
    out({ status: res.status, ...data });
    process.exit(1);
  }
  return data;
}

const args = process.argv.slice(2);
const confirmed = args.includes('--confirm');
const publishNow = args.includes('--publish');
const [cmd, a, b, c] = args.filter((x) => x !== '--confirm' && x !== '--publish');

if (!cmd || cmd === 'help' || cmd === '--help') {
  out('Commands: check | list | get <slug> | create <meta.json> [body.md] [--publish] | update <slug> <changes.json> [body.md] | publish <slug> | unpublish <slug> | delete <slug>\nWrites need --confirm (only after the user says yes in chat).');
  process.exit(0);
}

if (WRITES.has(cmd) && !confirmed) {
  die(`"${cmd}" changes the live site's repo. Show the user exactly what will happen, get an explicit yes in chat, then re-run with --confirm.`, 3);
}

switch (cmd) {
  case 'check': {
    const data = await call('GET', '/api/posts');
    out({
      ok: true,
      site: siteUrl(),
      key: KEY ? 'from BLOG_API_KEY env var (value hidden)' : 'from network secret (never in this VM)',
      posts: data.count,
    });
    break;
  }
  case 'list': {
    const data = await call('GET', '/api/posts');
    out({
      count: data.count,
      posts: (data.posts ?? []).map((p) => ({
        slug: p.slug,
        title: p.title,
        status: p.draft ? 'draft' : 'published',
        pubDate: p.pubDate,
        updatedDate: p.updatedDate,
        featured: p.featured,
        tags: p.tags,
        url: p.url,
      })),
    });
    break;
  }
  case 'get': {
    out(await call('GET', `/api/posts/${slugArg(a)}`));
    break;
  }
  case 'create': {
    const meta = readJsonFile(a);
    const content = readBody(b);
    if ('draft' in meta) die('Leave "draft" out of the metadata. Add --publish to go live (only after the user approved publishing).');
    const payload = { ...meta, ...(content !== undefined ? { content } : {}), draft: !publishNow };
    out(await call('POST', '/api/posts', payload));
    break;
  }
  case 'update': {
    const slug = slugArg(a);
    const changes = readJsonFile(b);
    const content = readBody(c);
    if ('draft' in changes) die('Use `publish` or `unpublish` to change whether a post is live, not `update`.');
    const payload = { ...changes, ...(content !== undefined ? { content } : {}) };
    if (Object.keys(payload).length === 0) die('Nothing to update.');
    out(await call('PATCH', `/api/posts/${slug}`, payload));
    break;
  }
  case 'publish': {
    out(await call('PATCH', `/api/posts/${slugArg(a)}`, { draft: false }));
    break;
  }
  case 'unpublish': {
    out(await call('PATCH', `/api/posts/${slugArg(a)}`, { draft: true }));
    break;
  }
  case 'delete': {
    out(await call('DELETE', `/api/posts/${slugArg(a)}`));
    break;
  }
  default:
    die(`Unknown command "${cmd}". Run with "help" for usage.`);
}
