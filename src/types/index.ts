/** Ledger line: inflows positive, outflows negative. */
export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  account: string;
  note: string;
  recurring: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export type InsightTone = "positive" | "neutral" | "caution" | "critical" | "info";

export interface Insight {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
}
