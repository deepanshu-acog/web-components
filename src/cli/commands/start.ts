import type { Command } from "commander";
import { scaffold_project, start_dev_server, SUPPORTED_STACKS, type Stack } from "../../core/start.js";

interface StartLocalOptions {
  install: boolean;
  dev: boolean;
}

interface StartGlobalOptions {
  repo?: string;
  json?: boolean;
}

function is_stack(value: string): value is Stack {
  return (SUPPORTED_STACKS as readonly string[]).includes(value);
}

async function handle_start(
  stack: string,
  dir: string,
  local: StartLocalOptions,
  command: Command,
): Promise<void> {
  const options = command.optsWithGlobals<StartGlobalOptions>();

  if (!is_stack(stack)) {
    process.stderr.write(
      `Error: unsupported stack "${stack}". Supported: ${SUPPORTED_STACKS.join(", ")}\n`,
    );
    process.exit(2);
  }

  try {
    const result = await scaffold_project({
      stack,
      dir,
      install: local.install,
      ...(options.repo ? { repo: options.repo } : {}),
    });

    // Report success now, before start_dev_server ever blocks — a caller
    // reading --json needs this the moment scaffolding finishes, not after
    // the dev server (which only stops when a human presses Ctrl+C).
    const starts_dev_server = local.install && local.dev;
    if (options.json) {
      console.log(JSON.stringify({ ok: true, data: result }));
    } else {
      console.log(`✓ Created ${result.dir}`);
      if (!starts_dev_server && result.installed) {
        console.log(`Next: cd ${result.dir} && bun run dev`);
      } else if (!starts_dev_server) {
        console.log(`Next: cd ${result.dir} && bun install && bun run dev`);
      }
    }

    // A new scaffold has no dependencies until installation finishes. Starting
    // its dev server after `--no-install` can only fail, so that option also
    // skips the foreground server step.
    if (starts_dev_server) await start_dev_server(result.dir);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: { code: "START_FAILED", message } }));
    } else {
      process.stderr.write(`Error: ${message}\n`);
    }
    process.exit(1);
  }
}

export function register_start(program: Command): void {
  program
    .command("start")
    .description("Scaffold a themed starter project and start its dev server.")
    .argument("<stack>", `Which starter to use (${SUPPORTED_STACKS.join(", ")})`)
    .argument("<dir>", "Directory to create — must not exist, or must be empty")
    .option("--no-install", "Skip `bun install` and starting the dev server")
    .option("--no-dev", "Skip starting the dev server after installing")
    .option("--repo <url>", "Fetch the template from this repo instead of atk-ui's own")
    .addHelpText(
      "after",
      `
Examples:
  $ atk-ui start astro my-app
  $ atk-ui start astro my-app --no-dev
  $ atk-ui start astro my-app --json --no-dev`,
    )
    .action(handle_start);
}
