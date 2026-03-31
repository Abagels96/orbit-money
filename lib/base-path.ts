/** Matches `basePath` in `next.config.ts` (set via `NEXT_PUBLIC_BASE_PATH` in GitHub Actions). */
export const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
