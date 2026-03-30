"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button, GlassCard, Input, Select } from "@/src/components/ui";
import { useFinanceStore } from "@/src/store/use-finance-store";
import {
  transactionFormSchema,
  type TransactionFormValues,
  defaultTransactionFormValues,
  formValuesToTransactionPayload,
} from "./transaction-schema";
import { cn } from "@/lib/cn";

export type TransactionFormProps = {
  mode: "create" | "edit";
  /** Required when mode is `edit`. */
  transactionId?: string;
  /** Merged on top of defaults (typically from `transactionToFormValues`). */
  defaultValues?: Partial<TransactionFormValues>;
};

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" },
];

export function TransactionForm({
  mode,
  transactionId,
  defaultValues,
}: TransactionFormProps) {
  const router = useRouter();
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);

  const merged = useMemo(
    () => ({
      ...defaultTransactionFormValues(),
      ...defaultValues,
    }),
    [defaultValues]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: merged,
  });

  useEffect(() => {
    reset(merged);
  }, [merged, reset]);

  const onSubmit = (values: TransactionFormValues) => {
    const payload = formValuesToTransactionPayload(values);
    if (mode === "create") {
      addTransaction(payload);
      router.push("/transactions");
      return;
    }
    if (mode === "edit" && transactionId) {
      updateTransaction(transactionId, payload);
      router.push("/transactions");
    }
  };

  const noteRegister = register("note");

  return (
    <GlassCard
      glow="teal"
      padding="lg"
      className="relative max-w-2xl overflow-hidden border-white/[0.1]"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-3 border-b border-white/[0.06] pb-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/25 to-indigo-500/20 ring-1 ring-white/10">
          <Sparkles className="h-5 w-5 text-teal-200" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400/85">
            Ledger composer
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {mode === "create" ? "New line" : "Edit line"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Validated locally — persists to your browser via the finance store.
          </p>
        </div>
      </div>

      <form
        className="relative mt-6 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          label="Title"
          placeholder="e.g. Payroll, Whole Foods"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label="Amount (USD)"
          inputMode="decimal"
          placeholder="-42.00 or 1200"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              name={field.name}
              ref={field.ref}
              options={typeOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              error={errors.type?.message}
            />
          )}
        />
        <Input
          label="Category"
          placeholder="Groceries, Housing…"
          error={errors.category?.message}
          {...register("category")}
        />
        <Input
          type="date"
          label="Date"
          error={errors.date?.message}
          {...register("date")}
        />
        <Input
          label="Account"
          placeholder="Checking ·••9021"
          error={errors.account?.message}
          {...register("account")}
        />
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Note
          </label>
          <textarea
            className={cn(
              "min-h-[96px] w-full rounded-3xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] placeholder:text-slate-600",
              "focus:border-teal-400/35 focus:outline-none focus:ring-2 focus:ring-teal-400/25",
              errors.note && "border-rose-400/40"
            )}
            placeholder="Optional context"
            rows={3}
            {...noteRegister}
          />
          {errors.note ? (
            <p className="mt-1.5 text-xs text-rose-400" role="alert">
              {errors.note.message}
            </p>
          ) : null}
        </div>
        <Controller
          name="recurring"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-teal-500 focus:ring-teal-400/50"
              />
              <span className="text-sm text-slate-300">Recurring</span>
            </label>
          )}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/transactions")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            glow
            disabled={isSubmitting}
          >
            {mode === "create" ? "Add to ledger" : "Save changes"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
