import { createContext, useContext } from "react";

import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getAsymmetricSide } from "../../lib/layout/get-asymmetric-side";

export interface SideRailInsets {
  top?: number;
  bottom?: number;
}

export const SideRailInsetsContext = createContext<SideRailInsets | undefined>(undefined);

export const useSideRailInsets = () => useContext(SideRailInsetsContext);

export const useHasSideRailActions = () => {
  const insets = useSafeAreaInsets();
  const sideRail = useSideRailInsets();

  return Platform.OS === "ios" && !!sideRail && !!getAsymmetricSide(insets);
};
