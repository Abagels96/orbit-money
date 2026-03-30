"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, GlassCard, Input } from "@/src/components/ui";
import {
  goalFormSchema,
  type GoalFormValues,
  defaultGoalFormValues,
  GOAL_COLOR_PRESETS,
} from "./goal-schema";
import { cn } from "@/lib/cn";

export type GoalFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<GoalFormValues>;
  onSubmit: (values: GoalFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
};

export function GoalForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: GoalFormProps) {
  const merged = useMemo(
    () => ({
      ...defaultGoalFormValues(),
      ...defaultValues,
    }),
    [defaultValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: merged,
  });

  useEffect(() => {
    reset(merged);
  }, [merged, reset]);

  const watchColor = useWatch({ control, name: "color" });

  return (
    <GlassCard glow="teal" padding="lg" className="max-w-lg border-white/[0.1]">
      <div className="border-b border-white/[0.06] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400/85">
          {mode === "create" ? "New vector" : "Revise vector"}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          {mode === "create" ? "Add savings goal" : "Edit goal"}
        </h2>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((v) => onSubmit(v))}
        noValidate
      >
        <Input
          label="Name"
          placeholder="e.g. Emergency fund"
          error={errors.name?.message}
          {...register("name")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Target (USD)"
            inputMode="decimal"
            placeholder="28000"
            error={errors.target?.message}
            {...register("target")}
          />
          <Input
            label="Current (USD)"
            inputMode="decimal"
            placeholder="0"
            error={errors.current?.message}
            {...register("current")}
          />
        </div>
        <Input
          type="date"
          label="Deadline"
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Accent color
          </p>
          <div className="flex flex-wrap gap-2">
            {GOAL_COLOR_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={cn(
                  "h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-[#0a0e14] transition",
                  (watchColor ?? merged.color) === p.value
                    ? "ring-white"
                    : "ring-transparent hover:ring-white/40"
                )}
                style={{ backgroundColor: p.value }}
                title={p.label}
                onClick={() =>
                  setValue("color", p.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                aria-label={`Use ${p.label}`}
              />
            ))}
          </div>
          <Input
            className="mt-3"
            label="Hex"
            placeholder="#2dd4bf"
            error={errors.color?.message}
            {...register("color")}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            glow
            disabled={isSubmitting}
          >
            {submitLabel ?? (mode === "create" ? "Create goal" : "Save goal")}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
