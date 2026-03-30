import { z } from "zod";
import type { Goal } from "@/src/types";

const hexColor = /^#([0-9A-Fa-f]{6})$/;

export const goalFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  target: z
    .string()
    .min(1, "Target is required")
    .refine((s) => {
      const n = Number.parseFloat(s.trim().replace(/,/g, ""));
      return !Number.isNaN(n) && Number.isFinite(n) && n > 0;
    }, "Enter a positive target"),
  current: z
    .string()
    .min(1, "Current amount is required")
    .refine((s) => {
      const n = Number.parseFloat(s.trim().replace(/,/g, ""));
      return !Number.isNaN(n) && Number.isFinite(n) && n >= 0;
    }, "Enter zero or more"),
  deadline: z.string().min(1, "Deadline is required"),
  color: z
    .string()
    .regex(hexColor, "Use a valid hex color like #2dd4bf"),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const GOAL_COLOR_PRESETS = [
  { value: "#2dd4bf", label: "Teal" },
  { value: "#a78bfa", label: "Violet" },
  { value: "#34d399", label: "Emerald" },
  { value: "#fb7185", label: "Rose" },
  { value: "#38bdf8", label: "Sky" },
  { value: "#fbbf24", label: "Amber" },
] as const;

export function defaultGoalFormValues(): GoalFormValues {
  return {
    name: "",
    target: "",
    current: "0",
    deadline: new Date().toISOString().slice(0, 10),
    color: GOAL_COLOR_PRESETS[0].value,
  };
}

export function goalToFormValues(g: Goal): GoalFormValues {
  return {
    name: g.name,
    target: String(g.target),
    current: String(g.current),
    deadline: g.deadline,
    color: hexColor.test(g.color) ? g.color : GOAL_COLOR_PRESETS[0].value,
  };
}

export function formValuesToGoalPayload(
  values: GoalFormValues
): Omit<Goal, "id"> {
  return {
    name: values.name.trim(),
    target: Number.parseFloat(values.target.trim().replace(/,/g, "")),
    current: Number.parseFloat(values.current.trim().replace(/,/g, "")),
    deadline: values.deadline,
    color: values.color.trim(),
  };
}
