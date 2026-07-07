/**
 * The fixed star-chart backdrop: the CSS coordinate grid plus a few faint
 * plotted points. Pure CSS/SVG, zero JS cost, sits behind all content.
 * Fully present under prefers-reduced-motion (it never animates).
 */
export function StarChart() {
  return (
    <>
      <div className="star-grid" aria-hidden="true" />
      <svg
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* a scatter of faint plotted stars — the "dataset" behind the page */}
        {PLOTS.map(([x, y, r, warm], i) => (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r={r}
            className={warm ? 'fill-ember' : 'fill-signal'}
            opacity={warm ? 0.5 : 0.28}
          />
        ))}
      </svg>
    </>
  );
}

// [x%, y%, radius, isEmber] — one ember star, the rest cyan signal.
const PLOTS: Array<[number, number, number, boolean]> = [
  [12, 18, 1.5, false],
  [82, 12, 1.5, false],
  [68, 28, 1, false],
  [24, 42, 1, false],
  [90, 46, 1.5, false],
  [8, 66, 1, false],
  [78, 72, 1.5, true],
  [40, 82, 1, false],
  [58, 60, 1, false],
];
