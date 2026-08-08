/**
 * Register a custom element, safely.
 *
 * Two things go wrong without this, and both are hard to diagnose:
 *
 * 1. `customElements` does not exist when a module is imported on a server.
 *    Astro and Next.js both render on the server, so a bare
 *    `customElements.define(...)` at module scope crashes the build with an
 *    error that points at our file rather than at the cause.
 * 2. Registering the same tag twice throws. This happens whenever two copies
 *    of the package end up in one page, which is easy to do across a monorepo
 *    or a mix of bundled and CDN loading.
 *
 * Both cases are quiet no-ops here. On a server there is nothing to register;
 * if a tag is already claimed, the first definition wins.
 */
export function define(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements === "undefined") return;
  if (customElements.get(tag)) return;
  customElements.define(tag, ctor);
}
