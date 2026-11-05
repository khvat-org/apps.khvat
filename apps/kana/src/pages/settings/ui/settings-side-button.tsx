import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import SideRailButton from "@nihongo/core/shared/ui/bottom-tap/side-rail-button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GearIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { RootStackParamList, ROUTES } from "@/app/routes.types";

const SettingsSideButton: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SideRailButton
      label={t("tabs.settings")}
      onPress={() => navigation.navigate(ROUTES.SETTINGS_ROOT)}
    >
      <GearIcon size={24} color={colors.TextPrimary} />
    </SideRailButton>
  );
};

export default SettingsSideButton;
