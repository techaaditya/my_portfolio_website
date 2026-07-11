/**
 * Synthesized UI sound engine — no audio files, no howler. Every effect is
 * built from oscillators/filtered noise at call time (~sample-accurate, zero
 * network weight). The AudioContext is created lazily on the first *enabled*
 * play call, which by definition happens after a user gesture (the sound
 * toggle), so autoplay policy is never violated.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function env(c: AudioContext, peak: number, attack: number, decay: number): GainNode {
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(master!);
  return g;
}

/** Short mechanical key click — filtered noise burst + tiny square blip. */
export function click(): void {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;

  const noise = c.createBufferSource();
  const len = Math.floor(c.sampleRate * 0.03);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  noise.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2600;
  bp.Q.value = 1.2;
  noise.connect(bp).connect(env(c, 0.22, 0.001, 0.04));
  noise.start(t);

  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1900, t);
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.02);
  osc.connect(env(c, 0.05, 0.001, 0.025));
  osc.start(t);
  osc.stop(t + 0.05);
}

/** Softer hover/scramble tick. */
export function tick(): void {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(3200, t);
  osc.frequency.exponentialRampToValueAtTime(1400, t + 0.015);
  osc.connect(env(c, 0.06, 0.001, 0.03));
  osc.start(t);
  osc.stop(t + 0.05);
}

/** Section-transition / boot-complete sweep: filtered saw glide + sub swell. */
export function sweep(): void {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;

  const saw = c.createOscillator();
  saw.type = 'sawtooth';
  saw.frequency.setValueAtTime(180, t);
  saw.frequency.exponentialRampToValueAtTime(720, t + 0.5);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(400, t);
  lp.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
  saw.connect(lp).connect(env(c, 0.1, 0.05, 0.7));
  saw.start(t);
  saw.stop(t + 0.9);

  const sub = c.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(38, t);
  sub.frequency.exponentialRampToValueAtTime(52, t + 0.6);
  sub.connect(env(c, 0.25, 0.08, 0.8));
  sub.start(t);
  sub.stop(t + 1.0);
}

/** Confirmation blip (terminal enter). */
export function confirm(): void {
  const c = ensure();
  if (!c) return;
  const t = c.currentTime;
  [520, 780].forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const g = env(c, 0.12, 0.005, 0.14);
    osc.connect(g);
    osc.start(t + i * 0.07);
    osc.stop(t + i * 0.07 + 0.2);
  });
}

/** Ambient machine hum — loops until the returned stop() is called. */
export function hum(): () => void {
  const c = ensure();
  if (!c) return () => {};
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 55;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.13;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 4;
  lfo.connect(lfoGain).connect(osc.frequency);
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.028, c.currentTime + 1.2);
  osc.connect(g).connect(master!);
  osc.start();
  lfo.start();
  return () => {
    g.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.6);
    osc.stop(c.currentTime + 0.8);
    lfo.stop(c.currentTime + 0.8);
  };
}
