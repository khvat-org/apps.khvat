export const TABLET_WIDTH = 564;

const MIN_CANVAS_SIZE = 280;
const MAX_CANVAS_SIZE = 564;
const PAGE_PADDING = 16;

const calculateCanvasSize = (width: number, height: number) => {
  const pagePadding = 16;

  // * For mobile
  if (width < TABLET_WIDTH) {
    return width - pagePadding * 2;
  }

  // * For vertical tablet
  if (width > TABLET_WIDTH && height > width) {
    return TABLET_WIDTH;
  }

  // * For horizontal tablet
  if (width > height) {
    return height - 520;
  }

  return 0;
};

export const getCanvasSize = (
  width: number,
  height: number,
  options?: { min?: number; max?: number },
) => {
  const canvasSize = calculateCanvasSize(width, height);
  const min = Math.min(options?.min ?? MIN_CANVAS_SIZE, width - PAGE_PADDING * 2);

  if (canvasSize <= min) {
    return min;
  }

  if (canvasSize >= (options?.max ?? MAX_CANVAS_SIZE)) {
    return options?.max ?? MAX_CANVAS_SIZE;
  }

  return canvasSize;
};
