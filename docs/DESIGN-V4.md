# v4 Design Plan — "Stellar Cartography & Data Instrument"

Status: **awaiting Aaditya's approval.** No UI code before sign-off.

The site is a high-precision scientific instrument: a stellar cartography
chart crossed with a premium technical log book. Every pixel argues for a
data/ML engineer's identity — measured, calibrated, exact. Nothing cozy,
nothing decorative without a function it can name.

## 1. Color system (strict Ocean Sunset mapping)

| Token          | Value                       | Role                                                        |
| -------------- | --------------------------- | ----------------------------------------------------------- |
| `--color-void` | `#001219`                   | Page background — rich ink-black. No purple, no glow blobs. |
| `--color-panel`| `#00181f` (void +4% white)  | Elevated panels/rows — barely lifted, like layered chart paper. |
| `--color-grid` | `rgba(255,255,255,0.08)`    | 1px razor grid/rules — oscilloscope divisions.              |
| `--color-grid-strong` | `rgba(255,255,255,0.16)` | Section-boundary rules, table header rules.            |
| `--color-body` | `#f3f4f6`                   | Body copy — desaturated paper-white (~15:1 on void).        |
| `--color-dim`  | `#94a3ad`                   | Secondary text, metadata (~7:1). Derived neutral, no hue cast. |
| `--color-custard` | `#e9d8a6`                | **Primary accent** — coordinates, dials, active states, key figures (~12:1). |
| `--color-caramel` | `#ca6702`                | **Rare secondary** — one or two burnt-caramel moments (alerts, the featured marker) (~5:1 large text). |
| `--color-cyan-log` | `#caf0f8`               | Optional light-cyan for select technical readouts (~14:1).  |

Accent discipline: custard is the *only* recurring highlight; caramel appears
at most twice per viewport. Everything else is ink, white, and grid.

## 2. Typography system

| Layer     | Face                                | Treatment                                                     |
| --------- | ----------------------------------- | ------------------------------------------------------------- |
| Display   | **Geist Sans 600** (already self-hosted) | Massive geometric-grotesque headings, tight tracking (−0.02em), clamp up to ~11rem. Zero new font bytes. |
| Metadata  | **Geist Mono 400/500** (already self-hosted) | All section indices `[01]`, years, coordinates, metrics, table headers. Uppercase, wide tracking. |
| Body      | Geist Sans 400                      | `#f3f4f6`, line-height 1.65, max-width ~65ch.                  |

- Instrument Serif gets dropped entirely (it read "boutique"; the grotesque reads "instrument").
- If you specifically want **JetBrains Mono** or **Space Mono** instead of Geist Mono, say so — it adds ~15–20 KB of font payload but is a drop-in swap. Default: Geist Mono (visually near-identical discipline, zero added bytes).

## 3. The background instrument grid

- **CSS-only, zero JS**: two repeating 1px `linear-gradient` layers = a fine full-page coordinate grid (like the v2 star-grid but sharper: no radial mask softening, crisp to the edges), plus wider "major division" lines every 8 cells at `--color-grid-strong`.
- Coordinate tick marks and axis labels (`27.61°N`, `85.53°E`, grid refs like `C-04`) rendered as absolutely-positioned mono annotations in section margins — static DOM, no canvas.
- No particle canvas, no WebGL, no aurora washes. (A canvas coordinate system stays listed as a *possible* Phase-2 enhancement, paused off-screen/mobile, only if the static grid feels too still after review.)

## 4. Section architecture

**Nav — instrument panel.** Hairline bottom rule; links rendered `[01] WORK · [02] ABOUT …` in mono; the active section's index lights custard with a small `▮` marker. Thin custard scroll-progress hairline. Mobile: full-width drawer with the same indexed rows.

