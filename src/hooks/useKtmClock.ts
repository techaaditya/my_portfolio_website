import { useEffect, useState } from 'react';

/**
 * Live Kathmandu (NPT, UTC+5:45) clock. `ms: true` updates every animation
 * frame with a milliseconds field for the telemetry panel; otherwise ticks
 * once per second. Values are real — computed from the actual clock.
 */
export function useKtmClock(ms = false): string {
  const [value, setValue] = useState(() => format(ms));

  useEffect(() => {
    if (ms) {
      let raf = 0;
      const loop = () => {
        setValue(format(true));
        raf = requestAnimationFrame(loop);
      };
      // milliseconds display pauses when the tab is hidden (rAF stops) — fine
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
    const id = window.setInterval(() => setValue(format(false)), 1000);
    return () => window.clearInterval(id);
  }, [ms]);

  return value;
}

function format(ms: boolean): string {
  const now = new Date();
  // NPT is a fixed UTC+5:45 offset (no DST) — derive from UTC directly
  const npt = new Date(now.getTime() + (345 + now.getTimezoneOffset()) * 60000);
  const hh = String(npt.getHours()).padStart(2, '0');
  const mm = String(npt.getMinutes()).padStart(2, '0');
  const ss = String(npt.getSeconds()).padStart(2, '0');
  if (!ms) return `${hh}:${mm}:${ss}`;
  const mmm = String(now.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${mmm}`;
}
