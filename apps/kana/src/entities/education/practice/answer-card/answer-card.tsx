import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import { Typography } from "@nihongo/core/shared/typography";
import { Pressable, Text } from "react-native";

interface AnswerCardProps {
  value: ILetter;
  children: string;

  questionId: string;

  width: number;

  redMarked: boolean;
  greenMarked: boolean;

  onClick?: (value: ILetter, questionId: string) => void;

  isDisable?: boolean;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  value,
  width,
  redMarked,
  greenMarked,
  children,
  isDisable,
  questionId,
  onClick,
}) => {
  const { colors } = useThemeContext();

  const cardBackground = (pressed?: boolean) => {
    if (!isDisable && pressed) {
      return colors.BgLightGray;
    }

    if (redMarked) {
      return colors.BgDanger;
    }

    if (greenMarked) {
      return colors.BgSuccess;
    }

    return colors.BgSecondary;
  };

  const textColor = redMarked || greenMarked ? colors.TextWhite : colors.TextPrimary;

  return (
    <Pressable
      onPress={() => onClick?.(value, questionId)}
      style={({ pressed }) => ({
        width: width,
        height: width,
        backgroundColor: cardBackground(pressed),
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <Text style={{ ...Typography.H3, color: textColor }}>{children}</Text>
    </Pressable>
  );
};

export default AnswerCard;
