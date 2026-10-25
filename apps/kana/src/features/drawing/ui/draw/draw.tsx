import React, { useRef, useReducer, useState, useEffect } from "react";

import { getCanvasSize, TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { CircleIcon, FloppyDiskIcon, ScanIcon, XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from "react-native-gesture-handler";
import { Svg, Path } from "react-native-svg";

import {
  addComposedTemplates,
  templateName,
} from "../../lib/hieroglyph-recognition/compose-reference";
import {
  canvasCoordinates,
  normalizeCoordinates,
} from "../../lib/hieroglyph-recognition/coordinates";
import Recognizer from "../../lib/hieroglyph-recognition/recognizer";
import { processDrawing, processReference } from "../../lib/hieroglyph-recognition/record";
import { kanaTemplates } from "../../lib/hieroglyph-recognition/templates";
import { DrawingPath, generatePathDAttribute } from "../../lib/svg-path";
import { useDrawSettings } from "../../model/hooks";
import ClearButtons from "../buttons/clear-buttons";
import ToggleShowBorders from "../buttons/toggle-show-borders";
import ToggleShowLetter from "../buttons/toggle-show-letter";
import ToggleStrokeWidth from "../buttons/toggle-stroke-width";

import CanvasBorder from "./canvas-border";

import Symbol from "@/entities/kana/symbol/symbol";
import { KanaAlphabet, TEST_DELAY } from "@/shared/constants/kana";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";

// ? Recognizer imports

enum StateColor {
  Green = "Green",
  Red = "Red",
  NotInitialized = "not_initialized",
}

export type DrawingSnapshot = {
  strokes: DrawingPath[];
  canvasSize: number;
};

export const DRAW_CONTROLS_HEIGHT = 165;
export const MIN_FIT_CANVAS_SIZE = 200;

interface DrawProps {
  letter: ILetter;
  kana: KanaAlphabet;

  maxCanvasSize?: number;

  isCheck?: boolean;

  isStencil?: boolean;

  isFullHeight?: boolean;

  isTextRecognition?: boolean;

  onCompleted?: (isErrors: boolean, pickedAnswer: ILetter, drawing: DrawingSnapshot) => void;
}

const Draw: React.FC<DrawProps> = ({
  isCheck,
  isStencil,
  letter,
  kana,
  isTextRecognition,
  isFullHeight,
  maxCanvasSize = Infinity,
  onCompleted,
}) => {
  const { width, height } = useWindowDimensions();

  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const currentPathRef = useRef<{ x: number; y: number }[]>([]);
  const pathsRef = useRef<{ x: number; y: number }[][]>([]);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const canvasSize =
    width < TABLET_WIDTH
      ? getCanvasSize(width, height)
      : Math.min(getCanvasSize(width, height), maxCanvasSize);

  const { settings } = useDrawSettings();

  const strokeWidth = settings.lineWidth;
  const isShowLetter = settings.isShowLetter;
  const isShowBorder = settings.isShowBorder;

  const drawGesture = usePanGesture({
    minDistance: 0,
    maxPointers: 1,
    runOnJS: true,
    onBegin: ({ x, y }) => {
      currentPathRef.current = [{ x, y }];
    },
    onUpdate: ({ x, y }) => {
      currentPathRef.current.push({ x, y });
      forceUpdate();
    },
    onFinalize: () => {
      if (currentPathRef.current.length > 1) {
        pathsRef.current = [...pathsRef.current, currentPathRef.current];
      }
      currentPathRef.current = [];
      forceUpdate();
    },
  });

  const renderStroke = (path: DrawingPath, key: string) => (
    <Path
      key={key}
      d={generatePathDAttribute(path)}
      stroke={colors.BgContrast}
      fill={colors.transparent}
      strokeWidth={isCheck ? 6 : strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );

  const handleClearStepButtonClick = () => {
    if (currentPathRef.current.length > 0) {
      currentPathRef.current.pop();
    } else if (pathsRef.current.length > 0) {
      pathsRef.current.pop();
    }
    forceUpdate();
  };

  const handleClearButtonClick = () => {
    pathsRef.current = [];
    currentPathRef.current = [];
    forceUpdate();
  };

  function shortenLines(data: number[][][]) {
    return data.map((line) => line.map((item) => item.map((point) => +point.toFixed(4))));
  }

  const [state, setState] = useState<StateColor>(StateColor.NotInitialized);

  const detectSymbol = useFirstClickHandler(() => {
    const recognizer = new Recognizer();

    if (kana === KanaAlphabet.Hiragana) {
      kanaTemplates.addHiragana(recognizer);
      addComposedTemplates(recognizer, "hiragana");
    }

    if (kana === KanaAlphabet.Katakana) {
      kanaTemplates.addKatakana(recognizer);
      addComposedTemplates(recognizer, "katakana");
    }

    const strokes = normalizeCoordinates(pathsRef.current);
    const result = recognizer.recognize(strokes);

    const target = kana === KanaAlphabet.Hiragana ? letter.hi : letter.ka;

    const ABS_THRESHOLD = 0.25;
    const RANK_MARGIN = 0.1;

    const best = result[0];
    const targetMatch = result.find((symbol) => templateName(symbol.name) === target);

    const isSomeKana =
      !!best &&
      !!targetMatch &&
      targetMatch.score <= ABS_THRESHOLD &&
      targetMatch.score <= best.score * (1 + RANK_MARGIN);

    const drawing: DrawingSnapshot = {
      strokes: pathsRef.current.map((path) => path.map((point) => ({ ...point }))),
      canvasSize,
    };

    if (isSomeKana) {
      onCompleted?.(true, letter, drawing);
      setState(StateColor.Green);

      setTimeout(() => {
        setState(StateColor.NotInitialized);
        handleClearButtonClick();
      }, TEST_DELAY);
    } else {
      onCompleted?.(false, letter, drawing);
      setState(StateColor.Red);

      setTimeout(() => {
        setState(StateColor.NotInitialized);
        handleClearButtonClick();
      }, TEST_DELAY);
    }
  }, 400);

  const IS_SAVE = false;

  useEffect(() => {
    handleClearButtonClick();
  }, [letter]);

  return (
    <GestureHandlerRootView
      style={[
        { minHeight: canvasSize + DRAW_CONTROLS_HEIGHT },
        isFullHeight ? { flex: 1, justifyContent: "space-between" } : {},
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <GestureDetector gesture={drawGesture}>
          <View
            style={{
              borderRadius: 24,
              position: "relative",
              height: canvasSize,
              width: canvasSize,
            }}
          >
            <View
              style={{
                borderRadius: 22,
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%",
                borderWidth: 1,
                borderColor: colors.BorderDefault,
              }}
            />

            {state !== StateColor.NotInitialized && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: colors.BgSecondary,
                  width: 90,
                  height: 90,
                  right: 0,
                  zIndex: 999,
                  borderWidth: 1,
                  borderColor: colors.BorderDefault,
                  borderTopRightRadius: 24,
                  borderBottomLeftRadius: 24,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                {state === StateColor.Green && <CircleIcon size={32} color={colors.TextSuccess} />}

                {state === StateColor.Green && (
                  <Text style={[{ color: colors.TextSuccess }, Typography.H4]}>まる</Text>
                )}

                {state === StateColor.Red && <XIcon size={32} color={colors.TextDanger} />}

                {state === StateColor.Red && (
                  <Text style={[{ color: colors.TextDanger }, Typography.H4]}>ばつ</Text>
                )}
              </View>
            )}

            {((isShowLetter && !isCheck) || isStencil) && (
              <View style={[styles.drawContainerImage, { width: canvasSize, height: canvasSize }]}>
                <Symbol isGray id={letter?.id} kana={kana} size={canvasSize} />
              </View>
            )}
            <Svg height={canvasSize} width={canvasSize}>
              {isShowBorder && <CanvasBorder canvasSize={canvasSize} />}
              {pathsRef.current.map((path, index) => renderStroke(path, `path-${index}`))}
              {renderStroke(currentPathRef.current, "path-current")}
            </Svg>
          </View>
        </GestureDetector>

        <View
          style={{
            width: "100%",
            maxWidth: width > canvasSize ? canvasSize : width - 32,
          }}
        >
          <ClearButtons clearFull={handleClearButtonClick} clearStep={handleClearStepButtonClick} />
          <View style={styles.buttonsContainer}>
            <View style={styles.actionButtons}>
              {isTextRecognition && (
                <Button
                  color="secondary"
                  isHapticFeedback
                  icon={<ScanIcon size={20} />}
                  onClick={detectSymbol}
                />
              )}

              {IS_SAVE && (
                <Button
                  icon={<FloppyDiskIcon size={20} />}
                  onClick={() => {
                    const symbol = kana === KanaAlphabet.Hiragana ? letter.hi : letter.ka;

                    const points = shortenLines(
                      normalizeCoordinates(processDrawing(pathsRef.current)),
                    );

                    const reference = shortenLines(
                      canvasCoordinates(processReference(pathsRef.current), canvasSize),
                    );

                    console.log("📦 Symbol points: ", `${symbol}: ${JSON.stringify(points)},`);
                    console.log(
                      "🖌️ Reference points: ",
                      `${symbol}: ${JSON.stringify(reference)},`,
                    );
                  }}
                />
              )}

              {!isCheck && <ToggleShowBorders />}
              {!isCheck && <ToggleShowLetter />}
            </View>
            {!isCheck && <ToggleStrokeWidth />}
          </View>
        </View>

        <View
          style={{
            width: "100%",
            maxWidth: TABLET_WIDTH,
          }}
        >
          {isCheck && (
            <Button
              color="primary"
              isHapticFeedback
              onClick={detectSymbol}
              text={t("common.check")}
            />
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawContainerImage: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
});

export default Draw;
