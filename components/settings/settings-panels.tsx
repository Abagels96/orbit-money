"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";

export function SettingsPanels() {
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const toggleHideBalances = useOrbitPrefs((s) => s.toggleHideBalances);

  return (
    <div className="grid max-w-2xl gap-5">
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Display</h2>
        <p className="mt-1 text-sm text-slate-500">
          Preferences persist in the browser only via localStorage.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-200">Hide balances</p>
            <p className="text-sm text-slate-500">Screenshots & demos</p>
          </div>
          <Button
            type="button"
            variant={hideBalances ? "primary" : "ghost"}
            onClick={toggleHideBalances}
            aria-pressed={hideBalances}
          >
            {hideBalances ? "On" : "Off"}
          </Button>
        </div>
      </Card>
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">About</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Orbit Money is a portfolio demo: mock data in the repo, no backend, no
          auth. Run locally with{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-200/90">
            npm install
          </code>{" "}
          and{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-200/90">
            npm run dev
          </code>
          .
        </p>
      </Card>
    </div>
  );
}
