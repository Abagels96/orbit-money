import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
