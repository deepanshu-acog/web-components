/**
 * Two CSS checks, both for failures that are silent today.
 *
 * 1. Every `--wa-` token we reference must exist. A typo in a custom property
 *    produces no error and no warning — the declaration is simply dropped and
 *    the element renders unstyled. This is impossible to catch in review and
 *    easy to catch here.
 *
 * 2. No literal colours. The theme decides what danger looks like. A hardcoded
 *    colour survives a rebrand, ignores dark mode, and is invisible until
 *    someone looks at the right page in the right theme.
 *
 * Both run over pattern stylesheets and over the `css` template literals
 * inside components, because a component's styles are just as much our CSS.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const WA_DIST = join(ROOT, "node_modules/@awesome.me/webawesome/dist");

/** Values that look like colours but carry no brand decision. */
const ALLOWED_KEYWORDS = new Set([
  "currentcolor",
  "transparent",
  "inherit",
  "initial",
  "unset",
  "none",
  "revert",
]);

const COLOUR_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "hex colour", re: /#[0-9a-f]{3,8}\b/gi },
  { name: "rgb()", re: /\brgba?\s*\(/gi },
  { name: "hsl()", re: /\bhsla?\s*\(/gi },
  { name: "oklch()/oklab()", re: /\bokl(ch|ab)\s*\(/gi },
  { name: "colour keyword", re: /:\s*(red|blue|green|black|white|grey|gray|orange|yellow|purple)\b/gi },
];

interface Source {
  path: string;
  css: string;
}

/** Collect the CSS we own: pattern stylesheets and component `css` blocks. */
async function collect_sources(): Promise<Source[]> {
  const sources: Source[] = [];

  const walk = async (dir: string): Promise<string[]> => {
    const out: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...(await walk(full)));
      else out.push(full);
    }
    return out;
  };

  for (const file of await walk(join(ROOT, "src"))) {
    if (file.endsWith(".css")) {
      sources.push({ path: file, css: await readFile(file, "utf8") });
    } else if (file.endsWith(".ts")) {
      const text = await readFile(file, "utf8");
      // Only the contents of css`...` blocks are CSS. Everything else in a
      // .ts file is TypeScript and would produce nonsense matches.
      const blocks = [...text.matchAll(/\bcss`([\s\S]*?)`/g)].map((m) => m[1]!);
      if (blocks.length) sources.push({ path: file, css: blocks.join("\n") });
    }
  }

  return sources;
}

/** Every `--wa-` custom property Web Awesome actually defines. */
async function known_wa_tokens(): Promise<Set<string>> {
  const tokens = new Set<string>();

  const walk = async (dir: string): Promise<void> => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (full.endsWith(".css")) {
        const text = await readFile(full, "utf8");
        for (const match of text.matchAll(/(--wa-[a-z0-9-]+)\s*:/gi)) {
          tokens.add(match[1]!.toLowerCase());
        }
      }
    }
  };

  await walk(WA_DIST);
  return tokens;
}

const problems: string[] = [];

function line_of(css: string, index: number): number {
  return css.slice(0, index).split("\n").length;
}

const sources = await collect_sources();
const known = await known_wa_tokens();

if (known.size === 0) {
  console.error("Could not read Web Awesome's tokens. Run `make install` first.");
  process.exit(1);
}

for (const source of sources) {
  const where = relative(ROOT, source.path);

  for (const match of source.css.matchAll(/var\(\s*(--wa-[a-z0-9-]+)/gi)) {
    const token = match[1]!.toLowerCase();
    if (!known.has(token)) {
      problems.push(
        `${where}:${line_of(source.css, match.index)} — ${token} is not a Web Awesome token. ` +
          `A misspelled custom property is dropped silently.`,
      );
    }
  }

  for (const { name, re } of COLOUR_PATTERNS) {
    for (const match of source.css.matchAll(re)) {
      const value = match[0].replace(/^:\s*/, "").toLowerCase();
      if (ALLOWED_KEYWORDS.has(value)) continue;
      problems.push(
        `${where}:${line_of(source.css, match.index)} — literal ${name} "${match[0].trim()}". ` +
          `Use a --wa- token; the theme decides colour.`,
      );
    }
  }
}

if (problems.length) {
  console.error("CSS check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}

console.log(
  `✓ CSS check passed — ${sources.length} sources, ${known.size} known Web Awesome tokens`,
);
