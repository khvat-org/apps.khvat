import React, { useCallback, useState } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { Typography } from "@nihongo/core/shared/typography";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BookIcon, PencilSimpleIcon, PlusCircleIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import { memoboardFetch } from "@/shared/api/memoboard-fetch";

interface Board {
  id: string;
  title: string;
}

interface Boards {
  myBoards: Board[];
  publicBoards: Board[];
}

type BoardsNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.WELCOME>;

const BoardsPage: React.FC = () => {
  const navigation = useNavigation<BoardsNavigationProp>();

  const [boards, setBoards] = useState<Boards>({ myBoards: [], publicBoards: [] });

  const getBoards = async () => {
    const response = await memoboardFetch("/api/boards");

    const body = await response.json();

    if (response.status === 200) {
      setBoards(body);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBoards();
    }, []),
  );

  const { colors } = useThemeContext();

  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, pagePadding);

  const { t } = useTranslation();

  const goToBoards = (id: string, name: string) => {
    navigation.navigate(ROUTES.BOARD, { id, name });
  };

  return (
    <View style={styles.container}>
      <PageTitle isSaveArea>{t("boards.title")}</PageTitle>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>{t("boards.myBoards")}</Text>

          <Pressable style={styles.btn} onPress={() => navigation.navigate(ROUTES.CREATE_BOARD)}>
            <PlusCircleIcon color={colors.TextWhite} />
          </Pressable>
        </View>

        {boards.myBoards.map((board) => (
          <Pressable
            onPress={() => goToBoards(board.id, board.title)}
            style={styles.board}
            key={board.id}
          >
            <View style={styles.boardInfo}>
              <BookIcon color={colors.BgAccent} />
              <Text style={styles.boardTitle}>{board.title}</Text>
            </View>

            <Pressable onPress={() => navigation.navigate(ROUTES.BOARD_SETTINGS, { id: board.id })}>
              <PencilSimpleIcon color={colors.TextPrimary} />
            </Pressable>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>{t("boards.publicBoards")}</Text>

        {boards.publicBoards.map((board) => (
          <Pressable
            onPress={() => goToBoards(board.id, board.title)}
            style={styles.board}
            key={board.id}
          >
            <View style={styles.boardInfo}>
              <BookIcon color={colors.BgAccent} />
              <Text style={styles.boardTitle}>{board.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: ColorsType, pagePadding: number) =>
  StyleSheet.create({
    sectionTitle: {
      ...Typography.boldLabel,

      color: colors.TextPrimary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btn: {
      backgroundColor: colors.BgAccent,
      borderRadius: 6,
      minWidth: 28,

      minHeight: 28,

      alignItems: "center",
      justifyContent: "center",

      padding: 0,
    },
    container: {
      flex: 1,
      backgroundColor: colors.BgPrimary,
    },
    scroll: {
      gap: 16,
      paddingBottom: 32,
      paddingHorizontal: pagePadding,
    },
    title: {
      ...Typography.H4,

      color: colors.TextPrimary,
    },
    board: {
      backgroundColor: colors.BgSecondary,
      padding: 12,
      borderRadius: 12,

      flexDirection: "row",
      justifyContent: "space-between",
    },
    boardInfo: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },
    boardTitle: {
      color: colors.TextPrimary,

      ...Typography.regularLabel,
    },
  });

export default BoardsPage;
