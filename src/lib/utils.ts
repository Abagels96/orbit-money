import type { Transaction, TransactionType } from "@/src/types";

const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "USD";

/** YYYY-MM calendar month key. */
export type YearMonth = `${number}-${number}`;

export type CurrencyFormatOptions = {
  locale?: string;
  currency?: string;
  /** When true, masks amount for screenshots / demos. */
  hide?: boolean;
  /** Pass through to Intl; default `auto`. */
  signDisplay?: "auto" | "always" | "exceptZero" | "negative" | "never";
};

/**
 * Format a numeric amount as currency. SSR-safe (uses Intl only).
 */
export function formatCurrency(
  amount: number,
  options?: CurrencyFormatOptions
): string {
  if (options?.hide) return "••••••";
  return new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE, {
    style: "currency",
    currency: options?.currency ?? DEFAULT_CURRENCY,
    signDisplay: options?.signDisplay ?? "auto",
  }).format(amount);
}

export type PercentFormatOptions = {
  /** Decimal places (default 1). */
  fractionDigits?: number;
  /** When true, masks value. */
  hide?: boolean;
  /** If true, value is already 0–100; if false, value is 0–1 (default false). */
  alreadyPercent?: boolean;
};

/**
 * Format a ratio or percent value for display (e.g. `12.4%`).
 */
export function formatPercent(
  value: number,
  options?: PercentFormatOptions
): string {
  if (options?.hide) return "•••";
  const digits = options?.fractionDigits ?? 1;
  const pct = options?.alreadyPercent ? value : value * 100;
  return `${pct.toFixed(digits)}%`;
}

/**
 * `part / whole` as 0–1, or `null` if `whole` is 0.
 */
export function ratio(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return part / whole;
}

/**
 * Percent change from `before` to `after`: `(after - before) / |before|`.
 * Returns `null` if `before === 0`.
 */
export function percentChange(before: number, after: number): number | null {
  if (before === 0) return null;
  return (after - before) / Math.abs(before);
}

export type TransactionFilter = {
  types?: TransactionType[];
  categories?: string[];
  /** Exact match on `account` string. */
  account?: string;
  /** Inclusive ISO date (YYYY-MM-DD). */
  fromDate?: string;
  /** Inclusive ISO date (YYYY-MM-DD). */
  toDate?: string;
  /** Case-insensitive match on `title` or `note`. */
  search?: string;
  recurring?: boolean;
};

function compareIsoDate(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Filter transactions immutably. Unknown fields are ignored; dates compared as strings (ISO).
 */
export function filterTransactions(
  transactions: Transaction[],
  filter: TransactionFilter
): Transaction[] {
  return transactions.filter((tx) => {
    if (filter.types?.length && !filter.types.includes(tx.type)) {
      return false;
    }
    if (filter.categories?.length && !filter.categories.includes(tx.category)) {
      return false;
    }
    if (filter.account != null && filter.account !== tx.account) {
      return false;
    }
    if (filter.fromDate != null && compareIsoDate(tx.date, filter.fromDate) < 0) {
      return false;
    }
    if (filter.toDate != null && compareIsoDate(tx.date, filter.toDate) > 0) {
      return false;
    }
    if (filter.recurring != null && filter.recurring !== tx.recurring) {
      return false;
    }
    if (filter.search != null && filter.search.trim() !== "") {
      const q = filter.search.trim().toLowerCase();
      const hay = `${tx.title} ${tx.note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export type MonthlyTotals = {
  /** Sum of amounts with `type === "income"`. */
  income: number;
  /** Sum of amounts with `type === "expense"` (typically negative). */
  expense: number;
  /** Absolute total spent: `-expense` when expense sum is negative. */
  expensesOut: number;
  /** Sum of amounts with `type === "transfer"`. */
  transfers: number;
  /** Sum of all amounts in the month (cash-flow net). */
  net: number;
  /** Count of rows in the month. */
  count: number;
};

const MONTH_RE = /^\d{4}-\d{2}$/;

/**
 * Validate `yearMonth` as `YYYY-MM`.
 */
export function isYearMonth(value: string): value is YearMonth {
  return MONTH_RE.test(value);
}

/**
 * Transactions whose `date` falls in the calendar month `yearMonth` (`YYYY-MM`).
 */
export function transactionsInMonth(
  transactions: Transaction[],
  yearMonth: string
): Transaction[] {
  if (!isYearMonth(yearMonth)) return [];
  return transactions.filter((tx) => tx.date.slice(0, 7) === yearMonth);
}

/**
 * Aggregates for one calendar month. Expense rows are expected to be negative;
 * `expensesOut` is the positive number for display (sum of outflows).
 */
export function monthlyTotals(
  transactions: Transaction[],
  yearMonth: string
): MonthlyTotals {
  const rows = transactionsInMonth(transactions, yearMonth);
  let income = 0;
  let expense = 0;
  let transfers = 0;

  for (const tx of rows) {
    if (tx.type === "income") income += tx.amount;
    else if (tx.type === "expense") expense += tx.amount;
    else if (tx.type === "transfer") transfers += tx.amount;
  }

  const expensesOut = expense <= 0 ? -expense : expense;
  const net = rows.reduce((sum, tx) => sum + tx.amount, 0);

  return {
    income,
    expense,
    expensesOut,
    transfers,
    net,
    count: rows.length,
  };
}

export type CategoryGroup = {
  category: string;
  /** Sum of `amount` for rows in this category. */
  total: number;
  count: number;
};

/**
 * Group by `category` and sum amounts. Optionally restrict to `types`.
 */
export function groupTransactionsByCategory(
  transactions: Transaction[],
  options?: { types?: TransactionType[] }
): CategoryGroup[] {
  const types = options?.types;
  const map = new Map<string, { total: number; count: number }>();

  for (const tx of transactions) {
    if (types != null && types.length > 0 && !types.includes(tx.type)) {
      continue;
    }
    const prev = map.get(tx.category) ?? { total: 0, count: 0 };
    prev.total += tx.amount;
    prev.count += 1;
    map.set(tx.category, prev);
  }

  return Array.from(map.entries())
    .map(([category, { total, count }]) => ({ category, total, count }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
}

/**
 * Same as `groupTransactionsByCategory`, returned as a plain record.
 */
export function categoryTotalsRecord(
  transactions: Transaction[],
  options?: { types?: TransactionType[] }
): Record<string, number> {
  const groups = groupTransactionsByCategory(transactions, options);
  return Object.fromEntries(groups.map((g) => [g.category, g.total]));
}
