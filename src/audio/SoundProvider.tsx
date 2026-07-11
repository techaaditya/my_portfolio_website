import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as engine from './engine';

/**
 * Global sound state. OFF by default (Aaditya's confirmed choice) — the site
 * is silent until the visitor flips the HUD toggle; the choice persists in
 * localStorage. All play helpers are no-ops while disabled or under
 * prefers-reduced-motion, so call sites never need to check.
 */

const KEY = 'as-sound';

interface SoundApi {
  enabled: boolean;
  toggle: () => void;
  click: () => void;
  tick: () => void;
  sweep: () => void;
  confirm: () => void;
}

const SoundCtx = createContext<SoundApi>({
  enabled: false,
  toggle: () => {},
  click: () => {},
  tick: () => {},
  sweep: () => {},
  confirm: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const humStop = useRef<(() => void) | null>(null);

  // restore persisted preference (still requires a gesture before any sound —
  // the AudioContext resumes on the first play call after user interaction)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (localStorage.getItem(KEY) === 'on') setEnabled(true);
  }, []);

  // ambient hum follows the enabled state
  useEffect(() => {
    if (enabled) {
      humStop.current = engine.hum();
    } else {
      humStop.current?.();
      humStop.current = null;
    }
    return () => {
      humStop.current?.();
      humStop.current = null;
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      localStorage.setItem(KEY, next ? 'on' : 'off');
      if (next) engine.confirm();
      return next;
    });
  }, []);

  const guard = useCallback(
    (fn: () => void) => () => {
      if (enabled) fn();
    },
    [enabled],
  );

  return (
    <SoundCtx.Provider
      value={{
        enabled,
        toggle,
        click: guard(engine.click),
        tick: guard(engine.tick),
        sweep: guard(engine.sweep),
        confirm: guard(engine.confirm),
      }}
    >
      {children}
    </SoundCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSound(): SoundApi {
  return useContext(SoundCtx);
}
