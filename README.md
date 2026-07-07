# aadityasapkota.com.np

Personal portfolio of **Aaditya Sapkota** — Kathmandu University student in data science & ML, building toward research. Live at [www.aadityasapkota.com.np](https://www.aadityasapkota.com.np/).

A rebuild of the original single-file HTML/CSS/JS template into a fast, honest, typed site. Currently on the `rebuild` branch; merges to `main` at ship time.

## Stack

- **Vite 6** + **React 19** + **TypeScript** (strict, no `any`)
- **Tailwind CSS v4** (CSS-first `@theme`, no config file)
- **Motion** (`motion/react`) — the primary animation library
- **lucide-react** — icons
- Fonts self-hosted via **@fontsource** (added in Phase 2)
- Deploys to **GitHub Pages** with the existing `CNAME`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | Typecheck without emit |
| `npm run format` | Prettier write |
| `npm run verify:links` | Fetch every external URL in the data files; fail on dead links |

## Editing content (no components touched)

All content lives in typed data files under [`src/data/`](src/data/):

- [`site.ts`](src/data/site.ts) — name, role line, location, email, social links, SEO
- [`projects.ts`](src/data/projects.ts) — real projects (title, description, year, discipline, stack, links, credits)
- [`skills.ts`](src/data/skills.ts) — grouped skills
- [`writing.ts`](src/data/writing.ts) — blog posts
- [`about.ts`](src/data/about.ts) — about paragraphs

Edit those files and rebuild; the UI reads from them. After editing links, run `npm run verify:links`.

## Deployment

GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — it builds and deploys `dist/` on every push to `main`. `public/CNAME` keeps the custom domain (`www.aadityasapkota.com.np`) and HTTPS intact.

**One-time setup** (do this once before the first Actions deploy): in the repo **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (it's currently "Deploy from a branch"). Until then the old branch deploy keeps the current live site up.

**To ship the rebuild:** merge the `rebuild` branch into `main` and push. The workflow runs automatically and publishes. To preview locally first: `npm run dev` (hot reload) or `npm run build && npm run preview` (production build).

## Project docs

- [`docs/AUDIT.md`](docs/AUDIT.md) — baseline Lighthouse of the original site
- [`docs/RESEARCH.md`](docs/RESEARCH.md) — reference-site research notes
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — why non-obvious choices were made
- `PORTFOLIO_REBUILD_PROMPT.md` — the authoritative rebuild spec

## Structure

```
src/
  components/   reusable UI
  sections/     page sections (hero, projects, about, …)
  data/         typed content — single source of truth
  lib/          helpers
  hooks/        custom hooks
scripts/        build/verify tooling
docs/           audit, research, decisions
legacy/         the original site (kept one commit, then removed)
public/         static assets (resume.pdf, CNAME, og-image, favicons)
```
