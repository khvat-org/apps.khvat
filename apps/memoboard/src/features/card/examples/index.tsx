import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePersistedState } from "@nihongo/core/shared/contexts/ui-state/ui-state-context";
import { Typography } from "@nihongo/core/shared/typography";
import Input from "@nihongo/core/shared/ui/input";
import Section from "@nihongo/core/shared/ui/section";
import {
  PlusCircleIcon,
  SelectionIcon,
  SelectionSlashIcon,
  TrashIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Pressable } from "react-native";

import { CardEdit } from "@/features/card/edit/use-card-edit";
import { Card, removeFurigana } from "@/shared/api/get-cards";
import Furigana from "@/shared/ui/furigana/furigana";

interface ExamplesProps {
  card: Card;
  edit: CardEdit;
}

const Examples: React.FC<ExamplesProps> = ({ card, edit }) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { t } = useTranslation();

  const [showFurigana, isShowFurigana] = usePersistedState(
    "memoboard.card.examples.furigana",
    true,
  );

  const examplesFurigana = card.examples.every((item) => item !== removeFurigana(item));

  if (edit.isEditing) {
    return (
      <Section
        title={t("card.examples")}
        stateKey="memoboard.card.examples.show"
        buttons={[
          <Pressable key={"add_btn"} onPress={edit.addExample}>
            <PlusCircleIcon color={colors.TextSecondary} />
          </Pressable>,
        ]}
      >
        <View style={styles.list}>
          {edit.examples.map((example, index) => (
            <View style={styles.row} key={index}>
              <View style={styles.input}>
                <Input
                  placeholder={t("card.examplePlaceholder")}
                  value={example}
                  onChange={(value) => edit.setExample(index, value)}
                />
              </View>

              <Pressable onPress={() => edit.removeExample(index)}>
                <TrashIcon color={colors.TextDanger} />
              </Pressable>
            </View>
          ))}
        </View>
      </Section>
    );
  }

  if (card.examples.length === 0) return null;

  return (
    <Section
      title={t("card.examples")}
      stateKey="memoboard.card.examples.show"
      buttons={[
        examplesFurigana ? (
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
      <View style={styles.list}>
        {card.examples.map((example) => (
          <View style={styles.item} key={example}>
            <Furigana
              text={showFurigana ? example : removeFurigana(example)}
              typography={Typography.regularDefault}
              typographyFurigana={Typography.regularCaption}
            />
          </View>
        ))}
      </View>
    </Section>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
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
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    input: {
      flex: 1,
    },
  });

export default Examples;
