/**
 * Slow-drifting aurora color washes behind the particle field. Pure CSS
 * radial gradients (no blur filters — the gradients are already soft), three
 * layers moving on long offset keyframe loops so the sky never sits still.
 * A vignette keeps edges deep so text always reads.
 */
export function AuroraBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-[30%] -left-[20%] h-[85vmax] w-[85vmax] animate-drift-a rounded-full opacity-45"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in oklab, var(--color-signal-deep) 42%, transparent) 0%, transparent 62%)',
        }}
      />
      <div
        className="absolute -right-[25%] top-[25%] h-[75vmax] w-[75vmax] animate-drift-b rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in oklab, var(--color-cyan) 30%, transparent) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute -bottom-[35%] left-[10%] h-[80vmax] w-[80vmax] animate-drift-c rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle at center, color-mix(in oklab, var(--color-magenta) 26%, transparent) 0%, transparent 58%)',
        }}
      />
      {/* vignette — keeps the corners deep space so type always reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 110% 90% at 50% 40%, transparent 45%, color-mix(in oklab, var(--color-space) 85%, transparent) 100%)',
        }}
      />
    </div>
  );
}
