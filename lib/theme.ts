export type OrbitColorMode = "light" | "dark" | "system";

export const ORBIT_PREFS_STORAGE_KEY = "orbit-money-prefs";

/** Resolves persisted color mode to a concrete scheme (for class / CSS). */
export function resolveColorScheme(mode: OrbitColorMode | undefined): "light" | "dark" {
  if (mode === "dark") return "dark";
  if (mode === "light") return "light";
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
