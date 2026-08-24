/**
 * Build the agent skill from the source.
 *
 * Two inputs, because there are two kinds of contribution and only one of them
 * is a custom element:
 *
 * - Components come from `custom-elements.json`, produced by the manifest
 *   analyser from documentation comments.
 * - Patterns come from a markdown file with front matter. The manifest
 *   standard describes custom elements; a pattern is markup and CSS, so there
 *   is nothing for the analyser to look at.
 *
 * Run with `--check` to verify the committed output is current without
 * writing anything. That check is what makes the catalog trustworthy — without
 * it, "generated from source" is a habit rather than a guarantee.
 */
import { $ } from "bun";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SKILL_DIR = join(ROOT, "skills/atk-ui");

interface Entry {
  name: string;
  kind: "component" | "pattern";
  group: string;
  /**
   * Which references/<pack>.md file documents this entry. "core" is the
   * default for anything generally useful; a component declares a more
   * specific pack (e.g. "bio") with an `@atk-pack` doc tag so a reader
   * building in that domain can go straight to the matching reference
   * file instead of reading the whole catalog.
   */
  pack: string;
  summary: string;
  use: string;
  avoid: string;
  /** Runnable markup, for `atk-ui preview`. A component may not have one yet. */
  example?: string;
  /** Compiled JS, relative to the package root. Components only. */
  module?: string;
  body: string;
}

/** One line per pack, shown in SKILL.md's pack list. */
const PACK_DESCRIPTIONS: Record<string, string> = {
  core: "General-purpose components and patterns — not tied to one domain.",
  bio: "Components for biological and chemical structure data — molecular viewers, plate layouts.",
};

