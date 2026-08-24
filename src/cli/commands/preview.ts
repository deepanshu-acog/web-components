import type { Command } from "commander";
import { resolve } from "node:path";
import { existsSync, statSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { start_preview } from "../../core/preview.js";
import {
  resolve_hugo_template_dir,
  link_content,
  link_directory,
  build_hugo_site,
  start_static_preview_server,
  start_hugo_watch_server,
  type PreviewServerInstance,
} from "../../core/hugo_server.js";

interface PreviewOptions {
  port?: string;
  watch?: boolean;
  json?: boolean;
}

async function handle_preview(
  target: string | undefined,
  _local: unknown,
  command: Command,
): Promise<void> {
  const options = command.optsWithGlobals<PreviewOptions>();
  const port = options.port ? Number(options.port) : undefined;
  if (options.port && (!Number.isInteger(port) || port! < 0)) {
    process.stderr.write(`Error: --port must be a whole number, got "${options.port}"\n`);
    process.exit(2);
  }

  // Case 1: No target argument -> run catalog browser
  if (!target) {
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
    return;
  }

  // Case 2 & 3: Target argument provided (Markdown file or directory)
  const abs_target = resolve(target);
  if (!existsSync(abs_target)) {
    process.stderr.write(`Error: File or directory not found: "${target}"\n`);
    process.exit(1);
  }

  const is_dir = statSync(abs_target).isDirectory();
  let hugo_source_dir: string;
  try {
    hugo_source_dir = resolve_hugo_template_dir();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }

  let preview_server: PreviewServerInstance;
  let tmp_dest: string | null = null;

  try {
    let slug = "";
    if (is_dir) {
      await link_directory(abs_target, hugo_source_dir);
    } else if (abs_target.endsWith(".md")) {
      slug = await link_content(abs_target, hugo_source_dir);
    }

    if (options.watch) {
      // Case 3: Live reload mode via Hugo server -D
      preview_server = await start_hugo_watch_server({
        sourceDir: hugo_source_dir,
        port: port ?? 1313,
      });
      if (slug) {
        preview_server.url = `http://localhost:${preview_server.port}/reports/${slug}/`;
      }
    } else {
      // Case 2: One-shot static compilation served via Bun.serve()
      tmp_dest = await mkdtemp(join(tmpdir(), "atk-preview-"));

      await build_hugo_site({
        sourceDir: hugo_source_dir,
        destinationDir: tmp_dest,
        baseURL: `http://localhost:${port ?? 1313}/`,
      });

      preview_server = start_static_preview_server({
        rootDir: tmp_dest,
        port: port ?? 1313,
        targetPath: slug ? `/reports/${slug}/` : "/",
      });
    }

    if (options.json) {
      console.log(JSON.stringify({ ok: true, data: { url: preview_server.url } }));
    } else {
      const mode_label = options.watch ? "live watch mode" : "static build";
      console.log(`✓ Hugo preview running (${mode_label}) at:`);
      console.log(`  ${preview_server.url}`);
      console.log(`  Ctrl+C to stop.`);
    }

    let is_shutting_down = false;
    const shutdown = async () => {
      if (is_shutting_down) return;
      is_shutting_down = true;
      preview_server.stop();
      if (tmp_dest) {
        try {
          await rm(tmp_dest, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors on exit
        }
      }
      if (!options.json) console.log("Stopped.");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    if (tmp_dest) {
      await rm(tmp_dest, { recursive: true, force: true }).catch(() => {});
    }
    const message = error instanceof Error ? error.message : String(error);
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: { code: "PREVIEW_FAILED", message } }));
    } else {
      process.stderr.write(`Error: ${message}\n`);
    }
    process.exit(1);
  }
}

export function register_preview(program: Command): void {
  program
    .command("preview [target]")
    .description("Browse the catalog, or preview a Markdown report / directory with Hugo.")
    .option("--port <number>", "Port to listen on [default: 1313]")
    .option("-w, --watch", "Watch for file changes with live reload (uses Hugo server)")
    .addHelpText(
      "after",
      `
Examples:
  $ atk-ui preview
  $ atk-ui preview report.md
  $ atk-ui preview report.md --watch
  $ atk-ui preview ./reports/
  $ atk-ui preview report.md --port 1313
  $ atk-ui preview --json`,
    )
    .action(handle_preview);
}
