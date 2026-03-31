"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrbitColorMode } from "@/lib/theme";

/** Mock selector — display only until wired into formatting. */
export type OrbitCurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD";

/** Mock appearance — drives CSS variables via `OrbitPrefsSync`. */
export type OrbitAppearance = "default" | "ambient";

type OrbitPrefsState = {
  hideBalances: boolean;
  toggleHideBalances: () => void;
  /** Mock: persisted for future Intl wiring. */
  currency: OrbitCurrencyCode;
  setCurrency: (c: OrbitCurrencyCode) => void;
  /** Light / dark / follow system — toggles `dark` on `<html>`. */
  colorMode: OrbitColorMode;
  setColorMode: (m: OrbitColorMode) => void;
  /** Mock: subtle background / atmosphere shift. */
  appearance: OrbitAppearance;
  setAppearance: (a: OrbitAppearance) => void;
};

export const useOrbitPrefs = create<OrbitPrefsState>()(
  persist(
    (set, get) => ({
      hideBalances: false,
      toggleHideBalances: () =>
        set({ hideBalances: !get().hideBalances }),
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
      colorMode: "system",
      setColorMode: (colorMode) => set({ colorMode }),
      appearance: "default",
      setAppearance: (appearance) => set({ appearance }),
    }),
    {
      name: "orbit-money-prefs",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const p = persisted as Partial<OrbitPrefsState> | null;
        if (!p || typeof p !== "object") return current;
        return {
          ...current,
          ...p,
          colorMode: p.colorMode ?? current.colorMode,
        };
      },
    }
  )
);
