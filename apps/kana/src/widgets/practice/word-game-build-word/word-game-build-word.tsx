import React from "react";

import { View, StyleSheet } from "react-native";

import { Sequence } from "@/entities/exercise";
import Title from "@/entities/lesson-block/ui/title/title";
import {
  OnSubmit,
  PracticeUserSelect,
} from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, PracticeType, TEST_DELAY } from "@/shared/constants/kana";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";

interface ChooseLettersProps {
  sequence: string[];
  title: string;
  subtitle: string;
  kana: Kana;

  onCompleted: OnSubmit;
  onProgress?: (userSelect: PracticeUserSelect) => void;
}

const EducationPracticeChooseLetters: React.FC<ChooseLettersProps> = ({
  sequence,
  title,
  subtitle,

  onCompleted,
  onProgress,
}) => {
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
      <Title title={title} subtitle={subtitle} />

      <Sequence
        key={sequence.join(", ")}
        onFinish={onFinish}
        onProgress={(picked) => onProgress?.({ type: PracticeType.WordBuilding, value: picked })}
        sequence={sequence}
      />
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
  },
});
