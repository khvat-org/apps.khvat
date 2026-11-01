import React, { ReactNode, useMemo } from "react";

import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomTabVisibility } from "../../contexts/bottom-tab-visibility";

import { useTabBarLayout } from "./use-tab-bar-layout";

export const TabScreenInsets = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const layout = useTabBarLayout();
  const { isVisible } = useBottomTabVisibility();

  const value = useMemo(() => {
    if (!isVisible || layout.position === "bottom" || layout.reserve === 0) return insets;
    return { ...insets, [layout.position]: layout.width };
  }, [insets, isVisible, layout]);

  return <SafeAreaInsetsContext.Provider value={value}>{children}</SafeAreaInsetsContext.Provider>;
};
