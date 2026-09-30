"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";

export type HeroMotion = { progress: number; velocity: number };
export type HeroMotionRef = RefObject<HeroMotion>;

export default function HeroSky({ reducedMotion }: { reducedMotion: boolean }) {
  const sun = useRef<Group>(null);
  const elapsed = useRef(0);
  const { viewport } = useThree();
  useFrame((_, delta) => {
    if (!sun.current || reducedMotion) return;
    elapsed.current += Math.min(delta, 0.05);
    sun.current.scale.setScalar(1 + Math.sin(elapsed.current * 0.7) * 0.025);
  });
  return <>
    <mesh position={[0, 0, -15]} name="sky-backdrop">
      <planeGeometry args={[viewport.width * 2.6, viewport.height * 2.6]} />
      <shaderMaterial depthWrite={false} toneMapped={false}
        vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
        fragmentShader="varying vec2 vUv; void main(){vec3 horizon=vec3(0.48,0.75,0.92); vec3 zenith=vec3(0.035,0.29,0.64); vec3 sky=mix(horizon,zenith,smoothstep(0.0,1.0,vUv.y)); float light=exp(-length((vUv-vec2(0.85,0.85))*vec2(1.0,1.3))*5.0); gl_FragColor=vec4(sky+vec3(0.22,0.16,0.06)*light,1.0);}" />
    </mesh>
    <group ref={sun} name="hero-sun" position={[viewport.width * 0.49, viewport.height * 0.5, -4]}>
      <mesh><sphereGeometry args={[0.4, 32, 24]} /><meshBasicMaterial color="#fff4c9" toneMapped={false} /></mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 4.2]} />
        <shaderMaterial transparent depthWrite={false} toneMapped={false}
          vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="varying vec2 vUv; void main(){float r=length(vUv-0.5)*2.0; float glow=pow(max(0.0,1.0-r),3.0); gl_FragColor=vec4(1.0,0.82,0.45,glow*0.65);}" />
      </mesh>
    </group>
  </>;
}
