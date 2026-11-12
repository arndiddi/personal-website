/**
 * The page's clean path: "/about", "/portfolio/unrequited", or "/".
 * Pages are built as about.html (see `build.format` in astro.config.mjs), so
 * Astro.url can end in ".html" at build time; strip that and any trailing slash.
 */
export function cleanPath(url: URL): string {
  return url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '') || '/';
}
