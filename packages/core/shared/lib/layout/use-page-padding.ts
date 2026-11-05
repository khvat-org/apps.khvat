import { useWindowDimensions } from "react-native";

export const PAGE_PADDING = 16;
export const PAGE_PADDING_LARGE = 24;

const LARGE_SCREEN_MIN_SHORT_SIDE = 600;

export const usePagePadding = () => {
  const { width, height } = useWindowDimensions();

  return Math.min(width, height) >= LARGE_SCREEN_MIN_SHORT_SIDE ? PAGE_PADDING_LARGE : PAGE_PADDING;
};
