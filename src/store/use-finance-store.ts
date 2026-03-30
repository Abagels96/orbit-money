"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { Budget, Goal, Transaction } from "@/src/types";
import { budgetsSeed } from "@/src/data/budgets";
import { goalsSeed } from "@/src/data/goals";
import { transactionsSeed } from "@/src/data/transactions";
import {
  getBudgets,
  getGoals,
  getTransactions,
  resetAllOrbitData,
  resetBudgets,
  resetGoals,
  resetTransactions,
  setBudgets as persistBudgets,
  setGoals as persistGoals,
  setTransactions as persistTransactions,
} from "@/src/lib/storage";

/** Persist blob version for zustand `persist` (separate from `ORBIT_STORAGE_KEYS` values). */
const FINANCE_PERSIST_VERSION = 0;

type FinanceSlice = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
};

function newEntityId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Minimal `Storage` implementation so `createJSONStorage` types line up with Zustand v5.
 * Reads/writes map to the three Orbit keys in `src/lib/storage.ts` (no duplicate blob).
 */
function createOrbitFinanceWebStorage(): Storage {
  return {
    get length() {
      return 0;
    },
    clear() {},
    getItem(key: string) {
      void key;
      if (typeof window === "undefined") return null;
      try {
        return JSON.stringify({
          state: {
            transactions: getTransactions(),
            budgets: getBudgets(),
            goals: getGoals(),
          },
          version: FINANCE_PERSIST_VERSION,
        });
      } catch {
        return null;
      }
    },
    key(index: number) {
      void index;
      return null;
    },
    removeItem(key: string) {
      void key;
      resetTransactions();
      resetBudgets();
      resetGoals();
    },
    setItem(key: string, value: string) {
      void key;
      if (typeof window === "undefined") return;
      try {
        const parsed = JSON.parse(value) as {
          state?: Partial<FinanceSlice>;
        };
        const s = parsed.state;
        if (s?.transactions !== undefined) persistTransactions(s.transactions);
        if (s?.budgets !== undefined) persistBudgets(s.budgets);
        if (s?.goals !== undefined) persistGoals(s.goals);
      } catch {
        /* ignore */
      }
    },
  };
}

export type FinanceTotals = {
  /** Sum of amounts with `type === "income"`. */
  income: number;
  /** Positive number: total outflows from expenses in the period. */
  expenses: number;
  /** Sum of all amounts (ledger / cash-flow net). */
  net: number;
  /** Same as `net` for the all-time ledger. */
  balance: number;
  /** `(income - expenses) / income` as 0–100 when `income > 0`; otherwise `null`. */
  savingsRate: number | null;
};

function computeTotals(transactions: Transaction[]): FinanceTotals {
  let income = 0;
  let expenseRaw = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else if (t.type === "expense") expenseRaw += t.amount;
  }
  const expenses =
    expenseRaw <= 0 ? -expenseRaw : expenseRaw;
  const net = transactions.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate =
    income > 0 ? ((income - expenses) / income) * 100 : null;
  return {
    income,
    expenses,
    net,
    balance: net,
    savingsRate,
  };
}

export function selectFinanceTotals(
  state: Pick<FinanceSlice, "transactions">
): FinanceTotals {
  return computeTotals(state.transactions);
}

type FinanceActions = {
  /** Clears local Orbit keys and resets store slices to seed data. */
  resetDemoData: () => void;

  addTransaction: (input: Omit<Transaction, "id"> & { id?: string }) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  setBudgets: (budgets: Budget[]) => void;
  updateBudget: (id: string, patch: Partial<Budget>) => void;

  addGoal: (input: Omit<Goal, "id"> & { id?: string }) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
};

type FinanceStore = FinanceSlice & FinanceActions;

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: transactionsSeed,
      budgets: budgetsSeed,
      goals: goalsSeed,

      resetDemoData: () => {
        resetAllOrbitData();
        set({
          transactions: transactionsSeed.map((t) => ({ ...t })),
          budgets: budgetsSeed.map((b) => ({ ...b })),
          goals: goalsSeed.map((g) => ({ ...g })),
        });
      },

      addTransaction: (input) => {
        const id = input.id ?? newEntityId("tx");
        const next: Transaction = { ...input, id };
        set((s) => ({ transactions: [...s.transactions, next] }));
      },

      updateTransaction: (id, patch) => {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch, id } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        }));
      },

      setBudgets: (budgets) => set({ budgets }),

      updateBudget: (id, patch) => {
        set((s) => ({
          budgets: s.budgets.map((b) =>
            b.id === id ? { ...b, ...patch, id } : b
          ),
        }));
      },

      addGoal: (input) => {
        const id = input.id ?? newEntityId("goal");
        const next: Goal = { ...input, id };
        set((s) => ({ goals: [...s.goals, next] }));
      },

      updateGoal: (id, patch) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, ...patch, id } : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((s) => ({
          goals: s.goals.filter((g) => g.id !== id),
        }));
      },
    }),
    {
      name: "orbit-money-finance-store",
      version: FINANCE_PERSIST_VERSION,
      storage: createJSONStorage(() => createOrbitFinanceWebStorage()),
      partialize: (s) => ({
        transactions: s.transactions,
        budgets: s.budgets,
        goals: s.goals,
      }),
    }
  )
);

/**
 * Subscribe to derived totals (income, expenses, balance, savings rate) with shallow equality.
 */
export function useFinanceTotals(): FinanceTotals {
  return useFinanceStore(useShallow((s) => selectFinanceTotals(s)));
}

/** One-off snapshot of totals without subscribing (e.g. in non-React code). */
export function getFinanceTotals(): FinanceTotals {
  return selectFinanceTotals(useFinanceStore.getState());
}
