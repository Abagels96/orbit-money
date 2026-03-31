"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Goal,
  LayoutDashboard,
  List,
  Menu,
  Monitor,
  Moon,
  Settings,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { assetBasePath } from "@/lib/base-path";
import { navPathActive } from "@/lib/nav-path";
import { cn } from "@/lib/cn";
import type { OrbitColorMode } from "@/lib/theme";
import { useOrbitPrefs } from "@/store/use-orbit-prefs";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const shell =
  "pointer-events-auto flex w-full max-w-7xl items-center justify-between gap-2 rounded-[1.35rem] border px-2.5 py-2 shadow-[0_12px_48px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-2xl transition-shadow duration-300 ease-out ring-1 ring-slate-200/80 dark:border-white/[0.1] dark:bg-[#070a12]/60 dark:shadow-[0_12px_48px_-16px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.07)] dark:ring-white/[0.06] sm:gap-4 sm:px-5 sm:py-3";

const themeOptions: { mode: OrbitColorMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light theme", Icon: Sun },
  { mode: "dark", label: "Dark theme", Icon: Moon },
  { mode: "system", label: "Match system", Icon: Monitor },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const colorMode = useOrbitPrefs((s) => s.colorMode);
  const setColorMode = useOrbitPrefs((s) => s.setColorMode);

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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5 sm:pt-4">
        <div className={cn(shell, "border-slate-200/90 bg-white/75")}>
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-2 rounded-2xl py-0.5 pr-1"
            onClick={() => setOpen(false)}
          >
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/90 shadow-[0_0_24px_-6px_rgba(13,148,136,0.25)] transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[0_0_32px_-4px_rgba(13,148,136,0.35)] group-hover:ring-slate-300/90 dark:bg-[#070a12] dark:ring-white/15 dark:shadow-[0_0_24px_-6px_rgba(45,212,191,0.35)] dark:group-hover:shadow-[0_0_32px_-4px_rgba(45,212,191,0.45)] dark:group-hover:ring-white/25">
              <Image
                src={`${assetBasePath}/orbit-mark.png`}
                alt=""
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </span>
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/95 dark:text-teal-400/95">
                Orbit
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                Money
              </span>
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1"
            aria-label="Primary"
          >
            {links.map(({ href, label, icon: Icon }) => {
              const active = navPathActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-2xl px-2.5 py-2 text-xs font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out lg:px-3 lg:text-sm",
                    active
                      ? "bg-slate-200/90 text-slate-900 ring-1 ring-slate-300/80 shadow-[0_0_24px_-8px_rgba(13,148,136,0.22)] dark:bg-white/[0.11] dark:text-white dark:ring-white/18 dark:shadow-[0_0_24px_-8px_rgba(45,212,191,0.38)]"
                      : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-white/[0.07] dark:hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div
              className="hidden items-center rounded-2xl border border-slate-200/90 bg-slate-50/90 p-0.5 sm:flex dark:border-white/[0.1] dark:bg-white/[0.04]"
              role="group"
              aria-label="Theme"
            >
              {themeOptions.map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={colorMode === mode}
                  onClick={() => setColorMode(mode)}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                    colorMode === mode
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/90 dark:bg-white/[0.12] dark:text-white dark:ring-white/15"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/80 text-slate-800 shadow-inner transition-[background-color,border-color,transform] duration-200 ease-out hover:border-slate-300/90 hover:bg-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600/60 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-white/[0.14] dark:hover:bg-white/[0.11] dark:focus-visible:outline-teal-400/60 md:hidden"
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
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md dark:bg-[#03050a]/75"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute left-3 right-3 top-[max(5.25rem,env(safe-area-inset-top,0px)+4.5rem)] z-50 max-h-[min(72vh,calc(100dvh-5.5rem-env(safe-area-inset-top,0px)))] overflow-y-auto overscroll-contain rounded-[1.35rem] border border-slate-200/90 bg-white/95 p-2.5 shadow-[0_28px_56px_-16px_rgba(15,23,42,0.2)] backdrop-blur-2xl ring-1 ring-slate-200/80 dark:border-white/[0.12] dark:bg-[#0a0e16]/94 dark:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.78)] dark:ring-white/[0.07]"
          >
            <div
              className="mb-2 flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-1 dark:border-white/[0.1] dark:bg-white/[0.04]"
              role="group"
              aria-label="Theme"
            >
              {themeOptions.map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={colorMode === mode}
                  onClick={() => setColorMode(mode)}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-colors",
                    colorMode === mode
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/90 dark:bg-white/[0.12] dark:text-white dark:ring-white/15"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="hidden min-[380px]:inline">{label.replace(" theme", "").replace("Match ", "")}</span>
                </button>
              ))}
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {links.map(({ href, label, icon: Icon }) => {
                const active = navPathActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-200/90 text-slate-900 ring-1 ring-slate-300/80 dark:bg-white/[0.1] dark:text-white dark:ring-white/15"
                        : "text-slate-700 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:bg-white/[0.06]"
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
