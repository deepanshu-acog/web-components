/**
 * Fallback values used when Web Awesome CSS custom properties
 * cannot be resolved from computed styles (e.g. before full theme paint or in headless contexts).
 *
 * `brand` mirrors `--wa-color-brand-60` in src/theme/theme.css (currently an
 * alias for Web Awesome's own `--wa-color-blue-60` — the brand palette is a
 * placeholder, see theme.css's own comment) — `make check` fails if they
 * drift apart (see BRAND_FALLBACK_TOKENS in tools/check_css.ts).
 */
export const WA_FALLBACK = {
    surfaceRaised: "#ffffff",
    surfaceLowered: "#f8fafc",
    surfaceBorder: "#e2e8f0",
    textNormal: "#0f172a",
    textQuiet: "#64748b",
    brand: "#3e96ff",
    secondary: "#24b1b1",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    purple: "#a855f7",
    teal: "#14b8a6",
    fontFamily: "sans-serif",
};
//# sourceMappingURL=fallbacks.js.map