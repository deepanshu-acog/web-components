/**
 * Bundle every catalogued component's compiled JS into one browser-ready
 * file, `dist/preview/components.embed`.
 *
 * `atk-ui preview` ships as a standalone compiled binary (D18) with no
 * `node_modules` beside it, so it cannot embed a variable number of files
 * whose paths are only known at runtime — Bun's file-embedding
 * (`with { type: "file" }`, used in src/core/preview.ts) needs a static
 * import path. This script is what makes that path static: it always writes
 * to the same file, and that file's *contents* are regenerated from whatever
 * the catalog currently lists. Run by `make build-cli`, after `make generate`.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT_DIR = join(ROOT, "dist/preview");
const CATALOG_JSON = join(ROOT, "skills/atk-ui/catalog.json");

interface CatalogEntry {
  module?: string;
}

const catalog_text = await readFile(CATALOG_JSON, "utf8");
const catalog = JSON.parse(catalog_text) as CatalogEntry[];
const modules = catalog.flatMap((e) => (e.module ? [e.module] : []));

await mkdir(OUT_DIR, { recursive: true });

// A plain copy, under a made-up extension (see src/core/embeds.d.ts for why
// it can't just be `.json`) — so `atk-ui preview`'s compiled binary can
// embed it via a static, known path instead of reading `skills/` at runtime,
// which will not exist next to a standalone executable.
await writeFile(join(OUT_DIR, "catalog.embed"), catalog_text);

const entry_path = join(OUT_DIR, ".entry.generated.ts");
await writeFile(entry_path, modules.map((m) => `import "../../${m}";`).join("\n") + "\n");

const result = await Bun.build({
  entrypoints: [entry_path],
  target: "browser",
  minify: true,
});

await rm(entry_path);

if (!result.success) {
  for (const log of result.logs) console.error(log.message);
  process.exit(1);
}

await writeFile(join(OUT_DIR, "components.embed"), await result.outputs[0]!.text());
console.log(`✓ bundled ${modules.length} component(s) into dist/preview/components.embed`);
