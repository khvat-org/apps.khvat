import { useCallback, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";

export const ANSWER_CARDS_GAP = 16;

const MAX_CARD_SIZE = (TABLET_WIDTH - 50) / 2;

const LAYOUT_PADDING = 32;

export const useAnswerCardSize = () => {
  const window = useWindowDimensions();
  const [area, setArea] = useState<{ width: number; height: number } | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setArea((prev) =>
      prev?.width === width && prev?.height === height ? prev : { width, height },
    );
  }, []);

  const width = area && area.width > 0 ? area.width : window.width - LAYOUT_PADDING;
  const byHeight =
    area && area.height > ANSWER_CARDS_GAP ? (area.height - ANSWER_CARDS_GAP) / 2 : Infinity;

  const cardSize = Math.max(0, Math.min((width - ANSWER_CARDS_GAP) / 2, byHeight, MAX_CARD_SIZE));

  return { cardSize, onLayout };
};
