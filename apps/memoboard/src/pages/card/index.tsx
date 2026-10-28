import React, { useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ArrowLeftIcon, ArrowRightIcon, BookmarkSimpleIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, StatusBar } from "react-native";
import { ScrollView, Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import CardHeader from "@/features/card/card-header";
import { useCardEdit } from "@/features/card/edit/use-card-edit";
import Examples from "@/features/card/examples";
import KanjiOrder from "@/features/card/kanji-order/kanji-order";
import VerbForm from "@/features/card/verb-form/verb-form";
import YetSeen from "@/features/card/yet-seen/yet-seen";
import { useBoard } from "@/shared/contexts/board/board-context";

type BoardNavProp = StackNavigationProp<RootStackParamList, typeof ROUTES.WORD>;
type BoardRouteProp = RouteProp<RootStackParamList, typeof ROUTES.WORD>;

const SWIPE_THRESHOLD = 20;

const SWIPE_DISTANCE = 60;

const CardPage = () => {
  const navigation = useNavigation<BoardNavProp>();
  const { params } = useRoute<BoardRouteProp>();

  const {
    currentCard,
    cards,
    selectCard,
    hasNext,
    hasPrev,
    next,
    prev,
    bookmarks,
    toggleBookmark,
  } = useBoard();

  const card = currentCard ?? params.card;

  const edit = useCardEdit(card);

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const goBack = () => navigation.goBack();

  const isBookmarked = bookmarks.has(card.id);

  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!edit.isEditing)
        .activeOffsetX([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
        .failOffsetY([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
        .runOnJS(true)
        .onEnd((event) => {
          if (Math.abs(event.translationX) < SWIPE_DISTANCE) return;

          if (event.translationX < 0) {
            if (hasNext) next();
          } else if (hasPrev) {
            prev();
          }
        }),
    [next, prev, hasNext, hasPrev, edit.isEditing],
  );

  return (
    <GestureDetector gesture={swipe}>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <CardHeader goBack={goBack} card={card} edit={edit} />

        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Examples card={card} edit={edit} />

            {!edit.isEditing && (
              <>
                <KanjiOrder title={card.title} />
                <VerbForm tags={card.tags.map((i) => i.label)} title={card.title} />
                <YetSeen title={card.title} cards={cards} openModal={selectCard} />
              </>
            )}
          </ScrollView>
        </View>

        {!edit.isEditing && (
          <View style={[styles.buttons, { paddingBottom: insets.bottom }]}>
            <Button
              color="secondary"
              isHapticFeedback
              icon={<ArrowLeftIcon size={24} />}
              isDisabled={!hasPrev}
              onClick={prev}
            />

            <Button
              color="secondary"
              isHapticFeedback
              text={t(isBookmarked ? "card.bookmarkRemove" : "card.bookmarkAdd")}
              icon={<BookmarkSimpleIcon size={20} weight={isBookmarked ? "fill" : "regular"} />}
              isFullWidth
              onClick={() => toggleBookmark(card.id)}
            />

            <Button
              color="secondary"
              isHapticFeedback
              icon={<ArrowRightIcon size={24} />}
              isDisabled={!hasNext}
              onClick={next}
            />
          </View>
        )}
      </View>
    </GestureDetector>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 16,

      paddingTop: 16,
    },
    image: {
      resizeMode: "cover",
      alignSelf: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    card_subtitle: {
      color: colors.TextPrimary,
      ...Typography.H3,

      marginTop: 8,
    },

    buttonContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",

      paddingLeft: 12,
      paddingRight: 12,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 16,
      gap: 16,
    },
    tags: {
      flexDirection: "row",
      marginTop: 16,
      gap: 4,
    },
    header: {
      backgroundColor: colors.BgContrast,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    list: {
      flexDirection: "column",
      gap: 6,
    },
    item: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    itemLabel: {
      color: colors.TextSecondary,
      ...Typography.regularLabel,
    },
    itemValue: {
      color: colors.TextPrimary,
      ...Typography.regularDefault,
    },
  });

export default CardPage;
