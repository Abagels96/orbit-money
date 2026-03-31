# Orbit Money

Portfolio-style financial UI demo: mock data in the repo, **no backend**, preferences and ledger state in **localStorage**. Dark-first design with **light**, **dark**, and **system** themes.

## Stack

- [Next.js](https://nextjs.org) (App Router) · React · TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Zustand](https://github.com/pmndrs/zustand) for client state and prefs
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)

Project conventions for this repo are in [`AGENTS.md`](./AGENTS.md).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs at the site root in dev (no URL prefix).

Other scripts:

```bash
npm run build   # static export (see below)
npm run lint
```

## GitHub Pages

The site is built as a **static export** and deployed with **GitHub Actions** to a **project site** URL:

`https://<username>.github.io/<repository-name>/`

Configuration:

- **`next.config.ts`** — `output: "export"`, `basePath` from **`NEXT_PUBLIC_BASE_PATH`** (must match the repo name for the default GitHub Pages URL).
- **`.github/workflows/deploy-github-pages.yml`** — sets `NEXT_PUBLIC_BASE_PATH` to `/<repository name>` and uploads the `out/` folder. Adds **`out/.nojekyll`** so GitHub Pages does not ignore the `_next` assets.

**One-time setup on GitHub:** Repository **Settings → Pages → Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”), or deployment from the workflow will fail.

To sanity-check a production build locally (same base path as CI):

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/orbit-money"; npm run build
```

Serve the `out/` directory with any static file server and open the matching subpath.

## Themes

- **Header** and **Settings** include **Light**, **Dark**, and **System** (follows `prefers-color-scheme`).
- Choice is stored under the `orbit-money-prefs` key in localStorage.
- **Obsidian / Aurora** under Settings adjusts atmosphere (CSS variables) on top of the active theme.

## License / credits

See the repository owner and footer in the app for attribution.