**Hero — split grid (the signature moment).**
- Left ⅔: bold static typography — `AADITYA SAPKOTA` massive grotesque, then the confirmed role line *"Data science & ML — building toward research."* No letter-cascade theatrics; one restrained rise-and-settle on load. Résumé + Explore as squared, bordered instrument buttons.
- Right ⅓ (stacks below on mobile): a bordered **readout panel** — all values real, nothing invented:
  - `LOCAL TIME / KATHMANDU` — live ticking NPT clock
  - `POSITION` — 27.6194°N · 85.5388°E
  - `BUILD` — short git hash + build date, injected at build time by Vite (a true "server indicator")
  - `STATUS` — `● OPERATIONAL` (custard dot; blinks only after first interaction)
  - Social channels as `GITHUB ▸ / LINKEDIN ▸ / X ▸ / BLOG ▸` mono rows
- A 1px vertical rule divides the two columns, oscilloscope-style.

**Work — the chart index (table rows, not cards).**
`[NN] | YEAR | DISCIPLINE | TITLE | LINKS` as full-width horizontal rows divided by 1px rules; mono columns left, grotesque title dominant. Hover: row background lifts to `--color-panel` and left padding shifts +8–12px (the physical hover you specified); title never moves vertically (zero CLS). KUMUN stays featured — same row anatomy, taller, with description + a single caramel `◆ FEATURED` marker. "Building" status (GYH-2026) renders as a custard `[IN PROGRESS]` tag.

**About — specification sheet.** Bio paragraphs at reading width; skills as a mono **spec table** (`CORE | Python · JS/TS · SQL` …) with hairline rules — no marquees, no progress bars.

**Writing — log entries.** `ENTRY 01 / 2024` mono prefix, title, one-line abstract, hairline dividers.

**Contact — transmission block.** `[05] CONTACT` header, one large grotesque line, the email as the page's biggest custard link with sweep underline, socials as indexed mono rows. Footer: hairline rule, coordinates + live clock + `© 2026`, small custard crosshair mark.

## 5. Motion rules (instrument, not spectacle)

- Load: one hero rise-and-settle (transform-only — the LCP element stays painted from first frame, per the documented LCP trap).
- Scroll: once-only reveals; table rows tick in with a 40ms stagger, like a plotter drawing lines.
- Hover: padding shift on rows, underline sweeps, button border brightens to custard. No tilt, no magnetic pull, no spotlight, no custom cursor (precision = the real cursor; kept removed unless you want a crosshair variant).
- Ambient: only the status-dot blink and clock tick — both gated behind first interaction; `prefers-reduced-motion` gets a fully static instrument.
- Smooth scroll: **drop Lenis** (−3 KB) — native scrolling is the precise choice. Say the word if you want it kept.

## 6. What gets deleted from v3

`ParticleField` (WebGL), `AuroraBg`, `TiltCard`, `Magnetic`, `Cursor`, `SmoothScroll` + lenis dep, aurora tokens/gradients, marquees, footer watermark. Bundle drops well under 100 KB gz.

## 7. Budgets (unchanged, strict)

JS < 200 KB gz (projected ~85–95), CLS ≈ 0, zero console errors, A11y 100 (all pairs above are AA-checked on `#001219`), Lighthouse mobile back into the 90s — this design has no per-frame work at all.

## ⚠ 8. Content flag needing your explicit call

Your todo lists projects as "KUMUN, **Damek, Dodolr, Tinkune**, Jyotirvidhya" — but earlier you confirmed **Damek Studios, Dodolr, and Tinkune are not your projects** and I removed them; Jyotirvidhya was dropped because jyotirvidhya.com is unreachable. The plan keeps the verified list: **KUMUN (featured), Knowlify, ResolveIQ, IntelliFlow, TrekVerse, EcoFarma, KrishiBot, Nepali News Analytics, GYH-2026 (building)** — all real, all link-verified. If Damek/Dodolr/Tinkune should return, tell me what your actual role was in each and give me URLs that work; I won't ship unverifiable entries.
