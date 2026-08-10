/**
 * Every template under `templates/` pins a version range for `@aganitha/atk-ui`
 * in its own `package.json`.
 * A `make publish` that bumps the package's own version but leaves that range
 * behind is silent and easy to miss: `npm install` in a freshly scaffolded
 * project just quietly keeps resolving the old version. This caught exactly
 * that on the 0.1.0 → 0.2.0 publish — a `0.x` package's `^` range only
 * covers patch bumps (`^0.1.0` is `>=0.1.0 <0.2.0`), so a minor bump always
 * falls outside a template's existing range unless it's bumped too.
 *
 * This check fails loudly instead: does the current package.json version
 * satisfy every template's declared range for us? `make publish` depends on
 * `make check`, so this runs before every publish, not just when remembered.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import semver from "semver";

const ROOT = new URL("..", import.meta.url).pathname;

async function main() {
  const own_package = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
  const own_name: string = own_package.name;
  const own_version: string = own_package.version;

  const templates_dir = join(ROOT, "templates");
  const problems: string[] = [];

  for (const entry of await readdir(templates_dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const package_json_path = join(templates_dir, entry.name, "package.json");
    const text = await readFile(package_json_path, "utf8").catch(() => null);
    if (!text) continue;

    const template_package = JSON.parse(text);
    const range: string | undefined = template_package.dependencies?.[own_name];
    if (!range) continue;

    if (!semver.satisfies(own_version, range)) {
      problems.push(
        `templates/${entry.name}/package.json pins "${own_name}": "${range}", ` +
          `which does not include the current version ${own_version}. ` +
          `A fresh install there will silently keep resolving an older release. ` +
          `Update the range (e.g. to "^${own_version}") before publishing.`,
      );
    }
  }

  if (problems.length) {
    console.error("✗ Template dependency check failed:\n");
    for (const problem of problems) console.error(`  ${problem}\n`);
    process.exit(1);
  }

  console.log(`✓ Template dependency check passed — every template's range covers ${own_version}`);
}

main();
