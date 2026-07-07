# Baseline Audit — Original Site

Lighthouse 12, mobile / simulated Fast 4G, run against the live production URL **https://www.aadityasapkota.com.np/** on 2026-07-07 (Phase 0, before rebuild). This is the "before" we must beat.

## Category scores (mobile)

| Category | Baseline | Target (§8) |
| --- | --- | --- |
| Performance | **62** | ≥ 95 |
| Accessibility | **78** | 100 |
| Best Practices | **96** | 100 |
| SEO | **83** | 100 |

## Core metrics

| Metric | Baseline | Target |
| --- | --- | --- |
| First Contentful Paint | 2.0 s | — |
| Largest Contentful Paint | **5.1 s** | < 2.0 s |
| Cumulative Layout Shift | **0.339** | ≈ 0 |
| Total Blocking Time | 0 ms | low |
| Speed Index | 3.3 s | — |
| Time to Interactive | 5.1 s | — |

## Root causes flagged by Lighthouse (all fixed by the rebuild)

**Performance (62)**
- LCP 5.1s — the hero `<img>` (`me_2.jpg`, 236KB unoptimized) is the LCP element and is discovered late. Rebuild makes **text the LCP**, ships AVIF/WebP with explicit dimensions.
- CLS 0.339 — images without width/height + late-loading web font/icons shift layout. Rebuild sets explicit dimensions and self-hosts fonts (no layout shift).
- Render-blocking CDN resources: Boxicons CSS (unpkg), typed.js (unpkg), Google Fonts. Rebuild self-hosts fonts (@fontsource), uses lucide-react (no icon-font CDN), and has a real build step.

**Accessibility (78)**
- Insufficient background/foreground contrast (navy/purple accents fail WCAG AA). Rebuild uses a contrast-checked Ocean-Blue token system.
- `<iframe>` (Google Maps embed) has no title. Rebuild **removes the map entirely**.
- Heading order not sequentially descending; multiple structural issues. Rebuild uses semantic HTML with one `h1` and correct landmark order.
- Links without discernible name / descriptive text (icon-only social links, "Read More", "View on GitHub"). Rebuild adds `aria-label`s and descriptive link text.

**SEO (83)**
- No meta description. Rebuild adds meta description, OG tags, JSON-LD `Person`, sitemap, robots.txt.
- Non-descriptive link text. Fixed as above.

**Best Practices (96)**
- Browser console errors logged. Rebuild ships zero console errors (§8 requirement).

## Other issues (not scored but noted in PORTFOLIO_REBUILD_PROMPT.md §3)

- 6 fabricated project cards linking to nonexistent repos.
- ~45 inflated skills.
- Resume served as a 1.19 MB JPG.
- Fake contact form + newsletter (no backend).
- ~2.3 MB of unoptimized photos total.

_Raw report saved during the run; not committed (large). Re-runnable via `npx lighthouse@12 <url> --form-factor=mobile`._
