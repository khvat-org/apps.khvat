interface Point {
  x: number;
  y: number;
}

export function processDrawing(strokesData: Point[][]) {
  const simplifiedStrokes: Point[][] = [];

  strokesData.forEach((stroke) => {
    let simplifiedStroke = simplifyDouglasPeucker(stroke, 0.001);

    if (simplifiedStroke.length > 10) {
      simplifiedStroke = reducePointsToLimit(simplifiedStroke, 40);
    }

    simplifiedStrokes.push(simplifiedStroke);
  });

  return simplifiedStrokes;
}

function simplifyDouglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points;

  const dmax = { value: 0, index: 0 };
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > dmax.value) {
      dmax.value = d;
      dmax.index = i;
    }
  }

  if (dmax.value > epsilon) {
    const left = simplifyDouglasPeucker(points.slice(0, dmax.index + 1), epsilon);
    const right = simplifyDouglasPeucker(points.slice(dmax.index), epsilon);

    return left.slice(0, -1).concat(right);
  } else {
    return [start, end];
  }
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return 0;

  const u = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);
  const ix = lineStart.x + u * dx;
  const iy = lineStart.y + u * dy;
  return Math.sqrt(Math.pow(point.x - ix, 2) + Math.pow(point.y - iy, 2));
}

function reducePointsToLimit(points: Point[], limit: number) {
  const reduced = [];
  const step = (points.length - 1) / (limit - 1);
  for (let i = 0; i < limit; i++) {
    reduced.push(points[Math.round(i * step)]);
  }
  return reduced;
}

export function processReference(strokesData: Point[][]) {
  return strokesData.map((stroke) => simplifyDouglasPeucker(stroke, 0.5));
}
