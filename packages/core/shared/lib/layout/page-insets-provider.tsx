import React, { ReactNode, useMemo } from "react";

import { Platform } from "react-native";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

import { getAsymmetricSide } from "./get-asymmetric-side";
import { PAGE_PADDING, PAGE_PADDING_LARGE } from "./use-page-padding";

export const PageInsetsProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();

  const value = useMemo(() => {
    if (!getAsymmetricSide(insets)) return insets;

    return {
      ...insets,
      top: Math.max(insets.top, PAGE_PADDING_LARGE),
      bottom: Platform.OS === "ios" ? Math.min(insets.bottom, PAGE_PADDING) : insets.bottom,
    };
  }, [insets]);

  return <SafeAreaInsetsContext.Provider value={value}>{children}</SafeAreaInsetsContext.Provider>;
};
