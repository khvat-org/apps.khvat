import React, { useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePersistedState } from "@nihongo/core/shared/contexts/ui-state/ui-state-context";
import { extractKanji } from "@nihongo/core/shared/lib/kanji/extract-kanji";
import { Typography } from "@nihongo/core/shared/typography";
import Section from "@nihongo/core/shared/ui/section";
import { SelectionIcon, SelectionSlashIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { Card } from "@/shared/api/get-cards";
import { CardTag } from "@/shared/ui/card-tag/card-tag";
import Furigana from "@/shared/ui/furigana/furigana";

interface YetSeenProps {
  title: string;
  cards: Card[];
  openModal: (card: Card) => void;
}

const YetSeen: React.FC<YetSeenProps> = ({ title, cards, openModal }) => {
  const [showFurigana, setShowFurigana] = usePersistedState(
    "memoboard.card.yetSeen.furigana",
    true,
  );

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { t } = useTranslation();

  const yetSeenKanji = useMemo(
    () =>
      extractKanji(title)
        .filter((item, index, self) => index === self.findIndex((obj) => obj === item))
        .reduce<{ key: string; cards: Card[] }[]>((acc, kanji) => {
          const yetSeen = cards.filter(
            (item) => item.title.includes(kanji) && item.title !== title,
          );

          if (yetSeen.length > 0) {
            acc.push({ key: kanji, cards: yetSeen });
          }

          return acc;
        }, []),
    [title, cards],
  );

  const isFurigana = yetSeenKanji.some((section) =>
    section.cards.every((card) => card.title !== card.titleWithFurigana),
  );

  if (yetSeenKanji.length < 1) return null;

  return (
    <View style={styles.container}>
      <Section
        title={t("card.alreadySeen")}
        stateKey="memoboard.card.yetSeen.show"
        buttons={[
          isFurigana ? (
            <Pressable key={"eye_btn"} onPress={() => setShowFurigana((prev) => !prev)}>
              {showFurigana ? (
                <SelectionSlashIcon color={colors.TextSecondary} />
              ) : (
                <SelectionIcon color={colors.TextSecondary} />
              )}
            </Pressable>
          ) : (
            <></>
          ),
        ]}
      >
        {yetSeenKanji.map((group) => (
          <View key={group.key} style={styles.group}>
            <Text style={styles.groupLabel}>{group.key}</Text>

            <View style={styles.list}>
              {group.cards.map((card) => (
                <Pressable key={card.id} style={styles.item} onPress={() => openModal(card)}>
                  <View style={styles.itemInfo}>
                    {showFurigana ? (
                      <Furigana
                        text={card.title}
                        typography={Typography.regularDefault}
                        typographyFurigana={Typography.regularCaption}
                      />
                    ) : (
                      <Text style={styles.itemValue}>{card.titleWithoutFurigana}</Text>
                    )}
                    <Text style={styles.itemSubtitle}>{card.subtitleNoFurigana}</Text>
                  </View>

                  <View style={styles.itemTags}>
                    {card.tags.map((tag) => (
                      <CardTag key={tag.label} tag={tag} />
                    ))}
                    <CardTag tag={{ label: card.lessonTitle, color: "purple" }} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </Section>
    </View>
  );
};

export default YetSeen;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {},
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
    headerTitle: {
      ...Typography.boldDefault,
    },
    content: {
      flexDirection: "column",
      gap: 12,
    },
    group: {
      flexDirection: "column",
      gap: 6,
    },
    groupLabel: {
      color: colors.TextPrimary,
      ...Typography.H3,

      paddingTop: 4,
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
      gap: 6,
    },
    itemInfo: {
      flexDirection: "column",
    },
    itemValue: {
      color: colors.TextPrimary,
      ...Typography.regularDefault,
    },
    itemSubtitle: {
      color: colors.TextSecondary,
      ...Typography.regularLabel,
    },
    itemTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,

      marginBottom: 2,
    },
  });
