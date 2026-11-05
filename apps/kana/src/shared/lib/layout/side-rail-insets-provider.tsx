import React, { ReactNode } from "react";

import {
  SideRailInsets,
  SideRailInsetsContext,
} from "@nihongo/core/shared/ui/bottom-tap/side-rail-insets-context";
import { useTabBarLayout } from "@nihongo/core/shared/ui/bottom-tap/use-tab-bar-layout";
import { useWindowDimensions } from "react-native";
import { ReservedRegion, useReservedRegions } from "react-native-reserved-regions";

const STATUS_REGION_MIN_HEIGHT = 100;
const STATUS_REGION_OVERLAP = 12;
const FALLBACK_OPEN_TOP_INSET = 112;
const FALLBACK_CLOSED_TOP_INSET = 162;
const FALLBACK_CLOSED_LANDSCAPE_INSET = 82;
const CLOSED_MAX_SHORT_SIDE = 500;

interface SideRail {
  side: "left" | "right";
  width: number;
}

const getFallbackInsets = (windowWidth: number, windowHeight: number): SideRailInsets => {
  if (Math.min(windowWidth, windowHeight) >= CLOSED_MAX_SHORT_SIDE) {
    return { top: FALLBACK_OPEN_TOP_INSET };
  }

  if (windowWidth > windowHeight) {
    return { top: FALLBACK_CLOSED_LANDSCAPE_INSET, bottom: FALLBACK_CLOSED_LANDSCAPE_INSET };
  }

  return { top: FALLBACK_CLOSED_TOP_INSET };
};

export const getSideRailInsets = (
  regions: readonly ReservedRegion[],
  rail: SideRail,
  windowWidth: number,
  windowHeight: number,
): SideRailInsets => {
  const railStart = rail.side === "right" ? windowWidth - rail.width : 0;
  const railEnd = railStart + rail.width;

  const frames = regions
    .filter(
      ({ kind, frame }) =>
        kind === "occlusion" && frame.x < railEnd && frame.x + frame.width > railStart,
    )
    .map(({ frame }) => frame);

  if (frames.length === 0) return getFallbackInsets(windowWidth, windowHeight);

  const isBottom = frames.every(({ y, height }) => y + height / 2 > windowHeight / 2);

  if (isBottom) {
    return { bottom: windowHeight - Math.min(...frames.map(({ y }) => y)) };
  }

  const bottom = Math.max(...frames.map(({ y, height }) => y + height));
  const hasStatusBar = frames.some(({ height }) => height >= STATUS_REGION_MIN_HEIGHT);

  return { top: hasStatusBar ? bottom - STATUS_REGION_OVERLAP : bottom };
};

export const SideRailInsetsProvider = ({ children }: { children: ReactNode }) => {
  const layout = useTabBarLayout();
  const regions = useReservedRegions();
  const { width, height } = useWindowDimensions();

  const getValue = (): SideRailInsets | undefined => {
    if (layout.position === "bottom") return undefined;
    if (layout.reserve !== 0) return {};

    return getSideRailInsets(
      regions,
      { side: layout.position, width: layout.width },
      width,
      height,
    );
  };

  return (
    <SideRailInsetsContext.Provider value={getValue()}>{children}</SideRailInsetsContext.Provider>
  );
};
