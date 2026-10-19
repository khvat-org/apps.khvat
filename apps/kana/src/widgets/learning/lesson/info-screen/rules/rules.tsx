import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { StyleSheet, Text, View } from "react-native";

import { parseString } from "../lib/parse-string";

type RulesProps = {
  rules: string[];
};

const Rules: React.FC<RulesProps> = ({ rules }) => {
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  return (
    <View style={styles.rules}>
      {rules.map((rule, idx) => (
        <View style={[styles.textContainer, idx === 0 ? { borderTopWidth: 0 } : {}]} key={rule}>
          <Text style={styles.text}>
            {idx + 1}. {parseString(rule)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Rules;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    rules: {
      width: "100%",
      flexDirection: "column",
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      borderColor: colors.BorderDefault,
    },
    textContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      borderTopWidth: 1,
      borderColor: colors.BorderDefault,
    },
    text: {
      color: colors.TextPrimary,
      ...Typography.regularDefault,
    },
  });
