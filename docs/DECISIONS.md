# Decisions Log

Why each non-obvious choice was made, so later passes don't re-litigate them.

## Phase 0 — Research & scaffold

**Work on a `rebuild` branch, not `main`.**
GitHub Pages currently serves the static site straight from `main`. Moving the old files into `legacy/` on `main` would 404 the live site mid-rebuild. All work happens on `rebuild`; it merges to `main` only at Phase 5 ship time, after the new site passes its budgets. The live site stays untouched until then.

**Legacy preserved via `git mv` into `legacy/`.**
Spec requires keeping the old site for one commit. Using `git mv` preserves history. It will be deleted in a later phase (Phase 4/5).

**Stack: Vite + React 19 + TS (strict) + Tailwind v4, and nothing else yet.**
Only `motion` and `lucide-react` are installed for runtime. GSAP, Lenis, and any WebGL/R3F are deliberately NOT installed — each must earn its place in the Phase 1 design plan against the §8 budgets (JS < 200 KB gz, Lighthouse ≥ 95). Placeholder build ships 62.8 KB gz JS, leaving generous headroom.

**Tailwind v4 via `@tailwindcss/vite` (CSS-first).**
No `tailwind.config.js`; tokens live in `@theme` in `src/index.css`, added in Phase 2 after design approval. Phase 0 keeps `index.css` minimal so the scaffold builds clean.

**All content in typed data files (`src/data/*.ts`), zero content in JSX.**
`site.ts`, `projects.ts`, `skills.ts`, `writing.ts`, `about.ts`. Aaditya can edit content without touching components. `legacy.json` holds the extracted old content for reference (with notes on what was dropped and why).

**Fonts deferred to Phase 1/2.**
`@fontsource/*` packages aren't installed until the type pairing is chosen in the design plan, to avoid installing faces we won't use.

**`@types/node` added; `erasableSyntaxOnly` removed.**
`erasableSyntaxOnly` is a TS 5.8+ option; we're on 5.7, so it errored. `@types/node` is needed for `vite.config.ts` (`node:url`) and the link-verify script (fetch/AbortController/process).

**Link verification is a real script (`npm run verify:links`).**
Fetches every URL in the data files. Classifies bot-block statuses (403/429/999) as WARN — LinkedIn always returns **999** to automated requests but is fine in a browser — and genuine connection failures as DEAD (fails the build). Satisfies §6 "verify every link at build time; flag any dead one."

## Phase 2–5 — build, design, performance

**"Night Observatory" design system.** Ocean-blue tokens in Tailwind v4 `@theme`; Instrument Serif (display) + Geist Sans (body) + Geist Mono (readouts). The one signature motif is the star-chart coordinate system (CSS grid + plotted stars + mono instrument-readout labels + a recurring crosshair mark); the featured project is the single ember star. Full rationale in `docs/DESIGN.md`.

**Zero content photos.** The design deliberately omits the portrait — identity comes from type and work (per the brief). This also removes the biggest performance liability from the old site (multi-MB images) for free; there are no raster content images to optimize.

**Real projects from GitHub, curated.** Removed Damek Studios / Dodolr / Tinkune (Aaditya confirmed they aren't his). Featured KUMUN (live + repo); added Knowlify, ResolveIQ, IntelliFlow, TrekVerse, EcoFarma, KrishiBot, Nepali News Analytics from his GitHub with descriptions grounded in each README/About; GYH 2026 as "building". Jyotirvidhya removed entirely at Aaditya's request (its server was unreachable — see below) rather than kept flagged.

**Résumé button always renders.** Dropped the runtime HEAD-probe hook: the PDF is a committed build asset, so the probe was needless complexity and produced a spurious `ERR_ABORTED` in the console.

**Performance.** `LazyMotion` + `domAnimation` instead of the full `motion` bundle (JS 112 → 98 KB gz). Critical fonts preloaded via a small Vite plugin (parallelizes with CSS, removes swap flash). The hero name (LCP element) stays fully opaque and animates only a transform, so LCP fires at first paint instead of waiting on an opacity fade — this cut Speed Index ~3.9 → 1.7s and lifted Performance to 97 (clean run). Final: Perf 97 / A11y 100 / BP 100 / SEO 100, CLS 0.

**Deploy: GitHub Actions → Pages (stay on Pages, keep CNAME).** `.github/workflows/deploy.yml` builds and deploys `dist/` on push to `main`. **One-time manual step Aaditya must do:** in the repo's Settings → Pages, switch "Build and deployment → Source" from "Deploy from a branch" to **"GitHub Actions"**. Until then the old branch-based deploy stays active (live site unaffected). `public/CNAME` keeps the custom domain; Vite `base` is `/` (served at domain root, not a project subpath).

## Resolved content issues

- **jyotirvidhya.com was unreachable** (DNS resolved to Hostinger IPs, but the server never answered on port 443 — an outage or firewall block, not a bot block). Flagged per §6 rather than shipped as a working link. Aaditya confirmed on 2026-07-07 to drop it from the site for now; the entry was removed from `projects.ts` (recoverable via git history). Replaced with three real GitHub projects: EcoFarma, KrishiBot, Nepali News Analytics.

## Confirmed content decisions (from the user, Phase 0)

- Role line: "Data science & ML — building toward research".
- Global Youth Hackathon 2026 included as a "currently building" entry (role: building the official event website; no live link yet).
- Resume: real PDF supplied → shipped as `public/resume.pdf` (→ `dist/resume.pdf`).
- Skills: the §6 grouped set as-is.
- Dropped Facebook & Instagram from the professional site (kept GitHub, LinkedIn, X, blog).
