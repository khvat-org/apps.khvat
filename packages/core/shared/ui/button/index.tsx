import React, { FC, ReactNode } from "react";

import {
  StyleSheet,
  Pressable,
  Text,
  DimensionValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import { useHaptic } from "../../contexts/haptic/haptic-context";
import { useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography";

export type ButtonColor = "primary" | "secondary" | "accent" | "success" | "danger";

interface ButtonProps {
  content?: ReactNode;

  text?: string;
  icon?: React.ReactElement<{ color?: string }>;

  color?: ButtonColor;
  variant?: "contained" | "text";
  size?: "md" | "sm";

  isDisabled?: boolean;
  isPressed?: boolean;

  width?: DimensionValue;
  isFullWidth?: boolean;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  children?: React.ReactElement;
  isHapticFeedback?: boolean;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  content,
  text,
  icon,

  isPressed,
  isDisabled,

  isHapticFeedback,
  onClick,
  children,

  color = "primary",
  variant = "contained",
  size = "md",

  width,
  isFullWidth,

  style,
  textStyle,
}) => {
  const { colors } = useThemeContext();

  const getTextColor = (isPressed: boolean | undefined) => {
    if (isDisabled) return colors.TextDisabled;

    if (color === "success") return colors.TextSuccess;
    if (color === "danger") return colors.TextDanger;

    if (color === "primary") return isPressed ? colors.TextPrimaryPressed : colors.TextPrimary;
    if (color === "secondary")
      return isPressed ? colors.TextSecondaryPressed : colors.TextSecondary;
    if (color === "accent") return isPressed ? colors.TextAccentPressed : colors.TextAccent;

    return "black";
  };

  const getColor = (isPressed: boolean | undefined) => {
    if (variant === "text") return [colors.transparent, getTextColor(isPressed)];

    if (isDisabled) return [colors.BgLightGray, colors.TextDisabled];

    if (color === "success") return [colors.BgSuccess, colors.TextWhite];
    if (color === "danger") return [colors.BgDanger, colors.TextWhite];

    if (color === "primary") {
      if (isPressed) return [colors.BgContrastPressed, colors.TextContrast];
      return [colors.BgContrast, colors.TextContrast];
    }

    if (color === "secondary") {
      if (isPressed) return [colors.BgLightGray, colors.TextPrimary];
      return [colors.BgSecondary, colors.TextPrimary];
    }

    if (color === "accent") {
      if (isPressed) return [colors.BgAccentPressed, colors.TextWhite];
      return [colors.BgAccent, colors.TextWhite];
    }

    return ["black", "black"];
  };

  const { triggerHaptic } = useHaptic();

  const onPress = () => {
    if (isDisabled) return;

    if (isHapticFeedback) {
      triggerHaptic();
    }

    onClick?.();
  };

  const getState = (pressed: boolean) => isPressed || (pressed && !isDisabled);

  const styles = makeStyles({
    size,
    width,
    isFullWidth,
    isText: variant === "text",
    isIcon: icon && !text && !content,
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getColor(getState(pressed))[0] },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {text && (
            <Text style={[styles.text, { color: getColor(getState(pressed))[1] }, textStyle]}>
              {text}
            </Text>
          )}
          {content && content}
          {icon && React.cloneElement(icon, { color: getColor(getState(pressed))[1] })}

          {children && children}
        </>
      )}
    </Pressable>
  );
};

const makeStyles = ({
  size,
  width,
  isFullWidth,
  isText,
  isIcon,
}: {
  size: "md" | "sm";
  width?: DimensionValue;
  isFullWidth?: boolean;
  isText?: boolean;
  isIcon?: boolean;
}) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,

      ...(size === "md"
        ? { height: 48, paddingHorizontal: 16, borderRadius: 12 }
        : { height: 32, paddingHorizontal: 12, borderRadius: 8 }),

      ...(isIcon
        ? size === "md"
          ? { width: 48, paddingHorizontal: 0, borderRadius: 12 }
          : { width: 32, paddingHorizontal: 0, borderRadius: 16 }
        : {}),

      ...(isText ? { height: "auto", width: "auto", paddingHorizontal: 0, borderRadius: 0 } : {}),

      ...(isFullWidth ? { flex: 1 } : width !== undefined ? { width } : {}),
    },
    text: {
      ...(size === "md" ? Typography.boldDefault : Typography.boldLabel),
    },
  });

export default Button;
