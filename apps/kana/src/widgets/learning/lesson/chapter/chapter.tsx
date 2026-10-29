import React from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useTransliterationsContext } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

import TopicItem from "@/entities/learning/topic-item/topic-item";
import { useCompletedLessons, useLessonsContext } from "@/pages/education/learning/model/hooks";
import { Lesson as LessonInterface } from "@/pages/education/learning/model/types";

type ChapterProps = {
  title: string;
  lessons: LessonInterface[];
  startLesson: (lesson: LessonInterface) => void;
};

const Chapter: React.FC<ChapterProps> = ({ lessons, title, startLesson }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { triggerHaptic } = useHaptic();

  const { openedLessonId, setOpenedLessonId } = useLessonsContext();

  const { replaceTransliterations, transliterations } = useTransliterationsContext();

  const completedLessons = useCompletedLessons();

  const firstChapterIds = lessons.map((item) => item.lesson_key);
  const firstChapterProgress = firstChapterIds.filter(
    (item) => completedLessons.includes(item) || completedLessons.includes(item),
  );

  const toggleActiveLesson = (key: string) => {
    triggerHaptic();

    setOpenedLessonId(openedLessonId === key ? null : key);
  };

  const subtitleColor =
    firstChapterProgress.length === firstChapterIds.length
      ? colors.TextSuccess
      : colors.TextPrimary;

  if (lessons.length === 0) return <></>;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        {firstChapterProgress.length}/{firstChapterIds.length} {t("lessonsList.completed")}
      </Text>

      {lessons.map((item, index) => (
        <TopicItem
          key={item.lesson_key}
          isPassed={completedLessons.includes(item.lesson_key)}
          isOpened={openedLessonId === item.id}
          isLast={index + 1 === lessons.length}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          infoTitle={replaceTransliterations(item.expanded_title, transliterations)}
          infoSubTitle={replaceTransliterations(item.expanded_subtitle, transliterations)}
          onClick={() => toggleActiveLesson(item.id)}
          onStartLesson={() => {
            triggerHaptic();
            startLesson(item);
          }}
        />
      ))}
    </View>
  );
};

export default Chapter;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    title: {
      ...Typography.H4,
      color: colors.TextPrimary,
      marginTop: 22,
      paddingHorizontal: 16,
    },
    subtitle: {
      ...Typography.regularLabel,
      marginTop: 8,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
  });
