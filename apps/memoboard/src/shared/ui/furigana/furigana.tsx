import React, { JSX } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { Text, View, StyleSheet, TextStyle } from "react-native";

interface StylesProps {
  typography?: TextStyle;
  typographyFurigana?: TextStyle;
}

interface FuriganaProps extends StylesProps {
  text: string;
  // * Без переноса строк: всё, что не влезло, обрезается (для карточек в сетке)
  isSingleLine?: boolean;
}

const Furigana: React.FC<FuriganaProps> = ({ text, typography, typographyFurigana, isSingleLine }) => {
  const { colors } = useThemeContext();

  if (!text) return null;

  const styles = makeStyles(colors, {
    typography: typography || Typography.H3,
    typographyFurigana: typographyFurigana || Typography.regularCaption,
  });

  const furiganaRegex = /(\p{Script=Han}+)\((.*?)\)/gu;

  let lastIndex = 0;
  const elements: JSX.Element[] = [];
  let match;

  const pushPlainText = (chunk: string, keyPrefix: string) => {
    // * В одну строку кусок текста не дробим по словам: пусть обрежется многоточием целиком
    if (isSingleLine) {
      elements.push(
        <Text key={keyPrefix} numberOfLines={1} style={[styles.regularText, styles.shrink]}>
          {chunk}
        </Text>,
      );
      return;
    }

    chunk.split(/(\s+)/).forEach((token, i) => {
      if (!token) return;
      elements.push(
        <Text key={`${keyPrefix}-${i}`} style={styles.regularText}>
          {token}
        </Text>,
      );
    });
  };

  while ((match = furiganaRegex.exec(text)) !== null) {
    const [fullMatch, kanji, furigana] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      pushPlainText(text.slice(lastIndex, startIndex), `text-${lastIndex}`);
    }

    elements.push(
      <View key={`furigana-${startIndex}`} style={styles.furiganaContainer}>
        <Text numberOfLines={isSingleLine ? 1 : undefined} style={styles.furiganaText}>
          {furigana}
        </Text>
        <Text numberOfLines={isSingleLine ? 1 : undefined} style={styles.kanjiText}>
          {kanji}
        </Text>
      </View>,
    );

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    pushPlainText(text.slice(lastIndex), `text-${lastIndex}`);
  }

  return <View style={[styles.container, isSingleLine && styles.singleLine]}>{elements}</View>;
};

const makeStyles = (colors: ColorsType, options: StylesProps) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-end",
    },
    singleLine: {
      flexWrap: "nowrap",
      overflow: "hidden",
    },
    shrink: {
      flexShrink: 1,
    },
    furiganaContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    kanjiText: {
      color: colors.TextPrimary,

      ...options.typography,
    },
    furiganaText: {
      color: colors.TextAccent,
      textAlign: "center",

      ...options.typographyFurigana,
    },
    regularText: {
      color: colors.TextPrimary,

      ...options.typography,
    },
  });

export default Furigana;
