import type { Metadata } from "next";
import { TransactionEditClient } from "@/components/transactions/transaction-edit-client";
import { transactionsSeed } from "@/src/data/transactions";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return transactionsSeed.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tx = transactionsSeed.find((t) => t.id === id);
  return {
    title: tx ? tx.title : "Edit transaction",
  };
}

export default async function TransactionEditPage({ params }: Props) {
  const { id } = await params;
  return <TransactionEditClient id={id} />;
}
