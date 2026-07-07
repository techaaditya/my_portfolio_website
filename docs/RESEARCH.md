# Reference Research

Notes taken by fetching each site during Phase 0. One line per site: the single transferable idea worth stealing. Curation over accumulation — we adopt at most 2–3 of these, not all of them.

## Developer / data-focused (closest to Aaditya)

- **itsvg.in (Vishwa Gaurav)** — The signature move: work experience rendered as draggable/scrollable *credit-card* tiles with chip graphics. Lesson: one ownable recurring motif that *encodes identity* beats ten generic sections. This is the pattern to emulate structurally (not the visa-card visual) — our equivalent should encode "data researcher," not "developer."
- **aayushbharti.in (Aayush Bharti)** — Frames performance/accessibility/SEO as *user-facing features*, not backend checkboxes ("Core Web Vitals red→green overnight"). Purposeful micro-animations that reward fast loads. Lesson: the polish *is* the portfolio; motion must feel designed, not decorative.
- **kartavya-singh.com** — (JS-rendered SPA; minimal static HTML returned.) Skipped for detailed notes.
- **pulkitgpt.tech (Pulkit)** — End-to-end ownership framing: each project shows the full arc from problem → build → deployed solution. Lesson: describe *what it does + my role*, not a tech-stack dump.
- **roshan-sahu.com** — Progressive disclosure: projects scan fast as a grid, each with an `[Open]` affordance that reveals depth only on interaction. Lesson: keep the index compact; depth is opt-in.
- **akshaysanthoshkumar.vercel.app** — (403 / bot-blocked; not fetched.)

## Editorial / design polish (for typography & motion, not layout copying)

- **nithinmwarrier.com (Awwwards winner)** — Consistent **year-first categorical labeling**: "2026 / Product design | Visual branding". Immediate scanability + visual rhythm. Deliberate micro-interactions over a minimalist base. **This is the project-item treatment we adopt** (year + discipline instead of generic cards).
- **danielsun.space** — Large confident sans headlines + conversational, lightly self-deprecating copy ("I don't have dark secrets, only bright ones"). Intersperses personal narrative between work to keep rhythm. Lesson: voice carries personality; write plainly and specifically.
- **mauriciojuba.com** — Token-first architecture as governance: semantic + core tokens with a JSON→CSS pipeline. Lesson (for us): commit to a small named token system in Tailwind `@theme` and derive everything from it — restraint via constraints.
- **noth.in (Nothin' Studio)** — Perspective-driven hierarchy: content flows from one central concept outward rather than a conventional grid. Lesson: anchor the whole site to ONE idea (our observatory/data-instrument concept) and let sections express it.

## Signature-element candidates evaluated (decision deferred to Phase 1)

Distilling the above for a *data-researcher* identity, three motifs are on the table:
1. **Observatory / instrument motif** — coordinate ticks, faint star-chart or contour grid framing sections; year+discipline labels styled as instrument readouts. (Leading candidate — encodes "signal, cartography, measurement" from the brief.)
2. **Terminal / notebook motif** — Jupyter-ish hero block. Risk: cliché unless genuinely crafted.
3. **2D point-cloud / contour hero canvas** — dataset resolving into signal; heavily throttled, off on mobile + reduced-motion, text is always the LCP.

**Adopted regardless of which motif wins:** nithin's year+discipline project labels; danielsun's plain-spoken voice; aayushbharti's "polish as feature" engineering discipline; itsvg's "one ownable motif" philosophy.
