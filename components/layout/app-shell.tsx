import type { ReactNode } from "react";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen min-h-[100dvh] flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-[background] duration-300"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -20%, rgba(45, 212, 191, 0.16), transparent 50%), radial-gradient(ellipse 55% 45% at 100% 0%, rgba(99, 102, 241, 0.12), transparent), radial-gradient(ellipse 50% 40% at 0% 20%, rgba(56, 189, 248, 0.06), transparent), var(--orbit-bg)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.55) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-[max(4rem,env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-20 sm:pt-[calc(5.75rem+env(safe-area-inset-top,0px))] lg:px-10 lg:pb-24">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-7xl border-t border-slate-200/80 px-4 py-8 dark:border-white/[0.06] sm:px-6 lg:px-10">
        <p className="text-center text-xs leading-relaxed text-slate-500 sm:text-left dark:text-slate-500">
          © 2026 Abigail Bales. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
