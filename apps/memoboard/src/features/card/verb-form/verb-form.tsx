import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePersistedState } from "@nihongo/core/shared/contexts/ui-state/ui-state-context";
import { removeFurigana } from "@nihongo/core/shared/lib/furigana/remove-furigana";
import { Typography } from "@nihongo/core/shared/typography";
import Section from "@nihongo/core/shared/ui/section";
import { SelectionIcon, SelectionSlashIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable, StyleSheet } from "react-native";

import getVerbForm from "@/shared/helpers/verb/get-verb-form";
import Furigana from "@/shared/ui/furigana/furigana";

const keyWord = "Глагол";

interface VerbFormProps {
  tags: string[];
  title: string;
}

const VerbForm: React.FC<VerbFormProps> = ({ tags, title }) => {
  const [showFurigana, isShowFurigana] = usePersistedState(
    "memoboard.card.verbForm.furigana",
    true,
  );

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { t } = useTranslation();

  const data = getVerbForm({ tags, title });

  const isFurigana = title !== removeFurigana(title);

  if (!tags.join(" ").toLowerCase().includes(`${keyWord} I`.toLowerCase())) return <View></View>;

  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Section
        title={t("verbForm.title")}
        stateKey="memoboard.card.verbForm.show"
        buttons={[
          isFurigana ? (
            <Pressable key={"eye_btn"} onPress={() => isShowFurigana((prev) => !prev)}>
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
        {data.map((item) => (
          <View key={item.label} style={styles.item}>
            <Text style={styles.itemLabel}>{t(item.label)}</Text>
            {!showFurigana && <Text style={styles.itemValue}>{removeFurigana(item.value)}</Text>}
            {showFurigana && (
              <Furigana
                typography={Typography.regularDefault}
                typographyFurigana={Typography.regularCaption}
                text={item.value}
              />
            )}
          </View>
        ))}
      </Section>
    </View>
  );
};

export default VerbForm;

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
      gap: 6,
    },
    title: {
      color: colors.TextPrimary,
    },
    label: {
      color: colors.TextPrimary,
      ...Typography.regularLabel,
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
