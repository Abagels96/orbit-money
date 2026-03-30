import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { OrbitPrefsSync } from "@/components/layout/orbit-prefs-sync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Orbit Money",
    template: "%s — Orbit Money",
  },
  description:
    "Portfolio demo: dark financial UI, mock data, localStorage preferences.",
  /**
   * Favicon: `app/icon.png` (Orbit mark). Avoid shipping a separate `app/favicon.ico`
   * unless it matches — browsers prefer `/favicon.ico` when present.
   */
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-slate-100 antialiased">
        <OrbitPrefsSync />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
