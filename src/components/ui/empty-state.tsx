import type { HTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

/**
 * Centered empty / zero-data pattern with optional action.
 */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  const uid = useId();
  const titleId = `orbit-empty-title-${uid}`;

  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className={cn(
        "group flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300/90 bg-gradient-to-b from-white/90 to-slate-50/80 px-5 py-16 text-center sm:px-10 sm:py-20",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_8px_40px_-24px_rgba(15,23,42,0.08)]",
        "motion-safe:transition-[border-color,box-shadow] motion-safe:duration-300 motion-safe:ease-out",
        "hover:border-slate-400/90 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_12px_48px_-20px_rgba(15,23,42,0.1)]",
        "dark:border-white/[0.12] dark:from-white/[0.04] dark:to-white/[0.015] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_40px_-24px_rgba(0,0,0,0.5)] dark:hover:border-white/[0.16] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_48px_-20px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      <div
        className="mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-slate-200/90 bg-gradient-to-br from-teal-500/20 to-indigo-500/15 shadow-[0_0_40px_-10px_rgba(13,148,136,0.35)] ring-1 ring-white/80 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-[1.03] dark:border-white/[0.1] dark:from-teal-500/18 dark:to-indigo-600/12 dark:shadow-[0_0_40px_-10px_rgba(45,212,191,0.35)] dark:ring-white/[0.06] sm:h-[5rem] sm:w-[5rem]"
        aria-hidden
      >
        {icon ?? (
          <Sparkles
            className="h-9 w-9 text-teal-700/95 sm:h-10 sm:w-10 dark:text-teal-300/95"
            strokeWidth={1.25}
          />
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700/85 dark:text-teal-400/80">
        No signal
      </p>
      <h3
        id={titleId}
        className="mt-2 max-w-md text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
      >
        {title}
      </h3>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-500 sm:text-base">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-9 flex flex-wrap justify-center gap-3 sm:mt-10">
          {action}
        </div>
      ) : null}
    </div>
  );
}
