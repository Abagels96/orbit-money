import Script from "next/script";
import { ORBIT_PREFS_STORAGE_KEY } from "@/lib/theme";

/** Runs before interactive hydration to reduce light/dark flash. */
export function ThemeInitScript() {
  const js = `(function(){
  try {
    var raw = localStorage.getItem(${JSON.stringify(ORBIT_PREFS_STORAGE_KEY)});
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var mode = parsed.state && parsed.state.colorMode;
    if (!mode) return;
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.dataset.orbitTheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();`;

  return (
    <Script id="orbit-theme-init" strategy="beforeInteractive">
      {js}
    </Script>
  );
}
