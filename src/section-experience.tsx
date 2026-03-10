import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createRenderer } from './three-renderer';

type SectionExperienceProps = {
  readonly variant: 'platform' | 'story' | 'cta';
};

function Ribbon({
  color,
  radius,
  speed,
  rotation
}: {
  readonly color: string;
  readonly radius: number;
  readonly speed: number;
  readonly rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.x += delta * speed * 0.32;
    ref.current.rotation.y += delta * speed;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.12;
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.035, 14, 180]} />
      <meshBasicMaterial color={color} transparent opacity={0.34} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function WaveField({ variant }: SectionExperienceProps) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 520;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3;
      const spread = variant === 'story' ? 5.4 : variant === 'platform' ? 5.9 : 4.4;

      values[cursor] = (Math.random() - 0.5) * spread;
      values[cursor + 1] = (Math.random() - 0.5) * 2.8;
      values[cursor + 2] = (Math.random() - 0.5) * spread;
    }

    return values;
  }, [variant]);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const scrollMix = Math.min(globalThis.scrollY / Math.max(globalThis.innerHeight * 3, 1), 1);
    ref.current.rotation.y = state.clock.elapsedTime * (0.08 + scrollMix * 0.14);
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * (0.1 + scrollMix * 0.14);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={variant === 'story' ? '#60a5fa' : variant === 'platform' ? '#22d3ee' : '#c084fc'}
        size={variant === 'story' ? 0.03 : variant === 'platform' ? 0.037 : 0.034}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SectionScene({ variant }: SectionExperienceProps) {
  return (
    <>
      <ambientLight intensity={variant === 'cta' ? 0.5 : 0.42} />
      <pointLight position={[2, 1, 3]} intensity={variant === 'cta' ? 20 : 16} distance={12} color="#60a5fa" />
      <pointLight position={[-2, -1, 2]} intensity={variant === 'platform' ? 18 : 14} distance={12} color="#a78bfa" />
      <WaveField variant={variant} />
      <Ribbon color="#60a5fa" radius={variant === 'story' ? 2.8 : variant === 'platform' ? 3.2 : 2.2} speed={0.28} rotation={[0.8, 0.2, 0]} />
      <Ribbon color="#a78bfa" radius={variant === 'story' ? 2.2 : variant === 'platform' ? 2.6 : 1.8} speed={-0.32} rotation={[1.1, 0.6, 0.4]} />
      <Ribbon color={variant === 'cta' ? '#22d3ee' : '#38bdf8'} radius={variant === 'cta' ? 1.4 : 2} speed={0.42} rotation={[0.4, 1.2, 0.3]} />
    </>
  );
}

export function SectionExperience({ variant }: SectionExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const target = rootRef.current?.parentElement;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.35, rootMargin: '0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`section-scene section-scene-${variant}`} aria-hidden="true" ref={rootRef}>
      <Canvas
        className="section-canvas"
        camera={{ position: [0, 0, 6.2], fov: 40 }}
        dpr={[0.75, 1]}
        performance={{ min: 0.78 }}
        frameloop={isActive ? 'always' : 'never'}
        gl={createRenderer}
      >
        <SectionScene variant={variant} />
      </Canvas>
    </div>
  );
}
