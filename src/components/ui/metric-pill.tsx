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
    "border-white/[0.1] bg-white/[0.05] text-slate-100 ring-1 ring-white/[0.06]",
  positive:
    "border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-100 ring-1 ring-emerald-400/15 shadow-[0_0_24px_-8px_rgba(52,211,153,0.25)]",
  negative:
    "border-rose-400/20 bg-rose-500/[0.08] text-rose-100 ring-1 ring-rose-400/15 shadow-[0_0_24px_-8px_rgba(251,113,133,0.2)]",
  neutral:
    "border-slate-500/20 bg-slate-500/10 text-slate-200 ring-1 ring-white/[0.08]",
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
        toneClasses[tone],
        className
      )}
      {...props}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums tracking-tight">
        {value}
      </span>
      {sub ? (
        <span className="text-xs font-medium text-slate-400">{sub}</span>
      ) : null}
    </div>
  );
}
