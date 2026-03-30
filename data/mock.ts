import type {
  Account,
  BudgetCategory,
  Goal,
  InsightItem,
  Transaction,
} from "@/types";

export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Everyday Checking",
    institution: "Northwind CU",
    kind: "checking",
    balance: 4281.52,
    last4: "9021",
  },
  {
    id: "acc-2",
    name: "High-Yield Savings",
    institution: "Northwind CU",
    kind: "savings",
    balance: 18440.0,
    last4: "4410",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    accountId: "acc-1",
    merchant: "Whole Foods Market",
    category: "Groceries",
    amount: -86.42,
    date: "2026-03-28",
  },
  {
    id: "tx-2",
    accountId: "acc-1",
    merchant: "Payroll — Northwind Labs",
    category: "Income",
    amount: 4210.0,
    date: "2026-03-27",
  },
  {
    id: "tx-3",
    accountId: "acc-1",
    merchant: "Pacific Power",
    category: "Utilities",
    amount: -98.0,
    date: "2026-03-26",
  },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { id: "b1", name: "Housing", spent: 1850, limit: 1900 },
  { id: "b2", name: "Groceries", spent: 612, limit: 700 },
  { id: "b3", name: "Dining", spent: 428, limit: 400 },
];

export const mockGoals: Goal[] = [
  {
    id: "g1",
    name: "Emergency fund",
    targetAmount: 25000,
    currentAmount: 18440,
    targetDate: "2026-12-31",
  },
  {
    id: "g2",
    name: "Trip — Tokyo",
    targetAmount: 4500,
    currentAmount: 2100,
    targetDate: "2027-04-01",
  },
];

export const mockInsights: InsightItem[] = [
  {
    id: "i1",
    title: "Spending cooled vs last month",
    body: "Discretionary categories are down; fixed costs unchanged.",
    deltaLabel: "−12% discretionary",
  },
  {
    id: "i2",
    title: "Cash buffer above target",
    body: "Liquid accounts cover ~4.2 months of modeled expenses.",
    deltaLabel: "+0.6 mo buffer",
  },
];
