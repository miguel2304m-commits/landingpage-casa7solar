"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import SolarPanelModel from "@/three/SolarPanelModel";
import EnergyParticles from "@/three/EnergyParticles";

const energyPath: [number, number, number][] = [
  [-0.7, 1.18, -0.25],
  [1.2, 1.18, -0.25],
  [1.9, 0.88, -0.25],
  [2.01, 0.08, 0.15],
  [2.05, -0.68, 0.9],
  [1.4, -0.76, 1.75],
  [-0.5, -0.76, 1.75],
  [-0.65, -0.1, 1.37],
];

type SolarHouseModelProps = {
  progress: RefObject<number>;
  compact: boolean;
  reducedMotion: boolean;
};

export default function SolarHouseModel({ progress, compact, reducedMotion }: SolarHouseModelProps) {
  const group = useRef<Group>(null);
  const roofPanels = useRef<Group>(null);
  const smoothProgress = useRef(reducedMotion ? 1 : 0);
  const elapsed = useRef(0);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!reducedMotion) elapsed.current += delta;
    smoothProgress.current = reducedMotion ? 1 : MathUtils.damp(smoothProgress.current, progress.current, 6, delta);
    if (group.current) group.current.rotation.y = reducedMotion ? 0 : Math.sin(elapsed.current * 0.13) * 0.075;
    if (roofPanels.current) {
      const installation = MathUtils.smoothstep(smoothProgress.current, 0.05, 0.7);
      roofPanels.current.position.y = 1.045 + (1 - installation) * 1.65;
      roofPanels.current.scale.setScalar(0.75 + installation * 0.25);
      roofPanels.current.visible = installation > 0.02;
    }
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <mesh position={[0, -0.95, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.16, 64]} />
        <meshStandardMaterial color="#132336" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.859, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.38, 3.4, 64]} />
        <meshBasicMaterial color="#458ba0" transparent opacity={0.25} />
      </mesh>
      <mesh position={[-0.2, -0.79, 0.1]} receiveShadow>
        <boxGeometry args={[4.7, 0.16, 3.25]} />
        <meshStandardMaterial color="#77818a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.03, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.6, 2.6]} />
        <meshStandardMaterial color="#d9d9d3" roughness={0.78} />
      </mesh>
      <mesh position={[-0.2, 0.91, -0.05]} castShadow>
        <boxGeometry args={[4.32, 0.2, 2.93]} />
        <meshStandardMaterial color="#8c9499" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[-0.2, 1.02, -0.05]} receiveShadow>
        <boxGeometry args={[4.23, 0.035, 2.84]} />
        <meshStandardMaterial color="#293846" roughness={0.82} />
      </mesh>
      <mesh position={[-0.62, 0.02, 1.262]}>
        <boxGeometry args={[2.72, 1.26, 0.035]} />
        <meshPhysicalMaterial color="#23475a" metalness={0.45} roughness={0.16} clearcoat={1} />
      </mesh>
      {[-1.93, -1.05, -0.17, 0.71].map((x) => (
        <mesh key={x} position={[x, 0.02, 1.285]}>
          <boxGeometry args={[0.027, 1.3, 0.038]} />
          <meshStandardMaterial color="#172631" metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
      {[-0.62, 0.65].map((y) => (
        <mesh key={y} position={[-0.61, y, 1.285]}>
          <boxGeometry args={[2.73, 0.027, 0.038]} />
          <meshStandardMaterial color="#182832" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[1.27, -0.02, 1.268]}>
        <boxGeometry args={[0.6, 1.45, 0.045]} />
        <meshStandardMaterial color="#75634c" roughness={0.7} />
      </mesh>
      <mesh position={[1.47, -0.02, 1.3]}>
        <boxGeometry args={[0.02, 0.24, 0.025]} />
        <meshStandardMaterial color="#e4d9c7" metalness={1} roughness={0.3} />
      </mesh>
      {[-0.71, 0.09, 0.89].map((z) => (
        <mesh key={z} position={[1.81, 0.17, z]}>
          <boxGeometry args={[0.025, 0.8, 0.57]} />
          <meshPhysicalMaterial color="#274656" metalness={0.4} roughness={0.2} clearcoat={1} />
        </mesh>
      ))}
      <mesh position={[1.865, -0.05, 0.08]}>
        <boxGeometry args={[0.16, 0.48, 0.4]} />
        <meshStandardMaterial color="#edece1" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[1.95, 0.06, 0.08]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.21, 0.1]} />
        <meshBasicMaterial color="#153c42" />
      </mesh>
      <mesh position={[1.958, -0.08, 0.08]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.016, 8]} />
        <meshBasicMaterial color="#81f1a3" />
      </mesh>
      <group ref={roofPanels} position={[0, 1.045, 0]}>
        {[-0.88, 0.68].flatMap((x) => [-0.73, 0.36].map((z) => (
          <SolarPanelModel
            key={`${x}-${z}`}
            position={[x, 0.13, z]}
            rotation={[-Math.PI / 2 + 0.13, 0, 0]}
            width={1.43}
            height={0.96}
            detailed={false}
          />
        )))}
      </group>
      {[-1.55, -0.85, -0.15, 0.55, 1.25].map((x) => (
        <mesh key={x} position={[x, -0.7, 2]} receiveShadow>
          <boxGeometry args={[0.52, 0.08, 0.38]} />
          <meshStandardMaterial color="#7f8c94" roughness={0.9} />
        </mesh>
      ))}
      {[[-2.75, -0.7, -0.8], [2.55, -0.7, -1.2]].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.075, 0.65, 7]} />
            <meshStandardMaterial color="#715940" roughness={1} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <icosahedronGeometry args={[0.43, 1]} />
            <meshStandardMaterial color="#356c52" roughness={0.9} />
          </mesh>
        </group>
      ))}
      <EnergyParticles points={energyPath} progress={smoothProgress} reducedMotion={reducedMotion} compact={compact} />
    </group>
  );
}
