import React from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { BellIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { isAnyOn, useNotificationsState } from "./use-notifications-state";

interface SettingsNotificationsProps {
  goToNotificationsPage: () => void;
}

const SettingsNotifications: React.FC<SettingsNotificationsProps> = ({ goToNotificationsPage }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { state } = useNotificationsState();

  const subText = state
    ? t(isAnyOn(state) ? "settings.notifications.on" : "settings.notifications.off")
    : undefined;

  return (
    <SettingItem
      leftIcon={<BellIcon size={20} color={colors.BgContrast} />}
      text={t("settings.notifications.title")}
      subText={subText}
      onClick={goToNotificationsPage}
    />
  );
};

export default SettingsNotifications;
