import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Pressable } from "react-native";
import { Path, Svg } from "react-native-svg";

import { CaptchaTile as CaptchaTileData } from "@/pages/education/practice/education-practice/lib/types/questions";

const GLYPH_SIZE = "72%";

export type CaptchaTileState = "idle" | "selected" | "correct" | "wrong" | "missed";

interface Props {
  tile: CaptchaTileData;
  state: CaptchaTileState;
  index?: number;
  onPress?: (index: number) => void;
}

const CaptchaTile = React.memo<Props>(function CaptchaTile({ tile, state, index, onPress }) {
  const { colors } = useThemeContext();

  const backgrounds: Record<CaptchaTileState, string> = {
    idle: colors.BgLightGray,
    selected: colors.BgAccent,
    correct: colors.BgSuccess,
    wrong: colors.BgDanger,
    missed: colors.BgLightGray,
  };
  const isFilled = state === "selected" || state === "correct" || state === "wrong";

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => index !== undefined && onPress?.(index)}
      accessibilityRole="checkbox"
      accessibilityLabel={tile.text}
      accessibilityState={{ checked: state !== "idle" && state !== "missed" }}
      style={{
        flex: 1,
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgrounds[state],
        borderWidth: state === "missed" ? 2 : 0,
        borderColor: colors.BgSuccess,
      }}
    >
      <Svg width={GLYPH_SIZE} height={GLYPH_SIZE} viewBox={`0 0 ${tile.viewBox} ${tile.viewBox}`}>
        <Path d={tile.path} fill={isFilled ? colors.TextWhite : colors.TextPrimary} />
      </Svg>
    </Pressable>
  );
});

export default CaptchaTile;
