"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Goal,
  LayoutDashboard,
  List,
  Menu,
  Settings,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            "pointer-events-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-[1.35rem] border border-white/[0.1] bg-[#070a12]/60 px-3 py-2.5 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.07)] backdrop-blur-2xl transition-shadow duration-300 ease-out sm:gap-4 sm:px-5 sm:py-3",
            "ring-1 ring-white/[0.06]"
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-2xl py-0.5 pr-1"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/30 to-indigo-500/20 ring-1 ring-white/15 shadow-[0_0_24px_-6px_rgba(45,212,191,0.35)] transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[0_0_32px_-4px_rgba(45,212,191,0.45)] group-hover:ring-white/25">
              <Sparkles className="h-[18px] w-[18px] text-teal-200" aria-hidden />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-400/95">
                Orbit
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">
                Money
              </span>
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1"
            aria-label="Primary"
          >
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-2xl px-2.5 py-2 text-xs font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out lg:px-3 lg:text-sm",
                    active
                      ? "bg-white/[0.11] text-white ring-1 ring-white/18 shadow-[0_0_24px_-8px_rgba(45,212,191,0.38)]"
                      : "text-slate-400 hover:bg-white/[0.07] hover:text-slate-100 active:scale-[0.98]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] text-slate-200 shadow-inner transition-[background-color,border-color,transform] duration-200 ease-out hover:border-white/[0.14] hover:bg-white/[0.11] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/60 md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[#03050a]/75 backdrop-blur-md"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute left-3 right-3 top-[5rem] z-50 max-h-[min(72vh,calc(100vh-5.5rem))] overflow-y-auto rounded-[1.35rem] border border-white/[0.12] bg-[#0a0e16]/94 p-2.5 shadow-[0_28px_56px_-16px_rgba(0,0,0,0.78)] backdrop-blur-2xl ring-1 ring-white/[0.07]"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {links.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/[0.1] text-white ring-1 ring-white/15"
                        : "text-slate-300 hover:bg-white/[0.06]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
