import type { Budget, Goal, Insight, Transaction } from "@/src/types";
import { budgetsSeed } from "@/src/data/budgets";
import { goalsSeed } from "@/src/data/goals";
import { insightsSeed } from "@/src/data/insights";
import { transactionsSeed } from "@/src/data/transactions";

/** Versioned keys so a future migration can invalidate old shapes safely. */
export const ORBIT_STORAGE_KEYS = {
  transactions: "orbit-money:v1:transactions",
  budgets: "orbit-money:v1:budgets",
  goals: "orbit-money:v1:goals",
  insights: "orbit-money:v1:insights",
} as const;

export type OrbitStorageKey =
  (typeof ORBIT_STORAGE_KEYS)[keyof typeof ORBIT_STORAGE_KEYS];

/** True when `window` and `localStorage` are available (client runtime). */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Read and parse JSON from localStorage. On SSR or on any failure, returns `fallback`.
 * Empty string is treated as missing (uses fallback).
 */
export function readLocalStorage<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T
): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null || raw === "") return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid != null && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Serialize `value` to localStorage. No-op on SSR or if storage throws (quota, private mode).
 * @returns whether the write was attempted and did not throw.
 */
export function writeLocalStorage(key: string, value: unknown): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Remove key on client; no-op on SSR. */
export function removeLocalStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function isTransactionArray(x: unknown): x is Transaction[] {
  return (
    Array.isArray(x) &&
    x.every(
      (row) =>
        row &&
        typeof row === "object" &&
        "id" in row &&
        "title" in row &&
        "amount" in row &&
        "type" in row
    )
  );
}

function isBudgetArray(x: unknown): x is Budget[] {
  return (
    Array.isArray(x) &&
    x.every(
      (row) =>
        row &&
        typeof row === "object" &&
        "id" in row &&
        "category" in row &&
        "limit" in row &&
        "spent" in row
    )
  );
}

function isGoalArray(x: unknown): x is Goal[] {
  return (
    Array.isArray(x) &&
    x.every(
      (row) =>
        row &&
        typeof row === "object" &&
        "id" in row &&
        "name" in row &&
        "target" in row &&
        "current" in row
    )
  );
}

function isInsightArray(x: unknown): x is Insight[] {
  return (
    Array.isArray(x) &&
    x.every(
      (row) =>
        row &&
        typeof row === "object" &&
        "id" in row &&
        "title" in row &&
        "description" in row &&
        "tone" in row
    )
  );
}

export function getTransactions(): Transaction[] {
  return readLocalStorage(
    ORBIT_STORAGE_KEYS.transactions,
    transactionsSeed,
    isTransactionArray
  );
}

export function setTransactions(next: Transaction[]): boolean {
  return writeLocalStorage(ORBIT_STORAGE_KEYS.transactions, next);
}

export function resetTransactions(): void {
  removeLocalStorage(ORBIT_STORAGE_KEYS.transactions);
}

export function getBudgets(): Budget[] {
  return readLocalStorage(ORBIT_STORAGE_KEYS.budgets, budgetsSeed, isBudgetArray);
}

export function setBudgets(next: Budget[]): boolean {
  return writeLocalStorage(ORBIT_STORAGE_KEYS.budgets, next);
}

export function resetBudgets(): void {
  removeLocalStorage(ORBIT_STORAGE_KEYS.budgets);
}

export function getGoals(): Goal[] {
  return readLocalStorage(ORBIT_STORAGE_KEYS.goals, goalsSeed, isGoalArray);
}

export function setGoals(next: Goal[]): boolean {
  return writeLocalStorage(ORBIT_STORAGE_KEYS.goals, next);
}

export function resetGoals(): void {
  removeLocalStorage(ORBIT_STORAGE_KEYS.goals);
}

export function getInsights(): Insight[] {
  return readLocalStorage(
    ORBIT_STORAGE_KEYS.insights,
    insightsSeed,
    isInsightArray
  );
}

export function setInsights(next: Insight[]): boolean {
  return writeLocalStorage(ORBIT_STORAGE_KEYS.insights, next);
}

export function resetInsights(): void {
  removeLocalStorage(ORBIT_STORAGE_KEYS.insights);
}

/** Clears all Orbit data keys (UI prefs in Zustand store are separate). */
export function resetAllOrbitData(): void {
  resetTransactions();
  resetBudgets();
  resetGoals();
  resetInsights();
}
