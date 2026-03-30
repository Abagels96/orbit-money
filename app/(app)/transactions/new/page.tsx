import type { Metadata } from "next";
import { NewTransactionScreen } from "@/components/transactions/new-transaction-screen";

export const metadata: Metadata = {
  title: "New transaction",
  description: "Add a line to your local ledger with validation.",
};

export default function NewTransactionPage() {
  return <NewTransactionScreen />;
}
