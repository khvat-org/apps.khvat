import React, { useEffect } from "react";

import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { languageList, ShortLanguage } from "@nihongo/core/shared/constants/language";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import useSetLanguage from "@nihongo/core/shared/lib/i18n/hooks/useSetLanguage";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { Typography } from "@nihongo/core/shared/typography";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import CountryFlag from "react-native-country-flag";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import welcomeLogo from "../../shared/assets/app/icon.png";

type WelcomeNavigationProp = StackNavigationProp<AuthParamList, typeof AUTH_ROUTES.WELCOME>;

const WelcomePage: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();
  const { triggerHaptic } = useHaptic();

  const insets = useSafeAreaInsets();

  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, insets, pagePadding);
  const { t } = useTranslation();

  const { set } = useSetLanguage();

  const confirmLanguage = async (language: ShortLanguage) => {
    triggerHaptic();
    set(language);

    navigation.navigate(AUTH_ROUTES.PREVIEW);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

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
    <SafeLayout disableButton>
      <View style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} source={welcomeLogo} />
          <Text style={styles.title}>{t("common.welcome")}</Text>
        </View>

        <ScrollView
          style={styles.languageContainer}
          contentContainerStyle={styles.languageList}
          showsVerticalScrollIndicator={true}
        >
          {languageList.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.languageItem,
                { backgroundColor: pressed ? colors.BgLightGray : colors.BgPrimary },
              ]}
              onPress={() => confirmLanguage(item.key)}
            >
              <View
                style={[styles.languageView, { justifyContent: "space-between", width: "100%" }]}
              >
                <View style={styles.languageView}>
                  <CountryFlag
                    style={styles.languageFlag}
                    isoCode={getIsoCode(item.key)}
                    size={24}
                  />
                  <Text style={styles.languageTitle}>{item.title}</Text>
                </View>

                {item.key !== ShortLanguage.EN && item.key !== ShortLanguage.RU && (
                  <Text style={styles.textBeta}>βeta</Text>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeLayout>
  );
};

const makeStyles = (colors: ColorsType, insets: EdgeInsets, pagePadding: number) =>
  StyleSheet.create({
    page: {
      backgroundColor: colors.BgSecondary,
      width: "100%",
      height: "100%",
      flex: 1,
    },
    header: {
      backgroundColor: colors.BgPrimary,
      width: "100%",

      paddingTop: 32,
      paddingBottom: 32,

      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",

      gap: 16,

      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    title: {
      ...Typography.H3,
      textAlign: "center",
      color: colors.TextPrimary,
    },
    logo: {
      width: 96,
      height: 96,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.BorderDefault,
    },

    languageContainer: {
      flex: 1,
    },

    languageList: {
      width: "100%",
      maxWidth: TABLET_WIDTH + pagePadding * 2,
      alignSelf: "center",

      paddingTop: 16,
      paddingBottom: insets.bottom + 8,
      paddingLeft: pagePadding,
      paddingRight: pagePadding,
    },

    languageItem: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      padding: 12,
      borderRadius: 12,
      height: 56,
    },
    languageFlag: {
      borderRadius: 24,
      width: 24,
      height: 24,
    },
    languageView: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    languageTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      textAlignVertical: "center",
    },

    textBeta: {
      color: colors.TextPrimary,
    },
  });

export default WelcomePage;
