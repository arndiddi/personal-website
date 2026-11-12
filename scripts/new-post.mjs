#!/usr/bin/env node
/**
 * Creates a new blog post file for you to edit by hand.
 *   npm run new-post "My Post Title"
 * → src/content/blog/my-post-title.md (as a draft)
 */
import { existsSync, writeFileSync } from 'node:fs';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new-post "My Post Title"');
  process.exit(1);
}
const slug = title
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
const file = `src/content/blog/${slug}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
description: "One-sentence summary shown on the blog list and in link previews."
pubDate: ${today}
draft: true
featured: false
tags: []
---

Start writing here. When you're ready to publish, change \`draft: true\` to \`draft: false\`.
`,
);
console.log(`Created ${file}\nPreview it at http://localhost:4321/blog/${slug} while \`npm run dev\` is running.`);
