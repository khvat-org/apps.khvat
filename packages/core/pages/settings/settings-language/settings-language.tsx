import React, { useCallback } from "react";

import { languageList, ShortLanguage } from "@nihongo/core/shared/constants/language";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import useSetLanguage from "@nihongo/core/shared/lib/i18n/hooks/useSetLanguage";
import usePreviewSetting from "@nihongo/core/shared/lib/settings/usePreviewSetting";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FlatList, View, StyleSheet, Text, Pressable } from "react-native";
import CountryFlag from "react-native-country-flag";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ItemProps = {
  onPress: () => void;
  title: string;
  lang: string;
  colors: ColorsType;
  active: boolean;
};

const Item = ({ title, lang, colors, onPress, active }: ItemProps) => {
  const styles = makeStyles(colors);

  const getIsoCode = (key: ShortLanguage) => {
    if (key === ShortLanguage.EN) return "us";
    if (key === ShortLanguage.ES_ES) return "es";
    if (key === ShortLanguage.ES_MX) return "mx";
    if (key === ShortLanguage.PT_BR) return "br";
    if (key === ShortLanguage.PT_PT) return "pt";
    if (key === ShortLanguage.ko) return "kr";

    if (key === ShortLanguage.ZH_CN) return "cn";
    if (key === ShortLanguage.ZH_HK) return "hk";
    if (key === ShortLanguage.ZH_TW) return "tw";

    return key;
  };

  return (
    <Pressable onPress={onPress} style={active ? styles.item__active : styles.item}>
      <View style={styles.row}>
        <CountryFlag
          style={styles.languageFlag}
          isoCode={getIsoCode((lang || "") as ShortLanguage)}
          size={24}
        />
        <Text style={active ? styles.item__text_active : styles.item__text}>{title}</Text>
      </View>

      {lang !== ShortLanguage.EN && lang !== ShortLanguage.RU && (
        <Text style={active ? styles.beta__active : styles.beta}>βeta</Text>
      )}
    </Pressable>
  );
};

const SettingsLanguagePage: React.FC = () => {
  const navigation = useNavigation();

  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();

  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);

  const { set } = useSetLanguage();

  const previewLanguage = useCallback(
    (language: ShortLanguage) => {
      i18n.changeLanguage(language);
    },
    [i18n],
  );

  const { selected, select, isDirty, confirm, cancel } = usePreviewSetting<ShortLanguage>({
    current: i18n.language as ShortLanguage,
    preview: previewLanguage,
    commit: set,
  });

  const onDone = async () => {
    await confirm();
    navigation.goBack();
  };

  const onClose = () => {
    cancel();
    navigation.goBack();
  };

  return (
    <ModelContainer>
      <View style={{ flex: 1 }}>
        <ModalHeader
          title={t("settings.language")}
          left={{
            text: t("alert.cancel"),
            onPress: onClose,
          }}
          right={{
            text: t("common.save"),
            onPress: () => isDirty && onDone(),
            isDisabled: !isDirty,
          }}
        />

        <View style={styles.content}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={languageList}
            extraData={selected}
            renderItem={({ item }) => (
              <Item
                active={selected === item.key}
                onPress={() => select(item.key)}
                colors={colors}
                key={item.key}
                lang={item.key}
                title={item.title}
              />
            )}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    content: {
      flex: 1,
      width: "100%",
      maxWidth: TABLET_WIDTH + 32,
      alignSelf: "center",
      paddingHorizontal: 16,
    },
    item__active: {
      marginBottom: 8,
      borderRadius: 12,

      height: 56,

      paddingLeft: 16,
      paddingRight: 16,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      backgroundColor: colors.BgContrast,
    },
    item: {
      marginBottom: 8,
      borderRadius: 12,

      height: 56,

      paddingLeft: 16,
      paddingRight: 16,

      backgroundColor: colors.BgSecondary,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    row: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    beta: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
    },
    beta__active: {
      ...Typography.regularDefault,
      color: colors.TextContrast,
    },
    item__text: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      lineHeight: 24,
    },
    item__text_active: {
      ...Typography.boldDefault,
      color: colors.TextContrast,
      lineHeight: 24,
    },
    languageFlag: {
      borderRadius: 24,
      width: 24,
      height: 24,
    },
  });

export default SettingsLanguagePage;
