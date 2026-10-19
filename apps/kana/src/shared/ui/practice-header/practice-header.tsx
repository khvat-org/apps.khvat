import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { StyleSheet, Text, View } from "react-native";

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  return (
    <View>
      <Text style={styles.symbol}>{title}</Text>
      <Text style={styles.subText}>{subtitle}</Text>
    </View>
  );
};

export default Header;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    symbol: {
      ...Typography.H1,
      lineHeight: 114,
      textAlign: "center",
      color: colors.TextPrimary,
    },
    subText: {
      ...Typography.boldDefault,
      marginTop: 8,
      color: colors.TextSecondary,
      textAlign: "center",
    },
  });
