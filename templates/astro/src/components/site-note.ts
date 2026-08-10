import { css, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AganithaComponent } from "@aganitha/atk-ui";
import { define } from "@aganitha/atk-ui";

/**
 * The local-component recipe (D17 in atk-ui's docs/design.md): a plain `.ts`
 * file extending `AganithaComponent`, living in this project's own
 * `src/components/`, imported into an `.astro` file like any other module —
 * no special Astro configuration needed, Vite bundles it the same way it
 * bundles everything else.
 *
 * This is a *local* component. It is specific to this project, not part of
 * the shared atk-ui catalog — that is why it is tagged `site-note`, not
 * `atk-note`. Rename the `site-` prefix to your own project's before you
 * build on this template. If the same shape shows up in several projects,
 * that is when it is worth asking the core team to harvest it into atk-ui
 * proper (D17) — nothing here promotes itself automatically.
 */
export class SiteNote extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      border-inline-start: var(--wa-border-width-l) var(--wa-border-style) var(--wa-color-brand-border-loud);
      background: var(--wa-color-brand-fill-quiet);
      border-radius: var(--wa-border-radius-m);
      padding: var(--wa-space-m);
      color: var(--wa-color-text-normal);
    }
  `;

  /** What is being said about this project. Keep it to a sentence or two. */
  @property() label = "Note";

  override render(): TemplateResult {
    return html`
      <strong>${this.label}:</strong>
      <slot></slot>
    `;
  }
}

define("site-note", SiteNote);
