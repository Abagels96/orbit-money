import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "accent"
  | "indigo"
  | "warning"
  | "success"
  | "danger"
  | "muted";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "border-slate-200/90 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-slate-300 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  accent:
    "border-teal-400/40 bg-teal-500/15 text-teal-900 shadow-[0_0_20px_-6px_rgba(13,148,136,0.35)] dark:border-teal-400/25 dark:bg-teal-500/15 dark:text-teal-200 dark:shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)]",
  indigo:
    "border-indigo-400/35 bg-indigo-500/12 text-indigo-900 shadow-[0_0_20px_-6px_rgba(99,102,241,0.25)] dark:border-indigo-400/20 dark:text-indigo-200 dark:shadow-[0_0_20px_-6px_rgba(99,102,241,0.3)]",
  warning:
    "border-amber-400/40 bg-amber-500/12 text-amber-900 dark:border-amber-400/25 dark:text-amber-200",
  success:
    "border-emerald-400/35 bg-emerald-500/12 text-emerald-900 dark:border-emerald-400/25 dark:text-emerald-200",
  danger:
    "border-rose-400/35 bg-rose-500/12 text-rose-900 dark:border-rose-400/25 dark:text-rose-200",
  muted:
    "border-slate-200/80 bg-transparent text-slate-600 dark:border-white/[0.06] dark:text-slate-500",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-max items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