/** "src/components/metric/metric.ts" -> "dist/components/metric/metric.js" */
function to_dist_path(src_path: string): string {
  return src_path.replace(/^src\//, "dist/").replace(/\.ts$/, ".js");
}

// --- components ---------------------------------------------------------

interface ManifestDeclaration {
  name: string;
  tagName?: string;
  customElement?: boolean;
  summary?: string;
  description?: string;
  atkUse?: string;
  atkAvoid?: string;
  atkExample?: string;
  atkPack?: string;
  attributes?: { name: string; description?: string; type?: { text?: string } }[];
  slots?: { name: string; description?: string }[];
  cssParts?: { name: string; description?: string }[];
  cssProperties?: { name: string; description?: string }[];
}

async function read_components(): Promise<Entry[]> {
  const manifest = JSON.parse(
    await readFile(join(ROOT, "custom-elements.json"), "utf8"),
  ) as { modules: { path: string; declarations?: ManifestDeclaration[] }[] };

  const entries: Entry[] = [];

  for (const module of manifest.modules) {
    for (const declaration of module.declarations ?? []) {
      if (!declaration.customElement) continue;

      const tag = declaration.tagName;
      if (!tag) {
        throw new Error(
          `${declaration.name} in ${module.path} is a custom element with no tag name.\n` +
            `Add "@customElement <tag>" to its documentation comment. The analyser ` +
            `cannot see the tag through our define() helper.`,
        );
      }

      // The tag name now lives in two places — the documentation comment and
      // the define() call. Verify they agree, or the catalog will document an
      // element under a name that does not exist in the browser.
      const source = await readFile(join(ROOT, module.path), "utf8");
      const defined = source.match(/define\(\s*["']([^"']+)["']/)?.[1];
      if (defined && defined !== tag) {
        throw new Error(
          `${module.path}: documented as "${tag}" but registered as "${defined}".`,
        );
      }

      entries.push({
        name: tag,
        kind: "component",
        group: "data-display",
        pack: declaration.atkPack || "core",
        summary: declaration.summary ?? declaration.description?.split("\n")[0] ?? "",
        use: declaration.atkUse ?? "",
        avoid: declaration.atkAvoid ?? "",
        example: extract_example(declaration.atkExample),
        module: to_dist_path(module.path),
        body: render_component(tag, declaration),
      });
    }
  }

  return entries;
}

const GENERATED_NOTE =
  "<!-- Generated from the component source. Do not edit; run `make generate`. -->";

/** `@example` is written as a fenced code block; keep only the markup inside it. */
function extract_example(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const fenced = raw.match(/```(?:html)?\n?([\s\S]*?)```/);
  return (fenced ? fenced[1]! : raw).trim() || undefined;
}

function render_component(tag: string, d: ManifestDeclaration): string {
  const lines: string[] = [GENERATED_NOTE, "", `# \`<${tag}>\``, "", d.summary ?? "", ""];

  if (d.atkUse) lines.push(`**Use it when:** ${d.atkUse}`, "");
  if (d.atkAvoid) lines.push(`**Do not use it when:** ${d.atkAvoid}`, "");

  const example = extract_example(d.atkExample);
  if (example) lines.push("## Example", "", "```html", example, "```", "");

  const table = (
    title: string,
    rows: { name: string; description?: string }[] | undefined,
  ): void => {
    if (!rows?.length) return;
    lines.push(`## ${title}`, "", "| Name | Description |", "|---|---|");
    for (const row of rows) {
      lines.push(`| \`${row.name}\` | ${row.description ?? ""} |`);
    }
    lines.push("");
  };

  table("Attributes", d.attributes);
  table("Slots", d.slots?.map((s) => ({ ...s, name: s.name || "(default)" })));
  table("CSS parts", d.cssParts);
  table("CSS custom properties", d.cssProperties);

  if (d.description) lines.push("## Notes", "", d.description, "");

  return lines.join("\n");
}

// --- patterns -----------------------------------------------------------

async function read_patterns(): Promise<Entry[]> {
  const dir = join(ROOT, "src/patterns");
  if (!existsSync(dir)) return [];

  const entries: Entry[] = [];

  for (const name of await readdir(dir)) {
    const file = join(dir, name, `${name}.md`);
    if (!existsSync(file)) {
      throw new Error(
        `src/patterns/${name} has no ${name}.md. Every pattern needs one — it ` +
          `is the only thing the catalog can read, because a pattern is not a ` +
          `custom element.`,
      );
    }

    const raw = await readFile(file, "utf8");
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error(`${file}: missing front matter.`);

    const meta = parse_front_matter(match[1]!);
    for (const required of ["name", "group", "summary", "use", "avoid"]) {
      if (!meta[required]) throw new Error(`${file}: front matter is missing "${required}".`);
    }

    entries.push({
      name: meta["name"]!,
      kind: "pattern",
      group: meta["group"]!,
      pack: meta["pack"] || "core",
      summary: meta["summary"]!,
      use: meta["use"]!,
      avoid: meta["avoid"]!,
      // The pattern's own "## Markup" section is already a worked example —
      // reuse it rather than asking contributors to write the same markup twice.
      example: extract_example(match[2]),
      body:
        `${GENERATED_NOTE}\n\n` +
        `# ${meta["name"]} (pattern)\n\n${meta["summary"]}\n\n` +
        `**Use it when:** ${meta["use"]}\n\n` +
        `**Do not use it when:** ${meta["avoid"]}\n\n` +
        match[2]!.trim() +
        "\n",
    });
  }

  return entries;
}

/**
 * Read the small subset of YAML we use in pattern front matter: flat keys,
 * plain scalars, `>` folded blocks, and inline `[a, b]` lists.
 *
 * A YAML parser would be the right answer if this grew. It has not, and the
 * failure mode of the subset is a clear error rather than a wrong value.
 */
function parse_front_matter(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const match = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!match) continue;

    const [, key, rest] = match as unknown as [string, string, string];

    if (rest.trim() === ">" || rest.trim() === "|") {
      const block: string[] = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1]!)) {
        block.push(lines[++i]!.trim());
      }
      out[key] = block.join(" ");
    } else {
      out[key] = rest.trim().replace(/^["']|["']$/g, "");
    }
  }

  return out;
}

