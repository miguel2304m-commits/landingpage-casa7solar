"use client";

import { Suspense, useEffect, useId, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { MathUtils } from "three";
import { useSceneState } from "@/hooks/useSceneState";
import SceneBoundary from "@/three/SceneBoundary";
import SolarEnvironment from "@/three/SolarEnvironment";
import SolarHouseModel from "@/three/SolarHouseModel";
import { useWebGLAvailability } from "@/hooks/useWebGLAvailability";

function HouseFallback() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 660 480" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={`${id}-roofcells`} width="18" height="15" patternUnits="userSpaceOnUse">
          <rect width="18" height="15" fill="#143e69" stroke="#7395b3" strokeWidth=".6" />
        </pattern>
      </defs>
      <ellipse cx="330" cy="341" rx="253" ry="88" fill="#152637" stroke="#2a414c" />
      <path d="M154 224 365 276 516 198 305 149Z" fill="#899395" />
      <path d="M163 230V338L365 391V282Z" fill="#b9c1bf" />
      <path d="M365 282V391L506 317V210Z" fill="#e5e5d8" />
      <path d="M175 254 313 289V358L175 322Z" fill="#254553" />
      <path d="M220 267V335M268 278V347" stroke="#92a3a7" strokeWidth="3" />
      <path d="M324 292 346 298V367L324 362Z" fill="#61574c" />
      <path d="M395 283 432 264V320L395 339Z M451 253 488 234V290L451 310Z" fill="#3d626d" />
      <g transform="matrix(1,.24,-.9,.45,290,158)">
        {[[0, 0], [91, 0], [0, 78], [91, 78]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="85" height="71" fill={`url(#${id}-roofcells)`} stroke="#b5c6d1" strokeWidth="3" />
        ))}
      </g>
      <path d="M443 240V338L372 374" fill="none" stroke="#edbd4d" strokeWidth="3" />
      <circle cx="516" cy="94" r="25" fill="#ffd165" />
      <circle cx="516" cy="94" r="36" fill="none" stroke="#ffd165" opacity=".18" />
    </svg>
  );
}

export default function SolarHouseScene({ className, progress }: { className?: string; progress?: number }) {
  const { containerRef, visible, mounted, reducedMotion, compact } = useSceneState();
  const { available, onCreated } = useWebGLAvailability();
  const sceneProgress = useRef(progress ?? 0);
  const fallback = <HouseFallback />;

  useEffect(() => {
    if (typeof progress === "number") {
      sceneProgress.current = MathUtils.clamp(progress, 0, 1);
      return;
    }
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      sceneProgress.current = MathUtils.clamp((window.innerHeight * 0.95 - rect.top) / (window.innerHeight * 0.75), 0, 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, progress]);

  return (
    <div ref={containerRef} className={className} role="img" aria-label="Ilustração 3D de uma casa moderna: os painéis são instalados no telhado e a energia passa pelo inversor até a residência." style={{ width: "100%", height: "100%" }}>
      {mounted && available ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            camera={{ position: [7, 5.2, 8], fov: 39, near: 0.1, far: 35 }}
            dpr={compact ? 1 : [1, 1.5]}
            frameloop={visible && !reducedMotion ? "always" : "demand"}
            gl={{ antialias: !compact, alpha: true, powerPreference: "low-power" }}
            fallback={fallback}
            onCreated={onCreated}
            style={{ pointerEvents: "none" }}
          >
            <Suspense fallback={null}>
              <SolarEnvironment compact={compact} />
              <SolarHouseModel progress={sceneProgress} compact={compact} reducedMotion={reducedMotion} />
              <mesh position={[2.9, 3.6, -3]}>
                <sphereGeometry args={[0.35, 24, 16]} />
                <meshBasicMaterial color="#ffd069" toneMapped={false} />
              </mesh>
            </Suspense>
          </Canvas>
        </SceneBoundary>
      ) : fallback}
    </div>
  );
}
