import React, { useEffect } from "react";

// * from packages/core

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import AccountActions from "@nihongo/core/features/settings/account-actions/account-actions";
import ContactSupport from "@nihongo/core/features/settings/contact-support/contact-support";
import DebugInfo from "@nihongo/core/features/settings/debug-info/debug-info";
import PrivacyPolicy from "@nihongo/core/features/settings/privacy-policy/privacy-policy";
import RemoveData from "@nihongo/core/features/settings/remove-data/remove-data";
import ReportLink from "@nihongo/core/features/settings/report-link/report-link";
import SettingsHaptic from "@nihongo/core/features/settings/settings-haptic/settings-haptic";
import SettingsLanguage from "@nihongo/core/features/settings/settings-language/settings-language";
import SettingsTheme from "@nihongo/core/features/settings/settings-theme/settings-theme";
import SettingsTransliterations from "@nihongo/core/features/settings/settings-transliterations/settings-language";
import SettingsWidgetsSection from "@nihongo/core/features/settings/settings-widgets/settings-widgets";
import StoreReviewLink from "@nihongo/core/features/settings/store-review-link/store-review-link";
import TermsAndConditions from "@nihongo/core/features/settings/terms-and-conditions/terms-and-conditions";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useIsLoggedIn } from "@nihongo/core/shared/lib/auth/use-is-logged-in";
import SideRailBackButton from "@nihongo/core/shared/ui/bottom-tap/side-rail-back-button";
import { useHasSideRailActions } from "@nihongo/core/shared/ui/bottom-tap/side-rail-insets-context";
import Button from "@nihongo/core/shared/ui/button";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon, PencilSimpleIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView } from "react-native";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import SettingsStatistics from "@/features/settings/settings-statistics/settings-statistics";

type NavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.SETTINGS_ROOT>;

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const isLoggedIn = useIsLoggedIn();

  const styles = makeStyles(colors);

  const hasSideBack = useHasSideRailActions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  return (
    <SafeLayout disableButton>
      <View style={styles.container}>
        <PageTitle
          padded
          leftIcon={
            hasSideBack ? undefined : (
              <Button
                color="primary"
                variant="text"
                isHapticFeedback
                icon={<CaretLeftIcon size={32} />}
                onClick={goBack}
              />
            )
          }
        >
          {t("tabs.settings")}
        </PageTitle>

        <ScrollView contentContainerStyle={styles.scroll}>
          {isLoggedIn === true && (
            <SettingsSection>
              <SettingItem
                leftIcon={<PencilSimpleIcon size={20} color={colors.BgContrast} />}
                text={t("profile.edit.title")}
                onClick={() => navigation.navigate(ROUTES.PROFILE_EDIT)}
                isLast
              />
            </SettingsSection>
          )}

          <SettingsSection>
            <SettingsStatistics />
            <SettingsHaptic />
            <SettingsTheme toThemeSettingPage={() => navigation.navigate(ROUTES.SETTINGS_THEME)} />
          </SettingsSection>

          <SettingsSection>
            <SettingsLanguage
              goToLanguageSettingsPage={() => navigation.navigate(ROUTES.SETTINGS_LANGUAGE)}
            />
            <SettingsTransliterations
              goToTransliterationsSettingsPage={() =>
                navigation.navigate(ROUTES.SETTINGS_TRANSLITERATION)
              }
            />
          </SettingsSection>

          <SettingsWidgetsSection
            toWidgetsSettingPage={() => navigation.navigate(ROUTES.SETTINGS_WIDGETS)}
          />

          <SettingsSection>
            <StoreReviewLink iosId="id6479753061" packageName={process.env.ANDROID_PACKAGE} />
            <ReportLink goToReportPage={() => navigation.navigate(ROUTES.SETTINGS_REPORT)} />
          </SettingsSection>

          <SettingsSection>
            <PrivacyPolicy app="nihon-go-kana" />
            <ContactSupport app="nihon-go-kana" />
            <TermsAndConditions app="nihon-go-kana" />
          </SettingsSection>

          <DebugInfo />

          {isLoggedIn !== null && (
            <SettingsSection>
              {isLoggedIn === true && <AccountActions />}
              {isLoggedIn === false && <RemoveData />}
            </SettingsSection>
          )}
        </ScrollView>
      </View>

      <SideRailBackButton onPress={goBack} />
    </SafeLayout>
  );
};

export default SettingsPage;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BgPrimary,
    },
    scroll: {
      gap: 16,
      paddingBottom: 32,
    },
    title: {
      marginLeft: 20,
    },
  });
