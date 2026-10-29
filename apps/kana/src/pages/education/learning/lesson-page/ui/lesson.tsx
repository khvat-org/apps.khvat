import React, { useEffect } from "react";

import { useReport } from "@nihongo/core/features/report/use-report";
import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { ConfirmationModal } from "@nihongo/core/shared/contexts/modal/presets/confirmation";
import { useStudyActivity } from "@nihongo/core/shared/contexts/study-activity/study-activity-context";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import LinearProgressBar from "@nihongo/core/shared/ui/progressbar/linear/linear-progress-bar";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLessonsContext } from "../../model/hooks";
import { Lesson as LessonInterface } from "../../model/types";
import { useEducationLessonContext } from "../lib/context/education-lesson-context";

import FinishScreen from "@/widgets/learning/lesson/finish-screen/finish-screen";
import InfoScreen from "@/widgets/learning/lesson/info-screen/info-screen";

const REPORT_TAGS = ["grammatical_typo", "interface_error", "incorrect_information", "other"];

interface LessonProps {
  lesson: LessonInterface;
}

const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  const { completeLesson } = useLessonsContext();
  const { registerStudyDay } = useStudyActivity();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { triggerHaptic } = useHaptic();

  const { showModal, hideModal } = useModal();
  const { openReport } = useReport();

  const { init, currentScreen, screen, furthestScreen, lessonScreens, next, back, retry } =
    useEducationLessonContext();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
      headerBackVisible: false,
    });
  }, [navigation]);

  const addMarkCompleteLessonInStore = () => {
    completeLesson(lesson.lesson_key);
    registerStudyDay();
  };

  const onComplete = () => {
    addMarkCompleteLessonInStore();
    navigation.goBack();
  };

  const onRetry = () => {
    addMarkCompleteLessonInStore();
    init(lesson.screens);
    retry();
  };

  useEffect(() => {
    init(lesson.screens);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init из контекста
  }, [lesson.screens]);

  useEffect(() => {
    const onBackPress = () => {
      showModal({
        closeOnBackdrop: false,
        onClose: () => {},
        content: (
          <ConfirmationModal
            title={t("alert.exitConformation.title")}
            subtitle={t("alert.exitConformation.subtitle")}
            cancelText={t("alert.cancel")}
            confirmText={t("alert.ok")}
            onConfirm={() => {
              triggerHaptic();

              setTimeout(() => {
                navigation.goBack();
                hideModal();
              }, 0);
            }}
            onCancel={() => {
              triggerHaptic();

              setTimeout(() => {
                hideModal();
              }, 0);
            }}
          />
        ),
      });

      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => backHandler.remove();
  }, [triggerHaptic, hideModal, navigation, showModal, t]);

  return (
    <SafeLayout disableLeft disableRight style={styles.container}>
      <View
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        }}
      >
        {currentScreen?.title !== "finish" && (
          <LinearProgressBar
            close={navigation.goBack}
            onReport={() =>
              openReport({
                tags: REPORT_TAGS,
                context: `lesson:${lesson.lesson_key}/screen:${currentScreen?.id}`,
              })
            }
            current={screen}
            all={lessonScreens.length - 1}
          />
        )}
      </View>

      {currentScreen && currentScreen?.title === "finish" && (
        <View
          style={[
            styles.container,
            { paddingLeft: insets.left + 16, paddingRight: insets.right + 16 },
          ]}
        >
          <FinishScreen next={onComplete} retry={onRetry} />
        </View>
      )}

      {currentScreen && currentScreen?.title !== "finish" && (
        <View style={styles.container}>
          <InfoScreen
            key={screen}
            next={next}
            back={back}
            isFirst={screen === 0}
            isPassed={screen < furthestScreen}
            finish={onComplete}
            title={currentScreen.title}
            blocks={currentScreen.blocks}
            isLast={screen + 1 === lessonScreens.length}
            id={currentScreen.id}
            screen_order={currentScreen.screen_order}
          />
        </View>
      )}
    </SafeLayout>
  );
};

export default Lesson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
