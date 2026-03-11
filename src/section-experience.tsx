/// <reference path="./three-jsx.d.ts" />
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createRenderer } from './three-renderer';

type Variant = 'platform' | 'story' | 'cta';

type SectionExperienceProps = {
  readonly variant: Variant;
};

function spreadByVariant(variant: Variant): number {
  if (variant === 'story') return 5.4;
  if (variant === 'platform') return 5.9;
  return 4.4;
}

function waveColorByVariant(variant: Variant): string {
  if (variant === 'story') return '#60a5fa';
  if (variant === 'platform') return '#22d3ee';
  return '#c084fc';
}

function waveSizeByVariant(variant: Variant): number {
  if (variant === 'story') return 0.03;
  if (variant === 'platform') return 0.037;
  return 0.034;
}

function ambientIntensityByVariant(variant: Variant): number {
  return variant === 'cta' ? 0.5 : 0.42;
}

function pointLightIntensityCta(variant: Variant): number {
  return variant === 'cta' ? 20 : 16;
}

function pointLightIntensityPlatform(variant: Variant): number {
  return variant === 'platform' ? 18 : 14;
}

function ribbonRadiusByVariant(variant: Variant, a: number, b: number, c: number): number {
  if (variant === 'story') return a;
  if (variant === 'platform') return b;
  return c;
}

function ribbonColorCta(variant: Variant): string {
  return variant === 'cta' ? '#22d3ee' : '#38bdf8';
}

function ribbonRadiusCta(variant: Variant): number {
  return variant === 'cta' ? 1.4 : 2;
}

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

  const meshProps: Pick<ThreeElements['mesh'], 'rotation'> = { rotation };
  const torusProps: Pick<ThreeElements['torusGeometry'], 'args'> = { args: [radius, 0.035, 14, 180] };
  const materialProps: Pick<ThreeElements['meshBasicMaterial'], 'color' | 'transparent' | 'opacity' | 'blending'> = {
    color,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending
  };
  return (
    <mesh ref={ref} {...meshProps}>
      <torusGeometry {...torusProps} />
      <meshBasicMaterial {...materialProps} />
    </mesh>
  );
}

function WaveField({ variant }: SectionExperienceProps) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 520;
    const values = new Float32Array(count * 3);

    const spread = spreadByVariant(variant);
    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3;
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

  const attachProps: Pick<ThreeElements['bufferAttribute'], 'attach' | 'args'> = {
    attach: 'attributes-position',
    args: [positions, 3]
  };
  const pointsMatProps: Pick<ThreeElements['pointsMaterial'], 'color' | 'size' | 'transparent' | 'opacity' | 'depthWrite' | 'blending'> = {
    color: waveColorByVariant(variant),
    size: waveSizeByVariant(variant),
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  };
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute {...attachProps} />
      </bufferGeometry>
      <pointsMaterial {...pointsMatProps} />
    </points>
  );
}

function SectionScene({ variant }: SectionExperienceProps) {
  return (
    <>
      <ambientLight {...({ intensity: ambientIntensityByVariant(variant) } as ThreeElements['ambientLight'])} />
      <pointLight
        {...({
          position: [2, 1, 3],
          intensity: pointLightIntensityCta(variant),
          distance: 12,
          color: '#60a5fa'
        } as ThreeElements['pointLight'])}
      />
      <pointLight
        {...({
          position: [-2, -1, 2],
          intensity: pointLightIntensityPlatform(variant),
          distance: 12,
          color: '#a78bfa'
        } as ThreeElements['pointLight'])}
      />
      <WaveField variant={variant} />
      <Ribbon color="#60a5fa" radius={ribbonRadiusByVariant(variant, 2.8, 3.2, 2.2)} speed={0.28} rotation={[0.8, 0.2, 0]} />
      <Ribbon color="#a78bfa" radius={ribbonRadiusByVariant(variant, 2.2, 2.6, 1.8)} speed={-0.32} rotation={[1.1, 0.6, 0.4]} />
      <Ribbon color={ribbonColorCta(variant)} radius={ribbonRadiusCta(variant)} speed={0.42} rotation={[0.4, 1.2, 0.3]} />
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
