import React, { ReactNode, useMemo } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { View, Pressable, StyleSheet } from "react-native";

interface SegmentedOption<T> {
  value: T;
  // * Иконка опции; color — цвет для активного/неактивного состояния
  render: (color: string) => ReactNode;
}

interface SegmentedControlProps<T> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function SegmentedControl<T>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { triggerHaptic } = useHaptic();

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isActive = option.value === value;

        return (
          <Pressable
            key={index}
            onPress={() => {
              if (isActive) return;

              triggerHaptic();
              onChange(option.value);
            }}
            style={[styles.option, isActive && styles.optionActive]}
          >
            {option.render(isActive ? colors.TextContrast : colors.TextSecondary)}
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 2,

      backgroundColor: colors.BgPrimary,
      borderRadius: 12,

      padding: 3,
    },
    option: {
      minWidth: 40,
      height: 36,
      paddingHorizontal: 6,

      borderRadius: 9,

      alignItems: "center",
      justifyContent: "center",
    },
    optionActive: {
      backgroundColor: colors.BgContrast,
    },
  });
