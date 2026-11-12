# arnav.diddi: personal site

My personal and recruiting site. Built with **Astro + Tailwind CSS**, deployed on **Netlify**, and stored on **GitHub**.

| Route | What's there |
| --- | --- |
| `/` | Home: intro, status, **featured** projects / teardown / posts, "Currently" panel |
| `/about` | Bio, how I think about product, "Beyond the résumé" boxes |
| `/portfolio` | Project case studies + product teardowns |
| `/portfolio/<project>` | One case study |
| `/portfolio/teardowns/<teardown>` | One teardown |
| `/resume` | Education, work, leadership & activities, skills, PDF download |
| `/blog` and `/blog/<post>` | Blog list and individual posts |
| `/contact` | Contact form with reCAPTCHA (Netlify Forms) |
| `/rss.xml`, `/sitemap-index.xml` | Feeds for readers and search engines |
| `/api/posts` | Private blog API (create, edit, draft) |

---

## 1. Run it on your computer

This project needs **Node 22** (`.nvmrc` pins it).

```bash
nvm use
```

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321. Pages reload as you save files. **Drafts are visible locally** (with a "Draft preview" banner) but never on the live site.

> If port 4321 is busy, Astro picks the next free one; check the terminal output for the URL.

---

## 2. Editing the site yourself (no Claude needed)

Everything you'd want to change lives in plain text files:

| I want to change… | Edit this file |
| --- | --- |
| Name, email, links, status stamp, home intro, "Currently" panel | `src/data/site.ts` |
| Resume: education, jobs, leadership, skills, certifications | `src/data/resume.ts` |
| The downloadable resume PDF | Replace `public/Arnav_Diddi_Resume.pdf` (keep the name) |
| About page bio + "How I think about product" | `src/pages/about.astro` |
| "Beyond the résumé" boxes (anime, skiing, …) | `src/content/interests/*.md` |
| Projects / case studies | `src/content/projects/*.md` |
| Product teardowns | `src/content/teardowns/*.md` |
| Blog posts | `src/content/blog/*.md` |
| Headshot | Replace `src/assets/headshot.jpg` |
| Colors, fonts, spacing | `src/styles/global.css` (the `@theme` block at the top) |

**Markdown cheat sheet:** `*italics*`, `**bold**`, `[link text](https://…)`, `## Heading`, `- bullet`. A blank line starts a new paragraph.

### Write a blog post by hand

```bash
npm run new-post "My Post Title"
```

That creates `src/content/blog/my-post-title.md` as a **draft**. Write it, preview it at `localhost:4321/blog/my-post-title`, then change `draft: true` → `draft: false` and push. (You can also copy `src/content/blog/_template.md`.)

Frontmatter fields (the block between the `---` lines):

```yaml
title: "Post title"
description: "One sentence for the list page and link previews."
pubDate: 2026-11-11
draft: false      # true = hidden on the live site
featured: false   # true = pinned in the home page "Writing" section
tags: [product, ai]
```

### Add a project or teardown

Copy an existing file in `src/content/projects/` (or `src/content/teardowns/_template.md`) and rename it. The file name becomes the URL. Set `featured: true` to show it in the home page **Featured** section, and `order` to control position (lower = first).

### Edit from the browser (no laptop setup)

On GitHub, open the repo and press the **.** (period) key. That opens a full editor in your browser. Edit a file, commit, and Netlify redeploys automatically.

### Publishing changes

```bash
git add -A
```

```bash
git commit -m "Update resume"
```

```bash
git push
```

Netlify sees the push and rebuilds the live site in about 1–2 minutes.

---

## 3. Deploying to Netlify (one-time setup)

1. **Push to GitHub.** Create an empty repo on GitHub (e.g. `personal-website`), then:
   ```bash
   git remote add origin https://github.com/arndiddi/<repo-name>.git
   ```
   ```bash
   git push -u origin main
   ```
2. **Import into Netlify.** Netlify → *Add new project* → *Import an existing project* → GitHub → pick the repo. Build settings are already in `netlify.toml`, so just click **Deploy**.
3. **Turn on the contact form.** Netlify → your project → **Forms** → *Enable form detection*, then trigger a redeploy (*Deploys → Trigger deploy*). The `contact` form appears in the Forms tab.
   - The reCAPTCHA checkbox is built in: Netlify injects it automatically because the form has `data-netlify-recaptcha="true"`. No Google keys needed.
   - To get emails: **Forms → Form notifications → Add notification → Email notification** → your address.
4. **Add environment variables** (for the blog API). Netlify → **Project configuration → Environment variables**:

   | Key | Value |
   | --- | --- |
   | `BLOG_API_KEY` | A long random secret. Generate one with `openssl rand -hex 32`. |
   | `GITHUB_TOKEN` | A GitHub **fine-grained token**: GitHub → Settings → Developer settings → Fine-grained tokens → *Generate*. **Repository access:** only this repo. **Permissions:** *Contents → Read and write*. |
   | `GITHUB_REPO` | `arndiddi/<repo-name>` |
   | `GITHUB_BRANCH` | `main` |

   Then redeploy so the functions pick them up.
