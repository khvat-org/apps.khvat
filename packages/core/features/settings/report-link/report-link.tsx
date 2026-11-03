import React from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { BugIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

interface ReportLinkProps {
  goToReportPage: () => void;
}

const ReportLink: React.FC<ReportLinkProps> = ({ goToReportPage }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  return (
    <SettingItem
      isLast
      leftIcon={<BugIcon size={20} color={colors.BgContrast} />}
      text={t("report.title")}
      onClick={goToReportPage}
    />
  );
};

export default ReportLink;
