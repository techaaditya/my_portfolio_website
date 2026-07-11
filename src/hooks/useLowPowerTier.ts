/**
 * Device capability tier, decided once at module load (these signals don't
 * change mid-session). Low-power devices get: point count ÷4, no FluidTrail,
 * static work previews, vertical journey.
 */
export function isLowPower(): boolean {
  if (typeof window === 'undefined') return true;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 820;
  const weakCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  return coarse || small || weakCpu;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
