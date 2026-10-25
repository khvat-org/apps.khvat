import React, { JSX, ReactNode } from "react";

import { CaretCircleDownIcon, CaretCircleUpIcon } from "phosphor-react-native";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import { usePersistedState } from "../../contexts/ui-state/ui-state-context";
import { Typography } from "../../typography";

interface SectionProps {
  title: string;
  buttons?: JSX.Element[];

  stateKey?: string;

  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, buttons, stateKey, children }) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const [isShow, setIsShow] = usePersistedState(stateKey, true);

  return (
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => setIsShow((prev) => !prev)} style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>

          <View style={styles.buttons}>
            {buttons || []}
            <Pressable onPress={() => setIsShow((prev) => !prev)}>
              {isShow ? (
                <CaretCircleUpIcon color={colors.TextContrast} />
              ) : (
                <CaretCircleDownIcon color={colors.TextContrast} />
              )}
            </Pressable>
          </View>
        </Pressable>
      </View>

      {isShow && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
      marginBottom: 6,
    },
    buttons: {
      flexDirection: "row",
      gap: 8,
    },
    header: {
      backgroundColor: colors.BgContrast,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    headerTitle: {
      ...Typography.boldDefault,

      color: colors.TextContrast,
    },
    content: {
      flexDirection: "column",
      gap: 6,
    },
  });

export default Section;
