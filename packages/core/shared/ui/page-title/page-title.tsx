import React from "react";

import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography/index";

interface PageTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;

  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<TextStyle>;
  isSaveArea?: boolean;
  padded?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  children,
  icon,
  leftIcon,
  style = {},
  containerStyle = {},
  isSaveArea,
  padded,
}) => {
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const sidePadding = padded ? 16 : 0;

  return (
    <View
      style={[
        {
          backgroundColor: colors.transparent,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",

          paddingBottom: 16,
        },
        isSaveArea
          ? {
              paddingLeft: insets.left + sidePadding,
              paddingRight: insets.right + sidePadding,
              paddingTop: insets.top + 8,
            }
          : {
              paddingLeft: sidePadding,
              paddingRight: sidePadding,
              paddingTop: 8,
            },
        containerStyle,
      ]}
    >
      <View style={styles.line}>
        {leftIcon && leftIcon}

        <Text style={[styles.title, { color: colors.TextPrimary }, style]}>{children}</Text>
      </View>

      {icon && icon}
    </View>
  );
};

export default PageTitle;

const styles = StyleSheet.create({
  title: {
    ...Typography.H3,
  },

  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
