/**
 * Scaffold a themed starter project. `atk-ui start` calls this.
 *
 * The template is not embedded in the CLI binary (unlike the preview
 * catalog, D18) — it is fetched live, with a shallow git clone, from the
 * same repository this CLI comes from. Template content — page copy,
 * example wiring — should be free to change on its own cadence without
 * forcing a new CLI release, the way the catalog does not need to.
 *
 * Scaffolding and running the dev server are two separate functions, not
 * one — the dev server blocks in the foreground until the user stops it,
 * and a caller (a script, an agent reading `--json`) needs the scaffold
 * result *before* that block, not after. Bundling both into one promise
 * meant `--json` output never appeared until the dev server was killed.
 */
import { mkdir, mkdtemp, readdir, rm, cp } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const SUPPORTED_STACKS = ["astro"] as const;
export type Stack = (typeof SUPPORTED_STACKS)[number];

// HTTPS works with the Git credential helper configured by `gh auth setup-git`;
// requiring an unrelated SSH key would make `atk-ui start` fail for an
// otherwise authenticated developer.
const DEFAULT_REPO = "https://github.com/aganitha/atk-ui.git";

export interface ScaffoldOptions {
  stack: Stack;
  dir: string;
  /** Override for testing, or for a fork. Defaults to the real atk-ui repo. */
  repo?: string;
  install?: boolean;
}

export interface ScaffoldResult {
  dir: string;
  installed: boolean;
}

async function is_empty(dir: string): Promise<boolean> {
  if (!existsSync(dir)) return true;
  if (!statSync(dir).isDirectory()) {
    throw new Error(`${dir} exists and is not a directory.`);
  }
  return (await readdir(dir)).length === 0;
}

async function run(command: string[], cwd: string): Promise<void> {
  const proc = Bun.spawn(command, { cwd, stdio: ["inherit", "inherit", "inherit"] });
  const exit_code = await proc.exited;
  if (exit_code !== 0) {
    throw new Error(`\`${command.join(" ")}\` failed (exit ${exit_code}) in ${cwd}`);
  }
}

export async function scaffold_project(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const { stack, dir } = options;
  const repo = options.repo ?? DEFAULT_REPO;
  const install = options.install ?? true;

  if (!(await is_empty(dir))) {
    throw new Error(`${dir} already exists and is not empty. Choose an empty or new directory.`);
  }

  const tmp = await mkdtemp(join(tmpdir(), "atk-ui-start-"));
  try {
    await run(["git", "clone", "--quiet", "--depth", "1", repo, tmp], process.cwd());
    const template_dir = join(tmp, "templates", stack);
    if (!existsSync(template_dir)) {
      throw new Error(`${repo} has no templates/${stack} — this stack may not be built yet.`);
    }
    await mkdir(dir, { recursive: true });
    await cp(template_dir, dir, { recursive: true });
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }

  if (install) await run(["bun", "install"], dir);

  return { dir, installed: install };
}

/** Blocks until the dev server exits (the user stops it). */
export async function start_dev_server(dir: string): Promise<void> {
  await run(["bun", "run", "dev"], dir);
}
