/**
 * ─────────────────────────────────────────────────────────────
 *  SITE-WIDE INFO — edit this file to change your name, links,
 *  headline, status chip, and the "Currently" panel.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Arnav Diddi',
  /** Used in browser tabs, search results and link previews. */
  title: 'Arnav Diddi · Aspiring Product Manager',
  description:
    'Arnav Diddi is a Technical Product Management M.S. student at Northeastern recruiting for Summer 2027 Product Manager internships. Projects, product teardowns, resume, and writing.',

  email: 'arndiddi@gmail.com',
  location: 'Boston, Massachusetts',
  linkedin: 'https://www.linkedin.com/in/arnavdiddi',
  github: 'https://github.com/arndiddi',
  /** File in /public — replace it to update the downloadable resume. */
  resumePdf: '/Arnav_Diddi_Resume.pdf',

  /** The status line with the green dot (home page + resume). */
  status: 'Seeking Summer 2027 PM internships',
};

/** Top navigation. `href` must match a page in src/pages. */
export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
];

/** Home page hero copy. */
export const hero = {
  /** Big serif headline. `accent` is the grey italic ending. */
  headline: 'Turning ideas into products',
  accent: 'people use.',
  intro:
    "I'm a Technical Product Management M.S. student at Northeastern. At Johnson & Johnson I rolled out a generative AI tool to the teams who'd actually use it, and I've been building my own products ever since.",
  /** Small fact strip under the headline. */
  facts: [
    { label: 'Now', value: 'M.S. Technical PM, Northeastern' },
    { label: 'Before', value: 'PMO Analyst, Johnson & Johnson' },
    { label: 'Undergrad', value: 'CS + BAIT, Rutgers · Magna Cum Laude' },
  ],
};

/** The "Currently" panel on the home page. */
export const currently = [
  { key: 'Studying', value: 'M.S. Technical Product Management, Northeastern (Fall 2026 – Spring 2028)' },
  { key: 'Recruiting for', value: 'Summer 2027 Product Manager / APM internships' },
  { key: 'Building', value: 'An OCD treatment app that turns symptom data into a personalized starting point for care' },
  { key: 'Watching', value: 'Anime. Six series in so far, and taking recommendations' },
  { key: 'Based in', value: 'Boston, MA · from Belle Mead, NJ' },
];
