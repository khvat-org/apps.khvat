import React from "react";

import { View, Text, StyleSheet } from "react-native";

import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography";

interface TagProps {
  icon?: React.JSX.Element;
  text: string;

  height?: number;

  isUpperCase?: boolean;
  isLowerCase?: boolean;

  primary?: boolean;
  warning?: boolean;
}

const Tag: React.FC<TagProps> = ({
  text,
  icon,
  height,
  isUpperCase,
  isLowerCase,
  primary,
  warning,
}) => {
  const { colors } = useThemeContext();

  const styles = makeStyles(
    colors,
    isUpperCase || false,
    isLowerCase || false,
    primary || false,
    warning || false,
    height,
  );

  return (
    <View style={styles.tag}>
      {icon && <View>{icon}</View>}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const makeStyles = (
  colors: ColorsType,
  isUpperCase: boolean,
  isLowerCase: boolean,
  primary: boolean,
  warning: boolean,
  height?: number,
) =>
  StyleSheet.create({
    tag: {
      width: "auto",

      ...(height ? { height: height } : {}),

      borderRadius: 12,
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 2,
      paddingTop: 2,

      backgroundColor: warning
        ? colors.BgWarning
        : primary
          ? colors.BgDarkGray
          : colors.BgLightGray,

      flexDirection: "row",
      alignItems: "center",

      gap: 2,
    },
    text: {
      color: warning ? colors.TextWhite : primary ? colors.TextContrast : colors.TextPrimary,
      ...Typography.regularCaption,

      textTransform: isUpperCase ? "uppercase" : isLowerCase ? "lowercase" : "capitalize",
    },
  });

export default Tag;
