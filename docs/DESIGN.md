# Design Plan — Phase 1

Concept, tokens, type, wireframe, the one signature element, and a self-critique.
**Awaiting approval before any UI code (Phase 2).**

## Concept — "Night Observatory"

A data researcher's site read as a **star chart / instrument panel**: signal, cartography, measurement. Calm and precise, not neon. The whole page sits on a faint celestial coordinate system; content is "plotted" onto it. Deep-space background, ocean-cyan as the single accent family, one rare golden star.

## Color tokens (6, from the Ocean Blue Serenity scale)

All checked for WCAG AA on the `space` background.

| Token | Hex | Role | Contrast on `space` |
| --- | --- | --- | --- |
| `space` | `#020617` | Page background (deep space) | — |
| `abyss` | `#0a1430` | Elevated surface / card fill | — |
| `foam` | `#e6f5fb` | Primary text | ~15.5:1 ✅ AAA |
| `mist` | `#93a9c8` | Secondary / muted text, labels | ~7.3:1 ✅ AA |
| `signal` | `#48cae4` | Primary accent — links, ticks, active | ~9.8:1 ✅ AA |
| `ember` | `#ee9b00` | **Rare** warm accent — one or two moments only | ~8.1:1 ✅ AA |

Support values derived at build: `signal-deep` `#00b4d8` for larger fills, `line` = `signal` at ~10–14% alpha for grid/ticks/borders. Exact hexes get a final contrast pass with a checker in Phase 2.

## Typography — 3 faces, self-hosted (@fontsource)

| Role | Face | Why |
| --- | --- | --- |
| **Display** | **Instrument Serif** | Oversized, high-contrast editorial serif with real character — carries the "type is the personality" lesson (nithin/danielsun). Literally named *Instrument*: on-theme for an observatory. Used for the name + section titles at large sizes. |
| **Body** | **Geist Sans** | Modern technical grotesque, precise without being Inter-default. Reads as engineering rigor. |
| **Mono** | **Geist Mono** | Carries the instrument-readout motif — coordinate labels, section indices, year/discipline tags, eyebrows. Harmonizes with Geist Sans (same family DNA). |

The pairing = an elegant serif against a precise technical mono: "a researcher who is also a craftsman." Fluid type scale via `clamp()`, deliberate tracking (wide tracking on mono eyebrows, tight on the display).

## The ONE signature element — the star-chart coordinate system

Not a decorative background — a coherent system that frames every section and encodes the data-researcher identity. Three coordinated expressions:

1. **Faint coordinate grid** behind the page — CSS-only, very low opacity `line` color, fixed (doesn't scroll-jack). Reads as graph paper / a sky chart. Zero JS, zero perf cost.
2. **Instrument readouts** — every section eyebrow is a mono coordinate/index label: `§01 · ABOUT`, and a recurring `27.6194°N · 85.5388°E` (Kathmandu) mark. Project items use nithin's **year + discipline** as a readout: `2025 / Event platform`.
3. **Plotted marks** — small tick/crosshair marks at section corners and beside project rows. The **featured project is the single `ember` star** — the one warm point on the whole chart. This is the "credit-card motif" moment: one ownable recurring mark.

**Optional sub-feature (Phase 4, perf-gated):** a heavily-throttled 2D `<canvas>` point-cloud in the hero that settles scattered points into a constellation. Off on mobile + reduced-motion; **text is always the LCP, never the canvas.** Default is CSS-only; the canvas ships only if it costs no measurable Lighthouse points.

**WebGL / R3F: explicitly declined.** The CSS grid + labels + optional 2D canvas fully deliver the motif. WebGL would risk the §8 budget (Perf ≥95, JS <200KB) for no gain.

## Page wireframe

```
┌──────────────────────────────────────────────────────────┐
│  AADITYA SAPKOTA            about  work  writing  contact  │  nav: transparent → blur on scroll,
├──────────────────────────────────────────────────────────┤       active-section highlight, mobile drawer
│  §00 · 27.6194°N 85.5388°E                    ·           │
│                                                    ·      │  HERO
│   Aaditya Sapkota                            ·           │  · Instrument Serif name (LCP text)
│   data science & ML —                                    │  · mono role readout
│   building toward research                    ·          │  · faint grid + one ember star
│                                                          │  · one load sequence
│   [ résumé ]  github  linkedin  x  blog                  │
├──────────────────────────────────────────────────────────┤
│  §01 · WORK                                              │
│  ┌────────────────────────────────────┐  ★ ember        │  FEATURED PROJECT (large, asymmetric)
│  │ KUMUN — KU Model United Nations     │                 │  · year / discipline readout
│  │ 2025 / Event platform · kumun.ku…   │  → live         │  · honest team credit
│  └────────────────────────────────────┘                 │
│                                                          │
│  2025 / Studio site      Damek Studios         → live    │  PROJECT INDEX (compact rows,
│  2025 / Productivity     Dodolr                → live    │  not identical cards)
│  2025 / Web platform     Tinkune               → live    │  hover: crosshair + row lift
│  2024 / Booking          Jyotirvidhya      ⚠ flagged     │  (dead link — see DECISIONS)
│  2026 / Event site       Global Youth Hack  ◦ building   │
├──────────────────────────────────────────────────────────┤
│  §02 · ABOUT              §03 · SKILLS                    │  ABOUT + SKILLS (two-column on desktop)
│  3 short paragraphs,      Core · Data/ML ·                │  quiet typographic skill groups,
│  first person, real voice Web · Tools                     │  NO bars / rings / carousels
├──────────────────────────────────────────────────────────┤
│  §04 · WRITING                                           │  WRITING (typographic list, year-led)
│  2024  Differences                          →            │
│  2024  Don't miss anything!                 →            │
│  2022  My First Blog                        →            │
│                                       All posts →        │
├──────────────────────────────────────────────────────────┤
│  §05 · CONTACT                                           │  CONTACT (no form/newsletter/map)
│  sayhi.aaditya@gmail.com  [copy]                         │  mailto + copy-to-clipboard + links
│  github · linkedin · x · blog                            │
├──────────────────────────────────────────────────────────┤
│  Kathmandu · 27.6194°N 85.5388°E      © 2026 Aaditya     │  FOOTER
└──────────────────────────────────────────────────────────┘
```

## Motion rules

- **One** orchestrated hero load: name fades/settles, grid ticks draw in, ember star appears last. Under ~800ms total.
- Scroll reveals: opacity + 8–16px translate, **once**, no bounce, <400ms.
- Hover: project rows show a crosshair mark + subtle lift; links underline from the `signal` tick.
- `prefers-reduced-motion`: everything off. Site is fully usable and good-looking static — grid and marks are CSS, so the identity survives with zero animation.

## Self-critique — "what would the generic version look like, and how is mine different?"

The generic dark-navy data portfolio: Inter everywhere, a purple→blue gradient blob, a typing animation cycling job titles, three identical project cards, skill progress bars, a fake contact form. **Mine rejects each:** an oversized *Instrument Serif* display instead of Inter; a coherent **star-chart coordinate system** as the one motif instead of decorative gradient blobs; **year + discipline instrument-readout rows** instead of identical cards; quiet typographic skill groups instead of bars; a real mailto+copy instead of a fake form; **text as LCP** and CSS-first instead of a heavy canvas hero.

The honest risk: a faint coordinate grid can read as generic graph paper if done lazily. Mitigation — the labels are *real* (Kathmandu's actual coordinates, section indices) and the marks are *meaningful* (the featured project is the single ember star on the chart). If the grid ever feels like texture rather than an instrument, cut it and keep only the labels + marks.
