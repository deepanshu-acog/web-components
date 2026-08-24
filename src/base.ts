import { LitElement, css, type CSSResultGroup } from "lit";

/**
 * Host styles applied to every atk-ui component.
 *
 * Custom elements default to `display: inline`, which is wrong for almost
 * everything we build and produces layout bugs that are hard to trace back to
 * their cause. Setting it once here means no component has to remember.
 */
const host_styles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;

/**
 * The base class for every atk-ui component.
 *
 * It currently holds very little, and that is deliberate — see decision D8 in
 * `docs/design.md`. Its job is to be the single place that changes if the
 * component base ever has to, and to carry the few behaviours that every
 * component needs but no component should have to remember.
 *
 * Subclasses set `static css` rather than `static styles`, so that host styles
 * are always applied. This mirrors how Web Awesome does it, so a contributor
 * reading their source sees the same shape.
 */
export class AganithaComponent extends LitElement {
  /** Component-specific styles. Set this instead of `styles`. */
  static css?: CSSResultGroup;

  static override get styles(): CSSResultGroup {
    return [host_styles, this.css ?? []].flat();
  }
}

/** Alias for AganithaComponent matching Web Awesome's WebAwesomeElement naming pattern. */
export class ATKElement extends AganithaComponent {}

