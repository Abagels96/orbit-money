"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Orbit,
  Radio,
  Repeat,
  Sparkles,
  Waves,
} from "lucide-react";
import {
  Badge,
  GlassCard,
  SectionHeader,
} from "@/src/components/ui";
import { useFinanceStore, useFinanceTotals } from "@/src/store/use-finance-store";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/src/lib/utils";
import { getInsights } from "@/src/lib/storage";
import { insightsSeed } from "@/src/data/insights";
import type { Insight, InsightTone, Transaction } from "@/src/types";

function insightToneStyles(tone: InsightTone): string {
  switch (tone) {
    case "positive":
      return "border-teal-400/25 bg-gradient-to-br from-teal-500/[0.08] to-transparent shadow-[0_0_28px_-10px_rgba(45,212,191,0.25)]";
    case "neutral":
      return "border-slate-500/20 bg-slate-500/[0.06]";
    case "caution":
      return "border-amber-400/25 bg-amber-500/[0.06] shadow-[0_0_24px_-10px_rgba(251,191,36,0.15)]";
    case "critical":
      return "border-rose-400/30 bg-rose-500/[0.08]";
    case "info":
      return "border-indigo-400/25 bg-indigo-500/[0.07] shadow-[0_0_24px_-10px_rgba(99,102,241,0.2)]";
    default:
      return "border-white/[0.1] bg-white/[0.04]";
  }
}

const CATEGORY_ACCENTS: Record<string, string> = {
  Housing: "#a78bfa",
  Groceries: "#34d399",
  Dining: "#fbbf24",
  Transportation: "#38bdf8",
  Utilities: "#22d3ee",
  Entertainment: "#f472b6",
  Health: "#4ade80",
  Shopping: "#fb923c",
  Income: "#2dd4bf",
  Transfer: "#94a3b8",
};

function accentForCategory(cat: string): string {
  return CATEGORY_ACCENTS[cat] ?? "#64748b";
}

function aggregateExpenseByCategory(transactions: Transaction[]): {
  category: string;
  amount: number;
}[] {
  const m = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const add = Math.abs(t.amount);
    m.set(t.category, (m.get(t.category) ?? 0) + add);
  }
  return Array.from(m.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function recurringExpenseRows(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => t.type === "expense" && t.recurring);
}

