import { useWindowDimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { getAsymmetricSide, InsetSide } from "../../lib/layout/get-asymmetric-side";

export const SIDE_TAB_BAR_WIDTH = 72;

export type TabBarLayout =
  { position: "bottom" } | { position: InsetSide; width: number; reserve: number };

export const getTabBarLayout = (
  insets: EdgeInsets,
  windowWidth: number,
  windowHeight: number,
): TabBarLayout => {
  const side = getAsymmetricSide(insets);
  if (side) return { position: side, width: insets[side], reserve: 0 };

  if (windowWidth > windowHeight) {
    return {
      position: "left",
      width: insets.left + SIDE_TAB_BAR_WIDTH,
      reserve: SIDE_TAB_BAR_WIDTH,
    };
  }

  return { position: "bottom" };
};

export const useTabBarLayout = (enabled = true): TabBarLayout => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  return enabled ? getTabBarLayout(insets, width, height) : { position: "bottom" };
};
