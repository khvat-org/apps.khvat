import React from "react";

import ThemeItem, { ThemeType } from "@nihongo/core/entities/setting/theme/theme-item";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { Theme, THEME_TITLES } from "@nihongo/core/shared/constants/theme";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import usePreviewSetting from "@nihongo/core/shared/lib/settings/usePreviewSetting";
import { blueOceanDarkTheme } from "@nihongo/core/shared/themes/blue_ocean";
import { blueOceanLightTheme } from "@nihongo/core/shared/themes/blue_ocean_light";
import { darkTheme } from "@nihongo/core/shared/themes/dark";
import { hokkaidoDarkTheme } from "@nihongo/core/shared/themes/hokkaido_dark";
import { hokkaidoLightTheme } from "@nihongo/core/shared/themes/hokkaido_light";
import { jiraiKeiDark } from "@nihongo/core/shared/themes/jirai_kei_dark";
import { lightTheme } from "@nihongo/core/shared/themes/light";
import { osakaDarkTheme } from "@nihongo/core/shared/themes/osaka_dark";
import { osakaLightTheme } from "@nihongo/core/shared/themes/osaka_light";
import { sakuraLightTheme } from "@nihongo/core/shared/themes/sakura_light";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsThemePage: React.FC = () => {
  const { t } = useTranslation();

  const { updateTheme } = useThemeContext();

  const { colors, themeString } = useThemeContext();

  const navigation = useNavigation();

  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  const { selected, select, isDirty, confirm, cancel } = usePreviewSetting<Theme>({
    current: themeString as Theme,
    preview: updateTheme,
  });

  const onDone = async () => {
    await confirm();
    navigation.goBack();
  };

  const onClose = () => {
    cancel();
    navigation.goBack();
  };

  const getIcon = (colors: ColorsType) => {
    return [colors.BgPrimary, colors.BgLightGray, colors.BgAccent];
  };

  const themeOptions = [
    {
      key: Theme.Light,
      type: ThemeType.Light,
      title: THEME_TITLES[Theme.Light],
      icon: getIcon(lightTheme),
    },
    {
      key: Theme.Dark,
      type: ThemeType.Dark,
      title: THEME_TITLES[Theme.Dark],
      icon: getIcon(darkTheme),
    },
    {
      key: Theme.OsakaLight,
      type: ThemeType.Light,
      title: THEME_TITLES[Theme.OsakaLight],
      icon: getIcon(osakaLightTheme),
    },
    {
      key: Theme.OsakaDark,
      type: ThemeType.Dark,
      title: THEME_TITLES[Theme.OsakaDark],
      icon: getIcon(osakaDarkTheme),
    },
    {
      key: Theme.HokkaidoLight,
      type: ThemeType.Light,
      title: THEME_TITLES[Theme.HokkaidoLight],
      icon: getIcon(hokkaidoLightTheme),
    },
    {
      key: Theme.HokkaidoDark,
      type: ThemeType.Dark,
      title: THEME_TITLES[Theme.HokkaidoDark],
      icon: getIcon(hokkaidoDarkTheme),
    },
    {
      key: Theme.SakuraLight,
      type: ThemeType.Light,
      title: THEME_TITLES[Theme.SakuraLight],
      icon: getIcon(sakuraLightTheme),
    },
    {
      key: Theme.JiraiKeiDark,
      type: ThemeType.Dark,
      title: THEME_TITLES[Theme.JiraiKeiDark],
      icon: getIcon(jiraiKeiDark),
    },
    {
      key: Theme.BlueOceanLight,
      type: ThemeType.Light,
      title: THEME_TITLES[Theme.BlueOceanLight],
      icon: getIcon(blueOceanLightTheme),
    },
    {
      key: Theme.BlueOceanDark,
      type: ThemeType.Dark,
      title: THEME_TITLES[Theme.BlueOceanDark],
      icon: getIcon(blueOceanDarkTheme),
    },
  ];

  return (
    <ModelContainer>
      <View style={{ flex: 1 }}>
        <ModalHeader
          title={t("settings.theme.title")}
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
          <Text style={styles.title}>{t("settings.theme.installed")}</Text>
          <View style={styles.list}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              data={themeOptions}
              extraData={selected}
              renderItem={({ item, index }) => (
                <ThemeItem
                  active={selected === item.key}
                  key={item.key}
                  name={item.title}
                  icon={item.icon}
                  author={"ui.taisia"}
                  type={item.type}
                  downloads={0}
                  screenshots={[]}
                  isOpen={false}
                  isLast={index >= themeOptions.length - 1}
                  onPress={() => select(item.key)}
                />
              )}
              keyExtractor={(item) => item.key.toString()}
            />
          </View>
        </View>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    content: {
      flexShrink: 1,
      width: "100%",
      maxWidth: TABLET_WIDTH + 36,
      alignSelf: "center",
      paddingHorizontal: 18,
    },
    title: {
      color: colors.TextPrimary,

      ...Typography.H4,

      marginVertical: 16,
    },
    list: {
      flexShrink: 1,
      overflow: "hidden",
    },
  });

export default SettingsThemePage;
