/**
 * Fallback values used when Web Awesome CSS custom properties
 * cannot be resolved from computed styles (e.g. before full theme paint or in headless contexts).
 *
 * `brand` mirrors `--wa-color-brand-60` in src/theme/theme.css (currently an
 * alias for Web Awesome's own `--wa-color-blue-60` — the brand palette is a
 * placeholder, see theme.css's own comment) — `make check` fails if they
 * drift apart (see BRAND_FALLBACK_TOKENS in tools/check_css.ts).
 */
export declare const WA_FALLBACK: {
    readonly surfaceRaised: "#ffffff";
    readonly surfaceLowered: "#f8fafc";
    readonly surfaceBorder: "#e2e8f0";
    readonly textNormal: "#0f172a";
    readonly textQuiet: "#64748b";
    readonly brand: "#3e96ff";
    readonly secondary: "#24b1b1";
    readonly success: "#22c55e";
    readonly warning: "#f59e0b";
    readonly danger: "#ef4444";
    readonly purple: "#a855f7";
    readonly teal: "#14b8a6";
    readonly fontFamily: "sans-serif";
};
