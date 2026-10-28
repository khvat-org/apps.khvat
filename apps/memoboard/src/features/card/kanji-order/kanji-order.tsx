import React, { useEffect, useMemo, useState } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { extractKanji } from "@nihongo/core/shared/lib/kanji/extract-kanji";
import { Typography } from "@nihongo/core/shared/typography";
import Section from "@nihongo/core/shared/ui/section";
import { useTranslation } from "react-i18next";
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from "react-native";

import { getKanji, Kanji } from "@/shared/api/get-kanji";
import { getKanjiAnimationUrl } from "@/shared/lib/kanji/get-kanji-animation-url";

interface KanjiOrderProps {
  title: string;
}

const KanjiOrder: React.FC<KanjiOrderProps> = ({ title }) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { t } = useTranslation();

  const kanjiList = useMemo(
    () => extractKanji(title).filter((item, index, self) => self.indexOf(item) === index),
    [title],
  );

  const [pickedKanji, setPickedKanji] = useState<string | null>(null);

  const selectedKanji = pickedKanji && kanjiList.includes(pickedKanji) ? pickedKanji : kanjiList[0];

  const [info, setInfo] = useState<Kanji | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [failedAnimations, setFailedAnimations] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedKanji) return;

    let isActive = true;

    setInfo(null);
    setIsLoading(true);

    getKanji(selectedKanji)
      .then((data) => {
        if (isActive) setInfo(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedKanji]);

  const rows = info
    ? [
        { label: t("card.kanjiLevel"), value: info.level },
        { label: t("card.kanjiDescription"), value: info.description },
        { label: t("card.kanjiRadicals"), value: info.radicals?.join("  ") },
        { label: t("card.kanjiElements"), value: info.elements?.join("  ") },
      ].filter((row) => row.value)
    : [];

  if (kanjiList.length < 1) return null;

  return (
    <View style={styles.container}>
      <Section title={t("card.kanjiOrder")} stateKey="memoboard.card.kanjiOrder.show">
        {kanjiList.length > 1 && (
          <View style={styles.tabs}>
            {kanjiList.map((kanji) => (
              <Pressable
                key={kanji}
                onPress={() => setPickedKanji(kanji)}
                style={[styles.tab, kanji === selectedKanji && styles.tabSelected]}
              >
                <Text style={[styles.tabLabel, kanji === selectedKanji && styles.tabLabelSelected]}>
                  {kanji}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {!failedAnimations.includes(selectedKanji) && (
          <View style={styles.animation}>
            <Image
              key={selectedKanji}
              source={{ uri: getKanjiAnimationUrl(selectedKanji) }}
              style={styles.image}
              resizeMode="contain"
              onError={() => setFailedAnimations((prev) => [...prev, selectedKanji])}
            />
          </View>
        )}

        {isLoading && <ActivityIndicator color={colors.TextSecondary} />}

        {rows.map((row) => (
          <View key={row.label} style={styles.item}>
            <Text style={styles.itemLabel}>{row.label}</Text>
            <Text style={styles.itemValue}>{row.value}</Text>
          </View>
        ))}
      </Section>
    </View>
  );
};

export default KanjiOrder;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {},
    tabs: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tab: {
      width: 56,
      height: 56,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: colors.BgSecondary,
      borderRadius: 12,
    },
    tabSelected: {
      backgroundColor: colors.BgAccent,
    },
    tabLabel: {
      color: colors.TextPrimary,
      ...Typography.H3,
    },
    tabLabelSelected: {
      color: colors.TextWhite,
    },
    animation: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 6,
      padding: 6,
    },
    image: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 4,
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
