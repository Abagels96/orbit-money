import { forwardRef, type SelectHTMLAttributes, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    id: idProp,
    label,
    hint,
    error,
    options,
    placeholder,
    disabled,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref
) {
  const uid = useId();
  const id = idProp ?? `orbit-select-${uid}`;
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
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-h-12 w-full cursor-pointer appearance-none rounded-3xl border border-slate-300/90 bg-white/85 py-3 pl-4 pr-11 text-sm text-slate-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-md transition-[box-shadow,border-color] duration-200 ease-out hover:border-teal-500/35 hover:bg-white",
            "focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:ring-offset-2 focus:ring-offset-slate-100",
            "dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-100 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:hover:border-teal-400/25 dark:hover:bg-white/[0.055] dark:focus:border-teal-400/35 dark:focus:ring-teal-400/30 dark:focus:ring-offset-[#05070d]",
            error &&
              "border-rose-400/50 focus:border-rose-500/55 focus:ring-rose-400/25 dark:border-rose-400/40 dark:focus:border-rose-400/50 dark:focus:ring-rose-400/25",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        >
          {placeholder != null ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-white text-slate-900 dark:bg-[#0f1419] dark:text-slate-100"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500"
          aria-hidden
        >
          <ChevronDown className="h-4 w-4" />
        </span>
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
