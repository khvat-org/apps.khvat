import React, { ReactNode } from "react";

import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { View } from "react-native";

import { TABLET_WIDTH } from "../../../shared/constants/sizes";
import { useThemeContext } from "../../../shared/contexts/theme/theme-context";

interface SettingSectionProps {
  children: ReactNode;
}

const SettingsSection: React.FC<SettingSectionProps> = ({ children }) => {
  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();

  return (
    <View
      style={{
        width: "100%",

        flexDirection: "column",
        alignItems: "center",

        paddingHorizontal: pagePadding,
      }}
    >
      <View
        style={{
          width: "100%",

          maxWidth: TABLET_WIDTH,

          backgroundColor: colors.BgSecondary,
          borderRadius: 12,

          paddingLeft: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default SettingsSection;
