/**
 * Pre-bundle the Hugo starter's `assets/app.js` into a single static file,
 * `static/atk-ui/app.js`, committed to the repo.
 *
 * Before this script existed, `baseof.html` ran `resources.Get "app.js" |
 * js.Build` — Hugo Pipes invoking esbuild *at `hugo server` runtime* to
 * resolve app.js's bare imports (every Web Awesome component, plus every
 * atk-ui component). That only works when `node_modules/@awesome.me/
 * webawesome` and `node_modules/@aganitha/atk-ui` are physically present
 * next to the template — which `atk-ui preview` (a standalone binary with
 * no sibling `node_modules`, D18) cannot provide, and which is what made
 * `install.sh` vendor a full `bun install` + a copy of `dist/` into the
 * template just to make Hugo's runtime bundle step resolve.
 *
 * This script does that resolution once, here, at repo-build time instead,
 * and writes the result as one plain static file. `baseof.html` then loads
 * it with a plain `<script src>` — no `js.Build`, no bare imports, no
 * `node_modules` needed by Hugo at all for this. Run by `make generate`;
 * `--check` verifies the committed output is current, same pattern as
 * `tools/generate.ts`.
 */
import { readFile, writeFile, mkdir, symlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const ENTRY = join(ROOT, "templates/hugo/assets/app.js");
const OUT_DIR = join(ROOT, "templates/hugo/static/atk-ui");
const OUT_FILE = join(OUT_DIR, "app.js");

// app.js bare-imports "@aganitha/atk-ui/components/*" — but that package
// *is* this repo, so a plain `bun install` never creates a node_modules
// entry pointing a package back at itself; only `bun link` (run twice, by
// hand) does. Rather than depend on that global, contributor-machine-only
// state, make the resolution local and deterministic: self-link
// node_modules/@aganitha/atk-ui -> repo root here, every run. This also
// requires `bun run build` to have already produced dist/ (the exports map
// in package.json resolves "./components/*" to "./dist/components/*/*.js")
// — run by `make generate`, which depends on `build` for exactly this.
const SELF_LINK = join(ROOT, "node_modules/@aganitha/atk-ui");
if (!existsSync(SELF_LINK)) {
  await mkdir(join(ROOT, "node_modules/@aganitha"), { recursive: true });
  await symlink(ROOT, SELF_LINK, "dir");
}
if (!existsSync(join(ROOT, "dist/components"))) {
  console.error("dist/components not found — run `bun run build` before bundle_hugo_app.ts.");
  process.exit(1);
}

const result = await Bun.build({
  entrypoints: [ENTRY],
  target: "browser",
  minify: true,
  // molstar is lazy-loaded from its own CDN/static mount by atk-molstar
  // itself (see src/components/molstar/molstar.ts) — never eagerly bundled.
  external: ["molstar", "molstar/lib/apps/viewer/app"],
});

if (!result.success) {
  for (const log of result.logs) console.error(log.message);
  process.exit(1);
}

const output = await result.outputs[0]!.text();

if (process.argv.includes("--check")) {
  const current = existsSync(OUT_FILE) ? await readFile(OUT_FILE, "utf8") : null;
  if (current !== output) {
    console.error(
      "templates/hugo/static/atk-ui/app.js is out of date with templates/hugo/assets/app.js.\n" +
        "Run `bun run tools/bundle_hugo_app.ts` and commit the result.",
    );
    process.exit(1);
  }
  console.log("✓ templates/hugo/static/atk-ui/app.js is current");
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_FILE, output);
console.log(`✓ bundled templates/hugo/assets/app.js → templates/hugo/static/atk-ui/app.js`);
