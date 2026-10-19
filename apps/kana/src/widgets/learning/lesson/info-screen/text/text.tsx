import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { View, Text, StyleSheet } from "react-native";

import { parseString } from "../lib/parse-string";

type TextProps = {
  text: string;
};

const BlockText: React.FC<TextProps> = ({ text }) => {
  const { colors } = useThemeContext();

  return (
    <View>
      <Text style={[styles.blockText, { color: colors.TextPrimary }]}>{parseString(text)}</Text>
    </View>
  );
};

export default BlockText;

const styles = StyleSheet.create({
  blockText: {
    ...Typography.regularDefault,
  },
});
