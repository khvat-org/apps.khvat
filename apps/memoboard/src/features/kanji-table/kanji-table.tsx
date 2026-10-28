import React, { useMemo } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { fonts, Typography } from "@nihongo/core/shared/typography";
import { View, Text, StyleSheet, Pressable, TextStyle } from "react-native";

import { Card } from "@/shared/api/get-cards";
import { BoardPreference, CardMode } from "@/shared/contexts/board/board-preference";
import { CardTag } from "@/shared/ui/card-tag/card-tag";
import Furigana from "@/shared/ui/furigana/furigana";

const CARD_PADDING = 8;
const ROW_GAP = 4;
const TAGS_HEIGHT = 20 + 8;
const FURIGANA_LINE_HEIGHT = 13;
const SUBTITLE_LINE_HEIGHT = Typography.regularLabel.lineHeight ?? 20;

// * Чем шире карточки, тем крупнее японское слово
const LARGE_TITLE: TextStyle = { ...Typography.H4, ...fonts.regular };

const getTitleTypography = (columnsCount: number): TextStyle =>
  columnsCount <= 2 ? LARGE_TITLE : Typography.regularDefault;

// * Высота одинаковая во всех режимах: при долгом нажатии карточка показывает всё и не должна прыгать
export const getRowHeight = (preference: BoardPreference, columnsCount: number) =>
  CARD_PADDING * 2 +
  (preference.showTags ? TAGS_HEIGHT : 0) +
  FURIGANA_LINE_HEIGHT +
  (getTitleTypography(columnsCount).lineHeight ?? 24) +
  SUBTITLE_LINE_HEIGHT +
  ROW_GAP;

interface BoardCardProps {
  card: Card;
  width: number;
  height: number;
  preference: BoardPreference;
  titleTypography: TextStyle;
  isRevealed: boolean;
  onPress: (card: Card) => void;
  onReveal: (card: Card) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  card,
  width,
  height,
  preference,
  titleTypography,
  isRevealed,
  onPress,
  onReveal,
}) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { triggerHaptic } = useHaptic();

  // * Раскрытая долгим нажатием карточка показывает и японский, и фуригану, и перевод
  const mode = isRevealed ? CardMode.Both : preference.mode;

  const showTitle = mode !== CardMode.Translate;
  const showSubtitle = mode !== CardMode.Japan;

  return (
    <Pressable
      onPress={() => onPress(card)}
      onLongPress={() => {
        triggerHaptic();
        onReveal(card);
      }}
      style={[styles.item, { width, height }, isRevealed && styles.itemRevealed]}
    >
      {preference.showTags && card.tags.length > 0 && (
        <View style={[styles.tags, isRevealed && styles.tagsRevealed]}>
          {card.tags.slice(0, 2).map((tag) => (
            <CardTag key={tag.label} tag={tag} />
          ))}
        </View>
      )}

      {showTitle &&
        (mode === CardMode.Both ? (
          <Furigana
            isSingleLine
            text={card.title}
            typography={titleTypography}
            typographyFurigana={styles.furigana}
          />
        ) : (
          <Text numberOfLines={1} style={[styles.title, titleTypography]}>
            {card.titleWithoutFurigana}
          </Text>
        ))}

      {showSubtitle && (
        <Text numberOfLines={1} style={styles.subtitle}>
          {card.subtitleNoFurigana}
        </Text>
      )}
    </Pressable>
  );
};

interface KanjiTableProps {
  cards: Card[];
  cardWidth: number;
  columnsCount: number;
  preference: BoardPreference;
  revealedCardId: string | null;
  onPress: (card: Card) => void;
  onReveal: (card: Card) => void;
}

const KanjiTableComponent: React.FC<KanjiTableProps> = ({
  cards,
  cardWidth,
  columnsCount,
  preference,
  revealedCardId,
  onPress,
  onReveal,
}) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const cardHeight = getRowHeight(preference, columnsCount) - ROW_GAP;
  const titleTypography = getTitleTypography(columnsCount);

  return (
    <View style={styles.list}>
      {cards.map((card) => (
        <BoardCard
          key={card.id}
          card={card}
          width={cardWidth}
          height={cardHeight}
          preference={preference}
          titleTypography={titleTypography}
          isRevealed={card.id === revealedCardId}
          onPress={onPress}
          onReveal={onReveal}
        />
      ))}
    </View>
  );
};

export const KanjiTable = React.memo(KanjiTableComponent);

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    list: {
      gap: ROW_GAP,
      paddingLeft: 12,
      paddingRight: 12,
      marginBottom: ROW_GAP,

      flexDirection: "row",
      alignSelf: "stretch",
    },
    item: {
      backgroundColor: colors.BgPrimary,
      borderRadius: 12,

      padding: CARD_PADDING,

      justifyContent: "flex-end",
      overflow: "hidden",
    },
    itemRevealed: {
      backgroundColor: colors.BgLightGray,
    },
    tags: {
      position: "absolute",
      top: CARD_PADDING,
      left: CARD_PADDING,
      right: CARD_PADDING,

      flexDirection: "row",
      gap: 4,
      overflow: "hidden",
    },
    tagsRevealed: {
      opacity: 0.3,
    },
    furigana: {
      ...Typography.regularCaption,
      fontSize: 10,
      lineHeight: FURIGANA_LINE_HEIGHT,
    },
    title: {
      color: colors.TextPrimary,
    },
    subtitle: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
  });
