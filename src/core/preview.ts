/**
 * Run the catalog, locally. `atk-ui preview` calls this.
 *
 * `atk-ui` ships as a standalone compiled binary (D18 in docs/design.md) —
 * there is no sibling `dist/`, `skills/`, or `node_modules` next to it once
 * it lives in `~/.aganitha/bin/`. So everything this needs is embedded at
 * compile time with Bun's `with { type: "file" }`, which requires a static,
 * known-at-build-time path — that is why `catalog.json` carries each entry's
 * full reference body already, and why `tools/bundle_preview.ts` exists: it
 * regenerates one fixed file, `dist/preview/components.embed`, from whatever
 * the catalog currently lists, so this file only ever needs one static
 * import for "every component," however many there are.
 *
 * Web Awesome is the one thing not embedded — it is large (50+ components),
 * so its own CDN carries it instead, exactly as D10 already allows for
 * preview use. The version is read from `@awesome.me/webawesome`'s own
 * `package.json` at *build* time (a normal import, resolved by the
 * bundler), so the CDN link always matches the peer version this binary was
 * built against.
 */
import catalog_embed_path from "../../dist/preview/catalog.embed" with { type: "file" };
import theme_css_path from "../../dist/theme/theme.css" with { type: "file" };
import patterns_css_path from "../../dist/patterns/patterns.css" with { type: "file" };
import components_embed_path from "../../dist/preview/components.embed" with { type: "file" };
import webawesome_package from "@awesome.me/webawesome/package.json";

const WA_CDN = `https://ka-f.webawesome.com/webawesome@${webawesome_package.version}`;

interface CatalogEntry {
  name: string;
  kind: "component" | "pattern";
  group: string;
  summary: string;
  use: string;
  avoid: string;
  example?: string;
  module?: string;
  body: string;
}

export interface PreviewServer {
  url: string;
  entry_count: number;
  stop: () => void;
}

async function read_catalog(): Promise<CatalogEntry[]> {
  return JSON.parse(await Bun.file(catalog_embed_path).text()) as CatalogEntry[];
}

function escape_html(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}

function render_page(entries: CatalogEntry[]): string {
  const by_group = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    const list = by_group.get(entry.group) ?? [];
    list.push(entry);
    by_group.set(entry.group, list);
  }

  const sections = [...by_group.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, group_entries]) => {
      const cards = group_entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => {
          const label = e.kind === "component" ? `&lt;${e.name}&gt;` : e.name;
          const example = e.example
            ? `<div class="example">${e.example}</div>
          <pre><code>${escape_html(e.example)}</code></pre>`
            : `<p class="none">No runnable example yet.</p>`;
          return `
        <article class="entry">
          <header>
            <h3>${label}</h3>
            <span class="kind">${e.kind}</span>
          </header>
          <p>${escape_html(e.summary)}</p>
          ${example}
          <p><strong>Use it when:</strong> ${escape_html(e.use)}</p>
          <p><strong>Do not use it when:</strong> ${escape_html(e.avoid)}</p>
          <details>
            <summary>Full reference</summary>
            <pre>${escape_html(e.body)}</pre>
          </details>
        </article>`;
        })
        .join("\n");
      return `<section><h2>${escape_html(group)}</h2>${cards}</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html class="atk-theme">
<head>
<meta charset="utf-8" />
<title>atk-ui catalog</title>
<link rel="stylesheet" href="${WA_CDN}/styles/themes/default.css" />
<link rel="stylesheet" href="${WA_CDN}/styles/utilities.css" />
<link rel="stylesheet" href="/atk/theme.css" />
<link rel="stylesheet" href="/atk/patterns.css" />
<script type="module" src="${WA_CDN}/webawesome.loader.js"></script>
<script type="module" src="/atk/components.js"></script>
<style>
  body { margin: 0; padding: var(--wa-space-l); font: var(--wa-font-size-m)/1.5 var(--wa-font-family-body); }
  h1 { font-size: var(--wa-font-size-2xl); }
  section { margin-block-end: var(--wa-space-xl); }
  .entry {
    border: var(--wa-border-width-s) var(--wa-border-style) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    padding: var(--wa-space-m);
    margin-block-end: var(--wa-space-m);
  }
  .entry header { display: flex; align-items: baseline; gap: var(--wa-space-s); }
  .kind { color: var(--wa-color-text-quiet); font-size: var(--wa-font-size-s); }
  .example {
    border: var(--wa-border-width-s) dashed var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    padding: var(--wa-space-m);
    margin-block: var(--wa-space-s);
  }
  pre {
    background: var(--wa-color-surface-lowered);
    padding: var(--wa-space-s);
    overflow-x: auto;
    border-radius: var(--wa-border-radius-s);
    white-space: pre-wrap;
  }
  .none { color: var(--wa-color-text-quiet); font-style: italic; }
</style>
</head>
<body>
<h1>atk-ui catalog</h1>
<p>${entries.length} entries. Generated from source — never edited by hand.</p>
${sections}
</body>
</html>`;
}

const ASSETS: Record<string, { path: string; type: string }> = {
  "/atk/theme.css": { path: theme_css_path, type: "text/css; charset=utf-8" },
  "/atk/patterns.css": { path: patterns_css_path, type: "text/css; charset=utf-8" },
  "/atk/components.js": { path: components_embed_path, type: "text/javascript; charset=utf-8" },
};

export async function start_preview(options: { port?: number } = {}): Promise<PreviewServer> {
  const entries = await read_catalog();
  const page = render_page(entries);

  const server = Bun.serve({
    port: options.port ?? 0,
    fetch(request) {
      const { pathname } = new URL(request.url);

      if (pathname === "/") {
        return new Response(page, { headers: { "content-type": "text/html; charset=utf-8" } });
      }
      const asset = ASSETS[pathname];
      if (asset) {
        return new Response(Bun.file(asset.path), { headers: { "content-type": asset.type } });
      }
      return new Response("Not found", { status: 404 });
    },
  });

  return {
    url: server.url.toString(),
    entry_count: entries.length,
    stop: () => server.stop(),
  };
}
