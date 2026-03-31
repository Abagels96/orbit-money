"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Orbit,
  Radio,
} from "lucide-react";
import {
  Badge,
  Button,
  GlassCard,
  MetricPill,
  SectionHeader,
} from "@/src/components/ui";
import { useFinanceStore, useFinanceTotals } from "@/src/store/use-finance-store";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";
import { formatCurrency, formatPercent } from "@/src/lib/utils";
import { getInsights } from "@/src/lib/storage";
import { insightsSeed } from "@/src/data/insights";
import type { Insight, InsightTone } from "@/src/types";

function insightToneStyles(tone: InsightTone): string {
  switch (tone) {
    case "positive":
      return "border-teal-300/60 bg-gradient-to-br from-teal-50/95 to-white/80 shadow-[0_0_28px_-10px_rgba(13,148,136,0.2)] dark:border-teal-400/25 dark:from-teal-500/[0.08] dark:to-transparent dark:shadow-[0_0_28px_-10px_rgba(45,212,191,0.25)]";
    case "neutral":
      return "border-slate-200/90 bg-slate-50/90 dark:border-slate-500/20 dark:bg-slate-500/[0.06]";
    case "caution":
      return "border-amber-300/60 bg-amber-50/90 shadow-[0_0_24px_-10px_rgba(245,158,11,0.15)] dark:border-amber-400/25 dark:bg-amber-500/[0.06] dark:shadow-[0_0_24px_-10px_rgba(251,191,36,0.15)]";
    case "critical":
      return "border-rose-300/70 bg-rose-50/90 dark:border-rose-400/30 dark:bg-rose-500/[0.08]";
    case "info":
      return "border-indigo-300/60 bg-indigo-50/90 shadow-[0_0_24px_-10px_rgba(99,102,241,0.15)] dark:border-indigo-400/25 dark:bg-indigo-500/[0.07] dark:shadow-[0_0_24px_-10px_rgba(99,102,241,0.2)]";
    default:
      return "border-slate-200/90 bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.04]";
  }
}

const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition-colors duration-200 hover:text-teal-900 dark:text-teal-400/90 dark:hover:text-teal-300";

