import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useReport } from "@nihongo/core/features/report/use-report";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { ConfirmationModal } from "@nihongo/core/shared/contexts/modal/presets/confirmation";
import { useStudyActivity } from "@nihongo/core/shared/contexts/study-activity/study-activity-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useTransliterationsContext } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import LinearProgressBar from "@nihongo/core/shared/ui/progressbar/linear/linear-progress-bar";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useKeepAwake } from "expo-keep-awake";
import { useTranslation } from "react-i18next";
import { StyleSheet, BackHandler, View } from "react-native";

import QuestionsEducationPractice from "./helpers/education-practice";
import { getPracticeReportContext } from "./helpers/report-context";
import wrapperQuestionGenerate from "./helpers/wrapper-question-generate";
import { OnSubmit, PracticeResultData, PracticeUserSelect } from "./lib/types/questions";
import { getKatakanaLetters, getHiraganaLetters } from "./selectors/kanaSelectors";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationPracticeTimer from "@/entities/education/practice/practice-timer/practice-timer";
import { useCaptchaFonts } from "@/features/captcha/model/use-captcha-fonts";
import { useCaptchaPacks } from "@/features/captcha/model/use-captcha-packs";
import CaptchaLoading from "@/features/captcha/ui/captcha-loading";
import { usePracticePreferences } from "@/pages/education/practice/practice-preferences/model/hooks";
import { useKanaContext } from "@/pages/kana/kana-table-choice-letters-page/model/hooks";
import { PracticeType, TEST_DELAY } from "@/shared/constants/kana";
import PracticeAudio from "@/widgets/practice/practice-audio/practice-audio";
import PracticeCaptcha from "@/widgets/practice/practice-captcha/practice-captcha";
import PracticeDrawKana from "@/widgets/practice/practice-draw-kana/practice-draw-kana";
import EducationPracticeSelectAnswers from "@/widgets/practice/practice-pick-answers/practice-pick-answers";
import PracticeTypeKana from "@/widgets/practice/practice-type-kana/practice-type-kana";
import EducationPracticeChooseLetters from "@/widgets/practice/word-game-build-word/word-game-build-word";
import EducationPracticeChooseValue from "@/widgets/practice/word-game-choose-value/word-game-choose-value";
import EducationPracticeFindPair from "@/widgets/practice/word-game-find-pair/education-practice-find-pair";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.PRACTICE_PAGE>;
type LearnScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.PRACTICE_PAGE>;
interface LearnScreenProps {
  route: LearnScreenRouteProp;
}

const MemoTimer = React.memo(EducationPracticeTimer);

const TIMER_END_GRACE_MS = 300;

const REPORT_TAGS = ["answer_marked_wrong", "incorrect_character", "interface_error", "other"];

