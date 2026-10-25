import React, { useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

import SelectAnswer from "@/entities/education/select-answer/select-answer";
import { OnSubmit } from "@/pages/education/practice/education-practice/lib/types/questions";
import { PracticeType, TEST_DELAY } from "@/shared/constants/kana";
import { Word } from "@/shared/data/words";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";

interface EducationPracticeChooseValueProps {
  word: Word;
  answers: { title: string; isTrue: boolean }[];

  onCompleted: OnSubmit;
}

const EducationPracticeChooseValue: React.FC<EducationPracticeChooseValueProps> = ({
  word,
  answers,

  onCompleted,
}) => {
  const {
    i18n: { language },
  } = useTranslation();
  const { colors } = useThemeContext();

  const langKey = language === "ru" ? "ru" : "en";

  const answersList = useMemo(
    () =>
      answers.map((item) => ({
        title: item.title,
        isTrue: item.isTrue,
      })),
    [answers],
  );

  const styles = makeStyles(colors);

  const onFinish = useFirstClickHandler((hasError: boolean, pickedTitle: string) => {
    onCompleted({
      isCorrectAnswer: !hasError,
      userSelect: { type: PracticeType.MultipleChoice, value: pickedTitle },
    });
  }, TEST_DELAY);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.word}>
          <Text style={styles.word__kana}>{word.kana}</Text>
          <Text style={styles.word__translate}>({word[langKey]})</Text>
        </View>

        <SelectAnswer key={answersList.join()} answers={answersList} onFinish={onFinish} />
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    content: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",

      width: "100%",
      maxWidth: 546,
    },

    word: {
      alignItems: "center",
      gap: 8,
      marginBottom: 32,
    },
    word__kana: {
      marginTop: 32,
      ...Typography.H2,
      color: colors.TextPrimary,
      textAlign: "center",
    },
    word__translate: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      textAlign: "center",
    },
  });

export default EducationPracticeChooseValue;
