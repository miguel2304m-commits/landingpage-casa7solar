"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";

type EnergyParticlesProps = {
  points: [number, number, number][];
  progress: RefObject<number>;
  reducedMotion: boolean;
  compact: boolean;
};

export default function EnergyParticles({ points, progress, reducedMotion, compact }: EnergyParticlesProps) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((point) => new Vector3(...point))), [points]);
  const dots = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const elapsed = useRef(0);
  const count = compact ? 5 : 9;

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!reducedMotion) elapsed.current += Math.min(delta, 0.05);
    const energy = reducedMotion ? 1 : Math.max(0, (progress.current - 0.4) / 0.6);
    group.current.visible = energy > 0.01;
    if (material.current) material.current.opacity = energy * 0.5;
    dots.current.forEach((dot, index) => {
      if (!dot) return;
      const point = curve.getPointAt((elapsed.current * 0.1 + index / count) % 1);
      dot.position.copy(point);
      dot.scale.setScalar(0.6 + energy * 0.4);
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <tubeGeometry args={[curve, compact ? 32 : 60, 0.012, 5, false]} />
        <meshBasicMaterial ref={material} color="#f7c648" transparent opacity={0.4} />
      </mesh>
      {Array.from({ length: count }, (_, index) => (
        <mesh key={index} ref={(node) => { dots.current[index] = node; }} position={curve.getPointAt(index / count)}>
          <sphereGeometry args={[0.043, 6, 6]} />
          <meshBasicMaterial color="#ffda69" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
