import React from "react";

import { getCanvasSize } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useContentDimensions } from "@nihongo/core/shared/lib/layout/use-content-dimensions";
import { View } from "react-native";

import { KanaAlphabet } from "@/shared/constants/kana";
import { getImage } from "@/shared/resources/svgs";

const SVG_SIZE = 345;

interface SymbolProps {
  id: string;
  kana: KanaAlphabet.Hiragana | KanaAlphabet.Katakana;
  size?: number;

  isGray?: boolean;
}

const Symbol: React.FC<SymbolProps> = ({
  id,
  kana,
  size,

  isGray,
}) => {
  const { width, height } = useContentDimensions();
  const { colors } = useThemeContext();

  const canvasSize = size ?? getCanvasSize(width, height);
  const scale = Math.min(1, canvasSize / SVG_SIZE);

  const getImagePath = (key: string | undefined) => {
    const keyString = `${kana}_${key?.replaceAll("-", "_")}`;

    return getImage(keyString);
  };

  const fillColor = isGray ? colors.BgLightGray : colors.BgAccent;
  const strokeColor = isGray ? colors.BgLightGray : colors.BgContrast;

  return (
    <View
      style={{
        height: canvasSize,
        width: canvasSize,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: SVG_SIZE,
          height: SVG_SIZE,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
        }}
      >
        {getImagePath(id)(fillColor, strokeColor)}
      </View>
    </View>
  );
};

export default Symbol;
