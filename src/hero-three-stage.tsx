import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createRenderer } from './three-renderer';

function SignalField({ count }: { readonly count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const cursor = index * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.1 + Math.random() * 2.8;
      const vertical = (Math.random() - 0.5) * 1.9;

      values[cursor] = Math.cos(angle) * radius * (0.9 + Math.random() * 0.38);
      values[cursor + 1] = vertical;
      values[cursor + 2] = Math.sin(angle) * radius * (0.65 + Math.random() * 0.32);
    }

    return values;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.16;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.36) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.03}
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EnergyCore() {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(elapsed * 1.8) * 0.06;

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.18;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.34) * 0.18;
      groupRef.current.scale.setScalar(pulse);
    }

    if (shellRef.current) {
      shellRef.current.rotation.z = elapsed * 0.22;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -elapsed * 0.36;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.08, 0]}>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.86, 1]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.18} wireframe blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.08, 1.18, 80]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.32} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.4, 0.4]}>
        <ringGeometry args={[1.44, 1.5, 80]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.16} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitRibbon({
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

    ref.current.rotation.x += delta * speed * 0.28;
    ref.current.rotation.y += delta * speed;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * speed) * 0.1;
  });

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.032, 14, 180]} />
      <meshBasicMaterial color={color} transparent opacity={0.26} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ArcNetwork() {
  const ref = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const nodes = [
      [-2.4, 0.7, -0.6],
      [-1.6, -0.6, 0.2],
      [-0.7, 1.05, 0.34],
      [0.2, -0.9, -0.2],
      [1.05, 0.92, 0.26],
      [1.8, -0.2, -0.36],
      [2.36, 0.54, 0.12]
    ] as const;
    const links = [
      [0, 2],
      [0, 1],
      [1, 3],
      [2, 4],
      [2, 3],
      [3, 5],
      [4, 5],
      [4, 6],
      [5, 6]
    ] as const;

    const values = new Float32Array(links.length * 6);

    links.forEach(([from, to], index) => {
      const cursor = index * 6;
      values[cursor] = nodes[from][0];
      values[cursor + 1] = nodes[from][1];
      values[cursor + 2] = nodes[from][2];
      values[cursor + 3] = nodes[to][0];
      values[cursor + 4] = nodes[to][1];
      values[cursor + 5] = nodes[to][2];
    });

    return values;
  }, []);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.16;
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.16} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function GlowDiscs() {
  return (
    <>
      <mesh position={[0, 0, -0.8]}>
        <circleGeometry args={[2.7, 48]} />
        <meshBasicMaterial color="#1d4ed8" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0.3, -0.12, -0.4]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

function HeroScene({ pointCount }: { readonly pointCount: number }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[2.4, 1.2, 3.8]} intensity={18} distance={12} color="#60a5fa" />
      <pointLight position={[-2, -1.1, 2.6]} intensity={12} distance={10} color="#a78bfa" />
      <GlowDiscs />
      <ArcNetwork />
      <SignalField count={pointCount} />
      <EnergyCore />
      <OrbitRibbon color="#38bdf8" radius={2.2} speed={0.26} rotation={[0.75, 0.3, 0.1]} />
      <OrbitRibbon color="#a78bfa" radius={1.64} speed={-0.34} rotation={[1.04, 0.92, 0.36]} />
      <OrbitRibbon color="#22d3ee" radius={2.86} speed={0.18} rotation={[0.48, 0.18, 0.62]} />
    </>
  );
}

export function HeroThreeStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pointCount = useMemo(() => {
    if (typeof window === 'undefined') {
      return 420;
    }

    return window.innerWidth > 1440 ? 520 : 420;
  }, []);

  useEffect(() => {
    const media = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    media.addEventListener('change', handleChange);

    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const target = rootRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-three-stage" aria-hidden="true" ref={rootRef}>
      <Canvas
        className="hero-three-canvas"
        camera={{ position: [0, 0, 5.8], fov: 38 }}
        dpr={[0.65, 0.9]}
        performance={{ min: 0.76 }}
        frameloop={isActive && !prefersReducedMotion ? 'always' : 'never'}
        gl={createRenderer}
      >
        <HeroScene pointCount={pointCount} />
      </Canvas>
    </div>
  );
}
