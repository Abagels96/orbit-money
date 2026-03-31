/** Match nav `href` to pathname (handles trailing slashes from static export). */
export function navPathActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (h === "/") return p === "/";
  return p === h || p.startsWith(`${h}/`);
}
