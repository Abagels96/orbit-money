import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionsView } from "@/components/transactions/transactions-view";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Ledger with search, filters, and local persistence.",
};

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Search, filter, and edit lines in your local ledger — stored in the browser only."
        actions={
          <Link
            href="/transactions/new"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-3xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/60",
              "bg-gradient-to-b from-teal-400/20 to-teal-500/10 text-teal-50 ring-1 ring-teal-400/30 shadow-[0_0_24px_-8px_rgba(45,212,191,0.3)] hover:from-teal-400/30 hover:to-teal-500/15"
            )}
          >
            Add transaction
          </Link>
        }
      />
      <TransactionsView />
    </>
  );
}
