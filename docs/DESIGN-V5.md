# v5 — "Stellar Telemetry Grid & Liquid Data"

The fourth full presentation-layer rebuild (v2 quiet → v3 constellation → v4 plan halted → **v5, this one**), built to Aaditya's definitive brief: an award-tier immersive instrument — WebGL point-cloud hero, boot preloader, telemetry dashboard, liquid-shader work matrix, physics skills sandbox, horizontal journey, scramble-text writing list, and a working contact terminal — with **zero fabricated data anywhere**.

## Design language

- **Palette** — Pitch Obsidian `#020408` ground, Cybernetic Turquoise `#00f0ff` / `#00b4d8` signal, Warm Amber `#ee9b00` alerts/featured, Oxidized Rust `#ae2012` reserved accents, Ice White `#f3f4f6` primary text. The brief's gray `#6b7280` fails AA on obsidian, so real body text uses `#9aa3af` (`--color-dim`); `#6b7280` (`--color-ghost`) is reserved for oversized decorative type where the 3:1 large-text threshold applies.
- **Type** — Geist Sans (display 600 + body 400), Geist Mono (every readout). Instrument Serif from v2–v3 is gone.
- **Motif** — a 1px oscilloscope grid (`GridLines`), corner brackets, `[NN]`-indexed everything, HUD frame with live NPT clock and real coordinates `27.6194°N 85.5388°E`.

## The 8 sections

1. **Boot preloader** — circular calibration dial whose progress is driven by *real* readiness (fonts loaded, GL chunk compiled) smoothed over a minimum choreography (1.6 s desktop, 0.8 s low-power). Skipped for reduced-motion and repeat visits (sessionStorage).
2. **Point-cloud hero** — 16k-point interactive dataset (galactic disc + noise clusters), cursor = force field, press to attract. The name is DOM text (selectable, SEO/LCP-safe, transform-only entrance).
3. **Telemetry dashboard** — live ms clock, coordinates, KU affiliation, **real GitHub push activity** via the public events API (honest "LINK DOWN" state on failure — never faked), build git hash + date injected by Vite, operator profile.
4. **Work matrix** — 1px-ruled index rows; hover floats a liquid-shader preview (real KUMUN screenshot; repo-only projects get telemetry cards generated from real metadata — no fake product shots); click expands inline via GSAP.
5. **Skills sandbox** — hand-rolled verlet physics, draggable node buttons; selecting a node lists the *actual* projects using that tool (derived from project stacks — no invented proficiency bars). Touch/reduced-motion: static grid.
6. **Horizontal journey** — GSAP ScrollTrigger pin through `src/data/timeline.ts` (verifiable events only). Low-power/reduced-motion: vertical list.
7. **Writing** — the real essays, character-scramble on hover.
8. **Contact terminal** — typeable commands; `send` opens a real `mailto:` and says "TRANSMISSION HANDED TO YOUR MAIL CLIENT" — there is no backend, and pretending otherwise would violate the honesty rule.

## Engineering notes

- **GL architecture** — one fixed fullscreen R3F `<Canvas>` (`gl/GLRoot.tsx`) + tiny on-demand canvases for previews. All fragment output that composites over DOM uses **premultiplied alpha** (`vec4(color * a, a)`) — straight alpha occludes the page. `three` pinned to 0.180.x to match R3F 9.6.
- **FluidTrail** — ping-pong FBO cursor trail, ¼ resolution, desktop fine-pointer only, `NoBlending` on the sim pass.
- **Sound** — zero audio files; clicks/ticks/sweeps synthesized from oscillators + filtered noise (`src/audio/engine.ts`). **Off by default**, HUD toggle, persisted in `localStorage` (`as-sound`).
- **Tiering** — `useLowPowerTier` (coarse pointer / narrow viewport / ≤4 cores): point count ÷4, no FluidTrail, static sandbox, vertical journey, and — decisive for mobile scores — the preloader doesn't wait for the GL chunk; three.js loads *after* first paint. `prefers-reduced-motion`: no canvas at all, no preloader, flat readable layouts.
- **Honest telemetry plumbing** — build hash/date via `execSync('git rev-parse')` in `vite.config.ts` `define`; GitHub pulse cached in sessionStorage (30 min) with a real failure state.

## Measured (local `vite preview`, Lighthouse 12.8, clean runs)

| | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | **99** | **100** | 96 | **100** | 0.9 s | 0.022 | 0 ms |
| Mobile (Moto G emu, 4× throttle) | **96** | **100** | 96 | **100** | 2.4 s | 0.001 | 60 ms |

The only failing BP audit is `errors-in-console`: the unauthenticated GitHub events API returns 403 when this machine's 60 req/hr rate limit is exhausted by repeated test runs. Real visitors spend their own quota; the UI degrades honestly to "LINK DOWN". Accepted.

**Bundle** — initial (pre-GL): `index` 159 KB gz + CSS 7 KB gz; GL chunk (`three` + R3F) 232 KB gz, lazy-loaded during boot (desktop) or after first paint (low-power). Total JS ≈ 396 KB gz. Over the plan's aspirational 360 KB — the delta is three.js itself; accepted as the cost of the brief's WebGL scope, and it never blocks first paint on phones. Source maps shipped (devtools-only fetches).

## Manual notes for Aaditya

- **Sound** — the site is silent until a visitor clicks `SND OFF` in the HUD; the choice sticks per browser.
- **Terminal commands** — `help`, `sayhi`, `send <message>`, `email`, `github`, `linkedin`, `x`, `blog`, `resume`, `clear`.
- **Adding a milestone** — edit `src/data/timeline.ts` (year, tag, title, detail, optional `status: 'building'`). The journey and its mobile fallback both read from it.
- **Adding a project** — edit `src/data/projects.ts`, then run `node scripts/capture-previews.mjs` to regenerate hover previews and `npm run verify:links` before shipping.
- **ResolveIQ repo link** — removed 2026-07-11 because `github.com/TechAaditya/ResolveIQ` now 404s. Restore the `repoUrl` once the repo is public again.
