export const normalizeCoordinates = (
  data: Array<Array<{ x: number; y: number }>>,
): number[][][] => {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  data.forEach((path) => {
    path.forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return data.map((path) =>
    path.map((point) => [(point.x - minX) / width, (point.y - minY) / height]),
  );
};

export const canvasCoordinates = (
  data: Array<Array<{ x: number; y: number }>>,
  canvasSize: number,
): number[][][] =>
  data.map((path) => path.map((point) => [point.x / canvasSize, point.y / canvasSize]));