5. **(Optional) Custom domain:** Netlify → **Domain management**. The sitemap and RSS automatically use whatever URL Netlify serves.

---

## 4. Blog API

Create, edit, publish, and unpublish posts by calling an endpoint, from a script, a shortcut, Postman, or Claude.

**How it works:** the API saves each post as a Markdown file in `src/content/blog/` by **committing it to your GitHub repo**. That commit triggers a Netlify rebuild, so:

- GitHub keeps every post, with full history, whether written by hand or through the API.
- A new or edited post is live **about 1–2 minutes** after the call (the time a rebuild takes).
- In `npm run dev` (with no `GITHUB_TOKEN` in `.env`), the API writes to your local files instead, which is handy for testing.

**Auth:** every request needs your key in a header: `Authorization: Bearer <BLOG_API_KEY>` (or `x-api-key: <BLOG_API_KEY>`).

Below, `SITE` is your live URL (or `http://localhost:4321` locally) and `KEY` is your API key:

```bash
export SITE=https://your-site.netlify.app KEY=your-api-key
```

### Create a post: `POST /api/posts`

```bash
curl -X POST "$SITE/api/posts" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"title": "What I learned shipping my first AI feature", "description": "Three lessons from rolling out a generative AI tool at J&J.", "content": "## Lesson one\n\nWrite your **Markdown** here.", "tags": ["ai", "product"], "draft": true}'
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | yes | One sentence, max 320 characters |
| `content` | yes | The post body, in Markdown |
| `slug` | no | The URL (`/blog/<slug>`). Made from the title if left out. |
| `draft` | no | Defaults to `false` (publishes). Send `true` to keep it hidden. |
| `featured` | no | `true` pins it on the home page |
| `tags` | no | List of strings |
| `pubDate` | no | `YYYY-MM-DD`. Defaults to today. |

Returns `201` with the slug and URL. Returns `409` if that slug already exists.

### Edit / publish / unpublish: `PATCH /api/posts/<slug>`

Send only the fields you want to change (any of `title`, `description`, `content`, `tags`, `draft`, `featured`, `pubDate`).

Publish a draft (also sets `pubDate` to today unless you pass one):

```bash
curl -X PATCH "$SITE/api/posts/what-i-learned-shipping-my-first-ai-feature" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"draft": false}'
```

Fix a typo in a published post (adds an "Updated" date automatically):

```bash
curl -X PATCH "$SITE/api/posts/what-i-learned-shipping-my-first-ai-feature" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"title": "What I learned shipping my first AI feature at J&J"}'
```

Unpublish (back to draft):

```bash
curl -X PATCH "$SITE/api/posts/what-i-learned-shipping-my-first-ai-feature" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"draft": true}'
```

### Read posts (drafts included)

All posts with their metadata:

```bash
curl "$SITE/api/posts" -H "Authorization: Bearer $KEY"
```

One post, including its Markdown:

```bash
curl "$SITE/api/posts/what-i-learned-shipping-my-first-ai-feature" -H "Authorization: Bearer $KEY"
```

### Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid body (the response lists what's wrong) or unknown field |
| `401` | Missing or wrong API key |
| `404` | No post with that slug |
| `409` | Slug already exists (POST), or the file changed on GitHub mid-save (retry) |
| `415` | Body wasn't sent as JSON |
| `502` | GitHub rejected the request (usually token permissions) |
| `503` | `BLOG_API_KEY` or GitHub variables aren't set on Netlify |

---

## 5. Project structure

```text
src/
  assets/headshot.jpg        Photo (auto-resized and optimized)
  components/                Header, Footer, cards, rows…
  content/
    blog/                    Blog posts (.md)
    projects/                Case studies (.md)
    teardowns/               Product teardowns (.md)
    interests/               "Beyond the résumé" boxes (.md)
  content.config.ts          Which frontmatter fields each folder uses
  data/
    site.ts                  Name, links, status, home copy
    resume.ts                Resume entries
  layouts/BaseLayout.astro   <head>, fonts, header + footer
  lib/
    content.ts               Sorting + draft filtering
    api/                     Blog API: auth, validation, GitHub storage
  pages/                     One file per route (incl. pages/api/posts/)
  styles/global.css          "Ledger" design system
public/
  Arnav_Diddi_Resume.pdf     Download on /resume
scripts/new-post.mjs         `npm run new-post "Title"`
netlify.toml                 Build settings for Netlify
```

Every page is pre-built to static HTML (fast and free to host). Only `/api/posts` runs as a Netlify Function.
