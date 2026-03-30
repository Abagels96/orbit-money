"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OrbitPrefsState = {
  hideBalances: boolean;
  toggleHideBalances: () => void;
};

export const useOrbitPrefs = create<OrbitPrefsState>()(
  persist(
    (set, get) => ({
      hideBalances: false,
      toggleHideBalances: () =>
        set({ hideBalances: !get().hideBalances }),
    }),
    {
      name: "orbit-money-prefs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
