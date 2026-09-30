"use client";

import { useEffect, useRef, useState } from "react";

export function useSceneState() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const syncPreferences = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(compactQuery.matches);
    };
    const mountFrame = window.requestAnimationFrame(() => {
      syncPreferences();
      setMounted(true);
    });
    motionQuery.addEventListener("change", syncPreferences);
    compactQuery.addEventListener("change", syncPreferences);
    const element = containerRef.current;
    let intersects = false;
    const updateVisibility = () => setVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = entry.isIntersecting;
        updateVisibility();
      },
      { rootMargin: "80px" },
    );
    if (element) observer.observe(element);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      window.cancelAnimationFrame(mountFrame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      motionQuery.removeEventListener("change", syncPreferences);
      compactQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  return { containerRef, visible, mounted, reducedMotion, compact };
}
