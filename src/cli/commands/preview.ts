import type { Command } from "commander";
import { start_preview } from "../../core/preview.js";

interface PreviewOptions {
  port?: string;
  json?: boolean;
}

async function handle_preview(_local: unknown, command: Command): Promise<void> {
  const options = command.optsWithGlobals<PreviewOptions>();
  const port = options.port ? Number(options.port) : undefined;
  if (options.port && (!Number.isInteger(port) || port! < 0)) {
    process.stderr.write(`Error: --port must be a whole number, got "${options.port}"\n`);
    process.exit(2);
  }

  let server;
  try {
    server = await start_preview(port === undefined ? {} : { port });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: { code: "PREVIEW_FAILED", message } }));
    } else {
      process.stderr.write(`Error: ${message}\n`);
    }
    process.exit(1);
  }

  if (options.json) {
    console.log(
      JSON.stringify({ ok: true, data: { url: server.url, entries: server.entry_count } }),
    );
  } else {
    console.log(`✓ Catalog running — ${server.entry_count} entries`);
    console.log(`  ${server.url}`);
    console.log(`  Ctrl+C to stop.`);
  }

  const shutdown = () => {
    server.stop();
    if (!options.json) console.log("Stopped.");
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export function register_preview(program: Command): void {
  program
    .command("preview")
    .description("Browse the catalog — every component and pattern, rendered live.")
    .option("--port <number>", "Port to listen on [default: first free port]")
    .addHelpText(
      "after",
      `
Examples:
  $ atk-ui preview
  $ atk-ui preview --port 4173
  $ atk-ui preview --json`,
    )
    .action(handle_preview);
}
