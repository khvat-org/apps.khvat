import React from "react";

import { getCanvasSize } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useWindowDimensions, View } from "react-native";

import LetterSoundHeader from "@/entities/education/letter/letter-sound-header/letter-sound-header";
import Symbol from "@/entities/kana/symbol/symbol";
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
      <LetterSoundHeader kana={kana} id={id} width={canvasSize} />
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
