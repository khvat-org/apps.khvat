import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { useKanaContext } from "@/pages/kana/kana-table-choice-letters-page/model/hooks";

interface EducationKanaSelectedCardProps {
  onSelectKana: () => void;
}

const EducationKanaSelectedCard: React.FC<EducationKanaSelectedCardProps> = ({ onSelectKana }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { width } = useWindowDimensions();

  const styles = makeStyles(colors);

  const { selectedLettersHiragana, selectedLettersKatakana, selectedWords } = useKanaContext();

  const widthCard = width / 2 - 24;

  return (
    <View>
      <View style={styles.container}>
        <View style={[styles.content, { width: widthCard }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{selectedLettersHiragana + selectedLettersKatakana}</Text>
          </View>

          {selectedLettersHiragana + selectedLettersKatakana === 0 && (
            <Text style={styles.label}>{t("selectKana.nothingSelected")}</Text>
          )}

          {selectedLettersHiragana + selectedLettersKatakana !== 0 && (
            <Text style={styles.label}>{t("tabs.kana")}</Text>
          )}
        </View>

        <View style={[styles.content, { width: widthCard }]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {selectedWords.hiragana.length + selectedWords.katakana.length}
            </Text>
          </View>
          {selectedWords.hiragana.length + selectedWords.katakana.length === 0 && (
            <Text style={styles.label}>{t("selectKana.nothingSelected")}</Text>
          )}
          {selectedWords.hiragana.length + selectedWords.katakana.length !== 0 && (
            <Text style={styles.label}>{t("selectKana.words")}</Text>
          )}
        </View>
      </View>

      <Button
        color="primary"
        style={styles.btn}
        onClick={onSelectKana}
        text={t("selectKana.chooseKana")}
      />
    </View>
  );
};

export default EducationKanaSelectedCard;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
    },
    header: {
      display: "flex",
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
    },
    content: {
      borderRadius: 12,
      height: 84,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: 16,
      backgroundColor: colors.BgSecondary,
    },
    title: {
      ...Typography.H3,
      color: colors.TextPrimary,
    },
    label: {
      marginTop: 4,
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    btn: {
      marginTop: 16,
    },
  });
