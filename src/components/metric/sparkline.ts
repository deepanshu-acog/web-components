/** Geometry for a sparkline, in viewBox units. */
export interface SparklineGeometry {
  /** `points` value for an SVG polyline. */
  points: string;
  /** The reference band, if a range was given and it overlaps the data. */
  band: { y: number; height: number } | null;
  /** The most recent point, for marking the current value. */
  last: { x: number; y: number };
}

export interface SparklineOptions {
  width: number;
  height: number;
  /** Lower bound of the normal range. */
  low?: number | undefined;
  /** Upper bound of the normal range. */
  high?: number | undefined;
}

/**
 * Work out the geometry for a sparkline.
 *
 * Returns `null` when there is nothing meaningful to draw — fewer than two
 * points. Callers should render the value on its own in that case rather than
 * an empty chart.
 *
 * The vertical scale spans the data and the reference range together, so a
 * value sitting outside its normal range is visibly outside the band rather
 * than clipped at the edge.
 */
export function sparkline_geometry(
  series: readonly number[],
  options: SparklineOptions,
): SparklineGeometry | null {
  const points = series.filter((n) => Number.isFinite(n));
  if (points.length < 2) return null;

  const { width, height, low, high } = options;

  const candidates = [...points];
  if (low !== undefined && Number.isFinite(low)) candidates.push(low);
  if (high !== undefined && Number.isFinite(high)) candidates.push(high);

  let min = Math.min(...candidates);
  let max = Math.max(...candidates);

  // A flat series has no range. Give it one so the line lands mid-height
  // instead of dividing by zero.
  if (min === max) {
    min -= 1;
    max += 1;
  }

  const scale_y = (v: number): number =>
    height - ((v - min) / (max - min)) * height;
  const step = width / (points.length - 1);

  const coords = points.map((v, i) => ({ x: i * step, y: scale_y(v) }));

  let band: SparklineGeometry["band"] = null;
  if (low !== undefined && high !== undefined && Number.isFinite(low) && Number.isFinite(high)) {
    const top = scale_y(Math.max(low, high));
    const bottom = scale_y(Math.min(low, high));
    band = { y: top, height: Math.max(0, bottom - top) };
  }

  return {
    points: coords.map((c) => `${round(c.x)},${round(c.y)}`).join(" "),
    band,
    // `coords` is non-empty because `points.length >= 2`.
    last: coords[coords.length - 1]!,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
