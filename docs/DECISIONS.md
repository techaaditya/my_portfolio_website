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

## Flagged content issues (need Aaditya's input)

- **jyotirvidhya.com is unreachable.** DNS resolves (Hostinger IPs), but the server does not answer on port 443 from here — connection times out with HEAD, GET, browser UA, and the `www.` variant alike. This is an outage or a geo/firewall block, not a bot block. Per §6 it is **flagged, not shipped and not deleted**: it stays in `projects.ts` but must not render as a live link until confirmed working. **Decision needed:** is the site temporarily down (keep, recheck before ship), permanently gone (drop the project), or moved (update the URL)?

## Confirmed content decisions (from the user, Phase 0)

- Role line: "Data science & ML — building toward research".
- Global Youth Hackathon 2026 included as a "currently building" entry (role: building the official event website; no live link yet).
- Resume: real PDF supplied → shipped as `public/resume.pdf` (→ `dist/resume.pdf`).
- Skills: the §6 grouped set as-is.
- Dropped Facebook & Instagram from the professional site (kept GitHub, LinkedIn, X, blog).
