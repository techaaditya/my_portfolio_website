import { useEffect, useRef } from 'react';
import { onFirstInteraction } from '@/lib/interaction';

/**
 * The signature element: a live particle constellation rendered with raw
 * WebGL (no three.js — the whole thing is ~4 KB). Thousands of aurora-tinted
 * points drift and twinkle behind the page, scatter away from the cursor and
 * spring home, parallax with scroll, and the brightest "major" stars draw
 * constellation lines between themselves and toward the cursor.
 *
 * Nothing — not even context creation or shader compilation — happens until
 * the visitor's first interaction, so the field costs zero main-thread time
 * during load; the sky then fades in over a second. Honest fallbacks:
 * prefers-reduced-motion gets a single static frame (no loop, no pointer
 * forces); touch devices skip pointer forces; the loop pauses when hidden.
 */

const POINT_VERT = `
attribute vec2 aPos;
attribute float aSize;
attribute vec4 aColor;
uniform vec2 uRes;
varying vec4 vColor;
void main() {
  vec2 c = aPos / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = aSize;
  vColor = aColor;
}`;

const POINT_FRAG = `
precision mediump float;
varying vec4 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float m = smoothstep(0.5, 0.04, d);
  gl_FragColor = vec4(vColor.rgb * vColor.a * m, 1.0);
}`;

const LINE_VERT = `
attribute vec2 aPos;
attribute float aAlpha;
uniform vec2 uRes;
varying float vA;
void main() {
  vec2 c = aPos / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  vA = aAlpha;
}`;

const LINE_FRAG = `
precision mediump float;
uniform vec3 uColor;
varying float vA;
void main() {
  gl_FragColor = vec4(uColor * vA, 1.0);
}`;

// aurora palette (linear-ish RGB), weighted toward violet
const PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [0.65, 0.55, 0.98], // violet
  [0.65, 0.55, 0.98],
  [0.13, 0.83, 0.93], // cyan
  [0.91, 0.47, 0.98], // magenta
  [0.85, 0.85, 1.0], // starlight
];

