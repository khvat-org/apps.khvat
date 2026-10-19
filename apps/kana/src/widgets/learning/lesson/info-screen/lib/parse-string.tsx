import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { fonts } from "@nihongo/core/shared/typography";
import { Linking, Text } from "react-native";

const BoldText: React.FC<{ children: string }> = ({ children }) => {
  return <Text style={fonts.bold}>{children}</Text>;
};

const LinkText: React.FC<{ children: string; url: string }> = ({ children, url }) => {
  const { colors } = useThemeContext();

  return (
    <Text
      suppressHighlighting
      onPress={() => Linking.openURL(url).catch(() => {})}
      style={{ color: colors.TextAccent, textDecorationLine: "underline" }}
    >
      {children}
    </Text>
  );
};

// * Supports **bold** and [label](url) markdown
export const parseString = (input: string) => {
  const regex = /\*\*(.*?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;
  const parsedContent = [];

  for (const match of input.matchAll(regex)) {
    const [fullMatch, boldWord, linkLabel, linkUrl] = match;
    const startIndex = match.index;
    const beforeText = input.substring(lastIndex, startIndex);

    if (beforeText) {
      parsedContent.push(beforeText);
    }

    if (boldWord !== undefined) {
      parsedContent.push(<BoldText key={startIndex}>{boldWord}</BoldText>);
    } else {
      parsedContent.push(
        <LinkText key={startIndex} url={linkUrl}>
          {linkLabel}
        </LinkText>,
      );
    }

    lastIndex = startIndex + fullMatch.length;
  }

  const remainingText = input.substring(lastIndex);
  if (remainingText) {
    parsedContent.push(remainingText);
  }

  return parsedContent;
};
