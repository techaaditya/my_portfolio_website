/**
 * Liquid preview shaders: the hovered project's capture, warped by a
 * traveling wave + pointer-velocity ripple, with chromatic RGB separation at
 * the displacement peaks. uHover eases 0→1 on row enter.
 */

export const LIQUID_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const LIQUID_FRAG = /* glsl */ `
precision mediump float;

uniform sampler2D uMap;
uniform float uTime;
uniform float uHover;    // 0→1 ease on row enter
uniform vec2 uVelocity;  // pointer velocity, decayed on CPU

varying vec2 vUv;

void main() {
  // traveling liquid wave, amplitude driven by hover + pointer velocity
  float amp = uHover * (0.012 + min(0.05, length(uVelocity) * 0.35));
  vec2 uv = vUv;
  uv.x += sin(uv.y * 12.0 + uTime * 2.4) * amp;
  uv.y += cos(uv.x * 10.0 - uTime * 1.8) * amp * 0.7;

  // chromatic separation scaled by local displacement
  vec2 shift = vec2(amp * 0.9, 0.0);
  float r = texture2D(uMap, uv + shift).r;
  float g = texture2D(uMap, uv).g;
  float b = texture2D(uMap, uv - shift).b;

  // slight vignette to seat the capture in the HUD frame
  float vig = smoothstep(0.95, 0.55, distance(vUv, vec2(0.5)));
  gl_FragColor = vec4(vec3(r, g, b) * (0.72 + 0.28 * vig), uHover);
}
`;
