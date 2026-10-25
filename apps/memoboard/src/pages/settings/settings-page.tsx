import React, { useEffect } from "react";

// * from packages/core

import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import AccountActions from "@nihongo/core/features/settings/account-actions/account-actions";
import ContactSupport from "@nihongo/core/features/settings/contact-support/contact-support";
import DebugInfo from "@nihongo/core/features/settings/debug-info/debug-info";
import PrivacyPolicy from "@nihongo/core/features/settings/privacy-policy/privacy-policy";
import SettingsHaptic from "@nihongo/core/features/settings/settings-haptic/settings-haptic";
import SettingsLanguage from "@nihongo/core/features/settings/settings-language/settings-language";
import SettingsTheme from "@nihongo/core/features/settings/settings-theme/settings-theme";
import SettingsWidgetsSection from "@nihongo/core/features/settings/settings-widgets/settings-widgets";
import TermsAndConditions from "@nihongo/core/features/settings/terms-and-conditions/terms-and-conditions";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import Button from "@nihongo/core/shared/ui/button";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView } from "react-native";

import { RootStackParamList, ROUTES } from "@/app/routes.types";

type NavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.SETTINGS_ROOT>;

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <PageTitle
        isSaveArea
        leftIcon={
          <Button
            color="primary"
            variant="text"
            isHapticFeedback
            icon={<CaretLeftIcon size={32} />}
            onClick={goBack}
          />
        }
      >
        {t("tabs.settings")}
      </PageTitle>

      <ScrollView contentContainerStyle={styles.scroll}>
        <SettingsSection>
          <SettingsHaptic />
          <SettingsTheme toThemeSettingPage={() => navigation.navigate(ROUTES.SETTINGS_THEME)} />
        </SettingsSection>

        <SettingsWidgetsSection
          toWidgetsSettingPage={() => navigation.navigate(ROUTES.SETTINGS_WIDGETS)}
        />

        <SettingsSection>
          <SettingsLanguage
            isLast
            goToLanguageSettingsPage={() => navigation.navigate(ROUTES.SETTINGS_LANGUAGE)}
          />
        </SettingsSection>

        <SettingsSection>
          <PrivacyPolicy app="memoboard" />
          <ContactSupport app="memoboard" />
          <TermsAndConditions app="memoboard" />
        </SettingsSection>

        <DebugInfo />

        <SettingsSection>
          <AccountActions />
        </SettingsSection>
      </ScrollView>
    </View>
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
