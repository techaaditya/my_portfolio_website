import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LIQUID_VERT, LIQUID_FRAG } from './shaders/liquid';

/**
 * The floating work-matrix preview: a small dedicated canvas that follows
 * the cursor over hovered rows, rendering the project capture through the
 * liquid distortion shader. Mounted only while the matrix is hovered
 * (desktop fine-pointer only — WorkMatrix gates it).
 */

const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

function getTexture(url: string): THREE.Texture {
  let t = cache.get(url);
  if (!t) {
    t = loader.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    cache.set(url, t);
  }
  return t;
}

function Plane({ url, hoverTarget }: { url: string; hoverTarget: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const vel = useRef({ x: 0, y: 0, px: -1, py: -1 });

  const uniforms = useMemo(
    () => ({
      uMap: { value: getTexture(url) },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uVelocity: { value: new THREE.Vector2() },
    }),
    [url],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const v = vel.current;
      if (v.px >= 0) {
        v.x = (e.clientX - v.px) / 60;
        v.y = (e.clientY - v.py) / 60;
      }
      v.px = e.clientX;
      v.py = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value += delta;
    m.uniforms.uHover.value += (hoverTarget.current - m.uniforms.uHover.value) * Math.min(1, delta * 7);
    const v = vel.current;
    v.x *= 0.9;
    v.y *= 0.9;
    (m.uniforms.uVelocity.value as THREE.Vector2).set(v.x, v.y);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={LIQUID_VERT}
        fragmentShader={LIQUID_FRAG}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function LiquidPreview({
  url,
  visible,
}: {
  url: string | null;
  visible: boolean;
}) {
  const hoverTarget = useRef(0);
  hoverTarget.current = visible && url ? 1 : 0;

  if (!url) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Plane url={url} hoverTarget={hoverTarget} />
    </Canvas>
  );
}
