"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const W = 3;
const H = 4.2;

function Card({ texture, edge }: { texture: THREE.Texture; edge: string }) {
  const ref = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, y: 0, gyro: false });

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      tilt.current = {
        x: THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1),
        y: THREE.MathUtils.clamp(e.gamma / 35, -1, 1),
        gyro: true,
      };
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, []);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const tx = tilt.current.gyro ? tilt.current.x : -state.pointer.y;
    const ty = tilt.current.gyro ? tilt.current.y : state.pointer.x;
    const idle = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx * 0.35, 6, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty * 0.5 + idle, 6, delta);
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[W + 0.08, H + 0.08, 0.06]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color={edge} metalness={1} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[W, H]} />
        <meshPhysicalMaterial
          map={texture}
          metalness={0.35}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.15}
          iridescence={1}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[180, 620]}
        />
      </mesh>
    </group>
  );
}

export default function MintCard3D({ source, edge }: { source: HTMLCanvasElement; edge: string }) {
  const [texture] = useState(() => {
    const t = new THREE.CanvasTexture(source);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff1dc" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#ffb070" />
      <pointLight position={[4, 2, 2]} intensity={18} color="#9fd8ff" />
      <Card texture={texture} edge={edge} />
    </Canvas>
  );
}
