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
        "group flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/[0.12] bg-gradient-to-b from-white/[0.04] to-white/[0.015] px-5 py-16 text-center sm:px-10 sm:py-20",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_40px_-24px_rgba(0,0,0,0.5)]",
        "motion-safe:transition-[border-color,box-shadow] motion-safe:duration-300 motion-safe:ease-out",
        "hover:border-white/[0.16] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_48px_-20px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    >
      <div
        className="mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-white/[0.1] bg-gradient-to-br from-teal-500/18 to-indigo-600/12 shadow-[0_0_40px_-10px_rgba(45,212,191,0.35)] ring-1 ring-white/[0.06] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-[1.03] sm:h-[5rem] sm:w-[5rem]"
        aria-hidden
      >
        {icon ?? (
          <Sparkles
            className="h-9 w-9 text-teal-300/95 sm:h-10 sm:w-10"
            strokeWidth={1.25}
          />
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-400/80">
        No signal
      </p>
      <h3
        id={titleId}
        className="mt-2 max-w-md text-xl font-semibold tracking-tight text-white sm:text-2xl"
      >
        {title}
      </h3>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
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
