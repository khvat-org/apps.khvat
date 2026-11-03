import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";

import { SelectAnswer } from "@/entities/exercise";
import Title from "@/entities/lesson-block/ui/title/title";
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
  const langKey = language === "ru" ? "ru" : "en";

  const answersList = useMemo(
    () =>
      answers.map((item) => ({
        title: item.title,
        isTrue: item.isTrue,
      })),
    [answers],
  );

  const styles = makeStyles();

  const onFinish = useFirstClickHandler((hasError: boolean, pickedTitle: string) => {
    onCompleted({
      isCorrectAnswer: !hasError,
      userSelect: { type: PracticeType.MultipleChoice, value: pickedTitle },
    });
  }, TEST_DELAY);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title title={word.kana} subtitle={`(${word[langKey]})`} />
        <SelectAnswer key={answersList.join()} answers={answersList} onFinish={onFinish} />
      </View>
    </View>
  );
};

const makeStyles = () =>
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
    },
  });

export default EducationPracticeChooseValue;
