import React from "react";

import LanguageItem from "@nihongo/core/entities/setting/language/language-item";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  Transliterations,
  useTransliterationsContext,
} from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { base, dakuon } from "@nihongo/core/shared/data/lettersTable";
import usePreviewSetting from "@nihongo/core/shared/lib/settings/usePreviewSetting";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsTransliterationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { transliterations, updateTransliterations } = useTransliterationsContext();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const { selected, select, isDirty, confirm, cancel } = usePreviewSetting<Transliterations>({
    current: transliterations,
    preview: updateTransliterations,
  });

  const onDone = async () => {
    await confirm();
    navigation.goBack();
  };

  const onClose = () => {
    cancel();
    navigation.goBack();
  };

  const transliterationSystems = [
    {
      key: Transliterations.HEP,
      title: t("transliterationSystems.hepburn"),
      tags: [t("transliterationSystems.tags.mostPopular")],
    },
    {
      key: Transliterations.KUN,
      title: t("transliterationSystems.kunreiShiki"),
      tags: [t("transliterationSystems.tags.officialJapan")],
    },
    {
      key: Transliterations.NIH,
      title: t("transliterationSystems.nihonShiki"),
      tags: [t("transliterationSystems.tags.strictest")],
    },
  ];

  const cyrillicTransliterationSystems = [
    {
      key: Transliterations.POL,
      title: t("transliterationSystems.polivanovSystem"),
      tags: [t("transliterationSystems.tags.russianStandard")],
    },
  ];

  return (
    <ModelContainer>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <ModalHeader
          title={t("transliterationSystems.romaji")}
          left={{
            text: t("alert.cancel"),
            onPress: onClose,
          }}
          right={{
            text: t("common.save"),
            onPress: () => isDirty && onDone(),
            color: isDirty ? colors.TextPrimary : colors.TextDisabled,
          }}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{t("transliterationSystems.latin")}</Text>
          <View style={styles.list}>
            {transliterationSystems.map((item, index) => (
              <LanguageItem
                key={item.key}
                tags={item.tags}
                transliteration={index}
                name={item.title}
                icons={[base[2][1], dakuon[2][2]]}
                onPress={() => select(item.key)}
                active={selected === item.key}
              />
            ))}
          </View>

          <Text style={[styles.title, styles.title_bottom]}>
            {t("transliterationSystems.cyrillic")}
          </Text>
          <View style={styles.list}>
            {cyrillicTransliterationSystems.map((item, index) => (
              <LanguageItem
                key={item.key}
                tags={item.tags}
                transliteration={3 + index}
                name={item.title}
                icons={[base[2][1], dakuon[2][2]]}
                onPress={() => select(item.key)}
                active={selected === item.key}
              />
            ))}
          </View>
        </View>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    content: {
      width: "100%",
      maxWidth: TABLET_WIDTH + 32,
      alignSelf: "center",
      paddingHorizontal: 16,
    },
    title: {
      color: colors.TextPrimary,

      ...Typography.H4,

      marginTop: 16,
      marginBottom: 16,
    },
    title_bottom: {
      marginTop: 32,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    list: {
      gap: 8,
      flexDirection: "column",
      overflow: "hidden",
    },
    item__text: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      lineHeight: 24,
    },
  });

export default SettingsTransliterationsPage;
