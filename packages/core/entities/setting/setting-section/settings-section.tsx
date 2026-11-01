import React, { ReactNode } from "react";

import { View } from "react-native";

import { TABLET_WIDTH } from "../../../shared/constants/sizes";
import { useThemeContext } from "../../../shared/contexts/theme/theme-context";

interface SettingSectionProps {
  children: ReactNode;
}

const SettingsSection: React.FC<SettingSectionProps> = ({ children }) => {
  const { colors } = useThemeContext();

  return (
    <View
      style={{
        width: "100%",

        flexDirection: "column",
        alignItems: "center",

        paddingHorizontal: 16,
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
