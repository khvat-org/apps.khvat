import React, { ReactNode } from "react";

import { Pressable, StyleSheet } from "react-native";

import { useHaptic } from "../../contexts/haptic/haptic-context";
import { useThemeContext } from "../../contexts/theme/theme-context";

const SIZE = 48;

interface SideRailButtonProps {
  label: string;
  isDisabled?: boolean;
  onPress: () => void;
  children: ReactNode;
}

const SideRailButton: React.FC<SideRailButtonProps> = ({
  label,
  isDisabled,
  onPress,
  children,
}) => {
  const { colors } = useThemeContext();
  const { triggerHaptic } = useHaptic();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.BgLightGray : colors.BgSecondary },
      ]}
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SideRailButton;
