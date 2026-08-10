#!/usr/bin/env bun
/**
 * `atk-ui` — one CLI, git-style subcommands (D18 in docs/design.md).
 *
 * Thin on purpose: this file and everything under `commands/` only parse
 * input and format output. The actual work lives in `../core/`, so a human
 * running this and an assistant following the `atk-ui-start` skill get
 * exactly the same behaviour.
 */
import { Command } from "commander";
import { register_preview } from "./commands/preview.js";
import { register_start } from "./commands/start.js";
import { register_update } from "./commands/update.js";
// A real parsed-JSON import, resolved and inlined at *build* time. Reading
// package.json from disk at runtime (the previous approach) breaks the
// moment this is a standalone compiled binary (D18) — there is no
// package.json next to it once it lives in `~/.aganitha/bin/`.
import { version } from "../../package.json";

const program = new Command();

program
  .name("atk-ui")
  .description("Aganitha's shared UI layer: browse what exists, start a project with it.")
  .version(`atk-ui/${version}`, "-v, --version")
  .option("--json", "Machine-readable output")
  .option("--no-color", "Disable colour");

// Commander exits 1 on a usage error (missing/unknown argument) by default —
// the convention here is 2, reserving 1 for a command that ran and failed.
// `--help`/`--version` go through this same path with exitCode 0, which
// must pass through unchanged. Set before registering subcommands — each
// `.command()` call copies the parent's exit behaviour at that point, so a
// subcommand's own parse errors (e.g. `atk-ui start` with no <dir>) are
// covered too, not just the root program's.
program.exitOverride((error) => process.exit(error.exitCode === 0 ? 0 : 2));

register_preview(program);
register_start(program);
register_update(program);

await program.parseAsync(process.argv);
