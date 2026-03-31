"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransactionForm } from "./transaction-form";

export function NewTransactionScreen() {
  return (
    <>
      <Link
        href="/transactions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-600 transition hover:text-teal-800 dark:text-slate-400 dark:hover:text-teal-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to transactions
      </Link>
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700/90 dark:text-teal-400/85">
          Compose
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          New transaction
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-500">
          Add a validated line to your local ledger — stored in the browser only.
        </p>
      </header>
      <TransactionForm mode="create" />
    </>
  );
}
