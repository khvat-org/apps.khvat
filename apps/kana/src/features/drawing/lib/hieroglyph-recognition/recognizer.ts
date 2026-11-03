type Point = number[];
type Stroke = Point[];

export interface RecognitionResult {
  name: string;
  /** Average per-point distance in the normalized [0,1] space. Lower = better match. */
  score: number;
}

/**
 * Every stroke (both templates and the user's drawing) is resampled to this many
 * evenly spaced points. Fixing the point count is what makes the scores comparable:
 * it removes the influence of drawing speed and how many raw touch events a device
 * happened to emit.
 */
const RESAMPLE_POINTS = 32;

function euclidean(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Resample a stroke to exactly `n` points spaced equally along its length
 * (the classic "$1 recognizer" resampling). This is the key fix: the old code
 * compared the raw drawing (hundreds of unevenly spaced points) against the
 * compressed templates (≤40 points), which inflated the distance and produced
 * "I drew it right but it says wrong".
 */
export function resampleStroke(points: Stroke, n = RESAMPLE_POINTS): Stroke {
  if (points.length === 0) return [];

  const first: Point = [points[0][0], points[0][1]];
  if (points.length === 1) {
    return Array.from({ length: n }, () => [first[0], first[1]]);
  }

  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    totalLength += euclidean(points[i - 1], points[i]);
  }
  // A dot / zero-length stroke: just repeat the point.
  if (totalLength === 0) {
    return Array.from({ length: n }, () => [first[0], first[1]]);
  }

  const interval = totalLength / (n - 1);
  const result: Stroke = [first];
  // Work on a mutable copy so we can insert interpolated points as we walk.
  const pts: Stroke = points.map((p) => [p[0], p[1]]);

  let accumulated = 0;
  for (let i = 1; i < pts.length; i++) {
    const segment = euclidean(pts[i - 1], pts[i]);
    if (accumulated + segment >= interval) {
      const t = (interval - accumulated) / segment;
      const q: Point = [
        pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0]),
        pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]),
      ];
      result.push(q);
      pts.splice(i, 0, q); // continue measuring from the new point
      accumulated = 0;
    } else {
      accumulated += segment;
    }
  }

  // Floating-point rounding can leave us one short; pad with the last point.
  const last = pts[pts.length - 1];
  while (result.length < n) result.push([last[0], last[1]]);

  return result.slice(0, n);
}

export function prepareStrokes(strokes: Stroke[], n = RESAMPLE_POINTS): Stroke[] {
  return strokes.filter((stroke) => stroke.length > 0).map((stroke) => resampleStroke(stroke, n));
}

/**
 * Dynamic Time Warping between two equal-length strokes, normalized by length so
 * the result is an *average per-point* distance (roughly 0 = identical, √2 = worst).
 * DTW (rather than a rigid point-by-point compare) keeps a little tolerance for
 * local timing differences while still respecting stroke direction/order.
 */
