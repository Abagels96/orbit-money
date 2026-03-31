import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { OrbitPrefsSync } from "@/components/layout/orbit-prefs-sync";
import { ThemeInitScript } from "@/components/layout/theme-init-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Orbit Money",
    template: "%s — Orbit Money",
  },
  description:
    "Portfolio demo: dark financial UI, mock data, localStorage preferences.",
  /**
   * Favicon: `app/icon.png` (Orbit mark). Paths include `NEXT_PUBLIC_BASE_PATH` for GitHub Pages.
   */
  icons: {
    icon: [{ url: `${assetBase}/icon.png`, type: "image/png" }],
    apple: [{ url: `${assetBase}/apple-icon.png`, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-slate-900 antialiased dark:text-slate-100">
        <ThemeInitScript />
        <OrbitPrefsSync />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
