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
    "border-white/[0.1] bg-white/[0.06] text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  accent:
    "border-teal-400/25 bg-teal-500/15 text-teal-200 shadow-[0_0_20px_-6px_rgba(45,212,191,0.35)]",
  indigo:
    "border-indigo-400/20 bg-indigo-500/12 text-indigo-200 shadow-[0_0_20px_-6px_rgba(99,102,241,0.3)]",
  warning:
    "border-amber-400/25 bg-amber-500/12 text-amber-200",
  success:
    "border-emerald-400/25 bg-emerald-500/12 text-emerald-200",
  danger:
    "border-rose-400/25 bg-rose-500/12 text-rose-200",
  muted:
    "border-white/[0.06] bg-transparent text-slate-500",
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
