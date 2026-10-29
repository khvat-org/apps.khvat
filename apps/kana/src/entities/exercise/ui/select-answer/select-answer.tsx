import React, { useEffect, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { StyleSheet, View } from "react-native";

import { TEST_DELAY } from "@/shared/constants/kana";

type SelectAnswerProps = {
  answers: { title: string; isTrue: boolean }[];
  onFinish?: (hasError: boolean, pickedTitle: string) => void;
};

const SelectAnswer: React.FC<SelectAnswerProps> = ({ answers, onFinish }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [correct, setCorrect] = useState<string[]>([]);

  const onAnswer = (answer: { title: string; isTrue: boolean }) => {
    if (answer.isTrue) {
      setCorrect((prev) => [...prev, answer.title]);
      onFinish?.(!true, answer.title);

      setTimeout(() => {
        setCorrect([]);
      }, TEST_DELAY);
    } else {
      setErrors((prev) => [...prev, answer.title]);
      onFinish?.(!false, answer.title);

      setTimeout(() => {
        setErrors([]);
      }, TEST_DELAY);
    }
  };

  useEffect(() => {
    return () => {
      setErrors([]);
      setCorrect([]);
    };
  }, [answers]);

  return (
    <View style={styles.container}>
      <View style={styles.answers}>
        {answers.map((answer) => (
          <Button
            color={
              errors.includes(answer.title)
                ? "danger"
                : correct.includes(answer.title)
                  ? "success"
                  : "secondary"
            }
            key={answer.title}
            isHapticFeedback
            onClick={() => onAnswer(answer)}
            text={answer.title}
            textStyle={Typography.boldDefault}
          />
        ))}
      </View>
    </View>
  );
};

export default SelectAnswer;

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "column",
    alignItems: "center",
  },
  answers: {
    width: "100%",
    maxWidth: TABLET_WIDTH,

    flexDirection: "column",
    gap: 8,
  },
});
