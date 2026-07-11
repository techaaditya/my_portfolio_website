import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointCloud } from './PointCloud';
import { FluidTrail } from './FluidTrail';
import { isLowPower } from '@/hooks/useLowPowerTier';

/**
 * The single fullscreen WebGL layer. Fixed, pointer-events-none, above the
 * page background but below the HUD — additive points glow over content
 * without blocking selection or clicks. The loop pauses when the tab is
 * hidden, and (on low-power devices, which have no fluid trail) once the
 * hero has scrolled well out of view.
 */
export default function GLRoot({
  revealed,
  onReady,
}: {
  revealed: boolean;
  onReady?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [nearHero, setNearHero] = useState(true);
  const low = isLowPower();

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!low) return; // desktop keeps rendering for the fluid trail
    const onScroll = () => setNearHero(window.scrollY < (window.innerHeight || 1) * 1.4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [low]);

  const running = visible && (low ? nearHero : true);

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden="true">
      <Canvas
        frameloop={running ? 'always' : 'never'}
        dpr={[1, low ? 1.25 : 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: false }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // transparent — content shows through
          onReady?.();
        }}
      >
        <PointCloud revealed={revealed} />
        {!low && <FluidTrail />}
      </Canvas>
    </div>
  );
}
