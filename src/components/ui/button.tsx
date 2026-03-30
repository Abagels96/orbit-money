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
    "bg-gradient-to-b from-teal-400/20 to-teal-500/10 text-teal-50 ring-1 ring-teal-400/30 hover:from-teal-400/30 hover:to-teal-500/15 hover:ring-teal-400/45",
  secondary:
    "bg-white/[0.07] text-slate-100 ring-1 ring-white/[0.12] hover:bg-white/[0.11] hover:ring-white/20",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
  outline:
    "border border-white/[0.12] bg-transparent text-slate-200 hover:border-teal-400/25 hover:bg-teal-500/[0.06] hover:text-teal-100",
  danger:
    "bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/25 hover:bg-rose-500/25 hover:ring-rose-400/40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 gap-1.5 rounded-2xl px-3 py-1.5 text-xs",
  md: "min-h-11 gap-2 rounded-3xl px-4 py-2.5 text-sm",
  lg: "min-h-12 gap-2 rounded-3xl px-6 py-3 text-base",
};

const glowClass =
  "shadow-[0_0_28px_-6px_rgba(45,212,191,0.35)] hover:shadow-[0_0_36px_-4px_rgba(45,212,191,0.45)] focus-visible:shadow-[0_0_36px_-4px_rgba(45,212,191,0.45)]";

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
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/70",
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
