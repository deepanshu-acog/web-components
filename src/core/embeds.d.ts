/**
 * Bun's `with { type: "file" }` import (used in preview.ts) resolves to the
 * embedded file's path as a `string` at runtime. TypeScript has no native
 * understanding of that import form — these ambient declarations are what
 * make it a `string` instead of "cannot find module."
 *
 * `*.css` is safe as a wildcard: nothing in this repo imports CSS as a real
 * TS module. `*.embed` is a made-up extension for the same reason `*.js`
 * cannot be a wildcard here — this codebase's own relative imports
 * (`./base.js`, pointing at `base.ts`) are real `.js` specifiers under
 * Bun's ESM resolution, and a blanket `*.js` declaration would silently
 * turn every one of them into a bare string.
 */
declare module "*.css" {
  const path: string;
  export default path;
}
declare module "*.embed" {
  const path: string;
  export default path;
}
