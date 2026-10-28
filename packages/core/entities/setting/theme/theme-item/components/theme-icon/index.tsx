import React from "react";

import { View, StyleSheet } from "react-native";

import { ColorsType, useThemeContext } from "../../../../../../shared/contexts/theme/theme-context";

interface ThemeIconProps {
  colors: string[];
  active: boolean;
}

const ThemeIcon: React.FC<ThemeIconProps> = (props) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors, props.active);

  if (props.colors.length < 3) {
    return <View></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.half}>
        <View
          style={[styles.quarter, { backgroundColor: props.colors[0], borderTopLeftRadius: 24 }]}
        />
        <View
          style={[styles.quarter, { backgroundColor: props.colors[1], borderTopRightRadius: 24 }]}
        />
      </View>
      <View
        style={[
          styles.half,
          {
            backgroundColor: props.colors[2],
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        ]}
      />
    </View>
  );
};

const makeStyles = (colors: ColorsType, active: boolean) =>
  StyleSheet.create({
    container: {
      width: 48,
      height: 48,

      borderRadius: 48,
      borderWidth: 1,
      borderColor: active ? colors.BorderContrast : colors.BorderDefault,
      overflow: "hidden",
      flexDirection: "column",
      transform: [{ rotate: "315deg" }],
    },

    half: {
      height: "50%",
      flexDirection: "row",
    },

    quarter: {
      width: "50%",
    },
  });

export default ThemeIcon;