function dtwDistance(a: Stroke, b: Stroke): number {
  const n = a.length;
  const m = b.length;

  // Rolling two-row DTW table to keep memory small.
  let prev = new Array<number>(m + 1).fill(Infinity);
  let curr = new Array<number>(m + 1).fill(Infinity);
  prev[0] = 0;

  for (let i = 1; i <= n; i++) {
    curr[0] = Infinity;
    for (let j = 1; j <= m; j++) {
      const cost = euclidean(a[i - 1], b[j - 1]);
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }

  return prev[m] / Math.max(n, m);
}

function strokeLength(stroke: Stroke): number {
  let length = 0;
  for (let i = 1; i < stroke.length; i++) {
    length += euclidean(stroke[i - 1], stroke[i]);
  }
  return length;
}

function centerStroke(stroke: Stroke): Stroke {
  const centerX = stroke.reduce((sum, point) => sum + point[0], 0) / stroke.length;
  const centerY = stroke.reduce((sum, point) => sum + point[1], 0) / stroke.length;
  return stroke.map((point) => [point[0] - centerX, point[1] - centerY]);
}

function segmentIntersection(a: Point, b: Point, c: Point, d: Point): [number, number] | null {
  const abX = b[0] - a[0];
  const abY = b[1] - a[1];
  const cdX = d[0] - c[0];
  const cdY = d[1] - c[1];
  const cross = abX * cdY - abY * cdX;
  if (Math.abs(cross) < 1e-9) return null;

  const onAb = ((c[0] - a[0]) * cdY - (c[1] - a[1]) * cdX) / cross;
  const onCd = ((c[0] - a[0]) * abY - (c[1] - a[1]) * abX) / cross;

  return onAb >= 0 && onAb <= 1 && onCd >= 0 && onCd <= 1 ? [onAb, onCd] : null;
}

function cumulativeLengths(stroke: Stroke): number[] {
  const lengths = [0];
  for (let i = 1; i < stroke.length; i++) {
    lengths.push(lengths[i - 1] + euclidean(stroke[i - 1], stroke[i]));
  }
  return lengths;
}

function crossingDepth(a: Stroke, b: Stroke): number {
  const lengthsA = cumulativeLengths(a);
  const lengthsB = cumulativeLengths(b);
  const totalA = lengthsA[lengthsA.length - 1];
  const totalB = lengthsB[lengthsB.length - 1];

  let depth = 0;
  for (let i = 1; i < a.length; i++) {
    for (let j = 1; j < b.length; j++) {
      const hit = segmentIntersection(a[i - 1], a[i], b[j - 1], b[j]);
      if (!hit) continue;

      const positionA = lengthsA[i - 1] + hit[0] * (lengthsA[i] - lengthsA[i - 1]);
      const positionB = lengthsB[j - 1] + hit[1] * (lengthsB[j] - lengthsB[j - 1]);

      depth = Math.max(
        depth,
        Math.min(positionA, totalA - positionA, positionB, totalB - positionB),
      );
    }
  }

  return depth;
}

class Recognizer {
  private templates: { name: string; strokes: Stroke[] }[] = [];

  addTemplate(name: string, strokes: Stroke[]) {
    this.templates.push({ name, strokes: prepareStrokes(strokes) });
  }

  clear() {
    this.templates = [];
  }

  /**
   * Score the drawing against every template. Returns *all* stroke-count matches
   * sorted from best (lowest score) to worst. The pass/fail decision is left to the
   * caller, which knows the target letter and can compare it against the best match
   * instead of relying on a single magic threshold.
   */
  recognize(drawnStrokes: Stroke[]): RecognitionResult[] {
    const input = prepareStrokes(drawnStrokes);
    if (input.length === 0) return [];

    const results: RecognitionResult[] = [];
    for (const template of this.templates) {
      // Stroke count is canonical for kana; characters with alternative stroke
      // counts (き, さ, る …) are registered as separate "vN" variants.
      if (template.strokes.length !== input.length) continue;

      let total = 0;
      for (let i = 0; i < input.length; i++) {
        total += dtwDistance(input[i], template.strokes[i]);
      }
      results.push({ name: template.name, score: total / input.length });
    }

    return results.sort((a, b) => a.score - b.score);
  }

  private findTemplate(name: string, strokeCount: number) {
    return this.templates.find((item) => item.name === name && item.strokes.length === strokeCount);
  }

  hasOverlongStroke(
    drawnStrokes: Stroke[],
    name: string,
    maxExcess: number,
    maxRatio: number,
  ): boolean {
    const input = prepareStrokes(drawnStrokes);
    const template = this.findTemplate(name, input.length);
    if (!template) return true;

    return input.some((stroke, i) => {
      const drawn = strokeLength(stroke);
      const expected = strokeLength(template.strokes[i]);
      return drawn - expected > maxExcess && drawn > expected * maxRatio;
    });
  }

  crossingDifference(drawnStrokes: Stroke[], name: string): { extra: number; missing: number } {
    const input = prepareStrokes(drawnStrokes);
    const template = this.findTemplate(name, input.length);
    if (!template) return { extra: Infinity, missing: Infinity };

    let extra = 0;
    let missing = 0;
    for (let i = 0; i < input.length; i++) {
      for (let j = i + 1; j < input.length; j++) {
        const drawn = crossingDepth(input[i], input[j]);
        const expected = crossingDepth(template.strokes[i], template.strokes[j]);
        extra = Math.max(extra, drawn - expected);
        missing = Math.max(missing, expected - drawn);
      }
    }

    return { extra, missing };
  }

  isStrokeOrderCorrect(drawnStrokes: Stroke[], name: string): boolean {
    const input = prepareStrokes(drawnStrokes);
    const template = this.findTemplate(name, input.length);
    if (!template) return false;

    const expected = template.strokes;

    const isDirectionCorrect = input.every((stroke, i) => {
      const drawn = centerStroke(stroke);
      const target = centerStroke(expected[i]);
      return dtwDistance(drawn, target) <= dtwDistance([...drawn].reverse(), target);
    });
    if (!isDirectionCorrect) return false;

    for (let i = 0; i < input.length; i++) {
      for (let j = i + 1; j < input.length; j++) {
        const inOrder = dtwDistance(input[i], expected[i]) + dtwDistance(input[j], expected[j]);
        const swapped = dtwDistance(input[i], expected[j]) + dtwDistance(input[j], expected[i]);
        if (swapped < inOrder) return false;
      }
    }

    return true;
  }
}

export default Recognizer;
