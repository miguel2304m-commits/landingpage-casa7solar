"use client";

import { Suspense, useEffect, useId, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import SolarPanelModel from "@/three/SolarPanelModel";
import SolarEnvironment from "@/three/SolarEnvironment";
import SolarClouds from "@/three/SolarClouds";
import HeroSky, { type HeroMotionRef } from "@/three/HeroSky";
import SceneBoundary from "@/three/SceneBoundary";
import { useSceneState } from "@/hooks/useSceneState";
import { useWebGLAvailability } from "@/hooks/useWebGLAvailability";

const panelPositions: [number, number, number][] = [
  [-1.47, 1.02, -0.12],
  [1.47, 1.02, 0.04],
  [-1.47, -0.91, 0.14],
  [1.47, -0.91, 0.31],
];

function FloatingPanels({ reducedMotion, compact, motion }: { reducedMotion: boolean; compact: boolean; motion: HeroMotionRef }) {
  const assembly = useRef<Group>(null);
  const panels = useRef<(Group | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    if (!compact) window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updatePointer);
    };
  }, [compact, reducedMotion]);

  useFrame((_, rawDelta) => {
    if (!assembly.current || reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    time.current += delta;
    const movement = motion.current.progress;
    const group = assembly.current;
    group.rotation.x = MathUtils.damp(group.rotation.x, -0.24 + pointer.current.y * 0.035 + movement * 0.23, 3, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, -0.38 + pointer.current.x * 0.055 - movement * 0.35, 3, delta);
    group.rotation.z = MathUtils.damp(group.rotation.z, -0.17 + pointer.current.x * 0.018 - movement * 0.08, 3, delta);
    group.position.y = Math.sin(time.current * 0.55) * 0.07 - movement * (compact ? 0.6 : 1.1);
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      const base = panelPositions[index];
      panel.position.y = base[1] + Math.sin(time.current * 0.65 + index * 0.8) * 0.055;
      panel.position.x = base[0];
      panel.position.z = base[2] + movement * 0.35;
      panel.rotation.y = Math.sin(time.current * 0.3 + index) * 0.012;
    });
  });

  return (
    <group name="hero-panels" ref={assembly} rotation={[-0.24, -0.38, -0.17]}>
      {panelPositions.map((position, index) => (
        <SolarPanelModel
          key={index}
          ref={(node) => { panels.current[index] = node; }}
          position={position}
          detailed={!compact}
        />
      ))}
    </group>
  );
}

function SkyScene({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const { viewport } = useThree();
  const motion = useRef({ progress: 0, velocity: 0 });
  const lastScroll = useRef<number | null>(null);
  useFrame((_, rawDelta) => {
    const y = window.scrollY;
    if (reducedMotion) { motion.current = { progress: 0, velocity: 0 }; lastScroll.current = y; return; }
    const delta = Math.min(rawDelta, 0.05);
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = MathUtils.clamp(-hero.getBoundingClientRect().top / travel, 0, 1);
    const velocity = lastScroll.current === null || rawDelta > 0.2 ? 0 : MathUtils.clamp((y - lastScroll.current) / Math.max(rawDelta, 0.001), 0, 4000);
    lastScroll.current = y;
    motion.current.progress = MathUtils.damp(motion.current.progress, progress, 5, delta);
    motion.current.velocity = MathUtils.damp(motion.current.velocity, velocity, 4, delta);
  }, -1);
  const panelScale = compact ? viewport.width / 6.8 : Math.min(viewport.width * 0.066, 1.05);
  return <>
    <HeroSky reducedMotion={reducedMotion} />
    <SolarEnvironment compact={compact} />
    <group position={[compact ? 0 : viewport.width * 0.23, compact ? -viewport.height * 0.235 : -0.15, 0]} scale={panelScale}>
      <FloatingPanels reducedMotion={reducedMotion} compact={compact} motion={motion} />
    </group>
    <Suspense fallback={null}><SolarClouds reducedMotion={reducedMotion} compact={compact} motion={motion} /></Suspense>
  </>;
}

export function SolarPanelFallback() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 800 660" width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#235494" />
          <stop offset=".45" stopColor="#0c2b55" />
          <stop offset="1" stopColor="#05182f" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d8dfe9" />
          <stop offset=".4" stopColor="#4c5b71" />
          <stop offset=".8" stopColor="#b9c6d5" />
          <stop offset="1" stopColor="#26344b" />
        </linearGradient>
        <pattern id={`${id}-cells`} width="23" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 0H23V32H0Z" fill="none" stroke="#aac7ed" strokeWidth=".55" opacity=".6" />
          <path d="M6 0V32M12 0V32M18 0V32" stroke="#8caed7" strokeWidth=".2" opacity=".5" />
        </pattern>
      </defs>
      <g transform="translate(110 150) rotate(-13 300 180) skewY(9)">
        {[[0, 0], [294, -6], [0, 200], [294, 194]].map(([x, y], index) => (
          <g key={index} transform={`translate(${x} ${y})`}>
            <rect x="3" y="7" width="280" height="186" fill="#142031" rx="2" />
            <rect width="280" height="186" fill={`url(#${id}-metal)`} rx="2" />
            <rect x="5" y="5" width="270" height="176" fill={`url(#${id}-panel)`} />
            <rect x="5" y="5" width="270" height="176" fill={`url(#${id}-cells)`} />
            <path d="M248 183h20" stroke="#ffd04a" strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function SolarScene({ className }: { className?: string }) {
  const { containerRef, visible, mounted, reducedMotion, compact } = useSceneState();
  const { available, onCreated } = useWebGLAvailability();
  const fallback = <div className="hero-panel-fallback"><SolarPanelFallback /></div>;
  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label="Céu tridimensional com sol e nuvens animadas. As placas acompanham a descida e as nuvens aceleram ao rolar a página."
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {mounted && available ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            camera={{ position: [0, 0, 9.9], fov: compact ? 42 : 39, near: 0.1, far: 35 }}
            dpr={compact ? 1 : [1, 1.65]}
            frameloop={visible && !reducedMotion ? "always" : "demand"}
            gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
            fallback={fallback}
            onCreated={onCreated}
            style={{ pointerEvents: "none" }}
          >
            <Suspense fallback={null}>
              <SkyScene reducedMotion={reducedMotion} compact={compact} />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      ) : fallback}
    </div>
  );
}
