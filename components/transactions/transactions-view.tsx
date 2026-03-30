"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Pencil, Search, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  GlassCard,
  Input,
  Select,
} from "@/src/components/ui";
import { useFinanceStore } from "@/src/store/use-finance-store";
import type { Transaction } from "@/src/types";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/src/lib/utils";

type TypeFilter = "all" | "income" | "expense" | "transfer";
type SortMode = "latest" | "highest" | "lowest";

function applyFiltersAndSort(
  list: Transaction[],
  search: string,
  category: string,
  typeFilter: TypeFilter,
  sort: SortMode
): Transaction[] {
  let out = list.filter((tx) => {
    const q = search.trim().toLowerCase();
    if (q && !`${tx.title} ${tx.note}`.toLowerCase().includes(q)) {
      return false;
    }
    if (category && category !== "__all__" && tx.category !== category) {
      return false;
    }
    if (typeFilter !== "all" && tx.type !== typeFilter) {
      return false;
    }
    return true;
  });

  out = [...out];
  if (sort === "latest") {
    out.sort((a, b) => b.date.localeCompare(a.date));
  } else if (sort === "highest") {
    out.sort((a, b) => b.amount - a.amount);
  } else {
    out.sort((a, b) => a.amount - b.amount);
  }
  return out;
}

function groupByDate(rows: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const tx of rows) {
    const key = tx.date;
    const prev = map.get(key) ?? [];
    prev.push(tx);
    map.set(key, prev);
  }
  return map;
}

export function TransactionsView() {
  const mounted = useMounted();
  const hide = useOrbitPrefs((s) => s.hideBalances) && mounted;

  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("__all__");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortMode>("latest");

  const categoryOptions = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filtered = useMemo(
    () =>
      applyFiltersAndSort(transactions, search, category, typeFilter, sort),
    [transactions, search, category, typeFilter, sort]
  );

  const grouped = useMemo(() => {
    const orderedDates = [...new Set(filtered.map((t) => t.date))].sort(
      (a, b) => b.localeCompare(a)
    );
    const map = groupByDate(filtered);
    return orderedDates.map((d) => ({ date: d, items: map.get(d) ?? [] }));
  }, [filtered]);

  const handleDelete = (tx: Transaction) => {
    if (
      typeof window !== "undefined" &&
      window.confirm(`Delete “${tx.title}”? This cannot be undone.`)
    ) {
      deleteTransaction(tx.id);
    }
  };

  return (
    <div className="space-y-7 sm:space-y-8">
      <GlassCard padding="md" className="border-white/[0.08]">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <Input
              label="Search"
              placeholder="Filter by title or note…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSlot={<Search className="h-4 w-4 opacity-70" />}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "__all__", label: "All categories" },
                ...categoryOptions.map((c) => ({ value: c, label: c })),
              ]}
            />
            <Select
              label="Type"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as TypeFilter)
              }
              options={[
                { value: "all", label: "All types" },
                { value: "income", label: "Income" },
                { value: "expense", label: "Expense" },
                { value: "transfer", label: "Transfer" },
              ]}
            />
            <Select
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              options={[
                {
                  value: "latest",
                  label: "Latest first",
                },
                {
                  value: "highest",
                  label: "Highest amount",
                },
                {
                  value: "lowest",
                  label: "Lowest amount",
                },
              ]}
            />
          </div>
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions match"
          description="Try clearing search or widening filters. Add a row from the ledger composer."
          action={
            <Link
              href="/transactions/new"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-b from-teal-400/20 to-teal-500/10 px-5 py-2.5 text-sm font-medium text-teal-50 ring-1 ring-teal-400/30 shadow-[0_0_28px_-6px_rgba(45,212,191,0.35)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-px hover:from-teal-400/30 hover:to-teal-500/15 hover:shadow-[0_0_36px_-4px_rgba(45,212,191,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/70 active:scale-[0.98]"
            >
              New transaction
            </Link>
          }
        />
      ) : (
        <div className="space-y-9 sm:space-y-10">
          {grouped.map(({ date, items }) => (
            <section key={date} aria-labelledby={`date-${date}`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-teal-400/90">
                  <CalendarClock className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <h2
                    id={`date-${date}`}
                    className="font-mono text-sm font-medium text-white"
                  >
                    {date}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {items.length} line{items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="relative pl-4 sm:pl-6">
                <div
                  className="pointer-events-none absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-teal-400/40 via-white/10 to-transparent sm:left-[15px]"
                  aria-hidden
                />
                <ul className="space-y-3">
                  {items.map((tx) => (
                    <li key={tx.id}>
                      <GlassCard
                        padding="md"
                        glow="none"
                        interactive
                        className="relative ml-2 border-white/[0.08] hover:border-teal-400/22 hover:shadow-[0_0_36px_-14px_rgba(45,212,191,0.22)] sm:ml-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={`/transactions/${tx.id}`}
                                className="truncate text-base font-semibold text-white transition-colors duration-200 hover:text-teal-200/95"
                              >
                                {tx.title}
                              </Link>
                              <Badge variant="muted" className="font-mono text-[10px]">
                                {tx.type}
                              </Badge>
                              {tx.recurring ? (
                                <Badge variant="accent" className="text-[10px]">
                                  Recurring
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-sm text-slate-500">
                              {tx.category}
                              <span className="text-slate-600"> · </span>
                              <span className="font-mono text-xs text-slate-500">
                                {tx.account}
                              </span>
                            </p>
                            {tx.note ? (
                              <p className="text-sm italic text-slate-500 line-clamp-2">
                                {tx.note}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
                            <span
                              className={cn(
                                "font-mono text-lg tabular-nums",
                                tx.amount >= 0
                                  ? "text-emerald-300"
                                  : "text-slate-100"
                              )}
                            >
                              {!mounted
                                ? "—"
                                : formatCurrency(tx.amount, {
                                    hide,
                                    signDisplay: "always",
                                  })}
                            </span>
                            <div className="flex gap-1">
                              <Link
                                href={`/transactions/${tx.id}`}
                                className={cn(
                                  "inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-transparent text-slate-200 ring-1 ring-white/10 transition-[background-color,color,box-shadow] duration-200 ease-out hover:bg-white/[0.1] hover:ring-white/16",
                                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/60"
                                )}
                                aria-label={`Edit ${tx.title}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                aria-label={`Delete ${tx.title}`}
                                onClick={() => handleDelete(tx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
