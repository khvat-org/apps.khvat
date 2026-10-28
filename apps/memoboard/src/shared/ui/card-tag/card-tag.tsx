import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { fonts } from "@nihongo/core/shared/typography";
import { Text, StyleSheet } from "react-native";

import { CardTag as CardTagType } from "@/shared/api/get-cards";
import { getTagPalette } from "@/shared/ui/card-tag/tag-colors";

interface CardTagProps {
  tag: CardTagType;
}

const CardTagComponent: React.FC<CardTagProps> = ({ tag }) => {
  const { colors } = useThemeContext();
  const palette = getTagPalette(tag.color, colors._theme);

  const isUpperCase = ["i", "ii", "iii"].includes(tag.label);

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.tag,
        {
          color: palette.color,
          backgroundColor: palette.background,
          borderColor: palette.borderColor,
          textTransform: isUpperCase ? "uppercase" : "capitalize",
        },
      ]}
    >
      {tag.label}
    </Text>
  );
};

export const CardTag = React.memo(CardTagComponent);

const styles = StyleSheet.create({
  tag: {
    ...fonts.medium,
    fontSize: 11,
    lineHeight: 14,

    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",

    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
