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
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        className
      )}
      {...props}
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.08] bg-gradient-to-br from-teal-500/15 to-indigo-600/10 shadow-[0_0_32px_-8px_rgba(45,212,191,0.25)]"
        aria-hidden
      >
        {icon ?? <Sparkles className="h-8 w-8 text-teal-300/90" strokeWidth={1.25} />}
      </div>
      <h3
        id={titleId}
        className="text-lg font-semibold tracking-tight text-white"
      >
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-8 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
