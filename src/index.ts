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

export { AganithaComponent, ATKElement } from "./base.js";
export { define } from "./define.js";

export { AtkMetric } from "./components/metric/metric.js";
export { sparkline_geometry } from "./components/metric/sparkline.js";
export type { SparklineGeometry, SparklineOptions } from "./components/metric/sparkline.js";

export { AtkGoRibbon } from "./components/go-ribbon/go-ribbon.js";
export { AtkSidenote } from "./components/sidenote/sidenote.js";
export { AtkTimeline } from "./components/timeline/timeline.js";
export { AtkTimelineItem } from "./components/timeline-item/timeline-item.js";
export { AtkProcess } from "./components/process/process.js";
export { AtkStep } from "./components/step/step.js";
export { AtkMermaid } from "./components/mermaid/mermaid.js";
export { AtkMolstar } from "./components/molstar/molstar.js";
export { AtkDataTable } from "./components/data-table/data-table.js";
export { AtkChart } from "./components/chart/chart.js";
export { AtkWellPlate } from "./components/well-plate/well-plate.js";
export type { WellData, WellState } from "./components/well-plate/well-plate.js";

