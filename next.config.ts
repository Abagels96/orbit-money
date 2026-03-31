import type { NextConfig } from "next";

/** Set in CI (e.g. GitHub Actions) to match the repo name: https://user.github.io/<repo>/ */
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
const basePath =
  rawBase && rawBase.startsWith("/") ? rawBase.replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
