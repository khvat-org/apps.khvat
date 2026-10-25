import React, { useCallback, useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import { useBoard } from "@/shared/contexts/board/board-context";

type SectionsNavProp = StackNavigationProp<RootStackParamList, typeof ROUTES.SECTIONS>;

const SectionsPage: React.FC = () => {
  const navigation = useNavigation<SectionsNavProp>();

  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { sections, scrollToSection } = useBoard();

  const items = useMemo(
    () =>
      sections.map((section) => ({
        title: section.title,
        cardsCount: section.data.reduce((total, row) => total + row.length, 0),
      })),
    [sections],
  );

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const onSelect = useCallback(
    (sectionIndex: number) => {
      goBack();
      scrollToSection(sectionIndex);
    },
    [goBack, scrollToSection],
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ModalHeader
        left={{
          text: t("common.close"),
          onPress: goBack,
        }}
        title={t("board.sectionsTitle")}
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {items.map((item, index) => (
            <Pressable
              key={`${index}-${item.title}`}
              onPress={() => onSelect(index)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.marker}>§</Text>

              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.count}>{item.cardsCount}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    content: {
      gap: 4,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,

      backgroundColor: colors.BgSecondary,
      borderRadius: 12,

      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    rowPressed: {
      backgroundColor: colors.BgLightGray,
    },
    marker: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,

      width: 16,
    },
    title: {
      ...Typography.regularLabel,
      color: colors.TextPrimary,

      flex: 1,
    },
    count: {
      ...Typography.regularCaption,
      color: colors.TextSecondary,
    },
  });

export default SectionsPage;
