"use client";

import { useCallback, useEffect, useState } from "react";
import type { RootState } from "@react-three/fiber";

let support: boolean | undefined;

function supportsWebGL2() {
  if (typeof support === "boolean") return support;
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    support = Boolean(context);
    // The probe owns no scene resources; release it before allocating a renderer.
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    support = false;
  }
  return support;
}

/** Fall back before renderer creation, and if a GPU context is subsequently lost. */
export function useWebGLAvailability() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAvailable(supportsWebGL2()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const onCreated = useCallback(({ gl }: RootState) => {
    gl.domElement.addEventListener("webglcontextlost", () => setAvailable(false), { once: true });
  }, []);

  return { available, onCreated };
}
