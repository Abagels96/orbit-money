"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import {
  Badge,
  GlassCard,
  SectionHeader,
} from "@/src/components/ui";
import { useFinanceStore } from "@/src/store/use-finance-store";
import type { Budget } from "@/src/types";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/src/lib/utils";

function parseMoney(s: string): number | null {
  const n = Number.parseFloat(s.trim().replace(/,/g, ""));
  if (Number.isNaN(n) || !Number.isFinite(n)) return null;
  return n;
}

function BudgetRing({
  spent,
  limit,
  over,
}: {
  spent: number;
  limit: number;
  over: boolean;
}) {
  const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;
  const pct = ratio * 100;
  const overfill = limit > 0 && spent > limit ? Math.min((spent - limit) / limit, 0.5) * 50 : 0;

  return (
    <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: over
            ? `conic-gradient(from -90deg, rgba(251,113,133,0.95) 0%, rgba(251,113,133,0.95) ${Math.min(100, pct)}%, rgba(255,255,255,0.06) ${Math.min(100, pct)}%)`
            : `conic-gradient(from -90deg, rgba(45,212,191,0.9) 0%, rgba(45,212,191,0.9) ${pct}%, rgba(255,255,255,0.06) ${pct}%)`,
        }}
        aria-hidden
      />
      {over && overfill > 0 ? (
        <div
          className="absolute inset-0 rounded-full opacity-40 blur-sm"
          style={{
            background: `conic-gradient(from -90deg, transparent 0%, rgba(251,113,133,0.6) ${100 - overfill}%, transparent 100%)`,
          }}
          aria-hidden
        />
      ) : null}
      <div className="relative flex h-[78%] w-[78%] flex-col items-center justify-center rounded-full border border-slate-200/90 bg-white/90 dark:border-white/[0.08] dark:bg-[#0a0e14]/90">
        <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-white sm:text-3xl">
          {limit > 0 ? `${Math.round(pct)}` : "—"}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          used
        </span>
      </div>
    </div>
  );
}

function BudgetCard({
  budget,
  hide,
  mounted,
}: {
  budget: Budget;
  hide: boolean;
  mounted: boolean;
}) {
  const updateBudget = useFinanceStore((s) => s.updateBudget);

  const [limitStr, setLimitStr] = useState(String(budget.limit));
  const [spentStr, setSpentStr] = useState(String(budget.spent));

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLimitStr(String(budget.limit));
      setSpentStr(String(budget.spent));
    });
    return () => cancelAnimationFrame(id);
  }, [budget.id, budget.limit, budget.spent]);

  const commit = useCallback(() => {
    const L = parseMoney(limitStr);
    const S = parseMoney(spentStr);
    if (L == null || S == null || L < 0 || S < 0) {
      setLimitStr(String(budget.limit));
      setSpentStr(String(budget.spent));
      return;
    }
    updateBudget(budget.id, { limit: L, spent: S });
  }, [budget.id, budget.limit, budget.spent, limitStr, spentStr, updateBudget]);

  const limit = budget.limit;
  const spent = budget.spent;
  const remaining = limit - spent;
  const over = spent > limit;

  const glow = over ? "rose" : "teal";

  return (
    <GlassCard
      glow={glow}
      padding="lg"
      interactive
      className={cn(
        "flex flex-col items-stretch gap-6 border-slate-200/90 dark:border-white/[0.08]",
        over && "ring-1 ring-rose-400/25"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Zone
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {budget.category}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {over ? (
            <Badge variant="danger" className="gap-1">
              <AlertTriangle className="h-3 w-3" aria-hidden />
              Overspent
            </Badge>
          ) : (
            <Badge variant="success" className="gap-1">
              <Check className="h-3 w-3" aria-hidden />
              Within mesh
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <BudgetRing spent={spent} limit={limit} over={over} />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Ceiling (limit)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={limitStr}
                onChange={(e) => setLimitStr(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                className={cn(
                  "w-full rounded-2xl border border-slate-300/90 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-600",
                  "focus:border-teal-400/40 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                )}
                aria-label={`${budget.category} limit`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Burn (spent)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={spentStr}
                onChange={(e) => setSpentStr(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                className={cn(
                  "w-full rounded-2xl border border-slate-300/90 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-600",
                  "focus:border-teal-400/40 focus:outline-none focus:ring-2 focus:ring-teal-400/20",
                  over && "border-rose-400/30 focus:border-rose-400/45 focus:ring-rose-400/15"
                )}
                aria-label={`${budget.category} spent`}
              />
            </label>
          </div>
          <div
            className={cn(
              "rounded-2xl border px-4 py-3",
              over
                ? "border-rose-400/25 bg-rose-500/[0.08]"
                : "border-emerald-400/20 bg-emerald-500/[0.06]"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Buffer (remaining)
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-lg tabular-nums font-semibold",
                over ? "text-rose-200" : "text-emerald-200"
              )}
            >
              {!mounted
                ? "—"
                : formatCurrency(remaining, { hide })}
              {over && mounted ? (
                <span className="ml-2 text-xs font-normal text-rose-300/90">
                  (deficit)
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            over ? "bg-gradient-to-r from-rose-400 to-rose-500" : "bg-gradient-to-r from-teal-400 to-emerald-400"
          )}
          style={{
            width: `${limit > 0 ? Math.min(100, (spent / limit) * 100) : 0}%`,
          }}
        />
      </div>
    </GlassCard>
  );
}

export function BudgetsOverview() {
  const mounted = useMounted();
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const hide = mounted && hideBalances;

  const budgets = useFinanceStore((s) => s.budgets);

  const totalLimit = useMemo(
    () => budgets.reduce((s, b) => s + b.limit, 0),
    [budgets]
  );
  const totalSpent = useMemo(
    () => budgets.reduce((s, b) => s + b.spent, 0),
    [budgets]
  );
  const totalRemaining = totalLimit - totalSpent;

  return (
    <div className="space-y-10 sm:space-y-12">
      <SectionHeader
        eyebrow="Allocation mesh"
        title="Budget zones"
        description="Edit ceilings and burn directly — values live in your local finance store."
      />

      <GlassCard padding="md" glow="indigo" className="border-slate-200/90 dark:border-white/[0.08]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Total ceiling
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-slate-900 dark:text-white">
              {!mounted ? "—" : formatCurrency(totalLimit, { hide })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Total burn
            </p>
            <p className="mt-1 font-mono text-xl tabular-nums text-teal-200">
              {!mounted ? "—" : formatCurrency(totalSpent, { hide })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Net buffer
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-xl tabular-nums",
                totalRemaining >= 0 ? "text-emerald-300" : "text-rose-300"
              )}
            >
              {!mounted ? "—" : formatCurrency(totalRemaining, { hide })}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-7 lg:grid-cols-12">
        {budgets.map((b, i) => (
          <div
            key={b.id}
            className={cn(
              i % 3 === 0 && "lg:col-span-7",
              i % 3 === 1 && "lg:col-span-5",
              i % 3 === 2 && "lg:col-span-12"
            )}
          >
            <BudgetCard budget={b} hide={hide} mounted={mounted} />
          </div>
        ))}
      </div>
    </div>
  );
}
