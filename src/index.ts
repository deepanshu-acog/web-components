/**
 * Convenience entry point. Importing this registers every component.
 *
 * Applications that care about bundle size should import the components they
 * use instead:
 *
 * ```ts
 * import "@aganitha/atk-ui/components/metric";
 * ```
 */

export { AganithaComponent } from "./base.js";
export { define } from "./define.js";

export { AtkMetric } from "./components/metric/metric.js";
export { sparkline_geometry } from "./components/metric/sparkline.js";
export type { SparklineGeometry, SparklineOptions } from "./components/metric/sparkline.js";

export { AtkGoRibbon } from "./components/go-ribbon/go-ribbon.js";
