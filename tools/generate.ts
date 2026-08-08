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
  summary: string;
  use: string;
  avoid: string;
  body: string;
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
        summary: declaration.summary ?? declaration.description?.split("\n")[0] ?? "",
        use: declaration.atkUse ?? "",
        avoid: declaration.atkAvoid ?? "",
        body: render_component(tag, declaration),
      });
    }
  }

  return entries;
}

function render_component(tag: string, d: ManifestDeclaration): string {
  const lines: string[] = [`# \`<${tag}>\``, "", d.summary ?? "", ""];

  if (d.atkUse) lines.push(`**Use it when:** ${d.atkUse}`, "");
  if (d.atkAvoid) lines.push(`**Do not use it when:** ${d.atkAvoid}`, "");

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
      summary: meta["summary"]!,
      use: meta["use"]!,
      avoid: meta["avoid"]!,
      body:
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

function render_skill(entries: Entry[]): string {
  const by_group = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = by_group.get(entry.group) ?? [];
    list.push(entry);
    by_group.set(entry.group, list);
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
    "# atk-ui",
    "",
    "Aganitha's additions to Web Awesome. **Web Awesome comes first**: if it has a",
    "component for what you need, use `wa-` directly and do not look here. This",
    "skill covers only what Web Awesome does not provide.",
    "",
    "**Do not write these from memory.** Both Web Awesome and this package appear",
    "in training data at older versions. Read the reference file before using",
    "anything below — the attribute names have changed.",
    "",
    "Two kinds of thing:",
    "",
    "- **Components** are custom elements. Write the tag.",
    "- **Patterns** are markup plus our CSS classes. Copy the markup.",
    "",
  ];

  for (const [group, group_entries] of [...by_group].sort()) {
    lines.push(`## ${group}`, "");
    for (const entry of group_entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const label = entry.kind === "component" ? `\`<${entry.name}>\`` : `\`${entry.name}\``;
      lines.push(
        `- [${label}](references/${entry.name}.md) — ${entry.summary}`,
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

const files = new Map<string, string>([
  [join(SKILL_DIR, "SKILL.md"), render_skill(entries)],
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
