import { z } from "zod";
import type { Transaction } from "@/src/types";

export const transactionFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((s) => {
      const n = Number.parseFloat(s.trim());
      return !Number.isNaN(n) && Number.isFinite(n);
    }, "Enter a valid number"),
  type: z.enum(["income", "expense", "transfer"]),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(80, "Category is too long"),
  date: z.string().min(1, "Date is required"),
  account: z
    .string()
    .trim()
    .min(1, "Account is required")
    .max(120, "Account label is too long"),
  note: z.string().max(500, "Note is too long"),
  recurring: z.boolean(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function defaultTransactionFormValues(): TransactionFormValues {
  return {
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    account: "Checking ·••9021",
    note: "",
    recurring: false,
  };
}

export function transactionToFormValues(tx: Transaction): TransactionFormValues {
  return {
    title: tx.title,
    amount: String(tx.amount),
    type: tx.type,
    category: tx.category,
    date: tx.date,
    account: tx.account,
    note: tx.note ?? "",
    recurring: tx.recurring,
  };
}

export function formValuesToTransactionPayload(
  values: TransactionFormValues
): Omit<Transaction, "id"> {
  const n = Number.parseFloat(values.amount.trim());
  return {
    title: values.title.trim(),
    amount: n,
    type: values.type,
    category: values.category.trim(),
    date: values.date,
    account: values.account.trim(),
    note: (values.note ?? "").trim(),
    recurring: values.recurring,
  };
}