const SPRING = 0.012;
const DAMP = 0.9;
const POINTER_RADIUS = 170;
const POINTER_FORCE = 65;
const LINK_DIST = 130;
const POINTER_LINK_DIST = 210;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function program(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram | null {
  const v = compile(gl, gl.VERTEX_SHADER, vert);
  const f = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let cleanup: (() => void) | null = null;

    // Everything below runs on the first interaction, never during load.
    const disarm = onFirstInteraction(() => {
      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      });
      if (!gl) return; // no WebGL — the aurora CSS background still carries the design

      const pointProg = program(gl, POINT_VERT, POINT_FRAG);
      const lineProg = program(gl, LINE_VERT, LINE_FRAG);
      if (!pointProg || !lineProg) return;

      const pAttrs = {
        pos: gl.getAttribLocation(pointProg, 'aPos'),
        size: gl.getAttribLocation(pointProg, 'aSize'),
        color: gl.getAttribLocation(pointProg, 'aColor'),
        res: gl.getUniformLocation(pointProg, 'uRes'),
      };
      const lAttrs = {
        pos: gl.getAttribLocation(lineProg, 'aPos'),
        alpha: gl.getAttribLocation(lineProg, 'aAlpha'),
        res: gl.getUniformLocation(lineProg, 'uRes'),
        color: gl.getUniformLocation(lineProg, 'uColor'),
      };

      const pointBuf = gl.createBuffer();
      const lineBuf = gl.createBuffer();

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE); // additive — overlapping points glow
      gl.clearColor(0, 0, 0, 0);

      // ── field state ────────────────────────────────────────────────────
      let dpr = 1;
      let W = 0;
      let H = 0;
      let N = 0;
      let NM = 0; // "major" stars that form constellation lines
      let px!: Float32Array, py!: Float32Array, vx!: Float32Array, vy!: Float32Array;
      let hx!: Float32Array, hy!: Float32Array;
      let phase!: Float32Array, driftSp!: Float32Array, driftAmp!: Float32Array, baseA!: Float32Array;
      let pointData!: Float32Array; // interleaved [x, y, size, r, g, b, a]
      let lineData!: Float32Array;

      let pointerX = -9999;
      let pointerY = -9999;
      let pointerOn = false;
      let raf = 0;
      let running = false;
      let contextLost = false;

      function regenerate() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        W = Math.floor(window.innerWidth * dpr);
        H = Math.floor(window.innerHeight * dpr);
        canvas!.width = W;
        canvas!.height = H;
        gl!.viewport(0, 0, W, H);

        N = Math.max(700, Math.min(5500, Math.floor((window.innerWidth * window.innerHeight) / 280)));
        NM = Math.min(72, Math.floor(N / 20));

        px = new Float32Array(N);
        py = new Float32Array(N);
        vx = new Float32Array(N);
        vy = new Float32Array(N);
        hx = new Float32Array(N);
        hy = new Float32Array(N);
        phase = new Float32Array(N);
        driftSp = new Float32Array(N);
        driftAmp = new Float32Array(N);
        baseA = new Float32Array(N);
        pointData = new Float32Array(N * 7);
        lineData = new Float32Array((NM * NM + NM) * 2 * 3);

        for (let i = 0; i < N; i++) {
          const major = i < NM;
          hx[i] = Math.random() * W;
          hy[i] = Math.random() * H;
          px[i] = hx[i];
          py[i] = hy[i];
          phase[i] = Math.random() * Math.PI * 2;
          driftSp[i] = 0.15 + Math.random() * 0.45;
          driftAmp[i] = (5 + Math.random() * 12) * dpr;
          baseA[i] = major ? 0.75 + Math.random() * 0.25 : 0.18 + Math.random() * 0.5;

          const c = PALETTE[major ? 4 : Math.floor(Math.random() * PALETTE.length)];
          const size = (major ? 2.4 + Math.random() * 1.6 : 0.9 + Math.random() * 1.8) * dpr;
          const o = i * 7;
          pointData[o + 2] = size;
          pointData[o + 3] = c[0];
          pointData[o + 4] = c[1];
          pointData[o + 5] = c[2];
        }

        gl!.bindBuffer(gl!.ARRAY_BUFFER, pointBuf);
        gl!.bufferData(gl!.ARRAY_BUFFER, pointData, gl!.DYNAMIC_DRAW);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
        gl!.bufferData(gl!.ARRAY_BUFFER, lineData, gl!.DYNAMIC_DRAW);
      }

      function step(t: number) {
        const oy = (((window.scrollY * 0.15 * dpr) % H) + H) % H;
        const R = POINTER_RADIUS * dpr;
        const R2 = R * R;

        for (let i = 0; i < N; i++) {
          // wrapped home position — the field recycles vertically as you scroll
          let wy = hy[i] - oy;
          wy = ((wy % H) + H) % H;
          const tx = hx[i] + Math.sin(t * driftSp[i] + phase[i]) * driftAmp[i];

          // snap across the wrap seam instead of streaking across the screen
          if (Math.abs(py[i] - wy) > H * 0.5) {
            py[i] = wy;
            vy[i] = 0;
          }

          vx[i] += (tx - px[i]) * SPRING;
          vy[i] += (wy - py[i]) * SPRING;

          if (pointerOn) {
            const dx = px[i] - pointerX;
            const dy = py[i] - pointerY;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((1 - d / R) * POINTER_FORCE * dpr) / (d * 10);
              vx[i] += dx * f;
              vy[i] += dy * f;
            }
          }

          vx[i] *= DAMP;
          vy[i] *= DAMP;
          px[i] += vx[i];
          py[i] += vy[i];

          const o = i * 7;
          pointData[o] = px[i];
          pointData[o + 1] = py[i];
          pointData[o + 6] =
            baseA[i] * (0.55 + 0.45 * Math.sin(t * (0.4 + driftSp[i]) + phase[i] * 1.7));
        }
      }

      function buildLines(): number {
        // scale link reach to the viewport so small screens don't turn into a web
        const L = Math.min(LINK_DIST, window.innerWidth * 0.22) * dpr;
        const PL = POINTER_LINK_DIST * dpr;
        let n = 0;

        for (let i = 0; i < NM; i++) {
          for (let j = i + 1; j < NM; j++) {
            const dx = px[i] - px[j];
            const dy = py[i] - py[j];
            const d2 = dx * dx + dy * dy;
            if (d2 < L * L) {
              const a = (1 - Math.sqrt(d2) / L) * 0.32;
              lineData[n++] = px[i];
              lineData[n++] = py[i];
              lineData[n++] = a;
              lineData[n++] = px[j];
              lineData[n++] = py[j];
              lineData[n++] = a;
            }
          }
          if (pointerOn) {
            const dx = px[i] - pointerX;
            const dy = py[i] - pointerY;
            const d2 = dx * dx + dy * dy;
            if (d2 < PL * PL) {
              const a = (1 - Math.sqrt(d2) / PL) * 0.42;
              lineData[n++] = px[i];
              lineData[n++] = py[i];
              lineData[n++] = a;
              lineData[n++] = pointerX;
              lineData[n++] = pointerY;
              lineData[n++] = a;
            }
          }
        }
        return n / 3;
      }

      function draw() {
        gl!.clear(gl!.COLOR_BUFFER_BIT);

        const lineVerts = buildLines();
        if (lineVerts > 0) {
          gl!.useProgram(lineProg);
          gl!.uniform2f(lAttrs.res, W, H);
          gl!.uniform3f(lAttrs.color!, 0.55, 0.55, 0.95);
          gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
          gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, lineData.subarray(0, lineVerts * 3));
          gl!.enableVertexAttribArray(lAttrs.pos);
          gl!.vertexAttribPointer(lAttrs.pos, 2, gl!.FLOAT, false, 12, 0);
          gl!.enableVertexAttribArray(lAttrs.alpha);
          gl!.vertexAttribPointer(lAttrs.alpha, 1, gl!.FLOAT, false, 12, 8);
          gl!.drawArrays(gl!.LINES, 0, lineVerts);
        }

        gl!.useProgram(pointProg);
        gl!.uniform2f(pAttrs.res, W, H);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, pointBuf);
        gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, pointData);
        gl!.enableVertexAttribArray(pAttrs.pos);
        gl!.vertexAttribPointer(pAttrs.pos, 2, gl!.FLOAT, false, 28, 0);
        gl!.enableVertexAttribArray(pAttrs.size);
        gl!.vertexAttribPointer(pAttrs.size, 1, gl!.FLOAT, false, 28, 8);
        gl!.enableVertexAttribArray(pAttrs.color);
        gl!.vertexAttribPointer(pAttrs.color, 4, gl!.FLOAT, false, 28, 12);
        gl!.drawArrays(gl!.POINTS, 0, N);
      }

      function loop(now: number) {
        if (!running || contextLost) return;
        step(now * 0.001);
        draw();
        raf = requestAnimationFrame(loop);
      }

      function start() {
        if (running || reduced || contextLost) return;
        running = true;
        raf = requestAnimationFrame(loop);
      }
      function stop() {
        running = false;
        cancelAnimationFrame(raf);
      }

      // ── events ─────────────────────────────────────────────────────────
      const onPointerMove = (e: PointerEvent) => {
        pointerX = e.clientX * dpr;
        pointerY = e.clientY * dpr;
        pointerOn = true;
      };
      const onPointerLeave = () => {
        pointerOn = false;
      };
      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };
      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          regenerate();
          if (!running) {
            step(1);
            draw();
          }
        }, 150);
      };
      const onContextLost = (e: Event) => {
        e.preventDefault();
        contextLost = true;
        stop();
      };
      const onContextRestored = () => {
        contextLost = false;
        regenerate();
        if (reduced) {
          step(1);
          draw();
        } else {
          start();
        }
      };

      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);
      window.addEventListener('resize', onResize);

      regenerate();
      step(1);
      draw();
      canvas.style.opacity = '1'; // fade the sky in (CSS transition on the element)

      if (!reduced) {
        if (finePointer) {
          window.addEventListener('pointermove', onPointerMove, { passive: true });
          document.documentElement.addEventListener('pointerleave', onPointerLeave);
        }
        document.addEventListener('visibilitychange', onVisibility);
        start();
      }

      cleanup = () => {
        stop();
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibility);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
      };
    });

    return () => {
      disarm();
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-1000"
    />
  );
}
