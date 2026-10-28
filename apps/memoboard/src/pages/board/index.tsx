import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon, ListIcon, MagnifyingGlassIcon, XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  SectionList,
  Keyboard,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "../../shared/api/get-cards";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import { BoardSearchPanel } from "@/features/board-search/board-search-panel";
import { getRowHeight, KanjiTable } from "@/features/kanji-table/kanji-table";
import { getLessonHeaderHeight, LessonHeader } from "@/features/lesson-header/lesson-header";
import { BoardSection, useBoard } from "@/shared/contexts/board/board-context";

type BoardNavProp = StackNavigationProp<RootStackParamList, typeof ROUTES.BOARD>;
type BoardRouteProp = RouteProp<RootStackParamList, typeof ROUTES.BOARD>;

const BoardPage = () => {
  const navigation = useNavigation<BoardNavProp>();
  const { params } = useRoute<BoardRouteProp>();
  const { id } = params;

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
    preference,
    columnsCount,
    toggleShuffle,
    isBookmarksMode,
    openBookmarks,
    closeBookmarks,
  } = useBoard();

  const listRef = useRef<SectionList<Card[], BoardSection>>(null);

  // * Текст в поле поиска; в фильтр карточек (query) он попадает только по Enter
  const [draft, setDraft] = useState(query);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const deferredDraft = useDeferredValue(draft);

  // * Карточка, раскрытая долгим нажатием; остаётся раскрытой, пока не раскроют другую
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  const revealCard = useCallback((card: Card) => setRevealedCardId(card.id), []);

  // * Урок выбран в поиске при активном фильтре — скроллим, когда вернутся все разделы
  const pendingSectionRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (hasQuery || pendingSectionRef.current === null) return;

    const sectionIndex = pendingSectionRef.current;
    pendingSectionRef.current = null;

    listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: false });
  }, [sections, hasQuery]);

  const onOpenSearch = useCallback(() => {
    setDraft(query);
    setIsSuggesting(true);
    openSearch();
  }, [query, openSearch]);

  const onCloseSearch = useCallback(() => {
    setDraft("");
    setIsSuggesting(false);
    closeSearch();
  }, [closeSearch]);

  const onSubmitSearch = useCallback(() => {
    if (!draft.trim()) {
      onCloseSearch();
      return;
    }

    setQuery(draft);
    setIsSuggesting(false);
    Keyboard.dismiss();
  }, [draft, setQuery, onCloseSearch]);

  const onLessonPress = useCallback(
    (sectionIndex: number) => {
      onCloseSearch();
      Keyboard.dismiss();

      if (hasQuery) {
        pendingSectionRef.current = sectionIndex;
      } else {
        listRef.current?.scrollToLocation({ sectionIndex, itemIndex: 0, animated: false });
      }
    },
    [onCloseSearch, hasQuery],
  );

  const onBookmarksPress = useCallback(() => {
    onCloseSearch();
    Keyboard.dismiss();
    openBookmarks();
    listRef.current?.getScrollResponder()?.scrollTo({ y: 0, animated: false });
  }, [onCloseSearch, openBookmarks]);

  const openCard = useCallback(
    (card: Card) => {
      selectCard(card);
      navigation.navigate(ROUTES.WORD, { card });
    },
    [navigation, selectCard],
  );

  const cardWidth = (width - 24 - 4 * (columnsCount - 1)) / columnsCount;

  const ROW_HEIGHT = getRowHeight(preference, columnsCount);

  const getItemLayout = useMemo(() => {
    const lengths: number[] = [];
    const offsets: number[] = [];

    let offset = 0;

    const push = (length: number) => {
      lengths.push(length);
      offsets.push(offset);
      offset += length;
    };

    sections.forEach((section, sectionIndex) => {
      push(getLessonHeaderHeight(sectionIndex));
      section.data.forEach(() => push(ROW_HEIGHT));
      push(0);
    });

    const total = offset;

    return (_: unknown, index: number) => ({
      length: lengths[index] ?? 0,
      offset: offsets[index] ?? total,
      index,
    });
  }, [sections, ROW_HEIGHT]);

  // * Ключ по всем карточкам строки: после перемешки строка пересоздаётся, а не показывает старый порядок
  const rowKey = useCallback((row: Card[]) => row.map((card) => card.id).join(), []);

  const renderItem = useCallback(
    ({ item }: { item: Card[] }) => (
      <KanjiTable
        onPress={openCard}
        cards={item}
        cardWidth={cardWidth}
        columnsCount={columnsCount}
        preference={preference}
        revealedCardId={revealedCardId}
        onReveal={revealCard}
      />
    ),
    [openCard, cardWidth, columnsCount, preference, revealedCardId, revealCard],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: BoardSection }) => {
      const { lessonId } = section;

      return (
        <LessonHeader
          title={section.title}
          isFirst={sections[0] === section}
          isShuffled={section.isShuffled}
          onToggleShuffle={lessonId === null ? undefined : () => toggleShuffle(lessonId)}
          onClose={section.isBookmarks ? closeBookmarks : undefined}
        />
      );
    },
    [sections, toggleShuffle, closeBookmarks],
  );

  return (
    <View style={styles.container}>
      {isSearchOpen ? (
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              paddingLeft: insets.left + 16,
              paddingRight: insets.right + 16,
            },
          ]}
        >
          <View style={styles.searchInput}>
            <MagnifyingGlassIcon size={20} color={colors.TextSecondary} />

            <TextInput
              autoFocus
              style={styles.searchText}
              placeholder={t("board.searchPlaceholder")}
              placeholderTextColor={colors.TextSecondary}
              value={draft}
              onChangeText={setDraft}
              onFocus={() => setIsSuggesting(true)}
              onSubmitEditing={onSubmitSearch}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <Button
            color="primary"
            variant="text"
            isHapticFeedback
            icon={<XIcon size={28} />}
            onClick={onCloseSearch}
          />
        </View>
      ) : (
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              paddingLeft: insets.left + 16,
              paddingRight: insets.right + 16,
            },
          ]}
        >
          <Button
            color="primary"
            variant="text"
            isHapticFeedback
            icon={<CaretLeftIcon size={28} />}
            onClick={() => navigation.goBack()}
          />

          <View style={styles.headerIcons}>
            <Button
              color="primary"
              variant="text"
              isHapticFeedback
              icon={<MagnifyingGlassIcon size={28} />}
              onClick={onOpenSearch}
            />

            <Button
              color="primary"
              variant="text"
              isHapticFeedback
              icon={<ListIcon size={28} />}
              onClick={() => navigation.navigate(ROUTES.SECTIONS)}
            />
          </View>
        </View>
      )}

      <View style={styles.list}>
        <SectionList
          ref={listRef}
          sections={sections}
          extraData={revealedCardId}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          removeClippedSubviews={isAndroid}
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={7}
          updateCellsBatchingPeriod={50}
          getItemLayout={getItemLayout}
          keyExtractor={rowKey}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListFooterComponent={
            isBookmarksMode && cards.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t("board.bookmarksEmpty")}</Text>
              </View>
            ) : undefined
          }
          ListEmptyComponent={
            hasQuery && cards.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t("board.nothingFound")}</Text>
              </View>
            ) : undefined
          }
        />

        {isSearchOpen && isSuggesting && (
          <View style={StyleSheet.absoluteFill}>
            <BoardSearchPanel
              query={deferredDraft}
              onCardPress={openCard}
              onLessonPress={onLessonPress}
              onBookmarksPress={onBookmarksPress}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },
    list: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,

      paddingBottom: 8,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    searchInput: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,

      height: 44,
      paddingHorizontal: 12,

      backgroundColor: colors.BgPrimary,
      borderRadius: 12,
    },
    searchText: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,

      flex: 1,
      height: "100%",
      paddingVertical: 0,
    },
    empty: {
      paddingTop: 48,
      paddingHorizontal: 32,
      alignItems: "center",
    },
    emptyText: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      textAlign: "center",
    },
  });

export default BoardPage;
