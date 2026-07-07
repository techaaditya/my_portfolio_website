/**
 * Shared "first interaction" gate. Ambient animation (particle sim, aurora
 * drift, marquees) holds until the visitor first moves, scrolls, touches, or
 * types — so none of it competes with load, LCP, or Speed Index, and the
 * page "wakes up" the moment a human arrives. Fires at most once.
 */
const EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'] as const;

let fired = false;
let listening = false;
const callbacks: Array<() => void> = [];

function fire() {
  if (fired) return;
  fired = true;
  for (const ev of EVENTS) window.removeEventListener(ev, fire);
  callbacks.splice(0).forEach((cb) => cb());
}

/** Runs `cb` on the first user interaction (immediately if it already happened). */
export function onFirstInteraction(cb: () => void): () => void {
  if (fired) {
    cb();
    return () => {};
  }
  callbacks.push(cb);
  if (!listening) {
    listening = true;
    for (const ev of EVENTS) window.addEventListener(ev, fire, { passive: true });
  }
  return () => {
    const i = callbacks.indexOf(cb);
    if (i >= 0) callbacks.splice(i, 1);
  };
}
