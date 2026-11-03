import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { StyleProp, Text, TextStyle } from "react-native";

interface LearningTitleProps {
  children: string;
  style?: StyleProp<TextStyle> | undefined;
}

export const LearningTitle: React.FC<LearningTitleProps> = ({ children, style }) => {
  const { colors } = useThemeContext();

  return (
    <Text
      style={[
        Typography.H4,
        {
          color: colors.TextPrimary,
          paddingBottom: 16,
          textAlign: "center",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
