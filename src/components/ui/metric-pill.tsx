import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MetricPillTone = "default" | "positive" | "negative" | "neutral";

export type MetricPillProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  /** Secondary line (e.g. delta or subtitle). */
  sub?: ReactNode;
  tone?: MetricPillTone;
};

const toneClasses: Record<MetricPillTone, string> = {
  default:
    "border-slate-200/90 bg-white/90 text-slate-900 ring-1 ring-slate-200/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-slate-100 dark:ring-white/[0.06]",
  positive:
    "border-emerald-400/35 bg-emerald-500/10 text-emerald-900 ring-1 ring-emerald-400/25 shadow-[0_0_24px_-8px_rgba(16,185,129,0.2)] dark:border-emerald-400/20 dark:bg-emerald-500/[0.08] dark:text-emerald-100 dark:shadow-[0_0_24px_-8px_rgba(52,211,153,0.25)]",
  negative:
    "border-rose-400/35 bg-rose-500/10 text-rose-900 ring-1 ring-rose-400/25 shadow-[0_0_24px_-8px_rgba(251,113,133,0.18)] dark:border-rose-400/20 dark:bg-rose-500/[0.08] dark:text-rose-100 dark:shadow-[0_0_24px_-8px_rgba(251,113,133,0.2)]",
  neutral:
    "border-slate-300/80 bg-slate-100/90 text-slate-800 ring-1 ring-slate-300/60 dark:border-slate-500/20 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-white/[0.08]",
};

export function MetricPill({
  className,
  label,
  value,
  sub,
  tone = "default",
  ...props
}: MetricPillProps) {
  return (
    <div
      className={cn(
        "inline-flex min-w-[8rem] max-w-full flex-col gap-1 rounded-3xl border px-4 py-3",
        "motion-safe:transition-[box-shadow,border-color,transform] motion-safe:duration-300 motion-safe:ease-out",
        "hover:-translate-y-px hover:shadow-[0_12px_36px_-16px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.45)]",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums tracking-tight">
        {value}
      </span>
      {sub ? (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{sub}</span>
      ) : null}
    </div>
  );
}
