import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import { SpeakerHighIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import SoundLetter from "@/entities/kana/sound-letter/sound-letter";
import { OnSubmit } from "@/pages/education/practice/education-practice/lib/types/questions";
import { usePracticePreferences } from "@/pages/education/practice/practice-preferences/model/hooks";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";
import {
  useAnswerCardSize,
  ANSWER_CARDS_GAP,
} from "@/shared/lib/answer-cards/use-answer-card-size";

interface EducationPracticeSelectAnswersProps {
  question: ILetter;
  answers: ILetter[];
  answersKana: Kana;

  onCompleted: OnSubmit;
}

const PracticeAudio: React.FC<EducationPracticeSelectAnswersProps> = ({
  question,
  answers = [],
  answersKana,
  onCompleted,
}) => {
  const { t } = useTranslation();
  const { cardSize, onLayout } = useAnswerCardSize();
  const { colors } = useThemeContext();

  const { recalculateOnce } = useStatisticsContext();
  const { triggerHaptic } = useHaptic();
  const { preferences } = usePracticePreferences();

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [isLocked, setIsLocked] = useState(false);
  const [answerState, setAnswerState] = useState<{
    id: string;
    isCorrect: boolean;
    question: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    setAnswerState(null);
    setIsLocked(false);
  }, [question, answers]);

  const handlePick = useCallback(
    (answer: ILetter, questionId: string, index: number) => {
      if (isLocked || questionId !== question.id || answerState !== null) return;

      triggerHaptic();

      const isCorrect = answer.id === question.id;

      const typeOfChapter =
        answersKana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana;
      recalculateOnce(typeOfChapter, question.id, isCorrect);

      setAnswerState({ id: answer.id, isCorrect, question: question.id, index });
      setIsLocked(true);

      onCompleted({
        isCorrectAnswer: isCorrect,
        userSelect: { type: PracticeType.Listening, value: answer },
      });
    },
    [answersKana, question, onCompleted, isLocked, answerState, triggerHaptic, recalculateOnce],
  );

  // * useFirstClickHandler сам мемоизирован — оборачиваем стабильный обработчик.
  const pick = useFirstClickHandler(handlePick, 300);

  const { getRomaji } = useGetRomaji();

  const getTitle = useCallback(
    (answer: ILetter) => {
      if (answersKana === Kana.Hiragana) return answer.hi;
      if (answersKana === Kana.Katakana) return answer.ka;
      return getRomaji(answer);
    },
    [answersKana, getRomaji],
  );

  return (
    <>
      <View style={styles.buttonContainer}>
        <Text style={styles.subText}>{t("practice.playAudio")}</Text>
        <SoundLetter isAutoPlay={preferences.autoplaySound} id={question.id}>
          <View style={styles.button}>
            <SpeakerHighIcon size={64} color={colors.BgContrast} />
          </View>
        </SoundLetter>
      </View>
      <View style={styles.container} onLayout={onLayout}>
        <View style={styles.content}>
          <View style={[styles.grid, { width: cardSize * 2 + ANSWER_CARDS_GAP }]}>
            {cardSize > 0 &&
              answers?.map((answer, index) => {
                const cardBackground = (pressed: boolean, marked: boolean | null) => {
                  if (!answerState && pressed) return colors.BgLightGray;
                  if (marked === false) return colors.BgDanger;
                  if (marked === true) return colors.BgSuccess;
                  return colors.BgSecondary;
                };

                const marked =
                  answerState?.id === answer.id &&
                  answerState?.question === question.id &&
                  index === answerState.index
                    ? answerState.isCorrect
                    : null;

                const textColor =
                  marked === false || marked === true ? colors.TextWhite : colors.TextPrimary;

                return (
                  <Pressable
                    key={answer.id}
                    onPress={() => pick?.(answer, question.id, index)}
                    style={({ pressed }) => ({
                      width: cardSize,
                      height: cardSize,

                      justifyContent: "center",
                      alignItems: "center",

                      backgroundColor: cardBackground(pressed, marked),
                      borderRadius: 24,
                    })}
                  >
                    <Text style={{ ...Typography.H3, color: textColor }}>{getTitle(answer)}</Text>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </View>
    </>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      marginTop: ANSWER_CARDS_GAP,
    },
    content: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,

      alignItems: "center",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: ANSWER_CARDS_GAP,
      justifyContent: "center",
    },
    buttonContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      backgroundColor: colors.BgSecondary,
      width: 112,
      height: 112,

      justifyContent: "center",
      alignItems: "center",

      borderRadius: 60,
      marginBottom: 8,
    },
    subText: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,

      textAlign: "center",
      marginTop: 32,
      marginBottom: 32,
    },
  });

export default PracticeAudio;
