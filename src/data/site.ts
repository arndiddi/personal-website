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

  /** The little rotated "stamp" shown on the home page + resume. */
  status: 'Seeking Summer 2027 PM Internships',
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
  eyebrow: 'Product · AI · Building things people use',
  tagline: 'Aspiring Product Manager who likes building with AI, and building things people end up relying on.',
  intro:
    "I'm a first-year M.S. student in Technical Product Management at Northeastern, with a Computer Science and Business Analytics background from Rutgers. I spent my last role at Johnson & Johnson rolling out a generative AI tool to the teams who'd actually use it, and I've been building my own products on the side ever since. I'm aiming for an APM role straight out of my master's, and right now I'm recruiting for Summer 2027 PM internships.",
};

/** The "Currently" ledger panel on the home page. */
export const currently = [
  { key: 'Studying', value: 'M.S. Technical Product Management, Northeastern (Fall 2026 – Spring 2028)' },
  { key: 'Recruiting for', value: 'Summer 2027 Product Manager / APM internships' },
  { key: 'Building', value: 'An OCD treatment app that turns symptom data into a personalized starting point for care' },
  { key: 'Watching', value: 'Anime. Six series in so far, and taking recommendations' },
  { key: 'Based in', value: 'Boston, MA · from Belle Mead, NJ' },
];
