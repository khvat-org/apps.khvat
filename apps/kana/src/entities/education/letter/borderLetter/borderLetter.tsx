import React from "react";

import { getCanvasSize } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { lettersTableById } from "@nihongo/core/shared/data/lettersTable";
import { useWindowDimensions, View } from "react-native";

import Symbol from "@/entities/kana/symbol/symbol";
import SymbolHeader from "@/entities/kana/symbol-header/symbol-header";
import { KanaAlphabet } from "@/shared/constants/kana";

type borderLetterProps = {
  id: string;
  kana: KanaAlphabet;

  marginTop?: number;
};

const BorderLetter: React.FC<borderLetterProps> = ({ id, kana, marginTop }) => {
  const { colors } = useThemeContext();

  const { width, height } = useWindowDimensions();

  const canvasSize = getCanvasSize(width, height);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SymbolHeader kana={kana} letter={lettersTableById[id]} />
      <View
        style={{
          width: canvasSize,
          backgroundColor: colors.BgSecondary,
          borderRadius: 12,
          marginTop: marginTop !== undefined ? marginTop : 16,
        }}
      >
        <Symbol id={id} kana={kana} />
      </View>
    </View>
  );
};

export default BorderLetter;
