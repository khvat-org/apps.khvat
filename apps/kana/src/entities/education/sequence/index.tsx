import React, { useEffect, useRef, useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import SecondaryButton from "@nihongo/core/shared/ui/buttons/Secondary/secondary-button";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Sequence from "./sequence-engine";

type SequenceProps = {
  sequence: string[];

  onFinish?: (isCorrect: boolean, picked: string[]) => void;
  onError?: () => void;
};

const SequenceUi: React.FC<SequenceProps> = ({ sequence, onFinish, onError }) => {
  const { colors } = useThemeContext();

  const [_, setTick] = useState(0);
  const updateTick = () => setTick((i) => i + 1);

  const { triggerHaptic } = useHaptic();

  const transliterationRef = useRef<null | string>(null);

  const engineRef = useRef(
    new Sequence((isCorrect, picked) => {
      onFinish?.(isCorrect, picked);

      if (!isCorrect && onError) {
        onError();
      }
    }, updateTick),
  );

  const sequenceCurrent = engineRef.current;

  useEffect(() => {
    if (transliterationRef.current !== sequence.join("")) {
      transliterationRef.current = sequence.join("");
      sequenceCurrent.setNextWord(sequence.join(""));
    }
  }, [sequence, sequenceCurrent]);

  const getLetterStyle = (idx: number) => {
    const status = sequenceCurrent.answerStatus[idx];
    if (status === true) return { backgroundColor: colors.BgSuccess };
    if (status === false) return { backgroundColor: colors.BgDanger };
    return { backgroundColor: colors.BgLightGray };
  };

  return (
    <View style={styles.content}>
      <View style={styles.wordContainer}>
        {sequenceCurrent.sequence.map((letter, index) => (
          <Pressable
            onPress={() => {
              triggerHaptic();
              sequenceCurrent.removeOne();
            }}
            key={`letter-${index}`}
            style={styles.letterContainer}
          >
            <Text style={[Typography.regularDefault, { color: colors.TextPrimary }]}>
              {(letter ?? "").toUpperCase()}
            </Text>

            <View style={[styles.letterLine, getLetterStyle(index)]} />
          </Pressable>
        ))}
      </View>

      <View style={styles.chooseLettersContainer}>
        {sequenceCurrent.shuffledLetters.map((letter, index) => {
          if (sequenceCurrent.selectedLetters[index]) {
            return <View key={`letter-list-${letter}-${index}`} style={styles.emptyButton} />;
          }

          return (
            <SecondaryButton
              key={`letter-list-${letter}-${index}`}
              width={50}
              isOutline
              onClick={() => {
                sequenceCurrent.addItem(letter, index);
                triggerHaptic();
              }}
              text={letter}
            />
          );
        })}
      </View>
    </View>
  );
};

export default SequenceUi;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  letterContainer: {
    minWidth: 22,
    minHeight: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
  },
  letterLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    borderRadius: 2,
  },
  chooseLettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 30,
  },
  emptyButton: {
    width: 50,
  },
});
