/**
 * The Astro content layout registers every atk-ui component up front,
 * because a Markdown page can't declare its own imports (see
 * `templates/astro/src/layouts/Content.astro`'s own comment for why). That
 * list is hand-written, not generated — so nothing enforced it staying in
 * sync with the catalog until now. A component added to the catalog but
 * missed here would silently reproduce the exact bug that layout exists to
 * fix, just for the next component instead of today's.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const LAYOUT = join(ROOT, "templates/astro/src/layouts/Content.astro");

interface CatalogEntry {
  kind: "component" | "pattern";
  /** "dist/components/metric/metric.js" — components only. */
  module?: string;
}

const catalog = JSON.parse(
  await readFile(join(ROOT, "skills/atk-ui/catalog.json"), "utf8"),
) as CatalogEntry[];

/** "dist/components/metric/metric.js" -> "@aganitha/atk-ui/components/metric" */
function import_specifier(module_path: string): string {
  const dir = module_path.split("/").slice(0, -1).pop();
  return `@aganitha/atk-ui/components/${dir}`;
}

const expected = catalog
  .filter((e): e is CatalogEntry & { module: string } => e.kind === "component" && !!e.module)
  .map((e) => import_specifier(e.module));

const layout = await readFile(LAYOUT, "utf8");
const missing = expected.filter((specifier) => !layout.includes(specifier));

if (missing.length) {
  console.error(
    `Content.astro is missing an import for: ${missing.join(", ")}\n` +
      `A component in the catalog with no import here renders as an inert, unstyled tag ` +
      `on any Markdown page that uses it. Add the missing import(s) to\n  ${LAYOUT}`,
  );
  process.exit(1);
}

console.log(`✓ Content.astro registers all ${expected.length} catalogued components`);
