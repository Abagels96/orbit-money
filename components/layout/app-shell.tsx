import type { ReactNode } from "react";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -20%, rgba(45, 212, 191, 0.16), transparent 50%), radial-gradient(ellipse 55% 45% at 100% 0%, rgba(99, 102, 241, 0.12), transparent), radial-gradient(ellipse 50% 40% at 0% 20%, rgba(56, 189, 248, 0.06), transparent), var(--orbit-bg)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.55) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-[5.5rem] sm:px-6 sm:pb-20 sm:pt-[5.75rem] lg:px-10 lg:pb-24">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-7xl border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-10">
        <p className="text-center text-xs leading-relaxed text-slate-500 sm:text-left">
          © 2026 Abigail Bales. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
