// @ts-check
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Netlify sets `URL` to your live site address during every build, so links in
// the sitemap and RSS feed are always correct. Locally it falls back to localhost.
// Once you have a custom domain, you can hard-code it here instead.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  // Every page is pre-built to plain HTML (fast + free on Netlify).
  // Only the blog API routes (src/pages/api/...) run as serverless functions.
  output: 'static',
  redirects: { '/portfolio/teardowns': '/portfolio#teardowns', '/projects': '/portfolio', '/experience': '/resume' },
  adapter: netlify(),
  integrations: [sitemap({ filter: (page) => !page.includes('/contact/thanks') })],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      // All secrets — read at request time on Netlify, never shipped to the browser.
      BLOG_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_REPO: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_BRANCH: envField.string({ context: 'server', access: 'secret', optional: true, default: 'main' }),
    },
  },
});
