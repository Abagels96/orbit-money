import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  actions,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700/90 dark:text-teal-400/85">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-2xl sm:leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-500 sm:text-[0.9375rem]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
