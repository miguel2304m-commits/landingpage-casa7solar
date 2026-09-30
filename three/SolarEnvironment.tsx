"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function SolarEnvironment({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 6]} intensity={3.2} color="#fff0ce" />
      <directionalLight position={[-5, -1, 4]} intensity={1.6} color="#5f9eff" />
      <pointLight position={[3, 4, -1]} intensity={13} color="#ffc64a" distance={20} decay={2} />
      <Environment resolution={compact ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[-3, 4, 6]} scale={[5, 3, 1]} color="#c6dcff" />
        <Lightformer form="rect" intensity={3} position={[5, 1, 4]} scale={[2, 7, 1]} color="#ffffff" />
        <Lightformer form="circle" intensity={5} position={[3, 7, 2]} scale={[3, 3, 1]} color="#ffd278" />
        <Lightformer form="rect" intensity={1.5} position={[-5, -2, 1]} scale={[2, 6, 1]} color="#467cdd" />
      </Environment>
    </>
  );
}
