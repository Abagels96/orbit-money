export type AccountKind = "checking" | "savings" | "credit" | "investment";

export interface Account {
  id: string;
  name: string;
  institution: string;
  kind: AccountKind;
  balance: number;
  last4: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  pending?: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface InsightItem {
  id: string;
  title: string;
  body: string;
  deltaLabel: string;
}
