import React from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

import { MatchAttempt, MatchPairs } from "@/entities/exercise";
import {
  OnSubmit,
  PracticeUserSelect,
} from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, PracticeType, TEST_DELAY } from "@/shared/constants/kana";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";

interface EducationPracticeFindPairProps {
  currentIndex: number;

  kana: Kana;
  words: {
    kana: string;
    translate: string;
    transliteration: string;
  }[];

  onCompleted: OnSubmit;
  onProgress?: (userSelect: PracticeUserSelect) => void;
}
const EducationPracticeFindPair: React.FC<EducationPracticeFindPairProps> = ({
  currentIndex,
  kana,
  words,
  onCompleted,
  onProgress,
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const onFinish = useFirstClickHandler(
    (hasError: boolean, attempts: MatchAttempt[]) =>
      onCompleted({
        isCorrectAnswer: !hasError,
        userSelect: { type: PracticeType.MatchingPairs, value: attempts },
      }),
    TEST_DELAY,
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.question, { color: colors.TextPrimary, marginBottom: 32 }]}>
          {kana === Kana.Hiragana
            ? t("lesson.matchHiraganaWithTransliteration")
            : t("lesson.matchKatakanaWithTransliteration")}
        </Text>

        <MatchPairs
          key={words[0].toString() + currentIndex}
          items={words.map((word) => ({
            left: { text: word.kana },
            right: { text: word.transliteration, subtitle: word.translate },
          }))}
          onComplete={onFinish}
          onAttempt={(attempts) =>
            onProgress?.({ type: PracticeType.MatchingPairs, value: attempts })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",

    width: "100%",
    maxWidth: TABLET_WIDTH,
  },
  question: {
    width: "100%",
    textAlign: "center",
    ...Typography.boldDefault,
    marginTop: 32,
  },
});

export default EducationPracticeFindPair;
