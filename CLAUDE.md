# Personal site (Astro 7 + Tailwind 4, Netlify)

Recruiting site for Arnav Diddi (aspiring APM; Summer 2027 PM internships). Audience is recruiters and PMs:
keep copy first-person, warm, concise, and grounded in real facts from `src/data/resume.ts`. Never invent metrics.

## Commands
- Node 22 is required (system Node is older): `source ~/.nvm/nvm.sh && nvm use 22` first.
- `npm run dev` (or `npx astro dev --background`; stop with `npx astro dev stop`)
- `npm run build` and `npm run check` must pass before pushing.

## Where things live
- Copy/data: `src/data/site.ts`, `src/data/resume.ts`
- Markdown collections (schemas in `src/content.config.ts`): `src/content/{blog,projects,teardowns,interests}`
- Design tokens + component classes ("Editorial" theme: off-white, DM Serif Display headlines with a grey italic
  `<em>` ending, DM Sans body, black pill buttons): `src/styles/global.css`. Reuse `.card`, `.fields`,
  `.section-title`, `.hero-name`, `.article-title`, `.eyebrow`, `.status-chip`, `.tag`, `.btn-*`, `.grid-*`
  instead of new one-off styles. `SectionHeader` takes an `accent` prop for the grey italic words.
- Blog API: `src/pages/api/posts/*` + `src/lib/api/*`; commits Markdown to GitHub in production,
  writes local files in dev.

## Rules
- `draft: true` content must never appear on the production site (filtering is in `src/lib/content.ts`).
- Contact form uses Netlify Forms + reCAPTCHA; keep `data-netlify`, `data-netlify-recaptcha`, the hidden
  `form-name` input, and the honeypot.
- Don't put the phone number on site pages (it's only in the PDF).
