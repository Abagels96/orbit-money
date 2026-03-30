import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Teal ambient edge glow (subtle). */
  glow?: "none" | "teal" | "indigo" | "rose";
  padding?: "none" | "sm" | "md" | "lg";
  /** Lift + shadow on hover (lists, clickable rows). */
  interactive?: boolean;
};

const glowClasses = {
  none: "",
  teal: "shadow-[0_0_40px_-12px_rgba(45,212,191,0.22)]",
  indigo: "shadow-[0_0_40px_-12px_rgba(99,102,241,0.2)]",
  rose: "shadow-[0_0_40px_-12px_rgba(251,113,133,0.18)]",
} as const;

const paddingClasses = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

/** Layered shadow + inset highlight for “console panel” depth. */
const depthClasses =
  "shadow-[0_4px_32px_-14px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)]";

const interactiveClasses =
  "cursor-default hover:border-white/[0.12] hover:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.62),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-px motion-safe:transition-[box-shadow,border-color,transform] motion-safe:duration-300 motion-safe:ease-out";

export function GlassCard({
  className,
  glow = "none",
  padding = "md",
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.04] backdrop-blur-xl",
        depthClasses,
        "motion-safe:transition-[box-shadow,border-color] motion-safe:duration-300 motion-safe:ease-out",
        glowClasses[glow],
        interactive && interactiveClasses,
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}
