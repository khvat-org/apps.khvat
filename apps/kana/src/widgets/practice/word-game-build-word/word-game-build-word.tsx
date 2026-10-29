import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { View, Text, StyleSheet } from "react-native";

import { Sequence } from "@/entities/exercise";
import { OnSubmit } from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, PracticeType, TEST_DELAY } from "@/shared/constants/kana";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";

interface ChooseLettersProps {
  sequence: string[];
  title: string;
  subtitle: string;
  kana: Kana;

  onCompleted: OnSubmit;
}

const EducationPracticeChooseLetters: React.FC<ChooseLettersProps> = ({
  sequence,
  title,
  subtitle,

  onCompleted,
}) => {
  const { colors } = useThemeContext();

  const onFinish = useFirstClickHandler(
    (isCorrect: boolean, picked: string[]) =>
      onCompleted({
        isCorrectAnswer: isCorrect,
        userSelect: { type: PracticeType.WordBuilding, value: picked },
      }),
    TEST_DELAY,
  );

  return (
    <View style={styles.container}>
      <View style={styles.word}>
        <Text style={[styles.word__title, { color: colors.TextPrimary }]}>{title}</Text>
        <Text style={[styles.word__subtitle, { color: colors.TextSecondary }]}>({subtitle})</Text>
      </View>

      <Sequence key={sequence.join(", ")} onFinish={onFinish} sequence={sequence} />
    </View>
  );
};

export default EducationPracticeChooseLetters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  word: {
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  word__title: {
    marginTop: 32,
    ...Typography.H2,
    textAlign: "center",
  },
  word__subtitle: {
    ...Typography.regularDefault,
    textAlign: "center",
  },
});
