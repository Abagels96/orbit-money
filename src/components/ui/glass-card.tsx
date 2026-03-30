import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Teal ambient edge glow (subtle). */
  glow?: "none" | "teal" | "indigo" | "rose";
  padding?: "none" | "sm" | "md" | "lg";
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

export function GlassCard({
  className,
  glow = "none",
  padding = "md",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.04] backdrop-blur-xl",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        glowClasses[glow],
        paddingClasses[padding],
        className
      )}
      {...props}
    />
  );
}
