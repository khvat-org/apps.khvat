import React, { useEffect } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useTransliterationsContext } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SmileyMeltingIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useLessonsContext } from "../model/hooks";
import { Lesson as LessonInterface } from "../model/types";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import Chapter from "@/widgets/learning/lesson/chapter/chapter";

function isVersionCompatible(appVersion: string, minVersion: string) {
  const appParts = appVersion.split(".").map(Number);
  const minParts = minVersion.split(".").map(Number);

  for (let i = 0; i < Math.max(appParts.length, minParts.length); i++) {
    const appPart = appParts[i] || 0;
    const minPart = minParts[i] || 0;

    if (appPart > minPart) return true;
    if (appPart < minPart) return false;
  }

  return true;
}

type LearnResultsNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.RESULTS>;

const LearningList: React.FC = () => {
  const navigation = useNavigation<LearnResultsNavigationProp>();
  const { showModal, hideModal } = useModal();

  const { width } = useWindowDimensions();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors, width);
  const { t, i18n } = useTranslation();

  const { replaceTransliterations, transliterations } = useTransliterationsContext();

  const { lessonsKey } = useGetRomaji();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const { chapters, completedLessonsKeys, loading, loadLessons } = useLessonsContext();

  useEffect(() => {
    const controller = new AbortController();
    loadLessons(lessonsKey, controller.signal);
    return () => controller.abort();
  }, [i18n.language, lessonsKey, loadLessons]);

  const lessonsIds =
    chapters.length > 0
      ? chapters.flatMap((chapter) =>
          chapter.lessons.map((lesson) => completedLessonsKeys.includes(lesson.lesson_key)),
        )
      : [];

  const completedIds = lessonsIds.filter(Boolean);

  const isShowChapters = chapters[0]?.title;
  const percentageProgress = +((completedIds.length / lessonsIds.length) * 100).toFixed();

  const retry = () => loadLessons(lessonsKey);

  const startLesson = (lesson: LessonInterface) => {
    const versionCompatible = isVersionCompatible(
      process.env.VERSION || "",
      lesson.minimum_version,
    );

    if (versionCompatible === false) {
      showModal({
        closeOnBackdrop: true,
        onClose: () => {},
        content: (
          <AlertModal
            title={t("alert.newVersion.title")}
            subtitle={t("alert.newVersion.subtitle")}
            button={t("alert.ok")}
            onPress={hideModal}
          />
        ),
      });

      return;
    }

    const newLesson = JSON.parse(replaceTransliterations(JSON.stringify(lesson), transliterations));

    navigation.navigate(ROUTES.LESSON_PAGE, { lesson: newLesson });
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <PageTitle
          containerStyle={{
            backgroundColor: colors.BgPrimary,
          }}
          icon={
            loading && isShowChapters ? (
              <ActivityIndicator size="small" color={colors.BgContrast} />
            ) : null
          }
          isSaveArea
        >
          {t("tabs.learning")}
        </PageTitle>

        <View style={{ width: "100%" }} />

        <View style={styles.content}>
          {(!!percentageProgress || percentageProgress === 0) && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBack}>
                <View
                  style={[
                    { width: `${percentageProgress}%` },
                    styles.progressBarFilled,
                    percentageProgress > 99 && {
                      borderTopRightRadius: 2,
                      borderBottomRightRadius: 2,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.progressBarTextContainer,
                    {
                      left: `${percentageProgress}%`,
                      marginLeft:
                        percentageProgress > 83 ? -35 : percentageProgress < 17.5 ? 0 : -17.5,
                    },
                  ]}
                >
                  <Text style={styles.progressBarText}>{percentageProgress}%</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {!isShowChapters && (
          <View style={styles.errorIcon}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.BgContrast} />
            ) : (
              <SmileyMeltingIcon color={colors.BgContrast} size={64} />
            )}

            {!loading && (
              <>
                <Text
                  style={{
                    color: colors.TextPrimary,
                    ...Typography.regularDefault,
                    marginTop: 16,
                    textAlign: "center",
                    maxWidth: 300,
                  }}
                >
                  {t("lessonsList.failedToLoadLessons")}
                </Text>
                <Button
                  color="primary"
                  onClick={retry}
                  text={t("common.retry")}
                  style={styles.retryButton}
                />
              </>
            )}
          </View>
        )}

        <View style={styles.scrollContainer}>
          <View style={styles.scrollContainerCenter}>
            {isShowChapters && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {chapters.map((chapter) => (
                  <Chapter
                    title={chapter.title}
                    lessons={chapter.lessons}
                    key={chapter.id}
                    startLesson={(lesson) => startLesson(lesson)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LearningList;

const makeStyles = (colors: ColorsType, width: number) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    scrollContainerCenter: {
      flex: 1,
      width: "100%",
      maxWidth: TABLET_WIDTH,

      borderRadius: 12,
      overflow: "hidden",

      backgroundColor: colors.BgPrimary,
    },
    main: {
      flex: 1,
      backgroundColor: width > TABLET_WIDTH ? colors.BgSecondary : colors.BgPrimary,
    },
    container: {
      flex: 1,
      paddingBottom: 0,
    },
    content: {
      backgroundColor: colors.BgPrimary,
      paddingBottom: width > TABLET_WIDTH ? 25 : 0,

      borderBottomRightRadius: 24,
      borderBottomLeftRadius: 24,
    },
    errorIcon: {
      height: "80%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    retryButton: {
      marginTop: 24,
      paddingHorizontal: 40,
    },
    progressBarContainer: {
      marginLeft: 16,
      marginRight: 16,
      marginTop: 8,
      zIndex: 999,
    },
    progressBarBack: {
      backgroundColor: colors.BgSecondary,
      width: "100%",
      height: 4,
      position: "relative",
      borderRadius: 2,
    },
    progressBarFilled: {
      height: 4,
      backgroundColor: colors.BgSuccess,
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
    },
    progressBarTextContainer: {
      width: 35,
      height: 18,
      top: -7,
      backgroundColor: colors.BgSuccess,
      borderRadius: 20,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    progressBarText: {
      ...Typography.regularCaption,
      color: colors.TextWhite,
    },
  });
