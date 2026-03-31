import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:mb-12 sm:gap-6 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-[2rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-500 sm:mt-3 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
