import type { CanvasProps } from '@react-three/fiber';
import * as THREE from 'three';

const SCENE_BG = 0x020617;

export function createRenderer(props: Parameters<NonNullable<CanvasProps['gl']>>[0]) {
  const renderer = new THREE.WebGLRenderer({
    ...props,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
    precision: 'mediump',
    stencil: false,
    depth: true
  });

  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 1.25));
  renderer.setClearColor(SCENE_BG, 1);

  return renderer;
}
