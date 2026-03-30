"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      appearance: "default",
      setAppearance: (appearance) => set({ appearance }),
    }),
    {
      name: "orbit-money-prefs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
