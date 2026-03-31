import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

const shell =
  "flex min-h-12 items-center gap-3 rounded-3xl border px-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] backdrop-blur-md transition-[box-shadow,border-color] duration-200 ease-out hover:border-slate-400/60 dark:border-white/[0.1] dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:hover:border-white/[0.14]";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    id: idProp,
    label,
    hint,
    error,
    leftSlot,
    rightSlot,
    disabled,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref
) {
  const uid = useId();
  const id = idProp ?? `orbit-input-${uid}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          shell,
          "border-slate-300/90 bg-white/80 focus-within:border-teal-500/45 focus-within:shadow-[0_0_24px_-8px_rgba(13,148,136,0.25)] dark:focus-within:border-teal-400/35 dark:focus-within:shadow-[0_0_24px_-8px_rgba(45,212,191,0.35)]",
          error &&
            "border-rose-400/50 focus-within:border-rose-500/55 focus-within:shadow-[0_0_24px_-8px_rgba(251,113,133,0.2)] dark:border-rose-400/40 dark:focus-within:border-rose-400/50 dark:focus-within:shadow-[0_0_24px_-8px_rgba(251,113,133,0.25)]",
          disabled && "opacity-50"
        )}
      >
        {leftSlot ? (
          <span className="shrink-0 text-slate-500 dark:text-slate-500 [&_svg]:h-4 [&_svg]:w-4">{leftSlot}</span>
        ) : null}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-600",
            "focus:outline-none",
            "disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {rightSlot ? (
          <span className="shrink-0 text-slate-500 dark:text-slate-500 [&_svg]:h-4 [&_svg]:w-4">{rightSlot}</span>
        ) : null}
      </div>
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs text-slate-600 dark:text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
