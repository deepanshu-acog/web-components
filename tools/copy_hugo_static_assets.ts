/**
 * Copy the static (non-bundlable) files the Hugo starter needs at runtime —
 * Web Awesome's CSS, atk-ui's theme/patterns CSS, and molstar's viewer
 * bundle — out of `node_modules` and into committed files under
 * `templates/hugo/static/`.
 *
 * These aren't JS, so `tools/bundle_hugo_app.ts` doesn't cover them: they're
 * loaded by plain `<link>`/`<script>` tags or fetched by URL at runtime
 * (molstar's viewer), not resolved by a bundler. Before this script, Hugo
 * read them straight out of `node_modules` via `hugo.toml` module mounts —
 * meaning the template needed `node_modules` on disk just to serve CSS and
 * one third-party viewer bundle it never modifies. Copying them once, here,
 * removes that dependency the same way bundle_hugo_app.ts removed it for JS.
 *
 * Web Awesome's icon SVGs are NOT included here — the icon component
 * resolves them from Font Awesome's own CDN by default (there are zero SVG
 * files anywhere in the @awesome.me/webawesome package), so nothing to copy.
 *
 * Run by `make generate`; `--check` verifies the committed output is
 * current, same pattern as tools/generate.ts and tools/bundle_hugo_app.ts.
 */
import { cp, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const HUGO_DIR = join(ROOT, "templates/hugo");

const COPIES: { from: string; to: string }[] = [
  { from: "node_modules/@awesome.me/webawesome/dist/styles", to: "static/webawesome/styles" },
  { from: "node_modules/@aganitha/atk-ui/dist/theme", to: "static/atk-ui/theme" },
  { from: "node_modules/@aganitha/atk-ui/dist/patterns", to: "static/atk-ui/patterns" },
];

async function list_files(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile()).map((e) => join(e.parentPath ?? e.path, e.name));
}

if (process.argv.includes("--check")) {
  const problems: string[] = [];
  for (const { from, to } of COPIES) {
    const src = join(HUGO_DIR, from);
    const dest = join(HUGO_DIR, to);
    if (!existsSync(src)) {
      problems.push(`${from} not found — run \`bun install\` in templates/hugo first.`);
      continue;
    }
    const src_files = await list_files(src);
    const dest_files = await list_files(dest);
    if (src_files.length !== dest_files.length) {
      problems.push(
        `${to} is stale (${dest_files.length} files, expected ${src_files.length} from ${from}).`,
      );
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
  const src = join(HUGO_DIR, from);
  const dest = join(HUGO_DIR, to);
  if (!existsSync(src)) {
    console.error(`✗ ${from} not found — run \`bun install\` in templates/hugo first.`);
    process.exit(1);
  }
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true });
  console.log(`✓ copied ${from} → templates/hugo/${to}`);
}
