import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { POINTCLOUD_VERT, POINTCLOUD_FRAG } from './shaders/pointcloud';
import { isLowPower } from '@/hooks/useLowPowerTier';

/**
 * The hero dataset: a galactic disc + noise clusters of instanced points,
 * scattered/attracted by the pointer (press to attract), converging out of a
 * shell during boot. All motion is GPU-side; the CPU only eases uniforms.
 */

const COUNT_FULL = 16000;
const COUNT_LOW = 4000;

function buildGeometry(count: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const kind = new Float32Array(count);

  // cluster centers for the "high-dimensional dataset" look
  const clusters: Array<[number, number, number, number]> = [
    [3.4, 1.2, -1.5, 0.9],
    [-3.8, -0.8, -2.2, 1.1],
    [2.2, -1.8, -3.5, 0.8],
    [-2.0, 2.0, -1.0, 0.7],
  ];

  for (let i = 0; i < count; i++) {
    const o = i * 3;
    if (i / count < 0.68) {
      // galactic disc: sqrt-uniform radius, thin gaussian height
      const r = Math.sqrt(Math.random()) * 6.2;
      const a = Math.random() * Math.PI * 2;
      const g = (Math.random() + Math.random() + Math.random() - 1.5) * 0.55;
      pos[o] = Math.cos(a) * r;
      pos[o + 1] = g * (1 - r / 9);
      pos[o + 2] = Math.sin(a) * r * 0.6 - 1.2;
    } else {
      const [cx, cy, cz, cr] = clusters[i % clusters.length];
      const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * cr;
      pos[o] = cx + g();
      pos[o + 1] = cy + g();
      pos[o + 2] = cz + g();
    }
    seed[o] = Math.random();
    seed[o + 1] = Math.random();
    seed[o + 2] = Math.random();
    size[i] = 0.6 + Math.random() * 1.9;
    const roll = Math.random();
    kind[i] = roll < 0.55 ? 0 : roll < 0.97 ? 1 : 2; // cyan / ice / amber outlier
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  return geo;
}

export function PointCloud({ revealed }: { revealed: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);
  const { size, camera, gl } = useThree();

  const geometry = useMemo(() => buildGeometry(isLowPower() ? COUNT_LOW : COUNT_FULL), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(999, 999, 0) },
      uForce: { value: 0 },
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      uColorCyan: { value: new THREE.Color('#00f0ff') },
      uColorIce: { value: new THREE.Color('#c9d4e0') },
      uColorAmber: { value: new THREE.Color('#ee9b00') },
    }),
    [],
  );

  // pointer state eased toward targets each frame (module-scope-free refs)
  const target = useRef({ x: 999, y: 999, down: false, active: false });

  useMemo(() => {
    const el = gl.domElement.ownerDocument;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / size.width) * 2 - 1;
      target.current.y = -(e.clientY / size.height) * 2 + 1;
      target.current.active = true;
    };
    const onDown = () => (target.current.down = true);
    const onUp = () => (target.current.down = false);
    const onLeave = () => (target.current.active = false);
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.documentElement.addEventListener('pointerleave', onLeave);
  }, [gl, size.width, size.height]);

  const ndc = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += delta;

    // ease reveal toward its target
    const revealTarget = revealed ? 1 : 0;
    u.uReveal.value += (revealTarget - u.uReveal.value) * Math.min(1, delta * 2.2);

    // hero scroll fade + slight rise
    const vh = window.innerHeight || 1;
    const f = Math.max(0, 1 - window.scrollY / (vh * 0.95));
    u.uFade.value = f;
    if (points.current) points.current.position.y = (window.scrollY / vh) * 1.6;

    // pointer: unproject NDC onto the z≈-1 cloud plane
    const t = target.current;
    if (t.active) {
      ndc.set(t.x, t.y, 0.5).unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      const dist = (-1.2 - camera.position.z) / dir.z;
      const world = camera.position.clone().add(dir.multiplyScalar(dist));
      (u.uPointer.value as THREE.Vector3).lerp(world, Math.min(1, delta * 8));
    }
    const forceTarget = t.active ? (t.down ? -0.9 : 0.85) : 0;
    u.uForce.value += (forceTarget - u.uForce.value) * Math.min(1, delta * 5);
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={POINTCLOUD_VERT}
        fragmentShader={POINTCLOUD_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
