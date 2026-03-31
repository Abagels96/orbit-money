import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Soft teal/indigo glow on hover/focus (ambient accent). */
  glow?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-teal-500/25 to-teal-600/15 text-teal-900 ring-1 ring-teal-500/35 hover:from-teal-500/35 hover:to-teal-600/22 hover:ring-teal-500/50 dark:from-teal-400/20 dark:to-teal-500/10 dark:text-teal-50 dark:ring-teal-400/30 dark:hover:from-teal-400/30 dark:hover:to-teal-500/15 dark:hover:ring-teal-400/45",
  secondary:
    "bg-slate-200/80 text-slate-900 ring-1 ring-slate-300/80 hover:bg-slate-200 hover:ring-slate-400/60 dark:bg-white/[0.07] dark:text-slate-100 dark:ring-white/[0.12] dark:hover:bg-white/[0.11] dark:hover:ring-white/20",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white",
  outline:
    "border border-slate-300/90 bg-transparent text-slate-800 hover:border-teal-500/40 hover:bg-teal-500/[0.08] hover:text-teal-900 dark:border-white/[0.12] dark:text-slate-200 dark:hover:border-teal-400/25 dark:hover:bg-teal-500/[0.06] dark:hover:text-teal-100",
  danger:
    "bg-rose-500/12 text-rose-800 ring-1 ring-rose-400/35 hover:bg-rose-500/20 hover:ring-rose-500/45 dark:bg-rose-500/15 dark:text-rose-100 dark:ring-rose-400/25 dark:hover:bg-rose-500/25 dark:hover:ring-rose-400/40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 gap-1.5 rounded-2xl px-3 py-1.5 text-xs",
  md: "min-h-11 gap-2 rounded-3xl px-4 py-2.5 text-sm",
  lg: "min-h-12 gap-2 rounded-3xl px-6 py-3 text-base",
};

const glowClass =
  "shadow-[0_0_28px_-6px_rgba(13,148,136,0.35)] hover:shadow-[0_0_36px_-4px_rgba(13,148,136,0.45)] focus-visible:shadow-[0_0_36px_-4px_rgba(13,148,136,0.45)] dark:shadow-[0_0_28px_-6px_rgba(45,212,191,0.35)] dark:hover:shadow-[0_0_36px_-4px_rgba(45,212,191,0.45)] dark:focus-visible:shadow-[0_0_36px_-4px_rgba(45,212,191,0.45)]";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      glow = false,
      type = "button",
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600/70 dark:focus-visible:outline-teal-400/70",
          "disabled:pointer-events-none disabled:opacity-40",
          "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          glow && variant === "primary" && glowClass,
          className
        )}
        {...props}
      >
        {leftIcon ? <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{rightIcon}</span> : null}
      </button>
    );
  }
);
