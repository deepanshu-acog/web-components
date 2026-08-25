/**
 * Pack the Hugo starter's *source* tree — layouts, static, content, assets,
 * hugo.toml, package.json — into one gzip-compressed file,
 * `dist/preview/hugo-template.embed`, so `atk-ui preview` (a standalone
 * binary with no sibling files, D18) can embed the whole template at
 * compile time via Bun's `with { type: "file" }` (one static import, same
 * trick as `bundle_preview.ts` uses for the component catalog) and extract
 * it to a cache directory at runtime instead of depending on `node_modules`,
 * a source checkout, or `install.sh` to have put it on disk beforehand.
 *
 * As of `bundle_hugo_app.ts` and `copy_hugo_static_assets.ts`, the template
 * needs zero `node_modules` to run (verified: `hugo server` works with
 * `node_modules` renamed out of the way) — that's what makes packing the
 * whole tree here small enough to be worth doing (~30MB before gzip, mostly
 * molstar's viewer bundle) rather than something that would balloon the
 * binary.
 *
 * The archive format is deliberately not tar/zip: Bun ships no built-in
 * decoder for either, and shelling out to `tar` would make extraction depend
 * on a system tool that may not be on PATH. Instead this is just a
 * JSON manifest of {path, content (base64)} entries, gzipped with Bun's
 * built-in `Bun.gzipSync` — no dependency beyond Bun itself, in either
 * direction.
 *
 * Run by `make generate` (after copy_hugo_static_assets.ts and
 * bundle_hugo_app.ts, which must run first so their output is in the tree
 * being packed); `--check` verifies the committed output is current.
 */
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const HUGO_DIR = join(ROOT, "templates/hugo");
const OUT_DIR = join(ROOT, "dist/preview");
const OUT_FILE = join(OUT_DIR, "hugo-template.embed");

// Everything except build/dependency artifacts — those are either
// regenerated (public/, resources/) or not needed at runtime (node_modules,
// package-manager files, the CLI's own scripts).
const EXCLUDE_DIRS = new Set(["node_modules", "public", "resources", ".git"]);
const EXCLUDE_FILES = new Set(["bun.lock", "package-lock.json", ".gitignore"]);

interface Entry {
  path: string;
  content: string;
}

async function walk(dir: string, base: string, out: Entry[]): Promise<void> {
  for (const dirent of await readdir(dir, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      if (EXCLUDE_DIRS.has(dirent.name)) continue;
      await walk(join(dir, dirent.name), base, out);
    } else if (dirent.isFile()) {
      if (EXCLUDE_FILES.has(dirent.name)) continue;
      const full = join(dir, dirent.name);
      const rel = relative(base, full).split(sep).join("/");
      const content = await readFile(full);
      out.push({ path: rel, content: content.toString("base64") });
    }
  }
}

const entries: Entry[] = [];
await walk(HUGO_DIR, HUGO_DIR, entries);
entries.sort((a, b) => a.path.localeCompare(b.path));

const manifest = JSON.stringify(entries);
const gzipped = Bun.gzipSync(Buffer.from(manifest, "utf8"));

if (process.argv.includes("--check")) {
  const current = existsSync(OUT_FILE) ? await readFile(OUT_FILE) : null;
  if (!current || Buffer.compare(current, Buffer.from(gzipped)) !== 0) {
    console.error(
      "dist/preview/hugo-template.embed is out of date.\n" +
        "Run `bun run tools/bundle_hugo_template.ts` (after bundle_hugo_app.ts and\n" +
        "copy_hugo_static_assets.ts) and commit the result.",
    );
    process.exit(1);
  }
  console.log(`✓ hugo-template.embed is current (${entries.length} files)`);
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_FILE, gzipped);
console.log(
  `✓ packed ${entries.length} files (${(manifest.length / 1e6).toFixed(1)}MB → ${(gzipped.length / 1e6).toFixed(1)}MB gzipped) into dist/preview/hugo-template.embed`,
);
