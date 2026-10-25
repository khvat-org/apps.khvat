import React, { useCallback, useEffect, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, ScrollView, StyleSheet, BackHandler, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Svg, Path } from "react-native-svg";

import formatResultAnswer, {
  ResultAnswerView,
  letterText,
} from "../education-practice/helpers/format-result-answer";
import { PracticeResultData } from "../education-practice/lib/types/questions";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import DrawingPreview from "@/features/drawing/ui/drawing-preview/drawing-preview";
import DrawingReference from "@/features/drawing/ui/drawing-reference/drawing-reference";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";
import { requestHuaweiStoreReview } from "@/shared/lib/promotions/huawei-store-review";
import { requestRustoreStoreReview } from "@/shared/lib/promotions/rustore-store-review";
import { requestStoreReview } from "@/shared/lib/promotions/store-review";
import { useTelegramPromotion } from "@/shared/lib/promotions/use-telegram-promotion";

type LearnResultsNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.RESULTS>;
interface EducationResultProps {
  route: RouteProp<RootStackParamList, typeof ROUTES.RESULTS>;
}

const ResultStatusIcon: React.FC<{ isCorrect: boolean; colors: ColorsType; size?: number }> = ({
  isCorrect,
  colors,
  size = 24,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {isCorrect ? (
      <Path
        d="M5 13l4 4L19 7"
        stroke={colors.TextSuccess}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <Path
        d="M6 6l12 12M18 6L6 18"
        stroke={colors.TextDanger}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </Svg>
);

const ArrowIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EducationResultPage: React.FC<EducationResultProps> = ({ route }) => {
  const { showTelegramPromotionIfNeeded } = useTelegramPromotion();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { colors } = useThemeContext();
  const navigation = useNavigation<LearnResultsNavigationProp>();

  const { width } = useWindowDimensions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  type ResultStats = {
    totalQuestions: number;
    correctAnswers: number;
    totalTime: number;
    avgTime: number;
  };

  const calculateStats = (questionsTime: PracticeResultData["questionsTime"]): ResultStats => {
    const totalQuestions = questionsTime.length;
    const correctAnswers = questionsTime.filter((q) => q.isCorrectAnswer).length;
    const totalTime = questionsTime.reduce((sum, q) => sum + q.ms, 0);
    const avgTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

    return {
      totalQuestions,
      correctAnswers,
      totalTime,
      avgTime,
    };
  };

  const { questionsTime, questions } = route.params;
  const { transliterations } = useGetRomaji();

  const data = calculateStats(questionsTime.slice(0, questions.length));

  const answers = questionsTime
    .slice(0, questions.length)
    .map(({ index, isCorrectAnswer, userSelect }) => ({
      ...formatResultAnswer({ question: questions[index], userSelect, transliterations }),
      isCorrectAnswer,
      userSelect,
    }));

  const styles = makeStyles(colors);

  const [widgetsWidth, setWidgetsWidth] = useState(0);
  const widgetWidth = (widgetsWidth - WIDGETS_GAP * 2) / 3;
  const widgetStyle = [styles.header_widget, widgetsWidth > 0 && { width: widgetWidth }];

  const home = useCallback(async () => {
    await requestStoreReview();
    await requestHuaweiStoreReview();
    await requestRustoreStoreReview();
    await showTelegramPromotionIfNeeded();
    navigation.popToTop();
  }, [navigation, showTelegramPromotionIfNeeded]);

  useEffect(() => {
    const onBackPress = () => {
      home();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => backHandler.remove();
  }, [home]);

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.round(milliseconds / 1000);
    const [value, unit] =
      seconds < 60
        ? [seconds, t("result.sec")]
        : [Number((seconds / 60).toFixed(1)), t("result.min")];

    return { value: String(value), unit: unit.charAt(0).toUpperCase() + unit.slice(1) };
  };

  const totalTime = formatDuration(data.totalTime);

  const isMixedPractice = new Set(questions.map((question) => question.type)).size > 1;

  const answerContentWidth = Math.min(width - 32, TABLET_WIDTH) - 32;
  const optionWidth = (answerContentWidth - 8) / 2;
  const canvasSize = (answerContentWidth - 12) / 2;

  const renderOption = (
    key: string,
    text: string,
    isCorrect: boolean,
    isWrongPick: boolean,
    fullWidth: boolean,
  ) => (
    <View
      key={key}
      style={[
        styles.option,
        { width: fullWidth ? answerContentWidth : optionWidth },
        isCorrect && { backgroundColor: colors.BgSuccess },
        isWrongPick && { backgroundColor: colors.BgDanger },
      ]}
    >
      <Text
        style={[styles.option__text, (isCorrect || isWrongPick) && { color: colors.TextWhite }]}
      >
        {text}
      </Text>
    </View>
  );

  const renderAnswerBody = (
    answer: ResultAnswerView & { userSelect: (typeof questionsTime)[number]["userSelect"] },
    index: number,
  ) => {
    const { question, userSelect } = answer;

    if (question?.type === PracticeType.Testing || question?.type === PracticeType.Listening) {
      const data =
        question.type === PracticeType.Testing
          ? question[PracticeType.Testing]!
          : question[PracticeType.Listening]!;
      const picked =
        userSelect?.type === PracticeType.Testing || userSelect?.type === PracticeType.Listening
          ? userSelect.value
          : null;

      return (
        <View style={styles.options}>
          {data.answers.map((item) =>
            renderOption(
              index + item.id,
              letterText(item, data.answersKana, transliterations),
              item.id === data.question.id,
              picked?.id === item.id && item.id !== data.question.id,
              false,
            ),
          )}
        </View>
      );
    }

    if (question?.type === PracticeType.MultipleChoice) {
      const pickedTitle =
        userSelect?.type === PracticeType.MultipleChoice ? userSelect.value : null;

      return (
        <View style={styles.options}>
          {question[PracticeType.MultipleChoice]!.answers.map((item) =>
            renderOption(
              index + item.title,
              item.title,
              item.isTrue,
              pickedTitle === item.title && !item.isTrue,
              true,
            ),
          )}
        </View>
      );
    }

    if (question?.type === PracticeType.Drawing) {
      const drawing = userSelect?.type === PracticeType.Drawing ? userSelect.value : null;
      const drawingData = question[PracticeType.Drawing]!;
      const drawingKana =
        drawingData.questionKana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana;

      return (
        <View style={styles.drawings}>
          <View style={styles.drawing}>
            <Text style={styles.drawing__label}>{t("result.example")}:</Text>
            <View style={styles.drawing__canvas}>
              <DrawingReference
                letter={drawingData.question}
                kana={drawingKana}
                size={canvasSize}
                additionalPadding={0.2}
              />
            </View>
          </View>

          <View style={styles.drawing}>
            <Text style={styles.drawing__label}>{t("result.you")}:</Text>
            <View style={[styles.drawing__canvas, { width: canvasSize, height: canvasSize }]}>
              {drawing !== null && <DrawingPreview drawing={drawing} size={canvasSize} />}
            </View>
          </View>
        </View>
      );
    }

    if (answer.lines.length === 0) return null;

    return (
      <View style={styles.lines}>
        {answer.lines.map((line, lineIndex) => (
          <View key={lineIndex}>
            <View style={styles.line}>
              <ResultStatusIcon size={20} isCorrect={line.isCorrect} colors={colors} />
              <Text style={styles.line__question}>{line.question}</Text>
              <ArrowIcon color={colors.TextPrimary} />
              <Text style={styles.line__answer}>
                {line.answer.map((segment, segmentIndex) => (
                  <Text
                    key={segmentIndex}
                    style={{ color: segment.isCorrect ? colors.TextSuccess : colors.TextDanger }}
                  >
                    {segment.text}
                  </Text>
                ))}
              </Text>
            </View>
            {line.correct !== undefined && (
              <Text style={styles.line__correct}>({line.correct})</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      style={[
        {
          marginTop: insets.top,
        },
        styles.layout,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.header__content}>
          <Text style={styles.title}>{t("result.title")}</Text>

          <View
            style={styles.header_widgets}
            onLayout={(e) => setWidgetsWidth(e.nativeEvent.layout.width)}
          >
            <View style={widgetStyle}>
              <Text style={styles.header_widget__title} numberOfLines={1} adjustsFontSizeToFit>
                {((data.correctAnswers / data.totalQuestions) * 100).toFixed(0)}%
              </Text>
              <Text style={styles.header_widget__subtitle} numberOfLines={1} adjustsFontSizeToFit>
                {t("result.percent")}
              </Text>
            </View>
            <View style={widgetStyle}>
              <Text style={styles.header_widget__title} numberOfLines={1} adjustsFontSizeToFit>
                {data.correctAnswers} / {data.totalQuestions}
              </Text>
              <Text style={styles.header_widget__subtitle} numberOfLines={1} adjustsFontSizeToFit>
                {t("result.score")}
              </Text>
            </View>
            <View style={widgetStyle}>
              <Text style={styles.header_widget__title} numberOfLines={1} adjustsFontSizeToFit>
                {totalTime.value}
              </Text>
              <Text style={styles.header_widget__subtitle} numberOfLines={1} adjustsFontSizeToFit>
                {totalTime.unit}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.scroll]}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.answers}>
            {answers.map((answer, index) => {
              const { question } = answer;
              if (question === null) return null;

              const isErrorsCard =
                question.type === PracticeType.MatchingPairs ||
                question.type === PracticeType.WordBuilding ||
                question.type === PracticeType.Typing;

              const shortNumber = t("result.questionNumber", { number: index + 1 });
              const number = isMixedPractice
                ? `${t(`practice.modes.${question.type}.title`)} / ${shortNumber}`
                : shortNumber;

              return (
                <View key={index} style={styles.answer}>
                  <View style={styles.answer__header}>
                    {isErrorsCard ? (
                      <Text
                        style={[
                          styles.answer__errors,
                          {
                            color: answer.errors === 0 ? colors.TextSuccess : colors.TextDanger,
                          },
                        ]}
                      >
                        {t("result.errors", { count: answer.errors })}
                      </Text>
                    ) : (
                      <View style={styles.answer__heading}>
                        <ResultStatusIcon
                          size={20}
                          isCorrect={answer.isCorrectAnswer}
                          colors={colors}
                        />
                        <Text style={styles.answer__title}>{answer.title}</Text>
                      </View>
                    )}

                    <Text style={styles.answer__number}>{number}</Text>
                  </View>

                  {renderAnswerBody(answer, index)}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={{ marginBottom: insets.bottom, marginTop: 16, paddingHorizontal: 20 }}>
        <View style={styles.done}>
          <Button color="primary" isHapticFeedback text={t("result.done")} onClick={home} />
        </View>
      </View>
    </View>
  );
};

const WIDGETS_GAP = 16;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    layout: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },

    header: {
      backgroundColor: colors.BgPrimary,
      flexDirection: "column",
      paddingTop: 8,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingBottom: 16,
      paddingHorizontal: 16,
    },

    header__content: {
      width: "100%",
      maxWidth: TABLET_WIDTH,
      alignSelf: "center",
      gap: 16,
    },

    done: {
      width: "100%",
      maxWidth: TABLET_WIDTH,
      alignSelf: "center",
    },

    title: {
      color: colors.TextPrimary,
      ...Typography.H3,
    },

    header_widgets: {
      flexDirection: "row",
      gap: WIDGETS_GAP,
      alignSelf: "stretch",
    },

    header_widget: {
      flexGrow: 0,
      flexShrink: 0,
      alignItems: "center",
      backgroundColor: colors.BgSecondary,
      padding: 16,
      borderRadius: 12,
    },

    header_widget__title: {
      ...Typography.H4,
      color: colors.TextPrimary,
    },

    header_widget__subtitle: {
      color: colors.TextSecondary,

      ...Typography.regularLabel,
    },

    scroll: {
      flex: 1,

      padding: 16,

      paddingTop: 0,
      paddingBottom: 0,
    },

    answers: {
      width: "100%",
      maxWidth: TABLET_WIDTH,
      alignSelf: "center",
      gap: 12,
      paddingTop: 16,
    },

    answer: {
      backgroundColor: colors.BgPrimary,
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },

    answer__header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    answer__heading: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexShrink: 1,
    },

    answer__title: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
    },

    answer__number: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },

    answer__errors: {
      ...Typography.boldLabel,
    },

    options: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    option: {
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.BgSecondary,
    },

    option__text: {
      ...Typography.boldLabel,
      color: colors.TextPrimary,
    },

    drawings: {
      flexDirection: "row",
      gap: 12,
    },

    drawing: {
      gap: 8,
    },

    drawing__label: {
      ...Typography.boldLabel,
      color: colors.TextPrimary,
    },

    drawing__canvas: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 12,
      overflow: "hidden",
    },

    lines: {
      gap: 8,
    },

    line: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    line__question: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
    },

    line__answer: {
      ...Typography.boldDefault,
      flexShrink: 1,
    },

    line__correct: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      marginLeft: 28,
    },
  });

export default EducationResultPage;
