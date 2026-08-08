/**
 * Custom Elements Manifest configuration.
 *
 * The manifest is the single source of truth for everything an AI assistant
 * and an editor know about our components. It is generated, never edited.
 */
export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/**/*.test.ts", "src/index.ts", "src/base.ts", "src/define.ts", "src/**/sparkline.ts"],
  outdir: ".",
  litelement: true,
  plugins: [atk_tags_plugin()],
};

/**
 * Capture the two tags the standard does not have.
 *
 * The Custom Elements Manifest describes what an element *is*. It has no way
 * to say when to choose it over another element, which is the thing an AI
 * assistant most needs and gets wrong most often. Web Awesome hit the same
 * problem and ships a whole "choosing components" document for it.
 */
function atk_tags_plugin() {
  const wanted = { "atk-use": "atkUse", "atk-avoid": "atkAvoid" };

  return {
    name: "atk-tags",
    analyzePhase({ ts, node, moduleDoc }) {
      if (node.kind !== ts.SyntaxKind.ClassDeclaration) return;

      const class_name = node.name?.getText();
      const declaration = moduleDoc.declarations?.find((d) => d.name === class_name);
      if (!declaration) return;

      for (const jsdoc of node.jsDoc ?? []) {
        for (const tag of jsdoc.tags ?? []) {
          const key = wanted[tag.tagName?.getText()];
          if (!key) continue;
          const text =
            typeof tag.comment === "string"
              ? tag.comment
              : (tag.comment ?? []).map((part) => part.text).join("");
          declaration[key] = text.trim().replace(/\s+/g, " ");
        }
      }
    },
  };
}
