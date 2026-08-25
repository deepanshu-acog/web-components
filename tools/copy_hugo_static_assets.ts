/**
 * Copy the static (non-bundlable) files the Hugo starter needs at runtime —
 * Web Awesome's CSS and atk-ui's theme/patterns CSS — out of `node_modules`
 * (or, for atk-ui's own files, straight out of this repo's own `dist/`) and
 * into committed files under `templates/hugo/static/`.
 *
 * These aren't JS, so `tools/bundle_hugo_app.ts` doesn't cover them: they're
 * loaded by plain `<link>` tags, not resolved by a bundler. Before this
 * script, Hugo read them straight out of `node_modules` via `hugo.toml`
 * module mounts — meaning the template needed `node_modules` on disk just
 * to serve CSS. Copying them once, here, removes that dependency the same
 * way bundle_hugo_app.ts removed it for JS.
 *
 * atk-ui's own theme/patterns CSS is sourced from this repo's own `dist/`
 * (built by `bun run build`), not `node_modules/@aganitha/atk-ui` — this
 * package is self-referencing, so nothing in a plain `bun install` ever
 * creates a `node_modules` entry for it; reading `dist/` directly avoids
 * needing a self-link trick at all. Web Awesome is a real external
 * dependency, so it comes from `node_modules` at the repo root — never
 * from `templates/hugo/node_modules`, which nothing populates any more.
 *
 * Web Awesome's icon SVGs are NOT included here — the icon component
 * resolves them from Font Awesome's own CDN by default (there are zero SVG
 * files anywhere in the @awesome.me/webawesome package), so nothing to copy.
 *
 * Run by `make generate` (which depends on `build`, so `dist/` already
 * exists); `--check` verifies the committed output matches byte-for-byte,
 * same pattern as tools/generate.ts and tools/bundle_hugo_app.ts.
 */
import { cp, mkdir, rm, readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const HUGO_DIR = join(ROOT, "templates/hugo");

const COPIES: { from: string; to: string }[] = [
  { from: join(ROOT, "node_modules/@awesome.me/webawesome/dist/styles"), to: join(HUGO_DIR, "static/webawesome/styles") },
  { from: join(ROOT, "dist/theme"), to: join(HUGO_DIR, "static/atk-ui/theme") },
  { from: join(ROOT, "dist/patterns"), to: join(HUGO_DIR, "static/atk-ui/patterns") },
];

async function list_files(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile()).map((e) => join(e.parentPath ?? e.path, e.name));
}

/** Hash every file's path + content together, so both a changed file and an
 * added/removed file change the result — a plain file count misses both a
 * same-count content edit and a same-total add+remove pair. */
async function tree_hash(dir: string): Promise<string> {
  const files = (await list_files(dir)).sort();
  const parts: string[] = [];
  for (const file of files) {
    parts.push(relative(dir, file));
    parts.push(await readFile(file, "utf8").catch(async () => (await readFile(file)).toString("base64")));
  }
  return Bun.hash(parts.join("\0")).toString(16);
}

if (process.argv.includes("--check")) {
  const problems: string[] = [];
  for (const { from, to } of COPIES) {
    if (!existsSync(from)) {
      problems.push(`${from} not found — run \`bun run build\` (and \`bun install\`) first.`);
      continue;
    }
    if ((await tree_hash(from)) !== (await tree_hash(to))) {
      problems.push(`${to} is stale relative to ${from}.`);
    }
  }
  if (problems.length > 0) {
    console.error("Hugo static asset check failed:");
    for (const p of problems) console.error(`  ${p}`);
    console.error("Run `bun run tools/copy_hugo_static_assets.ts` and commit the result.");
    process.exit(1);
  }
  console.log("✓ Hugo static assets are current");
  process.exit(0);
}

for (const { from, to } of COPIES) {
  if (!existsSync(from)) {
    console.error(`✗ ${from} not found — run \`bun run build\` (and \`bun install\`) first.`);
    process.exit(1);
  }
  await rm(to, { recursive: true, force: true });
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
  console.log(`✓ copied ${relative(ROOT, from)} → ${relative(ROOT, to)}`);
}