// --- skill --------------------------------------------------------------

async function render_skill(entries: Entry[]): Promise<string> {
  const agent_rules = (await readFile(join(ROOT, "tools/skill-content/agent-rules.md"), "utf8")).trimEnd();

  const by_pack = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = by_pack.get(entry.pack) ?? [];
    list.push(entry);
    by_pack.set(entry.pack, list);
  }

  const lines = [
    "---",
    "name: atk-ui",
    "description: >-",
    "  Aganitha's UI additions on top of Web Awesome. Use when building an Aganitha",
    "  page or app and you need an Aganitha-specific component or layout pattern.",
    "  For anything generic — buttons, inputs, dialogs, cards, layout — use the",
    "  webawesome skill instead.",
    "allowed-tools: Read",
    "---",
    "",
    "<!-- Generated by tools/generate.ts from component sources and",
    "     src/patterns/*/*.md. Do not edit; run `make generate`. -->",
    "",
    "# atk-ui",
    "",
    "Aganitha's shared UI layer, built on top of Web Awesome. Engineers already",
    "know how to ask an assistant to invent a page from nothing — this only",
    "earns its place if it gets to a working, on-brand page faster than that.",
    "So: check Web Awesome first, always, for anything generic. What's left —",
    "Aganitha's brand theme and the small set of components Web Awesome",
    "genuinely doesn't have — is what this skill covers.",
    "",
    "**This file is an index. Go to the reference that matches what you're",
    "building, not the whole catalog:**",
    "",
    "| Building... | Go to |",
    "|---|---|",
    "| A generic UI need — button, input, dialog, tabs, card, badge, tooltip, ... | **`webawesome`** skill's [choosing-components](../webawesome/references/choosing-components.md) decision tree. Covers 50+ components; check here first. |",
    "| Page layout, `<wa-page>`, theming, or brand composition | **`webawesome-design`** skill. Read before hand-rolling any layout grid. |",
    "| A general-purpose Aganitha component or pattern Web Awesome has no equivalent for | [references/core.md](references/core.md) |",
    "| A biological or chemical structure need — molecular viewers, plate layouts | [references/bio.md](references/bio.md) |",
    "",
    "Picking `atk-*` without checking `webawesome` first is the most common",
    "mistake — see [Packs](#packs) below for the full, current list of what",
    "this skill actually adds; don't assume it from memory or an older answer.",
    "",
    agent_rules,
    "",
    "## Quick start",
    "",
    "```bash",
    "npm install @aganitha/atk-ui @awesome.me/webawesome lit",
    "```",
    "",
    "Starting a new project instead of adding to one? Use the `atk-ui start`",
    "command — see the `atk-ui-start` skill. Full install and styling steps for",
    "an existing project: [Installation](references/installation.md).",
    "",
    "Two kinds of thing:",
    "",
    "- **Components** are custom elements. Write the tag.",
    "- **Patterns** are markup plus our CSS classes. Copy the markup.",
    "",
    "How to use either one, plus local one-off components (D17 — for a need",
    "specific to your project, not the shared catalog): [Usage](references/usage.md).",
    "",
    "## Packs",
    "",
    "The catalog is organized into packs so this file stays short as more get",
    "added. Read only the pack(s) that match what you're building — not every",
    "reference file every time.",
    "",
  ];

  for (const [pack, pack_entries] of [...by_pack].sort()) {
    const description = PACK_DESCRIPTIONS[pack] ?? "";
    const names = pack_entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => (e.kind === "component" ? `\`<${e.name}>\`` : `\`${e.name}\``))
      .join(", ");
    lines.push(
      `- **[${pack}](references/${pack}.md)** — ${description}`,
      `  (${pack_entries.length}: ${names})`,
    );
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * One references/<pack>.md per pack — the same shape the old inline SKILL.md
 * listing had, just moved out so adding a pack never grows SKILL.md itself.
 */
