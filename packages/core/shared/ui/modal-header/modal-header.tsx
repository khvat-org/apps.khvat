import React from "react";

import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography";
import Button, { ButtonColor } from "../button";

interface ModalHeaderButton {
  onPress: () => void;
  text: string;
  color?: ButtonColor;
  textColor?: string;
  isDisabled?: boolean;
}

interface ModalHeaderProps {
  title: string;
  titleColor?: string;

  left?: ModalHeaderButton;
  right?: ModalHeaderButton;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ left, title, titleColor, right }) => {
  const insets = useSafeAreaInsets();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  return (
    <View
      style={[
        styles.header,
        {
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    >
      <Button
        color={left?.color ?? "secondary"}
        variant="text"
        isHapticFeedback={!!left}
        isDisabled={left?.isDisabled}
        text={left?.text}
        onClick={left?.onPress}
        style={[styles.button, { justifyContent: "flex-start" }]}
        textStyle={[styles.buttonText, left?.textColor ? { color: left.textColor } : {}]}
      />

      <Text style={[styles.title, titleColor && { color: titleColor }]}>{title}</Text>

      <Button
        color={right?.color ?? "primary"}
        variant="text"
        isDisabled={right?.isDisabled}
        text={right?.text}
        onClick={right?.onPress}
        style={[styles.button, { justifyContent: "flex-end" }]}
        textStyle={[styles.buttonText, right?.textColor ? { color: right.textColor } : {}]}
      />
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",

      height: 54,
    },
    title: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      ...Typography.boldDefault,
      color: colors.TextPrimary,

      left: 16,
    },
    button: {
      width: "40%",
      height: 50,
      zIndex: 9,
    },
    buttonText: {
      ...Typography.regularDefault,
    },
  });
