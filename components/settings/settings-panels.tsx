"use client";

import { useCallback, useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  Badge,
  Button,
  GlassCard,
  SectionHeader,
  Select,
} from "@/src/components/ui";
import type { OrbitColorMode } from "@/lib/theme";
import { useOrbitPrefs, type OrbitCurrencyCode } from "@/store/use-orbit-prefs";
import { useFinanceStore } from "@/src/store/use-finance-store";
import { cn } from "@/lib/cn";
import {
  getBudgets,
  getGoals,
  getInsights,
  getTransactions,
} from "@/src/lib/storage";

const CURRENCY_OPTIONS: { value: OrbitCurrencyCode; label: string }[] = [
  { value: "USD", label: "USD — US dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — Pound sterling" },
  { value: "JPY", label: "JPY — Japanese yen" },
  { value: "CAD", label: "CAD — Canadian dollar" },
];

export function SettingsPanels() {
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const toggleHideBalances = useOrbitPrefs((s) => s.toggleHideBalances);
  const currency = useOrbitPrefs((s) => s.currency);
  const setCurrency = useOrbitPrefs((s) => s.setCurrency);
  const appearance = useOrbitPrefs((s) => s.appearance);
  const setAppearance = useOrbitPrefs((s) => s.setAppearance);
  const colorMode = useOrbitPrefs((s) => s.colorMode);
  const setColorMode = useOrbitPrefs((s) => s.setColorMode);

  const themeOptions: { mode: OrbitColorMode; label: string; Icon: typeof Sun }[] = [
    { mode: "light", label: "Light", Icon: Sun },
    { mode: "dark", label: "Dark", Icon: Moon },
    { mode: "system", label: "System", Icon: Monitor },
  ];

  const resetDemoData = useFinanceStore((s) => s.resetDemoData);

  const [resetBusy, setResetBusy] = useState(false);

  const handleExportSnapshot = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      note: "Orbit Money — local snapshot (prototype export).",
      transactions: getTransactions(),
      budgets: getBudgets(),
      goals: getGoals(),
      insights: getInsights(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-money-snapshot-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleResetDemo = useCallback(() => {
    const ok = window.confirm(
      "Reset all demo data to repository seeds? This clears local ledger, budgets, goals, and insight overrides, then reloads the page."
    );
    if (!ok) return;
    setResetBusy(true);
    try {
      resetDemoData();
      window.location.reload();
    } catch {
      setResetBusy(false);
    }
  }, [resetDemoData]);

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Experience"
          title="Display & atmosphere"
          description="Preferences stay in this browser only. Currency is a mock selector for future formatting hooks."
        />

        <GlassCard glow="teal" padding="lg" className="border-slate-200/90 dark:border-white/[0.09]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-white/[0.06]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700/90 dark:text-teal-400/85">
                Privacy
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                Balance visibility
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-500">
                Mask amounts app-wide for screenshots and walkthroughs.
              </p>
            </div>
            <Button
              type="button"
              variant={hideBalances ? "primary" : "outline"}
              glow={hideBalances}
              leftIcon={
                hideBalances ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
              onClick={toggleHideBalances}
              aria-pressed={hideBalances}
            >
              {hideBalances ? "Masked" : "Visible"}
            </Button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-600/90 dark:text-amber-400/80" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Theme
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-500">
                Light, dark, or follow your system. Also available in the header.
              </p>
              <div
                className="mt-4 inline-flex rounded-2xl border border-slate-200/90 bg-slate-50/90 p-1 dark:border-white/[0.08] dark:bg-black/20"
                role="group"
                aria-label="Color theme"
              >
                {themeOptions.map(({ mode, label, Icon }) => (
                  <button
                    key={mode}
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                      colorMode === mode
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/90 dark:bg-white/[0.1] dark:text-white dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] dark:ring-white/10"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                    )}
                    onClick={() => setColorMode(mode)}
                    aria-pressed={colorMode === mode}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-indigo-600/80 dark:text-indigo-400/80" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Atmosphere
                </p>
                <Badge variant="muted" className="font-mono text-[9px]">
                  Mock
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-500">
                Subtle background shift on top of your theme (Obsidian vs Aurora).
              </p>
              <div className="mt-4 inline-flex rounded-2xl border border-slate-200/90 bg-slate-50/90 p-1 dark:border-white/[0.08] dark:bg-black/20">
                {(
                  [
                    { id: "default" as const, label: "Obsidian" },
                    { id: "ambient" as const, label: "Aurora" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm font-medium transition",
                      appearance === opt.id
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/90 dark:bg-white/[0.1] dark:text-white dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                    )}
                    onClick={() => setAppearance(opt.id)}
                    aria-pressed={appearance === opt.id}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Select
                label="Currency"
                hint="Mock — amounts still render as USD in this build."
                options={CURRENCY_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value as OrbitCurrencyCode)
                }
              />
              <Badge variant="muted" className="mt-3 font-mono text-[9px]">
                Intl wiring later
              </Badge>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Data"
          title="Local store"
          description="Orbit never uploads these blobs — reset restores seed JSON from the repo."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <GlassCard padding="lg" className="border-slate-200/90 dark:border-white/[0.08]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/10 text-rose-700 dark:border-rose-400/20 dark:text-rose-300">
                <RotateCcw className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Reset demo data
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                  Clears localStorage keys and reloads seeded transactions,
                  budgets, goals, and insights. Use when you want a clean
                  portfolio walkthrough.
                </p>
                <Button
                  type="button"
                  variant="danger"
                  className="mt-5"
                  glow
                  disabled={resetBusy}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                  onClick={handleResetDemo}
                >
                  {resetBusy ? "Resetting…" : "Reset to seeds"}
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="lg" className="border-slate-200/90 dark:border-white/[0.08]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-500/10 text-teal-800 dark:border-teal-400/20 dark:text-teal-300">
                <Download className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Export snapshot
                  </h2>
                  <Badge variant="accent" className="font-mono text-[9px]">
                    Placeholder
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-500">
                  Downloads a JSON bundle of your current local ledger, budgets,
                  goals, and insights — handy for backups or design reviews.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-5"
                  glow
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={handleExportSnapshot}
                >
                  Download .json
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <GlassCard
        padding="lg"
        className="border border-dashed border-slate-300/90 bg-slate-50/50 dark:border-white/[0.1] dark:bg-white/[0.02]"
      >
        <div className="flex flex-wrap items-start gap-4">
          <Sparkles className="h-5 w-5 shrink-0 text-teal-600/80 dark:text-teal-400/70" aria-hidden />
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">About this build</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-500">
              Orbit Money is a portfolio shell: mock data in the repo, no
              backend, no auth. Run locally with{" "}
              <code className="rounded-md border border-slate-200/90 bg-white px-1.5 py-0.5 font-mono text-xs text-teal-800 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-teal-200/90">
                npm install
              </code>{" "}
              and{" "}
              <code className="rounded-md border border-slate-200/90 bg-white px-1.5 py-0.5 font-mono text-xs text-teal-800 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-teal-200/90">
                npm run dev
              </code>
              . Everything you configure here stays on-device.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
