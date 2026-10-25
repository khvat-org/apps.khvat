import React from "react";

import { PaintBrushIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import SettingItem from "../../../entities/setting/setting-item/setting-item";
import { getThemeTitle } from "../../../shared/constants/theme";
import { useThemeContext } from "../../../shared/contexts/theme/theme-context";

interface SettingsThemeProps {
  toThemeSettingPage: () => void;
}

const SettingsTheme: React.FC<SettingsThemeProps> = ({ toThemeSettingPage }) => {
  const { t } = useTranslation();
  const { themeString } = useThemeContext();
  const { colors } = useThemeContext();

  return (
    <SettingItem
      leftIcon={<PaintBrushIcon size={20} color={colors.BgContrast} />}
      text={t("settings.theme.title")}
      subText={getThemeTitle(themeString)}
      isLast
      onClick={toThemeSettingPage}
    />
  );
};

export default SettingsTheme;
