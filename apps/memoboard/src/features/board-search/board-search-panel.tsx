import React, { useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { BookmarkSimpleIcon, CaretRightIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BOARD_SETTINGS,
  BOARD_SETTINGS_KEYWORDS,
  BoardSettingItem,
} from "@/features/board-search/board-settings";
import { Card } from "@/shared/api/get-cards";
import { useBoard } from "@/shared/contexts/board/board-context";

interface BoardSearchPanelProps {
  query: string;
  onCardPress: (card: Card) => void;
  onLessonPress: (sectionIndex: number) => void;
  onBookmarksPress: () => void;
}

const BOOKMARKS_KEYWORDS = ["сохранённые", "сохраненные", "закладки", "избранное", "разделы", "bookmarks", "saved"];

// * Пока ничего не введено — настройки доски, иначе подходящие настройки, уроки и карточки строками
export const BoardSearchPanel: React.FC<BoardSearchPanelProps> = ({
  query,
  onCardPress,
  onLessonPress,
  onBookmarksPress,
}) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { findInBoard, bookmarks } = useBoard();

  const q = query.trim().toLowerCase();

  const settings = useMemo(
    () =>
      q
        ? BOARD_SETTINGS.filter((setting) =>
            BOARD_SETTINGS_KEYWORDS[setting].some((keyword) => keyword.includes(q)),
          )
        : BOARD_SETTINGS,
    [q],
  );

  const { lessons, cards } = useMemo(() => findInBoard(q), [findInBoard, q]);

  const showBookmarks = !q || BOOKMARKS_KEYWORDS.some((keyword) => keyword.includes(q));

  const isEmpty =
    !showBookmarks && settings.length === 0 && lessons.length === 0 && cards.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {isEmpty && <Text style={styles.empty}>{t("board.nothingFound")}</Text>}

      {showBookmarks && (
        <>
          <Text style={styles.groupLabel}>{t("board.sectionsLabel")}</Text>
          <Pressable
            onPress={onBookmarksPress}
            style={({ pressed }) => [styles.row, styles.lessonRow, pressed && styles.rowPressed]}
          >
            <BookmarkSimpleIcon size={22} color={colors.TextSecondary} />

            <Text numberOfLines={1} style={styles.navTitle}>
              {t("board.bookmarks")}
            </Text>

            <Text style={styles.hint}>{bookmarks.size}</Text>
          </Pressable>
        </>
      )}

      {settings.length > 0 && (
        <>
          <Text style={styles.groupLabel}>{t("board.settingsLabel")}</Text>
          {settings.map((setting) => (
            <BoardSettingItem key={setting} setting={setting} />
          ))}
        </>
      )}

      {lessons.length > 0 && (
        <>
          <Text style={styles.groupLabel}>{t("board.lessonsLabel")}</Text>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.sectionIndex}
              onPress={() => onLessonPress(lesson.sectionIndex)}
              style={({ pressed }) => [styles.row, styles.lessonRow, pressed && styles.rowPressed]}
            >
              <Text style={styles.marker}>§</Text>

              <Text numberOfLines={1} style={styles.lessonTitle}>
                {lesson.title}
              </Text>

              <CaretRightIcon size={16} color={colors.TextSecondary} />
            </Pressable>
          ))}
        </>
      )}

      {cards.length > 0 && (
        <>
          <Text style={styles.groupLabel}>{t("board.cardsLabel")}</Text>
          {cards.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => onCardPress(card)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text numberOfLines={1} style={styles.cardTitle}>
                {card.titleWithoutFurigana}
              </Text>

              {card.subtitle.length > 0 && (
                <Text numberOfLines={1} style={styles.cardSubtitle}>
                  {card.subtitleNoFurigana}
                </Text>
              )}
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },
    groupLabel: {
      ...Typography.regularCaption,
      color: colors.TextSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,

      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 6,
    },
    row: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    rowPressed: {
      backgroundColor: colors.BgPrimary,
    },
    lessonRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    marker: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,

      width: 22,
      textAlign: "center",
    },
    lessonTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,

      flex: 1,
    },
    navTitle: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,

      flex: 1,
    },
    hint: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    cardTitle: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
    },
    cardSubtitle: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    empty: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      textAlign: "center",

      paddingTop: 48,
    },
  });
