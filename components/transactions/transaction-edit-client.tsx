"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmptyState, GlassCard } from "@/src/components/ui";
import { TransactionForm } from "./transaction-form";
import { transactionToFormValues } from "./transaction-schema";
import { useFinanceStore } from "@/src/store/use-finance-store";
import { useMounted } from "@/hooks/use-mounted";

type Props = { id: string };

export function TransactionEditClient({ id }: Props) {
  const mounted = useMounted();
  const tx = useFinanceStore((s) => s.transactions.find((t) => t.id === id));

  if (!mounted) {
    return (
      <div className="space-y-6">
        <GlassCard className="h-10 max-w-xs animate-pulse" padding="none" />
        <GlassCard className="h-[520px] animate-pulse" padding="lg" />
      </div>
    );
  }

  if (!tx) {
    return (
      <>
        <Link
          href="/transactions"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-teal-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to transactions
        </Link>
        <EmptyState
          title="Transaction not found"
          description="This ID isn’t in your local ledger. It may have been deleted or the link is stale."
          action={
            <Link
              href="/transactions"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-b from-teal-400/20 to-teal-500/10 px-5 py-2.5 text-sm font-medium text-teal-50 ring-1 ring-teal-400/30 shadow-[0_0_28px_-6px_rgba(45,212,191,0.35)] transition hover:from-teal-400/30 hover:to-teal-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/70"
            >
              Back to ledger
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <Link
        href="/transactions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-teal-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to transactions
      </Link>
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-400/85">
          Revise
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Edit transaction
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Update a line in your local ledger — changes persist in the browser only.
        </p>
      </header>
      <TransactionForm
        key={id}
        mode="edit"
        transactionId={id}
        defaultValues={transactionToFormValues(tx)}
      />
    </>
  );
}
