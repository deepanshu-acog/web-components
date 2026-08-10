/**
 * Check for, and apply, a newer atk-ui release. `atk-ui update` calls this.
 *
 * Self-replacing the running binary only makes sense when there is a
 * binary to replace — running via `bun run src/cli/index.ts` in this repo
 * has no file of its own to overwrite, and overwriting Bun's own binary
 * would be a real hazard. `is_compiled_binary()` is the guard for that.
 *
 * Reuses `gh` rather than talking to the GitHub API directly — it is
 * already a required prerequisite (`commands/lib/prereqs.sh`), already
 * authenticated, and matching the release-download step `make release`
 * itself uses keeps there being exactly one way this repo talks to GitHub
 * releases.
 */
import { rename, chmod } from "node:fs/promises";
import { version as current_version } from "../../package.json";

const REPO = "aganitha/atk-ui";

// `latest_tag` only exists to answer, and only makes sense, when there is
// something to update to — a union says so, rather than leaving it an
// optional field and trusting every caller to check `update_available`
// first.
export type UpdateStatus =
  | { current_version: string; update_available: false }
  | { current_version: string; update_available: true; latest_tag: string };

/** Whether a GitHub release tag represents a strictly newer CLI version. */
export function is_newer_version(current_version: string, latest_tag: string): boolean {
  const latest_version = latest_tag.replace(/^v/, "");
  try {
    return Bun.semver.order(latest_version, current_version) === 1;
  } catch {
    throw new Error(`Release tag "${latest_tag}" is not a valid semantic version.`);
  }
}

export function is_compiled_binary(): boolean {
  // `bun run foo.ts` launches the `bun` executable itself; a compiled
  // binary *is* the executable, under whatever name `make build-cli` gave
  // it (`atk-ui-darwin-arm64`, etc.) — never literally "bun".
  return !/(^|\/)bun$/.test(process.execPath);
}

function asset_name(): string {
  const platform = process.platform === "darwin" ? "darwin" : "linux";
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  return `atk-ui-${platform}-${arch}`;
}

async function run_json<T>(command: string[]): Promise<T> {
  const proc = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exit_code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  if (exit_code !== 0) {
    throw new Error(`\`${command.join(" ")}\` failed: ${stderr.trim() || `exit ${exit_code}`}`);
  }
  return JSON.parse(stdout) as T;
}

// The exact, stable message `gh` prints for a repo with no releases yet —
// confirmed against the real (currently release-less) aganitha/atk-ui. Any
// other failure (bad auth, network down, wrong repo) prints something else
// and must not be treated the same way.
const NO_RELEASE_MESSAGE = "release not found";

export async function check_for_update(): Promise<UpdateStatus> {
  let latest: { tagName: string };
  try {
    latest = await run_json<{ tagName: string }>([
      "gh",
      "release",
      "view",
      "--repo",
      REPO,
      "--json",
      "tagName",
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes(NO_RELEASE_MESSAGE)) {
      return { current_version, update_available: false };
    }
    // Anything else — bad auth, network down, wrong repo — is a real
    // problem the caller needs to see, not "nothing to update to."
    throw error;
  }

  const latest_tag = latest.tagName;
  if (!is_newer_version(current_version, latest_tag)) {
    return { current_version, update_available: false };
  }
  return { current_version, update_available: true, latest_tag };
}

export async function apply_update(latest_tag: string): Promise<{ version: string }> {
  if (!is_compiled_binary()) {
    throw new Error(
      "Self-update only works from the compiled binary, not `bun run`. " +
        "Run `make build-cli` and use the binary in dist/bin/.",
    );
  }

  const tmp_path = `${process.execPath}.update`;
  const download = Bun.spawn(
    [
      "gh",
      "release",
      "download",
      latest_tag,
      "--repo",
      REPO,
      "--pattern",
      asset_name(),
      "--output",
      tmp_path,
      "--clobber",
    ],
    { stdout: "inherit", stderr: "inherit" },
  );
  const exit_code = await download.exited;
  if (exit_code !== 0) throw new Error(`Failed to download ${asset_name()}@${latest_tag}`);

  await chmod(tmp_path, 0o755);
  await rename(tmp_path, process.execPath);

  return { version: latest_tag.replace(/^v/, "") };
}
