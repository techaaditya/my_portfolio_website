/**
 * The full-page telemetry grid: fine 1px cells with stronger major divisions
 * (CSS-only, zero JS — see .telemetry-grid in index.css) plus corner axis
 * annotations. Fixed behind all content.
 */
export function GridLines() {
  return (
    <div className="telemetry-grid pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <span className="readout absolute left-3 top-1/2 -rotate-90 text-[0.58rem] opacity-50">
        27.6194°N
      </span>
      <span className="readout absolute right-3 top-1/2 rotate-90 text-[0.58rem] opacity-50">
        85.5388°E
      </span>
    </div>
  );
}
