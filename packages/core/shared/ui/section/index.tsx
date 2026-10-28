import React, { JSX, ReactNode } from "react";

import { CaretDownIcon, CaretUpIcon } from "phosphor-react-native";
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
            {buttons?.map((button, index) => (
              <React.Fragment key={index}>{button}</React.Fragment>
            ))}
            <Pressable onPress={() => setIsShow((prev) => !prev)}>
              {isShow ? (
                <CaretUpIcon size={20} color={colors.TextSecondary} />
              ) : (
                <CaretDownIcon size={20} color={colors.TextSecondary} />
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
      marginBottom: 32,
    },
    buttons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    header: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    headerTitle: {
      ...Typography.boldLabel,

      color: colors.TextPrimary,
    },
    content: {
      flexDirection: "column",
      gap: 6,
    },
  });

export default Section;
