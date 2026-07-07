# Portfolio Rebuild — Master Prompt for Claude Code (v2)

Read this entire document before writing any code. Work phase by phase. Do not skip the verification gate at the end of each phase, and stop for my approval where the document says STOP.

---

## 1. Mission

Rebuild my portfolio (repo `techaaditya/my_portfolio_website`, live at https://www.aadityasapkota.com.np/) — currently a single-file HTML/CSS/JS template — into a fast, distinctive, honest site. I'm **Aaditya Sapkota**, a Kathmandu University student, aspiring data scientist / research enthusiast, who also ships real web products with a team.

The bar is not "more animations and more sections." The bar is: **every claim is true, every link works, the design has one memorable idea executed exceptionally, and it loads instantly.** A restrained site full of real work beats a flashy site full of filler every single time. Treat that as the north star whenever you're tempted to add something.

---

## 2. Use the reference sites — but curate, don't accumulate

I want you to actually open these and extract *specific, transferable* patterns, not vibes. **Visit each URL** (fetch it; if a fetch is blocked, web-search the name first, then fetch the result). Take notes into `docs/RESEARCH.md` — for each site, one line on the single thing worth stealing.

**Must-study (developer/data-focused, closest to me):**
- https://itsvg.in/ — Vishwa Gaurav
- https://aayushbharti.in/ — Aayush Bharti
- https://kartavya-singh.com/
- https://pulkitgpt.tech/
- https://www.roshan-sahu.com/
- https://akshaysanthoshkumar.vercel.app/
- https://mounirelkatmourportfolio.vercel.app/

**Must-study (editorial/design polish — for typography & motion, not for copying layout):**
- https://www.nithinmwarrier.com/ (Awwwards winner)
- https://danielsun.space/
- https://mauriciojuba.com/
- https://k95.it/en
- https://www.noth.in/
- https://www.ryanritzenthaler.com/

**Browse for structural patterns only (don't copy visuals):**
- https://github.com/emmabostian/developer-portfolios (the README list)
- https://uiverse.io/ (isolated micro-interactions — cherry-pick at most 1–2)
- https://www.junkbranding.com/, https://sumantimsina.com.np/, https://gehadportfolio127.netlify.app/, https://majd-portfolio.framer.website/, https://www.redoyanulhaque.me/, https://www.aahanabobade.com/, https://www.aashishjaini.me/, https://abdulrehmanwaseem.me/, https://kswork2001.github.io/portfolio/

### What I already extracted (so you know the target, then go deeper yourself)
Three archetypes exist in these references. Pick the parts that fit a data-scientist identity; ignore the rest.

1. **Developer/terminal identity (itsvg.in).** A terminal-styled hero ("last login…"), a *signature motif* section — itsvg renders work-experience entries as credit/debit **cards** with a chip graphic. That "one specific recurring motif that encodes identity" is the single most transferable idea in the whole set. Also: an infinite tech marquee, and short "principles" cards. Lesson: give the site ONE ownable motif.
2. **Editorial designer polish (nithinmwarrier.com, danielsun.space).** Oversized display type with the name split across two lines; rotating role words; a *curated* project grid where each item shows **year + discipline** rather than a generic card; hand-drawn/organic accent marks over a clean grid; and personality-driven copy written in a real human voice (Daniel Sun: "I don't have dark secrets, only bright ones"). Lesson: typography and voice carry the personality — not effects.
3. **Craftsmanship dev (aayushbharti.in).** Positions the site as "not just a resume" — performance, accessibility, and SEO treated as features; every element "earned its place." Optional extra pages (blog, uses/bucket-list, guestbook) add personality. Lesson: the polish *is* the portfolio; each interaction must justify itself.

**The discipline that separates elite from amateur here is curation.** Pick 2–3 signature interactions, execute them flawlessly, keep everything else quiet. A site that tries to use every effect from every reference looks like a demo reel, not a portfolio.

---

## 3. What's wrong with the current site (fix all of it)

1. **Fabricated projects.** The current cards (AI Image Generator, Stock Predictor, E-Commerce, Chatbot, Smart Home IoT, Analytics Dashboard) link to repos that don't exist. **Delete all of them** — replaced by my real work in §6.
2. **Resume is a JPG** (`myresume_updated.jpg`). Link a real `/resume.pdf` (I'll supply it) with a graceful fallback if missing.
3. **Skill inflation** — ~45 technologies. Cut to an honest grouped set (§6).
4. **Template design** — navy/purple gradient, typing animation, three-identical-cards-per-section. Redesign per §5.
5. **No engineering** — no build step, no meta tags, no OG image, multi-MB unoptimized photos, blogspot links mixed in.
6. **Weak photo use.** I don't want raw selfies dropped in at full size. Either omit the portrait, or treat it as a *designed* element (duotone / masked / with accent marks, like nithin's brush-stroke portrait), optimized and art-directed. Identity comes from type and work, not photos.

---

## 4. Tech stack (use exactly this — and note the deliberate restraint)

- **Vite + React 19 + TypeScript** (strict, no `any`)
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **Motion** (`motion/react`) as the **primary and default** animation library. Declarative, small, handles scroll reveals, `useInView`, layout animation, hover micro-interactions. This covers ~95% of what the site needs.
- **GSAP + ScrollTrigger (via `@gsap/react` `useGSAP`)** — add **only if** a specific scrubbed/pinned timeline genuinely needs it (e.g., one orchestrated hero sequence). Do not add it "just in case." If Motion can do it, use Motion.
- **Lenis** smooth scroll — optional, add only if it doesn't cost measurable performance, and it must be disabled under `prefers-reduced-motion`.
- **React Three Fiber / WebGL — do NOT add unless I explicitly approve it in the Phase 1 design plan.** A 3D particle hero is the fastest way to blow the performance budget below. If a signature background is wanted, prefer a lightweight 2D `<canvas>` (throttled, paused off-screen, disabled on mobile + reduced-motion) or pure CSS. Justify any WebGL before building it.
- Icons: **lucide-react** only.
- Fonts: self-hosted via **@fontsource** (no render-blocking Google Fonts).
- **Deployment stays on GitHub Pages** with the existing `CNAME` (www.aadityasapkota.com.np) — this is my current setup and I don't want to move DNS. Add a GitHub Actions workflow that builds and deploys `dist/` on push to `main`. (Vercel is a fine *option* if you think it's clearly better — but propose it, don't silently migrate; keep the custom domain working either way.)

**Why the restraint:** the quality bar in §8 (Lighthouse ≥95 mobile, JS <200KB gzipped) and "kitchen-sink animation" are in direct tension. Every library you add must earn its weight. Four animation systems running at once is how a site ends up slow *and* feeling AI-generated. One system, used well, is the elite move.

Repo hygiene:
- Proper structure: `src/components`, `src/sections`, `src/data`, `src/lib`, `src/hooks`.
- **All content lives in typed data files** (`src/data/projects.ts`, `site.ts`, etc.) — zero content hardcoded in JSX, so I can edit content without touching components.
- Keep the old site in `legacy/` for one commit, then delete.
- Real README (stack, scripts, deploy steps, content-editing guide) + `docs/RESEARCH.md` + `docs/DECISIONS.md`.
- Conventional commits; one commit per phase minimum; run `build` + `lint` clean before each commit.

---

## 5. Design direction

Follow a two-pass process: **write a short design plan first, critique it, revise, then build. Show me the plan before Phase 2 (§7).**

The plan must contain: a 4–6 colour token system (named hex), the type pairing with justification (display + body + mono), an ASCII wireframe of the page, the ONE signature element, and a self-critique paragraph answering: *"What would the generic version of this look like, and how is mine specifically different?"*

### Brief
- **Mood:** deep-ocean / night-observatory. Precise, calm, confident — an instrument panel or star chart, not a neon arcade. This is a data researcher's site: signal, cartography, measurement. Avoid cyberpunk glow.
- **Palette:** derive from my "Ocean Blue Serenity" scale (from my design doc): anchor `#03045e` (deep twilight) → `#0077b6` → `#00b4d8` → `#90e0ef` → `#caf0f8`. Background = a near-black blue (≈`#020617`–`#03045e`). Single accent family = `#00b4d8` / `#48cae4`. Optionally `#ee9b00` (golden orange) as a **rare** secondary accent for one or two moments only. **Do not** default to acid-green-on-black, or cream-with-terracotta — those read as AI defaults.
- **Typography is the personality.** Pick a characterful display face + a clean body face + a mono face for data labels/eyebrows (nithin & danielsun prove oversized expressive display type is what makes a portfolio memorable). Not Poppins/Inter-for-everything. Real fluid type scale with deliberate weights and tracking. Justify the pairing.
- **One signature element — pick ONE and execute it exceptionally** (this is your "credit-card motif" moment, à la itsvg). Candidates, choose the best or propose better:
  - A recurring **instrument/observatory motif** — e.g., coordinate ticks, contour lines, or a faint star-chart grid that frames sections and encodes the "data researcher" identity.
  - A **terminal / notebook** motif done tastefully (a Jupyter-ish or console-styled hero block) — only if it feels crafted, not cliché.
  - A subtle **2D point-cloud / contour** hero canvas suggesting a dataset resolving into signal (heavily throttled; off on mobile + reduced-motion; text is the LCP, never the canvas).
- **Motion rules:** one orchestrated page-load moment in the hero; restrained scroll reveals (opacity + small translate, once, no bounce); meaningful hover states on project cards and links. Everything under ~400ms except the hero intro. `prefers-reduced-motion` disables all of it — the site must be 100% usable and good-looking with zero animation. If an animation makes it feel like a template, cut it.
- **Layout:** break the identical-3-card-grid rhythm. Vary section anatomy: hero → featured project (large, asymmetric) → remaining projects (compact) → about/skills → writing → contact. Borrow nithin's "year + discipline" treatment for project items instead of generic cards. Generous whitespace, strong grid, no dividers that encode nothing.
- **One theme, executed perfectly** (dark). A light mode is optional and only if it's genuinely as good — don't ship a mediocre second theme.

---

## 6. Content — single source of truth (use exactly this; invent nothing)

### Anti-fabrication rules (critical — my current site AND many templates fail here)
- **No testimonials.** I have none. Do not add a testimonials section with invented quotes.
- **No fabricated stat counters.** No "5+ years experience," no "research papers: 3," no invented commit/user counts. Include a stats/metric *only* if it's a real, verifiable number I confirm.
- **No invented experience entries.** An experience/involvement section may exist **only** with real entries. If you're unsure whether something counts, ASK me — don't fill it.
- **No inflated skills.** Honest grouped list only (below).
- **Banned buzzwords in copy:** "proven track record," "impactful solutions," "passionate about leveraging," "results-driven." Write plainly and specifically.

### Identity
- Name: **Aaditya Sapkota**
- Role line: honest and non-inflated — something like "Data science & ML — building toward research." Never "Research Scientist" (I'm *aspiring*; say student / researcher-in-training). Refine wording with me.
- Location: Kathmandu, Nepal (Kathmandu University)
- Links: GitHub `https://github.com/TechAaditya`, LinkedIn `https://www.linkedin.com/in/aadityasapkota/`, X `https://x.com/aadityabro1`, blog `https://aadityasapkota.blogspot.com/`. Drop Facebook/Instagram from the professional site.
- Contact: replace the fake contact form with a real `mailto:` + copy-email-to-clipboard button + the links above. No backend form, no newsletter, no embedded map.

### Projects — REAL work only (replaces everything on the current site)
For each: a 2–3 sentence description (what it does + my role), the actual stack, live link (+ repo if public). Where these were team efforts, **credit honestly** ("Built with the team at …") — honesty reads as strength, not weakness. **Verify every link resolves at build time; flag any dead one instead of shipping it.** Use nithin's year+discipline treatment rather than generic cards.

1. **KUMUN — Kathmandu University Model United Nations** — https://kumun.ku.edu.np/ — official event site (schedules, committees, registration). Strong institutional credential — a good candidate for the *featured* slot.
2. **Damek Studios** — https://damekstudios.com/ — site for a Nepal-based game development studio.
3. **Dodolr** — https://www.dodolr.com/ — task/notes/follow-up tracker for individuals and small teams.
4. **Tinkune** — https://www.tinkune.com/ — platform connecting Nepalese businesses worldwide, with job listings.
5. **Jyotirvidhya** — https://jyotirvidhya.com/ — Vedic astrology consultation platform (booking + services).
6. *(Optional)* Global Youth Hackathon 2026 — add a "currently building" entry **only if I confirm**; otherwise omit.

Full case-study sub-pages (`/projects/:slug`) are **optional** and only worth it if I give you real depth (problem, my role, outcome) for a project. Otherwise a strong single-page card with links is better than a thin case study padded with filler. Ask me per project.

### Skills — cut ruthlessly (confirm final list with me; start here)
- **Core:** Python, JavaScript/TypeScript, SQL
- **Data / ML:** Pandas, NumPy, scikit-learn, PyTorch, Matplotlib/Seaborn
- **Web:** React, Node.js, Tailwind
- **Tools:** Git, Docker, Linux

Present as quiet typographic groups or a compact grid — **no progress bars, no percentage rings, no logo carousels** (they imply false precision).

### About
First person, 3–4 specific sentences: KU student, data-science + research ambition, ships real web products with a team, coordinates events (KUMUN). Give it a real voice (see danielsun for tone calibration) without the banned buzzwords.

### Writing
Small "Writing" section linking the 3 blogspot posts + "All posts →". Frame as personal essays. A simple typographic list is fine if it fits the design better than cards.

---

## 7. Phases (with gates)

**Phase 0 — Research & scaffold.** Read the whole current repo; extract existing copy/assets to `src/data/legacy.json`; run Lighthouse on the current live site and save baseline to `docs/AUDIT.md`; visit the reference sites and fill `docs/RESEARCH.md`; init Vite+React+TS+Tailwind v4 + tooling (ESLint, Prettier); create the folder structure and typed data files with all §6 content. *Gate:* `build` clean, typed data compiles, old site preserved in `legacy/`. **STOP — summarize findings for me.**

**Phase 1 — Design plan.** Produce the full plan from §5 (tokens, type + justification, ASCII wireframe, the ONE signature element, self-critique). If you want WebGL, justify it here. *Gate:* **STOP — present the plan; wait for my approval before any UI code.** This is the make-or-break checkpoint.

**Phase 2 — Design system + hero.** Tokens in Tailwind `@theme`; base layout, nav (transparent → blur on scroll, active-section highlight, mobile drawer); the hero with the signature element + load sequence. *Gate:* review at 390 / 768 / 1440px; reduced-motion verified; hero LCP is text, not canvas. **STOP.**

**Phase 3 — Sections.** Featured project, project index (year+discipline treatment), about + skills, writing, contact, footer. All from data files. *Gate:* **every external link manually verified** (fetch/curl each); zero placeholder text ("Lorem", "Coming soon", TODO) shipped. **STOP.**

**Phase 4 — Polish & motion.** Scroll reveals, hover/focus states, 404 page, favicon set, OG image (1200×630), JSON-LD `Person`, sitemap.xml, robots.txt. *Gate:* keyboard-only navigation works end-to-end; visible focus rings; skip-to-content link. **STOP.**

**Phase 5 — Performance & ship.** Optimize images (AVIF/WebP + explicit width/height), font subsetting/preload, code-split anything heavy, confirm any canvas is throttled and paused off-screen. Deploy via Actions to Pages; confirm CNAME + HTTPS intact. *Gate:* budgets in §8 pass on the production URL.

---

## 8. Hard budgets & quality floor (non-negotiable)

- Lighthouse (mobile, production): **Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100**
- Total JS **< 200 KB gzipped**; no dependency added without justification in the commit
- **CLS ≈ 0; LCP < 2.0s** on Fast 4G; hero animation never blocks first paint
- Responsive 360 → 1920px (test 390 / 768 / 1024 / 1440); no horizontal scroll
- WCAG AA contrast throughout — specifically check accent-on-dark-blue combos
- `prefers-reduced-motion` fully honored (site fully usable with zero animation)
- Semantic HTML: one `h1`, landmarks, alt text on any portrait, `aria-label`s on icon links
- Zero console errors/warnings; zero dead links; zero fabricated content

---

## 9. How you (Claude Code) should work

- After each phase, **self-critique before showing me**: screenshot if you can, and ask *"does any part of this look like a default template or demo reel?"* Fix before presenting.
- When unsure about content (my role wording, whether to include the hackathon project, final skills list, whether something counts as real "experience") — **ask me; never invent.**
- Do **not** add sections I didn't request: no testimonials, no fake stat counters, no "services," no newsletter, no guestbook (unless I ask).
- Prefer deleting over decorating. When in doubt, remove one element.
- Keep `docs/DECISIONS.md` (why each non-obvious choice was made) and `docs/RESEARCH.md` (reference notes) current, so later passes don't repeat mistakes.
- Use plan mode before each coding phase so I can catch bad architecture early.

Begin with Phase 0 now. Then STOP and present the Phase 1 design plan for my approval before building any UI.
