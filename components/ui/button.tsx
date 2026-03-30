import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/60 disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" &&
          "bg-teal-400/15 text-teal-100 ring-1 ring-teal-400/25 hover:bg-teal-400/25",
        variant === "ghost" &&
          "bg-white/[0.06] text-slate-200 ring-1 ring-white/10 hover:bg-white/[0.1]",
        variant === "outline" &&
          "border border-white/15 bg-transparent text-slate-200 hover:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}
