import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import Input from "@nihongo/core/shared/ui/input";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon, ListIcon, MagnifyingGlassIcon, XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, SectionList, useWindowDimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "../../shared/api/get-cards";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import { KanjiTable } from "@/features/kanji-table/kanji-table";
import { BoardSection, useBoard } from "@/shared/contexts/board/board-context";

type BoardNavProp = StackNavigationProp<RootStackParamList, typeof ROUTES.BOARD>;
type BoardRouteProp = RouteProp<RootStackParamList, typeof ROUTES.BOARD>;

const TITLE_MAX_LENGTH = 12;

const truncate = (text: string) => {
  const title = text.length > TITLE_MAX_LENGTH ? `${text.slice(0, TITLE_MAX_LENGTH)}...` : text;

  const newTitle = title
    .toLowerCase()
    .split("")
    .map((item, index) => {
      if (index === 0 || ["(", ")", "-", " ", ".", ","].includes(title.split("")[index - 1])) {
        return item.toUpperCase();
      }

      return item;
    });

  return newTitle;
};

const BoardPage = () => {
  const navigation = useNavigation<BoardNavProp>();
  const { params } = useRoute<BoardRouteProp>();
  const { id, name } = params;

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { t } = useTranslation();

  const {
    sections,
    cards,
    hasQuery,
    loadBoard,
    query,
    setQuery,
    isSearchOpen,
    openSearch,
    closeSearch,
    selectCard,
    registerScrollToSection,
  } = useBoard();

  const listRef = useRef<SectionList<Card[], BoardSection>>(null);

  useEffect(() => {
    loadBoard(id);
  }, [id, loadBoard]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    registerScrollToSection((sectionIndex) => {
      listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: false });
    });
  }, [registerScrollToSection]);

  const openCard = useCallback(
    (card: Card) => {
      selectCard(card);
      navigation.navigate(ROUTES.WORD, { card });
    },
    [navigation, selectCard],
  );

  const cardWidth = (width - 24 - 4 * 3) / Math.round(width / 120);

  const ROW_HEIGHT = 66;
  const SECTION_HEADER_HEIGHT = 48;

  const getItemLayout = useMemo(() => {
    const lengths: number[] = [];
    const offsets: number[] = [];

    let offset = 0;

    const push = (length: number) => {
      lengths.push(length);
      offsets.push(offset);
      offset += length;
    };

    for (const section of sections) {
      push(SECTION_HEADER_HEIGHT);
      section.data.forEach(() => push(ROW_HEIGHT));
      push(0);
    }

    const total = offset;

    return (_: unknown, index: number) => ({
      length: lengths[index] ?? 0,
      offset: offsets[index] ?? total,
      index,
    });
  }, [sections]);

  const renderItem = useCallback(
    ({ item }: { item: Card[] }) => (
      <KanjiTable onPress={openCard} cards={item} cardWidth={cardWidth} />
    ),
    [openCard, cardWidth],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => (
      <View style={styles.nameContainer}>
        <Text style={[Typography.H4, { color: colors.TextPrimary, textTransform: "capitalize" }]}>
          {title}
        </Text>
      </View>
    ),
    [styles, colors],
  );

  return (
    <View style={styles.container}>
      {isSearchOpen ? (
        <View
          style={[
            styles.searchRow,
            {
              paddingTop: insets.top + 10,
              paddingLeft: insets.left + 16,
              paddingRight: insets.right + 16,
            },
          ]}
        >
          <View style={styles.searchInput}>
            <Input
              autoFocus
              placeholder={t("board.searchPlaceholder")}
              value={query}
              onChange={setQuery}
            />
          </View>

          <Button
            color="primary"
            variant="text"
            isHapticFeedback
            icon={<XIcon size={32} />}
            onClick={closeSearch}
          />
        </View>
      ) : (
        <PageTitle
          isSaveArea
          leftIcon={
            <Button
              color="primary"
              variant="text"
              isHapticFeedback
              icon={<CaretLeftIcon size={32} />}
              onClick={() => navigation.goBack()}
            />
          }
          icon={
            <View style={styles.headerIcons}>
              <Button
                color="primary"
                variant="text"
                isHapticFeedback
                icon={<MagnifyingGlassIcon size={32} />}
                onClick={openSearch}
              />

              <Button
                color="primary"
                variant="text"
                isHapticFeedback
                icon={<ListIcon size={32} />}
                onClick={() => navigation.navigate(ROUTES.SECTIONS)}
              />
            </View>
          }
        >
          {truncate(name)}
        </PageTitle>
      )}

      <View style={styles.list}>
        <SectionList
          ref={listRef}
          sections={sections}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          removeClippedSubviews={isAndroid}
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={7}
          updateCellsBatchingPeriod={50}
          getItemLayout={getItemLayout}
          keyExtractor={(row) => row[0].id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={
            hasQuery && cards.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t("board.nothingFound")}</Text>
              </View>
            ) : undefined
          }
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BgPrimary,
    },
    list: {
      flex: 1,
      backgroundColor: colors.BgPrimary,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    nameContainer: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 10,
      paddingBottom: 10,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,

      paddingBottom: 10,
    },
    searchInput: {
      flex: 1,
    },
    empty: {
      paddingTop: 48,
      alignItems: "center",
    },
    emptyText: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
    },
  });

export default BoardPage;
