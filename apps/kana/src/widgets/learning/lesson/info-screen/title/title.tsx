import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { StyleSheet, Text, View } from "react-native";

type RulesProps = {
  title: string;
  subtitle: string;
};

const Title: React.FC<RulesProps> = ({ title, subtitle }: RulesProps) => {
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default Title;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    titleContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginBottom: 32,
    },
    title: {
      ...Typography.H3,
      color: colors.TextPrimary,
    },
    subtitle: {
      ...Typography.boldDefault,
      color: colors.TextSecondary,
    },
  });