function render_pack(pack: string, entries: Entry[]): string {
  const by_group = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = by_group.get(entry.group) ?? [];
    list.push(entry);
    by_group.set(entry.group, list);
  }

  const lines = [
    GENERATED_NOTE,
    "",
    `# ${pack} pack`,
    "",
    PACK_DESCRIPTIONS[pack] ?? "",
    "",
  ];

  for (const [group, group_entries] of [...by_group].sort()) {
    lines.push(`## ${group}`, "");
    for (const entry of group_entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const label = entry.kind === "component" ? `\`<${entry.name}>\`` : `\`${entry.name}\``;
      lines.push(
        `- [${label}](${entry.name}.md) — ${entry.summary}`,
        `  - Use when: ${entry.use}`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

// --- main ---------------------------------------------------------------

const check_only = process.argv.includes("--check");

await $`bunx cem analyze --config custom-elements-manifest.config.mjs`.quiet();

const entries = [...(await read_components()), ...(await read_patterns())];

/**
 * The same entries, as JSON. `atk-ui preview` reads this — a browsable
 * catalog is a different presentation of what the skill already says, not a
 * second source of truth to keep in sync by hand.
 */
function render_catalog(entries: Entry[]): string {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name));
  const catalog = sorted.map(({ name, kind, group, pack, summary, use, avoid, example, module, body }) => ({
    name,
    kind,
    group,
    pack,
    summary,
    use,
    avoid,
    example,
    module,
    // The full reference doc, inline. `atk-ui preview` ships as a standalone
    // binary with no sibling files (D18) — this is what lets it show the
    // full reference without a per-file fetch it has no way to make.
    body,
  }));
  return JSON.stringify(catalog, null, 2) + "\n";
}

/**
 * Static prose, not derived from component/pattern sources — installation
 * and usage do not vary per entry. Still "generated" in the sense that
 * matters here: the committed output must match this source, checked the
 * same way as everything else, so it cannot drift silently.
 */
async function read_static(name: string): Promise<string> {
  const source = await readFile(join(ROOT, "tools/skill-content", `${name}.md`), "utf8");
  return `${GENERATED_NOTE}\n\n${source}`;
}

const by_pack = new Map<string, Entry[]>();
for (const entry of entries) {
  const list = by_pack.get(entry.pack) ?? [];
  list.push(entry);
  by_pack.set(entry.pack, list);
}

const files = new Map<string, string>([
  [join(SKILL_DIR, "SKILL.md"), await render_skill(entries)],
  [join(SKILL_DIR, "catalog.json"), render_catalog(entries)],
  [join(SKILL_DIR, "references", "installation.md"), await read_static("installation")],
  [join(SKILL_DIR, "references", "usage.md"), await read_static("usage")],
  ...[...by_pack].map(
    ([pack, pack_entries]) => [join(SKILL_DIR, "references", `${pack}.md`), render_pack(pack, pack_entries)] as [string, string],
  ),
  ...entries.map(
    (e) => [join(SKILL_DIR, "references", `${e.name}.md`), e.body] as [string, string],
  ),
]);

if (check_only) {
  const stale: string[] = [];
  for (const [path, content] of files) {
    const current = existsSync(path) ? await readFile(path, "utf8") : null;
    if (current !== content) stale.push(path.replace(ROOT, ""));
  }
  if (stale.length) {
    console.error("Generated files are out of date:\n  " + stale.join("\n  "));
    console.error("\nRun `make generate` and commit the result.");
    process.exit(1);
  }
  console.log(`✓ ${files.size} generated files are current`);
} else {
  await mkdir(join(SKILL_DIR, "references"), { recursive: true });
  for (const [path, content] of files) await writeFile(path, content);
  console.log(`✓ wrote ${files.size} files for ${entries.length} entries`);
}
