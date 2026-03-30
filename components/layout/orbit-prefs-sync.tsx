"use client";

import { useEffect } from "react";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";

/**
 * Applies persisted appearance to the document root for CSS hooks (`globals.css`).
 */
export function OrbitPrefsSync() {
  const appearance = useOrbitPrefs((s) => s.appearance);

  useEffect(() => {
    document.documentElement.dataset.orbitAppearance = appearance;
  }, [appearance]);

  return null;
}
