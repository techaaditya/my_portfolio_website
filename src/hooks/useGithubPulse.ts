import { useEffect, useState } from 'react';

/**
 * Real GitHub activity for the telemetry panel — no mocked meters. Fetches
 * the user's public events (unauthenticated, 60 req/h per visitor IP is
 * plenty), buckets push-event commits by day for a 14-day sparkline, and
 * caches in sessionStorage. If the API is unreachable/rate-limited the panel
 * reports LINK DOWN honestly instead of inventing numbers.
 */

export interface Pulse {
  days: number[]; // commits/day, oldest → newest (14 entries)
  total: number;
  status: 'live' | 'cached' | 'down' | 'loading';
}

const CACHE_KEY = 'as-gh-pulse';
const CACHE_MS = 30 * 60 * 1000;

export function useGithubPulse(user: string): Pulse {
  const [pulse, setPulse] = useState<Pulse>({ days: Array(14).fill(0), total: 0, status: 'loading' });

  useEffect(() => {
    let alive = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { at, days, total } = JSON.parse(cached) as { at: number; days: number[]; total: number };
        if (Date.now() - at < CACHE_MS) {
          setPulse({ days, total, status: 'cached' });
          return;
        }
      } catch {
        /* fall through to fetch */
      }
    }

    fetch(`https://api.github.com/users/${user}/events/public?per_page=100`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((events: Array<{ type: string; created_at: string; payload?: { commits?: unknown[] } }>) => {
        if (!alive) return;
        const days = Array<number>(14).fill(0);
        let total = 0;
        const now = Date.now();
        for (const ev of events) {
          if (ev.type !== 'PushEvent') continue;
          const age = Math.floor((now - new Date(ev.created_at).getTime()) / 86400000);
          const n = ev.payload?.commits?.length ?? 0;
          total += n;
          if (age >= 0 && age < 14) days[13 - age] += n;
        }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), days, total }));
        setPulse({ days, total, status: 'live' });
      })
      .catch(() => {
        if (alive) setPulse((p) => ({ ...p, status: 'down' }));
      });

    return () => {
      alive = false;
    };
  }, [user]);

  return pulse;
}
