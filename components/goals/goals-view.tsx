"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import {
  Button,
  EmptyState,
  GlassCard,
} from "@/src/components/ui";
import { GoalForm } from "./goal-form";
import {
  formValuesToGoalPayload,
  goalToFormValues,
  type GoalFormValues,
} from "./goal-schema";
import { useFinanceStore } from "@/src/store/use-finance-store";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";
import { useMounted } from "@/hooks/use-mounted";
import { formatCurrency } from "@/src/lib/utils";
import type { Goal } from "@/src/types";

/** `null` closed, `"create"` new goal, or goal `id` for edit. */
type GoalSheet = null | "create" | string;

function GoalOrbCard({
  goal,
  hide,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  hide: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const pct =
    goal.target > 0
      ? Math.min(100, Math.max(0, (goal.current / goal.target) * 100))
      : 0;
  const remaining = Math.max(0, goal.target - goal.current);

  const deadlineLabel = useMemo(() => {
    try {
      const d = new Date(goal.deadline + "T12:00:00");
      if (Number.isNaN(d.getTime())) return goal.deadline;
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
    } catch {
      return goal.deadline;
    }
  }, [goal.deadline]);

  return (
    <GlassCard
      padding="lg"
      className="group relative overflow-hidden border-white/[0.08] transition hover:border-white/[0.12]"
      style={{
        boxShadow: `inset 0 0 0 1px ${goal.color}28, 0 0 48px -20px ${goal.color}40`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.12] blur-3xl"
        style={{ backgroundColor: goal.color }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div
            className="h-40 w-40 rounded-full p-[5px]"
            style={{
              background: `conic-gradient(from -90deg, ${goal.color} ${pct}%, rgba(255,255,255,0.07) ${pct}%)`,
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#070a10]/95 ring-1 ring-white/[0.06]">
              <span
                className="font-mono text-3xl font-semibold tabular-nums text-white"
                style={{ textShadow: `0 0 24px ${goal.color}55` }}
              >
                {pct.toFixed(0)}%
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                funded
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                {goal.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-slate-500">
                Due {deadlineLabel}
              </p>
            </div>
            <div className="flex shrink-0 gap-1 opacity-80 transition group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-slate-400 hover:text-teal-300"
                onClick={onEdit}
                aria-label={`Edit ${goal.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-slate-400 hover:text-rose-300"
                onClick={onDelete}
                aria-label={`Delete ${goal.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-4 font-mono text-sm tabular-nums text-slate-200">
            {formatCurrency(goal.current, { hide })}
            <span className="text-slate-600"> / </span>
            {formatCurrency(goal.target, { hide })}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            <span className="text-slate-400">{formatCurrency(remaining, { hide })}</span>{" "}
            to go
          </p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full opacity-95 transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: goal.color,
                boxShadow: `0 0 12px ${goal.color}66`,
              }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function FormModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030508]/75 backdrop-blur-md"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="relative z-[101] w-full max-w-lg"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  open,
  name,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#030508]/80 backdrop-blur-sm"
        aria-label="Cancel"
        onClick={onCancel}
      />
      <GlassCard
        glow="teal"
        padding="lg"
        className="relative z-[111] max-w-md border-white/[0.1]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-delete-title"
      >
        <h2
          id="goal-delete-title"
          className="text-lg font-semibold text-white"
        >
          Delete goal?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Remove &ldquo;{name}&rdquo; from your savings vectors. This cannot be
          undone.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="danger" glow onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

export function GoalsView() {
  const mounted = useMounted();
  const hideBalances = useOrbitPrefs((s) => s.hideBalances);
  const hide = mounted && hideBalances;

  const goals = useFinanceStore(useShallow((s) => s.goals));
  const addGoal = useFinanceStore((s) => s.addGoal);
  const updateGoal = useFinanceStore((s) => s.updateGoal);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);

  const [sheet, setSheet] = useState<GoalSheet>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [goals]);

  const editId = typeof sheet === "string" ? sheet : null;
  const editingGoal = editId ? goals.find((g) => g.id === editId) : undefined;

  const closeSheet = useCallback(() => setSheet(null), []);

  const handleCreate = useCallback(
    (values: GoalFormValues) => {
      addGoal(formValuesToGoalPayload(values));
      closeSheet();
    },
    [addGoal, closeSheet]
  );

  const handleEdit = useCallback(
    (goalId: string, values: GoalFormValues) => {
      updateGoal(goalId, formValuesToGoalPayload(values));
      closeSheet();
    },
    [updateGoal, closeSheet]
  );

  const deleteTarget = deleteId
    ? goals.find((g) => g.id === deleteId)
    : undefined;

  return (
    <>
      {sortedGoals.length > 0 ? (
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            variant="primary"
            glow
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setSheet("create")}
          >
            Add goal
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {sortedGoals.length === 0 ? (
          <div className="lg:col-span-2">
            <EmptyState
              icon={<Target className="h-7 w-7 text-teal-400/80" />}
              title="No savings vectors yet"
              description="Define a target amount, track progress, and keep every goal in local storage — private by default."
              action={
                <Button
                  type="button"
                  variant="primary"
                  glow
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setSheet("create")}
                >
                  Add goal
                </Button>
              }
            />
          </div>
        ) : (
          sortedGoals.map((g) => (
            <GoalOrbCard
              key={g.id}
              goal={g}
              hide={hide}
              onEdit={() => setSheet(g.id)}
              onDelete={() => setDeleteId(g.id)}
            />
          ))
        )}
      </div>

      <FormModal open={sheet === "create"} onClose={closeSheet}>
        <GoalForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={closeSheet}
        />
      </FormModal>

      <FormModal
        open={Boolean(editId && editingGoal)}
        onClose={closeSheet}
      >
        {editingGoal ? (
          <GoalForm
            mode="edit"
            defaultValues={goalToFormValues(editingGoal)}
            onSubmit={(v) => handleEdit(editingGoal.id, v)}
            onCancel={closeSheet}
          />
        ) : null}
      </FormModal>

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        name={deleteTarget?.name ?? ""}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteGoal(deleteId);
          setDeleteId(null);
        }}
      />
    </>
  );
}
