"use client";

import { useRef } from "react";
import { Cloud, Clouds } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, MeshBasicMaterial } from "three";
import type { HeroMotionRef } from "./HeroSky";

const formations = [
  { position: [-0.38, 0.38, -2] as const, scale: 0.95, seed: 12 },
  { position: [0.28, 0.32, -1.5] as const, scale: 0.9, seed: 28 },
  { position: [0.38, -0.38, 1] as const, scale: 1.1, seed: 43 },
  { position: [-0.12, -0.32, -2] as const, scale: 1.3, seed: 61 },
  { position: [0.04, 0.56, -3] as const, scale: 0.8, seed: 75 },
  { position: [-0.5, -0.03, -1] as const, scale: 1.1, seed: 87 },
];

export default function SolarClouds({ compact, reducedMotion, motion }: { compact: boolean; reducedMotion: boolean; motion: HeroMotionRef }) {
  const groups = useRef<(Group | null)[]>([]);
  const time = useRef(0);
  const drift = useRef(0);
  const { viewport } = useThree();

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const step = Math.min(delta, 0.05);
    time.current += step;
    drift.current += step * (0.045 + motion.current.velocity * 0.0016);
    groups.current.forEach((group, index) => {
      if (!group) return;
      const base = formations[index].position;
      group.position.x = base[0] * viewport.width + Math.sin(time.current * 0.12 + index * 2) * 0.3;
      const span = viewport.height + 5;
      group.position.y = ((base[1] * viewport.height + drift.current * (0.7 + index * 0.12) + span / 2) % span) - span / 2;
      group.position.z = base[2] + Math.sin(time.current * 0.1 + index) * 0.12;
    });
  });

  return (
    <Clouds name="solar-clouds" texture="/textures/cloud.png" material={MeshBasicMaterial} limit={120} frustumCulled={false}>
      {formations.map(({ position, scale, seed }, index) => (
        <group name={`sky-cloud-${index}`} key={seed} ref={node => { groups.current[index] = node; }} position={[position[0] * viewport.width, position[1] * viewport.height, position[2]]} scale={scale * (compact ? 0.65 : 1)}>
          <Cloud seed={seed} segments={compact ? 10 : 20} bounds={[1.3, 0.32, 0.45]} volume={2.1}
            smallestVolume={0.45} concentrate="inside" opacity={index === 2 ? 0.48 : 0.65}
            color={index === 2 ? "#d6e6f3" : "#f0f4fa"} fade={0}
            speed={reducedMotion ? 0 : 0.08} growth={reducedMotion ? 0 : 0.12} />
        </group>
      ))}
    </Clouds>
  );
}
