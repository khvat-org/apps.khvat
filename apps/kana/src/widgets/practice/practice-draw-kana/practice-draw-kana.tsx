import React, { useRef, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import LetterSoundHeader from "@/entities/kana/letter-sound-header/letter-sound-header";
import Draw, {
  DRAW_CONTROLS_HEIGHT_EXTERNAL_CHECK,
  DrawHandle,
  getDrawCanvasSize,
  MIN_FIT_CANVAS_SIZE,
} from "@/features/drawing/ui/draw/draw";
import {
  OnSubmit,
  PracticeUserSelect,
} from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";

interface PracticeDrawKanaProps {
  symbol: ILetter;
  kana: Kana;
  onCompleted: OnSubmit;
  onProgress?: (userSelect: PracticeUserSelect) => void;
}

const PracticeDrawKana: React.FC<PracticeDrawKanaProps> = ({
  symbol,
  kana,
  onCompleted,
  onProgress,
}) => {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();

  const [areaHeight, setAreaHeight] = useState(0);
  const drawRef = useRef<DrawHandle>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAreaHeight((prev) => (prev === height ? prev : height));
  };

  const kanaAlphabet = kana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana;

  const maxCanvasSize =
    areaHeight > 0
      ? Math.max(MIN_FIT_CANVAS_SIZE, areaHeight - DRAW_CONTROLS_HEIGHT_EXTERNAL_CHECK)
      : undefined;
  const canvasSize = getDrawCanvasSize(width, height, maxCanvasSize);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <LetterSoundHeader id={symbol.id} kana={kanaAlphabet} width={canvasSize} />
      </View>

      <View style={styles.container} onLayout={onLayout}>
        <GestureHandlerRootView style={styles.scroll}>
          <ScrollView contentContainerStyle={styles.draw}>
            <Draw
              ref={drawRef}
              maxCanvasSize={maxCanvasSize}
              onCompleted={(isCorrect, _pickedAnswer, drawing) =>
                onCompleted({
                  isCorrectAnswer: isCorrect,
                  userSelect: { type: PracticeType.Drawing, value: drawing },
                })
              }
              onProgress={(drawing) => onProgress?.({ type: PracticeType.Drawing, value: drawing })}
              isCheck
              isCheckButtonExternal
              letter={symbol}
              kana={kanaAlphabet}
            />
          </ScrollView>
        </GestureHandlerRootView>
      </View>

      <View style={styles.footer}>
        <Button
          color="primary"
          isHapticFeedback
          isFullWidth
          text={t("common.check")}
          onClick={() => drawRef.current?.check()}
        />
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
  header: {
    marginTop: 20,
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
  footer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    maxWidth: TABLET_WIDTH,
    height: 66,
    paddingTop: 16,
  },
});

export default PracticeDrawKana;
