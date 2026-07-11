/**
 * Point-cloud shaders. Stateless force model: displacement is computed from
 * the home position each frame (drift + pointer force with smoothstep
 * falloff), so points always cohere back to the dataset with zero CPU
 * per-point work — the entire simulation lives on the GPU.
 */

export const POINTCLOUD_VERT = /* glsl */ `
attribute vec3 aSeed;   // per-point randoms [0,1)
attribute float aSize;
attribute float aKind;  // 0 = cyan core, 1 = ice, 2 = amber outlier

uniform float uTime;
uniform vec3 uPointer;     // pointer projected onto the cloud plane (world)
uniform float uForce;      // >0 scatter, <0 attract, eased on CPU
uniform float uReveal;     // 0→1 boot entrance
uniform float uFade;       // 1→0 as the hero scrolls away
uniform float uPixelRatio;

varying float vKind;
varying float vAlpha;

void main() {
  vKind = aKind;

  // organic drift — cheap trig field, unique phase per point
  float t = uTime * (0.14 + aSeed.x * 0.22);
  vec3 p = position + vec3(
    sin(t + aSeed.y * 17.0),
    cos(t * 0.9 + aSeed.z * 23.0),
    sin(t * 0.7 + aSeed.x * 31.0)
  ) * (0.10 + aSeed.z * 0.22);

  // pointer force field
  vec3 d = p - uPointer;
  float dist = length(d);
  float fall = smoothstep(2.4, 0.0, dist);
  p += (d / max(dist, 0.0001)) * fall * uForce;

  // boot entrance: points converge from a scattered shell
  p = mix(p * (2.6 + aSeed.y * 2.0), p, uReveal);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (10.0 / -mv.z);

  float twinkle = 0.62 + 0.38 * sin(uTime * (0.6 + aSeed.x) + aSeed.y * 40.0);
  vAlpha = twinkle * uFade * uReveal;
}
`;

export const POINTCLOUD_FRAG = /* glsl */ `
precision mediump float;

uniform vec3 uColorCyan;
uniform vec3 uColorIce;
uniform vec3 uColorAmber;

varying float vKind;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float m = smoothstep(0.5, 0.05, d);
  vec3 col = vKind < 0.5 ? uColorCyan : (vKind < 1.5 ? uColorIce : uColorAmber);
  // premultiplied: alpha == brightness. The canvas overlays the DOM, so the
  // sprite composites as light (near-screen blend) and never paints black.
  float a = vAlpha * m;
  gl_FragColor = vec4(col * a, a);
}
`;
