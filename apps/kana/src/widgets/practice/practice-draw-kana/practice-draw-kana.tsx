import React, { useState } from "react";

import { useTransliterationsContext } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import Draw, { DRAW_CONTROLS_HEIGHT, MIN_FIT_CANVAS_SIZE } from "@/features/drawing/ui/draw/draw";
import { OnSubmit } from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";
import { getTypeById } from "@/shared/helpers/kana-letter";
import Header from "@/shared/ui/practice-header/practice-header";

interface PracticeDrawKanaProps {
  symbol: ILetter;
  kana: Kana;
  onCompleted: OnSubmit;
}

const PracticeDrawKana: React.FC<PracticeDrawKanaProps> = ({ symbol, kana, onCompleted }) => {
  const { t } = useTranslation();

  const { transliterations } = useTransliterationsContext();

  const [areaHeight, setAreaHeight] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAreaHeight((prev) => (prev === height ? prev : height));
  };

  return (
    <View style={styles.screen}>
      <Header
        title={symbol?.transliterations?.[transliterations]}
        subtitle={`${kana === Kana.Hiragana ? t("kana.hiragana") : t("kana.katakana")} (${t(getTypeById(symbol.id))})`}
      />
      <View style={styles.container} onLayout={onLayout}>
        <GestureHandlerRootView style={styles.scroll}>
          <ScrollView contentContainerStyle={styles.draw}>
            <Draw
              maxCanvasSize={
                areaHeight > 0
                  ? Math.max(MIN_FIT_CANVAS_SIZE, areaHeight - DRAW_CONTROLS_HEIGHT)
                  : undefined
              }
              onCompleted={(isCorrect, _pickedAnswer, drawing) =>
                onCompleted({
                  isCorrectAnswer: isCorrect,
                  userSelect: { type: PracticeType.Drawing, value: drawing },
                })
              }
              isCheck
              letter={symbol}
              kana={kana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana}
            />
          </ScrollView>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    gap: 16,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  draw: {
    alignItems: "center",
  },
});

export default PracticeDrawKana;
