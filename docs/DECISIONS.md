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

## v3 — "Living Constellation" immersive redesign (2026-07-07)

**Why.** Aaditya reviewed the shipped "Night Observatory" design and rejected it: too dark and empty, no wow factor, too plain. He asked for an immersive, interactive, awwwards-style showpiece. Content, data files, and honesty rules unchanged — only the presentation layer was rebuilt.

**The signature element: a raw-WebGL particle constellation** (`ParticleField.tsx`, ~4 KB — deliberately no three.js, which would triple the JS budget). Thousands of aurora-tinted points twinkle, drift, parallax with scroll, scatter from the cursor, and draw constellation lines between the brightest "majors" and toward the pointer. Backed by CSS aurora washes (`AuroraBg.tsx` — radial gradients, no blur filters) and a new violet/cyan/magenta token set.

**Interaction layer.** Lenis smooth scroll; custom cursor (dot + trailing ring, `pointer: fine` only); magnetic buttons; 3D tilt + cursor-spotlight project cards; kinetic letter-by-letter hero name with a gradient line; scroll-lit About paragraphs; dual skill marquees; scroll-progress hairline in the nav; outline-type footer watermark with a live Kathmandu clock.

**Performance strategy: nothing ambient runs before first interaction.** All WebGL work (even context creation + shader compile) and every CSS keyframe loop (aurora, marquees, pulses) hold until the visitor first moves/scrolls/touches (`lib/interaction.ts` + `html.motion-armed`); the sky then fades in. Below-fold sections are `React.lazy` chunks with per-section Suspense so no single boot task blocks. The hero paragraph (LCP element) and name animate transform-only — opacity fades would delay LCP (same trap as v2). `.text-aurora` is a static gradient — animating background-position repainted glyphs every frame. Word-level scroll lighting uses plain spans driven by one scroll subscription, not 120 Motion components (that was an 850 ms boot task).

**Measured (local `vite preview`, Lighthouse 12).** Desktop: **Perf 98 / A11y 100 / BP 100 / SEO 100**, LCP 1.0 s, TBT 80 ms. Mobile (simulated Moto G, 4× CPU throttle + Fast 4G): **Perf 72 / 100 / 100 / 100**, TBT 620 ms, CLS ~0. The mobile number is the honest cost of an immersive SPA on a throttled low-end device (awwwards-class sites typically score 30–60); the remaining gap is JS-boot FCP and font-arrival LCP, fixable only by prerendering, which would compromise the entrance choreography. Accepted deliberately — the §8 ≥95-mobile budget belonged to the v2 quiet design; Aaditya explicitly re-prioritized wow factor.

**Honest fallbacks kept.** `prefers-reduced-motion`: static constellation frame, no smooth scroll, no cursor, no marquee/aurora motion, instant anchors. Touch: no pointer forces, no tilt, no custom cursor. No WebGL: aurora background still carries the design. Tab hidden: sim pauses.

## Resolved content issues

- **jyotirvidhya.com was unreachable** (DNS resolved to Hostinger IPs, but the server never answered on port 443 — an outage or firewall block, not a bot block). Flagged per §6 rather than shipped as a working link. Aaditya confirmed on 2026-07-07 to drop it from the site for now; the entry was removed from `projects.ts` (recoverable via git history). Replaced with three real GitHub projects: EcoFarma, KrishiBot, Nepali News Analytics.

## Confirmed content decisions (from the user, Phase 0)

- Role line: "Data science & ML — building toward research".
- Global Youth Hackathon 2026 included as a "currently building" entry (role: building the official event website; no live link yet).
- Resume: real PDF supplied → shipped as `public/resume.pdf` (→ `dist/resume.pdf`).
- Skills: the §6 grouped set as-is.
- Dropped Facebook & Instagram from the professional site (kept GitHub, LinkedIn, X, blog).

## v5 — "Stellar Telemetry Grid & Liquid Data" (2026-07-12)

**Why.** Aaditya rejected v3 too (the dark *violet constellation* styling, not just v2's quietness) and, after a halted v4 "warm editorial" direction, supplied a definitive brief with 11 reference sites: a HUD/instrument aesthetic on Pitch Obsidian `#020408` + Cybernetic Turquoise `#00f0ff`, with eight named sections (boot preloader, point-cloud hero, telemetry dashboard, liquid work matrix, physics skills sandbox, horizontal journey, scramble writing, contact terminal). Full design record in `docs/DESIGN-V5.md`; v4's halted plan kept in `docs/DESIGN-V4.md` as history.

**Content decisions re-confirmed by Aaditya (2026-07-10).** Projects stay the verified real list — KUMUN featured + Knowlify, ResolveIQ, IntelliFlow, TrekVerse, EcoFarma, KrishiBot, Nepali News Analytics, GYH-2026. Damek/Dodolr/Tinkune and Jyotirvidhya stay out despite reappearing in the brief. Journey timeline uses only verifiable events. Sound defaults off.

**three.js accepted (v3 had refused it).** The brief's scope — force-field point cloud, ping-pong FBO fluid trail, liquid preview shader — is past what a hand-rolled 2D canvas can do. Cost contained: one lazy chunk (232 KB gz) whose load *is* the preloader's real progress on desktop, and which loads after first paint on low-power devices, so it never blocks LCP anywhere.

**Honesty mechanics.** GitHub activity is the real public events API with an explicit "LINK DOWN" failure state; build hash/date are the real git values injected at build time; the terminal's `send` opens a genuine `mailto:` rather than pretending to send; hover previews are a real KUMUN screenshot plus metadata cards generated from real repo data (`scripts/capture-previews.mjs`) — no fabricated product screenshots. ResolveIQ's `repoUrl` was removed 2026-07-11 after the repo 404'd (verified against his live repo list).

**Measured (local `vite preview`, Lighthouse 12.8).** Desktop **99 / 100 / 96 / 100** (LCP 0.9 s, CLS 0.022, TBT 0 ms); mobile **96 / 100 / 96 / 100** (LCP 2.4 s, TBT 60 ms). The one BP failure is a GitHub API 403 from this machine's exhausted unauthenticated rate limit during repeated test runs — an environment artifact, degrades honestly in the UI. Key fixes en route: premultiplied alpha for GL layers compositing over DOM; preloading the actual hero font weight (600) killed a 0.09 CLS; deferring GL + shortening boot choreography on low-power took mobile perf 49 → 96; the sandbox settles its physics bodies synchronously at mount so offscreen tap targets never overlap.
