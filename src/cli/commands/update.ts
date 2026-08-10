import type { Command } from "commander";
import { check_for_update, apply_update } from "../../core/update.js";

interface UpdateOptions {
  check?: boolean;
  json?: boolean;
}

async function handle_update(_local: unknown, command: Command): Promise<void> {
  const options = command.optsWithGlobals<UpdateOptions>();

  try {
    const status = await check_for_update();

    if (!status.update_available) {
      if (options.json) {
        console.log(JSON.stringify({ ok: true, data: status }));
      } else {
        console.log(`✓ Already up to date (${status.current_version}).`);
      }
      return;
    }

    if (options.check) {
      if (options.json) {
        console.log(JSON.stringify({ ok: true, data: status }));
      } else {
        console.log(`Update available: ${status.current_version} → ${status.latest_tag}`);
        console.log("Run `atk-ui update` to install it.");
      }
      return;
    }

    const result = await apply_update(status.latest_tag);
    if (options.json) {
      console.log(JSON.stringify({ ok: true, data: { ...status, installed: result.version } }));
    } else {
      console.log(`✓ Updated ${status.current_version} → ${result.version}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: { code: "UPDATE_FAILED", message } }));
    } else {
      process.stderr.write(`Error: ${message}\n`);
    }
    process.exit(1);
  }
}

export function register_update(program: Command): void {
  program
    .command("update")
    .description("Check for and install a newer atk-ui release.")
    .option("--check", "Report whether an update exists, without installing it")
    .addHelpText(
      "after",
      `
Examples:
  $ atk-ui update
  $ atk-ui update --check
  $ atk-ui update --json --check`,
    )
    .action(handle_update);
}
