/**
 * Netlify "ignore" check: decides whether a push needs a new production build.
 * Each successful production deploy costs Netlify credits, so we skip builds
 * that can't change what visitors see.
 *
 * Exit 0 = skip the build. Exit 1 = build as usual.
 *
 * A build is skipped only when EVERY changed file is one of:
 *   - a blog post that is a draft (or doesn't exist) both before AND after the
 *     change, e.g. saving or editing a hidden draft, or deleting a never-published one
 *   - a file the site build never reads (README.md, CLAUDE.md, .claude/**)
 *
 * Anything else (publishing, unpublishing, editing a live post, code, styles…)
 * builds. When in doubt (first build, missing history, git error) it builds.
 *
 * Wired up in netlify.toml → [build] ignore.
 */
import { execFileSync } from 'node:child_process';

const from = process.env.CACHED_COMMIT_REF;
const to = process.env.COMMIT_REF;

const BUILD = 1;
const SKIP = 0;

function finish(code, reason) {
  console.log(`[ignore] ${code === SKIP ? 'Skipping build' : 'Building'}: ${reason}`);
  process.exit(code);
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
}

/** File contents at a commit, or null if the file doesn't exist there. */
function fileAt(ref, path) {
  try {
    return git('show', `${ref}:${path}`);
  } catch {
    return null;
  }
}

/** True if the Markdown file has `draft: true` in its frontmatter (or doesn't exist). */
function isHidden(raw) {
  if (raw === null) return true;
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return !!fm && /^draft:\s*true\s*(#.*)?$/m.test(fm[1]);
}

const NOT_IN_BUILD = [/^README\.md$/, /^CLAUDE\.md$/, /^\.claude\//];
const BLOG_POST = /^src\/content\/blog\/[^/_][^/]*\.md$/;

if (!from || !to || from === to) finish(BUILD, 'no previous build to compare against');

let changed;
try {
  changed = git('diff', '--name-only', '--no-renames', from, to).split('\n').filter(Boolean);
} catch {
  finish(BUILD, 'could not compare commits');
}
if (changed.length === 0) finish(BUILD, 'no file changes detected');

for (const path of changed) {
  if (NOT_IN_BUILD.some((re) => re.test(path))) continue;
  if (BLOG_POST.test(path) && isHidden(fileAt(from, path)) && isHidden(fileAt(to, path))) continue;
  finish(BUILD, `${path} affects the live site`);
}

finish(SKIP, `only hidden drafts or non-site files changed (${changed.join(', ')})`);
