import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Liquid cursor trail: a ¼-resolution ping-pong buffer. Each frame samples
 * the previous field slightly upstream of the stored velocity (cheap
 * advection), decays it, and splats a new impulse at the pointer. The result
 * composites as a cyan liquid smear that follows the cursor — doubling as
 * the site's custom cursor glow. Desktop fine-pointer only (GLRoot gates it).
 */

const SIM_FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uPrev;
uniform vec2 uPointer;      // uv
uniform vec2 uVelocity;     // uv/frame
uniform float uAspect;
varying vec2 vUv;

// stored velocity is packed rg in [0,1] -> [-1,1]
vec2 storedVel(vec4 p) { return p.rg * 2.0 - 1.0; }

void main() {
  // advect: pull the field from upstream of its own stored velocity
  vec4 here = texture2D(uPrev, vUv);
  vec4 prev = texture2D(uPrev, vUv - storedVel(here) * 0.012);
  prev *= 0.955; // decay

  // splat
  vec2 d = vUv - uPointer;
  d.x *= uAspect;
  float splat = exp(-dot(d, d) * 220.0);
  vec2 vel = clamp(uVelocity * 40.0, -1.0, 1.0);
  prev.rg = mix(prev.rg, vel * 0.5 + 0.5, splat);
  prev.b = min(1.0, prev.b + splat * min(1.0, length(uVelocity) * 60.0));

  gl_FragColor = prev;
}`;

const DRAW_FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uField;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  // premultiplied light: alpha == brightness (see pointcloud.frag note)
  float d = texture2D(uField, vUv).b * 0.55;
  gl_FragColor = vec4(uColor * d, d);
}
`;

const QUAD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export function FluidTrail() {
  const { gl, size } = useThree();

  const state = useMemo(() => {
    const w = Math.max(64, Math.floor(size.width / 4));
    const h = Math.max(64, Math.floor(size.height / 4));
    const opts: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
      depthBuffer: false,
    };
    const a = new THREE.WebGLRenderTarget(w, h, opts);
    const b = new THREE.WebGLRenderTarget(w, h, opts);

    const simScene = new THREE.Scene();
    const simMat = new THREE.ShaderMaterial({
      blending: THREE.NoBlending, // sim pass writes the field verbatim
      vertexShader: QUAD_VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        uPrev: { value: a.texture },
        uPointer: { value: new THREE.Vector2(-1, -1) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: size.width / size.height },
      },
    });
    simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat));
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    return { a, b, simScene, simMat, cam };
  }, [size.width, size.height]);

  const drawMat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: -1, y: -1, px: -1, py: -1 });

  useMemo(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / size.width;
      pointer.current.y = 1 - e.clientY / size.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
  }, [size.width, size.height]);

  useFrame(() => {
    const p = pointer.current;
    const vx = p.px < 0 ? 0 : p.x - p.px;
    const vy = p.py < 0 ? 0 : p.y - p.py;
    p.px = p.x;
    p.py = p.y;

    const { a, b, simScene, simMat, cam } = state;
    simMat.uniforms.uPrev.value = a.texture;
    (simMat.uniforms.uPointer.value as THREE.Vector2).set(p.x, p.y);
    (simMat.uniforms.uVelocity.value as THREE.Vector2).set(vx, vy);

    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(b);
    gl.render(simScene, cam);
    gl.setRenderTarget(prevTarget);

    // swap
    state.a = b;
    state.b = a;

    if (drawMat.current) drawMat.current.uniforms.uField.value = b.texture;
  }, -1);

  const drawUniforms = useMemo(
    () => ({
      uField: { value: state.a.texture },
      uColor: { value: new THREE.Color('#00f0ff') },
    }),
    [state],
  );

  return (
    <mesh frustumCulled={false} renderOrder={10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={drawMat}
        vertexShader={QUAD_VERT}
        fragmentShader={DRAW_FRAG}
        uniforms={drawUniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
