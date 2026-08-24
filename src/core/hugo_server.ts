/**
 * Hugo compilation, isolation, and preview serving lifecycle manager.
 */
import { existsSync, statSync, mkdirSync, readdirSync, rmSync, copyFileSync } from "node:fs";
import { resolve, join, basename, extname } from "node:path";
import { spawn } from "node:child_process";

export interface HugoBuildOptions {
  sourceDir: string;
  destinationDir: string;
  contentDir?: string;
  baseURL?: string;
}

export interface HugoServerOptions {
  sourceDir: string;
  contentDir?: string;
  port?: number;
}

export interface PreviewServerInstance {
  url: string;
  port: number;
  stop: () => void;
}

/**
 * Locate the Hugo starter template directory.
 */
export function resolve_hugo_template_dir(): string {
  const repo_hugo_dir = resolve(new URL(".", import.meta.url).pathname, "../../templates/hugo");
  const user_hugo_dir = join(process.env.HOME || "", ".local/share/atk-ui/templates/hugo");

  if (existsSync(join(repo_hugo_dir, "hugo.toml"))) {
    return repo_hugo_dir;
  }
  if (existsSync(join(user_hugo_dir, "hugo.toml"))) {
    return user_hugo_dir;
  }
  throw new Error(
    "Hugo template directory not found. Please ensure templates/hugo exists or run ./install.sh",
  );
}

/**
 * Execute a one-shot Hugo build into a destination directory.
 */
export async function build_hugo_site(options: HugoBuildOptions): Promise<void> {
  const abs_source = resolve(options.sourceDir);
  const abs_dest = resolve(options.destinationDir);

  const args = [
    "--source",
    abs_source,
    "--destination",
    abs_dest,
    "--cleanDestinationDir",
  ];

  if (options.baseURL) {
    args.push("--baseURL", options.baseURL);
  }

  if (options.contentDir) {
    args.push("--contentDir", resolve(options.contentDir));
  }

  const proc = Bun.spawn(["hugo", ...args], {
    cwd: abs_source,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exit_code = await proc.exited;

  if (exit_code !== 0) {
    throw new Error(`Hugo build failed (exit ${exit_code}):\n${stderr || stdout}`);
  }
}

/**
 * Start a unified static web server using Bun.serve() for a compiled directory.
 */
export function start_static_preview_server(options: {
  rootDir: string;
  port?: number;
  targetPath?: string;
}): PreviewServerInstance {
  const port = options.port ?? (Number(process.env.ATK_UI_PORT) || 1313);
  const root = options.rootDir;

  const server = Bun.serve({
    port,
    fetch(req): Response {
      const url = new URL(req.url);
      let pathname = decodeURIComponent(url.pathname);

      const noCacheHeaders = {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      };

      // In single-file preview, redirect root "/" to the target report
      if (options.targetPath && (pathname === "/" || pathname === "")) {
        const redirectUrl = options.targetPath.startsWith("/") ? options.targetPath : `/${options.targetPath}`;
        return new Response(null, {
          status: 302,
          headers: {
            Location: `http://localhost:${port}${redirectUrl}`,
            ...noCacheHeaders,
          },
        });
      }

      const relPath = pathname.replace(/^\/+/, "");
      let filePath = join(root, relPath);

      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, "index.html");
      } else if (!existsSync(filePath)) {
        if (existsSync(`${filePath}.html`)) {
          filePath = `${filePath}.html`;
        } else if (existsSync(join(filePath, "index.html"))) {
          filePath = join(filePath, "index.html");
        }
      }

      if (existsSync(filePath) && !statSync(filePath).isDirectory()) {
        return new Response(Bun.file(filePath), {
          headers: noCacheHeaders,
        });
      }

      return new Response("Not Found", {
        status: 404,
        headers: noCacheHeaders,
      });
    },
  });

  const final_port = server.port ?? port;
  const url = options.targetPath
    ? `http://localhost:${final_port}${options.targetPath.startsWith("/") ? options.targetPath : `/${options.targetPath}`}`
    : `http://localhost:${final_port}/`;

  return {
    url,
    port: final_port,
    stop: () => {
      server.stop();
    },
  };
}

/**
 * Run Hugo in live watch/server mode (`hugo server -D`) with polling readiness wait.
 */
export async function start_hugo_watch_server(options: HugoServerOptions): Promise<PreviewServerInstance> {
  const default_port = Number(process.env.ATK_UI_PORT) || 1313;
  const port = options.port ?? default_port;

  const abs_source = resolve(options.sourceDir);
  const args = [
    "server",
    "-D",
    "--bind",
    "127.0.0.1",
    "--port",
    String(port),
    "--source",
    abs_source,
  ];

  if (options.contentDir) {
    args.push("--contentDir", resolve(options.contentDir));
  }

  const proc = spawn("hugo", args, {
    cwd: abs_source,
    stdio: "ignore",
  });

  // Polling readiness check to prevent race condition
  const max_wait_ms = 15_000;
  const start_time = Date.now();
  let ready = false;

  while (Date.now() - start_time < max_wait_ms) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok || res.status < 500) {
        ready = true;
        break;
      }
    } catch {
      // Server not accepting connections yet
    }
    await Bun.sleep(150);
  }

  if (!ready) {
    try {
      proc.kill();
    } catch (_) {}
    throw new Error(`Hugo development server failed to start on port ${port} within 15s`);
  }

  const url = `http://localhost:${port}/`;

  return {
    url,
    port,
    stop: () => {
      try {
        proc.kill();
      } catch (_) {}
    },
  };
}

/**
 * Isolate single Markdown file into Hugo reports directory.
 */
export async function link_content(file_path: string, hugo_dir: string): Promise<string> {
  const reports_dir = join(hugo_dir, "content", "reports");
  mkdirSync(reports_dir, { recursive: true });

  const abs_path = resolve(file_path);
  if (!existsSync(abs_path)) {
    throw new Error(`File not found: ${file_path}`);
  }

  const ext = extname(abs_path);
  const slug = basename(abs_path, ext);
  const target_file = join(reports_dir, `${slug}.md`);

  // Clear existing .md files in reports_dir to guarantee single-file isolation
  if (existsSync(reports_dir)) {
    const existing = readdirSync(reports_dir);
    for (const f of existing) {
      if (f.endsWith(".md")) {
        try {
          rmSync(join(reports_dir, f), { force: true });
        } catch (_) {}
      }
    }
  }

  // Copy target file into reports_dir
  copyFileSync(abs_path, target_file);
  return slug;
}

/**
 * Link directory of Markdown files into Hugo reports directory.
 */
export async function link_directory(dir_path: string, hugo_dir: string): Promise<void> {
  const reports_dir = join(hugo_dir, "content", "reports");
  mkdirSync(reports_dir, { recursive: true });

  const abs_path = resolve(dir_path);
  if (!existsSync(abs_path) || !statSync(abs_path).isDirectory()) {
    throw new Error(`Directory not found: ${dir_path}`);
  }

  // Clear existing reports
  const existing = readdirSync(reports_dir);
  for (const f of existing) {
    if (f.endsWith(".md")) {
      try {
        rmSync(join(reports_dir, f), { force: true });
      } catch (_) {}
    }
  }

  // Copy all .md files from source directory
  const files = readdirSync(abs_path);
  for (const f of files) {
    if (f.endsWith(".md")) {
      copyFileSync(join(abs_path, f), join(reports_dir, f));
    }
  }
}