export function HomeDashboard() {
  const mounted = useMounted();
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const toggleHideBalances = useOrbitPrefs((s) => s.toggleHideBalances);
  const hide = mounted && hideBalances;

  const transactions = useFinanceStore((s) => s.transactions);
  const budgets = useFinanceStore((s) => s.budgets);
  const goals = useFinanceStore((s) => s.goals);
  const totals = useFinanceTotals();

  const [insights, setInsights] = useState<Insight[]>(insightsSeed);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInsights(getInsights()));
    return () => cancelAnimationFrame(id);
  }, []);

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [transactions]);

  return (
    <div className="space-y-9 sm:space-y-11 lg:space-y-14">
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <GlassCard
          glow="teal"
          padding="lg"
          className="relative lg:col-span-8"
        >
          <div
            className="pointer-events-none absolute -left-20 top-1/2 h-[120%] w-[120%] -translate-y-1/2 opacity-[0.12] dark:opacity-[0.12]"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(45,212,191,0.4) 60deg, transparent 120deg)",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-teal-700/90 dark:border-white/10 dark:bg-white/[0.05] dark:text-teal-400/90">
                    <Radio className="h-3 w-3" aria-hidden />
                    Ledger live
                  </span>
                  <Badge variant="muted" className="font-mono text-[10px]">
                    ORB-01
                  </Badge>
                </div>
                <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-[2.125rem]">
                  Operating balance
                </h1>
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-500 sm:text-base">
                  Aggregated from your local transaction graph — no cloud sync.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={toggleHideBalances}
                aria-pressed={hideBalances}
                className="shrink-0"
              >
                {hideBalances ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {hideBalances ? "Reveal" : "Mask"}
              </Button>
            </div>

            <div className="flex flex-col gap-2 border-l-2 border-teal-500/50 pl-5 dark:border-teal-400/40">
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-500">
                Net flow (all time)
              </p>
              {!mounted ? (
                <div className="h-14 w-64 max-w-full animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10" />
              ) : (
                <p className="font-mono text-4xl font-medium tabular-nums tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.25rem]">
                  {formatCurrency(totals.balance, { hide })}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">Asymmetric grid</Badge>
              <Badge variant="indigo">Glass stack</Badge>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-3 lg:col-span-4">
          <MetricPill
            label="Income"
            value={
              mounted ? formatCurrency(totals.income, { hide }) : "—"
            }
            sub="Inflows · typed ledger"
            tone="positive"
          />
          <MetricPill
            label="Expenses"
            value={
              mounted ? formatCurrency(totals.expenses, { hide }) : "—"
            }
            sub="Outflows · normalized"
            tone="negative"
          />
          <MetricPill
            label="Savings rate"
            value={
              mounted && totals.savingsRate != null
                ? formatPercent(totals.savingsRate, {
                    alreadyPercent: true,
                    fractionDigits: 1,
                    hide,
                  })
                : mounted
                  ? "—"
                  : "—"
            }
            sub={totals.savingsRate != null ? "Income − expenses" : "N/A"}
            tone="neutral"
          />
        </div>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-9">
        <div className="min-w-0 lg:col-span-5">
          <SectionHeader
            eyebrow="Event stream"
            title="Recent transactions"
            description="Newest signals from the local ledger."
            className="mb-5"
            actions={
              <Link href="/transactions" className={linkClass}>
                Open ledger
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
          <GlassCard glow="none" padding="md" className="relative">
            <div className="pointer-events-none absolute left-[21px] top-8 bottom-8 w-px bg-gradient-to-b from-teal-500/50 via-slate-300/40 to-transparent dark:from-teal-400/50 dark:via-white/10" />
            <ul className="relative space-y-0">
              {recent.map((tx) => (
                <li
                  key={tx.id}
                  className="flex gap-4 pb-6 last:pb-0 sm:gap-5"
                >
                  <div className="relative z-[1] flex w-11 shrink-0 justify-center pt-0.5">
                    <span
                      className={cn(
                        "flex h-3 w-3 rounded-full ring-4 ring-white dark:ring-[#0a0e16]",
                        tx.amount >= 0
                          ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] dark:bg-emerald-400 dark:shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                          : "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.45)] dark:bg-slate-500 dark:shadow-[0_0_10px_rgba(148,163,184,0.4)]"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-slate-200/80 pb-6 last:border-0 last:pb-0 dark:border-white/[0.06]">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                        {tx.title}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-sm tabular-nums",
                          tx.amount >= 0
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-slate-700 dark:text-slate-200"
                        )}
                      >
                        {!mounted
                          ? "—"
                          : formatCurrency(tx.amount, {
                              hide,
                              signDisplay: "always",
                            })}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-500">
                      <span className="font-mono">{tx.date}</span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span>{tx.category}</span>
                      {tx.recurring ? (
                        <Badge variant="muted" className="text-[10px]">
                          Recurring
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <SectionHeader
            eyebrow="Allocation mesh"
            title="Budget zones"
            description="Spend vs ceiling — mock categories from your store."
            className="mb-5"
            actions={
              <Link href="/budgets" className={linkClass}>
                Mesh detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {budgets.map((b, i) => {
              const pct = Math.min(100, (b.spent / b.limit) * 100);
              const over = b.spent > b.limit;
              return (
                <GlassCard
                  key={b.id}
                  glow={i % 2 === 0 ? "teal" : "indigo"}
                  padding="md"
                  interactive
                  className={cn(over && "ring-1 ring-rose-400/35 dark:ring-rose-400/25")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900 dark:text-white">{b.category}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        over
                          ? "bg-rose-500/15 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
                          : "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                      )}
                    >
                      {over ? "Over" : "Stable"}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-500">
                    {mounted
                      ? `${formatCurrency(b.spent, { hide })} / ${formatCurrency(b.limit, { hide })}`
                      : "—"}
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200/90 dark:bg-white/[0.06]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        over ? "bg-rose-500/90 dark:bg-rose-400/90" : "bg-teal-600/90 dark:bg-teal-400/80"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-12 lg:gap-9">
        <div className="min-w-0 lg:col-span-8">
          <SectionHeader
            eyebrow="Trajectory"
            title="Savings vectors"
            description="Targets pulled from local goal state."
            className="mb-5"
            actions={
              <Link href="/goals" className={linkClass}>
                All vectors
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((g) => {
              const pct = Math.min(100, (g.current / g.target) * 100);
              return (
                <GlassCard
                  key={g.id}
                  padding="md"
                  interactive
                  className="overflow-hidden border-slate-200/90 dark:border-white/[0.08]"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${g.color}22`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{g.name}</p>
                      <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-500">
                        Due {g.deadline}
                      </p>
                    </div>
                    <Orbit
                      className="h-5 w-5 shrink-0 opacity-50 dark:opacity-40"
                      style={{ color: g.color }}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-4 font-mono text-sm tabular-nums text-slate-800 dark:text-slate-200">
                    {!mounted ? (
                      "—"
                    ) : (
                      <>
                        {formatCurrency(g.current, { hide })}
                        <span className="text-slate-400 dark:text-slate-600"> / </span>
                        {formatCurrency(g.target, { hide })}
                      </>
                    )}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/90 dark:bg-white/[0.06]">
                    <div
                      className="h-full rounded-full opacity-90 transition-[width] duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: g.color,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-right font-mono text-[10px] text-slate-600 dark:text-slate-500">
                    {pct.toFixed(0)}% funded
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-4">
          <SectionHeader
            eyebrow="Signal queue"
            title="Smart insights"
            description="Heuristics on mock cashflow — local only."
            className="mb-5"
            actions={
              <Link href="/insights" className={linkClass}>
                Queue
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="flex flex-col gap-3">
            {insights.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-3xl border p-4 backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5",
                  insightToneStyles(item.tone)
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500">
                  {item.tone}
                </p>
                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