export function InsightsView() {
  const mounted = useMounted();
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const hide = mounted && hideBalances;

  const transactions = useFinanceStore((s) => s.transactions);
  const totals = useFinanceTotals();

  const [insights, setInsights] = useState<Insight[]>(insightsSeed);
  useEffect(() => {
    const id = requestAnimationFrame(() => setInsights(getInsights()));
    return () => cancelAnimationFrame(id);
  }, []);

  const categoryRows = useMemo(
    () => aggregateExpenseByCategory(transactions),
    [transactions]
  );

  const expenseTotal = useMemo(
    () => categoryRows.reduce((s, r) => s + r.amount, 0),
    [categoryRows]
  );

  const recurring = useMemo(
    () =>
      [...recurringExpenseRows(transactions)].sort((a, b) =>
        a.title.localeCompare(b.title)
      ),
    [transactions]
  );

  const recurringSum = useMemo(
    () => recurring.reduce((s, t) => s + Math.abs(t.amount), 0),
    [recurring]
  );

  const ratioIncome =
    totals.income + totals.expenses > 0
      ? totals.income / (totals.income + totals.expenses)
      : 0.5;

  return (
    <div className="space-y-11 sm:space-y-14 lg:space-y-[4.25rem]">
      {/* Hero — narrative band */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-gradient-to-br from-[#0a1018] via-[#070a10] to-[#0c1420] px-5 py-10 shadow-[0_8px_48px_-24px_rgba(0,0,0,0.55)] sm:rounded-[2rem] sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px),
              linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-[90px]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-400/90">
              <Waves className="h-3.5 w-3.5" aria-hidden />
              Signal deck
            </span>
            <h2 className="text-[1.65rem] font-semibold leading-snug tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
              Read the ledger like a story — flows, habits, and where attention
              earns the most.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500">
              Derived from your local transaction store. No cloud analytics;
              visuals are handcrafted CSS, not chart widgets.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Badge variant="muted" className="font-mono text-[10px]">
              ORB-INSIGHT
            </Badge>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {transactions.length} ledger lines
            </span>
          </div>
        </div>
      </section>

      {/* Income vs expense — flow meter */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Liquidity"
          title="Income vs expense"
          description="Relative scale of inflows and outflows on the same axis — your net sits in the balance between them."
        />

        <div className="grid gap-7 lg:grid-cols-12">
          <GlassCard
            glow="teal"
            padding="lg"
            className="relative overflow-hidden lg:col-span-7"
          >
            <div
              className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl"
              aria-hidden
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Flow composition
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Width mirrors share of total absolute movement (income + spend).
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex h-16 w-full overflow-hidden rounded-2xl ring-1 ring-white/[0.08]">
                <div
                  className="relative flex min-w-0 items-center justify-center bg-gradient-to-br from-teal-400/35 via-teal-500/20 to-teal-600/10 transition-[flex] duration-700"
                  style={{
                    flexGrow: Math.max(totals.income, 1),
                    flexBasis: 0,
                  }}
                >
                  <span className="px-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-teal-100/90">
                    In
                  </span>
                </div>
                <div
                  className="relative flex min-w-0 items-center justify-center bg-gradient-to-br from-rose-400/25 via-rose-500/15 to-rose-900/20 transition-[flex] duration-700"
                  style={{
                    flexGrow: Math.max(totals.expenses, 1),
                    flexBasis: 0,
                  }}
                >
                  <span className="px-2 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-rose-100/85">
                    Out
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-400/80" />
                  Income share{" "}
                  <span className="font-mono text-slate-300">
                    {(ratioIncome * 100).toFixed(0)}%
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                  Expense share{" "}
                  <span className="font-mono text-slate-300">
                    {((1 - ratioIncome) * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <GlassCard padding="lg" className="flex-1 border-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-400/85">
                    Inflows
                  </p>
                  <p className="mt-2 font-mono text-2xl tabular-nums text-white">
                    {formatCurrency(totals.income, { hide })}
                  </p>
                </div>
                <span className="rounded-2xl border border-teal-400/20 bg-teal-500/10 p-2 text-teal-300">
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Sum of income-tagged ledger lines.
              </p>
            </GlassCard>

            <GlassCard padding="lg" className="flex-1 border-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400/85">
                    Outflows
                  </p>
                  <p className="mt-2 font-mono text-2xl tabular-nums text-white">
                    {formatCurrency(totals.expenses, { hide })}
                  </p>
                </div>
                <span className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-2 text-rose-300">
                  <ArrowDownRight className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Expense lines only (transfers excluded from spend).
              </p>
            </GlassCard>

            <GlassCard
              glow="indigo"
              padding="lg"
              className="border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.07] to-transparent"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/90">
                Net over ledger
              </p>
              <p className="mt-2 font-mono text-2xl tabular-nums text-white">
                {formatCurrency(totals.net, { hide })}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Cash-flow net from all signed amounts (includes transfers).
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Category chromatograph + breakdown */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Allocation"
          title="Category spending"
          description="A chromatograph strip shows how expense mass distributes; rows below add precision."
        />

        <GlassCard padding="lg" className="border-white/[0.08]">
          {expenseTotal <= 0 ? (
            <p className="text-sm text-slate-500">No expense activity to chart.</p>
          ) : (
            <>
              <div
                className="flex h-14 w-full overflow-hidden rounded-2xl ring-1 ring-white/[0.06]"
                role="img"
                aria-label="Expense share by category"
              >
                {categoryRows.map((row) => {
                  return (
                    <div
                      key={row.category}
                      className="relative min-w-0 transition-[flex] duration-500"
                      style={{
                        flexGrow: row.amount,
                        flexBasis: 0,
                        background: `linear-gradient(180deg, ${accentForCategory(row.category)}cc, ${accentForCategory(row.category)}44)`,
                        boxShadow: `inset 0 -2px 0 ${accentForCategory(row.category)}66`,
                      }}
                      title={`${row.category}: ${row.amount.toFixed(2)}`}
                    />
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {categoryRows.map((row) => (
                  <span
                    key={row.category}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: accentForCategory(row.category),
                        boxShadow: `0 0 8px ${accentForCategory(row.category)}88`,
                      }}
                    />
                    {row.category}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 space-y-5">
            {categoryRows.map((row, i) => {
              const pct =
                expenseTotal > 0 ? (row.amount / expenseTotal) * 100 : 0;
              const maxAmt = categoryRows[0]?.amount ?? 1;
              const barPct = maxAmt > 0 ? (row.amount / maxAmt) * 100 : 0;
              const accent = accentForCategory(row.category);
              return (
                <div
                  key={row.category}
                  className={cn(
                    "grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-center",
                    i > 0 && "border-t border-white/[0.05] pt-5"
                  )}
                >
                  <div>
                    <p className="font-medium text-white">{row.category}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      {pct.toFixed(1)}% of spend
                    </p>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                        boxShadow: `0 0 14px ${accent}44`,
                      }}
                    />
                  </div>
                  <p className="font-mono text-sm tabular-nums text-slate-200 sm:text-right">
                    {formatCurrency(row.amount, { hide })}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </section>

      {/* Recurring */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Rhythm"
          title="Recurring expenses"
          description="Autopay and subscriptions surfaced from flagged recurring lines in your ledger."
          actions={
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-slate-400">
              Σ {formatCurrency(recurringSum, { hide })}
            </span>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recurring.length === 0 ? (
            <GlassCard padding="lg" className="sm:col-span-2 xl:col-span-3">
              <p className="text-sm text-slate-500">
                No recurring expense rows in the current store.
              </p>
            </GlassCard>
          ) : (
            recurring.map((t) => (
              <GlassCard
                key={t.id}
                padding="md"
                className="group border-white/[0.07] transition hover:border-teal-400/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                      <Repeat className="h-3.5 w-3.5 shrink-0 text-teal-400/70" />
                      {t.category}
                    </p>
                    <p className="mt-2 truncate font-medium text-white">
                      {t.title}
                    </p>
                  </div>
                  <Orbit
                    className="h-4 w-4 shrink-0 text-slate-600 opacity-60 transition group-hover:text-teal-400/80"
                    aria-hidden
                  />
                </div>
                <p className="mt-4 font-mono text-lg tabular-nums text-slate-200">
                  {formatCurrency(Math.abs(t.amount), { hide })}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">
                  {t.date}
                </p>
              </GlassCard>
            ))
          )}
        </div>
      </section>

      {/* Smart insights */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Heuristics"
          title="Smart signals"
          description="Narrative hints seeded for the demo — swap copy or wire rules without touching chart libraries."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {insights.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "rounded-3xl border p-6 backdrop-blur-md transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 sm:p-7",
                insightToneStyles(item.tone),
                i % 3 === 1 && "lg:mt-6",
                i % 3 === 2 && "lg:-mt-2"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/20">
                  <Sparkles className="h-4 w-4 text-teal-400/80" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.tone}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Radio className="h-4 w-4 text-teal-500/60" aria-hidden />
          <span>
            All figures reflect{" "}
            <span className="font-mono text-slate-400">localStorage</span>{" "}
            state — refresh-safe, offline-first.
          </span>
        </div>
        <Badge variant="muted" className="font-mono text-[10px]">
          CSS / Tailwind only
        </Badge>
      </div>
    </div>
  );
}
