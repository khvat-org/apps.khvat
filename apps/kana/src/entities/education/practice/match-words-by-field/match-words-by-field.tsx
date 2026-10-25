import React, { useState, useMemo, useRef } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, TextStyle } from "react-native";

type ByKey = "kana" | "translate" | "transliteration";

interface Word {
  kana: string;
  translate: string;
  transliteration: string;
}

export type MatchAttempt = {
  question: string;
  answer: string;
  translate: string;

  isCorrect: boolean;
};

interface MatchPairsProps {
  onComplete?: (hasError: boolean, attempts: MatchAttempt[]) => void;
  onAttempt?: (attempts: MatchAttempt[]) => void;
  words: Word[];
  by: ByKey;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRightLabel(
  word: Word,
  by: ByKey,
  textStyle: StyleProp<TextStyle>,
  translateStyle: StyleProp<TextStyle>,
): React.JSX.Element {
  if (by === "kana") {
    return (
      <View>
        <Text style={textStyle}>{word.transliteration}</Text>

        <Text style={translateStyle}>({word.translate})</Text>
      </View>
    );
  }

  return <View></View>;
}

type ItemState = "default" | "selected" | "matched" | "error";

export default function MatchWordsByField({ onComplete, onAttempt, words, by }: MatchPairsProps) {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);
  const { triggerHaptic } = useHaptic();

  const shuffledLeftIndices = useMemo(() => shuffleArray(words.map((_, i) => i)), [words]);
  const shuffledRightIndices = useMemo(() => shuffleArray(words.map((_, i) => i)), [words]);

  const [matched, setMatched] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [errorPair, setErrorPair] = useState<{ left: number; right: number } | null>(null);

  // * все шаги пользователя по порядку, включая неверные
  const attemptsRef = useRef<MatchAttempt[]>([]);

  const matchedLeftIndices = Object.values(matched);
  const matchedRightIndices = Object.keys(matched).map(Number);

  const handleLeftPress = (leftIndex: number) => {
    triggerHaptic();

    if (matchedLeftIndices.includes(leftIndex)) return;
    if (errorPair) return;
    setSelectedLeft(leftIndex);
    if (selectedRight !== null) tryMatch(leftIndex, selectedRight);
  };

  const handleRightPress = (rightIndex: number) => {
    triggerHaptic();

    if (matchedRightIndices.includes(rightIndex)) return;
    if (errorPair) return;
    setSelectedRight(rightIndex);
    if (selectedLeft !== null) tryMatch(selectedLeft, rightIndex);
  };

  const tryMatch = (leftIndex: number, rightIndex: number) => {
    const isCorrect = leftIndex === rightIndex;

    attemptsRef.current = [
      ...attemptsRef.current,
      {
        question: words[leftIndex][by],
        answer: words[rightIndex].transliteration,
        translate: words[rightIndex].translate,
        isCorrect,
      },
    ];
    onAttempt?.(attemptsRef.current);

    if (isCorrect) {
      const newMatched = { ...matched, [rightIndex]: leftIndex };
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (Object.keys(newMatched).length === words.length) {
        const hasError = attemptsRef.current.some((attempt) => !attempt.isCorrect);
        onComplete?.(hasError, attemptsRef.current);
      }
    } else {
      setErrorPair({ left: leftIndex, right: rightIndex });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  };

  const getLeftState = (leftIndex: number): ItemState => {
    if (matchedLeftIndices.includes(leftIndex)) return "matched";
    if (errorPair?.left === leftIndex) return "error";
    if (selectedLeft === leftIndex) return "selected";
    return "default";
  };

  const getRightState = (rightIndex: number): ItemState => {
    if (matchedRightIndices.includes(rightIndex)) return "matched";
    if (errorPair?.right === rightIndex) return "error";
    if (selectedRight === rightIndex) return "selected";
    return "default";
  };

  const getItemStyle = (state: ItemState) => {
    switch (state) {
      case "selected":
        return [styles.item, styles.itemSelected];
      case "matched":
        return [styles.item, styles.itemMatched];
      case "error":
        return [styles.item, styles.itemError];
      default:
        return [styles.item];
    }
  };

  const getTextStyle = (state: ItemState) => {
    switch (state) {
      case "error":
        return [styles.itemText, styles.itemTextError];
      case "matched":
        return [styles.itemText, styles.itemTextMatched];
      default:
        return [styles.itemText];
    }
  };

  const getTranslateStyle = (state: ItemState) =>
    state === "error"
      ? [styles.itemTranslate, styles.itemTextError]
      : state === "matched"
        ? [styles.itemTranslate, styles.itemTextMatched]
        : [styles.itemTranslate];

  const rowCount = Math.max(shuffledLeftIndices.length, shuffledRightIndices.length);

  return (
    <View style={styles.container}>
      {Array.from({ length: rowCount }).map((_, rowIndex) => {
        const leftIndex = shuffledLeftIndices[rowIndex];
        const rightIndex = shuffledRightIndices[rowIndex];
        const leftState = getLeftState(leftIndex);
        const rightState = getRightState(rightIndex);

        return (
          <View key={rowIndex} style={styles.row}>
            <TouchableOpacity
              style={[getItemStyle(leftState), styles.cell]}
              onPress={() => handleLeftPress(leftIndex)}
              activeOpacity={leftState === "matched" ? 1 : 0.7}
              disabled={leftState === "matched"}
            >
              <Text style={getTextStyle(leftState)}>{words[leftIndex][by]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[getItemStyle(rightState), styles.cell]}
              onPress={() => handleRightPress(rightIndex)}
              activeOpacity={rightState === "matched" ? 1 : 0.7}
              disabled={rightState === "matched"}
            >
              <View>
                {getRightLabel(
                  words[rightIndex],
                  by,
                  getTextStyle(rightState),
                  getTranslateStyle(rightState),
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      width: "100%",
      gap: 8,
    },
    row: {
      flexDirection: "row",
      gap: 16,
      alignItems: "stretch",
    },
    cell: {
      flex: 1,
    },
    item: {
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.BorderDefault,
      backgroundColor: colors.BgSecondary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    itemSelected: {
      borderColor: colors.BorderContrast,
    },
    itemMatched: {
      borderColor: colors.BgLightGray,
      backgroundColor: colors.BgLightGray,
    },
    itemError: {
      borderColor: colors.BgDanger,
      backgroundColor: colors.BgDanger,
    },
    itemText: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      textAlign: "center",
    },
    itemTranslate: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      textAlign: "center",
    },
    itemTextMatched: {
      color: colors.TextDisabled,
    },
    itemTextError: {
      color: colors.TextWhite,
    },
  });
