"use client";

import { useEffect } from "react";
import { resolveColorScheme } from "@/lib/theme";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";

/**
 * Applies persisted appearance + color mode to the document root for CSS hooks (`globals.css`).
 */
export function OrbitPrefsSync() {
  const appearance = useOrbitPrefs((s) => s.appearance);
  const colorMode = useOrbitPrefs((s) => s.colorMode);

  useEffect(() => {
    document.documentElement.dataset.orbitAppearance = appearance;
  }, [appearance]);

  useEffect(() => {
    const apply = () => {
      const scheme = resolveColorScheme(colorMode);
      document.documentElement.classList.toggle("dark", scheme === "dark");
      document.documentElement.dataset.orbitTheme = scheme;
    };
    apply();
    if (colorMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [colorMode]);

  return null;
}