const EducationPracticePage: React.FC<LearnScreenProps> = ({ route }) => {
  useKeepAwake();

  const { showModal, hideModal } = useModal();
  const { openReport } = useReport();
  const [isReporting, setIsReporting] = useState(false);
  const [isConfirmingExit, setIsConfirmingExit] = useState(false);

  const navigation = useNavigation<ScreenNavigationProp>();

  const { transliterations } = useTransliterationsContext();

  const { mode } = route.params;
  const isCaptcha = mode.includes(PracticeType.Captcha);
  const captchaFonts = useCaptchaFonts();
  const captchaPacks = useCaptchaPacks(captchaFonts, isCaptcha);
  const [isCaptchaFailed, setIsCaptchaFailed] = useState(false);

  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, pagePadding);

  const engineRef = useRef(new QuestionsEducationPractice());
  const engine = engineRef.current;

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [timerKey, setTimerKey] = useState(0);
  const partialSelect = useRef<PracticeUserSelect | undefined>(undefined);
  const timerEndGrace = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerEndGrace.current), []);

  React.useEffect(() => {
    const onBackPress = () => {
      setIsConfirmingExit(true);
      showModal({
        closeOnBackdrop: false,
        onClose: () => setIsConfirmingExit(false),
        content: (
          <ConfirmationModal
            title={t("alert.exitConformation.title")}
            subtitle={t("alert.exitConformation.subtitle")}
            cancelText={t("alert.cancel")}
            confirmText={t("alert.ok")}
            onConfirm={() => {
              hideModal();
              navigation.goBack();
            }}
            onCancel={hideModal}
          />
        ),
      });

      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [showModal, hideModal, navigation, t]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false, gestureEnabled: false });
  }, [navigation]);

  const { selected, selectedWords } = useKanaContext();
  const { registerStudyDay } = useStudyActivity();
  const { preferences } = usePracticePreferences();
  const katakanaLetters = getKatakanaLetters(selected);
  const hiraganaLetters = getHiraganaLetters(selected);

  const questions = engine.questions;
  const isFreeze = engine.isFreeze;
  const currentIndex = engine.currentQuestionIndex;
  const question = engine.currentQuestion;

  useEffect(() => {
    if (isCaptcha && !captchaPacks.packs) return undefined;

    const { questions } = wrapperQuestionGenerate({
      katakanaLetters,
      hiraganaLetters,
      selectedWords,
      modes: mode,
      language,
      transliterations,
      captchaPacks: captchaPacks.packs ?? undefined,
    });

    if (questions && questions.length > 0) {
      engine.setQuestions(questions);
      forceUpdate();
    } else if (isCaptcha) {
      setIsCaptchaFailed(true);
    }

    return () => {
      engine.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- инициализация один раз при монтировании: katakana/hiragana-массивы пересоздаются каждый рендер, добавление в deps дало бы бесконечную регенерацию вопросов
  }, [captchaPacks.packs]);

  const onSubmit = useCallback<OnSubmit>(
    ({ isCorrectAnswer, userSelect }) => {
      if (engine.isLocked) return;
      engine.isLocked = true;

      engine.setFreezeTrue();
      forceUpdate();

      setTimeout(() => {
        engine.next({
          data: { isCorrectAnswer, userSelect },
          finishCallback: (data: PracticeResultData) => {
            registerStudyDay();
            navigation.navigate(ROUTES.RESULTS, data);
            engine.setFreezeTrue();
            forceUpdate();
          },
          nextCallback: () => {
            partialSelect.current = undefined;
            setTimerKey((prev) => prev + 1);
            engine.setFreezeFalse();
            engine.isLocked = false;
            forceUpdate();
          },
        });
      }, TEST_DELAY);
    },
    [engine, forceUpdate, navigation, registerStudyDay],
  );

  if (question === null) {
    if (isCaptcha) {
      return (
        <CaptchaLoading
          done={captchaPacks.done}
          total={captchaPacks.total}
          isSlow={captchaPacks.isSlow}
          isFailed={captchaPacks.isFailed || isCaptchaFailed}
          onRetry={captchaPacks.retry}
          onClose={navigation.goBack}
        />
      );
    }

    return <View></View>;
  }

  return (
    <SafeLayout>
      <View style={styles.container}>
        <View
          style={{
            paddingBottom: 16,
          }}
        >
          {questions.length !== 0 && currentIndex <= questions.length && (
            <LinearProgressBar
              close={navigation.goBack}
              onCloseConfirm={setIsConfirmingExit}
              onReport={() => {
                setIsReporting(true);
                openReport({
                  tags: REPORT_TAGS,
                  context: getPracticeReportContext(
                    question,
                    currentIndex > 0
                      ? {
                          question: questions[currentIndex - 1],
                          isCorrectAnswer: engine.questionsTime.find(
                            (answer) => answer.index === currentIndex - 1,
                          )?.isCorrectAnswer,
                        }
                      : undefined,
                  ),
                  onClose: () => setIsReporting(false),
                });
              }}
              current={currentIndex}
              all={questions.length}
            />
          )}

          {preferences.timerModes.includes(question.type) && (
            <MemoTimer
              index={currentIndex}
              key={timerKey}
              initial={preferences.timerSeconds}
              isFreeze={isFreeze || isReporting || isConfirmingExit}
              onTimerEnd={() => {
                timerEndGrace.current = setTimeout(
                  () => onSubmit({ isCorrectAnswer: false, userSelect: partialSelect.current }),
                  TIMER_END_GRACE_MS,
                );
              }}
            />
          )}
        </View>

        <View
          pointerEvents={isFreeze ? "none" : "auto"}
          style={{
            flex: 1,

            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {question.type === PracticeType.Testing && question.testing && (
            <EducationPracticeSelectAnswers
              question={question.testing.question}
              answers={question.testing.answers}
              questionKana={question.testing.questionKana}
              answersKana={question.testing.answersKana}
              currentIndex={currentIndex}
              onCompleted={onSubmit}
            />
          )}

          {question.type === PracticeType.Drawing && question.drawing && (
            <PracticeDrawKana
              symbol={question.drawing.question}
              kana={question.drawing.questionKana}
              onCompleted={onSubmit}
              onProgress={(userSelect) => {
                partialSelect.current = userSelect;
              }}
            />
          )}

          {question.type === PracticeType.Listening && question.listening && (
            <PracticeAudio
              answers={question.listening?.answers}
              answersKana={question.listening?.answersKana}
              question={question.listening?.question}
              onCompleted={onSubmit}
            />
          )}

          {question.type === PracticeType.MultipleChoice && question.multipleChoice && (
            <EducationPracticeChooseValue
              word={question.multipleChoice.word}
              answers={question.multipleChoice.answers}
              onCompleted={onSubmit}
            />
          )}

          {question.type === PracticeType.MatchingPairs && question.matchingPairs && (
            <EducationPracticeFindPair
              kana={question.matchingPairs.questionKana}
              words={question.matchingPairs.pairs}
              currentIndex={currentIndex}
              onCompleted={onSubmit}
              onProgress={(userSelect) => {
                partialSelect.current = userSelect;
              }}
            />
          )}

          {question.type === PracticeType.WordBuilding && question.wordBuilding && (
            <EducationPracticeChooseLetters
              title={question.wordBuilding.title}
              subtitle={question.wordBuilding.subtitle}
              sequence={question.wordBuilding.sequence}
              kana={question.wordBuilding.kana}
              onCompleted={onSubmit}
              onProgress={(userSelect) => {
                partialSelect.current = userSelect;
              }}
            />
          )}

          {question.type === PracticeType.Typing && question.typing && (
            <PracticeTypeKana
              key={currentIndex}
              symbol={question.typing.question}
              kana={question.typing.questionKana}
              onCompleted={onSubmit}
              onProgress={(userSelect) => {
                partialSelect.current = userSelect;
              }}
            />
          )}

          {question.type === PracticeType.Captcha && question.captcha && (
            <PracticeCaptcha
              key={currentIndex}
              question={question.captcha.question}
              tiles={question.captcha.tiles}
              onCompleted={onSubmit}
            />
          )}
        </View>
      </View>
    </SafeLayout>
  );
};

const makeStyles = (colors: ColorsType, pagePadding: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.BgPrimary,

      paddingHorizontal: pagePadding,
    },
  });

export default EducationPracticePage;
